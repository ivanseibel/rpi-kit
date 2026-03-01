# RPI Validation Guide

This guide summarizes the validation criteria for RPI artifacts, with concrete examples and anti-patterns.

## Research - FAR Criteria

### Factual
Statements are grounded in cited sources.

**Good:** "The `IconButton` component constructs class names via template literals (src/ui/IconButton.tsx — L47-48), which the Tailwind JIT compiler cannot detect at build time."

**Bad:** "The IconButton has some class name issues." *(No citation, no specificity.)*

### Actionable
Facts can inform planning decisions.

**Good:** "Tailwind's `safelist` config accepts regex patterns (tailwind.config.js — L12). The project currently safelists 0 patterns."

**Bad:** "Tailwind has some configuration options that could be relevant." *(Too vague to drive a planning decision.)*

### Relevant
Facts are directly related to the problem statement.

**Good:** "Only `IconButton` and `Badge` use dynamic class interpolation (grep results: 2 files matched `${.*variant}`)."

**Bad:** "The project uses React 18 with TypeScript and was created in 2023." *(True but unrelated to the problem.)*

## Plan - FACTS Criteria

### Feasible
Tasks can be completed with available tools and constraints.

**Good:** "Task requires editing `tailwind.config.js` to add a safelist entry — file is in the repo and not generated."

**Bad:** "Feasible because it's a straightforward change." *(No evidence of tool/access verification.)*

### Atomic
Each task is independently testable.

**Good:** "Task 1: Add safelist entry. Task 2: Migrate IconButton classes. Each can be verified in isolation."

**Bad:** "Task 1: Refactor IconButton and add safelist entries and update tests." *(Three actions in one task.)*

### Clear
Tasks and verification steps are unambiguous.

**Good:** "Action: In `tailwind.config.js`, add `'bg-(red|blue|green)-500'` to the `safelist` array at L12. Verify: Run `npx tailwind --content src/ui/IconButton.tsx` and confirm all 3 classes appear in output."

**Bad:** "Update the Tailwind config appropriately." *(Requires implementer to make design decisions.)*

### Testable
Pass/fail criteria are explicit.

**Good:** "Pass: `npm test -- --grep IconButton` exits 0 and all 12 assertions pass. Fail: Any assertion fails or exit code is non-zero."

**Bad:** "Verify that it works correctly." *(No observable criteria.)*

### Scoped
Work stays within the stated boundaries.

**Good:** "This task only modifies `tailwind.config.js`. No component files are changed."

**Bad:** "While we're at it, we should also refactor the Button component." *(Scope creep.)*

## Handoff Checks

- Research to Plan: research.md exists and FAR is validated.
- Plan to Implement: plan.md exists and FACTS is validated.
- Implement to Review: all tasks complete and SIGNOFF created.

## Common Violations

### Solution Leaking in Research

Research must describe WHAT the problem is, never HOW to fix it.

**Violation:** "The code needs to use a static class map instead of template literals to fix the Tailwind purge issue."

**Correct:** "The Tailwind JIT scanner does not detect dynamically interpolated class names. The current implementation in `IconButton.tsx` (L47-48) uses `bg-${color}-500` template syntax."

### Missing Traceability in Plan Tasks

Every plan task must reference the research section it derives from.

**Violation:**
```
[ ] Task 1 — Fix Tailwind classes
- Action: Update IconButton to use static classes
```

**Correct:**
```
[ ] Task 1 — Replace dynamic class interpolation in IconButton
- Source: research.md — Section 2 (Blast Radius)
- Action: In src/ui/IconButton.tsx at L47-48, replace template literal with class map lookup
```

### Composite Tasks That Should Be Split

Each task should have exactly one action and one verification.

**Violation:**
```
[ ] Task 1 — Refactor IconButton and update tests
- Action: Change class generation AND update test assertions
```

**Correct:**
```
[ ] Task 1 — Replace class interpolation in IconButton
- Action: Change class generation in src/ui/IconButton.tsx
- Verify: Component renders with correct classes

[ ] Task 2 — Update IconButton test assertions
- Action: Update assertions in src/ui/__tests__/IconButton.test.tsx
- Verify: npm test exits 0
```

### Generic FACTS/FAR Validation

Validation must be specific and per-criterion, not a rubber stamp.

**Violation:** "All FACTS criteria are met. The plan is feasible, atomic, clear, testable, and scoped."

**Correct:**
```
- [x] Feasible: All 4 tasks modify files in src/ui/ which are editable and not generated.
- [x] Atomic: Each task has one action verb — Task 1: replace, Task 2: add, Task 3: update, Task 4: remove.
- [x] Clear: Every task specifies file, line range, and exact change.
- [x] Testable: Tasks 1-3 have `npm test` pass/fail; Task 4 has visual regression check.
- [x] Scoped: No task touches files outside src/ui/ and tailwind.config.js.
```

## Phase Violation Examples

These are real-world failures where agents violated phase boundaries. Use them to recognize and prevent similar violations.

### Phase Collapse (Most Severe)

An agent received a Research-only request but executed all three phases in one turn.

**What happened:** The agent created `research.md`, then created `plan.md`, then edited `IconButton.tsx`, then ran `pnpm biome check --write` and `pnpm test` — all in a single session without operator authorization.

**What should have happened:** The agent should have created only `research.md`, validated it against FAR criteria, informed the operator that Research was complete, and STOPPED. The operator would then start a new session for the Plan phase.

### Code Edits During Research

**What happened:** During a Research session, the agent edited source code files and ran formatters/linters.

**What should have happened:** Research is a read-only phase. The agent may read any file but must not modify any file other than `research.md`. Running formatters, linters, or test suites is forbidden during Research.

### Scope Creep During Implementation

**What happened:** While implementing a targeted fix, the agent's formatter auto-modified unrelated files (e.g., import ordering in `src/actions/account.ts`), introducing changes outside the plan's scope.

**What should have happened:** The Implementer must limit changes to files explicitly covered by `plan.md` tasks. If a tool (formatter, linter) modifies unrelated files, the agent must revert those changes.

### Solution Leaking in Research

**What happened:** The research artifact stated: "converter a configuração dinâmica em dicionários de classes do Tailwind de modo literal" — this prescribes a specific solution.

**What should have happened:** Research describes WHAT the problem is: "The Tailwind JIT scanner does not detect dynamically interpolated class names in `IconButton.tsx` (L47-48). The `text-[${config.baseColor}]` syntax produces no output in the generated CSS."
