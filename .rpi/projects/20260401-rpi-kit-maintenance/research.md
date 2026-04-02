<!-- POSTURE: Describe what IS, never what SHOULD BE. Any sentence containing "should", "needs to", or "must be changed to" is a solution leak — rephrase as an observation. -->
<!-- Citation format: `src/ui/Button.tsx — L15-30` (use em-dash separator). Every factual claim requires an inline reference. -->

# Research - rpi-kit maintenance

## 1) Problem Statement Analysis

- Trigger: The operator requested the Research phase of the `rpi-workflow` skill, which the SKILL router enforces as a single-phase session that only produces `research.md` and whose stage instructions explicitly forbid other artifacts (`skills/rpi-workflow/SKILL.md — L6-L62`; `skills/rpi-workflow/stages/research.md — L1-L82`).
- User Intent: The operator requested that research explicitly include the leftover path mismatch so downstream updates can cover the template and any other affected documentation/resources (`skills/rpi-workflow/resources/agents-md-template.md — L11-L15`).
- Ambiguities & Open Questions: Installer logic and repository governance now align on Copilot using `~/.copilot/skills/`, while at least one resource template and inventory documentation still contain `~/.agents/skills/` for Copilot/default language, creating an internal documentation mismatch that needs explicit tracking in this artifact (`install.js — L6-L10`; `install.js — L139-L145`; `AGENTS.md — L14-L14`; `skills/rpi-workflow/resources/agents-md-template.md — L11-L15`; `INVENTORY.md — L7-L11`; `INVENTORY.md — L29-L32`). The project-slug policy remains open because the scaffolder converts titles into date-prefixed slugs (`skills/rpi-workflow/scripts/rpi-new.sh — L22-L58`).

## 2) Code Archaeology / Blast Radius

- Entry Points: Agents begin in `skills/rpi-workflow/SKILL.md`, which enforces one phase per session, and the README’s quick-start commands invoke `install.sh` or `install.js` to install or refresh the skill set before any agent work occurs (`skills/rpi-workflow/SKILL.md — L6-L66`; `README.md — L7-L33`).
- Core Logic: The router plus the Research stage instructions together define the workflow by limiting execution to a single phase, forbidding solution proposals, and expecting only `research.md` (`skills/rpi-workflow/SKILL.md — L6-L62`; `skills/rpi-workflow/stages/research.md — L1-L82`).
- Data Models: Research artifacts are stored under `.rpi/projects/<id>/research.md`, and the shared template mandates the sections for problem analysis, blast radius, scope, constraints, exemplars, validation, and unknowns before new artifacts are rendered through the scaffolding script (`skills/rpi-workflow/stages/research.md — L10-L52`; `skills/rpi-workflow/resources/research-template.md — L1-L45`; `skills/rpi-workflow/scripts/rpi-new.sh — L22-L58`).
- Tests: Validation currently relies on manual execution of the installation scripts listed in the README’s quick start, so bootstrapping the skill set via `bash install.sh` or `node install.js` doubles as the rudimentary verification step (`README.md — L7-L33`).
- Storybook/Docs: Documentation includes the canonical RPI theory document and operational installer docs (`README.md`, `INVENTORY.md`) plus governance templates (`resources/agents-md-template.md`); these docs are the surfaces where Copilot path language is currently inconsistent (`README.md — L106-L131`; `INVENTORY.md — L5-L32`; `skills/rpi-workflow/resources/agents-md-template.md — L11-L15`).
- Other Consumers: The kit is intended for any AI agent (Copilot, Claude, Gemini, Cursor, Codex, etc.), and the scripts target specific skill roots such as `~/.agents/skills/` or `~/.gemini/antigravity/skills/`, so this workflow serves multiple runtimes (`README.md — L4-L33`; `skills/rpi-workflow/SKILL.md — L51-L62`).

## 3) Conceptual Scope

- In Scope: Maintaining the SKILL router, stage instructions, templates, and scaffolding that deliver the Research → Plan → Implement workflow is the repository’s focus, as shown by the project structure and the routing rules (`README.md — L34-L105`; `skills/rpi-workflow/SKILL.md — L6-L62`).
- In Scope: Aligning all installer-facing and governance-facing references for Copilot path semantics across templates and documentation is part of this maintenance scope because those files define consumer-facing behavior and generated artifacts (`install.js — L6-L10`; `README.md — L16-L24`; `INVENTORY.md — L7-L11`; `skills/rpi-workflow/resources/agents-md-template.md — L11-L15`; `AGENTS.md — L14-L14`).
- Out of Scope: There are no application services, Storybook stories, or test harnesses in the repo, so anything beyond the workflow scaffolding outlined in the README’s project tree is outside the stated scope (`README.md — L83-L105`).

## 4) System Constraints

- Hard Constraints: The Research stage instructions forbid editing other files, producing artifacts other than `research.md`, and proposing solutions, while the SKILL router requires a single phase per session and prevents stage collapse, so this investigation must stay descriptive and confined to the Research artifact (`skills/rpi-workflow/stages/research.md — L3-L82`; `skills/rpi-workflow/SKILL.md — L8-L49`).
- Implicit Contracts: Bootstrap assumes that `.rpi/AGENTS.md` and `.rpi/projects/.gitkeep` exist before work begins, the research template drives the artifact layout, and the scaffolding script depends on that template plus the date-slug convention to create new `.rpi/projects` directories (`skills/rpi-workflow/SKILL.md — L33-L62`; `README.md — L46-L59`; `skills/rpi-workflow/resources/research-template.md — L1-L45`; `skills/rpi-workflow/scripts/rpi-new.sh — L22-L58`).

## 5) Existing Patterns and Exemplars

- skills/rpi-workflow/resources/research-template.md — L1-L45 — The template enumerates the Problem Statement, Blast Radius, Scope, Constraints, Patterns, Validation, and Unknowns sections to keep research reports uniform across projects.
- skills/rpi-workflow/scripts/rpi-new.sh — L22-L58 — The scaffolder generates a date-prefixed slug, creates the `.rpi/projects/<slug>` directory, and renders the research template, showing the existing naming and structure used when new research projects are created.
- install.js — L6-L10 and L139-L145 — Installer behavior declares `~/.copilot/skills/` as the default target and maps `copilot` to `.copilot`, which acts as the operational source of truth for path resolution.
- skills/rpi-workflow/resources/agents-md-template.md — L11-L15 and INVENTORY.md — L7-L11 — Resource/template and inventory docs still include `.agents` references in Copilot/default context, demonstrating a documentation/template mismatch against the installer behavior.

## 6) Validation - FAR Criteria

- [x] Factual: Every observation cites repository sources, satisfying the instruction to ground statements in documented material (`skills/rpi-workflow/stages/research.md — L54-L72`).
- [x] Actionable: The facts highlight the installed skill entry points, templates, and governance requirements so a planner can extract next steps without re-reading everything (`README.md — L7-L131`; `skills/rpi-workflow/SKILL.md — L6-L66`).
- [x] Relevant: All sections concentrate on the rpi-workflow toolkit and its Research phase constraints, aligning with the Research phase mandate (`skills/rpi-workflow/stages/research.md — L1-L82`).

## 7) Notes on Unknowns

- Which files are the full authoritative set for user-facing install-path communication beyond the currently identified set (`README.md`, `INVENTORY.md`, `skills/rpi-workflow/resources/agents-md-template.md`, and skill docs), to ensure no additional stale `.agents` Copilot wording remains (`README.md — L16-L80`; `INVENTORY.md — L5-L32`; `skills/rpi-workflow/resources/agents-md-template.md — L11-L15`; `skills/rpi-workflow/SKILL.md — L35-L62`)?
- Is the date-prefixed slugging pattern from `skills/rpi-workflow/scripts/rpi-new.sh — L22-L58` the desired naming convention for `.rpi/projects/<id>` directories in this context?

<!-- ⛔ END OF RESEARCH PHASE — Do NOT proceed to planning. Do NOT create plan.md. Do NOT edit source code. Return control to the operator. -->