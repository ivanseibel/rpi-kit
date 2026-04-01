# Stage: Plan

> ⛔ You are in the **Plan** phase of the RPI workflow.
> **Your ONLY output is `plan.md`.** You must NOT create or modify any other file.
> You must NOT edit source code, run formatters/linters, or implement anything.
> When the plan is complete, STOP and inform the operator. Do NOT proceed to implementation.

## Pre-condition

`research.md` must exist in the project directory and pass FAR validation (Factual, Actionable, Relevant). If it does not exist or fails validation, **stop and recurse back to Research**.

## Self-Declaration (mandatory first step)

Before any other action, state to the operator exactly:

> "I am entering the PLAN phase. My sole output is `plan.md`. I will NOT edit code, run formatters, or implement anything."

This declaration anchors the phase constraint for the rest of the session.

## Pre-flight

1. Confirm the operator explicitly initiated the Plan phase for this project.
2. If phase intent is ambiguous, stop and ask for explicit confirmation before writing `plan.md`.

## Objective

Produce `.rpi/projects/<project-id>/plan.md` — an atomic, testable task list that an Implementer can follow without ambiguity.

## Posture

- **Reference research.md exclusively.** Every decision must trace back to a cited fact. No unsupported assumptions.
- **Decompose into atomic tasks.** Each task must be independently testable with explicit pass/fail criteria.
- **Define a safe state.** Describe what "working" means when implementation is complete.
- **One action per task.** If a task description contains two independent verbs (e.g., "refactor" AND "add"), split into separate tasks. Test: could the second action be verified independently if the first were skipped?

## ⛔ FORBIDDEN Actions

The following actions are **critical phase violations**. If you catch yourself doing any of these, STOP immediately and notify the operator:

- ⛔ **Editing source code files** (e.g., `.tsx`, `.ts`, `.js`, `.css`, `.json`)
- ⛔ **Creating `research.md`** or modifying it
- ⛔ **Running formatters, linters, or test suites** on project code
- ⛔ **Implementing any code changes** — your job is to plan, not to execute
- ⛔ **Creating any file** other than the target `plan.md`
- ⛔ **Proceeding to Implementation** without operator authorization

## Constraints

| Rule                  | Detail                                                                                                                                    |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Single artifact       | Only `plan.md` may be created or modified. **No exceptions.**                                                                             |
| No side-effects       | Creating any additional file (draft, note, checklist, code) is a **critical phase violation** — stop immediately and notify the operator. |
| No code edits         | You must NOT edit, format, lint, or run any source code file in the repository.                                                           |
| Template              | Follow the structure in `../resources/plan-template.md`.                                                                                  |
| Traceability          | Every task must reference the `research.md` section it derives from.                                                                      |
| Template completeness | All sections from `plan-template.md` must appear in `plan.md`. Empty or missing sections are a phase violation.                           |

## Validation — FACTS Criteria

Before declaring the plan complete, verify every task:

| Criterion    | Question                                                      |
| ------------ | ------------------------------------------------------------- |
| **Feasible** | Can this be implemented with available tools and constraints? |
| **Atomic**   | Is this task independently testable?                          |
| **Clear**    | Are the action and verification steps unambiguous?            |
| **Testable** | Are pass/fail criteria explicit?                              |
| **Scoped**   | Does the work stay within stated boundaries?                  |

If any criterion fails, revise the artifact before handing off.

## Pre-handoff Self-Audit

Before declaring Plan complete, perform these checks:

1. **Source traceability.** Verify every task has a Source field referencing research.md.
2. **Pass/Fail criteria.** Verify every task has explicit Pass/Fail criteria.
3. **Safe State defined.** Confirm Safe State is defined in Section 1.
4. **Template completeness.** Confirm all 5 template sections are present and non-empty.

## Handoff

> ⛔ Reminder: Your ONLY output is `plan.md`. Do NOT proceed to implementation. Do NOT edit any code.

When `plan.md` is complete and passes FACTS:
- Inform the operator that Plan is done and the Implement phase can begin.
- **STOP HERE.** Do **not** start implementing yourself. Do **not** edit any source files.
- Your session is complete. Wait for the operator to initiate the next phase.
