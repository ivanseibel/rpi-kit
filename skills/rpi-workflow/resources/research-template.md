<!-- POSTURE: Describe what IS, never what SHOULD BE. Any sentence containing "should", "needs to", "must be changed to" is a solution leak — rephrase as an observation. -->
<!-- Citation format: `src/ui/Button.tsx — L15-30` (use em-dash separator). Every factual claim requires an inline citation. -->

# Research - <Project Name>

## 1) Problem Statement Analysis

- Trigger: <What initiated this research?>
- User Intent: <What outcome is actually needed?>
- Ambiguities & Open Questions: <Terms, assumptions, or unknowns that need clarification — describe the ambiguity, do NOT prescribe how to resolve it>

## 2) Code Archaeology / Blast Radius

- Entry Points: <Relevant routes/controllers/commands and paths>
- Core Logic: <Primary services/modules/functions involved>
- Data Models: <Schemas/contracts/storage entities involved>
- Tests: <Test files that exercise the affected code>
- Storybook/Docs: <Stories, documentation, or style guides that reference affected components>
- Other Consumers: <Other modules, pages, or services that import/depend on the affected code>

## 3) Conceptual Scope

- In Scope: <Item>
- Out of Scope: <Item>

## 4) System Constraints

- Hard Constraints: <Performance/compliance/runtime boundaries>
- Implicit Contracts: <Assumptions that must remain true>

## 5) Existing Patterns and Exemplars

- <file — Line X-Y> — <What pattern it demonstrates>

## 6) Validation - FAR Criteria

- [ ] Factual: Every claim has an inline citation. Counter-check: search for uncited sentences.
- [ ] Actionable: A planner could derive tasks from these facts without re-reading source code.
- [ ] Relevant: No section drifts beyond the stated problem. No solutions proposed.

## 7) Notes on Unknowns

- <Open question or runtime assumption>

<!-- ⛔ END OF RESEARCH PHASE — Do NOT proceed to planning. Do NOT create plan.md. Do NOT edit source code. Return control to the operator. -->
