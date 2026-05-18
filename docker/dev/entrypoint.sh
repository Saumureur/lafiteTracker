#!/bin/sh
set -e

WORKSPACE_ROOT="${WORKSPACE_ROOT:-/workspace}"

link_if_present() {
  source="${WORKSPACE_ROOT}/$1"
  dest="$2"

  if [ ! -e "$source" ]; then
    return 0
  fi

  mkdir -p "$(dirname "$dest")"
  rm -rf "$dest"
  ln -sfn "$source" "$dest"
}

case "${DEV_APP:-}" in
  api)
    link_if_present "apps/api/src" "/app/apps/api/src"
    link_if_present "apps/api/tsconfig.json" "/app/apps/api/tsconfig.json"
    link_if_present "apps/api/nest-cli.json" "/app/apps/api/nest-cli.json"
    link_if_present "apps/api/.env" "/app/apps/api/.env"
    ;;
  web)
    link_if_present "apps/web/src" "/app/apps/web/src"
    link_if_present "apps/web/index.html" "/app/apps/web/index.html"
    link_if_present "apps/web/vite.config.ts" "/app/apps/web/vite.config.ts"
    link_if_present "apps/web/tsconfig.json" "/app/apps/web/tsconfig.json"
    link_if_present "apps/web/tsconfig.node.json" "/app/apps/web/tsconfig.node.json"
    link_if_present "apps/web/.env" "/app/apps/web/.env"
    ;;
  *)
    echo "DEV_APP must be 'api' or 'web', got: ${DEV_APP:-<empty>}" >&2
    exit 1
    ;;
esac

exec "$@"
