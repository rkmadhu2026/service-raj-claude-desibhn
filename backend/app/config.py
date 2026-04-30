from functools import lru_cache
from pathlib import Path
from typing import List

from pydantic import Field, field_validator, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


def _default_site_root() -> Path:
    # backend/app/config.py -> backend -> repo root
    return Path(__file__).resolve().parent.parent.parent


def _default_sqlite_url() -> str:
    db = Path(__file__).resolve().parent.parent / ".dev.db"
    return f"sqlite+aiosqlite:///{db.as_posix()}"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_prefix="NEXEARN_",
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_name: str = "NexEarn"
    app_env: str = Field(default="development", description="development | staging | production")
    debug: bool = Field(
        default=False,
        description="Enables /api/docs and verbose behavior; keep false in production",
    )
    log_level: str = "info"

    # Uvicorn / reverse proxy: strip prefix if mounted under subpath (optional)
    root_path: str = ""

    # Comma-separated origins; empty = no CORS (same-origin only)
    cors_origins: str = ""

    # e.g. "app.example.com,localhost" — empty disables TrustedHost check
    allowed_hosts: str = ""

    # Absolute path to static site (HTML, JSX, styles). Defaults to monorepo root.
    site_root: Path = Field(default_factory=_default_site_root)

    # Async SQLAlchemy — e.g. postgresql+asyncpg://user:pass@host:5432/db
    database_url: str = Field(
        default_factory=_default_sqlite_url,
    )

    jwt_secret: str = Field(
        default="dev-only-please-change-32char-min-in-prod-!!",
        min_length=32,
        description="Sign HS256 access tokens. Use a long random secret in production.",
    )
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 15
    refresh_token_expire_days: int = 30

    # Optional: revoke access JWTs by jti (logout / denylist)
    redis_url: str = ""

    @field_validator("site_root", mode="before")
    @classmethod
    def expand_site_root(cls, v: object) -> object:
        if v is None or v == "":
            return _default_site_root()
        return v

    @model_validator(mode="after")
    def _validate_production(self) -> "Settings":
        if self.is_production:
            if "sqlite" in self.database_url.lower():
                raise ValueError("NEXEARN_DATABASE_URL must be PostgreSQL in production")
        return self

    @property
    def cors_origin_list(self) -> List[str]:
        if not self.cors_origins.strip():
            return []
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]

    @property
    def is_production(self) -> bool:
        return self.app_env == "production"

    @property
    def allowed_host_list(self) -> List[str]:
        if not self.allowed_hosts.strip():
            return []
        return [h.strip() for h in self.allowed_hosts.split(",") if h.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
