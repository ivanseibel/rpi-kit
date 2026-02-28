# Agent Governance: rpi-kit-user (Kit Maintenance Only)

This file governs agents working **on** the `rpi-kit-user` module itself.
It **is not** installed into target repositories.

## Scope

Applies exclusively to maintenance tasks on the user-level installer:

- Updating `install.js` or `install.sh`
- Adding or removing artifacts from `INVENTORY.md`
- Updating documentation in `README.md`

## Maintainer Rules

1. **Source of truth for skills is `../skills/`** — do not edit skill content inside
   `rpi-kit-user/`; that directory contains no skills of its own.
2. **`INVENTORY.md` must stay in sync** — every artifact installed by `install.js`
   must be listed in `INVENTORY.md`.
3. **Validate with `--dry-run` before committing** — run
   `node install.js --dry-run --agents copilot,codex,claude` and confirm the
   output matches `INVENTORY.md`.
4. **No breaking changes to flags without updating README** — `--agents`, `--mode`,
   `--no-vscode`, `--dry-run` are part of the public interface.
5. **Agent path additions require a new INVENTORY row** — when adding support for
   a new agent (e.g., Gemini), add its path to `agentSkillsDir()`, add a row
   to `INVENTORY.md`, and update `README.md`.

## Source-of-Truth Hierarchy

`../skills/` (canonical) > `install.js` logic > `INVENTORY.md` documentation
