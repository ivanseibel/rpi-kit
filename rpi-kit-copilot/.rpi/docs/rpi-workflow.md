# RPI Workflow: Operator Guide

This document provides practical guidance for using the Research → Plan → Implement (RPI) workflow in this repository.

## Quick Start

The RPI workflow is a three-phase pattern for systematic software development:

1. **Research** - Read-only discovery; gather facts, cite sources, identify constraints
2. **Plan** - Atomic task decomposition; produce verifiable checklists with pass/fail criteria
3. **Implement** - Execute plan strictly; verify each task before marking complete

### Create a New RPI Project

Use the scaffolder to create a new project directory with the required date prefix:

```bash
bash .github/skills/rpi-workflow/scripts/rpi-new.sh "My Project"
```

This creates `.rpi/projects/yyyymmdd-my-project/research.md`, where `yyyymmdd` is the current date.

Note: There is no automatic hook to create project directories; running the scaffolder is an explicit step.

Note: The kit repository itself may contain example projects under `.rpi/projects/`, but the installer intentionally excludes `.rpi/projects/**` when copying into target repositories.

### Starting a New Session

> **Always create a new project folder for each session.** Do not reuse a previous folder unless you explicitly intend to continue that specific earlier project.

**Rules for agents and operators:**

1. Run the scaffolder at the start of each new Research session — it generates a fresh `yyyymmdd-<slug>/` folder.
2. Before writing any artifact, scan `.rpi/projects/` for folders with a similar slug.
3. If a related folder is found, **stop and report** it to the operator (folder name, artifact state, `SIGNOFF` presence). Do not write anything.
4. Reuse of an existing folder requires the operator to say explicitly:
   - `reuse project <project-id>` — to continue an in-progress project from an earlier session, or
   - `continue project <project-id>` — equivalent form.
5. Without that explicit instruction, always treat the incoming request as a **new** project and direct the operator to run the scaffolder.
6. **A SIGNOFF'd project is finished.** Reopen it only on explicit operator request; never auto-reuse a completed project.

## Artifact Locations

All RPI artifacts are repository-backed and version controlled:

| Artifact            | Path                                                | Purpose                                             |
| ------------------- | --------------------------------------------------- | --------------------------------------------------- |
| Global Instructions | `.github/copilot-instructions.md`                   | Repository-wide RPI constitution                    |
| Scoped Instructions | `.github/instructions/*.instructions.md`            | Phase-specific constraints (Research, Plan)         |
| Skills              | `.github/skills/rpi-workflow/`                      | RPI workflow helper skill with templates and guides |
| Governance          | `AGENTS.md`, `.rpi/AGENTS.md`                       | Agent roles, handoff rules, recursion protocol      |
| Prompt Entry Points | `.github/prompts/*.prompt.md`                       | Phase invocation templates                          |
| CI Validation       | `.github/workflows/rpi-validate.yml`                | Automated artifact structure checks                 |
| Phase Artifacts     | `.rpi/projects/<project-id>/research.md`, `plan.md` | Research and planning outputs                       |
| Documentation       | `.rpi/docs/*.md`                                    | RPI methodology reference                           |

## Using Prompt Files

Prompt files provide templates for invoking each phase:

**Research Phase:**
```bash
# Read the prompt template
cat .github/prompts/rpikit.research.prompt.md

# In VS Code Copilot Chat, invoke as:
# /rpikit.research
```

**Plan Phase:**
```bash
# After research.md is validated
cat .github/prompts/rpikit.plan.prompt.md

# Provide path to research.md as input
# Example: "Input: .rpi/projects/0001-my-project/research.md"

# In VS Code Copilot Chat, invoke as:
# /rpikit.plan
```

**Implement Phase:**
```bash
# After plan.md is validated and signed off
cat .github/prompts/rpikit.implement.prompt.md

# Provide path to plan.md as input
# Example: "Input: .rpi/projects/0001-my-project/plan.md"

# In VS Code Copilot Chat, invoke as:
# /rpikit.implement
```

## Phase Transitions

Transitions between phases require validation gates:

**Research → Plan:**
- ✅ `research.md` exists with all required sections
- ✅ FAR criteria validated (Factual, Actionable, Relevant)
- ✅ Planner acknowledges receipt

**Plan → Implement:**
- ✅ `plan.md` exists with FACTS validation
- ✅ All tasks have verification steps with pass/fail criteria
- ✅ Stakeholders and Implementer sign off

**Implement → Review:**
- ✅ All tasks in `plan.md` marked complete `[x]`
- ✅ CI validation passes
- ✅ `.rpi/projects/<project-id>/SIGNOFF` file created

## CI Validation

The repository includes automated validation via GitHub Actions:

**What CI Checks:**
- File presence (research.md, plan.md, AGENTS.md, etc.)
- YAML frontmatter correctness (applyTo in scoped instructions)
- Skill name format (lowercase, hyphens only)
- Prompt Input: line presence
- SIGNOFF file for implementation PRs

**Running CI:**
```bash
# CI runs automatically on push and pull_request
git add .
git commit -m "feat: add RPI artifacts"
git push

# Check status in GitHub Actions tab
```

**Local Pre-flight:**
```bash
# Verify artifact structure before pushing
./.rpi/scripts/check-vscode-load.sh
```

## Local-Only Scaffold Worktrees

If you want Copilot scaffold files available locally without committing them, use the root README section:

- `./README.md` (`Local-Only Worktree Setup`)

Helper script:

```bash
./.rpi/scripts/rpi-worktree-copilot.sh --help
```

## VS Code Load Checks

Verify that VS Code has loaded custom instructions and skills:

### Step 1: Open Customization Diagnostics

1. Open Command Palette (`Cmd+Shift+P` on macOS, `Ctrl+Shift+P` on Windows/Linux)
2. Search for **"Copilot Chat: Show Customization Diagnostics"**
3. Run the command

### Step 2: Check Loaded Artifacts

In the diagnostics output, verify:

**Custom Instructions:**
- ✅ `.github/copilot-instructions.md` (global)
- ✅ `.github/instructions/research.instructions.md` (scoped to `.rpi/**`)
- ✅ `.github/instructions/plan.instructions.md` (scoped to specific project)

**Skills:**
- ✅ `rpi-workflow` skill listed

### Step 3: Check Logs (If Issues Found)

If artifacts are missing or not loading:

1. Open **Help → Toggle Developer Tools**
2. Go to **Console** tab
3. Search for "instruction" or "skill" to find loading errors
4. Check log files:
   - macOS: `~/Library/Application Support/Code/logs/`
   - Linux: `~/.config/Code/logs/`
   - Windows: `%APPDATA%\Code\logs\`

**Common Issues:**

- **Instructions not loading:** Ensure `.vscode/settings.json` has `"github.copilot.chat.codeGeneration.useInstructionFiles": true`
- **Skill not found:** Verify YAML frontmatter in `SKILL.md` is correct (delimiter `---`, valid `name` and `description`)
- **applyTo not working:** Check glob patterns in scoped instruction frontmatter

## Recursion and Escalation

If an agent encounters a blocker:

**Minor Failure (Code Level):**
- Retry implementation of same task (max 3 attempts)
- Do not change the plan

**Major Failure (Plan Level):**
- Halt execution
- Document the blocker in an issue
- Recurse to Plan phase to update strategy

**Critical Failure (Research Level):**
- Halt execution
- Document fundamental limitation
- Recurse to Research phase or abort

## Agent Roles

See `AGENTS.md` for detailed role definitions. Summary:

| Role        | Can Edit                                        | Cannot Edit                                |
| ----------- | ----------------------------------------------- | ------------------------------------------ |
| Researcher  | `research.md`                                   | Solution proposals, `plan.md`, source code |
| Planner     | `plan.md`                                       | `research.md`, source code                 |
| Implementer | Source code, tests, update `plan.md` checkboxes | `research.md`, add tasks to `plan.md`      |

## Templates and Examples

**Research Template:**
- Location: `.github/skills/rpi-workflow/resources/research-template.md`
- Use when creating new `research.md` files

**Plan Template:**
- Location: `.github/skills/rpi-workflow/resources/plan-template.md`
- Use when creating new `plan.md` files (includes Approach, Trade-offs, Safe State)

**Prompt Example:**
- Location: `.github/skills/rpi-workflow/resources/prompts/plan-example.md`
- Shows how to invoke Plan phase

**Validation Guide:**
- Location: `.github/skills/rpi-workflow/resources/validation/README.md`
- Detailed FAR and FACTS criteria checklists

## Troubleshooting

**Q: Custom instructions not being followed?**
- Verify `.vscode/settings.json` has `useInstructionFiles: true`
- Check Customization Diagnostics to confirm files are loaded
- Ensure instruction files have correct YAML frontmatter

**Q: Skill not appearing in Copilot Chat?**
- Check `SKILL.md` frontmatter (delimiter `---`, `name:`, `description:`)
- Verify skill name matches directory name and regex `^[a-z0-9-]+$`
- Reload VS Code window

**Q: CI validation failing?**
- Run `./.rpi/scripts/check-vscode-load.sh` for diagnostic output
- Check workflow logs in GitHub Actions tab
- Verify artifact structure matches plan.md requirements

**Q: Phase transition blocked?**
- Ensure prior phase artifact exists and is validated
- Check handoff requirements in `AGENTS.md`
- Create SIGNOFF file for implementation completion

## Additional Resources

- **RPI Methodology Docs:** `.rpi/docs/` directory
  - [RPI Phase I: Research Protocol](rpi-research.md)
  - [RPI Phase II: Planning Doctrine](rpi-plan.md)
  - [RPI Phase III: Implementation Protocol](rpi-implement.md)
  - [The RPI Pattern: Research Study](rpi-pattern.md)

- **Governance:** `AGENTS.md` - Agent roles and handoff rules
- **Skill Details:** `.github/skills/rpi-workflow/SKILL.md`
- **Helper Script:** `.rpi/scripts/check-vscode-load.sh`

---

**Validation Date:** research.md validated: yes ([.rpi/projects/0001-implement-rpi-workflow/research.md](.rpi/projects/0001-implement-rpi-workflow/research.md))
