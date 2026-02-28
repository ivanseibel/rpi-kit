# Research - Installer should copy GitHub Actions workflow

## Problem Statement Analysis

The installer is intended to copy the RPI workflow artifacts into a target repo, including the GitHub Actions workflow used for validation. Today, the installer skips `.github/workflows/*`, so target repos do not receive `.github/workflows/rpi-validate.yml`, while multiple docs treat that workflow as a required CI invariant.

## Observations (repo facts)

- The installer entrypoint is `install.js`, with `install.sh` as a thin wrapper that runs `node install.js`.
- The installer’s copy roots are hard-coded to:
  - `.agents/`
  - `.rpi/`
  - `AGENTS.md`
- During the copy loop, the installer explicitly skips files whose relative path starts with `.github/workflows/`, preventing installation of the workflow.
- The workflow file exists in this kit at `.github/workflows/rpi-validate.yml`.
- Docs refer to `.github/workflows/rpi-validate.yml` as the CI validation artifact location.

## Current Behavior (what happens today)

- Installing this kit into a target repo does not copy `.github/workflows/rpi-validate.yml` because:
  1) `.github/` is not part of the include roots, and
  2) even if it were discovered, the copy loop contains a hard skip for `.github/workflows/`.

## Constraints / Desired Behavior (per stakeholder decisions)

- Copy only `.github/workflows/rpi-validate.yml` (not the entire `.github/` folder).
- Conflict policy for existing files in the target:
  - prompt when interactive (TTY)
  - skip in non-interactive environments
- Keep docs treating `.github/workflows/rpi-validate.yml` as required CI.
- Do not install this kit’s internal `.rpi/projects/*` example content into target repos.

## Risks / Edge Cases

- Windows path separators: `path.relative()` yields `\` separators, but current skip checks use forward slashes (e.g. `.github/workflows/`). Prefix checks should normalize paths before `startsWith`.
- If `.rpi/projects/` is no longer installed into targets, `rpi-new.sh` currently fails when `.rpi/projects` does not exist; it should create it (or the installer should ensure it exists).

## Validation - FAR Criteria

- Factual: All statements are derived from files in this repository (installer code, workflow file, and docs).
- Actionable: Findings point to concrete code locations to change (`install.js` copy roots / filters, `rpi-new.sh` directory handling).
- Relevant: The mismatch blocks the intended CI validation workflow in target repos.
