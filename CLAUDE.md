# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**NexEarn** is a high-fidelity UI prototype for a full-stack enterprise ITSM platform — a ServiceNow/Datadog/PagerDuty replacement. It is a multi-tenant platform covering ITSM (incidents, problems, changes), CMDB with on-prem infrastructure (firewalls, switches, physical servers, Windows servers, VMs, exporters, storage), service catalog, knowledge base, flow designer, reports, SLA management, and admin.

This is a **static prototype** — no build system, no bundler, no package manager. It runs directly in the browser via Babel standalone transpilation.

## How to Run

**Full stack (recommended)**: from `backend/` with a venv (`python3 -m venv .venv && .venv/bin/pip install -r requirements.txt` once), run `./run-dev.sh`. It runs Alembic, seeds an idempotent **solo demo** user (`solo@nexearn.demo` / `solo-demo!`), then Uvicorn on port **8000**. Open **http://127.0.0.1:8000/**. See **README.md** for a short checklist.

**Static-only (no API auth)**: open `NexEarn Platform.html` in a browser, or serve the repo root (JSX still loads, but `NexApi` login/register need the FastAPI origin):
```
./serve.sh          # convenience wrapper around python3 -m http.server 8000
npx serve .
# or
python3 -m http.server 8000
```

Docker: `docker compose up --build` (see `docker-compose.yml` and `backend/Dockerfile`).

**Database + auth (FastAPI)**: `backend/` includes SQLAlchemy 2 (async) + Alembic, JWT access/refresh, OAuth2 password flow. Frontend session helpers live in **`auth-api.jsx`** (`window.NexApi`).
- Migrations: `./run-dev.sh` runs `.venv/bin/alembic upgrade head`; or `cd backend && .venv/bin/alembic upgrade head`
- New migration: `cd backend && alembic revision --autogenerate -m "msg"` (model imports must be reachable via `app.db.base`)
- `POST /api/auth/register` (JSON) · `POST /api/auth/token` (form: `username` = email) · `GET /api/auth/me` (Bearer) · `POST /api/auth/refresh`
- All settings use the `NEXEARN_` env prefix (`NEXEARN_DATABASE_URL`, `NEXEARN_JWT_SECRET`, `NEXEARN_SITE_ROOT`, `NEXEARN_DEBUG`, `NEXEARN_APP_ENV`, `NEXEARN_CORS_ORIGINS`, `NEXEARN_ALLOWED_HOSTS`, `NEXEARN_REDIS_URL`). See `backend/.env.example`.

**Tests** (backend): `cd backend && pytest` (or `pytest tests/test_auth.py::test_name` for one). Requires `pip install -r requirements-dev.txt`. There is no frontend test suite.

Test fixture pattern: `NEXEARN_JWT_SECRET` must be set via `os.environ` **before** importing any `app.*` modules (import order matters). Each test that changes `NEXEARN_DATABASE_URL` must call `get_settings.cache_clear()` before and after to avoid cross-test state leakage. Tests spin up a temporary SQLite DB via `tmp_path`; the default dev DB is `backend/.dev.db`.

**Kubernetes**: manifests in `k8s/` (namespace, deployment, service, ingress) wired together via `kustomization.yaml` — apply with `kubectl apply -k k8s/`.

## Architecture

**No modules/imports** — all files use global `window` assignment (`Object.assign(window, {...})`) and are loaded as `<script type="text/babel">` tags in the HTML entry point. Script order in the HTML matters: dependencies must be loaded before consumers.

### Script load order (defined in `NexEarn Platform.html`):
1. `tweaks-panel.jsx` — Reusable tweaks/settings panel framework with host protocol for edit mode. Provides `useTweaks()` hook, `TweaksPanel`, and form controls (`TweakSlider`, `TweakRadio`, `TweakColor`, `TweakToggle`, `TweakSection`).
2. `data.jsx` — Core mock data: `ORG`, `TENANTS`, `USERS`, `INCIDENTS`, `TIMELINE_EVENTS`, `INTEGRATIONS`, etc.
3. `data-itsm.jsx` — Extended ITSM mock data: `PROBLEMS`, `CHANGES`, `CATALOG_CATEGORIES`, `CATALOG_ITEMS`, `CIS` (configuration items including on-prem infra), `ARTICLES`, `SLAS`.
4. `primitives.jsx` — Shared UI components: `Avatar`, `UserById`, `Sparkline`, `Pill`, `Sev`, `SLAIndicator`, `Gauge`, `AreaChart`, `BarChart`, `Heatmap`, `KPI`.
5. `shell.jsx` — App chrome: `Sidebar`, `Header`, `TenantSwitcher`, navigation config (`NAV`), breadcrumb logic.
6. `auth-api.jsx` — Frontend glue for the FastAPI auth endpoints (token storage, fetch wrappers).
7. `screens/*.jsx` — Individual page/screen components (one file per screen).
8. `app.jsx` — Root `<App>` component with client-side routing (simple state-based, not URL-based).

**Cache busting**: `<script>` tags in `NexEarn Platform.html` use `?v=N` query strings to bust the browser cache. Some scripts (e.g. `tweaks-panel.jsx`, `data-itsm.jsx`, `primitives.jsx`) currently lack a version suffix — when first editing one of those, **add `?v=1`** to its tag and increment on every subsequent edit. For scripts that already carry `?v=N`, bump the number on each edit.

**Adding a new screen**: create `screens/<name>.jsx`, register a `<script type="text/babel">` tag in `NexEarn Platform.html` (after `shell.jsx`), add a route entry in `NAV` in `shell.jsx`, and render it from the route switch in `app.jsx`. The screen component must attach itself via `Object.assign(window, { ScreenName })` — there are no ES imports.

### Key patterns
- **Routing**: State-based via `route`/`setRoute` — no URL router. Routes are string IDs matching the `NAV` config in `shell.jsx`.
- **Theming**: Controlled by the tweaks system. `TWEAK_DEFAULTS` is defined in the HTML `<script>` block (wrapped in `/*EDITMODE-BEGIN*/.../*EDITMODE-END*/` markers for external tooling). Tweaks set CSS custom properties and `data-*` attributes on `<body>`.
- **Dark mode**: Toggled via `data-theme="dark"` attribute. Dark theme CSS is at the bottom of `styles.css`.
- **Density**: Three modes (`compact`, `regular`, `comfy`) controlled via `data-density` attribute.
- **Sidebar variants**: `navy` (dark) or `light`, controlled via `data-sidebar` attribute.
- **CMDB data model**: `CIS` array in `data-itsm.jsx` contains both cloud services and on-prem infrastructure. On-prem CIs have extra fields: `vendor`, `model`, `ip`, `os`, `serial`, and type-specific fields (`cpu`, `ram`, `storage`, `role`, `host`, `vcpu`, `port`, `targets`, `capacity`).

### External dependencies (loaded via CDN)
- React 18.3.1 (UMD development build)
- ReactDOM 18.3.1
- Babel Standalone 7.29.0 (in-browser JSX transpilation)
- Font Awesome 6.4.0 (icons)
- Inter + JetBrains Mono (Google Fonts)

### Backend layout (`backend/app/`)
- `main.py` — `create_app()` builds the outer FastAPI, mounts a sub-app at `/api` (so route prefixes inside `app/api/routes/*.py` are root-relative), and mounts `StaticFiles` at `/` from `NEXEARN_SITE_ROOT` (the repo root). OpenAPI docs are only exposed when `NEXEARN_DEBUG=1` and not in production.
- `config.py` — Pydantic `Settings` (singleton via `get_settings()`). Always read settings through `get_settings()`, not by re-reading env.
- `api/routes/` — one router per concern (`health.py`, `auth.py`); register new routers in `_build_sub_api()`.
- `core/security.py` — JWT signing/verify and password hashing. `core/redis_denylist.py` — refresh-token revocation list (Redis optional; falls back to in-memory).
- `db/` — `session.py` (async engine + `get_session` dependency), `base.py` (declarative base; **import every model here so Alembic autogenerate can see them**), `url.py` (URL normalization for sync vs async drivers).
- `models/`, `schemas/` — SQLAlchemy ORM models and Pydantic DTOs respectively.

### File conventions
- `styles.css` is a single monolithic stylesheet (~1100 lines) using CSS custom properties throughout.
- The `uploads/` directory contains exported standalone HTML pages (self-contained versions of individual screens) — still under old "LinkedEye" branding. Treat as historical artifacts; do not edit unless asked.
- `LinkedEye Platform.html` is the previous-branded entry point — `NexEarn Platform.html` is the current one.
- The `scraps/` directory contains napkin sketch files.
- `index.html` is a tiny redirect/shim used by the static `Dockerfile` + `nginx.conf` deployment path; the FastAPI backend serves `NexEarn Platform.html` directly.
- One file can export multiple screen components: `reports.jsx` exports both `ReportsScreen` and `SLAScreen` (both registered in `app.jsx`).
- `screens/hr.jsx` and `screens/studio.jsx` exist but are **not** loaded in `NexEarn Platform.html` and have no route entries in `app.jsx` — they are WIP and invisible at runtime.
- `IntegrationsScreen` lives in `screens/integrations.jsx` (loaded before `app.jsx` in `NexEarn Platform.html`).
- `bcrypt` is pinned to `4.0.x` in `requirements.txt` because `passlib 1.7.4` breaks with `bcrypt 4.1+`; do not upgrade `bcrypt` until `passlib` is replaced.
