#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"

cd "$ROOT/rn"
npx expo export -p web

cd "$ROOT/cmd/deploy-web"
export SNAKE_WEB_DIST="${SNAKE_WEB_DIST:-$ROOT/rn/dist}"
go run .
