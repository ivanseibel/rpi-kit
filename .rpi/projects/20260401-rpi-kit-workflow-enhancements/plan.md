<!-- ALL SECTIONS BELOW ARE REQUIRED. Do not omit or merge sections. -->

# Plan - rpi-kit Workflow Enhancements

## 1) Strategy and Scope

### Approach
Two independent improvements are delivered by editing prose-only skill and template files — no installer or test-pipeline changes. Feature 1 (partial execution) is implemented entirely within `stages/implement.md` and `resources/agents-md-template.md`. Feature 2 (bootstrap refresh) is implemented by adding a version marker to `resources/agents-md-template.md` and extending the bootstrap block in `SKILL.md`.

All changes are additive prose edits or scoped rewrites to existing paragraphs. No new files are created. No code is executed.

### Trade-offs
- **Always-overwrite** (simpler) was considered for staleness detection but rejected in favour of version-string comparison because always-overwrite would silently destroy operator customisations to `.rpi/AGENTS.md` on every phase start. The version-string approach overwrites only when the installed file carries an older version token.
- **Up-to-and-including** partial execution was considered but rejected; named-only is safer and more predictable — the operator explicitly enumerates every task they want run in the session, eliminating ambiguity about which tasks are "in range."
- **Confirmed overwrite** for stale bootstrap files was considered but rejected; a silent overwrite with a reported summary keeps the workflow non-interactive while remaining auditable.

### Safe State
Implementation is complete when:
1. `skills/rpi-workflow/resources/agents-md-template.md` contains an `<!-- rpi-agents-version: 1.1 -->` marker as its first line.
2. `skills/rpi-workflow/SKILL.md` Bootstrap section instructs agents to: (a) create `.rpi/AGENTS.md` if absent, (b) compare the version token in the installed file against the template, (c) silently overwrite and report if the installed version is older or absent, and (d) do nothing if versions match.
3. `skills/rpi-workflow/stages/implement.md` Objective section replaces the blanket "execute every task" mandate with a named-only partial execution model.
4. `skills/rpi-workflow/stages/implement.md` FORBIDDEN Actions entry for "Skipping tasks" is scoped to "without explicit operator authorisation" so operator-gated partial execution is no longer a phase violation.
5. `skills/rpi-workflow/resources/agents-md-template.md` Implementer row acknowledges partial execution as a sanctioned operator-gate capability.

### In Scope
- `skills/rpi-workflow/resources/agents-md-template.md` — add version marker (first line) and update Implementer row text
- `skills/rpi-workflow/SKILL.md` — extend Bootstrap section prose for version-aware refresh
- `skills/rpi-workflow/stages/implement.md` — rewrite Objective section and scope the FORBIDDEN "skipping tasks" entry

### Out of Scope
- `skills/rpi-workflow/stages/plan.md` — no changes
- `skills/rpi-workflow/stages/research.md` — no changes
- `skills/rpi-workflow/resources/plan-template.md` — no task-annotation field needed; partial execution is communicated verbally by the operator, not encoded in plan.md
- `skills/rpi-workflow/resources/research-template.md` — no changes
- `install.js`, `install.sh`, `INVENTORY.md` — installer behaviour not in scope
- Partial execution in Research or Plan phases — not requested
- CI/CD validation pipeline — not applicable

---

## 2) Architectural Decomposition

- **agents-md-template.md** — serves dual purpose in this plan: (a) source of the version token that SKILL.md reads to detect staleness, and (b) governance prose that needs to acknowledge the partial execution operator-gate. Two separate tasks target this file.
- **SKILL.md Bootstrap block** — single location that drives bootstrap behaviour on every phase start. One task extends its prose.
- **stages/implement.md Objective section** — single paragraph that currently mandates full sequential execution. One task rewrites it.
- **stages/implement.md FORBIDDEN Actions section** — single bullet currently making task-skipping a phase violation without exception. One task scopes it.

---

## 3) Atomic Task List

[x] Task 1 — Add version marker to agents-md-template.md
- Source: research.md — Section 7 (no version mechanism exists); Section 4 (agents-md-template.md is the source for .rpi/AGENTS.md)
- Action: In `skills/rpi-workflow/resources/agents-md-template.md`, insert `<!-- rpi-agents-version: 1.1 -->` as the very first line of the file (before any existing content).
- Verify: Run `head -1 skills/rpi-workflow/resources/agents-md-template.md` and confirm output is exactly `<!-- rpi-agents-version: 1.1 -->`.
- Pass: Output is `<!-- rpi-agents-version: 1.1 -->`.
- Fail: Output is anything else, or the line is not the first line of the file.

[x] Task 2 — Update Implementer row in agents-md-template.md to allow partial execution
- Source: research.md — Section 4 (`agents-md-template.md — Implementer row` constraint "Must follow plan.md strictly" conflicts with partial execution); Section 2 (partial execution model requires reconciliation with this constraint)
- Action: In `skills/rpi-workflow/resources/agents-md-template.md`, locate the Implementer row that contains "Must follow `plan.md` strictly" and append to that cell (or replace the sentence) with: "Must follow `plan.md` strictly. When the operator explicitly names a subset of tasks for the current session, execute exactly those named tasks and stop (named-only partial execution); skipping unapproved tasks remains a phase violation."
- Verify: Read `skills/rpi-workflow/resources/agents-md-template.md` and confirm the Implementer row contains both "Must follow `plan.md` strictly" and "named-only partial execution" in the same cell.
- Pass: Both phrases are present in the Implementer row.
- Fail: Either phrase is absent, or the row has been removed.

[x] Task 3 — Extend SKILL.md Bootstrap section for version-aware refresh
- Source: research.md — Section 2 (`SKILL.md — L36-44` current "if absent → create" logic); Section 4 (bootstrap logic in SKILL.md is read at every invocation); Operator decision: trigger = every SKILL.md load, mechanism = version string comparison, behaviour = silent overwrite + report
- Action: In `skills/rpi-workflow/SKILL.md`, replace the Bootstrap section (currently steps 1–2 covering "if absent → create") with the following expanded logic (preserve the step numbering style and any existing `.gitkeep` step):
  1. If `.rpi/AGENTS.md` is absent → create it from `resources/agents-md-template.md` and report "Created `.rpi/AGENTS.md`."
  2. If `.rpi/AGENTS.md` is present → read its first line and compare the `rpi-agents-version` token against the first line of `resources/agents-md-template.md`. If the installed version token is missing or lower than the template version, silently overwrite `.rpi/AGENTS.md` with the current template content and report "Updated `.rpi/AGENTS.md` to version 1.1." If versions match, continue silently.
  3. If `.rpi/projects/` is absent → create `.rpi/projects/.gitkeep`.
  4. Report what was created or updated. If all files exist and versions match, continue silently.
- Verify: Read `skills/rpi-workflow/SKILL.md` Bootstrap section and confirm it contains: (a) absent-file creation path, (b) version token comparison logic, (c) silent overwrite path with report, (d) version-match silent-continue path, (e) `.gitkeep` creation step.
- Pass: All five elements are present in the Bootstrap section prose.
- Fail: Any element is missing or the section still reads only "if absent → create."

[x] Task 4 — Rewrite stages/implement.md Objective section for named-only partial execution
- Source: research.md — Section 2 (`stages/implement.md — L30`: "Execute every task in `plan.md` sequentially"); Operator decision: partial execution = named-only
- Action: In `skills/rpi-workflow/stages/implement.md`, locate the Objective section paragraph that reads "Execute every task in `plan.md` sequentially" (approximately L30) and replace it with: "Execute every task in `plan.md` sequentially. Exception: if the operator explicitly names a subset of tasks for this session (e.g., 'execute only Task 2 and Task 4'), execute exactly those named tasks in their plan.md order and stop. Do not execute any task not named by the operator in partial-execution mode."
- Verify: Read `skills/rpi-workflow/stages/implement.md` Objective section and confirm it contains both the default sequential mandate and the named-only partial execution exception clause.
- Pass: Both the sequential mandate and the named-only exception are present in the Objective section.
- Fail: Either clause is missing, or the section is unchanged from the original.

[x] Task 5 — Scope the FORBIDDEN "Skipping tasks" entry in stages/implement.md
- Source: research.md — Section 2 (`stages/implement.md — L39-44`: "Skipping tasks" listed as FORBIDDEN without carve-out); Section 4 (this conflicts with the desired partial execution capability)
- Action: In `skills/rpi-workflow/stages/implement.md`, locate the FORBIDDEN Actions bullet that reads "Skipping tasks" (approximately L40–44) and change it to: "⛔ **Skipping tasks without explicit operator authorisation** — if the operator has not named this task for the current partial-execution session, do not execute it; if the operator has given no partial-execution instruction, all tasks must be executed."
- Verify: Read `skills/rpi-workflow/stages/implement.md` FORBIDDEN Actions section and confirm (a) "without explicit operator authorisation" qualifies the skipping prohibition, and (b) the entry does not unconditionally forbid all task-skipping.
- Pass: The bullet contains the qualification phrase and does not retain an unqualified blanket prohibition.
- Fail: The bullet is unchanged (unqualified prohibition remains) or has been removed entirely.

---

## 4) Verification Plan

- Automated (CI): No automated test suite exists in this repository (`research.md — Section 2, INVENTORY.md`). No CI checks apply.
- Manual/Local:
  - After Task 1: `head -1 skills/rpi-workflow/resources/agents-md-template.md` — confirm version marker.
  - After Task 2: `grep -A5 "Implementer" skills/rpi-workflow/resources/agents-md-template.md` — confirm updated row text.
  - After Task 3: Read `skills/rpi-workflow/SKILL.md` Bootstrap section — confirm all five version-aware logic elements are present.
  - After Task 4: Read `skills/rpi-workflow/stages/implement.md` Objective section — confirm sequential mandate + named-only exception.
  - After Task 5: Read `skills/rpi-workflow/stages/implement.md` FORBIDDEN Actions section — confirm scoped (not blanket) skipping prohibition.
  - End-to-end smoke test (manual): Load SKILL.md against a project whose `.rpi/AGENTS.md` has no version marker and verify the agent reports "Updated `.rpi/AGENTS.md` to version 1.1."

---

## 5) Validation - FACTS Criteria

- [x] Feasible: All five tasks are pure prose edits to Markdown files. No build tools, APIs, or external dependencies required. All target files exist and are writable (`research.md — Section 2`).
- [x] Atomic: Each task has exactly one action (one file, one section) and one verification step. No task pairs an unrelated second action.
- [x] Clear: Each task specifies the exact file, the approximate location (section name + line reference), the replacement text, and the expected post-state. No design decisions are left to the Implementer.
- [x] Testable: Every task has explicit Pass and Fail criteria based on observable file content. Pass conditions are unambiguous string-match checks.
- [x] Scoped: All five tasks target only the three files listed in Section 1 In Scope. No installer, Research/Plan stage, or template files outside the stated scope are touched.

<!-- ⛔ END OF PLAN PHASE — Do NOT proceed to implementation. Do NOT edit source code. Return control to the operator. -->
