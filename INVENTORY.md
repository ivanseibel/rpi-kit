# Inventory — rpi-kit

Artifacts installed by `node install.js` (or `bash install.sh`).

## Destination

Default: `~/.agents/skills/`  
Override: `--target <path>`

## Installed Files

| Source                                                | Destination                                                     |
| ----------------------------------------------------- | --------------------------------------------------------------- |
| `skills/rpi-workflow/SKILL.md`                        | `~/.agents/skills/rpi-workflow/SKILL.md`                        |
| `skills/rpi-workflow/stages/research.md`              | `~/.agents/skills/rpi-workflow/stages/research.md`              |
| `skills/rpi-workflow/stages/plan.md`                  | `~/.agents/skills/rpi-workflow/stages/plan.md`                  |
| `skills/rpi-workflow/stages/implement.md`             | `~/.agents/skills/rpi-workflow/stages/implement.md`             |
| `skills/rpi-workflow/resources/research-template.md`  | `~/.agents/skills/rpi-workflow/resources/research-template.md`  |
| `skills/rpi-workflow/resources/plan-template.md`      | `~/.agents/skills/rpi-workflow/resources/plan-template.md`      |
| `skills/rpi-workflow/resources/agents-md-template.md` | `~/.agents/skills/rpi-workflow/resources/agents-md-template.md` |
| `skills/rpi-workflow/resources/validation-guide.md`   | `~/.agents/skills/rpi-workflow/resources/validation-guide.md`   |
| `skills/rpi-workflow/scripts/rpi-new.sh`              | `~/.agents/skills/rpi-workflow/scripts/rpi-new.sh`              |

## Per-Project Artifacts (created at runtime by the skill)

These are **not** installed by the installer. They are created by the `rpi-workflow` skill on first invocation in each repository:

| File                             | Origin                                                        |
| -------------------------------- | ------------------------------------------------------------- |
| `.rpi/AGENTS.md`                 | Copied from `resources/agents-md-template.md`                 |
| `.rpi/projects/.gitkeep`         | Created empty                                                 |
| `.rpi/projects/<id>/research.md` | Created by `rpi-new.sh` from `resources/research-template.md` |
| `.rpi/projects/<id>/plan.md`     | Created during Plan phase from `resources/plan-template.md`   |
| `.rpi/projects/<id>/SIGNOFF`     | Created at end of Implement phase                             |
