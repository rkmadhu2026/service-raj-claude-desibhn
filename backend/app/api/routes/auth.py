from __future__ import annotations

import re
import uuid
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.core.redis_denylist import access_ttl_remaining_s, denylist_jti
from app.core.security import (
    create_access_token,
    decode_access_for_logout,
    hash_password,
    hash_token,
    new_refresh_value,
    verify_password,
)
from app.db.session import get_db
from app.deps import get_current_user
from app.models import RefreshToken, Tenant, User
from app.schemas.auth import RefreshIn, RegisterIn, TokenOut, UserOut

router = APIRouter(prefix="/auth", tags=["Auth"])


def _slugify(name: str) -> str:
    s = name.lower().strip()
    s = re.sub(r"[^a-z0-9]+", "-", s)
    s = s.strip("-")
    if not s:
        s = "workspace"
    return s[:64]


@router.post("/register", response_model=TokenOut, status_code=status.HTTP_201_CREATED)
async def register(data: RegisterIn, db: AsyncSession = Depends(get_db)) -> TokenOut:
    settings = get_settings()
    res = await db.execute(select(User).where(User.email == data.email.lower().strip()))
    if res.scalar_one_or_none() is not None:
        raise HTTPException(status_code=400, detail="Email already registered")

    slug = _slugify(data.tenant_slug or data.tenant_name)
    for _ in range(5):
        exist = await db.execute(select(Tenant).where(Tenant.slug == slug))
        if exist.scalar_one_or_none() is None:
            break
        slug = f"{_slugify(data.tenant_name)}-{uuid.uuid4().hex[:6]}"
    else:
        raise HTTPException(status_code=500, detail="Could not allocate tenant slug")

    tenant = Tenant(name=data.tenant_name, slug=slug)
    db.add(tenant)
    await db.flush()
    user = User(
        email=data.email.lower().strip(),
        password_hash=hash_password(data.password),
        tenant_id=tenant.id,
        role="admin",
    )
    db.add(user)
    await db.flush()

    fam = uuid.uuid4()
    raw_refresh = new_refresh_value()
    rt = RefreshToken(
        user_id=user.id,
        family_id=fam,
        token_hash=hash_token(raw_refresh),
        expires_at=datetime.now(timezone.utc) + timedelta(days=settings.refresh_token_expire_days),
    )
    db.add(rt)

    access = create_access_token(
        sub=str(user.id), tenant_id=str(tenant.id), role=user.role
    )
    return TokenOut(
        access_token=access,
        expires_in=settings.access_token_expire_minutes * 60,
        refresh_token=raw_refresh,
    )


@router.post("/token", response_model=TokenOut)
async def login(
    form: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db),
) -> TokenOut:
    """OAuth2 password flow — use email as `username` in the form."""
    settings = get_settings()
    res = await db.execute(select(User).where(User.email == form.username.lower().strip()))
    user = res.scalar_one_or_none()
    if not user or not verify_password(form.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account disabled")
    fam = uuid.uuid4()
    raw_refresh = new_refresh_value()
    rt = RefreshToken(
        user_id=user.id,
        family_id=fam,
        token_hash=hash_token(raw_refresh),
        expires_at=datetime.now(timezone.utc) + timedelta(days=settings.refresh_token_expire_days),
    )
    db.add(rt)
    access = create_access_token(
        sub=str(user.id), tenant_id=str(user.tenant_id), role=user.role
    )
    return TokenOut(
        access_token=access,
        expires_in=settings.access_token_expire_minutes * 60,
        refresh_token=raw_refresh,
    )


async def _revoke_entire_family(db: AsyncSession, family_id: uuid.UUID) -> None:
    await db.execute(
        update(RefreshToken)
        .where(RefreshToken.family_id == family_id)
        .where(RefreshToken.revoked_at.is_(None))
        .values(revoked_at=datetime.now(timezone.utc))
    )


@router.post("/refresh", response_model=TokenOut)
async def refresh(data: RefreshIn, db: AsyncSession = Depends(get_db)) -> TokenOut:
    settings = get_settings()
    h = hash_token(data.refresh_token)
    res = await db.execute(select(RefreshToken).where(RefreshToken.token_hash == h))
    row = res.scalar_one_or_none()
    now = datetime.now(timezone.utc)
    if not row:
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    if row.expires_at < now:
        raise HTTPException(status_code=401, detail="Refresh token expired")
    if row.revoked_at is not None:
        await _revoke_entire_family(db, row.family_id)
        raise HTTPException(
            status_code=401,
            detail="Refresh token reuse detected; session revoked",
        )

    ures = await db.execute(select(User).where(User.id == row.user_id))
    user = ures.scalar_one_or_none()
    if not user or not user.is_active:
        raise HTTPException(status_code=401, detail="User inactive")

    row.revoked_at = now
    raw_refresh = new_refresh_value()
    new_row = RefreshToken(
        user_id=user.id,
        family_id=row.family_id,
        token_hash=hash_token(raw_refresh),
        expires_at=now + timedelta(days=settings.refresh_token_expire_days),
    )
    db.add(new_row)
    access = create_access_token(
        sub=str(user.id), tenant_id=str(user.tenant_id), role=user.role
    )
    return TokenOut(
        access_token=access,
        expires_in=settings.access_token_expire_minutes * 60,
        refresh_token=raw_refresh,
    )


@router.get("/me", response_model=UserOut)
async def me(user: User = Depends(get_current_user)) -> User:
    return user


@router.post("/logout", status_code=status.HTTP_200_OK)
async def logout(
    request: Request, data: RefreshIn, db: AsyncSession = Depends(get_db)
) -> dict:
    h = hash_token(data.refresh_token)
    res = await db.execute(select(RefreshToken).where(RefreshToken.token_hash == h))
    row = res.scalar_one_or_none()
    if row and not row.revoked_at:
        row.revoked_at = datetime.now(timezone.utc)
    authz = request.headers.get("Authorization")
    if authz and authz.lower().startswith("bearer "):
        token = authz[7:].strip()
        try:
            p = decode_access_for_logout(token)
            if j := p.get("jti"):
                await denylist_jti(str(j), access_ttl_remaining_s(p))
        except Exception:
            pass
    return {"ok": True}
