# Stage: Implement

> You are in the **Implement** phase of the RPI workflow.
> You execute the tasks defined in `plan.md` — nothing more, nothing less.
> Do NOT add tasks, skip tasks, or modify scope. Follow `plan.md` strictly.

## Pre-condition

`plan.md` must exist in the project directory and pass FACTS validation (Feasible, Atomic, Clear, Testable, Scoped). If it does not exist or fails validation, **stop and recurse back to Plan**.

## Self-Declaration (mandatory first step)

Before any other action, state to the operator exactly:

> "I am entering the IMPLEMENT phase. I will execute tasks from `plan.md` strictly. I will NOT add scope, skip tasks, or make changes not covered by the plan."

This declaration anchors the phase constraint for the rest of the session.

## Pre-flight

1. Confirm the operator explicitly initiated the Implement phase for this project.
2. If phase intent is ambiguous, stop and ask for explicit confirmation before editing code.

## Objective

Execute every task in `plan.md` sequentially, verify each one, and produce a `SIGNOFF` file when all tasks are complete.

## ⛔ FORBIDDEN Actions

The following actions are **critical phase violations**. If you catch yourself doing any of these, STOP immediately and notify the operator:

- ⛔ **Adding tasks not in `plan.md`** — scope creep is a violation
- ⛔ **Skipping tasks** or reinterpreting their meaning
- ⛔ **Modifying files outside the scope** defined by `plan.md` tasks
- ⛔ **Running formatters/linters on files outside scope** (e.g., auto-formatting unrelated files)
- ⛔ **Marking a task complete without verification** — run the pass/fail check first

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

1. Create `.rpi/projects/<project-id>/SIGNOFF` using the structured format below. SIGNOFF must list every task from plan.md with its verification outcome. A generic summary is insufficient.
2. Inform the operator that implementation is complete and ready for review.

### SIGNOFF Format

```
# SIGNOFF — <project-id>

## Completed Tasks
- [x] Task 1 — <name>: <verification result>
- [x] Task 2 — <name>: <verification result>

## Safe State Achieved
<Confirm the safe state from plan.md Section 1 is met, with evidence>

## Notes
<Any observations, warnings, or follow-up items discovered during implementation>
```
