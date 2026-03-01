RPI Kit — Research → Plan → Implement
====================================

A tool-agnostic toolkit that adds a deterministic **Research → Plan → Implement (RPI)** workflow to any project. Works with any AI agent: Copilot, Claude, Gemini, Cursor, Codex, or others.

## Quick Start

```bash
# Install skills globally (run once)
bash install.sh

# Or with Node directly
node install.js
```

Skills are installed to `~/.agents/skills/`. This is the single canonical path used by all agents.

> **For agents that use a different skills path** (e.g. `~/.copilot/skills/`), either configure the agent to read from `~/.agents/skills/` or create a symlink:
> ```bash
> ln -s ~/.agents/skills ~/.copilot/skills
> ```

## How It Works

The `rpi-workflow` skill enforces a three-phase workflow:

| Phase         | Artifact                | Validation                                        |
| ------------- | ----------------------- | ------------------------------------------------- |
| **Research**  | `research.md`           | FAR (Factual, Actionable, Relevant)               |
| **Plan**      | `plan.md`               | FACTS (Feasible, Atomic, Clear, Testable, Scoped) |
| **Implement** | source code + `SIGNOFF` | Pass/fail per task                                |

Each phase is self-contained. The agent loads **only** the instructions for the current phase, minimizing token consumption.

### Bootstrap

The first time the skill is invoked in a repository, it automatically creates:
- `.rpi/AGENTS.md` — governance roles and handoff rules
- `.rpi/projects/.gitkeep` — project artifacts directory

### New Project

```bash
bash ~/.agents/skills/rpi-workflow/scripts/rpi-new.sh "Project Title"
# Creates .rpi/projects/yyyymmdd-slug/research.md
```

## What Gets Installed

| Skill          | Description                                                                 |
| -------------- | --------------------------------------------------------------------------- |
| `rpi-workflow` | Research → Plan → Implement workflow with stages, templates, and validation |

All skills are installed to `~/.agents/skills/<skill-name>/`.

## Installer Options

```
node install.js [options]

  --target <path>   Override destination (default: ~/.agents/skills)
  --mode <mode>     Conflict resolution: skip | overwrite | prompt (default: skip)
  --dry-run         Print actions without writing files
  -h, --help        Show help
```

## Project Structure

```
rpi-kit/
├── install.js              # Unified installer
├── install.sh              # Shell wrapper
├── skills/
│   └── rpi-workflow/
│       ├── SKILL.md        # Routing hub — loads one stage at a time
│       ├── stages/         # Phase-specific instructions
│       │   ├── research.md
│       │   ├── plan.md
│       │   └── implement.md
│       ├── resources/      # Templates and validation
│       └── scripts/        # rpi-new.sh scaffolder
```

## Key Files

- [skills/rpi-workflow/SKILL.md](skills/rpi-workflow/SKILL.md) — skill entry point (lightweight router)
- [skills/rpi-workflow/stages/](skills/rpi-workflow/stages/) — phase instructions (loaded one at a time)
- [skills/rpi-workflow/resources/agents-md-template.md](skills/rpi-workflow/resources/agents-md-template.md) — governance template
- [INVENTORY.md](INVENTORY.md) — full list of installed artifacts

## Contributing

See [AGENTS.md](AGENTS.md) for kit-maintenance governance rules.

