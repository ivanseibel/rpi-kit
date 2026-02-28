# Plan: codex-migration (OpenAI Codex compatibility)

## 1. Strategy and Scope

**Goal:** Refactor this repository from a VS Code/Copilot-oriented RPI kit into a Codex-compatible “one repository for agent” layout, explicitly dropping VS Code compatibility and removing VS Code-specific files. (research.md — Section 1; Section 3)

**Strategy (grounded in research facts):**
- Use Codex’s instruction layering mechanism centered on `AGENTS.md` / `AGENTS.override.md` and precedence-by-directory rules as the canonical instruction discovery path. (research.md — Section 2 “Instruction discovery mechanisms”; Section 3 “Constraints from external specs”)
- Align skill discovery with Codex’s documented repository scanning under `.agents/skills` and keep skills compliant with the Agent Skills format requirements (`SKILL.md` frontmatter with `name` and `description`, etc.). (research.md — Section 2 “Skills format and discovery”; Section 3 “Constraints from external specs”)
- Remove VS Code-specific hooks and artifacts (e.g., `.vscode/settings.json` and VS Code load-check scripts/docs) because the request explicitly states VS Code compatibility is not required and should be removed. (research.md — Section 1 “Non-goals”; Section 3 “Removal requirement”; Section 3 “VS Code-specific hooks exist”)
- Update installer and CI validations because both currently assume VS Code/Copilot-centric roots/paths (e.g., `.vscode/`, `.agents/skills/` path changes, and CI checks for `.vscode/settings.json`). (research.md — Section 2 “Installation/packaging”; Section 2 “Repository validation/automation”; Section 3 “Installer copy roots are fixed”; Section 3 “Validation requirement”)

**In scope:**
- Repository layout changes needed for Codex instruction/skill discovery.
- Removal of VS Code-specific files, scripts, and documentation.
- Updating installer behavior and CI validation to reflect Codex-centric artifacts.

**Out of scope (explicitly constrained by research unknowns):**
- Tuning Codex instruction size limits / fallback filenames via an unverified config file, unless such a file is discovered and its semantics are confirmed. (research.md — Section 6 “Codex configuration expectations”)

## 2. Architectural Decomposition

**A. Instructions (Codex-compatible)**
- Root and directory-scoped `AGENTS.md` / `AGENTS.override.md` instruction chain. (research.md — Section 2 “Codex builds an instruction chain…”) 

**B. Skills (Codex-compatible + Agent Skills spec)**
- Skills directory under `.agents/skills/<skill-name>/SKILL.md` (+ optional `scripts/`, `references/`, `assets/`). (research.md — Section 2 “Codex documents… .agents/skills”; Section 2 “Agent Skills specification…”) 

**C. Installer / packaging**
- Copy roots and dependency discovery logic updated away from `.vscode/` and legacy GitHub-scoped skill-location assumptions. (research.md — Section 2 “Installation/packaging”; Section 3 “Installer copy roots are fixed”) 

**D. CI / validation**
- Validation updated to check Codex-centric artifacts and remove checks that require VS Code artifacts. (research.md — Section 3 “Validation requirement”; Section 2 “Repository validation/automation”) 

**E. Documentation**
- `.rpi/docs/` updated to describe Codex instruction layering and skill discovery; remove VS Code-specific guidance and diagnostics. (research.md — Section 3 “VS Code-specific hooks exist”; Section 4 “RPI documentation and VS Code integration”) 

## 3. Atomic Task List

[x] Task 1 — Inventory VS Code-specific artifacts to remove (research.md — Section 1; Section 3)
- Action: Enumerate files/docs/scripts that are explicitly VS Code-specific (e.g., `.vscode/`, VS Code load-check docs, VS Code diagnostics scripts) and list them in the PR/commit description or an internal checklist for the implementer.
- Owner: TBD
- Outputs: Removal checklist (in PR description or a tracked checklist in the repo)
- Effort: Small
- Verification: Confirm each item is explicitly VS Code-specific by referencing where it’s cited/used in repo docs/scripts. Pass: Every removal target has an explicit repo reference or a clear VS Code-only purpose. Fail: Any removal target lacks justification or appears tool-agnostic.

[x] Task 2 — Define Codex-canonical instruction entry points (research.md — Section 2; Section 3)
- Action: Decide and document the minimal required instruction files for Codex compatibility (at least root `AGENTS.md`; optional directory-scoped `AGENTS.md` where needed) and how they replace VS Code/Copilot instruction file usage.
- Owner: TBD
- Outputs: Documented canonical instruction entry points; mapping from old instruction sources to new Codex instruction locations
- Effort: Medium
- Verification: Map each instruction concern currently covered by Copilot/VS Code instruction files to its new Codex instruction location. Pass: No critical instruction category is left unmapped. Fail: Any instruction requirement remains only in VS Code/Copilot-specific files.

[x] Task 3 — Migrate or relocate skills to `.agents/skills` (research.md — Section 2; Section 3)
- Action: Move skills from the legacy GitHub-scoped location into `.agents/skills/` (or otherwise align with Codex’s documented scanning path), preserving Agent Skills spec requirements.
- Owner: TBD
- Outputs: Skills present under `.agents/skills/<skill>/SKILL.md` with required frontmatter preserved
- Effort: Medium
- Verification: For each skill directory, verify `SKILL.md` exists and includes required frontmatter (`name`, `description`). Pass: All skills are discoverable under `.agents/skills` and retain valid frontmatter. Fail: Any skill is missing required frontmatter or is not discoverable under `.agents/skills`.

[x] Task 4 — Decide handling of existing `.agents/skills` path assumptions (docs/scripts/CI/installer) (research.md — Section 3 “Skill location assumptions…”) 
- Action: Update internal references (docs, scripts, CI, installer) that assume the legacy GitHub-scoped skill location to the new Codex skill path (`.agents/skills/`).
- Owner: TBD
- Outputs: Updated references across docs/scripts/CI/installer
- Effort: Medium
- Verification: Search repo for references to the legacy skill path and confirm they are updated or removed. Pass: No remaining prescriptive references that would cause drift or confusion (CI may still contain negative assertions to prevent the legacy directory from being reintroduced). Fail: Stale prescriptive references remain.

[x] Task 5 — Remove `.vscode/` and VS Code enablement/settings (research.md — Section 3 “VS Code-specific hooks exist”; Section 1 “Non-goals”) 
- Action: Remove `.vscode/settings.json` and any other VS Code-specific configuration files.
- Owner: TBD
- Outputs: `.vscode/` directory removed (or empty and deleted); no remaining VS Code settings required for operation
- Effort: Small
- Verification: Ensure the repository no longer contains `.vscode/` directory (or any VS Code settings explicitly used to enable instruction files). Pass: `.vscode/` does not exist and no docs depend on it. Fail: `.vscode/` still present or referenced as required.

[x] Task 6 — Update `.rpi/docs/` to be Codex-centric; remove VS Code diagnostics content (research.md — Section 4 “RPI documentation and VS Code integration”; Section 3)
- Action: Rewrite or prune docs that instruct VS Code-specific “load checks” and “Customization Diagnostics”, replacing them with Codex instruction/skills discovery guidance based on Codex docs cited in research.
- Owner: TBD
- Outputs: Updated `.rpi/docs/*` content with Codex-centric guidance; removed VS Code-only diagnostics references
- Effort: Medium
- Verification: Validate docs no longer mention VS Code-only steps (unless explicitly framed as historical/removed). Pass: Docs contain Codex-centric instructions and remove VS Code-only verification steps. Fail: Docs still instruct VS Code configuration or checks.

[x] Task 7 — Update installer roots and dependency discovery paths (research.md — Section 2 “Installation/packaging”; Section 3 “Installer copy roots are fixed”) 
- Action: Modify installer (`install.js`, `install.sh`) to copy Codex-relevant roots (including `.agents/` if adopted) and stop copying VS Code roots (e.g., `.vscode/`). Update dependency discovery so it scans the new skill locations and any new instruction locations.
- Owner: TBD
- Outputs: Updated installer scripts; installer copies Codex-relevant roots and excludes VS Code roots
- Effort: Medium
- Verification: Run installer in a temporary target directory and confirm expected roots are copied and VS Code-specific roots are not. Pass: Copied set matches the new canonical layout; no `.vscode/` is copied. Fail: Missing Codex artifacts or lingering VS Code artifacts.

[x] Task 8 — Update CI validation workflow to Codex-centric checks (research.md — Section 3 “Validation requirement”; Section 2 “Repository validation/automation”) 
- Action: Replace CI checks that require VS Code artifacts (e.g., `.vscode/settings.json`) and legacy skills-directory structure with checks for Codex-centric artifacts (e.g., presence of `AGENTS.md`, `.agents/skills` contents).
- Owner: TBD
- Outputs: Updated CI workflow checks aligned to Codex-centric artifacts
- Effort: Medium
- Verification: Run workflow checks locally (or via CI) and confirm it passes on the refactored repo while failing when required Codex artifacts are removed. Pass: CI enforces Codex-centric invariants. Fail: CI still enforces VS Code invariants or misses Codex artifacts.

[x] Task 9 — Reconcile governance duplication (`AGENTS.md` vs `.rpi/AGENTS.md`) with Codex layering (research.md — Section 4 “Governance and phase gating”; Section 2 “Codex builds an instruction chain…”) 
- Action: Decide whether `.rpi/AGENTS.md` remains necessary under Codex instruction layering; update validations accordingly (keep identical files, or remove/replace the duplicate and update CI).
- Owner: TBD
- Outputs: Chosen governance file strategy; updated CI/doc references to match
- Effort: Small
- Verification: Confirm whichever governance model is chosen is consistently enforced by CI and docs. Pass: No conflicting governance sources; CI matches chosen model. Fail: Two sources diverge or CI/docs reference different sources.

[x] Task 10 — Define updated acceptance criteria for “Codex-centric artifacts” validation (research.md — Section 6 “Passing criteria details for updated CI”) 
- Action: Write a short, explicit checklist of required vs optional Codex artifacts for this repo (e.g., required: root `AGENTS.md`, `.agents/skills/*/SKILL.md`; optional: `agents/openai.yaml` if used), and encode the required portion into CI.
- Owner: TBD
- Outputs: Acceptance-criteria checklist (documented) + CI enforcement of the required subset
- Effort: Small
- Verification: Cross-check the acceptance criteria against what CI enforces. Pass: Every “required” item is enforced and every “optional” item is not a hard gate. Fail: Mismatch between written criteria and CI behavior.

## 4. Verification Plan

- **Repository-wide validation (automated):** GitHub Actions workflow updated to enforce Codex-centric invariants (required instruction files, skill structure, RPI project naming rules if retained). Pass: CI green. Fail: CI red with actionable error.
- **Installer verification (manual + scripted):** Run installer into a scratch directory and compare outputs to the canonical root set. Pass: Only expected roots copied; skill/instruction paths correct. Fail: Missing or extra roots, especially `.vscode/`.
- **Documentation verification (manual):** Grep for “VS Code”, `.vscode`, “Copilot instruction files”, and confirm any remaining references are intentional and non-prescriptive (or removed). Pass: No VS Code-only setup steps remain. Fail: Docs still instruct VS Code-only configuration.

## 5. Validation — FACTS Criteria

- **Feasible:** Tasks align with identified repo components (installer, CI workflow, skills/docs) and requested removals; no step depends on undocumented external behavior beyond what research cites. (research.md — Section 2; Section 3)
- **Atomic:** Each task targets a single concern (inventory, instructions, skills, docs, installer, CI, governance decision) and can be completed/verified independently.
- **Clear:** Each task has a specific action and a concrete verification with explicit pass/fail criteria.
- **Testable:** Verification relies on observable repository state (file presence/absence, path layout, greps, installer output, CI behavior).
- **Scoped:** Plan focuses on Codex compatibility migration and removal of VS Code-specific artifacts without adding unrelated features or expanding beyond the unknowns called out in research. (research.md — Section 6)
