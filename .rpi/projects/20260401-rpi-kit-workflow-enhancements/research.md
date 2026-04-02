# Research - rpi-kit Workflow Enhancements

## 1) Problem Statement Analysis

- **Trigger:** Operator submitted specs `.specs/2026-04-01-18-01.md` describing two behavioural gaps in the current rpi-kit workflow: (1) the Implement phase agent ignored partial execution instructions and executed all plan tasks regardless of operator instruction, and (2) the bootstrap files (`.rpi/AGENTS.md`, `.rpi/projects/.gitkeep`) are only created on first invocation and have no mechanism to be recovered or updated when missing or when the kit is upgraded.

- **User Intent:**
  1. The operator wants to be able to instruct the Implement-phase agent to execute only a named subset of tasks from `plan.md` in a given session.
  2. The operator wants the bootstrap check performed at every rpi workflow invocation to detect missing or stale governance files and recreate/update them automatically.

- **Ambiguities & Open Questions:**
  - "Partial execution" is not currently defined in any stage file or governance document. It is unclear whether "execute only Task 1" means (a) the agent should execute exactly the named tasks and stop, or (b) the agent should execute tasks up to and including the named task.
  - The spec says governance files should be updated "in case they are an older version." There is currently no version marker in `agents-md-template.md` or in the generated `.rpi/AGENTS.md`, so "older version" has no defined comparison basis. It is unknown whether version comparison would be based on file content hash, a version string, or a timestamp.
  - The spec says "when a new rpi flow is initiated." It is ambiguous whether this means every session start, every Research phase start, or every SKILL.md invocation regardless of phase.
  - It is unclear whether partial execution applies only to the Implement phase or also to the Plan phase (e.g., expanding only a subset of tasks).

---

## 2) Code Archaeology / Blast Radius

- **Entry Points:**
  - `skills/rpi-workflow/SKILL.md` — Bootstrap section (L36-44) governs the current "create if absent" logic for `.rpi/AGENTS.md` and `.rpi/projects/.gitkeep`. This is the only location that currently describes the bootstrap check.
  - `skills/rpi-workflow/stages/implement.md` — Entire file governs Implement-phase behaviour. No partial execution concept exists here. The "Objective" section (L30) states "Execute every task in `plan.md` sequentially."
  - `skills/rpi-workflow/stages/implement.md` — FORBIDDEN Actions section lists "Skipping tasks" as a critical phase violation (L40), which directly conflicts with the desired partial execution capability.

- **Core Logic:**
  - `skills/rpi-workflow/SKILL.md — L36-44`: Bootstrap block — current logic is `if absent → create`. No update/replace path exists.
  - `skills/rpi-workflow/stages/implement.md — L30`: "Execute every task in `plan.md` sequentially" — the current blanket mandate that causes the reported problem.
  - `skills/rpi-workflow/stages/implement.md — L39-44`: FORBIDDEN Actions — "Skipping tasks" listed as a violation without any carve-out for operator-scoped partial execution.
  - `skills/rpi-workflow/resources/agents-md-template.md`: Source template for `.rpi/AGENTS.md`. No version field or metadata exists in this file.

- **Data Models:**
  - `.rpi/AGENTS.md` — Generated governance file. Current content is a direct copy of `resources/agents-md-template.md` with no version identifier. (`skills/rpi-workflow/resources/agents-md-template.md`)
  - `.rpi/projects/.gitkeep` — Empty marker file. No versioning applicable.
  - `.rpi/projects/<id>/plan.md` — The task list consumed by the Implementer. Tasks use `[ ]`/`[x]` checkbox format. No partial-scope annotation field currently exists per task. (`skills/rpi-workflow/resources/plan-template.md`)

- **Tests:** No automated test suite exists in this repository. Verification is command-based and manual. (`INVENTORY.md — Per-Project Artifacts section`)

- **Storybook/Docs:** Not applicable — this is a workflow toolkit, not a UI component library.

- **Other Consumers:**
  - `.rpi/AGENTS.md` is read by all agents at session start to understand phase rules and handoff expectations. Any change to the template or bootstrap logic directly affects every downstream project using the kit.
  - `skills/rpi-workflow/stages/implement.md` is loaded exclusively during the Implement phase. Changes to partial-execution semantics here affect all implementation sessions across all projects.
  - `INVENTORY.md` documents per-project runtime artifacts including `.rpi/AGENTS.md`. Any new version-tracking mechanism or modified bootstrap behaviour would need to be reflected there. (`INVENTORY.md — Per-Project Artifacts section`)

---

## 3) Conceptual Scope

- **In Scope:**
  - The `SKILL.md` bootstrap section and its "create if absent" logic.
  - The `stages/implement.md` mandate for full sequential task execution and the FORBIDDEN "skipping tasks" rule.
  - The `resources/agents-md-template.md` file as the source of truth for `.rpi/AGENTS.md` content.
  - Documentation of a partial execution model within the Implement stage instructions.
  - Documentation of a version/staleness detection mechanism for bootstrap files.

- **Out of Scope:**
  - Changes to the Plan phase stage file beyond what is necessary to annotate tasks for partial execution scope.
  - Changes to the Research phase stage file.
  - Changes to `install.js`, `install.sh`, or `INVENTORY.md` installer behaviour (separate concern from previous maintenance cycle).
  - Creation of a new CI/CD validation pipeline.
  - Partial execution in Research or Plan phases (not mentioned in specs).

---

## 4) System Constraints

- **Hard Constraints:**
  - `AGENTS.md` governs that the Implementer "Must follow `plan.md` strictly" (`skills/rpi-workflow/resources/agents-md-template.md — Implementer row`). Any partial execution capability must be reconcilable with this constraint or the constraint text itself must be revised.
  - The skill routing rule in `SKILL.md — L17-23` mandates reading ONLY the current stage file. Bootstrap logic lives in `SKILL.md` and is read at every invocation, making it the correct location for enhanced bootstrap checks.
  - `stages/implement.md — L40` currently classifies "Skipping tasks" as a FORBIDDEN action without exception. A partial execution model would require either removing this prohibition, scoping it, or introducing a sanctioned operator-override mechanism.

- **Implicit Contracts:**
  - The `plan.md` checkbox format (`[ ]` / `[x]`) is the sole task state representation. Any partial execution model must remain compatible with this format or extend it without breaking existing plans.
  - Agents read `.rpi/AGENTS.md` to understand their constraints. If bootstrap updates silently overwrite this file during active projects, agents in mid-flight sessions may experience governance drift. The bootstrap update check timing and operator notification expectations are currently undefined.
  - `rpi-new.sh` creates `research.md` from the template by prefixing a title line and appending the rest of the template (`skills/rpi-workflow/scripts/rpi-new.sh — L52-56`). Any version marker added to `agents-md-template.md` would need to be compatible with this rendering approach if the script is ever extended.

---

## 5) Existing Patterns and Exemplars

- `skills/rpi-workflow/SKILL.md — L36-44` — Demonstrates the existing "if absent → create" bootstrap pattern. The current two-file check (AGENTS.md + .gitkeep) is the template for extending to an "if absent or stale → recreate/update" pattern.
- `skills/rpi-workflow/stages/implement.md — L55-61` — Recursion Protocol block demonstrates how the stage file already handles blocker-driven partial stopping; this pattern shows how conditional halting can be expressed in stage prose.
- `.rpi/projects/20260401-rpi-kit-maintenance/plan.md — L30-83` — Demonstrates the existing `[x]` task checkbox format with Source/Action/Verify/Pass/Fail fields. This is the format any partial execution scoping annotation would need to extend or annotate.
- `skills/rpi-workflow/resources/agents-md-template.md — Phase Enforcement section` — Shows the existing "one phase per session" and "operator gates" pattern; partial execution would be another operator-gate concept that fits within this established prose style.

---

## 6) Validation - FAR Criteria

- [x] Factual: Every claim has an inline citation. Counter-check: all file references include path and section/line anchors.
- [x] Actionable: A planner can derive tasks for (a) modifying `SKILL.md` bootstrap logic, (b) modifying `stages/implement.md` task-execution mandate and FORBIDDEN list, (c) optionally adding a version marker to `agents-md-template.md`, and (d) updating `AGENTS.md` Implementer constraints — all from the facts above without re-reading source.
- [x] Relevant: All findings address the two stated problems (partial execution, bootstrap refresh). No unrelated installer or Research/Plan phase concerns introduced.

---

## 7) Notes on Unknowns

- No versioning mechanism currently exists in `agents-md-template.md` or the generated `.rpi/AGENTS.md`. The definition of "older version" for the bootstrap refresh feature requires a decision by the operator or planner on what comparison mechanism to use (e.g., content hash, embedded version string, or always-overwrite on invocation).
- "Partial execution" direction (named tasks only vs. up-to-and-including) is not specified in the specs. The planner will need to resolve this before defining atomic tasks.
- The spec states "when a new rpi flow is initiated" as the trigger for bootstrap refresh. The exact trigger point (SKILL.md load, Research phase start, or every phase start) requires clarification and a planning decision.
- Whether `.rpi/AGENTS.md` updates during an in-progress project should be silent or require explicit operator confirmation is not addressed in the specs.

<!-- ⛔ END OF RESEARCH PHASE — Do NOT proceed to planning. Do NOT create plan.md. Do NOT edit source code. Return control to the operator. -->
