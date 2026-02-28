# Plan - Install `.github/workflows/rpi-validate.yml` and fix installer

## Goal

Ensure `install.js` installs the GitHub Actions validation workflow into target repos (only `.github/workflows/rpi-validate.yml`), while keeping conflict behavior safe in non-interactive shells and excluding this kit’s internal `.rpi/projects/*` content from installation.

## Non-Goals

- Do not install any other `.github/*` files besides `.github/workflows/rpi-validate.yml`.
- Do not change the workflow semantics beyond what’s required for installation.

## Acceptance Criteria

- `node install.js --target <repo>` installs `.github/workflows/rpi-validate.yml` into the target.
- `--mode prompt` does not fail in non-interactive environments; it skips overwriting existing files when it can’t prompt.
- Internal kit project artifacts under `.rpi/projects/0001-codex-migration/*` are not copied into targets.
- The scaffolder script can create a new RPI project in a freshly installed target repo (even if `.rpi/projects/` was not installed).
- Documentation and inventory match the installed artifact contract.

## Atomic Task List (with verification)

- [x] 1. Update installer include set to explicitly include `.github/workflows/rpi-validate.yml`.
  - Verify: `--dry-run` output includes `create .github/workflows/rpi-validate.yml` when target doesn’t already have it.

- [x] 2. Remove the hard skip for `.github/workflows/` in the copy loop, and add a skip for `.rpi/projects/`.
  - Verify: `--dry-run` output does not mention copying anything under `.rpi/projects/`.

- [x] 3. Normalize relative paths for prefix checks so behavior is consistent on Windows.
  - Verify: code uses a normalized (posix-style) `rel` for `startsWith` checks and override/template matching.

- [x] 4. Make `--mode prompt` safe in non-interactive shells by treating prompt as “do not overwrite” when TTY is unavailable.
  - Verify: running with `--mode prompt` in a non-TTY context does not throw and does not overwrite.

- [x] 5. Update `rpi-new.sh` to create `.rpi/projects/` if missing.
  - Verify: In a target repo with only installed artifacts, `bash .agents/skills/rpi-workflow/scripts/rpi-new.sh "Test"` succeeds and creates `.rpi/projects/NNNN-test/research.md`.

- [x] 6. Update docs/inventory to include `.github/workflows/rpi-validate.yml` as installed.
  - Verify: `README.md` and `INVENTORY.md` reflect the new installer behavior; operator guide remains consistent.

## Validation - FACTS Criteria

- Feasible: Changes are confined to installer, one script, and docs.
- Atomic: Each task is independently implementable and verifiable.
- Clear: Each task has a concrete change and verification step.
- Testable: Verification uses installer `--dry-run` and the `rpi-new.sh` scaffolder.
- Scoped: No changes beyond workflow installation + installer behavior alignment.
