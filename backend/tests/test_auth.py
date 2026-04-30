from __future__ import annotations

import asyncio
import os
import uuid
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

os.environ["NEXEARN_JWT_SECRET"] = "test-jwt-secret-min-32-chars-please-use-1"

import app.models  # noqa: F401, E402
from app.config import get_settings  # noqa: E402
from app.db.base import Base  # noqa: E402
from app.db.session import dispose_engine, get_async_engine  # noqa: E402
from app.main import create_app  # noqa: E402


async def _init_db() -> None:
    await dispose_engine()
    e = get_async_engine()
    async with e.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)


@pytest.fixture
def client(tmp_path: Path) -> TestClient:
    d = tmp_path / "a.db"
    os.environ["NEXEARN_DATABASE_URL"] = f"sqlite+aiosqlite:///{d.as_posix()}"
    get_settings.cache_clear()
    asyncio.run(_init_db())
    with TestClient(create_app()) as c:
        yield c
    asyncio.run(dispose_engine())
    get_settings.cache_clear()


def test_register_login_me(client: TestClient) -> None:
    r = client.post(
        "/api/auth/register",
        json={
            "email": f"u{uuid.uuid4().hex[:8]}@ex.com",
            "password": "hunter2000",
            "tenant_name": "Acme",
        },
    )
    assert r.status_code == 201, r.text
    data = r.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    r2 = client.get(
        "/api/auth/me",
        headers={"Authorization": f"Bearer {data['access_token']}"},
    )
    assert r2.status_code == 200, r2.text
    assert "@" in r2.json()["email"]


def test_oauth2_token(client: TestClient) -> None:
    email = f"t{uuid.uuid4().hex[:8]}@ex.com"
    assert (
        client.post(
            "/api/auth/register",
            json={"email": email, "password": "secret100", "tenant_name": "T"},
        ).status_code
        == 201
    )
    r = client.post(
        "/api/auth/token",
        data={"username": email, "password": "secret100"},
    )
    assert r.status_code == 200, r.text
    assert "access_token" in r.json()
