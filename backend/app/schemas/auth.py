from __future__ import annotations

import uuid
from typing import Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class RegisterIn(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=200)
    tenant_name: str = Field(min_length=1, max_length=255)
    tenant_slug: Optional[str] = Field(
        default=None,
        min_length=1,
        max_length=64,
        description="URL-safe slug; generated from name if omitted",
    )


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    email: str
    tenant_id: uuid.UUID
    role: str
    is_active: bool


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    refresh_token: str


class RefreshIn(BaseModel):
    refresh_token: str = Field(min_length=10, max_length=2000)
