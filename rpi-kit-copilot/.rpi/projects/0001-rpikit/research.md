# Research: rpikit (RPI prompts)

Summary
- Goal: Add three reusable RPI prompts (`rpikit.research`, `rpikit.plan`, `rpikit.implement`) to this repository so they can be copied into target projects and used as canonical Research/Plan/Implement entry points.

Findings (facts and citations)
- Repository governance requires RPI phases and artifacts: AGENTS.md (Agent Governance: RPI Workflow) — [AGENTS.md](AGENTS.md)
- The repository already contains a Copilot RPI template at `templates/copilot-instructions.rpi-template.md` which documents the RPI constitution and structure. (See templates/copilot-instructions.rpi-template.md)
- Inventory enumerates prompt entry points; we will add the `rpikit.*` prompts to the inventory so installers can copy them. (See INVENTORY.md)
- Research phase rules: read-only discovery, cite sources, do not propose solutions. (.github/copilot-instructions.md)

Files inspected
- AGENTS.md
- .github/copilot-instructions.md
- templates/copilot-instructions.rpi-template.md
- INVENTORY.md

Assumptions
- The project name for this work is `rpikit` and its artifacts will live under `.rpi/projects/rpikit/`.
- Prompts will be stored under `.github/prompts/` so existing install scripts and the inventory can discover them.

Open questions
- Should the prompt filenames use a `.prompt` suffix or be raw names? (I used raw names `rpikit.research` etc. to match request.)

Next steps (for Plan phase)
- Create `.rpi/projects/rpikit/plan.md` with atomic tasks describing: add prompt files, update inventory, test installer copy, document usage examples.

This research artifact only records facts and citations; it does not propose implementation details beyond file locations.
