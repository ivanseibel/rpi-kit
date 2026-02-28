# RPI Kit — Project Installer

Installs the minimal RPI footprint into a **target repository**.

Skills and VS Code settings are managed at user level — you only need to run
`rpi-kit-user/install.js` once. This installer handles per-project governance
and phase-artifact scaffolding.

## What Gets Installed

### Core (always)

| Artifact                 | Purpose                                                    |
| ------------------------ | ---------------------------------------------------------- |
| `.rpi/AGENTS.md`         | Agent governance: roles, handoff rules, recursion protocol |
| `.rpi/projects/.gitkeep` | Creates the projects directory, tracked by git             |

### With `--copilot`

| Artifact                          | Purpose                                            |
| --------------------------------- | -------------------------------------------------- |
| `.github/copilot-instructions.md` | RPI constitution for GitHub Copilot                |
| `.vscode/settings.json`           | Enables VS Code instruction files (only if absent) |

## Prerequisites

- Node.js ≥ 18
- User-level skills already installed (`rpi-kit-user/install.js` ran at least once)

## Usage

```sh
# Core only (works for Codex, Claude, and any AGENTS.md-aware agent)
node rpi-kit-project/install.js --target /path/to/your-project

# Core + GitHub Copilot artifacts
node rpi-kit-project/install.js --target /path/to/your-project --copilot

# Preview without writing anything
node rpi-kit-project/install.js --target /path/to/your-project --dry-run --copilot

# Overwrite existing files
node rpi-kit-project/install.js --target /path/to/your-project --mode overwrite
```

## After Installation

1. **Start a new RPI project** in the repository:

   ```sh
   # Using the rpi-workflow skill scaffolder
   # (requires user-level install)
   bash ~/.copilot/skills/rpi-workflow/scripts/rpi-new.sh "Project Title"
   # or via Codex:
   bash ~/.agents/skills/rpi-workflow/scripts/rpi-new.sh "Project Title"
   ```

2. **Commit the scaffolding:**

   ```sh
   git add .rpi/
   git commit -m "chore: add RPI project scaffolding"
   ```

3. **For Copilot users:** verify in VS Code via the Command Palette:
   `Copilot Chat: Show Customization Diagnostics`

## RPI Workflow Quick Start

| Phase     | Artifact created                           | Entry point                                         |
| --------- | ------------------------------------------ | --------------------------------------------------- |
| Research  | `.rpi/projects/<id>/research.md`           | `/rpikit.research` (Copilot) or rpi-workflow skill  |
| Plan      | `.rpi/projects/<id>/plan.md`               | `/rpikit.plan` (Copilot) or rpi-workflow skill      |
| Implement | source code + `.rpi/projects/<id>/SIGNOFF` | `/rpikit.implement` (Copilot) or rpi-workflow skill |

See `.rpi/AGENTS.md` in the installed project for full governance rules.
