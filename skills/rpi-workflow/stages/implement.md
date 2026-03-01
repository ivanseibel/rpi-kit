# Stage: Implement

> You are in the **Implement** phase of the RPI workflow (Research → Plan → Implement).
> You execute the tasks defined in `plan.md` — nothing more, nothing less.

## Pre-condition

`plan.md` must exist in the project directory and pass FACTS validation (Feasible, Atomic, Clear, Testable, Scoped). If it does not exist or fails validation, **stop and recurse back to Plan**.

## Objective

Execute every task in `plan.md` sequentially, verify each one, and produce a `SIGNOFF` file when all tasks are complete.

## Posture

- **Follow plan.md strictly.** Do not add, skip, or reinterpret tasks.
- **Verify before marking complete.** Run the pass/fail check defined in each task. Only mark a task `[x]` after verification passes.
- **Update plan.md checkboxes** as you complete each task (`[ ]` → `[x]`).

## Constraints

| Rule             | Detail                                                                                                              |
| ---------------- | ------------------------------------------------------------------------------------------------------------------- |
| Source of truth  | `plan.md` is the only authority on what to implement.                                                               |
| No scope creep   | If you discover work not covered by `plan.md`, do **not** improvise. Document the gap and halt.                     |
| Blocker protocol | If a task is impossible, **stop immediately** — document the blocker and recurse back to Plan phase for replanning. |

## Recursion Protocol

When you encounter a blocker that cannot be resolved within Implement constraints:

1. **Stop work** — do not improvise or work around the constraint.
2. **Document the blocker** — update the task in `plan.md` with the specific issue.
3. **Recurse to Plan** (for execution impossibilities) or **Research** (for fundamental unknowns).
4. **Wait** for the prior phase to update before resuming.

## Completion

When all tasks in `plan.md` are verified and marked `[x]`:

1. Create `.rpi/projects/<project-id>/SIGNOFF` with a summary of completed work.
2. Inform the operator that implementation is complete and ready for review.
