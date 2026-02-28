# RPI Kit Prompts — Usage

Quick example — copy prompts into a target repository using the installer (dry-run first):

```sh
./install.sh --target /path/to/your/repo --dry-run
```

To perform the actual copy (skip existing files):

```sh
./install.sh --target /path/to/your/repo --mode skip
```

Example: After installation, the prompts will be available at `.github/prompts/rpikit.research`, `.github/prompts/rpikit.plan`, and `.github/prompts/rpikit.implement` in the target repository.

Example: After installation, the prompts will be available at `.github/prompts/rpikit.research.prompt.md`, `.github/prompts/rpikit.plan.prompt.md`, and `.github/prompts/rpikit.implement.prompt.md` in the target repository.

In VS Code Copilot Chat, invoke them as `/rpikit.research`, `/rpikit.plan`, and `/rpikit.implement`.
