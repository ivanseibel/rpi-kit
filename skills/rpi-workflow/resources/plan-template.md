<!-- ALL SECTIONS BELOW ARE REQUIRED. Do not omit or merge sections. -->

# Plan - <Project Name>

## 1) Strategy and Scope

<!-- REQUIRED -->
### Approach
<Describe the chosen approach and why it aligns with research.md>

<!-- REQUIRED -->
### Trade-offs
<Why this approach was selected over alternatives>

<!-- REQUIRED -->
### Safe State
<Define what "working" means when implementation is complete>

<!-- REQUIRED -->
### In Scope
- <Item>

<!-- REQUIRED -->
### Out of Scope
- <Item>

## 2) Architectural Decomposition

- <Component or subsystem>

## 3) Atomic Task List

<!-- Atomicity test: If a task has two independent verbs (e.g., "refactor X AND add Y"), split it into separate tasks. Each task = one action + one verification. -->

[ ] Task 1 — <Name>
- Source: research.md — Section <X>
- Action: <What to change, in which file, at which location>
- Verify: <Exact command or manual step>
- Pass: <Observable success state>
- Fail: <Observable failure state>

## 4) Verification Plan

- Automated (CI): <What will CI check?>
- Manual/Local: <What to verify locally?>

## 5) Validation - FACTS Criteria

- [ ] Feasible: <For each task, confirm tools/access exist>
- [ ] Atomic: <Confirm each task has exactly one action and one verification>
- [ ] Clear: <Confirm no task requires the implementer to make design decisions>
- [ ] Testable: <Confirm every task has Pass/Fail criteria>
- [ ] Scoped: <Confirm no task exceeds the boundaries in Section 1>

<!-- ⛔ END OF PLAN PHASE — Do NOT proceed to implementation. Do NOT edit source code. Return control to the operator. -->
