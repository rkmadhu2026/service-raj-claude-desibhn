"""Solo-demo seed: one tenant + admin user (idempotent). See repo README."""
from __future__ import annotations

import asyncio
import sys
from pathlib import Path

_BACKEND = Path(__file__).resolve().parent.parent
if str(_BACKEND) not in sys.path:
    sys.path.insert(0, str(_BACKEND))

from sqlalchemy import select

from app.core.security import hash_password
from app.db.session import get_session_factory
from app.models import Tenant, User

DEMO_EMAIL = "solo@nexearn.demo"
DEMO_PASSWORD = "solo-demo!"
DEMO_TENANT_NAME = "Solo Demo"
DEMO_SLUG = "solo-demo"


async def _run() -> None:
    fac = get_session_factory()
    async with fac() as session:
        existing = await session.execute(select(User).where(User.email == DEMO_EMAIL.lower()))
        if existing.scalar_one_or_none() is not None:
            print(f"seed_demo: skip — {DEMO_EMAIL} already exists")
            return

        tres = await session.execute(select(Tenant).where(Tenant.slug == DEMO_SLUG))
        tenant = tres.scalar_one_or_none()
        if tenant is None:
            tenant = Tenant(name=DEMO_TENANT_NAME, slug=DEMO_SLUG)
            session.add(tenant)
            await session.flush()

        session.add(
            User(
                email=DEMO_EMAIL.lower(),
                password_hash=hash_password(DEMO_PASSWORD),
                tenant_id=tenant.id,
                role="admin",
            )
        )
        await session.commit()
    print(f"seed_demo: OK — sign in as {DEMO_EMAIL} / {DEMO_PASSWORD}")


def main() -> None:
    asyncio.run(_run())


if __name__ == "__main__":
    main()
