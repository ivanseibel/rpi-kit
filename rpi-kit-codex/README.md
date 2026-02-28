# RPI Kit — Codex Flavor (Legacy)

> **Deprecated.** This per-project installer is superseded by the user-level model.
> Use [`rpi-kit-user`](../rpi-kit-user/README.md) (once per user) and
> [`rpi-kit-project`](../rpi-kit-project/README.md) (once per repository) instead.
> This folder is kept for backward compatibility and will be removed in a future version.

This folder packages the RPI workflow artifacts so they can be copied into another repository.

## How the RPI workflow is implemented (Codex)

- This kit is designed to work with **Codex-style instruction discovery** using repository-backed artifacts.
- **Workflow governance (target repos):** `.rpi/AGENTS.md`.
- **Kit-maintenance guidance (kit repo only):** `AGENTS.md`.
- **Skills (on-demand workflows/resources):** `.agents/skills/<skill>/` (notably `.agents/skills/rpi-workflow/`).
- **Docs:** `.rpi/docs/` (start with `.rpi/docs/rpi-workflow.md`).
- **CI validation (kit repo only):** `.github/workflows/rpi-validate.yml` checks governance + skills and ensures legacy VS Code/Copilot instruction locations are not present. It is not installed into target repositories.

See `INVENTORY.md` for the complete list of shipped artifacts.

## Kit Root

- Kit root: rpi-kit (copyable folder)

## Install

```bash
node install.js --target /path/to/target
```

**Requirements by Platform:**

- **Linux**: Node.js 16+ (or newer) installed. Run directly:
  ```bash
  node install.js --target /path/to/target
  ```

- **macOS**: Node.js 16+ (or newer) installed:
  ```bash
  node install.js --target /path/to/target
  ```

- **Windows**: Node.js 16+ (or newer) installed:
  ```powershell
  node install.js --target C:\path\to\target
  ```

**Shell wrapper:**

If you prefer, you can also run the POSIX wrapper:

```bash
sh install.sh --target /path/to/target
```

### Options

- --target <path>   Target repository root (default: current directory)
- --mode <mode>     overwrite behavior: skip | overwrite | prompt (default: skip)
- --config <path>   optional config file with per-file overrides
- --dry-run         show planned file operations without writing

## Overwrite Modes

- skip: do not overwrite existing files
- overwrite: replace existing files
- prompt: ask per file on conflicts

## Config File

The config file is line-based key/value pairs:

```
# rpi-kit.config
# default mode for all files
default=skip

# per-file overrides
file:.rpi/AGENTS.md=overwrite
```

## Dependency Discovery

The installer copies the core kit roots and also scans skill and documentation markdown files for local link targets. Any referenced local paths found are added to the copy list if they exist in the kit. Rules:

- Absolute links like `/path/to/file` resolve from the kit root during scanning (and are installed into the target at the same relative path).
- Repo-root style links like `.agents/...` and `.rpi/...` resolve from the kit root during scanning.
- Relative links resolve from the referencing file directory.
- Links with http, https, mailto, or # anchors are ignored.

## Template Processing

Templates live in rpi-kit/templates and end with .rpi-template.md. Each template must include frontmatter with a target path and content markers.

Templates are optional.

## Notes

- The installer only copies the RPI kit artifacts and referenced dependencies.
- The kit installs workflow governance from `.rpi/AGENTS.md`, plus skills (`.agents/skills/`) and docs (`.rpi/docs/`).
- Root `AGENTS.md` is kit-only and is not installed to target repositories.
- `.rpi/scripts/` is excluded from installation into target repositories.
- `.github/workflows/` is excluded from installation into target repositories (including `.github/workflows/rpi-validate.yml`).
- `.rpi/projects/` is intentionally excluded from installation into target repositories.

## Local-Only Worktree Setup

This workflow installs Codex scaffold files into a dedicated Git worktree without committing scaffold artifacts to the target repository.

### Problem and Goal

When you want RPI Codex workflow support for a project, scaffold files are needed on disk (`.agents/`, `.rpi/`). In some setups, you do not want those files committed or pushed.

Goal:

- Install scaffold files only in a dedicated local worktree.
- Keep those files out of commits by default.
- Block accidental commits even if files are force-added.

### Two Supported Flows

Use the helper script (run from the kit checkout; it is not installed into target repositories):

`./.rpi/scripts/rpi-worktree-codex.sh`

#### Flow A: Create a New Scaffold Worktree

```bash
/path/to/rpi-kit-codex/.rpi/scripts/rpi-worktree-codex.sh \
  --project /path/to/target-project \
  --worktree /path/to/target-project-rpi-codex \
  --create-worktree \
  --ref HEAD \
  --mode skip
```

#### Flow B: Apply Scaffold to an Existing Worktree

```bash
/path/to/rpi-kit-codex/.rpi/scripts/rpi-worktree-codex.sh \
  --project /path/to/target-project \
  --worktree /path/to/existing-worktree \
  --no-create-worktree \
  --mode skip
```

Dry-run is supported in both flows:

```bash
/path/to/rpi-kit-codex/.rpi/scripts/rpi-worktree-codex.sh \
  --project /path/to/target-project \
  --worktree /path/to/target-project-rpi-codex \
  --create-worktree \
  --dry-run
```

### Safety Model

The script enforces local-only safety in two layers.

1. Worktree-local ignore rules:
   - It writes scaffold path rules into a local file at worktree root:
   - `.gitignore.rpi-local`
   - It sets worktree-local config:
   - `git config --worktree core.excludesFile <worktree>/.gitignore.rpi-local`
2. Worktree-local pre-commit guard:
   - It creates `.githooks/pre-commit` in the target worktree.
   - It configures `core.hooksPath` only for that worktree:
   - `git config --worktree core.hooksPath .githooks`

The pre-commit hook blocks commits if staged files match scaffold paths and prints unstaging guidance (`git restore --staged <path>`).

### Script Flags

- `--project <path>` required  
  Path to the main target repository that owns the worktree list. The script uses this repo to create/validate worktrees.
- `--worktree <path>` required  
  Directory where scaffold files are installed and local safety controls are configured.
- `--create-worktree` optional (default)  
  Tells the script to run `git worktree add` first, then install scaffold into the new worktree.
- `--no-create-worktree` optional  
  Skip creation and use an already-existing worktree. Use this for retrofitting safety/config onto a worktree you already have.
- `--ref <git-ref>` optional (default `HEAD`)  
  Git ref used only when creating a new worktree (branch, tag, or commit).
- `--mode <skip|overwrite|prompt>` optional (default `skip`)  
  Passed to `install.js` to control conflict behavior:
  - `skip`: keep existing files untouched (safest default)
  - `overwrite`: replace existing files
  - `prompt`: ask per conflict (interactive)
- `--dry-run` optional  
  Shows what would be installed/configured without writing files or Git config changes.
- `--kit <path>` optional  
  Path to this kit repository root (where `install.js` lives). Use when running the script from a copied location or wrapper.

### Flag Combination Examples

Create a new worktree from current `HEAD` with safe defaults:

```bash
/path/to/rpi-kit-codex/.rpi/scripts/rpi-worktree-codex.sh \
  --project /path/to/project \
  --worktree /path/to/project-rpi-codex \
  --create-worktree
```

Create a new worktree from a specific branch and prompt on installer conflicts:

```bash
/path/to/rpi-kit-codex/.rpi/scripts/rpi-worktree-codex.sh \
  --project /path/to/project \
  --worktree /path/to/project-rpi-codex \
  --create-worktree \
  --ref main \
  --mode prompt
```

Apply scaffold and safety setup to an existing worktree:

```bash
/path/to/rpi-kit-codex/.rpi/scripts/rpi-worktree-codex.sh \
  --project /path/to/project \
  --worktree /path/to/existing-worktree \
  --no-create-worktree \
  --mode skip
```

Preview actions without mutating anything:

```bash
/path/to/rpi-kit-codex/.rpi/scripts/rpi-worktree-codex.sh \
  --project /path/to/project \
  --worktree /path/to/project-rpi-codex \
  --create-worktree \
  --dry-run
```

Run from outside the kit repo by setting an explicit kit path:

```bash
/path/to/rpi-kit-codex/.rpi/scripts/rpi-worktree-codex.sh \
  --project /path/to/project \
  --worktree /path/to/project-rpi-codex \
  --create-worktree \
  --kit /path/to/rpi-kit-codex
```

### Verification Checklist

Run these checks in the scaffold worktree:

1. Scaffold files are hidden from status:
   - `git status --short`
2. Force-add and confirm commit is blocked:
   - `git add -f .agents/skills/rpi-workflow/SKILL.md`
   - `git commit -m "test guard"`
3. Confirm normal file commits still work:
   - stage and commit a non-scaffold file from the target project.

### Troubleshooting

#### Worktree path is rejected in existing-worktree mode

- Ensure `--worktree` is already registered under:
  - `git -C /path/to/target-project worktree list --porcelain`

#### Tracked conflict error appears

- The script fails if scaffold paths are already tracked in the target project worktree.
- Local exclude rules cannot hide tracked files.
- Resolution: skip/install selectively or use a different repo/workflow where scaffold paths are untracked.

#### Hook did not run

- Check worktree-local hook config:
  - `git -C /path/to/worktree config --worktree --get core.hooksPath`
- Confirm `.githooks/pre-commit` is executable.

#### Scaffold files still appear in status

- Check worktree-local ignore config:
  - `git -C /path/to/worktree config --worktree --get core.excludesFile`
- Ensure `.gitignore.rpi-local` exists in the worktree and includes scaffold paths.
