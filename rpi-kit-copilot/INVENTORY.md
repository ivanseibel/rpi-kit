# RPI Kit Inventory

This inventory enumerates the required RPI workflow artifacts and their dependencies.

## Custom Instructions

- .github/copilot-instructions.md
- .github/instructions/plan.instructions.md
- .github/instructions/research.instructions.md

## Prompt Entry Points

- .github/prompts/rpikit.implement.prompt.md
- .github/prompts/rpikit.plan.prompt.md
- .github/prompts/rpikit.research.prompt.md

## Skills (with all subfolders)

- .github/skills/e2e-testing/
- .github/skills/github-mcp-issues/
- .github/skills/rpi-workflow/
- .github/skills/skill-manager/

## Governance

- .rpi/AGENTS.md

## Kit-Only Guidance (Not Installed to Targets)

- AGENTS.md

## VS Code Settings

- .vscode/settings.json

## Documentation

- .rpi/docs/

## Helper Scripts

- .rpi/scripts/check-vscode-load.sh
- .rpi/scripts/rpi-worktree-copilot.sh

## RPI Projects

- `.rpi/projects/` is intentionally excluded from installation into target repositories.
- This kit repository contains example projects under `.rpi/projects/` for development and demonstration only.
- In target repositories, `.rpi/projects/<project-id>/...` is created when you start a new project (for example via the `rpi-new.sh` scaffolder).

## Installer

- install.js
- install.sh
