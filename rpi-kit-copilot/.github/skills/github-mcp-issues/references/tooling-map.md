# GitHub MCP Issue Tool Map

This repository’s agent environment exposes GitHub MCP tools with `mcp_io_github_*` names.

## Read / discovery

- `mcp_io_github_git_search_issues`
  - Use to dedupe and to find related work.
- `mcp_io_github_git_issue_read` with:
  - `method: get` (details)
  - `method: get_comments` (comments)
  - `method: get_labels` (labels)
  - `method: get_sub_issues` (sub-issues)

## Create / update / close

- `mcp_io_github_git_issue_write` with:
  - `method: create` (new issue)
  - `method: update` (edit title/body/labels/assignees/milestone/state)
  - When changing `state`, also set `state_reason` when applicable:
    - `completed` / `not_planned` / `duplicate`

## Commenting

- `mcp_io_github_git_add_issue_comment`
  - Works for issues and PRs (by number), but this skill focuses on issues.

## Issue types (when supported)

- `mcp_io_github_git_list_issue_types`
  - If issue types exist, pass the chosen type into `mcp_io_github_git_issue_write`.

## Sub-issues

- `mcp_io_github_git_sub_issue_write` with:
  - `method: add` / `remove` / `reprioritize`

## Notes on limitations

If you cannot find a tool for an operation (e.g., creating new labels, editing label definitions, adding to Projects), explicitly state the limitation and propose a closest supported alternative.
