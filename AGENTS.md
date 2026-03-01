# Agent Governance: rpi-kit Maintenance

This file governs AI agent behavior when working **on the rpi-kit repository itself** (not on target projects that consume the kit).

## Scope

Agents working in this repository are maintaining the RPI toolkit — editing skills, the installer, templates, and documentation. This is **not** the same as executing the RPI workflow in a target project.

## Rules

1. **INVENTORY.md stays in sync.** Any change that adds, removes, or renames an installed artifact must update `INVENTORY.md` in the same commit.
2. **Validate with `--dry-run`.** Before committing installer changes, run `node install.js --dry-run` and verify the output matches the expected inventory.
3. **Skills source of truth.** The canonical source for all skills is `skills/` at the repo root. There are no secondary copies.
4. **Only approved install paths.** The only canonical installation paths are `~/.agents/skills/` (copilot/codex) and `~/.gemini/antigravity/skills/` (antigravity). Do not introduce other tool-specific paths such as `~/.copilot/`, `~/.claude/`, `.github/skills/`, or `.agents/skills/`.
5. **Stage isolation.** Each stage file (`stages/research.md`, `stages/plan.md`, `stages/implement.md`) must be self-contained. Do not add cross-references between stages.
6. **SKILL.md is a router.** Keep `SKILL.md` lightweight. Phase-specific instructions belong in `stages/`, not in `SKILL.md`.
7. **Template stability.** Changes to `resources/research-template.md` or `resources/plan-template.md` affect all downstream projects. Test thoroughly.

## File Ownership

| Path                              | Owner      | Notes                        |
| --------------------------------- | ---------- | ---------------------------- |
| `install.js`, `install.sh`        | Maintainer | Unified installer            |
| `skills/rpi-workflow/SKILL.md`    | Maintainer | Router — keep minimal        |
| `skills/rpi-workflow/stages/*`    | Maintainer | Phase instructions           |
| `skills/rpi-workflow/resources/*` | Maintainer | Templates and validation     |
| `skills/rpi-workflow/scripts/*`   | Maintainer | Scaffolding tools            |
| `README.md`                       | Maintainer | Kit documentation            |
| `INVENTORY.md`                    | Maintainer | Must mirror installer output |
| `AGENTS.md`                       | Maintainer | This file                    |
