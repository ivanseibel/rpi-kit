# RPI Kit

This folder packages the RPI workflow artifacts so they can be copied into another repository.

## Kit Root

- Kit root: rpi-kit (copyable folder)

## How the RPI Workflow Is Implemented

This kit implements the RPI workflow primarily through **GitHub Copilot customization** (custom instructions, prompt entry points, and skills), backed by repo-local governance docs and CI validation.

What gets installed and how it works:

- **Global Copilot custom instructions:** `.github/copilot-instructions.md` provides the RPI constitution and the high-level “Research → Plan → Implement” rules.
- **Scoped instruction files (phase constraints):** `.github/instructions/*.instructions.md` uses `applyTo:` to enforce stricter rules for specific artifacts (for example, `.rpi/projects/**/research.md` and `.rpi/projects/**/plan.md`).
- **Prompt entry points:** `.github/prompts/rpikit.{research,plan,implement}.prompt.md` gives you `/rpikit.research`, `/rpikit.plan`, and `/rpikit.implement` in Copilot Chat as a consistent way to start each phase.
- **Copilot skills:** `.github/skills/**/SKILL.md` packages reusable “how to do X” playbooks that Copilot can load alongside instructions (for example, `rpi-workflow` for templates/validation guidance, plus any project-specific skills you want to ship with the kit).
- **VS Code wiring:** `.vscode/settings.json` enables instruction file loading (`github.copilot.chat.codeGeneration.useInstructionFiles`).
- **Governance + artifacts:** `.rpi/AGENTS.md` defines workflow roles, handoffs, and recursion rules for target repos; `.rpi/` holds docs, example projects, and helper scripts.
- **Kit-maintenance guidance (kit repo only):** `AGENTS.md`.
- **Validation automation:** `.github/workflows/rpi-validate.yml` checks that the required files and structure exist (instructions, prompts, skills, docs, governance) so the workflow remains consistent over time.

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
file:.github/copilot-instructions.md=overwrite
file:.vscode/settings.json=prompt
```

## Dependency Discovery

The installer copies the core kit roots and also scans instruction and skill markdown files for local link targets. Any referenced local paths found are added to the copy list if they exist in the kit. Rules:

- Absolute links like /path/to/file resolve from the target repo root.
- Relative links resolve from the referencing file directory.
- Links with http, https, mailto, or # anchors are ignored.

## Template Processing

Templates live in rpi-kit/templates and end with .rpi-template.md. Each template must include frontmatter with a target path and content markers.

Example:

```markdown
---
target: .github/copilot-instructions.md
---
<!-- RPI:START -->
RPI-only content
<!-- RPI:END -->
<!-- PROJECT:START -->
Project-specific content
<!-- PROJECT:END -->
```

During install, only the RPI section is written to the target file. Project-specific sections are omitted unless you customize the template handling.

## Notes

- The installer only copies the RPI kit artifacts and referenced dependencies.
- The kit includes validation workflow, instructions, prompts, skills, and RPI docs.
- The kit repository may contain example RPI projects under `.rpi/projects/`, but the installer intentionally does **not** copy anything under `.rpi/projects/` into target repositories.

## Local-Only Worktree Setup

This workflow installs Copilot scaffold files into a dedicated Git worktree without committing scaffold artifacts to the target repository.

### Problem and Goal

When you want RPI Copilot workflow support for a project, scaffold files are needed on disk (`.github/`, `.rpi/`, `.vscode/`). In some setups, you do not want those files committed or pushed.

Goal:

- Install scaffold files only in a dedicated local worktree.
- Keep those files out of commits by default.
- Block accidental commits even if files are force-added.

### Two Supported Flows

Use the helper script:

`./.rpi/scripts/rpi-worktree-copilot.sh`

#### Flow A: Create a New Scaffold Worktree

```bash
./.rpi/scripts/rpi-worktree-copilot.sh \
  --project /path/to/target-project \
  --worktree /path/to/target-project-rpi-copilot \
  --create-worktree \
  --ref HEAD \
  --mode skip
```

#### Flow B: Apply Scaffold to an Existing Worktree

```bash
./.rpi/scripts/rpi-worktree-copilot.sh \
  --project /path/to/target-project \
  --worktree /path/to/existing-worktree \
  --no-create-worktree \
  --mode skip
```

Dry-run is supported in both flows:

```bash
./.rpi/scripts/rpi-worktree-copilot.sh \
  --project /path/to/target-project \
  --worktree /path/to/target-project-rpi-copilot \
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
./.rpi/scripts/rpi-worktree-copilot.sh \
  --project /path/to/project \
  --worktree /path/to/project-rpi-copilot \
  --create-worktree
```

Create a new worktree from a specific branch and prompt on installer conflicts:

```bash
./.rpi/scripts/rpi-worktree-copilot.sh \
  --project /path/to/project \
  --worktree /path/to/project-rpi-copilot \
  --create-worktree \
  --ref main \
  --mode prompt
```

Apply scaffold and safety setup to an existing worktree:

```bash
./.rpi/scripts/rpi-worktree-copilot.sh \
  --project /path/to/project \
  --worktree /path/to/existing-worktree \
  --no-create-worktree \
  --mode skip
```

Preview actions without mutating anything:

```bash
./.rpi/scripts/rpi-worktree-copilot.sh \
  --project /path/to/project \
  --worktree /path/to/project-rpi-copilot \
  --create-worktree \
  --dry-run
```

Run from outside the kit repo by setting an explicit kit path:

```bash
/path/to/rpi-kit-vscode/.rpi/scripts/rpi-worktree-copilot.sh \
  --project /path/to/project \
  --worktree /path/to/project-rpi-copilot \
  --create-worktree \
  --kit /path/to/rpi-kit-vscode
```

### Verification Checklist

Run these checks in the scaffold worktree:

1. Scaffold files are hidden from status:
   - `git status --short`
2. Force-add and confirm commit is blocked:
   - `git add -f .github/copilot-instructions.md`
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

### Codex Adaptation Template

Apply the same mechanism in the Codex kit repository:

1. Install Codex scaffold into a dedicated worktree (`--target <worktree>`).
2. Write worktree-local excludes to a local ignore file and bind it with `core.excludesFile`.
3. Configure worktree-local `core.hooksPath` with a pre-commit guard.

Replace the Copilot scaffold path list with the Codex-specific list from the Codex kit `INVENTORY.md` before implementation.

Likely Codex prefixes to validate:

- `/.agents/skills/`
- `/.rpi/AGENTS.md`
- `/.rpi/docs/`
- `/.github/workflows/rpi-validate.yml`

Important:

- If any scaffold path is already tracked in the target repo, this local-only approach cannot prevent tracked-file diffs from appearing.

