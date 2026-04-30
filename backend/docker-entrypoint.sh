#!/bin/sh
set -e
export PYTHONPATH="${PYTHONPATH:-/srv/backend}"
cd /srv/backend
alembic -c /srv/backend/alembic.ini upgrade head
exec "$@"
