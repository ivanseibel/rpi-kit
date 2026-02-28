# Research: install-exclude-projects

## Problem Statement Analysis

The user reports that running the kit installer against a target repository copied the contents under `.rpi/projects/` into the target as well, which they do not want. Their intent is that `.rpi/projects/` is a local, per-repository workspace for agent-created artifacts and should not be installed into other repos; additionally, they do not want the installer to create an empty `.rpi/projects/` directory in the target because it will be created when the first project is started. (User request — 12 Feb 2026)

The installer currently includes the entire `.rpi/` directory as an “include root” and recursively adds all files under it to the copy set, which implies `.rpi/projects/**` will be copied whenever it exists in the kit repository. (install.js — `includeRoots` includes `.rpi`; `addDirFiles` recursively collects files)

The kit’s documentation and conventions treat `.rpi/projects/<project-id>/...` as the canonical location for phase artifacts (research/plan/SIGNOFF). ( .rpi/docs/rpi-workflow.md — “Artifact Locations” table; .github/instructions/research.instructions.md — “Expected Output”; .rpi/docs/handoff-checklist.md — “research.md validated” location )

This research artifact records facts and constraints only; it does not propose a specific implementation.

## Conceptual Scope

- **Installer entrypoints:** `install.sh` executes `install.js` using Node.js. (install.sh)
- **Copy mechanism:** `install.js` builds a set of source files by recursively listing files under a fixed set of roots, then copies them to the target with overwrite modes (`skip|overwrite|prompt`) and optional per-file overrides. (install.js — `includeRoots`, `addDirFiles`, `copyFileWithMode`, config parsing)
- **Dependency discovery:** The installer scans markdown files under `.github/instructions/` and `.github/skills/` for local link targets and adds any existing referenced files/dirs to the copy set. (README.md — “Dependency Discovery”; install.js — `scanDirs` + `resolveLink` + link regex)
- **Templates:** Files in `templates/*.rpi-template.md` are processed and only the content between `<!-- RPI:START -->` / `<!-- RPI:END -->` is written to the target path specified by template frontmatter `target:`. (README.md — “Template Processing”; install.js — `extractTemplateTarget`, `extractRpiSection`, `writeTemplate`)
- **Workflow files exception:** The installer skips copying `.github/workflows/**` via the main copy loop. (install.js — `if (rel.startsWith(".github/workflows/")) continue;`)

## System Constraints

- **Research phase constraints:** Research must be read-only discovery, cite sources for factual claims, and avoid proposing solutions. ( .github/copilot-instructions.md; .github/instructions/research.instructions.md )

- **Artifact path conventions and validation:**
  - Research and plan artifacts are expected under `.rpi/projects/<project-id>/...` in multiple repo docs. ( .rpi/docs/rpi-workflow.md; .rpi/docs/handoff-checklist.md; .github/skills/rpi-workflow/SKILL.md )
  - CI validation iterates `for PROJECT_DIR in .rpi/projects/*/; do ...` and applies naming rules (NNNN- prefix) only when `research.md` or `plan.md` exist within a project directory. ( .github/workflows/rpi-validate.yml — “Validate RPI phase artifacts (if present)” and “Validate RPI project naming” )

- **Current inventory claims `.rpi/projects/` is part of the kit inventory:** The inventory lists `.rpi/projects/` and at least one example project research artifact under it. (INVENTORY.md)

- **Current installer behavior that causes the issue:** `.rpi/` is part of `includeRoots`, and directory inclusion uses a recursive file walk that does not exclude `.rpi/projects/`. (install.js — `includeRoots`; `listFiles` recursion)

## Existing Patterns and Exemplars

- **Existing exemplar artifacts in this repo:** There are existing RPI project directories under `.rpi/projects/` (e.g., `0001-rpikit/`) containing prior `research.md` artifacts, which act as examples of the RPI research output format (even though the required section structure has since been formalized in `.github/instructions/research.instructions.md`). ( .rpi/projects/0001-rpikit/research.md; .github/instructions/research.instructions.md )

- **Stated “required artifacts” list includes `.rpi/projects/`:** `INVENTORY.md` currently treats `.rpi/projects/` as part of the kit contents, alongside docs and scripts. (INVENTORY.md)

- **Canonical guidance for operators:** The workflow operator guide describes creating new projects under `.rpi/projects/NNNN-my-project/` via the scaffolder script. ( .rpi/docs/rpi-workflow.md )

### Files inspected (repo sources)

- `install.js`
- `install.sh`
- `README.md`
- `INVENTORY.md`
- `AGENTS.md`
- `.rpi/AGENTS.md`
- `.github/copilot-instructions.md`
- `.github/instructions/research.instructions.md`
- `.github/instructions/plan.instructions.md`
- `.github/prompts/rpikit.research.prompt.md`
- `.github/skills/rpi-workflow/SKILL.md`
- `.github/workflows/rpi-validate.yml`
- `.rpi/docs/rpi-workflow.md`
- `.rpi/docs/handoff-checklist.md`
- `.rpi/projects/0001-rpikit/research.md`

### External references

- None used.

## Validation — FAR Criteria

- **Factual:** Claims about installer behavior are grounded in code paths in `install.js` (include roots + recursive traversal) and documented behavior in `README.md`. (install.js; README.md)
- **Actionable:** Identifies the exact mechanism that results in `.rpi/projects/**` being copied (root inclusion of `.rpi/`), and highlights documentation/inventory that may also need alignment with the desired behavior. (install.js; INVENTORY.md; .rpi/docs/rpi-workflow.md)
- **Relevant:** Findings directly address the reported unexpected behavior (copying `.rpi/projects`) and the stated desired installer behavior (do not copy or create it). (User request — 12 Feb 2026)

## Notes on Unknowns

### Assumptions made

- The user’s report reflects intended product behavior even though `INVENTORY.md` currently lists `.rpi/projects/` as part of the kit inventory. (User request — 12 Feb 2026; INVENTORY.md)

### Open questions / clarifications before planning

- Should the kit still *contain* example projects under `.rpi/projects/` for this repository (as documentation/examples), while the installer excludes them from copying? (INVENTORY.md; User request — 12 Feb 2026)
- If `.rpi/projects/` is no longer considered part of the installable kit, should `INVENTORY.md` and operator docs be updated to distinguish “kit artifacts to install” from “local example/working artifacts”? (INVENTORY.md; .rpi/docs/rpi-workflow.md)
- Are there any `.rpi/projects` subpaths that should be treated as exceptions (e.g., a single template research.md) or should the exclusion be absolute? (User request — 12 Feb 2026)
