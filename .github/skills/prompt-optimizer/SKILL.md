---
name: prompt-optimizer
description: Compact and translate prompts to concise English; output only the optimized prompt.
---

When to use
- Use this skill when you want to reduce token usage of a prompt while preserving its original intent and constraints.
- Use when input prompts are in languages other than English; the skill will translate to English as part of optimization.

Behavior
- Receives an arbitrary prompt (system/user/instruction mix) in any language.
- Produces a single optimized prompt in English.
- The output MUST contain only the optimized prompt text — no headers, no commentary, no metadata, no examples.

Output contract
- Output: a single prompt (one or more lines) in English, ready to copy/paste into an AI tool.
- Do not add explanatory text, step descriptions, or delimiters.

Heuristics (short)
- Preserve: required constraints, formats, negative constraints, and any tokens that change the task result.
- Remove: filler words, polite phrasing, redundant qualifiers, and verbose examples unless required for clarity.
- Shorten: convert long sentences into concise imperative instructions, use short synonyms, compress lists into compact clauses.
- Translate: if input is not English, translate to English while preserving nuance.

Examples and test cases
- See `assets/prompt-examples.md` for before/after examples and edge cases.

Files
- `assets/prompt-examples.md`: example inputs and optimized outputs.
- `references/guidelines.md`: detailed heuristics and priorities.
- `resources/optimized-template.rpi-template.md`: sample optimized prompt template.
- `scripts/validate-examples.sh`: lightweight checks for examples formatting.

CI/installer notes
- The skill directory name `prompt-optimizer` must match `name` in frontmatter and follow the repository naming rules (`^[a-z0-9-]+$`).

Contact
- Maintainers can add usage notes and additional examples under `assets/` as needed.
