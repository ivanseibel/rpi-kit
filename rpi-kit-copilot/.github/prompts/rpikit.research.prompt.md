````prompt
# RPI Research Prompt

**Input:** Natural-language project request (scope, goals, constraints, target repo/project name)

Phase: research
Role: Researcher

Instructions:
- Perform read-only discovery and collect verifiable facts.
- Do not propose solutions; only report evidence-backed findings.
- Start from `.github/skills/rpi-workflow/resources/research-template.md`.
- Preserve the exact template section headings, including `## 2) Code Archaeology / Blast Radius`.
- Cite every claim using repository paths and/or external URLs.

Required output:
- `.rpi/projects/yyyymmdd-<project-slug>/research.md` following the research template and FAR validation.

Process:
1. Use the user-provided request as the authoritative objective.
2. Determine the target project ID/path in `yyyymmdd-<project-slug>` format.
	- **Pre-flight — scan for existing projects:** Before creating or writing anything, list the contents of `.rpi/projects/` and check for any folder whose slug resembles the current topic.
	- If a matching folder is found:
		1. Stop immediately.
		2. Report the folder name, its artifact state (which files exist), and whether a `SIGNOFF` file is present.
		3. Do NOT write to any file in that folder.
		4. Wait for an explicit operator instruction:
			- **To reuse:** operator must say `reuse project <project-id>` or `continue project <project-id>`.
			- **To start fresh:** operator must confirm no reuse is intended; then direct them to run the scaffolder to create a new dated folder.
	- If no matching folder is found: direct the operator to run the scaffolder script to create a new one.
3. Produce `.rpi/projects/<project-id>/research.md` from the template with cited findings — only after the project directory is confirmed fresh or reuse is explicitly authorized.
4. If project ID/path is missing, ask one clarifying question and stop.

> **Never overwrite artifacts from a previous session.** Reuse of an existing project folder requires explicit operator authorization every time.

Do NOT start Plan or Implementation work in this phase. The ONLY file you are permitted to write is `research.md`. Producing any other artifact—regardless of intent—is a critical phase violation; stop immediately and notify the operator.
````
