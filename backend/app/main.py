"""
Production FastAPI app: /api (JSON) + static UI from repository root.
Run: uvicorn app.main:app --app-dir <path-to-backend> or set PYTHONPATH=backend
"""
from __future__ import annotations

import logging
import sys
from contextlib import asynccontextmanager
from typing import AsyncIterator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from starlette.middleware.trustedhost import TrustedHostMiddleware

from app import __version__
from app.api.routes import auth, health
from app.config import get_settings
from app.core.redis_denylist import close_redis
from app.db.session import dispose_engine

logger = logging.getLogger("nexearn")


@asynccontextmanager
async def lifespan(_app: FastAPI) -> AsyncIterator[None]:
    settings = get_settings()
    logging.basicConfig(
        level=getattr(logging, settings.log_level.upper(), logging.INFO),
        format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
        stream=sys.stdout,
    )
    if settings.is_production and settings.debug:
        logger.warning("Debug mode enabled in production; disable NEXEARN_DEBUG.")
    if not settings.site_root.is_dir():
        logger.error("NEXEARN_SITE_ROOT is not a directory: %s", settings.site_root)
    else:
        logger.info("Serving static from %s", settings.site_root.resolve())
    logger.info("NexEarn API v%s | env=%s", __version__, settings.app_env)
    yield
    await close_redis()
    await dispose_engine()
    get_settings.cache_clear()
    logger.info("Shutdown complete.")


def _build_sub_api(settings) -> FastAPI:
    # Mounted at /api — paths are /api/healthz, /api/version, etc.
    show_docs = settings.debug and not settings.is_production
    sub = FastAPI(
        title=f"{settings.app_name} API",
        version=__version__,
        docs_url="/docs" if show_docs else None,
        redoc_url="/redoc" if show_docs else None,
        openapi_url="/openapi.json" if show_docs else None,
    )
    sub.include_router(health.router, prefix="")
    sub.include_router(auth.router, prefix="")
    return sub


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(
        title=settings.app_name,
        version=__version__,
        lifespan=lifespan,
        root_path=settings.root_path,
        docs_url=None,
        redoc_url=None,
        openapi_url=None,
    )
    if settings.allowed_host_list:
        app.add_middleware(TrustedHostMiddleware, allowed_hosts=settings.allowed_host_list)
    if settings.cors_origin_list:
        app.add_middleware(
            CORSMiddleware,
            allow_origins=settings.cors_origin_list,
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )
    app.mount("/api", _build_sub_api(settings))
    app.mount(
        "/",
        StaticFiles(directory=str(settings.site_root), html=True),
        name="site",
    )
    return app


app = create_app()
