from __future__ import annotations

import logging
from typing import Any, AsyncGenerator, Optional

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.pool import NullPool

from app.config import get_settings

logger = logging.getLogger("nexearn.db")

_engine: Any = None
_session_factory: Optional[async_sessionmaker[AsyncSession]] = None


def get_async_engine() -> Any:
    global _engine, _session_factory
    if _engine is not None:
        return _engine
    settings = get_settings()
    kwargs: dict = {"echo": settings.debug, "pool_pre_ping": True}
    if "sqlite" in settings.database_url:
        # SQLite in tests / dev: single file, avoid cross-thread issues with NullPool
        kwargs["connect_args"] = {"check_same_thread": False}
        kwargs["poolclass"] = NullPool
    _engine = create_async_engine(settings.database_url, **kwargs)
    _session_factory = async_sessionmaker(
        _engine,
        class_=AsyncSession,
        expire_on_commit=False,
        autoflush=False,
    )
    return _engine


def get_session_factory() -> async_sessionmaker[AsyncSession]:
    if _session_factory is None:
        get_async_engine()
    assert _session_factory is not None
    return _session_factory


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """FastAPI dependency: one transaction per request (commit/rollback in routes)."""
    fac = get_session_factory()
    async with fac() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


async def check_db() -> bool:
    try:
        eng = get_async_engine()
        async with eng.connect() as conn:
            await conn.execute(text("SELECT 1"))
        return True
    except Exception as e:
        logger.warning("db check failed: %s", e)
        return False


async def dispose_engine() -> None:
    global _engine, _session_factory
    if _engine is not None:
        await _engine.dispose()
    _engine = None
    _session_factory = None
