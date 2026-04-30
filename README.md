# NexEarn (solo demo)

Static React UI + FastAPI API in one repo. **No Vite** — open the app from the backend URL so `NexApi` and auth work (same origin).

## Quick start

1. **Python venv** (once), from `backend/`:

   ```bash
   cd backend
   python3 -m venv .venv
   .venv/bin/pip install -r requirements.txt
   ```

2. **Run** (migrations + optional demo user + server), from `backend/`:

   ```bash
   ./run-dev.sh
   ```

3. In the browser: **http://localhost:8000/**

## Demo login (after seed)

`run-dev.sh` runs an idempotent seed: if the user does not exist yet, it creates:

| Field    | Value              |
|----------|--------------------|
| Email    | `solo@nexearn.demo` |
| Password | `solo-demo!`        |

You can still **Sign up** any other email; login only works for accounts that exist in the DB (`backend/.dev.db` for default SQLite).

## If the browser says “connection refused”

The server is not running. Start `./run-dev.sh` again and keep that terminal open.

## More detail

See [CLAUDE.md](CLAUDE.md) for architecture and file layout.
