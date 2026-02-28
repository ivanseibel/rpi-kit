# Plan - install-exclude-projects

Source research: `.rpi/install-exclude-projects/research.md`

## Strategy and Scope

### Goal

- Prevent the installer from copying any contents under `.rpi/projects/` into a target repository.
- Prevent the installer from creating an empty `.rpi/projects/` directory in the target repository.
  (research.md — Problem Statement Analysis)

### Strategy

- Implement an explicit exclusion for `.rpi/projects/**` in the installer’s copy/write surfaces so no file under that prefix is ever created in the target, regardless of how it entered the candidate set (include roots, dependency discovery, or templates). (research.md — Conceptual Scope; research.md — System Constraints)
- Align documentation/inventory claims with the desired installer behavior so operators don’t expect `.rpi/projects/` to be shipped into targets. (research.md — System Constraints; research.md — Existing Patterns and Exemplars)

### In scope

- `install.js` behavior: file enumeration/copy and template write behavior as needed to ensure `.rpi/projects/**` is not written to targets. (research.md — Conceptual Scope)
- Documentation/inventory updates that clarify `.rpi/projects/` is local-only and not installed. (research.md — System Constraints)

### Out of scope

- Changing the RPI artifact conventions (research/plan/SIGNOFF under `.rpi/projects/<project-id>/...`). (research.md — System Constraints)
- Removing or restructuring existing example projects under this kit repository; the plan only ensures they are not installed into other repos. (research.md — Existing Patterns and Exemplars)
- Adding new UX features to the installer beyond the exclusion and doc alignment. (research.md — Conceptual Scope)

## Architectural Decomposition

- **Installer entrypoints:** `install.sh` → `install.js`. (research.md — Conceptual Scope)
- **Core copy pipeline:** include roots (`.github/`, `.vscode/`, `.rpi/`, `AGENTS.md`) → build a `fileSet` → copy to target with overwrite modes. (research.md — Conceptual Scope; research.md — Problem Statement Analysis)
- **Dependency discovery:** scan `.github/instructions/` + `.github/skills/` markdown links and add referenced local paths. (research.md — Conceptual Scope)
- **Template processing:** write template targets specified by frontmatter `target:` and the `<!-- RPI:START -->` / `<!-- RPI:END -->` section. (research.md — Conceptual Scope)

## Atomic Task List

[x] Task 1 — Add an explicit `.rpi/projects/**` exclusion in the installer copy loop (research.md — Problem Statement Analysis; research.md — System Constraints)
- Action: Update `install.js` so that any candidate file whose repo-relative path starts with `.rpi/projects/` is skipped before copy.
- Verification: Run a dry-run install and ensure no operations mention `.rpi/projects/`.
  Pass: `node install.js --dry-run --target "$(mktemp -d)" | grep -q "RPI kit dry-run complete"` succeeds AND `node install.js --dry-run --target "$(mktemp -d)" | grep -q "\.rpi/projects/"` returns no matches.
  Fail: Any dry-run line references `.rpi/projects/` (create/overwrite/skip/prompt), indicating the exclusion is not applied.

[x] Task 2 — Ensure dependency-discovered files under `.rpi/projects/**` cannot be installed (research.md — Conceptual Scope; research.md — System Constraints)
- Action: Apply the same `.rpi/projects/**` exclusion to any paths added via dependency discovery (markdown link scanning), either by filtering at discovery-time or by guaranteeing the final copy stage excludes them.
- Verification: Add a temporary local link from a scanned markdown file to a known `.rpi/projects/...` file and confirm it still does not appear in the dry-run copy set; then revert the temporary link.
  Pass: After adding a link to `.rpi/projects/0001-rpikit/research.md` in a scanned markdown file under `.github/instructions/` or `.github/skills/`, `node install.js --dry-run --target "$(mktemp -d)" | grep -q "\.rpi/projects/"` returns no matches.
  Fail: Dry-run output includes `.rpi/projects/...`, showing dependency discovery can bypass the exclusion.

[x] Task 3 — Prevent templates from writing into `.rpi/projects/**` (research.md — Conceptual Scope; research.md — Problem Statement Analysis)
- Action: Update `install.js` template processing so any template with a `target:` under `.rpi/projects/` is ignored (or treated as an error), ensuring templates cannot create `.rpi/projects/` in targets.
- Verification: Create a temporary template file `templates/z-plan-guard.rpi-template.md` with `target: .rpi/projects/should-not-exist.md` and a minimal RPI section, run `node install.js --target "$(mktemp -d)"`, then delete the temporary template.
  Pass: The install completes, and the target does not contain `.rpi/projects/should-not-exist.md`.
  Fail: The file exists in the target (or `.rpi/projects/` is created), indicating templates can still write into the excluded tree.

[x] Task 4 — Align documentation and inventory with the exclusion (research.md — System Constraints; research.md — Existing Patterns and Exemplars)
- Action: Update docs (`README.md` and/or `.rpi/docs/rpi-workflow.md`) and `INVENTORY.md` to explicitly state that `.rpi/projects/` is a local workspace and is not installed into target repositories.
- Verification: Grep for outdated claims that `.rpi/projects/` is installed.
  Pass: `grep -n "## RPI Projects" -n INVENTORY.md` still locates the section, but it no longer claims `.rpi/projects/` is installed; and docs mention `.rpi/projects/` as local-only/excluded.
  Fail: `INVENTORY.md` or docs still imply `.rpi/projects/` is part of the install set without noting the exclusion.

[x] Task 5 — End-to-end install verification against an empty target (research.md — Problem Statement Analysis)
- Action: Run the installer against a brand-new empty directory and validate the resulting filesystem layout.
- Verification: Perform an actual (non-dry-run) install into a temp directory and check for presence/absence.
  Pass: After `TARGET="$(mktemp -d)"; ./install.sh --target "$TARGET"`, `test ! -d "$TARGET/.rpi/projects"` succeeds AND at least one expected `.rpi` non-project artifact exists (e.g., `test -f "$TARGET/.rpi/AGENTS.md"` or `test -d "$TARGET/.rpi/docs"`).
  Fail: `$TARGET/.rpi/projects` exists (created or populated) OR required kit artifacts are missing.

## Verification Plan

- Local automated checks:
  - Use `--dry-run` output greps to ensure `.rpi/projects/**` is never scheduled for creation/copy. (research.md — Conceptual Scope)
  - Run an actual install into `mktemp -d` and assert `.rpi/projects` is absent while other `.rpi` artifacts are present. (research.md — Problem Statement Analysis)
- Manual review:
  - Spot-check `README.md` / `INVENTORY.md` wording matches the intended behavior and does not contradict operator guidance. (research.md — System Constraints)

## Validation — FACTS Criteria

- Feasible: Changes are constrained to the installer (`install.js`) and a small set of docs/inventory; verification uses existing `--dry-run` and local installs. (research.md — Conceptual Scope)
- Atomic: Each task targets a single surface (copy loop, dependency discovery, templates, docs/inventory, end-to-end verification) with independent checks. (.github/instructions/plan.instructions.md)
- Clear: Each task states exactly what behavior must change and how success is determined via explicit pass/fail criteria. (.github/instructions/plan.instructions.md)
- Testable: Every task includes a concrete verification command or file presence assertion with explicit pass/fail outcomes. (.github/instructions/plan.instructions.md)
- Scoped: Only addresses excluding `.rpi/projects/**` from installation and aligning documentation; does not change broader RPI workflow semantics. (research.md — Conceptual Scope)
