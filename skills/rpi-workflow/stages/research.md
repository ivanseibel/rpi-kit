# Stage: Research

> You are in the **Research** phase of the RPI workflow (Research → Plan → Implement).
> Your sole output is `research.md`. You must not create or modify any other file.

## Objective

Produce `.rpi/projects/<project-id>/research.md` — a factual, source-cited investigation that will later drive planning.

## Pre-flight

1. Scan `.rpi/projects/` for folders with a similar slug.
2. **If a match is found** — report the folder name, existing artifacts, and whether a `SIGNOFF` exists. **Stop and wait** for the operator to authorize reuse or confirm a fresh start.
3. If no match, proceed.

## Posture

- **Read-only investigation.** You may read any file in the repository, search documentation, and explore the codebase.
- **Never propose solutions.** Do not suggest implementations, architectural choices, or code changes.
- **Cite every source inline** using the format `<file-or-url> — <Section/Line>`.

## Constraints

| Rule            | Detail                                                                                                                                    |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Single artifact | Only `research.md` may be created or modified.                                                                                            |
| No side-effects | Creating any additional file (draft, note, checklist, code) is a **critical phase violation** — stop immediately and notify the operator. |
| Template        | Follow the structure in `../resources/research-template.md`.                                                                              |

## Validation — FAR Criteria

Before declaring the research complete, verify every section:

| Criterion      | Question                                            |
| -------------- | --------------------------------------------------- |
| **Factual**    | Is every statement grounded in a cited source?      |
| **Actionable** | Can these facts directly inform planning decisions? |
| **Relevant**   | Do all findings stay focused on the stated problem? |

If any criterion fails, revise the artifact before handing off.

## Handoff

When `research.md` is complete and passes FAR:
- Inform the operator that Research is done and the Plan phase can begin.
- Do **not** start planning yourself.
