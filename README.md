RPI Kit — Research → Plan → Implement
====================================

A toolkit that adds a disciplined Research → Plan → Implement (RPI) workflow
to any project, across multiple AI agents.

## Quick start

Skills and VS Code configuration are installed **once per user**, not per project.
From then on, any project is ready to use RPI — no per-project setup required.

```bash
# Install skills and VS Code config (run once, globally)
node rpi-kit-user/install.js
```

See [rpi-kit-user/README.md](rpi-kit-user/README.md) for full options.

> **`.rpi/` bootstrap:** the `rpi-workflow` skill automatically creates `.rpi/AGENTS.md`
> and `.rpi/projects/` in any repository the first time it is invoked, using its
> bundled [governance template](skills/rpi-workflow/resources/agents-md-template.md).

## What the user installer provides

| Artifact                              | Copilot                          | Codex               | Claude              |
| ------------------------------------- | -------------------------------- | ------------------- | ------------------- |
| `rpi-workflow` skill                  | `~/.copilot/skills/`             | `~/.agents/skills/` | `~/.claude/skills/` |
| `e2e-testing` skill                   | `~/.copilot/skills/`             | `~/.agents/skills/` | `~/.claude/skills/` |
| `skill-manager` skill                 | `~/.copilot/skills/`             | `~/.agents/skills/` | `~/.claude/skills/` |
| `github-mcp-issues` skill             | `~/.copilot/skills/`             | `~/.agents/skills/` | `~/.claude/skills/` |
| VS Code setting `useInstructionFiles` | merged into user `settings.json` | —                   | —                   |
| VS Code setting `chat.promptFiles`    | merged into user `settings.json` | —                   | —                   |
| `/rpikit.*` prompts                   | VS Code user `prompts/`          | —                   | —                   |
| RPI phase instructions                | VS Code user `instructions/`     | —                   | —                   |

## Canonical skills source

All skills live in [`skills/`](skills/) at the root of this kit.
Both the user installer and the legacy per-project installers read from there
(the legacy installers still read from their own copies for backward compat).

## Key files

- [rpi-kit-user/INVENTORY.md](rpi-kit-user/INVENTORY.md) — full list of user-level destinations
- [skills/rpi-workflow/SKILL.md](skills/rpi-workflow/SKILL.md) — RPI workflow skill
- [skills/rpi-workflow/resources/agents-md-template.md](skills/rpi-workflow/resources/agents-md-template.md) — governance template (auto-deployed by the skill)

## Legacy per-project installers (deprecated)

> The flavors below still work but are superseded by the user-level model above.
> They will be removed in a future version.

- **`rpi-kit-copilot/`** — GitHub Copilot flavor (installs `.github/`, `.vscode/`, `.rpi/` per repo).
  See [rpi-kit-copilot/README.md](rpi-kit-copilot/README.md).
- **`rpi-kit-codex/`** — Codex/AGENTS.md flavor (installs `.agents/`, `.rpi/` per repo).
  See [rpi-kit-codex/README.md](rpi-kit-codex/README.md).

Migration: run the user installer once. You can remove the legacy per-project skill directories afterwards. The `rpi-workflow` skill will recreate `.rpi/AGENTS.md` automatically the first time it is invoked in each repository.

## Contributing

See each module's `AGENTS.md` for kit-maintenance governance rules.

