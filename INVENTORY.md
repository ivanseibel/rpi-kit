# Inventory — rpi-kit

Artifacts installed by `node install.js` (or `bash install.sh`).

## Destination

Default: `~/.agents/skills/`  
By tool (`--tool <name>`):
- `copilot` → `~/.agents/skills/`
- `codex` → `~/.agents/skills/`
- `antigravity` → `~/.gemini/antigravity/skills/`

Override: `--target <path>` (cannot be combined with `--tool`)

## Installed Files

| Source                                                | Destination                                                  |
| ----------------------------------------------------- | ------------------------------------------------------------ |
| `skills/rpi-workflow/SKILL.md`                        | `<skills-root>/rpi-workflow/SKILL.md`                        |
| `skills/rpi-workflow/stages/research.md`              | `<skills-root>/rpi-workflow/stages/research.md`              |
| `skills/rpi-workflow/stages/plan.md`                  | `<skills-root>/rpi-workflow/stages/plan.md`                  |
| `skills/rpi-workflow/stages/implement.md`             | `<skills-root>/rpi-workflow/stages/implement.md`             |
| `skills/rpi-workflow/resources/research-template.md`  | `<skills-root>/rpi-workflow/resources/research-template.md`  |
| `skills/rpi-workflow/resources/plan-template.md`      | `<skills-root>/rpi-workflow/resources/plan-template.md`      |
| `skills/rpi-workflow/resources/agents-md-template.md` | `<skills-root>/rpi-workflow/resources/agents-md-template.md` |
| `skills/rpi-workflow/resources/validation-guide.md`   | `<skills-root>/rpi-workflow/resources/validation-guide.md`   |
| `skills/rpi-workflow/scripts/rpi-new.sh`              | `<skills-root>/rpi-workflow/scripts/rpi-new.sh`              |

`<skills-root>` is one of:
- `~/.agents/skills/` (default, `--tool copilot`, or `--tool codex`)
- `~/.gemini/antigravity/skills/` (`--tool antigravity`)

## Per-Project Artifacts (created at runtime by the skill)

These are **not** installed by the installer. They are created by the `rpi-workflow` skill on first invocation in each repository:

| File                             | Origin                                                        |
| -------------------------------- | ------------------------------------------------------------- |
| `.rpi/AGENTS.md`                 | Copied from `resources/agents-md-template.md`                 |
| `.rpi/projects/.gitkeep`         | Created empty                                                 |
| `.rpi/projects/<id>/research.md` | Created by `rpi-new.sh` from `resources/research-template.md` |
| `.rpi/projects/<id>/plan.md`     | Created during Plan phase from `resources/plan-template.md`   |
| `.rpi/projects/<id>/SIGNOFF`     | Created at end of Implement phase                             |
