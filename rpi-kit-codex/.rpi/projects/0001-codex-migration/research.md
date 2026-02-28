# Research: codex-migration (OpenAI Codex compatibility)

## 1. Problem Statement Analysis

**Trigger / request (authoritative):** The repository was originally created to implement an RPI workflow using custom instructions and Agent Skills for GitHub Copilot / VS Code. The request is to refactor the repo so it can be adapted to be compatible with OpenAI Codex, and it does **not** need to remain compatible with VS Code; the goal is “one repository for agent.” (User request — 2026-02-11)

**What is being investigated (facts):**
- This repository is packaged as an “RPI Kit” intended to be copied into other repositories via an installer. (README.md — “RPI Kit”; install.js)
- The kit currently includes: governance (`AGENTS.md`), skills under `.agents/skills/`, RPI docs under `.rpi/docs/`, and CI validation under `.github/workflows/`. (INVENTORY.md; .github/workflows/rpi-validate.yml; .rpi/docs/rpi-workflow.md)

**Update (implementation):** Skills have been migrated to `.agents/skills/`, and VS Code/Copilot-specific artifacts (including `.vscode/` and legacy `.github/` instruction/prompt/skill directories) have been removed.

**Why it matters (facts):** Codex and VS Code/Copilot have different discovery and configuration mechanisms for:
- Persistent instruction files (Codex uses `AGENTS.md` layering and overrides). (https://developers.openai.com/codex/guides/agents-md)
- Skills storage/discovery paths and optional metadata. (https://developers.openai.com/codex/skills)

**Non-goals explicitly stated by the request:** Keeping this repo compatible with VS Code is not required, and VS Code-specific files should be removed. (User request — 2026-02-11)

## 2. Conceptual Scope

This refactor touches (conceptually) the following systems, formats, and conventions:

- **RPI workflow artifacts (repo-defined):**
  - Governance and phase boundaries via `AGENTS.md` and `.rpi/AGENTS.md`. (AGENTS.md)
  - Phase constraints scoped to `.rpi/projects/**/research.md` and `.rpi/projects/**/plan.md`. (AGENTS.md; .rpi/docs/rpi-workflow.md)

- **Instruction discovery mechanisms:**
  - **Current kit** emphasizes VS Code/Copilot instruction files (`.github/copilot-instructions.md`, `*.instructions.md`) and a VS Code setting to enable instruction files. (.github/copilot-instructions.md; .rpi/docs/custom-instructions.md; .vscode/settings.json)
  - **Codex** builds an instruction chain by reading `AGENTS.md` / `AGENTS.override.md` at global and project scopes, concatenating files from repo root down to the current working directory, with precedence for files closer to the working directory and a size cap (`project_doc_max_bytes`). (https://developers.openai.com/codex/guides/agents-md)

- **Skills format and discovery:**
  - The repository includes multiple Agent Skills under `.agents/skills/` and documentation describing skill structure and `SKILL.md` frontmatter. (.rpi/docs/agent-skills.md; .agents/skills/rpi-workflow/SKILL.md; .agents/skills/skill-manager/SKILL.md)
  - The Agent Skills specification defines skills as a directory containing at minimum `SKILL.md`, with required frontmatter fields `name` and `description`, and optional directories like `scripts/`, `references/`, and `assets/`. (https://agentskills.io/specification; https://agentskills.io/what-are-skills)
  - Codex documents repository skill scanning under `.agents/skills` (walking from current directory up to repo root) and mentions an optional `agents/openai.yaml` file for UI metadata and dependency declarations. (https://developers.openai.com/codex/skills)

- **Installation/packaging:**
  - The kit provides an installer (`install.js`, `install.sh`) that copies a fixed set of roots (`.agents/`, `.rpi/`, and `AGENTS.md`) and scans `.agents/skills` and `.rpi/docs` for local links to include referenced resources. (install.js; README.md — “Dependency Discovery”)

- **Repository validation/automation:**
  - A GitHub Actions workflow validates presence and structure of RPI artifacts and Codex-centric skill layout expectations. (.github/workflows/rpi-validate.yml)

## 3. System Constraints

**Constraints from the request:**
- **Compatibility target changes:** OpenAI Codex compatibility is required; VS Code compatibility is optional and may be dropped. (User request — 2026-02-11)
- **Removal requirement:** VS Code-specific files should be removed from the refactored repo. (User request — 2026-02-11)
- **Repository goal:** Maintain a single repository as “one repository for agent.” (User request — 2026-02-11)
- **Validation requirement:** CI must be updated to validate Codex-centric artifacts (instead of VS Code/Copilot-centric assumptions). (User request — 2026-02-11)

**Constraints from current repo tooling and conventions (facts):**
- **Project directory naming convention:** The validation workflow enforces that `.rpi/projects/*/` directories containing `research.md` or `plan.md` must be prefixed with `NNNN-` (4 digits and a dash), with a small legacy allowlist. (.github/workflows/rpi-validate.yml — “Validate RPI project naming”; .rpi/docs/rpi-workflow.md — “Create a New RPI Project”)
- **Installer copy roots are fixed:** `install.js` includes `.agents/`, `.rpi/`, and `AGENTS.md` as install roots and explicitly skips copying `.github/workflows/`. (install.js)
- **Skill location assumptions exist across docs/scripts:** Multiple files assume skills live under `.agents/skills/` (and in some docs, alternative tool-specific locations are mentioned). (INVENTORY.md; .rpi/docs/agent-skills.md; .agents/skills/skill-manager/SKILL.md; .github/workflows/rpi-validate.yml)
- **VS Code-specific hooks exist:**
  - There is a VS Code setting enabling instruction files for Copilot Chat. (.vscode/settings.json)
  - Documentation and helper scripts explicitly instruct how to verify VS Code has loaded instructions/skills. (.rpi/docs/rpi-workflow.md — “VS Code Load Checks”; .rpi/scripts/check-vscode-load.sh)

**Constraints from external specs (facts):**
- **Codex instruction layering order and file precedence** is defined (global + project scope, override files, size limits). (https://developers.openai.com/codex/guides/agents-md)
- **Codex skill discovery paths** include `.agents/skills` plus optional `agents/openai.yaml`. (https://developers.openai.com/codex/skills)
- **Codex skill discovery paths** include `.agents/skills` plus optional `agents/openai.yaml`. (https://developers.openai.com/codex/skills)
- **Agent Skills format requirements** must be preserved for interoperability (frontmatter rules, directory matching). (https://agentskills.io/specification)

## 4. Existing Patterns and Exemplars

**A. Governance and phase gating**
- Root governance is defined in `AGENTS.md` and duplicated in `.rpi/AGENTS.md` (CI checks they are identical). (AGENTS.md; .github/workflows/rpi-validate.yml)
- Phase prompts exist as `.github/prompts/rpikit.*.prompt.md`. (.github/workflows/rpi-validate.yml — “Validate prompt entry points”)

**B. Skills as first-class artifacts (current repo layout)**
- Skills live under `.agents/skills/` with `SKILL.md` frontmatter and optional resources/scripts. (INVENTORY.md; .agents/skills/rpi-workflow/SKILL.md; .agents/skills/skill-manager/SKILL.md)
- The repo includes a skill-spec summary referencing core Agent Skills constraints and progressive disclosure. (.agents/skills/skill-manager/references/skill-spec-summary.md)

**C. RPI documentation and VS Code integration**
- `.rpi/docs/` contains documentation focused on VS Code custom agents and instruction file types, including a description of `AGENTS.md` usage within VS Code. (.rpi/docs/custom-agents.md; .rpi/docs/custom-instructions.md)
- A helper script exists specifically to guide VS Code “Customization Diagnostics” checks. (.rpi/scripts/check-vscode-load.sh)

**D. Installer approach**
- The installer copies files from `.agents/`, `.rpi/`, and `AGENTS.md` into a target repository, and performs link-based dependency discovery inside `.agents/skills` and `.rpi/docs`. (install.js; README.md — “Dependency Discovery”)

**E. Prior RPI project artifacts (exemplar)**
- A prior RPI project exists under `.rpi/projects/0001-rpikit/` with `research.md` and `plan.md` demonstrating artifact usage in this repo. (.rpi/projects/0001-rpikit/research.md; .rpi/projects/0001-rpikit/plan.md)

## 5. Validation — FAR Criteria

**Factual:** Yes — claims are grounded in repo file citations or the provided external documentation URLs. (AGENTS.md; README.md; INVENTORY.md; install.js; .github/workflows/rpi-validate.yml; https://developers.openai.com/codex/guides/agents-md; https://developers.openai.com/codex/skills; https://agentskills.io/specification)

**Actionable:** Yes — this research identifies concrete decision points a Plan must address without prescribing the implementation, including:
- Which instruction discovery mechanism(s) will be canonical in the refactored repo (Codex `AGENTS.md` layering vs VS Code/Copilot instruction files). (.rpi/docs/custom-instructions.md; https://developers.openai.com/codex/guides/agents-md)
- Where skills should live to be discoverable by Codex (and how that interacts with legacy conventions and tooling). (install.js; https://developers.openai.com/codex/skills)
- Which installer/CI validations are currently tied to VS Code-specific assumptions. (.github/workflows/rpi-validate.yml; .rpi/scripts/check-vscode-load.sh)

**Relevant:** Yes — all findings relate to migrating a Copilot/VS Code-oriented RPI kit repo toward OpenAI Codex compatibility and understanding the current repo’s constraints/patterns. (User request — 2026-02-11)

## 6. Notes on Unknowns

Unknowns that require clarification or additional discovery before planning:

- **Codex configuration expectations for this repo:** Whether the target environment will rely on Codex defaults (e.g., instruction size limit `project_doc_max_bytes`) or a committed configuration file (not found during this research) to customize instruction fallback filenames and byte limits. (https://developers.openai.com/codex/guides/agents-md)

- **Skill discovery path decisions:** Codex documents `.agents/skills` scanning. This kit has been migrated to that layout, but the strictness of required vs optional Codex artifacts remains a policy choice encoded in CI. (INVENTORY.md; install.js; https://developers.openai.com/codex/skills)

- **Passing criteria details for updated CI:** Current CI validates VS Code artifacts exist and checks Copilot-centric file locations. While CI must be updated for Codex artifacts, the exact acceptance criteria (which Codex artifacts are required vs optional, and how strict validation should be) remain unspecified. (.github/workflows/rpi-validate.yml; https://developers.openai.com/codex/guides/agents-md; https://developers.openai.com/codex/skills; User request — 2026-02-11)

---

**Research-only statement:** This document records facts, constraints, existing patterns, and open unknowns for the requested Codex migration. It does not propose implementation solutions or a plan.
