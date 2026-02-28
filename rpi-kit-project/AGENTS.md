# Agent Governance: rpi-kit-project (Kit Maintenance Only)

This file governs agents working **on** the `rpi-kit-project` module itself.
It **is not** installed into target repositories.

## Scope

Applies exclusively to maintenance tasks on the project-level installer:

- Updating `install.js` or `install.sh`
- Editing the governance template `.rpi/AGENTS.md`
- Updating `INVENTORY.md` or `README.md`

## Maintainer Rules

1. **`.rpi/AGENTS.md` in this directory is the template** — it is copied verbatim
   into target repositories by `install.js`. Changes here affect all future installs.
2. **`INVENTORY.md` must stay in sync** — every artifact installed by `install.js`
   must have a row in `INVENTORY.md`.
3. **Validate with `--dry-run` before committing** — run
   `node install.js --target /tmp/test-rpi-project --copilot --dry-run` and
   confirm output matches `INVENTORY.md`.
4. **Do not add skills here** — skills belong in `../skills/` and are installed
   by `rpi-kit-user/install.js`.
5. **The `--copilot` artifacts come from `rpi-kit-copilot/`** — do not duplicate
   them here; always reference the source from the sibling kit.

## Source-of-Truth Hierarchy

`.rpi/AGENTS.md` (template) > `install.js` logic > `INVENTORY.md` documentation
