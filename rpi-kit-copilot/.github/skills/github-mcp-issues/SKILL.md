---
name: github-mcp-issues
description: Manage GitHub Issues in this repository using the GitHub MCP server tools (create/search/update/comment/close/sub-issues) and produce consistently high-quality issue reports.
---

# GitHub MCP Issues

Use this skill to **manage GitHub Issues end-to-end** for this repository via the GitHub MCP server tools, and to **create high-quality issues** (clear scope, reproducible, actionable, correctly triaged).

## When to use this skill

- Creating a new issue (bug, task, chore, proposal) with strong quality.
- Triage: dedupe, reproduce, label, assign, set milestone, close with reason.
- Maintaining issue hygiene: status updates, clarifying questions, sub-issues, duplicate handling.

## What this skill covers (capabilities)

This skill is designed to cover **all GitHub Issue operations available via the MCP tools** exposed in this environment:

- Search issues (avoid duplicates)
- Read issue details, comments, labels, sub-issues
- Create or update issues (title/body/labels/assignees/milestone/state/state_reason)
- Add comments
- Manage sub-issues (add/remove/reprioritize)
- List available issue types (when supported by the org)

If you need an operation that is not supported by the available MCP tools (e.g., creating new labels, editing label definitions, managing Projects), call that out explicitly and propose the closest supported alternative.

## Steps

### Tooling quick guide (what to set)

- Prefer `search` → `read` → `write` sequences.
- For create/update, use `mcp_io_github_git_issue_write`:
	- `title` and `body` should be explicit and stable.
	- `labels` should be minimal and accurate.
	- `assignees` only when someone is truly on point.
	- `state` + `state_reason` when closing.
- For closure reasons:
	- Use `state: closed, state_reason: completed` when done.
	- Use `state: closed, state_reason: not_planned` when intentionally not doing.
	- Use `state: closed, state_reason: duplicate` when superseded; include the canonical issue link/number.

### 1) Identify intent and scope

Decide what you’re doing:

- **Create** a new issue
- **Triage/update** an existing issue
- **Close** an issue (completed / not planned / duplicate)

If the user request is ambiguous, ask up to 3 clarifying questions. Prefer asking about:
- expected behavior vs actual behavior
- reproduction steps and environment
- desired outcome / acceptance criteria

### 2) Dedupe first (mandatory for new issues)

Before creating anything:

1. Use the issues search tool to find likely duplicates.
2. If a duplicate exists, **do not create a new issue**.
3. Instead, add a comment to the existing issue with any new data (repro details, logs, screenshots, workarounds) and optionally mark the new report as a duplicate (close + state_reason duplicate) when appropriate.

### 3) Choose issue type (if supported) and metadata

If the repository owner supports Issue Types, fetch them first and pick the best match.

Then set:
- labels (keep to the minimal set that communicates triage)
- assignees (only when appropriate)
- milestone (only when the repo uses milestones for planning)

### 4) Draft a high-quality issue body

Use the template in `assets/issue-body-template.md`.

Quality rules:
- Put the **problem statement** in the first 2–3 lines.
- Include **reproduction steps** for bugs.
- Include **acceptance criteria** as a short checklist.
- Include **scope boundaries** (what’s explicitly not included).
- Include **links** to code/docs/PRs if relevant.

### 5) Execute the operation with MCP tools

Use the “Tool map” in `references/tooling-map.md`.

Always prefer a safe sequence:
- read / search → then write
- update incrementally (don’t overwrite fields unnecessarily)
- when closing, set `state_reason`

### 6) Follow-through hygiene

After creating/updating:
- add a short “next steps” comment if action is needed from others
- if blocked, ask concrete questions in a single comment
- if the issue should be broken down, create sub-issues and reprioritize them

## Operational playbooks

### Create a new issue (safe default)

1. `mcp_io_github_git_search_issues` for likely duplicates.
2. If none, (optional) `mcp_io_github_git_list_issue_types` and choose a type.
3. `mcp_io_github_git_issue_write` with `method: create`.
4. If needed, `mcp_io_github_git_add_issue_comment` for follow-up questions or next steps.

### Update an existing issue (triage)

1. `mcp_io_github_git_issue_read` (`method: get`) to avoid clobbering context.
2. `mcp_io_github_git_issue_write` with `method: update` changing only what’s necessary (labels/body/assignees/milestone).

### Close an issue with the right reason

1. (Optional) add a final comment explaining the decision.
2. `mcp_io_github_git_issue_write` with `method: update`, `state: closed`, and the correct `state_reason`.

### Mark as duplicate

1. Search and confirm canonical issue.
2. Comment with a link to the canonical issue.
3. Close with `state_reason: duplicate`.

### Break down into sub-issues

1. Create the sub-issues first.
2. Use `mcp_io_github_git_sub_issue_write` (`method: add`) to attach each sub-issue to the parent.
3. Use `method: reprioritize` to order them by dependency.

## Examples (prompts that should work well)

- “Search for duplicates of: ‘install.sh excludes .rpi projects incorrectly’, then create an issue if none exists. Add labels and acceptance criteria.”
- “Triage issue #123: summarize, ask 2 clarifying questions, and propose labels. Don’t close it.”
- “Close issue #456 as duplicate of #120, and leave a brief explanation comment with the rationale.”
- “Break issue #789 into 3 sub-issues, add them, and reprioritize them in a logical order.”

## Edge cases

- **No issue types configured:** skip issue type selection and proceed with labels.
- **Missing metadata conventions:** keep labels/assignees/milestones minimal and avoid guessing.
- **Cannot reproduce:** still file the issue if impact is credible; explicitly mark as “needs repro” and list what info is missing.
- **Sensitive information:** do not include secrets, tokens, internal URLs, or personal data in issue bodies/comments.

## Resources

- Template: assets/issue-body-template.md
- Tool map: references/tooling-map.md
- Quality checklist: references/issue-quality-checklist.md
