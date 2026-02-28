# Plan: rpikit (RPI prompts)

Reference research: [.rpi/projects/0001-rpikit/research.md](.rpi/projects/0001-rpikit/research.md)

Goal
- Create three reusable RPI prompts (`rpikit.research`, `rpikit.plan`, `rpikit.implement`) and make them discoverable and installable by repository tooling.

Scope
- Prompt artifacts: add prompt files under `.github/prompts/`.
- Discovery: update `INVENTORY.md` so installers can locate them.
- Installation: ensure `install.sh` / `install.js` can copy prompts into target projects.
- Documentation: add concise usage examples and sign-off artifact.

Plan — Atomic, testable tasks

1. Create prompt files
- Task: Add three files in `.github/prompts/`: `rpikit.research`, `rpikit.plan`, `rpikit.implement` containing canonical RPI entry prompts.
- Verification: Files exist at `.github/prompts/` and contain header lines describing their phase (research/plan/implement).

2. Update inventory
- Task: Add entries for the three prompts to `INVENTORY.md` under the appropriate section so installer scripts can discover them.
- Verification: `INVENTORY.md` includes the prompt paths and a short description; `grep` finds each prompt path.

3. Update installer scripts
- Task: Add or extend `install.sh` and/or `install.js` so they copy `.github/prompts/rpikit.*` into a target project's `.github/prompts/` (preserve names).
- Verification: Run installer in a temporary directory (dry-run or test flag) and confirm the files are copied to the target location.

4. Add usage examples and documentation
- Task: Create a short `USAGE.md` or README snippet showing how to copy the prompts into a new project and examples of invoking them.
- Verification: `USAGE.md` exists and contains at least one copy-and-run example that references `rpikit.research`.

5. Test installer copy end-to-end
- Task: Execute the installer in an ephemeral temp workspace and verify prompts appear in the target project; fix issues found.
- Verification: Automated or manual test completes without errors and files match source content (checksum or `diff`).

6. Stakeholder sign-off
- Task: Request approval from repository owners; once approved, create `.rpi/projects/0001-rpikit/SIGNOFF` containing approver and date.
- Verification: `SIGNOFF` file present and reviewers listed.

Acceptance criteria
- All three prompt files exist in `.github/prompts/` and are listed in `INVENTORY.md`.
- Installer scripts can copy the prompts into a target project and a test run succeeds.
- Documentation explains usage and a `SIGNOFF` file is created.

Owners & Notes
- Implementer: makes changes, runs tests, and updates this plan's todos as completed.
- Planner validation: confirm tasks are Feasible, Atomic, Clear, Testable, Scoped before Implement phase begins.
