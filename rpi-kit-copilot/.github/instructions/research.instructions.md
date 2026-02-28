---
applyTo: .rpi/projects/**/research.md
description: Research phase constraints for RPI workflow - enforces read-only discovery with mandatory citations
---

# Research Phase Instructions

## Constraints

- **Must:** Do not propose solutions; cite sources for all factual claims.
- **Must:** Follow read-only exploration—discovery only, no implementation planning.
- **Must:** Validate research output against FAR criteria (Factual, Actionable, Relevant) before completing.
- **Must:** Document all unknowns explicitly in a "Notes on Unknowns" section.
- **Must:** Use `.github/skills/rpi-workflow/resources/research-template.md` as the starting structure.
- **Must not:** Write to a project directory that already contains artifacts from a previous session. If `research.md` already exists at the target path, stop immediately, report the conflict to the operator, and do not proceed without explicit operator authorization (`reuse project <project-id>` or `continue project <project-id>`).
- **Must not:** Create or modify any file other than the target `research.md`. Any additional artifact—draft, note, plan, checklist, or implementation file—is a critical phase violation. Stop immediately and report to the operator.

## Expected Output

Produce `research.md` in `.rpi/projects/<project-id>/research.md` with the following sections:

1. **`## 1) Problem Statement Analysis`** - What is being investigated and why?
2. **`## 2) Code Archaeology / Blast Radius`** - What entry points, core logic, and data models are impacted?
3. **`## 3) Conceptual Scope`** - What concepts, systems, or APIs are involved?
4. **`## 4) System Constraints`** - What limitations or requirements must be respected?
5. **`## 5) Existing Patterns and Exemplars`** - What prior art or examples exist?
6. **`## 6) Validation - FAR Criteria`** - Is this research Factual, Actionable, Relevant?
7. **`## 7) Notes on Unknowns`** - What remains uncertain or requires runtime assumptions?

## Citation Style

Use inline parenthetical references: (source.md — Section X) or (documentation URL).
