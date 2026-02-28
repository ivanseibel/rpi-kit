# RPI Kit User — Installation Inventory

This file documents every artifact installed by `install.js` and its destination.

## Skills

Installed for each configured agent (default: all three).

| Skill               | Source                      | Copilot dest                           | Codex dest                            | Claude dest                           |
| ------------------- | --------------------------- | -------------------------------------- | ------------------------------------- | ------------------------------------- |
| `rpi-workflow`      | `skills/rpi-workflow/`      | `~/.copilot/skills/rpi-workflow/`      | `~/.agents/skills/rpi-workflow/`      | `~/.claude/skills/rpi-workflow/`      |
| `e2e-testing`       | `skills/e2e-testing/`       | `~/.copilot/skills/e2e-testing/`       | `~/.agents/skills/e2e-testing/`       | `~/.claude/skills/e2e-testing/`       |
| `skill-manager`     | `skills/skill-manager/`     | `~/.copilot/skills/skill-manager/`     | `~/.agents/skills/skill-manager/`     | `~/.claude/skills/skill-manager/`     |
| `github-mcp-issues` | `skills/github-mcp-issues/` | `~/.copilot/skills/github-mcp-issues/` | `~/.agents/skills/github-mcp-issues/` | `~/.claude/skills/github-mcp-issues/` |

## VS Code (user-level)

| Artifact                      | Source                                  | Destination                               |
| ----------------------------- | --------------------------------------- | ----------------------------------------- |
| `rpikit.research.prompt.md`   | `rpi-kit-copilot/.github/prompts/`      | `{vscode-user}/prompts/`                  |
| `rpikit.plan.prompt.md`       | `rpi-kit-copilot/.github/prompts/`      | `{vscode-user}/prompts/`                  |
| `rpikit.implement.prompt.md`  | `rpi-kit-copilot/.github/prompts/`      | `{vscode-user}/prompts/`                  |
| `USAGE.md`                    | `rpi-kit-copilot/.github/prompts/`      | `{vscode-user}/prompts/`                  |
| `research.instructions.md`    | `rpi-kit-copilot/.github/instructions/` | `{vscode-user}/instructions/`             |
| `plan.instructions.md`        | `rpi-kit-copilot/.github/instructions/` | `{vscode-user}/instructions/`             |
| `useInstructionFiles` setting | —                                       | Merged into `{vscode-user}/settings.json` |

## Kit-Only (not installed)

| File           | Purpose                    |
| -------------- | -------------------------- |
| `install.js`   | This installer             |
| `install.sh`   | Shell wrapper              |
| `README.md`    | Usage documentation        |
| `INVENTORY.md` | This file                  |
| `AGENTS.md`    | Kit-maintenance governance |
