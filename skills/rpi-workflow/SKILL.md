---
name: rpi-workflow
description: Deterministic Research → Plan → Implement workflow for systematic software development. Tool-agnostic — works with any AI agent.
---

# RPI Workflow

A deterministic three-phase workflow: **Research → Plan → Implement**. Each phase produces exactly one artifact. Phases are never skipped.

## ⛔ Critical Rule: ONE Phase Per Session

**Each agent session operates in exactly ONE phase.** You must NEVER transition between phases within a single session. When a phase is complete, STOP and inform the operator. The operator decides when to start the next phase.

**Phase collapse** — executing Research + Plan + Implement in one session — is the most severe workflow violation possible.

## Routing — Load Only the Current Stage

Follow this algorithm strictly:

1. **Determine which single phase** the operator is requesting (Research, Plan, or Implement).
2. **Read ONLY the corresponding stage file** from the table below.
3. **Follow ONLY those instructions.** Do NOT read other stage files.
4. **When the phase is complete, STOP** and inform the operator. Do NOT proceed to the next phase.

| Phase | Read this file | Artifact produced |
|-------|---------------|-------------------|
| Research | `stages/research.md` | `.rpi/projects/<id>/research.md` |
| Plan | `stages/plan.md` | `.rpi/projects/<id>/plan.md` |
| Implement | `stages/implement.md` | source code + `SIGNOFF` |

> **Token discipline:** Do NOT read stages you are not actively executing. Each stage file is self-contained with its own rules, constraints, and validation criteria.

## Bootstrap

Before any phase work, ensure the repository has RPI governance:

1. If `.rpi/AGENTS.md` is absent → create it from `resources/agents-md-template.md`.
2. If `.rpi/projects/` is absent → create `.rpi/projects/.gitkeep`.
3. Report what was created. If both exist, continue silently.

These are the only files the skill may create outside normal phase rules.

## Macro Rules

- **No phase skipping.** Research → Plan → Implement, always in order.
- **One phase per session.** Never execute multiple phases in a single turn or session. When a phase completes, STOP.
- **Single artifact per phase.** Research produces only `research.md`; Plan produces only `plan.md`.
- **Recurse on blockers.** If a phase hits an unresolvable issue, stop and return to the prior phase.
- **Never reuse project folders silently.** Scan `.rpi/projects/` for existing slugs; if found, stop and ask the operator before proceeding.

## Scaffolding Script

Create a new project directory:

```bash
bash ~/.agents/skills/rpi-workflow/scripts/rpi-new.sh "Project Title"
# or
bash ~/.gemini/antigravity/skills/rpi-workflow/scripts/rpi-new.sh "Project Title"
```

Creates `.rpi/projects/yyyymmdd-slug/research.md` from the research template.

## Resources

- [AGENTS.md Template](resources/agents-md-template.md) — Governance for `.rpi/AGENTS.md`
- [Research Template](resources/research-template.md) — Structure for `research.md`
- [Plan Template](resources/plan-template.md) — Structure for `plan.md`
- [Validation Guide](resources/validation-guide.md) — FAR and FACTS criteria reference
