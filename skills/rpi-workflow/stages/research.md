# Stage: Research

> ⛔ You are in the **Research** phase of the RPI workflow.
> **Your ONLY output is `research.md`.** You must NOT create or modify any other file.
> You must NOT propose solutions, create plans, edit source code, or run formatters/linters.
> When research is complete, STOP and inform the operator. Do NOT proceed to planning.

## Objective

Produce `.rpi/projects/<project-id>/research.md` — a factual, source-cited investigation that will later drive planning.

## Self-Declaration (mandatory first step)

Before any other action, state to the operator exactly:

> "I am entering the RESEARCH phase. My sole output is `research.md`. I will NOT create plans, edit code, or run formatters."

This declaration anchors the phase constraint for the rest of the session.

## Pre-flight

1. Scan `.rpi/projects/` for folders with a similar slug.
2. **If a match is found** — report the folder name, existing artifacts, and whether a `SIGNOFF` exists. **Stop and wait** for the operator to authorize reuse or confirm a fresh start.
3. If no match, proceed.

## Posture

- **Read-only investigation.** You may read any file in the repository, search documentation, and explore the codebase.
- **Never propose solutions.** Do not suggest implementations, architectural choices, or code changes.
  - Example violation: "The code needs to use static class maps" → this prescribes a solution. Correct: "The Tailwind JIT scanner does not detect dynamically interpolated class names (src/ui/IconButton.tsx — L47-48)."
- **Cite every source inline** using the format `<file-or-url> — <Section/Line>`.

## ⛔ FORBIDDEN Actions

The following actions are **critical phase violations**. If you catch yourself doing any of these, STOP immediately and notify the operator:

- ⛔ **Editing source code files** (e.g., `.tsx`, `.ts`, `.js`, `.css`, `.json`)
- ⛔ **Creating `plan.md`** or any planning artifact
- ⛔ **Running formatters, linters, or test suites** on project code
- ⛔ **Proposing solutions** or using prescriptive language ("should", "needs to", "must be changed to")
- ⛔ **Creating any file** other than the target `research.md`
- ⛔ **Proceeding to the Plan phase** without operator authorization

## Constraints

| Rule            | Detail                                                                                                                                    |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Single artifact | Only `research.md` may be created or modified. **No exceptions.**                                                                         |
| No side-effects | Creating any additional file (draft, note, checklist, code) is a **critical phase violation** — stop immediately and notify the operator. |
| No code edits   | You must NOT edit, format, lint, or run any source code file in the repository.                                                           |
| No solutions    | Describe WHAT the problem is, never HOW to fix it. Prescriptive language is forbidden.                                                    |
| Template        | Follow the structure in `../resources/research-template.md`.                                                                              |

## Validation — FAR Criteria

Before declaring the research complete, verify every section:

| Criterion      | Question                                            |
| -------------- | --------------------------------------------------- |
| **Factual**    | Is every statement grounded in a cited source?      |
| **Actionable** | Can these facts directly inform planning decisions? |
| **Relevant**   | Do all findings stay focused on the stated problem? |

If any criterion fails, revise the artifact before handing off.

## Pre-handoff Self-Audit

Before declaring Research complete, perform these checks:

1. **No solution leaks.** Scan every sentence in research.md. If any sentence prescribes HOW to fix the problem (rather than WHAT the problem is), rewrite it as an observation.
2. **Citation format.** Verify every factual claim has an inline reference using the format specified in the template (`<file> — L<start>-<end>`).
3. **Template completeness.** Confirm all template sections are present and non-empty.

## Handoff

> ⛔ Reminder: Your ONLY output is `research.md`. Do NOT proceed to planning. Do NOT edit any code.

When `research.md` is complete and passes FAR:
- Inform the operator that Research is done and the Plan phase can begin.
- **STOP HERE.** Do **not** start planning yourself. Do **not** create `plan.md`. Do **not** edit any source files.
- Your session is complete. Wait for the operator to initiate the next phase.
