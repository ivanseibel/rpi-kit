# Issue Quality Checklist

Use this as a quick rubric before creating/updating an issue.

## Clarity

- Title states the problem and the affected area (avoid vague titles like “Broken”)
- First paragraph explains impact and desired outcome

## Reproducibility (bugs)

- Has steps to reproduce (or explicitly says “cannot repro”)
- Includes expected vs actual behavior
- Includes environment details (OS/version/app version/commit)

## Actionability

- Includes acceptance criteria as checkboxes
- Includes scope boundaries (in-scope / out-of-scope)
- Includes links to relevant code/docs/issues

## Triage hygiene

- Dedupe was attempted via search
- Labels are minimal and meaningful
- Assignees/milestone set only when justified

## Closure hygiene

- If closing, `state_reason` matches reality:
  - `completed` when done
  - `not_planned` when intentionally not doing
  - `duplicate` when superseded by another issue (link it)
