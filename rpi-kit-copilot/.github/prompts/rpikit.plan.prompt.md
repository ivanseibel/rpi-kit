````prompt
# RPI Plan Prompt

**Input:** `.rpi/projects/<project-id>/research.md`

Phase: plan
Role: Planner

Instructions:
- Load and reference facts from the provided `research.md`.
- Start from `.github/skills/rpi-workflow/resources/plan-template.md`.
- Preserve template sections, including Strategy and Scope fields: Approach, Trade-offs, Safe State, In Scope, Out of Scope.
- Produce atomic tasks with explicit verification and pass/fail criteria.
- Validate FACTS criteria before completing.

Required output:
- `.rpi/projects/<project-id>/plan.md` aligned to the plan template and scoped instruction rules.

Process:
1. Confirm the `research.md` path/project is provided and readable.
2. Generate `.rpi/projects/<project-id>/plan.md` from the template.
3. Reference research facts in plan decisions and tasks.
4. If `research.md` path/project is missing, ask one clarifying question and stop.

Do NOT start Implementation work in this phase. The ONLY file you are permitted to write is `plan.md`. Producing any other artifact is a critical phase violation; stop immediately and notify the operator.
````
