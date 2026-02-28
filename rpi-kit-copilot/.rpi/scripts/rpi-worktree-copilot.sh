#!/usr/bin/env sh

set -eu

usage() {
  cat <<'EOF'
Usage:
  rpi-worktree-copilot.sh --project <path> --worktree <path> [options]

Required:
  --project <path>           Path to target project Git repository
  --worktree <path>          Path to target worktree directory

Options:
  --create-worktree          Create a new worktree (default)
  --no-create-worktree       Use an existing worktree path
  --ref <git-ref>            Git ref for new worktree (default: HEAD)
  --mode <skip|overwrite|prompt>
                             Installer mode (default: skip)
  --dry-run                  Dry-run installer and setup output
  --kit <path>               Path to rpi-kit-vscode root (default: auto-detect)
  -h, --help                 Show this help
EOF
}

fail() {
  echo "Error: $*" >&2
  exit 1
}

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || fail "Required command not found: $1"
}

resolve_existing_dir_abs() {
  dir="$1"
  [ -d "$dir" ] || fail "Directory does not exist: $dir"
  (cd "$dir" && pwd -P)
}

resolve_parent_abs() {
  path="$1"
  parent=$(dirname "$path")
  [ -d "$parent" ] || fail "Parent directory does not exist: $parent"
  parent_abs=$(cd "$parent" && pwd -P)
  base=$(basename "$path")
  printf '%s/%s\n' "$parent_abs" "$base"
}

is_valid_mode() {
  case "$1" in
    skip|overwrite|prompt) return 0 ;;
    *) return 1 ;;
  esac
}

path_is_tracked() {
  repo="$1"
  spec="$2"
  if git -C "$repo" ls-files --error-unmatch -- "$spec" >/dev/null 2>&1; then
    return 0
  fi
  return 1
}

append_exclude_rule() {
  exclude_file="$1"
  rule="$2"
  if [ ! -f "$exclude_file" ]; then
    mkdir -p "$(dirname "$exclude_file")"
    : > "$exclude_file"
  fi
  if ! grep -Fqx "$rule" "$exclude_file" 2>/dev/null; then
    printf '%s\n' "$rule" >> "$exclude_file"
  fi
}

PROJECT=""
WORKTREE=""
CREATE_WORKTREE="true"
REF="HEAD"
MODE="skip"
DRY_RUN="false"
KIT=""

while [ "$#" -gt 0 ]; do
  case "$1" in
    --project)
      [ "$#" -ge 2 ] || fail "Missing value for --project"
      PROJECT="$2"
      shift 2
      ;;
    --worktree)
      [ "$#" -ge 2 ] || fail "Missing value for --worktree"
      WORKTREE="$2"
      shift 2
      ;;
    --create-worktree)
      CREATE_WORKTREE="true"
      shift
      ;;
    --no-create-worktree)
      CREATE_WORKTREE="false"
      shift
      ;;
    --ref)
      [ "$#" -ge 2 ] || fail "Missing value for --ref"
      REF="$2"
      shift 2
      ;;
    --mode)
      [ "$#" -ge 2 ] || fail "Missing value for --mode"
      MODE="$2"
      shift 2
      ;;
    --dry-run)
      DRY_RUN="true"
      shift
      ;;
    --kit)
      [ "$#" -ge 2 ] || fail "Missing value for --kit"
      KIT="$2"
      shift 2
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      fail "Unknown argument: $1"
      ;;
  esac
done

[ -n "$PROJECT" ] || fail "--project is required"
[ -n "$WORKTREE" ] || fail "--worktree is required"
is_valid_mode "$MODE" || fail "Invalid --mode: $MODE (expected skip|overwrite|prompt)"

require_cmd git
require_cmd node

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
if [ -z "$KIT" ]; then
  KIT=$(CDPATH= cd -- "$SCRIPT_DIR/../.." && pwd)
else
  KIT=$(resolve_existing_dir_abs "$KIT")
fi

[ -f "$KIT/install.js" ] || fail "install.js not found in kit root: $KIT"

PROJECT=$(resolve_existing_dir_abs "$PROJECT")
git -C "$PROJECT" rev-parse --is-inside-work-tree >/dev/null 2>&1 || fail "--project is not a Git repository: $PROJECT"

if [ "$CREATE_WORKTREE" = "true" ]; then
  WORKTREE=$(resolve_parent_abs "$WORKTREE")
  if [ -e "$WORKTREE" ]; then
    fail "--worktree already exists; use --no-create-worktree or choose a new path: $WORKTREE"
  fi
  echo "Creating worktree: $WORKTREE (ref: $REF)"
  git -C "$PROJECT" worktree add "$WORKTREE" "$REF"
else
  WORKTREE=$(resolve_existing_dir_abs "$WORKTREE")
  git -C "$WORKTREE" rev-parse --is-inside-work-tree >/dev/null 2>&1 || fail "--worktree is not a Git worktree: $WORKTREE"
  if ! git -C "$PROJECT" worktree list --porcelain | grep -Fqx "worktree $WORKTREE"; then
    fail "--worktree is not registered under --project: $WORKTREE"
  fi
fi

echo "Installing Copilot scaffold into worktree: $WORKTREE"
if [ "$DRY_RUN" = "true" ]; then
  node "$KIT/install.js" --target "$WORKTREE" --mode "$MODE" --dry-run
else
  node "$KIT/install.js" --target "$WORKTREE" --mode "$MODE"
fi

SCAFFOLD_CHECK_PATHS="
.github/copilot-instructions.md
.github/instructions
.github/prompts
.github/skills
.github/workflows/rpi-validate.yml
.vscode/settings.json
.rpi/AGENTS.md
.rpi/docs
.rpi/scripts/check-vscode-load.sh
.rpi/scripts/rpi-worktree-copilot.sh
"

TRACKED_CONFLICTS=""
for p in $SCAFFOLD_CHECK_PATHS; do
  if path_is_tracked "$WORKTREE" "$p"; then
    TRACKED_CONFLICTS="${TRACKED_CONFLICTS}${p}\n"
  fi
done

if [ -n "$TRACKED_CONFLICTS" ]; then
  echo "Tracked conflict detected in target worktree. Local-only ignore/hook cannot hide tracked files:" >&2
  printf '%b' "$TRACKED_CONFLICTS" >&2
  fail "Resolve tracked-path conflicts before using local-only scaffold setup."
fi

if [ "$DRY_RUN" = "true" ]; then
  echo "Dry-run: would update worktree-local exclude and pre-commit hook."
  exit 0
fi

EXCLUDE_FILE="$WORKTREE/.gitignore.rpi-local"

append_exclude_rule "$EXCLUDE_FILE" "/.github/copilot-instructions.md"
append_exclude_rule "$EXCLUDE_FILE" "/.github/instructions/"
append_exclude_rule "$EXCLUDE_FILE" "/.github/prompts/"
append_exclude_rule "$EXCLUDE_FILE" "/.github/skills/"
append_exclude_rule "$EXCLUDE_FILE" "/.github/workflows/rpi-validate.yml"
append_exclude_rule "$EXCLUDE_FILE" "/.vscode/settings.json"
append_exclude_rule "$EXCLUDE_FILE" "/.rpi/AGENTS.md"
append_exclude_rule "$EXCLUDE_FILE" "/.rpi/docs/"
append_exclude_rule "$EXCLUDE_FILE" "/.rpi/scripts/check-vscode-load.sh"
append_exclude_rule "$EXCLUDE_FILE" "/.rpi/scripts/rpi-worktree-copilot.sh"
append_exclude_rule "$EXCLUDE_FILE" "/.githooks/"
append_exclude_rule "$EXCLUDE_FILE" "/.gitignore.rpi-local"

HOOKS_DIR="$WORKTREE/.githooks"
HOOK_FILE="$HOOKS_DIR/pre-commit"
mkdir -p "$HOOKS_DIR"

cat > "$HOOK_FILE" <<'EOF'
#!/usr/bin/env sh

set -eu

staged="$(git diff --cached --name-only)"
[ -n "$staged" ] || exit 0

blocked=""
while IFS= read -r path; do
  [ -n "$path" ] || continue
  case "$path" in
    .github/copilot-instructions.md|\
    .github/instructions/*|\
    .github/prompts/*|\
    .github/skills/*|\
    .github/workflows/rpi-validate.yml|\
    .vscode/settings.json|\
    .rpi/AGENTS.md|\
    .rpi/docs/*|\
    .rpi/scripts/check-vscode-load.sh|\
    .rpi/scripts/rpi-worktree-copilot.sh|\
    .githooks/*|\
    .gitignore.rpi-local)
      blocked="${blocked}${path}\n"
      ;;
  esac
done <<EOF2
$staged
EOF2

if [ -n "$blocked" ]; then
  echo "Commit blocked: Copilot scaffold files are local-only in this worktree." >&2
  echo "Unstage with: git restore --staged <path>" >&2
  printf '%b' "$blocked" >&2
  exit 1
fi

exit 0
EOF

chmod +x "$HOOK_FILE"
git -C "$WORKTREE" config extensions.worktreeConfig true
git -C "$WORKTREE" config --worktree core.excludesFile "$EXCLUDE_FILE"
git -C "$WORKTREE" config --worktree core.hooksPath .githooks

cat <<EOF
Setup complete for worktree: $WORKTREE

Verification commands:
  git -C "$WORKTREE" status --short
  git -C "$WORKTREE" add -f .github/copilot-instructions.md
  git -C "$WORKTREE" commit -m "test guard"
EOF
