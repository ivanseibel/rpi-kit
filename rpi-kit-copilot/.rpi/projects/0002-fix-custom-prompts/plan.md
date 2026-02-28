# Plan - Fix custom prompts

## Strategy and Scope

### Goal
- Make the prompts invokable as `/rpikit.research`, `/rpikit.plan`, `/rpikit.implement`, and remove the current `/research`, `/plan`, `/implement` prompt commands. (research.md — Problem Statement Analysis; research.md — Notes on Unknowns)

### Strategy
- Use VS Code prompt-file discovery rules: only `.prompt.md` files under `.github/prompts` are treated as slash commands, and the default slash command name comes from the filename if YAML `name` is not used. (research.md — System Constraints)
- Prefer filename-based naming (no YAML) by using filenames of the form `rpikit.<phase>.prompt.md`, which should surface as `/rpikit.<phase>` by stripping the `.prompt.md` extension. (research.md — System Constraints; research.md — Notes on Unknowns)

### In scope
- Rename/replace prompt artifacts under `.github/prompts` so that only the `rpikit.*` prompts are recognized as prompt files. (research.md — Existing Patterns and Exemplars)
- Update repository validation (CI + helper script), inventory, and documentation that currently reference the generic prompt filenames. (research.md — System Constraints; research.md — Existing Patterns and Exemplars)

### Out of scope
- Changing the RPI workflow semantics or adding new prompts beyond the three required commands. (research.md — Conceptual Scope)

## Architectural Decomposition

- Prompt files: `.github/prompts/*.prompt.md` (VS Code-discoverable slash commands). (research.md — System Constraints)
- Repository gates: `.github/workflows/rpi-validate.yml` and `.rpi/scripts/check-vscode-load.sh`. (research.md — System Constraints)
- Documentation/inventory: `INVENTORY.md`, `.rpi/docs/rpi-workflow.md`, `.github/prompts/USAGE.md`. (research.md — Existing Patterns and Exemplars)

## Atomic Task List

[x] Task 1 — Convert `rpikit.*` prompts to VS Code prompt files (research.md — System Constraints; research.md — Existing Patterns and Exemplars)
- Action: Replace extensionless `.github/prompts/rpikit.research|rpikit.plan|rpikit.implement` with `.github/prompts/rpikit.research.prompt.md`, `.github/prompts/rpikit.plan.prompt.md`, `.github/prompts/rpikit.implement.prompt.md`, using the existing prompt content.
- Verification: Confirm the three new `.prompt.md` files exist and include the required `Input:` line.
  Pass: (a) `ls .github/prompts | grep -E '^rpikit\.(research|plan|implement)\.prompt\.md$'` returns 3 matches, and (b) `grep -q "Input:" .github/prompts/rpikit.research.prompt.md` and same for `rpikit.plan.prompt.md` + `rpikit.implement.prompt.md` all succeed.
  Fail: Any file missing, misnamed, or missing an `Input:` line.

[x] Task 2 — Remove the legacy `/research`, `/plan`, `/implement` prompt commands (research.md — Problem Statement Analysis; research.md — Notes on Unknowns)
- Action: Stop shipping the generic `.github/prompts/research.prompt.md`, `.github/prompts/plan.prompt.md`, `.github/prompts/implement.prompt.md` prompt files (delete them or rename so they are no longer `.prompt.md`).
- Verification: Ensure no `research.prompt.md`, `plan.prompt.md`, `implement.prompt.md` remain under `.github/prompts`.
  Pass: `test ! -f .github/prompts/research.prompt.md && test ! -f .github/prompts/plan.prompt.md && test ! -f .github/prompts/implement.prompt.md`.
  Fail: Any legacy file remains present as a `.prompt.md` file.

[x] Task 3 — Update CI prompt validation to the new filenames (research.md — System Constraints)
- Action: Update `.github/workflows/rpi-validate.yml` ("Validate prompt entry points" step) to validate the three `rpikit.*.prompt.md` files and the presence of `Input:` lines.
- Verification: Confirm the workflow no longer references the legacy prompt entry points and does reference the new ones.
  Pass: `grep -q "rpikit\.research\.prompt\.md" .github/workflows/rpi-validate.yml` (and plan/implement) succeed AND `grep -qE "\.github/prompts/(research|plan|implement)\.prompt\.md" .github/workflows/rpi-validate.yml` finds no matches.
  Fail: Any legacy prompt filename remains in CI validation or any new `rpikit.*.prompt.md` check is missing.

[x] Task 4 — Update local artifact checker script prompt list (research.md — System Constraints)
- Action: Update `.rpi/scripts/check-vscode-load.sh` to check for `.github/prompts/rpikit.research.prompt.md`, `.github/prompts/rpikit.plan.prompt.md`, `.github/prompts/rpikit.implement.prompt.md` and stop checking for the legacy prompt entry points.
- Verification: Run `./.rpi/scripts/check-vscode-load.sh`.
  Pass: Script reports ✅ for the three `rpikit.*.prompt.md` files and does not report missing legacy prompt entry points.
  Fail: Script reports missing `rpikit.*.prompt.md` files or still checks for legacy prompt filenames.

[x] Task 5 — Update inventory to match prompt renames (research.md — Existing Patterns and Exemplars)
- Action: Update `INVENTORY.md`:
  - Replace “Prompt Entry Points” with `.github/prompts/rpikit.research.prompt.md`, `.github/prompts/rpikit.plan.prompt.md`, `.github/prompts/rpikit.implement.prompt.md`.
  - Remove or update “RPI Kit Reusable Prompts” so it no longer references the extensionless `.github/prompts/rpikit.*` files if those are removed in Task 1.
- Verification: Search inventory for legacy filenames and extensionless `rpikit.*` references.
  Pass: `grep -n -E "\\.github/prompts/(research|plan|implement)\\.prompt\\.md|\\.github/prompts/rpikit\\.(research|plan|implement)$" INVENTORY.md` returns no matches.
  Fail: Any removed file path remains referenced in `INVENTORY.md`.

[x] Task 6 — Update documentation examples and usage text (research.md — Existing Patterns and Exemplars)
- Action: Update `.rpi/docs/rpi-workflow.md` and `.github/prompts/USAGE.md` to reference the new `.github/prompts/rpikit.*.prompt.md` files and the desired slash commands (`/rpikit.research`, `/rpikit.plan`, `/rpikit.implement`).
- Verification: Search docs for legacy prompt filenames and extensionless `rpikit.*` references.
  Pass: `grep -R -E "\\.github/prompts/(research|plan|implement)\\.prompt\\.md|\\.github/prompts/rpikit\\.(research|plan|implement)$" .rpi/docs .github/prompts/USAGE.md` returns no matches.
  Fail: Any doc still references legacy prompt filenames or the removed extensionless prompt paths.

[x] Task 7 — Sanity-check prompt discovery assumptions in VS Code (research.md — Notes on Unknowns)
- Action: Use VS Code Chat prompt discovery (typing `/` in chat, and/or "Copilot Chat: Show Customization Diagnostics") to confirm the prompt commands appear as `/rpikit.research`, `/rpikit.plan`, `/rpikit.implement`.
- Verification: Manual check in VS Code.
  Pass: Only `/rpikit.*` prompts appear; `/research`, `/plan`, `/implement` do not appear.
  Fail: Legacy commands still appear OR `rpikit.*` commands do not appear as slash commands (including any issue with dot-separated names).

[x] Task 8 — Repo-wide consistency check (research.md — System Constraints; research.md — Existing Patterns and Exemplars)
- Action: Ensure there are no lingering references to legacy prompt entry points or the extensionless `rpikit.*` prompt paths in the repository after updates.
- Verification: Grep the full repository.
  Pass: `grep -R -E "\\.github/prompts/(research|plan|implement)\\.prompt\\.md|\\.github/prompts/rpikit\\.(research|plan|implement)$" --exclude-dir=projects .` returns no matches.
  Fail: Any match remains (indicates an un-updated reference).

## Verification Plan

- Automated/local:
  - Run `./.rpi/scripts/check-vscode-load.sh`.
  - Run targeted `test`/`grep` checks described per-task.
- CI:
  - Ensure the “Validate prompt entry points” step in `.github/workflows/rpi-validate.yml` matches the new filenames and continues to enforce the `Input:` line check. (research.md — System Constraints)
- Manual:
  - Use VS Code Chat prompt-file Diagnostics to confirm prompt discovery and slash command names. (research.md — Notes on Unknowns)

## Validation — FACTS Criteria

- Feasible: Changes are limited to file renames/updates in `.github/prompts` plus aligned updates in CI/scripts/docs/inventory. (research.md — System Constraints)
- Atomic: Each task updates one surface area (prompt files, CI, script, inventory, docs, manual verification) and is independently verifiable. (.github/instructions/plan.instructions.md)
- Clear: Each task specifies exact file targets and expected outcomes, with explicit pass/fail criteria. (.github/instructions/plan.instructions.md)
- Testable: Every task includes a concrete `test`/`grep` or script-based verification step, plus one final manual verification for VS Code discovery. (.github/instructions/plan.instructions.md)
- Scoped: Only addresses prompt discoverability/naming and supporting repo validation/docs—no new prompts or workflow semantics changes. (research.md — Conceptual Scope)
