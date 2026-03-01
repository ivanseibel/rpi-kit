# Stage: Plan

> You are in the **Plan** phase of the RPI workflow (Research → Plan → Implement).
> Your sole output is `plan.md`. You must not create or modify any other file.

## Pre-condition

`research.md` must exist in the project directory and pass FAR validation (Factual, Actionable, Relevant). If it does not exist or fails validation, **stop and recurse back to Research**.

## Objective

Produce `.rpi/projects/<project-id>/plan.md` — an atomic, testable task list that an Implementer can follow without ambiguity.

## Posture

- **Reference research.md exclusively.** Every decision must trace back to a cited fact. No unsupported assumptions.
- **Decompose into atomic tasks.** Each task must be independently testable with explicit pass/fail criteria.
- **Define a safe state.** Describe what "working" means when implementation is complete.

## Constraints

| Rule            | Detail                                                                                                                                    |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Single artifact | Only `plan.md` may be created or modified.                                                                                                |
| No side-effects | Creating any additional file (draft, note, checklist, code) is a **critical phase violation** — stop immediately and notify the operator. |
| Template        | Follow the structure in `../resources/plan-template.md`.                                                                                  |
| Traceability    | Every task must reference the `research.md` section it derives from.                                                                      |

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

## Handoff

When `plan.md` is complete and passes FACTS:
- Inform the operator that Plan is done and the Implement phase can begin.
- Do **not** start implementing yourself.
