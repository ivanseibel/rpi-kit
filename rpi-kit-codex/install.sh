#!/usr/bin/env sh

set -e

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js is required to run the installer." >&2
  exit 1
fi

exec node "$SCRIPT_DIR/install.js" "$@"
