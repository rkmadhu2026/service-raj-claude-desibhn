# API + static UI + DB migrations. Build: docker build -f backend/Dockerfile -t nexearn-app .
# Requires NEXEARN_DATABASE_URL at runtime (e.g. Docker Compose with Postgres).

FROM python:3.12-slim-bookworm

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

WORKDIR /srv

RUN addgroup --system app && adduser --system --ingroup app app

COPY backend/requirements.txt /srv/backend/
RUN python -m pip install --upgrade pip && \
    pip install -r /srv/backend/requirements.txt

COPY backend/app /srv/backend/app
COPY backend/alembic /srv/backend/alembic
COPY backend/alembic.ini /srv/backend/alembic.ini
COPY backend/docker-entrypoint.sh /srv/backend/docker-entrypoint.sh
COPY . /srv/site

RUN chmod +x /srv/backend/docker-entrypoint.sh && chown -R app:app /srv && chmod -R a+rX /srv/site /srv/backend

USER app
WORKDIR /srv
ENV PYTHONPATH=/srv/backend \
    NEXEARN_SITE_ROOT=/srv/site \
    NEXEARN_APP_ENV=production \
    NEXEARN_DEBUG=0 \
    NEXEARN_LOG_LEVEL=info

EXPOSE 8000
ENTRYPOINT ["/srv/backend/docker-entrypoint.sh"]
CMD [ \
  "gunicorn", "app.main:app", \
  "--chdir", "/srv/backend", \
  "-k", "uvicorn.workers.UvicornWorker", \
  "-b", "0.0.0.0:8000", \
  "--workers", "2", \
  "--access-logfile", "-", \
  "--error-logfile", "-", \
  "--capture-output" \
]
