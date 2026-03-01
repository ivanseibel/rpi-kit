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

By default, skills are installed to `~/.agents/skills/`.

You can select a tool-specific destination:

| Tool          | Destination                     |
| ------------- | ------------------------------- |
| `copilot`     | `~/.agents/skills/`             |
| `codex`       | `~/.agents/skills/`             |
| `antigravity` | `~/.gemini/antigravity/skills/` |

Examples:

```bash
node install.js --tool copilot
node install.js --tool codex
node install.js --tool antigravity
```

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
# or
bash ~/.gemini/antigravity/skills/rpi-workflow/scripts/rpi-new.sh "Project Title"
# Creates .rpi/projects/yyyymmdd-slug/research.md
```

## What Gets Installed

| Skill          | Description                                                                 |
| -------------- | --------------------------------------------------------------------------- |
| `rpi-workflow` | Research → Plan → Implement workflow with stages, templates, and validation |

All skills are installed to `<skills-root>/<skill-name>/`, where `<skills-root>` is resolved by `--tool` (or defaults to `~/.agents/skills/`).

## Installer Options

```
node install.js [options]

  --tool <name>    Resolve destination by tool: copilot | codex | antigravity
                   Cannot be combined with --target
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

## Theoretical Foundation

The design decisions in this kit are grounded in a formal study of the RPI pattern across domains — software engineering, product design, organizational change, and AI-assisted workflows.

> **[The Research–Plan–Implement (RPI) Pattern in Complex Problem Solving and Collaboration](docs/The%20Research%E2%80%93Plan%E2%80%93Implement%20(RPI)%20Pattern%20in%20Complex%20Problem%20Solving%20and%20Collaboration.md)**

This document serves as the **canonical reference for validating the kit**. Any change to stages, templates, or validation criteria should be checked against it to ensure the implementation stays true to what the method proposes. In particular:

| Kit element                   | Validated by                                                               |
| ----------------------------- | -------------------------------------------------------------------------- |
| FAR criteria (Research)       | Section on *Collapsing Research into Opinion Gathering* (anti-pattern #1)  |
| FACTS criteria (Plan)         | Section on *Plan as "Documentation Theater"* (anti-pattern #2)             |
| Phase separation and routing  | Section on *Cognitive and Organizational Rationale for Separating R, P, I* |
| Phase exit gates              | Section on *Infinite Research with No Commitment* (anti-pattern #5)        |
| Lightweight, iterative cycles | Section on *Boundaries and Non-Goals of RPI*                               |

Key principles the kit must uphold, as defined in the document:

- **Each phase has a distinct cognitive mode** — research (divergent, exploratory), plan (convergent, evaluative), implement (procedural, productive). The skill must never blend them in a single prompt.
- **Phases produce actionable outputs, not documentation theater** — research.md must yield verifiable facts; plan.md must yield tasks that can be individually marked pass/fail.
- **The pattern scales to problem complexity** — trivial changes may compress phases; the kit must not impose bureaucratic overhead on small tasks.
- **Evidence drives the plan; the plan drives the implementation** — neither order may be reversed without violating the method.

## Contributing

See [AGENTS.md](AGENTS.md) for kit-maintenance governance rules.

