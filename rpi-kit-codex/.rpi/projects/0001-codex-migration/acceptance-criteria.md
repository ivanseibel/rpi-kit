# Acceptance Criteria — Codex-centric Artifacts (Task 10)

This document defines which artifacts are **required** vs **optional** for this repository after the Codex migration.

## Required

- Instructions / governance
  - `AGENTS.md` exists at repo root
  - `.rpi/AGENTS.md` exists and is identical to `AGENTS.md` (kept for directory-scoped consistency)

- Skills
  - `.agents/skills/` exists
  - Every direct child skill directory under `.agents/skills/*/` contains `SKILL.md`
  - Each `SKILL.md` contains YAML frontmatter with `name:` and `description:`
  - `name:` matches `^[a-z0-9-]+$`

- RPI artifacts
  - `.rpi/projects/` exists (project artifacts live here)
  - `.rpi/docs/` exists (methodology/operator docs)

- CI
  - `.github/workflows/rpi-validate.yml` validates the required items above

## Required removals (VS Code/Copilot-specific)

- `.vscode/` must not exist
- `.rpi/scripts/check-vscode-load.sh` must not exist
- `.github/copilot-instructions.md` must not exist
- `.github/instructions/` must not exist
- `.github/prompts/` must not exist
- Legacy GitHub-scoped skills directory must not exist

## Optional

- Additional `AGENTS.md` files in subdirectories (for more granular instruction layering)
- Codex configuration files (only if/when a verified Codex config format is introduced)

## Notes

- This repo intentionally drops VS Code/Copilot instruction-file and prompt-entrypoint conventions.
- The installer (`install.js`) is expected to copy Codex-centric roots and exclude VS Code-specific roots.
