RPI Kit — Research → Plan → Implement
====================================

A concise toolkit to add a disciplined Research → Plan → Implement (RPI) workflow to a repository. This workspace contains two "flavors" of the kit: one for agent-driven repository artifacts (`rpi-kit-codex`) and one focused on GitHub Copilot instructions and prompts (`rpi-kit-copilot`).

Quick overview
- Purpose: Provide templates, agent skills, governance docs, and an installer to embed an RPI workflow into other repositories.
- Audience: repository maintainers and teams who want structured agent-assisted development (Codex-style agent artifacts or Copilot instructions).

Which flavor should I use?
- `rpi-kit-codex`: if you want repository-backed agent artifacts and skills (copies `.agents/` + `.rpi/`, including `.rpi/AGENTS.md`). See [rpi-kit-codex/README.md](rpi-kit-codex/README.md).
- `rpi-kit-copilot`: if you want GitHub Copilot custom instructions, prompts and `.github/*` integration. See [rpi-kit-copilot/README.md](rpi-kit-copilot/README.md).

Install (examples)
Use the installer in the flavor folder to copy artifacts into your target repository. Examples:

```bash
# Dry-run example for rpi-kit-codex
node rpi-kit-codex/install.js --target /path/to/target --mode prompt --dry-run

# Install (POSIX wrapper)
sh rpi-kit-codex/install.sh --target /path/to/target

# For the Copilot flavor, run the installer under rpi-kit-copilot instead
node rpi-kit-copilot/install.js --target /path/to/target --mode prompt --dry-run
```

Common installer options
- `--target <path>` : destination repository path
- `--mode {prompt|overwrite|skip}` : how to handle existing files
- `--dry-run` : show changes without writing files

What gets installed
- `.rpi/` documentation and governance (`.rpi/AGENTS.md` is canonical)
- Agent skills or Copilot instructions (`.agents/` or `.github/` + `.vscode/`), depending on flavor
- Templates processed into the target repository

Key files & references
- [rpi-kit-codex/AGENTS.md](rpi-kit-codex/AGENTS.md)
- [rpi-kit-codex/INVENTORY.md](rpi-kit-codex/INVENTORY.md)
- [rpi-kit-copilot/AGENTS.md](rpi-kit-copilot/AGENTS.md)
- [rpi-kit-copilot/INVENTORY.md](rpi-kit-copilot/INVENTORY.md)
- [rpi-kit-copilot/templates/copilot-instructions.rpi-template.md](rpi-kit-copilot/templates/copilot-instructions.rpi-template.md)

Contributing & docs
- See each flavor's `AGENTS.md` for kit-maintenance guidance and `INVENTORY.md` for installable artifacts.

License
- No `LICENSE` file was found in this workspace. If you intend to publish or share this kit, please add a `LICENSE` to the repository and update this README accordingly.

Next steps
- Choose a flavor and run the installer with `--dry-run` first to verify changes.
- Open the flavor `INVENTORY.md` to review what will be applied to your target repository.
