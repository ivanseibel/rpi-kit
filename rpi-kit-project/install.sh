#!/bin/sh
# rpi-kit project installer shell wrapper
# Delegates to install.js — Node.js must be available.
set -e
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
node "$SCRIPT_DIR/install.js" "$@"
