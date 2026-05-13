<!-- ALL SECTIONS BELOW ARE REQUIRED. Do not omit or merge sections. -->

# Plan - RPI Kit Comprehensive Developer Documentation

## 1) Strategy and Scope

### Approach
Create a single, authoritative `docs/developer-guide.md` that serves as the comprehensive developer reference for the rpi-kit. The guide is organized as a progressive narrative — from "what and why" through installation, operational use, decision guidance, and architectural rationale — so that both newcomers and evaluators can enter at the depth appropriate to their context. Each section maps directly to a gap identified in `research.md §1` (fragmented information sources, no unified developer narrative). The guide is written in Markdown to stay consistent with existing `docs/` content and the skills' own format.

### Trade-offs
- **Single file vs. multi-file site:** A single `docs/developer-guide.md` avoids navigation overhead and is immediately readable in GitHub, VS Code, and agent context. A multi-file approach (e.g., MkDocs, Docusaurus) would add tooling dependencies that are out of scope per `research.md §3`. This decision can be revisited in a future project.
- **Breadth vs. depth per section:** The guide targets developer adopters (not kit maintainers), so implementation internals (Node.js install resolution logic, bash slug algorithm) are summarized rather than exhaustively documented. Per `research.md §3 Out of Scope`, per-tool agent UI/UX and LLM internals are excluded.
- **Migration guidance inclusion:** `research.md §8` flags migration narratives as an unknown. The plan resolves this by including a lightweight "coming from unstructured AI workflows" subsection within the "When to use RPI" section — enough to orient teams without requiring a standalone migration guide.

### Safe State
Implementation is complete when:
1. `docs/developer-guide.md` exists with all 8 planned sections fully written and internally linked.
2. `README.md` contains a linked reference to `docs/developer-guide.md`.
3. A human reviewer can read the guide and, without consulting any other file, understand how to install the kit, run a three-phase project, and decide whether RPI is appropriate for a given task.
4. No existing file other than `README.md` and the new `docs/developer-guide.md` has been modified.

### In Scope
- New file: `docs/developer-guide.md` (all 8 sections below)
- One-line addition to `README.md`: link to `docs/developer-guide.md`

### Out of Scope
- Changes to any skill files (`skills/rpi-workflow/**`)
- Changes to `install.js`, `install.sh`, stage files, or templates
- Per-tool agent UI walkthroughs (Copilot Chat, Gemini sidebar, etc.)
- LLM internals, model-specific behaviours, or API documentation
- Multi-file documentation sites or static site generators
- Domain-specific customisation guides for specialised industries

---

## 2) Architectural Decomposition

- **docs/developer-guide.md** — New authoritative guide; 8 sections, each independently readable
  - §1 What is the RPI Kit
  - §2 Why the RPI Pattern
  - §3 Installation
  - §4 Operational Workflow (phases, constraints, validation)
  - §5 When to Use RPI (and when not to)
  - §6 Why Skills Outperform Alternatives
  - §7 Developer Workflow Quick Reference
  - §8 Troubleshooting and FAQ
- **README.md** — Receives a single "Full Developer Guide" link pointing to `docs/developer-guide.md`

---

## 3) Atomic Task List

---

[x] **Task 1 — Create `docs/developer-guide.md` scaffold**
- Source: research.md — §1 (Problem Statement), §3 (Conceptual Scope)
- Action: Create `docs/developer-guide.md` containing the top-level heading, a table of contents with anchor links, and all 8 section headings as empty stubs (no body prose yet). No other file is touched.
- Verify: Open `docs/developer-guide.md` and confirm it exists with exactly 8 `##` headings and a working markdown TOC.
- Pass: File present; all 8 section headings visible; TOC renders without broken anchors in GitHub Markdown preview.
- Fail: File absent; fewer than 8 headings; TOC links point to non-existent anchors.

---

[x] **Task 2 — Write §1 "What is the RPI Kit"**
- Source: research.md — §1 (trigger, user intent), §2 (entry points: README.md, SKILL.md, install.js)
- Action: In `docs/developer-guide.md §1`, write prose covering: (a) the kit's purpose as a packaged, installable implementation of the RPI workflow; (b) the relationship between the kit (distribution mechanism) and the RPI pattern (methodology); (c) the four primary artefacts — SKILL.md, stage files, templates, installer.
- Verify: Read §1 and confirm a developer with no prior RPI knowledge can answer: "What does this kit give me, and how does it differ from a prompt file?"
- Pass: §1 is ≥200 words; references the four primary artefacts; does not require reading any other section to understand the basic value proposition.
- Fail: §1 is empty, stub-only, or assumes prior RPI knowledge without explanation.

---

[x] **Task 3 — Write §2 "Why the RPI Pattern"**
- Source: research.md — §3 (why RPI adds value), §4 (one-phase-per-session constraint), docs/The Research–Plan–Implement paper
- Action: In `docs/developer-guide.md §2`, write prose covering: (a) the cognitive overload problem in unstructured AI workflows; (b) how phase separation reduces premature convergence; (c) why evidence-based decisions (research before planning) improve output quality; (d) the "phase collapse" failure mode and why the kit prevents it.
- Verify: Read §2 and confirm a developer currently using free-form prompts can articulate why adding phase structure improves outcomes.
- Pass: §2 covers all four sub-points; references the "one phase per session" constraint; cites the theoretical basis without going into LLM internals.
- Fail: §2 is a bullet dump; omits the phase collapse concept; or duplicates §6 (which covers skills, not the pattern itself).

---

[x] **Task 4 — Write §3 "Installation"**
- Source: research.md — §2 (install.js, install.sh, canonical paths), §4 (hard constraint: installation paths)
- Action: In `docs/developer-guide.md §3`, write prose and code blocks covering: (a) prerequisites (Node.js ≥18, bash); (b) default install (no flags → `~/.copilot/skills/`); (c) tool-specific installs (`--tool codex` → `~/.agents/skills/`, `--tool antigravity` → `~/.gemini/antigravity/skills/`); (d) custom target via `--target <path>`; (e) update workflow (`--mode overwrite`); (f) dry-run verification (`--dry-run`). Each scenario must have a code block with the exact command.
- Verify: Follow the §3 instructions on a clean machine context without consulting `README.md` or `install.js` comments. Confirm all six scenarios are covered and commands are syntactically correct.
- Pass: Six scenarios present; all commands use `node install.js` or `bash install.sh`; `--dry-run` step included; no broken or missing commands.
- Fail: Any scenario omitted; commands reference non-existent flags; `--dry-run` step absent.

---

[x] **Task 5 — Write §4 "Operational Workflow"**
- Source: research.md — §2 (core logic: skill routing, phase enforcement, bootstrap governance), §4 (implicit contracts), §5 (validation checklist pattern, atomic task decomposition)
- Action: In `docs/developer-guide.md §4`, write prose and a workflow diagram (ASCII or Mermaid) covering: (a) the three phases and their artefacts (research.md → plan.md → SIGNOFF); (b) how to start a new project (`rpi-new.sh` command); (c) how to invoke each phase (skill invocation pattern); (d) FAR validation criteria for research; (e) FACTS validation criteria for plan; (f) recursion protocol when a blocker is hit; (g) the bootstrap process (`.rpi/AGENTS.md` auto-creation).
- Verify: Read §4 and simulate running a project end-to-end mentally. Confirm every transition point (research→plan, plan→implement) has an explicit gate condition.
- Pass: All three phases documented; both validation criteria sets (FAR, FACTS) present; recursion protocol described; `rpi-new.sh` command shown; workflow diagram renders.
- Fail: Any phase omitted; validation criteria absent; recursion protocol missing; no command shown for project creation.

---

[x] **Task 6 — Write §5 "When to Use RPI"**
- Source: research.md — §3 (when RPI adds value vs. overhead), §8 (migration narrative unknown resolved as lightweight subsection)
- Action: In `docs/developer-guide.md §5`, write prose covering: (a) high-value scenarios (complex problems, high-stakes changes, cross-team coordination, novel solution space); (b) low-value / overhead scenarios (trivial tasks, well-understood one-liners, time-critical hotfixes); (c) a lightweight "coming from unstructured AI workflows" subsection explaining the transition mindset (not a step-by-step migration guide).
- Verify: Read §5 and confirm a developer can make a go/no-go decision for RPI on a given task without consulting any other section.
- Pass: Both high-value and low-value scenarios include ≥3 concrete examples each; "coming from unstructured workflows" subsection present (≥100 words); no prescriptive migration steps.
- Fail: Only high-value scenarios documented; migration subsection absent; fewer than 3 examples per scenario type.

---

[x] **Task 7 — Write §6 "Why Skills Outperform Alternatives"**
- Source: research.md — §6 (entire section: phase enforcement, progressive disclosure, statelessness, native tooling integration, governance, cognitive load, tool-agnosticism)
- Action: In `docs/developer-guide.md §6`, write prose with a comparison table (Skills vs. Custom Prompts vs. Instructions vs. Agents) and narrative paragraphs covering each of the seven advantages identified in `research.md §6`. Each advantage must include a concrete example or counter-example.
- Verify: Read §6 and confirm the comparison table covers all four alternatives; confirm each of the seven advantages from `research.md §6` appears at least once.
- Pass: Comparison table present with ≥4 columns; all 7 advantages covered; ≥1 concrete example per advantage.
- Fail: Table absent; any of the 7 advantages from `research.md §6` omitted; advantages listed without examples.

---

[x] **Task 8 — Write §7 "Developer Workflow Quick Reference"**
- Source: research.md — §2 (rpi-new.sh, skill invocation), §5 (slug-based project naming, recursive phase handling)
- Action: In `docs/developer-guide.md §7`, write a condensed reference covering: (a) project creation command with example output; (b) phase invocation pattern for each of the three phases (one-liner per phase); (c) directory structure diagram of a completed project (`.rpi/projects/yyyymmdd-slug/`); (d) SIGNOFF file location and meaning.
- Verify: Read §7 and confirm a developer who has already read §3–§4 can use §7 as a day-to-day cheatsheet without re-reading earlier sections.
- Pass: All four sub-items present; directory diagram shows `research.md`, `plan.md`, and `SIGNOFF`; phase invocation patterns are ≤2 lines each.
- Fail: Any sub-item absent; directory diagram missing `SIGNOFF`; section duplicates §4 prose rather than condensing it.

---

[x] **Task 9 — Write §8 "Troubleshooting and FAQ"**
- Source: research.md — §1 (ambiguities: target profile, skill education scope), §4 (hard constraints, implicit contracts), §8 (unknowns)
- Action: In `docs/developer-guide.md §8`, write Q&A entries for the following issues: (a) "My agent performed research AND planning in one session — what happened?" (phase collapse); (b) "The skill didn't load / SKILL.md not found" (installation path troubleshooting); (c) "`.rpi/AGENTS.md` was overwritten by the skill" (bootstrap versioning explanation); (d) "I need to undo a phase and redo research" (recursion protocol); (e) "Can I use the kit without one of the supported tools?" (tool-agnosticism and `--target` flag). Each entry: question as `###` heading, answer in prose (≥50 words).
- Verify: Read §8 and confirm all 5 FAQ entries are present and answer the question without requiring the reader to consult another section.
- Pass: 5 `###` headings present; each answer ≥50 words; all answers are self-contained.
- Fail: Fewer than 5 entries; any answer redirects entirely to another section without providing a direct answer.

---

[x] **Task 10 — Add developer guide link to `README.md`**
- Source: research.md — §2 (README.md as high-level entry point)
- Action: In `README.md`, add a single line under the existing "Documentation" or top-level section (whichever is most appropriate) linking to `docs/developer-guide.md` with the text "→ Full Developer Guide". Do not alter any other content in `README.md`.
- Verify: Open `README.md` and confirm the link `[→ Full Developer Guide](docs/developer-guide.md)` (or equivalent) is present and that no other lines have changed.
- Pass: Link present in `README.md`; renders correctly in GitHub Markdown; no other README content changed.
- Fail: Link absent; more than one line changed in `README.md`; link points to wrong path.

---

## 4) Verification Plan

- **Automated (CI):** None required for documentation; Markdown linting (e.g., `markdownlint`) may be run optionally to catch broken headings or unclosed code blocks, but is not a gate.
- **Manual/Local:**
  1. Open `docs/developer-guide.md` in a GitHub Markdown preview (or VS Code preview) and confirm the TOC anchor links all resolve.
  2. Read the guide linearly from §1 to §8 and verify the Safe State criteria (§1 Strategy) are met without consulting any other file.
  3. Open `README.md` and confirm the developer guide link is present and resolves to the correct file.
  4. Confirm no file other than `docs/developer-guide.md` and `README.md` has been modified using `git diff --name-only`.

---

## 5) Validation - FACTS Criteria

- [x] **Feasible:** All tasks require only writing Markdown content into two files (`docs/developer-guide.md`, `README.md`). No build tools, external APIs, or special permissions are required. Source material (research.md, existing kit files) is fully available. Tasks 1–10 are executable with standard file editing tools.
- [x] **Atomic:** Each task contains exactly one action verb group (create scaffold / write section X / add link) and one verification step. No task combines two independent deliverables. Tasks 2–9 each write exactly one `##` section; Task 1 creates the scaffold; Task 10 adds one line to README.
- [x] **Clear:** Every task specifies the exact file, section, and content requirements. Pass/Fail criteria use observable states (word counts, heading counts, presence of specific content) rather than subjective judgements. No task requires the implementer to make design decisions not already resolved in §1.
- [x] **Testable:** Every task has explicit Pass criteria (quantified: word counts, item counts, presence/absence of specific elements) and Fail criteria (observable absence or regression). The Safe State in §1 provides an integration-level test across all tasks.
- [x] **Scoped:** All tasks operate within the two files defined in §1 In Scope. No task touches skill files, installer scripts, templates, or stage files. Tasks are bounded by the content gaps identified in `research.md §1–§3`.

<!-- ⛔ END OF PLAN PHASE — Do NOT proceed to implementation. Do NOT edit source code. Return control to the operator. -->
