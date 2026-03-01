#!/usr/bin/env bash
set -euo pipefail

# rpi-kit installer wrapper
# Delegates to install.js — requires Node.js

if ! command -v node &>/dev/null; then
  echo "Error: Node.js is required but not found in PATH." >&2
  exit 1
fi

exec node "$(dirname "$0")/install.js" "$@"
