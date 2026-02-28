# RPI Constitution

This document is the RPI constitution for the repository.

This repository follows the Research → Plan → Implement (RPI) pattern for systematic software development.

## Core Principles

- **Research:** Read-only exploration phase. Must cite all sources. No solutions proposed, only facts gathered.
- **Plan:** Produce atomic task checklists with explicit verification steps. Each task must be independently testable.
- **Implement:** Follow `plan.md` strictly. No improvisation. If blocked, recurse to Plan or Research phase.

## Project Lifecycle Rule

- **Each session starts with a new `.rpi/projects/` entry.** Always create a fresh dated folder via the scaffolder (`rpi-new.sh`) for each new Research session.
- **Never reuse an existing project folder silently.** If a topically similar folder is found in `.rpi/projects/`, surface it to the operator—show its name, artifact state, and `SIGNOFF` status—then stop and wait for explicit instruction.
- **Reuse requires explicit operator authorization:** The operator must say `reuse project <project-id>` or `continue project <project-id>` before any artifact in that folder may be written or overwritten.

## Scoped Guidance

For phase-specific rules and constraints, see `.github/instructions/*.instructions.md` files that apply to specific workspace paths.
