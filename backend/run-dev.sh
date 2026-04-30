#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"
VENV_BIN="${ROOT}/.venv/bin"
if [ ! -x "${VENV_BIN}/uvicorn" ]; then
  echo "Missing venv. Run: cd backend && python3 -m venv .venv && .venv/bin/pip install -r requirements.txt" >&2
  exit 1
fi
# Serve API + static UI; site root = repository root (..)
export NEXEARN_SITE_ROOT="${NEXEARN_SITE_ROOT:-$(cd .. && pwd)}"
export NEXEARN_DEBUG="${NEXEARN_DEBUG:-1}"
export NEXEARN_APP_ENV="${NEXEARN_APP_ENV:-development}"
"${VENV_BIN}/alembic" upgrade head
"${VENV_BIN}/python" "${ROOT}/scripts/seed_demo.py"
exec "${VENV_BIN}/uvicorn" app.main:app --reload --host 0.0.0.0 --port 8000
