# AGENTS (Kit Development Only)

This file governs work on the **`rpi-kit-copilot` kit repository itself**.

## Scope

Use this file when the task is about maintaining or improving `rpi-kit-copilot` (installer behavior, `.github` instructions/prompts/skills, docs, scripts, CI, etc.).

Do **not** treat this file as target-repository workflow governance.

## Canonical RPI Governance for Targets

For repositories where the kit is installed, the canonical workflow governance file is:

- `.rpi/AGENTS.md`

`rpi-kit-copilot/install.js` must not copy this root `AGENTS.md` into target repositories.

## Maintainer Rules

- Keep installable workflow rules in `.rpi/AGENTS.md`.
- Keep target-facing workflow docs under `.rpi/docs/`.
- Keep this root file focused on kit-maintenance guidance only.
- Update `INVENTORY.md` when installable artifacts change.
- Validate installer behavior with `--dry-run` before finalizing changes.

## Required Validation for Kit Changes

When changing installer, scripts, CI, or docs:

1. Run dry-run installation against a test target:
   - `node install.js --target /tmp/test-repo --dry-run`
2. Confirm target output no longer includes root `AGENTS.md`.
3. Confirm `.rpi/AGENTS.md` is present in target output.
4. Update kit docs (`README.md`, `INVENTORY.md`) to match behavior.

## Source of Truth Hierarchy

1. `.rpi/AGENTS.md` — workflow governance for installed targets.
2. `.rpi/docs/*` — target-facing workflow documentation.
3. `AGENTS.md` (this file) — maintenance guidance for the kit repository only.
