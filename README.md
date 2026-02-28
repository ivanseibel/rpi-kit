RPI Kit — Research → Plan → Implement
====================================

A toolkit that adds a disciplined Research → Plan → Implement (RPI) workflow
to any project, across multiple AI agents.

## Quick start (recommended — user-level model)

Skills and VS Code configuration are installed **once per user**, not per project.
Any project can then use them with a two-command setup.

```bash
# Step 1 — install skills and VS Code config (run once, globally)
node rpi-kit-user/install.js

# Step 2 — bootstrap a project (run in any target repository)
node rpi-kit-project/install.js --target /path/to/your-project

# … or with GitHub Copilot artifacts:
node rpi-kit-project/install.js --target /path/to/your-project --copilot
```

See [rpi-kit-user/README.md](rpi-kit-user/README.md) and
[rpi-kit-project/README.md](rpi-kit-project/README.md) for full options.

## What the user installer provides

| Artifact                              | Copilot                          | Codex               | Claude              |
| ------------------------------------- | -------------------------------- | ------------------- | ------------------- |
| `rpi-workflow` skill                  | `~/.copilot/skills/`             | `~/.agents/skills/` | `~/.claude/skills/` |
| `e2e-testing` skill                   | `~/.copilot/skills/`             | `~/.agents/skills/` | `~/.claude/skills/` |
| `skill-manager` skill                 | `~/.copilot/skills/`             | `~/.agents/skills/` | `~/.claude/skills/` |
| `github-mcp-issues` skill             | `~/.copilot/skills/`             | `~/.agents/skills/` | `~/.claude/skills/` |
| VS Code setting `useInstructionFiles` | merged into user `settings.json` | —                   | —                   |
| `/rpikit.*` prompts                   | VS Code user `prompts/`          | —                   | —                   |
| RPI phase instructions                | VS Code user `instructions/`     | —                   | —                   |

## What the project installer provides

| Artifact                          | Purpose                                                                                    |
| --------------------------------- | ------------------------------------------------------------------------------------------ |
| `.rpi/AGENTS.md`                  | Governance: roles, handoff rules, recursion protocol (also auto-bootstrapped by the skill) |
| `.rpi/projects/.gitkeep`          | Initialises the phase-artifacts directory (also auto-bootstrapped by the skill)            |
| `.github/copilot-instructions.md` | RPI constitution for Copilot (`--copilot`)                                                 |
| `.vscode/settings.json`           | Enables instruction files in VS Code (`--copilot`, only if absent)                         |

## Canonical skills source

All skills live in [`skills/`](skills/) at the root of this kit.
Both the user installer and the legacy per-project installers read from there
(the legacy installers still read from their own copies for backward compat).

## Key files

- [rpi-kit-user/INVENTORY.md](rpi-kit-user/INVENTORY.md) — full list of user-level destinations
- [rpi-kit-project/INVENTORY.md](rpi-kit-project/INVENTORY.md) — full list of per-project artifacts
- [skills/rpi-workflow/SKILL.md](skills/rpi-workflow/SKILL.md) — RPI workflow skill
- [rpi-kit-project/.rpi/AGENTS.md](rpi-kit-project/.rpi/AGENTS.md) — governance template

## Legacy per-project installers (deprecated)

> The flavors below still work but are superseded by the user-level model above.
> They will be removed in a future version.

- **`rpi-kit-copilot/`** — GitHub Copilot flavor (installs `.github/`, `.vscode/`, `.rpi/` per repo).
  See [rpi-kit-copilot/README.md](rpi-kit-copilot/README.md).
- **`rpi-kit-codex/`** — Codex/AGENTS.md flavor (installs `.agents/`, `.rpi/` per repo).
  See [rpi-kit-codex/README.md](rpi-kit-codex/README.md).

Migration: run the user installer once, then the project installer in each existing
repository. You can remove the legacy per-project skill directories afterwards.

## Contributing

See each module's `AGENTS.md` for kit-maintenance governance rules.

