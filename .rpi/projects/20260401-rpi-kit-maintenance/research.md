<!-- POSTURE: Describe what IS, never what SHOULD BE. Any sentence containing "should", "needs to", or "must be changed to" is a solution leak — rephrase as an observation. -->
<!-- Citation format: `src/ui/Button.tsx — L15-30` (use em-dash separator). Every factual claim requires an inline reference. -->

# Research - rpi-kit maintenance

## 1) Problem Statement Analysis

- Trigger: The operator requested the Research phase of the `rpi-workflow` skill, which the SKILL router enforces as a single-phase session that only produces `research.md` and whose stage instructions explicitly forbid other artifacts (`skills/rpi-workflow/SKILL.md — L6-L62`; `skills/rpi-workflow/stages/research.md — L1-L82`).
- User Intent: The README frames the kit as a tool-agnostic workflow with quick-start installation commands, governance files, templates, and theoretical validation, so the intent is to capture that baseline state in this artifact for later planning (`README.md — L1-L131`; `skills/rpi-workflow/stages/research.md — L1-L72`).
- Ambiguities & Open Questions: The README documents default destinations such as `~/.agents/skills/` (and the `--tool`/`--target` options) while the operator now wants `~/.copilot/`, so clarification is needed on how the installer should honor the new location (`README.md — L16-L80`). The project-slug policy is also unclear, since the scaffolder converts the title into a date-prefixed slug before rendering the template (`skills/rpi-workflow/scripts/rpi-new.sh — L22-L58`).

## 2) Code Archaeology / Blast Radius

- Entry Points: Agents begin in `skills/rpi-workflow/SKILL.md`, which enforces one phase per session, and the README’s quick-start commands invoke `install.sh` or `install.js` to install or refresh the skill set before any agent work occurs (`skills/rpi-workflow/SKILL.md — L6-L66`; `README.md — L7-L33`).
- Core Logic: The router plus the Research stage instructions together define the workflow by limiting execution to a single phase, forbidding solution proposals, and expecting only `research.md` (`skills/rpi-workflow/SKILL.md — L6-L62`; `skills/rpi-workflow/stages/research.md — L1-L82`).
- Data Models: Research artifacts are stored under `.rpi/projects/<id>/research.md`, and the shared template mandates the sections for problem analysis, blast radius, scope, constraints, exemplars, validation, and unknowns before new artifacts are rendered through the scaffolding script (`skills/rpi-workflow/stages/research.md — L10-L52`; `skills/rpi-workflow/resources/research-template.md — L1-L45`; `skills/rpi-workflow/scripts/rpi-new.sh — L22-L58`).
- Tests: Validation currently relies on manual execution of the installation scripts listed in the README’s quick start, so bootstrapping the skill set via `bash install.sh` or `node install.js` doubles as the rudimentary verification step (`README.md — L7-L33`).
- Storybook/Docs: The README highlights `docs/The Research–Plan–Implement (RPI) Pattern in Complex Problem Solving and Collaboration` as the canonical reference for the FAR/FACTS criteria and phase separation, situating the kit within that documented study (`README.md — L106-L131`).
- Other Consumers: The kit is intended for any AI agent (Copilot, Claude, Gemini, Cursor, Codex, etc.), and the scripts target specific skill roots such as `~/.agents/skills/` or `~/.gemini/antigravity/skills/`, so this workflow serves multiple runtimes (`README.md — L4-L33`; `skills/rpi-workflow/SKILL.md — L51-L62`).

## 3) Conceptual Scope

- In Scope: Maintaining the SKILL router, stage instructions, templates, and scaffolding that deliver the Research → Plan → Implement workflow is the repository’s focus, as shown by the project structure and the routing rules (`README.md — L34-L105`; `skills/rpi-workflow/SKILL.md — L6-L62`).
- Out of Scope: There are no application services, Storybook stories, or test harnesses in the repo, so anything beyond the workflow scaffolding outlined in the README’s project tree is outside the stated scope (`README.md — L83-L105`).

## 4) System Constraints

- Hard Constraints: The Research stage instructions forbid editing other files, producing artifacts other than `research.md`, and proposing solutions, while the SKILL router requires a single phase per session and prevents stage collapse, so this investigation must stay descriptive and confined to the Research artifact (`skills/rpi-workflow/stages/research.md — L3-L82`; `skills/rpi-workflow/SKILL.md — L8-L49`).
- Implicit Contracts: Bootstrap assumes that `.rpi/AGENTS.md` and `.rpi/projects/.gitkeep` exist before work begins, the research template drives the artifact layout, and the scaffolding script depends on that template plus the date-slug convention to create new `.rpi/projects` directories (`skills/rpi-workflow/SKILL.md — L33-L62`; `README.md — L46-L59`; `skills/rpi-workflow/resources/research-template.md — L1-L45`; `skills/rpi-workflow/scripts/rpi-new.sh — L22-L58`).

## 5) Existing Patterns and Exemplars

- skills/rpi-workflow/resources/research-template.md — L1-L45 — The template enumerates the Problem Statement, Blast Radius, Scope, Constraints, Patterns, Validation, and Unknowns sections to keep research reports uniform across projects.
- skills/rpi-workflow/scripts/rpi-new.sh — L22-L58 — The scaffolder generates a date-prefixed slug, creates the `.rpi/projects/<slug>` directory, and renders the research template, showing how new research projects should be spun up with consistent naming and structure.

## 6) Validation - FAR Criteria

- [x] Factual: Every observation cites repository sources, satisfying the instruction to ground statements in documented material (`skills/rpi-workflow/stages/research.md — L54-L72`).
- [x] Actionable: The facts highlight the installed skill entry points, templates, and governance requirements so a planner can extract next steps without re-reading everything (`README.md — L7-L131`; `skills/rpi-workflow/SKILL.md — L6-L66`).
- [x] Relevant: All sections concentrate on the rpi-workflow toolkit and its Research phase constraints, aligning with the Research phase mandate (`skills/rpi-workflow/stages/research.md — L1-L82`).

## 7) Notes on Unknowns

- Should the installer’s destination logic be adjusted so that `~/.copilot/` replaces the documented defaults (`~/.agents/skills/` or `~/.gemini/antigravity/skills/`), given the operator’s new requirement (`README.md — L16-L80`)?
- Is the date-prefixed slugging pattern from `skills/rpi-workflow/scripts/rpi-new.sh — L22-L58` the desired naming convention for `.rpi/projects/<id>` directories in this context?

<!-- ⛔ END OF RESEARCH PHASE — Do NOT proceed to planning. Do NOT create plan.md. Do NOT edit source code. Return control to the operator. -->