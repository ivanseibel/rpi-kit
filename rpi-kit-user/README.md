# RPI Kit — User-Level Installer

Installs RPI skills, VS Code prompts, and VS Code instructions to your **user
profile** so every project can use them without per-repo setup.

## What Gets Installed

| Artifact             | Source                                                   | Destination                                                           |
| -------------------- | -------------------------------------------------------- | --------------------------------------------------------------------- |
| Skills (all)         | `skills/*`                                               | `~/.copilot/skills/` (Copilot)                                        |
| Skills (all)         | `skills/*`                                               | `~/.agents/skills/` (Codex)                                           |
| Skills (all)         | `skills/*`                                               | `~/.claude/skills/` (Claude)                                          |
| VS Code prompts      | `rpi-kit-copilot/.github/prompts/rpikit.*.prompt.md`     | `{vscode-user}/prompts/`                                              |
| VS Code instructions | `rpi-kit-copilot/.github/instructions/*.instructions.md` | `{vscode-user}/instructions/`                                         |
| VS Code setting      | —                                                        | Merges `useInstructionFiles: true` into `{vscode-user}/settings.json` |

`{vscode-user}` is resolved automatically per OS:
- **macOS:** `~/Library/Application Support/Code/User/`
- **Linux:** `~/.config/Code/User/`
- **Windows:** `%APPDATA%\Code\User\`

## Prerequisites

- Node.js ≥ 18
- (For VS Code features) Visual Studio Code ≥ 1.90

## Usage

```sh
# Full install (all agents + VS Code)
node rpi-kit-user/install.js

# Skills only for specific agents
node rpi-kit-user/install.js --agents copilot,claude

# Skip VS Code settings/prompts/instructions
node rpi-kit-user/install.js --no-vscode

# Preview without writing anything
node rpi-kit-user/install.js --dry-run

# Overwrite existing files instead of skipping
node rpi-kit-user/install.js --mode overwrite
```

## After Installation

### Verify Copilot skills load

1. Open VS Code.
2. Open the Command Palette (`Cmd+Shift+P`).
3. Run **"Copilot Chat: Show Customization Diagnostics"**.
4. Confirm `rpi-workflow`, `e2e-testing`, `skill-manager`, and `github-mcp-issues`
   appear in the skills list under the user-level path.

### Verify Codex sees AGENTS skills

Run Codex in a terminal and check that `rpi-workflow` skill is discoverable:
```sh
# Codex should list skills from ~/.agents/skills/
cat ~/.agents/skills/rpi-workflow/SKILL.md | head -5
```

### Update existing installs

Re-run with `--mode overwrite` to refresh skills from a newer kit version:
```sh
node rpi-kit-user/install.js --mode overwrite
```

## Per-Project Setup

User-level installation only installs shared skills and VS Code settings.
Each project still needs a minimal footprint for governance and phase artifacts.
Use the project installer:

```sh
node rpi-kit-project/install.js --target /path/to/your-project
```

See [rpi-kit-project/README.md](../rpi-kit-project/README.md) for details.
