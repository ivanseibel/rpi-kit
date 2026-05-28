# RPI Kit — Developer Guide

A comprehensive reference for developers adopting the RPI Workflow Kit. Read this guide from start to finish on first use, or jump to the relevant section using the table of contents below.

## Table of Contents

1. [What is the RPI Kit](#1-what-is-the-rpi-kit)
2. [Why the RPI Pattern](#2-why-the-rpi-pattern)
3. [Installation](#3-installation)
4. [Operational Workflow](#4-operational-workflow)
5. [When to Use RPI](#5-when-to-use-rpi)
6. [Why Skills Outperform Alternatives](#6-why-skills-outperform-alternatives)
7. [Developer Workflow Quick Reference](#7-developer-workflow-quick-reference)
8. [Troubleshooting and FAQ](#8-troubleshooting-and-faq)

---

## 1. What is the RPI Kit

The **RPI Kit** is a packaged, installable implementation of the Research → Plan → Implement (RPI) methodology. It gives you a complete, ready-to-run workflow system that you can drop into any project and use with any AI agent tool — Copilot, Claude, Gemini, Cursor, Codex, or others — without modification.

### The Kit vs. the Pattern

The **RPI pattern** is a methodology: a prescription for how to approach complex problems by separating divergent exploration (Research), convergent decision-making (Plan), and procedural execution (Implement) into strictly bounded phases. The pattern is grounded in cognitive science, systems engineering, and cross-disciplinary practice — from the scientific method to military decision-making to design thinking. Its theoretical foundations are summarised in §2 of this guide.

The **RPI Kit** is the distribution mechanism that makes the pattern usable without manual setup. Where a developer following the pattern manually would need to write and maintain their own prompts, templates, validation rules, and governance documents, the kit installs all of that infrastructure globally in one command. The kit is to the RPI pattern what a well-maintained framework is to an architectural style — it codifies best practices, enforces constraints, and removes setup friction.

### What "the kit gives me" vs. a prompt file

A prompt file (e.g., a custom `.instructions.md` or a free-form system prompt) gives the AI agent a set of instructions. When those instructions grow complex, the agent must parse and reason about all of them simultaneously — and nothing prevents it from ignoring or reinterpreting parts of the prompt under context pressure.

The RPI Kit gives you something structurally different: **a skill**, which is a discrete, versioned, installable artifact that the agent tooling recognises and loads natively. The skill routes the agent to exactly one phase at a time, ensuring that only the constraints relevant to the current phase are in the agent's context. This is a mechanical enforcement of phase separation, not a soft convention.

### The Four Primary Artefacts

The kit installs four categories of artefact:

| Artefact | Location (after install) | Purpose |
|---|---|---|
| **SKILL.md** | `<skills-root>/rpi-workflow/SKILL.md` | Lightweight routing hub — loads one stage at a time based on the current phase |
| **Stage files** | `<skills-root>/rpi-workflow/stages/` | Phase-specific instructions (`research.md`, `plan.md`, `implement.md`) — each is self-contained |
| **Templates** | `<skills-root>/rpi-workflow/resources/` | Research and plan templates, validation guide, governance template (`agents-md-template.md`) |
| **Installer** | `install.js` / `install.sh` (kit root) | Installs all skills to the correct tool-specific directory; supports dry-run, update, and custom target |

Together these artefacts deliver the full RPI workflow: the routing hub decides what to load, the stage files enforce constraints, the templates structure the output, and the installer keeps everything up to date across all your projects from a single source.

---

## 2. Why the RPI Pattern

### Theoretical Foundations

RPI is a cross-disciplinary cognitive and operational pattern that recurs across science, engineering, military strategy, and design. At its core it advocates distinct phases of **understanding a problem (Research), devising a solution approach (Plan), and executing that solution (Implement)** — mirroring the structure of the scientific method, where researchers first gather observations (research), then form hypotheses and experimental designs (plan), and finally conduct experiments and analyse results (implement and evaluate).

The pattern appears throughout intellectual history. In **engineering and architecture**, classical project lifecycles separate requirements analysis from design from construction, enforced through phase-gated reviews. In **military strategy**, formal planning processes require reconnaissance and intelligence-gathering before drawing up orders; the U.S. Army's Military Decision-Making Process mandates a *Mission Analysis* step to establish ground truth before any *Course of Action Development*, which precedes execution. John Boyd's **OODA loop** (Observe–Orient–Decide–Act) is an iterative microcosm of RPI: observing and orienting correspond to research, deciding to planning, acting to implementation. The **Plan–Do–Check–Act (PDCA) cycle** in quality management similarly emphasises *no action without a plan, and no plan without facts*.

Crucially, RPI is a *pattern* rather than a rigid checklist. Phases represent **logically distinct cognitive modes** — Research is divergent and exploratory; Plan is convergent and evaluative; Implement is procedural and productive — not strict chronological stages. Problems often require cycling through RPI more than once, and at different scales: a large project might run a full RPI cycle at the macro level, while individual implementation tasks run their own micro-RPI cycles internally. What the pattern insists on is *separation of concerns*: dedicating focused attention to one cognitive mode at a time, rather than blending them in a single undifferentiated stream.

**Key principles validated across domains:**

- **Separate thinking from doing, but do not separate them so far that they lose touch.** RPI is a middle path between thoughtless action and actionless thought.
- **Evidence drives the plan; the plan drives the implementation.** Neither order may be reversed without violating the method.
- **Each phase has a distinct cognitive mode.** The skill must never blend them in a single prompt or session.
- **Phases produce actionable outputs, not documentation theatre.** `research.md` must yield verifiable facts; `plan.md` must yield tasks that can be individually marked pass/fail.
- **The pattern scales to problem complexity.** Trivial changes may compress phases; the kit must not impose bureaucratic overhead on small tasks.

### The Problem: Cognitive Overload in Unstructured AI Workflows

When a developer asks an AI agent to "help with a feature," the agent faces — and creates — a cognitive problem. Without phase structure, the agent simultaneously explores the problem space, formulates a solution, and begins generating implementation in a single turn. The developer accepts or rejects this output without knowing whether the "research" embedded in the agent's reasoning was sound, whether the implied plan was evaluated against alternatives, or whether the implementation reflects deliberate trade-offs.

This is the **phase collapse** failure mode: Research, Plan, and Implement compressed into one undifferentiated stream of output. Phase collapse has several measurable consequences:

- **Premature convergence** — The agent locks onto the first plausible solution before the problem space is adequately explored. Alternatives are never surfaced.
- **Opinion as evidence** — Unconstrained agents frequently state assumptions as facts ("the best approach is X") without citation or verification.
- **Silent scope expansion** — When implementing, the agent adds features or changes it "decided" during the planning step it never explicitly executed, making the output unpredictable.
- **Context exhaustion** — Loading all three phases' worth of instructions into a single prompt consumes tokens that could be used for actual work.

### How Phase Separation Reduces Premature Convergence

The RPI pattern addresses phase collapse by making each phase a **separate, gate-controlled session**. The Research phase is explicitly divergent: its only permitted output is a `research.md` document containing verified facts, observations, and open questions — no solutions, no recommendations. The Plan phase is explicitly convergent: it reads the research artefact and produces a task list with atomic, testable items — no implementation. The Implement phase is purely procedural: it executes the plan exactly as written — no new decisions, no scope additions.

By enforcing these constraints at the phase level rather than at the instruction level, the pattern prevents the agent from "thinking ahead" into a phase it hasn't been authorised to enter.

### Evidence-Based Decisions: Research Before Planning

The FAR validation criteria (Factual, Actionable, Relevant) that gate the transition from Research to Plan exist precisely because unstructured AI workflows routinely substitute confident assertion for grounded evidence. A research artefact that passes FAR validation has:

- **Factual** statements that cite specific source files, line numbers, or observable states — not assumptions.
- **Actionable** findings that a planner can translate directly into tasks — not vague observations.
- **Relevant** content scoped to the problem — not tangential background that inflates the document without informing the plan.

This discipline means the plan is anchored to evidence. When a plan task says "refactor the slug algorithm," the evidence for why it needs refactoring — and how it currently behaves — is already documented in `research.md`, reviewed, and validated. The plan doesn't need to carry forward reasoning; it can be a clean list of atomic actions.

### The "One Phase Per Session" Constraint

The most critical constraint in the RPI Kit is **one phase per session**. Each agent session operates in exactly one of the three phases. When a phase is complete, the agent stops and returns control to the operator. The operator decides whether to begin the next phase in a new session.

This constraint is not merely a preference — it is enforced mechanically. SKILL.md routes the agent to only one stage file. The stage file opens with a self-declaration anchoring the agent to that phase and lists explicit "forbidden actions" that include transitioning to a subsequent phase. The `.rpi/AGENTS.md` governance document that the kit installs in every repository also specifies that phase collapse is the most severe workflow violation an agent can commit.

The reason this is mechanical rather than advisory is that the constraint is easily violated under instruction pressure. If an agent is given a prompt that says "do research and then plan," it will do both — even if a different part of the instruction says "only do one phase." Hard routing, not soft instructions, is the reliable mechanism.

---

## 3. Installation

### Prerequisites

- **Node.js ≥ 18** (for `node install.js`) or **bash** (for `bash install.sh`)
- Read/write access to your home directory (skills are installed at user level, not per-project)

### Scenario 1 — Default install (Copilot)

Installs skills to `~/.copilot/skills/` — the default path recognised by GitHub Copilot.

```bash
node install.js
```

or equivalently:

```bash
bash install.sh
```

### Scenario 2 — Tool-specific install: Codex

Installs skills to `~/.agents/skills/` — the path recognised by OpenAI Codex.

```bash
node install.js --tool codex
```

### Scenario 3 — Tool-specific install: Gemini (Antigravity)

Installs skills to `~/.gemini/antigravity/skills/` — the path recognised by Gemini's Antigravity agent.

```bash
node install.js --tool antigravity
```

### Scenario 4 — Explicit Copilot install

Equivalent to the default, but explicit. Use when scripting to make the target tool unambiguous.

```bash
node install.js --tool copilot
```

### Scenario 5 — Custom target path

Overrides the computed destination with any absolute or relative path. Use this when your agent tool reads skills from a non-standard location. Cannot be combined with `--tool`.

```bash
node install.js --target /path/to/custom/skills
```

### Scenario 6 — Update (overwrite existing files)

By default, the installer skips files that already exist. To update all skill files to the latest version from the kit, use `--mode overwrite`.

```bash
node install.js --mode overwrite
```

Combine with `--tool` as needed:

```bash
node install.js --tool codex --mode overwrite
```

### Dry-run verification

Before any install or update, run with `--dry-run` to see exactly what the installer would do without writing any files. This is the recommended first step when installing into a new environment.

```bash
node install.js --dry-run
node install.js --tool antigravity --dry-run
node install.js --mode overwrite --dry-run
```

Example dry-run output:

```
RPI Kit — Installation (dry-run)
  Source : /path/to/rpi-kit/skills
  Target : /Users/you/.copilot/skills
  Mode   : skip

  dry-run: create     rpi-workflow/SKILL.md
  dry-run: create     rpi-workflow/stages/research.md
  dry-run: create     rpi-workflow/stages/plan.md
  dry-run: create     rpi-workflow/stages/implement.md
  ...

Dry-run complete. N file(s) would be processed.
```

---

## 4. Operational Workflow

### Overview

The RPI workflow follows three phases in strict sequence. Each phase produces exactly one artefact. Transitions between phases require explicit operator authorisation — the agent never self-transitions.

```
┌─────────────┐     FAR gate      ┌─────────────┐    FACTS gate    ┌──────────────┐
│  RESEARCH   │ ────────────────▶ │    PLAN     │ ───────────────▶ │  IMPLEMENT   │
│ research.md │                   │  plan.md    │                  │ code+SIGNOFF │
└─────────────┘                   └─────────────┘                  └──────────────┘
       ▲                                 ▲                                 │
       │        ◀── recurse on blocker ──┘ ◀────── recurse on blocker ────┘
```

| Phase | Artefact produced | Validation gate |
|---|---|---|
| **Research** | `.rpi/projects/<id>/research.md` | FAR (Factual, Actionable, Relevant) |
| **Plan** | `.rpi/projects/<id>/plan.md` | FACTS (Feasible, Atomic, Clear, Testable, Scoped) |
| **Implement** | Source code changes + `.rpi/projects/<id>/SIGNOFF` | Pass/fail per task in plan.md |

### Bootstrap: First-time project setup

When the `rpi-workflow` skill is first invoked in a repository, it bootstraps the `.rpi/` directory structure automatically:

- Creates `.rpi/AGENTS.md` from the versioned governance template — this file defines agent roles, handoff rules, and phase enforcement for the project.
- Creates `.rpi/projects/.gitkeep` to establish the project artefacts directory.

On subsequent invocations, the skill checks the version token in `.rpi/AGENTS.md` against the installed template. If the installed version is outdated, it silently overwrites the file with the current template and reports the update.

### Invoking each phase

Each phase is invoked by referencing the `rpi-workflow` skill in your agent session and stating the phase you are entering. The skill's routing logic loads only the corresponding stage file.

**Research phase:**
> "Use rpi-workflow. I am starting the Research phase for project `.rpi/projects/20240101-my-project/`."

**Plan phase:**
> "Use rpi-workflow. I am starting the Plan phase for project `.rpi/projects/20240101-my-project/`."

**Implement phase:**
> "Use rpi-workflow. Start implementation. Plan: `.rpi/projects/20240101-my-project/plan.md`."

### FAR validation criteria (Research → Plan gate)

Before the Research phase is considered complete, `research.md` must pass FAR validation:

| Criterion | Requirement | Fail example |
|---|---|---|
| **Factual** | Every claim cites a specific file, line range, or observable state | "The installer is complex" (no citation) |
| **Actionable** | Findings can be translated directly into plan tasks | "Things need improvement" (too vague) |
| **Relevant** | All content is scoped to the stated problem | Background history unrelated to the task |

### FACTS validation criteria (Plan → Implement gate)

Before the Plan phase is considered complete, every task in `plan.md` must pass FACTS validation:

| Criterion | Requirement | Fail example |
|---|---|---|
| **Feasible** | The task can be completed with available tools and information | "Redesign the entire architecture" (unbounded) |
| **Atomic** | One action verb group; one verification step | "Refactor and document the module" (two actions) |
| **Clear** | Exact file, section, and content requirements specified | "Improve the README" (no specifics) |
| **Testable** | Explicit pass/fail criteria using observable states | "Make it better" (subjective) |
| **Scoped** | Bounded to the defined in-scope artefacts | Task that modifies out-of-scope files |

### Recursion protocol

If a blocker is encountered during any phase:

1. **Stop work immediately** — do not improvise or work around the constraint.
2. **Document the blocker** — update the current phase artefact with the specific issue.
3. **Recurse to the prior phase** — return to Plan for execution impossibilities; return to Research for fundamental unknowns.
4. **Wait** — do not resume the current phase until the prior phase has been updated and re-validated.

---

## 5. When to Use RPI

The RPI pattern adds the most value when the cost of getting it wrong is high or the solution space is large. It introduces overhead when the problem is well-understood and the answer is already known.

### High-value scenarios (use RPI)

Use RPI when:

1. **The problem space is large or ambiguous.** You're not sure what the right solution is and need to explore options before committing. Example: designing a new authentication system, evaluating a migration from one framework to another, planning a cross-team API contract.

2. **The stakes are high.** Getting it wrong is expensive to reverse. Example: a schema migration that affects production data, a refactor that changes public-facing API surfaces, introducing a new dependency that will be long-lived.

3. **Multiple people or teams are involved.** The research and plan artefacts act as coordination documents — written evidence of what was investigated, what was decided, and why. Example: a team deciding on a shared logging standard, an org-wide adoption of a new tooling pattern.

4. **The solution space is novel.** You're solving a problem you haven't solved before and can't rely on prior experience. Example: integrating an AI agent into an existing CI pipeline for the first time, building a new service with no prior art in the codebase.

5. **You need an audit trail.** The research and plan documents are persistent artefacts that explain why decisions were made. Example: post-mortems, architectural decision records, compliance contexts.

### Low-value / overhead scenarios (skip or compress RPI)

Do not use full RPI when:

1. **The task is trivial and well-understood.** Example: renaming a variable, fixing a typo in documentation, bumping a version number in a config file.

2. **The answer is already known.** You've solved this exact problem before, the implementation is mechanical, and there are no meaningful trade-offs to evaluate. Example: adding a standard null-check, applying a well-known sorting algorithm.

3. **Time is critical and reversibility is high.** A production hotfix that needs to go out in minutes, where the patch is a one-line change and rollback is trivial. In these cases, act first and document after.

4. **The scope is a single atomic operation.** If the entire task would collapse to a single plan task with a single verification step, the overhead of a formal research document is disproportionate.

### Coming from unstructured AI workflows

If your current AI workflow consists of free-form prompts — asking the agent to "help with this feature" or "review this code and improve it" — the transition to RPI requires a shift in how you think about the agent session.

In unstructured workflows, **a single conversation is the unit of work**. You start with a question, the agent replies with a solution, you iterate. The agent's reasoning, decision-making, and implementation all happen in that conversation, often mixed together invisibly.

In RPI workflows, **a phase is the unit of work**. A Research session produces only a document of facts. A Plan session produces only a task list. An Implement session executes only what the plan prescribes. Each session is short, focused, and has a clear done condition.

The practical adjustment: resist the urge to ask the agent to "just do it." Instead, ask the agent to research the problem first. Read the `research.md` output, evaluate it, and only then ask it to plan. Review the `plan.md`, decide you're satisfied, and only then ask it to implement. The initial overhead of this discipline is real — it takes longer to get to the first line of code. The payoff is that the first line of code is far more likely to be the right one.

---

## 6. Why Skills Outperform Alternatives

Skills, as used in the RPI Kit, are discrete installable artefacts that AI agent tooling loads natively. They are architecturally distinct from custom prompts, instruction files, and agents. This section explains the seven concrete advantages skills have over the alternatives, with a comparison table and examples.

### Comparison Table

| Capability | Skills (rpi-workflow) | Custom Prompts | Instruction Files | Custom Agents |
|---|---|---|---|---|
| Phase enforcement (mechanical) | ✅ File-switch routing | ❌ Relies on AI compliance | ❌ Relies on AI compliance | ⚠️ Possible but complex |
| Progressive detail disclosure | ✅ One stage loaded at a time | ❌ Full prompt always loaded | ❌ Full file always loaded | ⚠️ Requires custom logic |
| Stateless reinstallability | ✅ Global install, version-controlled | ❌ Per-project, manual sync | ❌ Per-project, manual sync | ⚠️ Varies by platform |
| Native agent tooling integration | ✅ Auto-discovered by Copilot, Codex, Gemini | ❌ Must be configured per session | ⚠️ Partial | ⚠️ Tool-specific |
| Governance / role-based constraints | ✅ `.rpi/AGENTS.md` + phase gate | ❌ Must be embedded in prompt | ❌ Must be embedded in file | ⚠️ Possible but brittle |
| Cognitive load reduction | ✅ Only active-phase constraints loaded | ❌ Full constraint set loaded | ❌ Full constraint set loaded | ⚠️ Depends on design |
| Tool-agnosticism | ✅ Same skill works across all tools | ❌ Often drifts tool-specific | ❌ Often drifts tool-specific | ❌ Typically tool-specific |

### Advantage 1: Mechanical Phase Enforcement

A custom prompt that *says* "only do research in this session" can be overridden if the agent decides to plan anyway — and agents frequently make this decision when they detect that a plan is the logical next step. SKILL.md's routing algorithm prevents this by loading only `stages/research.md` when the Research phase is invoked. The agent literally does not have `stages/plan.md` in its context; it cannot perform planning because the planning instructions are not present.

**Counter-example:** A 200-line instruction file that covers all three phases must include branching logic (`if the user asks for research...`), and the agent must parse and apply that branching on every invocation. Under context pressure (long conversations, large codebases), this branching is frequently ignored.

### Advantage 2: Progressive Detail Disclosure

The three stage files together contain thousands of lines of instructions. A prompt or instruction file approach would load all of this into the agent's context for every invocation, consuming tokens that could be used for actual project work. The skill loads only the active stage (~800 lines), preserving context for the problem at hand.

**Example:** In a Research session, `stages/research.md` is loaded. The 700-line `stages/implement.md` — with its task-tracking, pass/fail criteria, and SIGNOFF format — is not present at all. The agent is not distracted by implement-phase concerns.

### Advantage 3: Stateless Reinstallability

Skills are installed once, globally, to `~/.copilot/skills/`, `~/.agents/skills/`, or `~/.gemini/antigravity/skills/`. Every project on the machine uses the same installed skill version. When the kit releases an update, `node install.js --mode overwrite` propagates the update to all tools in one command — no per-project file editing required.

**Counter-example:** A custom prompt stored in a repository must be updated in every repository that uses it. Teams commonly end up with diverged copies of the same prompt, each with local modifications, with no mechanism to reconcile them.

### Advantage 4: Native Agent Tooling Integration

Copilot, Codex, and Gemini are designed to discover and load skill metadata from their respective skills directories without additional configuration. A developer who installs the rpi-kit and opens a repository in VS Code with Copilot immediately has the `rpi-workflow` skill available — no `.vscode/settings.json` entries, no session configuration, no manual attachment.

**Counter-example:** Custom instruction files (`.instructions.md`, `.prompt.md`) require the developer to either include them in every conversation manually or configure the agent to look for them. New team members must be told these files exist and how to use them.

### Advantage 5: Governance and Role-Based Constraints

The skill bootstraps `.rpi/AGENTS.md` into every repository it touches, establishing a versioned governance contract that defines agent roles (Researcher, Planner, Implementer), mandatory validation checks, and handoff rules. If a team wants to tighten constraints — for example, requiring all research to cite at least three sources — they update the governance template in the kit, and the next install propagates the change.

**Counter-example:** Embedding governance rules in a custom agent means updating the agent definition every time the rules change. In a multi-team organisation with dozens of agents, this is impractical.

### Advantage 6: Cognitive Load Reduction

A monolithic prompt covering all three phases of RPI simultaneously is an invitation to misuse. An agent holding "don't plan yet, just research" alongside "here are the 15 rules for writing plan tasks" must actively suppress the planning instructions during a research session. The suppression is imperfect; cognitive bleed between phases degrades output quality.

The skill solves this by making the suppression structural. The planning rules are not in context during a research session. The agent has one job, with one set of constraints, with no other phase's concerns present.

### Advantage 7: Tool-Agnosticism

The `rpi-workflow` skill uses no tool-specific APIs, annotations, or syntax. It is pure Markdown and a bash scaffolding script. The same skill file installed to `~/.copilot/skills/` and `~/.agents/skills/` works identically in both tools. A team that migrates from Copilot to Codex runs `node install.js --tool codex` — the workflow is preserved with zero modification.

**Counter-example:** Custom agents built for Copilot (using Copilot's agent manifest format) cannot be used in Gemini without a rewrite. Instruction files written with Copilot-specific phrasing ("As a Copilot agent...") require cleanup before they work reliably elsewhere.

---

## 7. Developer Workflow Quick Reference

A condensed cheatsheet for day-to-day use. Assumes you have read §3 (Installation) and §4 (Operational Workflow).

### Phase invocation (one-liner per phase)

**Research:**
> `Use rpi-workflow. Research phase. Project: .rpi/projects/20240415-your-project-title/`

**Plan:**
> `Use rpi-workflow. Plan phase. Project: .rpi/projects/20240415-your-project-title/`

**Implement:**
> `Use rpi-workflow. Implement phase. Plan: .rpi/projects/20240415-your-project-title/plan.md`

### Completed project directory structure

```
.rpi/
└── projects/
    └── 20240415-your-project-title/
        ├── research.md   ← Research phase output (FAR-validated)
        ├── plan.md       ← Plan phase output (FACTS-validated, tasks checked [x])
        └── SIGNOFF       ← Implementation complete; lists all tasks with verification outcomes
```

### SIGNOFF file

The `SIGNOFF` file is created by the agent at the end of the Implement phase, after every task in `plan.md` has been verified and marked `[x]`. It lists every task with its verification result, confirms the Safe State defined in the plan has been achieved, and notes any observations from implementation.

**Location:** `.rpi/projects/<yyyymmdd-slug>/SIGNOFF`

**Meaning:** SIGNOFF is the source of truth for implementation completion. Its presence, with all tasks verified, signals that the project is done and ready for review.

---

## 8. Troubleshooting and FAQ

### My agent performed research AND planning in one session — what happened?

This is **phase collapse** — the most severe workflow violation in the RPI pattern. It occurs when the agent is not constrained to a single phase, either because the skill was not invoked, was invoked but not routed correctly, or because the operator's prompt contained an implicit instruction to perform multiple phases (e.g., "research this and then write a plan").

To recover: discard the plan produced during the collapsed session. It was generated without a validated, FAR-compliant research document as its evidence base, which means its tasks may be based on assumptions rather than facts. Start a fresh Research session, produce a validated `research.md`, then begin a new Plan session using that document as input.

To prevent: always invoke the skill explicitly and state the single phase you are entering at the start of each session. Do not use prompts that span multiple phases. If you notice the agent moving from research to planning without being asked, stop the session immediately.

### The skill didn't load / SKILL.md not found

This usually means the skill is not installed to the path your agent tool is looking in. Diagnose with these steps:

1. **Verify the install target** by running `node install.js --dry-run`. Check the `Target` line in the output — this is where the skill would be installed.
2. **Check what your agent tool expects.** Copilot reads from `~/.copilot/skills/`, Codex from `~/.agents/skills/`, Gemini Antigravity from `~/.gemini/antigravity/skills/`. If you installed to the wrong path, reinstall with the correct `--tool` flag.
3. **Confirm the file exists** after installation: `ls ~/.copilot/skills/rpi-workflow/SKILL.md` (adjust path for your tool).
4. **If using a custom path**, ensure the `--target` path you specified matches what your agent tool is configured to read. The kit cannot discover your tool's configuration automatically; you must provide the correct path.

### `.rpi/AGENTS.md` was overwritten by the skill

This is expected bootstrap behaviour. The skill checks the `rpi-agents-version` token on the first line of `.rpi/AGENTS.md` against the version in the installed template. If the installed version is absent or lower than the template, the skill overwrites the file with the current template and reports: "Updated `.rpi/AGENTS.md` to version X.Y."

This is intentional: `.rpi/AGENTS.md` is a governance contract whose canonical source is the skill template, not the project repository. Project-specific customisations should not be made directly to this file; if you need to extend governance rules, do so in a separate project-level document and reference it from `.rpi/AGENTS.md`.

If you need to pin a specific governance version and prevent automatic updates, you can set the version token to a value higher than the current template version. Be aware this will prevent you from receiving governance improvements in future kit updates.

### I need to undo a phase and redo research

The recursion protocol covers this case. If you discover during the Plan or Implement phase that the research is incomplete or incorrect, you recurse back to Research:

1. **Stop work in the current phase immediately.** Do not continue planning or implementing.
2. **Document the gap** in the current phase artefact — update `plan.md` or the current task in `plan.md` with a clear description of what research finding is missing or incorrect.
3. **Open a new Research session** and explicitly tell the agent you are recursing: "Use rpi-workflow. Research phase. I am recursing from [Plan/Implement] because [specific gap]. Project: `.rpi/projects/<id>/`."
4. **Update `research.md`** with the new findings, re-validate against FAR criteria.
5. **Return to Plan** with the updated research document, and revise or re-write the affected plan sections.

The research and plan artefacts are living documents within a project — they are updated through recursion, not replaced. Do not create a new project directory for a recursion; update the existing artefacts in place.

### Can I use the kit without one of the supported tools?

Yes. The kit is tool-agnostic. If you use an AI agent tool that is not Copilot, Codex, or Gemini Antigravity, you can still use the kit by providing the path where your tool reads skills:

```bash
node install.js --target /path/to/your/tool/skills
```

The `--target` flag overrides the computed destination and installs the skill to any path you specify. Once installed, invoke the skill by referencing `SKILL.md` in whatever way your tool supports loading skill files.

If your tool does not natively support skills in a directory, you can also copy the contents of `SKILL.md` into your tool's prompt or instruction configuration manually. The workflow will function correctly; you will simply lose the automatic routing (the agent will need to be told which stage file to load, rather than having it handled by the skill infrastructure). See §6 for an explanation of why native skill loading is architecturally preferable.
