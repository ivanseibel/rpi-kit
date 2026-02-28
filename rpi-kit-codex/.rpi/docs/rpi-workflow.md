# RPI Workflow: Operator Guide (Codex-centric)

This repository implements the Research → Plan → Implement (RPI) workflow as **repository-backed artifacts** plus **agent-discoverable skills**, designed to work with Codex-style instruction discovery.

## Quick Start

1. **Research**: produce `.rpi/projects/<project-id>/research.md` (facts only; cite sources)
2. **Plan**: produce `.rpi/projects/<project-id>/plan.md` (atomic tasks + verification)
3. **Implement**: execute the plan, tick checkboxes, and create `.rpi/projects/<project-id>/SIGNOFF`

### Create a new RPI project

Use the scaffolder script:

```bash
bash .agents/skills/rpi-workflow/scripts/rpi-new.sh "My Project"
```

This creates `.rpi/projects/yyyymmdd-my-project/research.md`, where `yyyymmdd` is the current date.

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

## Codex instruction entry points

- **Repository-wide governance and workflow rules:** `AGENTS.md`
- **Optional directory-scoped governance (kept identical for consistency):** `.rpi/AGENTS.md`

These replace the prior VS Code/Copilot instruction-file approach.

### Old → new mapping

| Legacy mechanism                                          | Replaced by                                                            |
| --------------------------------------------------------- | ---------------------------------------------------------------------- |
| `.github/copilot-instructions.md`                         | `AGENTS.md`                                                            |
| `.github/instructions/*.instructions.md` (with `applyTo`) | `AGENTS.md` (and optional directory-scoped `AGENTS.md`)                |
| `.github/prompts/*.prompt.md` entry points                | This operator guide + `.agents/skills/rpi-workflow/` scripts/resources |
| VS Code setting used to enable Copilot instruction files  | No VS Code setup required                                              |
| Skills under the legacy GitHub-scoped location            | Skills under `.agents/skills/<skill>/`                                 |
| VS Code “load checks” scripts/docs                        | CI validation + repo artifact presence                                 |

## Artifact locations

| Artifact        | Path                                 | Purpose                           |
| --------------- | ------------------------------------ | --------------------------------- |
| Instructions    | `AGENTS.md` (and `.rpi/AGENTS.md`)   | Governance + phase gates          |
| Skills          | `.agents/skills/<skill>/`            | On-demand workflows and resources |
| Phase artifacts | `.rpi/projects/<project-id>/*.md`    | Research and planning outputs     |
| Documentation   | `.rpi/docs/*.md`                     | RPI methodology reference         |
| CI validation   | `.github/workflows/rpi-validate.yml` | Automated invariant checks        |

## Phase transitions

- **Research → Plan:** research.md exists + FAR validated
- **Plan → Implement:** plan.md exists + FACTS validated + sign-off
- **Implement → Review:** plan tasks are `[x]` + CI green + SIGNOFF present

## Resources

- Skill details: `.agents/skills/rpi-workflow/SKILL.md`
- Research template: `.agents/skills/rpi-workflow/resources/research-template.md`
- Plan template: `.agents/skills/rpi-workflow/resources/plan-template.md`
- Validation guide: `.agents/skills/rpi-workflow/resources/validation/README.md`
