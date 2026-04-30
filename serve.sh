#!/usr/bin/env bash
# Static site: open http://localhost:8000/ (index) or NexEarn Platform.html
cd "$(dirname "$0")"
PORT="${1:-8000}"
echo "NexEarn: http://127.0.0.1:${PORT}/"
echo "Main app: http://127.0.0.1:${PORT}/NexEarn%20Platform.html"
exec python3 -m http.server "$PORT"
