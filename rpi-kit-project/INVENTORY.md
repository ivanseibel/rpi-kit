# RPI Kit Project — Installation Inventory

## Core artifacts (always installed)

| Source           | Destination                       | Notes                                                                                          |
| ---------------- | --------------------------------- | ---------------------------------------------------------------------------------------------- |
| `.rpi/AGENTS.md` | `<target>/.rpi/AGENTS.md`         | Also auto-created by the `rpi-workflow` skill when missing; installer is an explicit fast-path |
| *(created)*      | `<target>/.rpi/projects/.gitkeep` | Also auto-created by the `rpi-workflow` skill when missing                                     |

## Copilot artifacts (`--copilot` flag)

| Source                                                           | Destination                                                        |
| ---------------------------------------------------------------- | ------------------------------------------------------------------ |
| `rpi-kit-copilot/templates/copilot-instructions.rpi-template.md` | `<target>/.github/copilot-instructions.md` (RPI section extracted) |
| `rpi-kit-copilot/.vscode/settings.json`                          | `<target>/.vscode/settings.json` (only if absent)                  |

## Not installed by this kit

| Artifact             | Why excluded                              | Where to get it                 |
| -------------------- | ----------------------------------------- | ------------------------------- |
| Skills               | User-level; shared across all projects    | `rpi-kit-user/install.js`       |
| VS Code prompts      | User-level; shared across all projects    | `rpi-kit-user/install.js`       |
| VS Code instructions | User-level; shared across all projects    | `rpi-kit-user/install.js`       |
| `.rpi/projects/*`    | Created per-RPI-session by the operator   | `rpi-workflow` skill scaffolder |
| CI workflow          | Kit-only validation; not for target repos | Kit `rpi-validate.yml`          |
