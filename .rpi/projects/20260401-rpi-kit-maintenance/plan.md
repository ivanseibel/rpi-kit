# Plan - rpi-kit maintenance

## 1) Strategy and Scope

### Approach
Produce a focused maintenance change set that resolves the two documented unknowns from research by aligning installer destination behavior with the operator's requested `~/.copilot/` location and by making project slugging behavior explicit and consistent across workflow-facing documentation and scaffolding references. This approach follows the identified entry points where operators interact with the kit (`install.sh`, `install.js`, README, and workflow guidance) and keeps work inside the repository's workflow/tooling boundaries.

### Trade-offs
This approach prioritizes consistency and operator clarity over minimizing touched files. It may require coordinated edits across installer logic and documentation, but it reduces ambiguity observed in research about default install destinations and project-id conventions.

### Safe State
The repository is in a working state when:
- Installer defaults and documented install destinations are consistent with the operator-requested `~/.copilot/` target and remain explicit for multi-agent consumers.
- Workflow/scaffolding documentation communicates one unambiguous project-id naming convention.
- A maintainer can run the documented bootstrap/install commands without encountering contradictory path guidance.

### Install Destination Policy
- Default installs target `~/.copilot/skills/` so the operator-requested Copilot location is the zero-argument outcome.
- `--tool copilot` resolves to the same `~/.copilot/skills/` directory, while `--tool codex` and `--tool antigravity` route to `~/.agents/skills/` and `~/.gemini/antigravity/skills/`, respectively.
- Using `--target <path>` overrides the computed destination when an operator needs a custom location, but it must never be combined with `--tool`.
- The documentation, installer comments, and scaffolding scripts will cite this policy so all install pathways stay consistent.

### In Scope
- Installer destination policy and default-path behavior.
- Workflow-facing installation/scaffolding documentation that references install paths.
- Explicit documentation of project directory naming/slug conventions.
- Manual verification of install workflow behavior using existing quick-start commands.

### Out of Scope
- Adding application runtime features unrelated to workflow tooling.
- Creating new testing frameworks or CI pipelines.
- Implementing non-workflow product code.

## 2) Architectural Decomposition

- Installer layer: `install.js` and `install.sh` destination resolution and target-path behavior.
- Workflow routing/docs layer: `README.md` and `skills/rpi-workflow/SKILL.md` install/scaffolding guidance exposed to operators.
- Project scaffolding convention layer: documented project-id/slug convention linked to `skills/rpi-workflow/scripts/rpi-new.sh` behavior.
- Validation layer: manual command-based checks already used by this repository's quick-start/install workflow.

## 3) Atomic Task List

[x] Task 1 - Define install destination policy baseline
- Source: research.md - Section 1 (Ambiguities & Open Questions), Section 2 (Other Consumers)
- Action: Establish the explicit supported destination policy for operator installs, including how `~/.copilot/` relates to existing documented destinations and option-driven targeting.
- Verify: Manual review confirms a single written policy statement is present in the implementation plan notes and used consistently as the reference for all subsequent file edits.
- Pass: Policy statement unambiguously defines default and alternate destinations without conflicting terms.
- Fail: Policy statement is missing, contradictory, or leaves default behavior undefined.

[x] Task 2 - Update installer default destination behavior in `install.js`
- Source: research.md - Section 1 (Ambiguities & Open Questions), Section 2 (Entry Points)
- Action: Modify `install.js` destination resolution so the default install target matches the policy baseline from Task 1 while preserving explicit option handling (`--tool`/`--target`) semantics.
- Verify: Run `node install.js` in dry or non-destructive mode (as supported by current script behavior) and inspect emitted destination paths.
- Pass: Output shows default destination behavior matching Task 1 policy, and explicit options still route to requested targets.
- Fail: Output still reflects old default behavior or breaks explicit destination selection.

[x] Task 3 - Update installer parity in `install.sh`
- Source: research.md - Section 2 (Entry Points), Section 2 (Other Consumers)
- Action: Adjust `install.sh` destination logic/messages to match `install.js` policy and maintain parity between shell and Node installers.
- Verify: Run `bash install.sh` in non-destructive/preview mode if available, or inspect reported destination output paths and tool selection behavior.
- Pass: Shell installer reports destinations consistent with `install.js` and Task 1 policy.
- Fail: Shell installer behavior diverges from Node installer or policy baseline.

[x] Task 4 - Align operator docs for install destinations
- Source: research.md - Section 1 (Ambiguities & Open Questions), Section 2 (Entry Points)
- Action: Update install-path guidance in `README.md` and workflow router guidance in `skills/rpi-workflow/SKILL.md` so commands/examples reflect the finalized destination policy.
- Verify: Search both files for install-destination examples and confirm no contradictory path guidance remains.
- Pass: All install examples and narrative references align with Task 1 policy.
- Fail: At least one command/example still points to a conflicting destination.

[x] Task 5 - Make project-id slug convention explicit
- Source: research.md - Section 1 (Ambiguities & Open Questions), Section 5 (Existing Patterns and Exemplars)
- Action: Document the date-prefixed slug convention used by `skills/rpi-workflow/scripts/rpi-new.sh` in operator-facing workflow documentation.
- Verify: Review updated docs and confirm the project-id format is described in one clear location without ambiguity.
- Pass: Documentation explicitly describes the date-prefixed slug convention and matches script behavior.
- Fail: Convention remains implicit or documentation conflicts with script behavior.

[x] Task 6 - Perform manual end-to-end consistency check
- Source: research.md - Section 2 (Tests), Section 6 (FAR Validation)
- Action: Execute the repository's documented install/bootstrap verification flow and confirm observed outputs are consistent with updated policy and documentation.
- Verify: Run the quick-start installation commands documented in `README.md` and compare observed destinations/messages to updated docs.
- Pass: Commands complete with outputs consistent with updated install-path policy and no contradictory guidance discovered.
- Fail: Any command output or message contradicts updated policy/docs or fails unexpectedly.

## 4) Verification Plan

- Automated (CI): No dedicated CI validation is documented in research for this repository; verification remains command-based.
- Manual/Local: Run documented quick-start installer commands (`bash install.sh`, `node install.js`) and confirm destination outputs, tool targeting behavior, and documentation consistency checks for `README.md` and `skills/rpi-workflow/SKILL.md`.

## 5) Validation - FACTS Criteria

- [x] Feasible: All tasks use repository files and command flows identified in research.
- [x] Atomic: Each task defines one action with one verification pathway.
- [x] Clear: Tasks specify target files/areas and expected verification outcomes.
- [x] Testable: Every task includes explicit Pass/Fail criteria.
- [x] Scoped: Work remains within installer/workflow tooling and documentation boundaries defined in research.

<!-- ⛔ END OF PLAN PHASE — Do NOT proceed to implementation. Do NOT edit source code. Return control to the operator. -->