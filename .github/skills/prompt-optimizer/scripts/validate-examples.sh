#!/usr/bin/env bash
set -euo pipefail

# Lightweight checks for assets/prompt-examples.md formatting
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
EXAMPLES_FILE="$ROOT_DIR/assets/prompt-examples.md"

if [ ! -f "$EXAMPLES_FILE" ]; then
  echo "Missing examples file: $EXAMPLES_FILE" >&2
  exit 2
fi

echo "Validating $EXAMPLES_FILE"

# For each "Optimized (English):" line, make sure the next non-empty line exists and is not a header.
awk 'BEGIN{ok=1}
/^Optimized \(English\):/ {getline; while($0~/^$/){ if(!getline) break } if($0=="" || $0~/^#/){print "Invalid optimized output near line " NR; ok=0}} END{if(ok) print "Basic format checks passed"; exit ok?0:1}' "$EXAMPLES_FILE"

echo "Done."
