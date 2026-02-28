# Research - Fix custom prompts

## Problem Statement Analysis

- The requested UX is that the three RPI workflow prompts are invokable as slash commands: `/rpikit.research`, `/rpikit.plan`, `/rpikit.implement`. (User request)
- Observed current behavior: the prompts are being triggered by `/research`, `/plan`, `/implement` instead. (User request)
- This research investigates how prompt files are discovered and named in VS Code/GitHub Copilot Chat, and how this repository currently structures and validates its prompt artifacts. (.github/prompts/USAGE.md)

## Conceptual Scope

- In scope:
	- VS Code prompt files (slash commands) format, naming, and discovery rules. (https://code.visualstudio.com/docs/copilot/customization/prompt-files)
	- Prompt artifacts shipped by this kit under `.github/prompts/`, including both the generic phase prompts and the `rpikit.*` variants. (INVENTORY.md)
	- Repository validation and documentation that assert required prompt file paths. (.github/workflows/rpi-validate.yml; .rpi/scripts/check-vscode-load.sh; .rpi/docs/rpi-workflow.md)
- Out of scope:
	- Changing the RPI process semantics (Research → Plan → Implement) or the actual prompt content beyond what is needed for discoverability and naming. (AGENTS.md)
	- Adding additional prompts or new UX beyond the three commands requested. (User request)

## System Constraints

- VS Code prompt files are Markdown files with the `.prompt.md` extension, and are discovered from the workspace `.github/prompts` folder (among other locations). (https://code.visualstudio.com/docs/copilot/customization/prompt-files)
- The slash command name can be configured via YAML frontmatter `name`; if not specified, the filename is used as the default prompt name shown after typing `/` in chat. (https://code.visualstudio.com/docs/copilot/customization/prompt-files)
- Current CI validation explicitly checks for the presence of `.github/prompts/research.prompt.md`, `.github/prompts/plan.prompt.md`, and `.github/prompts/implement.prompt.md`. (.github/workflows/rpi-validate.yml)
- The local helper script `.rpi/scripts/check-vscode-load.sh` also checks for the same three generic prompt files in `.github/prompts/`. (.rpi/scripts/check-vscode-load.sh)

## Existing Patterns and Exemplars

- Generic RPI phase prompts exist as `.prompt.md` files:
	- `.github/prompts/research.prompt.md`, `.github/prompts/plan.prompt.md`, `.github/prompts/implement.prompt.md`. (INVENTORY.md; .github/workflows/rpi-validate.yml)
- `rpikit.*` prompt variants exist as extensionless files:
	- `.github/prompts/rpikit.research`, `.github/prompts/rpikit.plan`, `.github/prompts/rpikit.implement`. (INVENTORY.md)
- The prompts usage doc claims the `rpikit.*` prompts will exist after installation, and suggests invoking them by opening/copying the prompt file contents (not by slash command). (.github/prompts/USAGE.md)
- Repository documentation describes “Prompt Entry Points” as `.github/prompts/*.prompt.md`, and provides examples that reference the generic `research.prompt.md`/`plan.prompt.md`/`implement.prompt.md` files. (.rpi/docs/rpi-workflow.md)
- A prior RPI research artifact explicitly called out an open question about whether prompt filenames should include a `.prompt` suffix versus raw names like `rpikit.research`. (.rpi/projects/0001-rpikit/research.md)

## Validation - FAR Criteria

- Factual:
	- Claims about prompt file location/extension/naming are taken directly from the VS Code “prompt files” documentation. (https://code.visualstudio.com/docs/copilot/customization/prompt-files)
	- Claims about which files exist and which are required by CI/scripts are based on the repository inventory and validation scripts. (INVENTORY.md; .github/workflows/rpi-validate.yml; .rpi/scripts/check-vscode-load.sh)
- Actionable:
	- This document enumerates the concrete files and checks that influence discoverability (`.github/prompts/*`) and repository gates (CI + helper script), so a plan can adjust the correct artifacts without guessing. (.github/workflows/rpi-validate.yml; .rpi/scripts/check-vscode-load.sh)
- Relevant:
	- The observed mismatch between desired slash commands (`/rpikit.*`) and current ones (`/research` etc.) directly depends on how VS Code discovers prompt files and derives their names, and on how this repo currently names/validates prompt artifacts. (User request; https://code.visualstudio.com/docs/copilot/customization/prompt-files)

## Notes on Unknowns

- Resolved from user clarifications:
	- Do not keep `/research`, `/plan`, `/implement` as backward-compatible commands. (User clarification)
	- No special prompt-files location configuration is in use (assume default workspace `.github/prompts`). (User clarification; https://code.visualstudio.com/docs/copilot/customization/prompt-files)
	- Prefer deriving slash command names from filenames (avoid YAML frontmatter `name` unless required). (User clarification; https://code.visualstudio.com/docs/copilot/customization/prompt-files)

- Remaining unknowns:
	- None identified that block planning; implementation may still need to validate how VS Code displays prompt names for filenames containing dots (e.g., `rpikit.research.prompt.md`). (https://code.visualstudio.com/docs/copilot/customization/prompt-files)
