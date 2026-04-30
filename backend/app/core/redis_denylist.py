from __future__ import annotations

import logging
import time
from typing import Optional

import redis.asyncio as redis
from redis.exceptions import RedisError

from app.config import get_settings

logger = logging.getLogger("nexearn.redis")
_client: Optional[redis.Redis] = None


def _get_client() -> Optional[redis.Redis]:
    global _client
    url = get_settings().redis_url.strip()
    if not url:
        return None
    if _client is None:
        _client = redis.from_url(url, decode_responses=True)
    return _client


async def close_redis() -> None:
    global _client
    if _client is not None:
        try:
            await _client.close()
        except Exception as e:
            logger.debug("redis close: %s", e)
    _client = None


async def denylist_jti(jti: str, ttl_sec: int) -> None:
    if ttl_sec <= 0:
        return
    r = _get_client()
    if not r or not jti:
        return
    key = f"njti:{jti}"
    try:
        await r.setex(key, int(min(ttl_sec, 604800)), "1")
    except (RedisError, OSError) as e:
        logger.warning("redis denylist set failed: %s", e)


async def is_jti_denylisted(jti: str) -> bool:
    r = _get_client()
    if not r or not jti:
        return False
    key = f"njti:{jti}"
    try:
        return bool(await r.exists(key))
    except (RedisError, OSError) as e:
        logger.warning("redis denylist get failed: %s", e)
    return False


def access_ttl_remaining_s(payload: dict) -> int:
    exp = int(payload.get("exp") or 0)
    now = int(time.time())
    return max(0, exp - now)
