# VS Code-specific Removal Checklist (Task 1)

This checklist enumerates artifacts that are explicitly VS Code / Copilot Chat specific and should be removed as part of the Codex-centric migration.

## Targets to remove

- [ ] `.vscode/settings.json`
  - Purpose: VS Code setting to enable instruction files (`github.copilot.chat.codeGeneration.useInstructionFiles`).
  - Referenced by:
    - `.github/workflows/rpi-validate.yml` (validates file exists + setting present)
    - `.rpi/docs/rpi-workflow.md` ("VS Code Load Checks" + troubleshooting referencing `.vscode/settings.json`)
    - `.rpi/scripts/check-vscode-load.sh` (checks this file)

- [ ] `.rpi/scripts/check-vscode-load.sh`
  - Purpose: helper script for VS Code “Customization Diagnostics” / load checks.
  - Referenced by:
    - `.github/workflows/rpi-validate.yml` (requires this script exists + executable)
    - `.rpi/docs/rpi-workflow.md` (Local Pre-flight / troubleshooting)

- [ ] VS Code “load checks” documentation sections in `.rpi/docs/*`
  - Purpose: operational guidance specific to VS Code and Copilot Chat UI.
  - Referenced by:
    - `.github/workflows/rpi-validate.yml` (requires `.rpi/docs/rpi-workflow.md` contains "VS Code Load Checks")

- [ ] `.github/copilot-instructions.md`
  - Purpose: GitHub Copilot instruction file format (VS Code/Copilot-specific discovery).
  - Referenced by:
    - `.github/workflows/rpi-validate.yml` (validates existence + contents)
    - `.rpi/docs/rpi-workflow.md` and `.rpi/docs/custom-instructions.md`
    - `README.md` (config example + template target)
    - `templates/copilot-instructions.rpi-template.md`

- [ ] `.github/instructions/*.instructions.md`
  - Purpose: VS Code/Copilot “instruction files” with `applyTo:` frontmatter.
  - Referenced by:
    - `.github/workflows/rpi-validate.yml` (validates frontmatter/fields)
    - `install.js` (dependency scanning includes `.github/instructions`)
    - `.rpi/docs/custom-instructions.md` and `.rpi/docs/rpi-workflow.md`

- [ ] `.github/prompts/*.prompt.md` and `.github/prompts/USAGE.md`
  - Purpose: VS Code Copilot Chat “slash command” prompt entry points.
  - Referenced by:
    - `.github/workflows/rpi-validate.yml` (requires these files)
    - `.rpi/docs/rpi-workflow.md` ("In VS Code Copilot Chat, invoke as...")

## Not removed (updated instead)

- `.github/workflows/rpi-validate.yml`
  - This is not VS Code-specific by itself, but it currently validates VS Code/Copilot artifacts. It should be updated to enforce Codex-centric invariants instead of being removed.

- `.rpi/AGENTS.md`
  - This is governance content, not VS Code-specific. It may be reconciled with root `AGENTS.md` per Task 9.
