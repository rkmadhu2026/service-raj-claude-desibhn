"""refresh_tokens family_id for reuse detection

Revision ID: 0002
Revises: 0001
Create Date: 2025-04-26
"""
from __future__ import annotations

import sqlalchemy as sa
from alembic import op
from sqlalchemy import text
from sqlalchemy.types import Uuid

revision = "0002"
down_revision = "0001"
branch_labels = None
depends_on = None


def upgrade() -> None:
    bind = op.get_bind()
    dialect = bind.dialect.name
    op.add_column("refresh_tokens", sa.Column("family_id", Uuid(as_uuid=True), nullable=True))
    op.create_index("ix_refresh_tokens_family_id", "refresh_tokens", ["family_id"], unique=False)
    bind.execute(text("UPDATE refresh_tokens SET family_id = id WHERE family_id IS NULL"))
    if dialect == "sqlite":
        with op.batch_alter_table("refresh_tokens") as batch_op:
            batch_op.alter_column("family_id", existing_type=Uuid(as_uuid=True), nullable=False)
    else:
        op.alter_column(
            "refresh_tokens",
            "family_id",
            existing_type=Uuid(as_uuid=True),
            nullable=False,
            existing_nullable=True,
        )


def downgrade() -> None:
    op.drop_index("ix_refresh_tokens_family_id", table_name="refresh_tokens")
    op.drop_column("refresh_tokens", "family_id")
