---
name: rpi-workflow
description: Assist with Research → Plan → Implement workflow by providing templates, validation guidance, and phase transition helpers for systematic software development.
---

# RPI Workflow Skill

This skill helps agents and operators navigate the Research → Plan → Implement (RPI) pattern for systematic software development.

## Usage

Invoke this skill when:

- **Starting a new RPI project** - Need templates and structure for research/plan artifacts.
- **Transitioning between phases** - Ensuring proper handoff criteria are met.
- **Validating artifacts** - Checking research.md against FAR criteria or plan.md against FACTS criteria.
- **Understanding phase constraints** - Learning what's allowed/forbidden in each phase.

### Phase-Specific Guidance

**Research Phase:**
- Produce `.rpi/projects/<project-id>/research.md` following the template.
- Maintain read-only posture—no solution proposals.
- Cite all sources inline (e.g., `source.md — Section 2`).
- Validate against FAR: Factual, Actionable, Relevant.
- **You MUST NOT create or modify any file other than `research.md`. Producing any additional artifact—markdown, draft, note, checklist, or implementation file—is a critical phase violation. Stop immediately and report to the operator.**

**Plan Phase:**
- Produce `.rpi/projects/<project-id>/plan.md` following the template.
- Reference facts from `research.md`—no unsupported assumptions.
- Decompose into atomic tasks with pass/fail verification.
- Validate against FACTS: Feasible, Atomic, Clear, Testable, Scoped.
- **You MUST NOT create or modify any file other than `plan.md`. Producing any additional artifact is a critical phase violation. Stop immediately and report to the operator.**

**Implement Phase:**
- Execute tasks from `plan.md` sequentially.
- Mark tasks complete only after verification passes.
- Halt and recurse to Plan if task is impossible.
- Create `.rpi/projects/<project-id>/SIGNOFF` when all tasks complete.

## Scripts

### RPI Project Scaffolder

Location: `.github/skills/rpi-workflow/scripts/rpi-new.sh`

Creates a new RPI project directory structure with a date prefix (yyyymmdd).

**Usage:**
```bash
bash .github/skills/rpi-workflow/scripts/rpi-new.sh "Project Title"
```

**What it does:**
- Validates `.rpi/` directory exists in repository root
- Calculates a date prefix (e.g., `20260213`)
- Creates `.rpi/projects/yyyymmdd-project-slug/research.md` with standard template
- Generates URL-friendly slug from project title

**Dependencies:**
- Bash shell (standard on macOS/Linux)
- No Node.js or package manager dependencies

**Example:**
```bash
# Creates .rpi/projects/20260213-authentication-refactor/research.md
bash .github/skills/rpi-workflow/scripts/rpi-new.sh "Authentication Refactor"
```

## Project Reuse Policy

> **Every session starts with a new project folder.** Never reuse an existing `.rpi/projects/` folder unless the operator explicitly authorizes it.

### Rules

1. **Pre-flight scan:** Before writing any artifact, list `.rpi/projects/` and check for folders with a similar slug.
2. **Match found — stop and report:** If a potentially related folder is found, report:
   - Folder name and date prefix
   - Which artifacts exist (`research.md`, `plan.md`, `SIGNOFF`)
   - Whether the project is finalized (has `SIGNOFF`)
   Then **stop and wait** for operator instruction.
3. **Reuse requires explicit authorization:** The operator must say `reuse project <project-id>` or `continue project <project-id>`. Vague similarity is never enough.
4. **Fresh start:** If the operator wants a new session on the same topic, direct them to run the scaffolder to create a new dated folder. Do not write to the old folder.
5. **Never overwrite silently:** Even when reuse is authorized, do not overwrite an artifact without stating which file will be modified and receiving confirmation.

### When Reuse Is Authorized

If the operator explicitly says to reuse a project:
- Confirm which artifacts may be modified (e.g., "updating `plan.md` only").
- Read the existing artifacts first before writing.
- Preserve any content the operator has not asked to change.

## Resources

- [Research Template](resources/research-template.md) - Boilerplate structure for research.md files.
- [Plan Template](resources/plan-template.md) - Boilerplate structure for plan.md files.
- [Prompt Examples](resources/prompts/plan-example.md) - Sample prompts for phase transitions.
- [Validation Guide](resources/validation/README.md) - How to check FAR and FACTS criteria.

## Technical Notes

This skill works with:
- **Global instructions:** `.github/copilot-instructions.md` (RPI constitution)
- **Scoped instructions:** `.github/instructions/*.instructions.md` (phase-specific constraints)
- **Governance:** `AGENTS.md` (role definitions and handoff rules)
- **Prompt entry points:** `.github/prompts/*.prompt.md` (operator UX helpers)

All artifacts are repository-backed and validated by CI (`.github/workflows/rpi-validate.yml`).
