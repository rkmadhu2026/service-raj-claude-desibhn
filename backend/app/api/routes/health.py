import time
from datetime import datetime, timezone
from typing import Any, Dict

from fastapi import APIRouter
from fastapi.responses import JSONResponse

from app import __version__
from app.db.session import check_db

_START = time.perf_counter()
router = APIRouter(tags=["Health"])


@router.get("/healthz")
def liveness() -> Dict[str, str]:
    """Process is up (Kubernetes liveness)."""
    return {"status": "ok"}


@router.get("/readyz")
async def readiness() -> Any:
    """Database reachable (Kubernetes readiness)."""
    if await check_db():
        return {"status": "ready", "db": "ok"}
    return JSONResponse(
        status_code=503,
        content={"status": "unready", "db": "down"},
    )


@router.get("/version")
def version() -> Dict[str, str]:
    return {
        "name": "nexearn-api",
        "version": __version__,
        "api": "0.1.0",
    }


@router.get("/meta")
def server_meta() -> Dict[str, Any]:
    return {
        "version": __version__,
        "uptime_seconds": round(time.perf_counter() - _START, 3),
        "time_utc": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
    }
