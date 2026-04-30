"""Convert async driver URLs to sync URLs for Alembic offline migrations."""


def to_sync_url(async_url: str) -> str:
    if async_url.startswith("postgresql+asyncpg"):
        return async_url.replace("postgresql+asyncpg://", "postgresql+psycopg://", 1)
    if async_url.startswith("sqlite+aiosqlite"):
        return async_url.replace("sqlite+aiosqlite", "sqlite", 1)
    return async_url
