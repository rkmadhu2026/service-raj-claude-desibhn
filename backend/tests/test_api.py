from __future__ import annotations

import os
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

REPO = Path(__file__).resolve().parent.parent.parent
os.environ["NEXEARN_SITE_ROOT"] = str(REPO)
os.environ["NEXEARN_DEBUG"] = "1"
os.environ["NEXEARN_APP_ENV"] = "development"

from app.config import get_settings  # noqa: E402

get_settings.cache_clear()
from app.main import create_app  # noqa: E402


@pytest.fixture
def client() -> TestClient:
    return TestClient(create_app())


def test_healthz(client: TestClient) -> None:
    r = client.get("/api/healthz")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"


def test_version(client: TestClient) -> None:
    r = client.get("/api/version")
    assert r.status_code == 200
    data = r.json()
    assert data["name"] == "nexearn-api"
    assert "version" in data
