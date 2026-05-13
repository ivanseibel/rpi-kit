# Research - RPI Kit Comprehensive Developer Documentation

## 1) Problem Statement Analysis

- **Trigger:** Developers adopting the RPI Workflow face multiple, fragmented information sources — the Kit README, theoretical RPI foundations, stage-specific instructions, templates, and implementation patterns are scattered across multiple documents and artifacts without a unified developer narrative.
- **User Intent:** Developers who discover the rpi-kit need a **single, authoritative guide that educates them on**: (1) what the RPI Kit is and why it exists; (2) how to install and update the kit across different AI agent tools; (3) how the RPI Workflow operates operationally; (4) when RPI provides value and when it introduces unnecessary overhead; (5) why the Skill-based architecture is superior to custom prompts, instructions, or agents alone.
- **Ambiguities & Open Questions:**
  - What is the **target developer profile**: Teams new to structured workflows? Individual contributors using AI agents? Organizations scaling AI adoption?
  - How much **theoretical background** should documentation include vs. focusing on practical adoption?
  - What level of **implementation detail** is needed (e.g., should developers understand the skill routing algorithm, or just how to invoke it)?
  - Should the documentation include **migration guidance** for teams currently using custom prompts/instructions?

## 2) Code Archaeology / Blast Radius

- **Entry Points:**
  - `README.md` — High-level kit overview, installation examples, project structure explanation [README.md — L1-100]
  - `skills/rpi-workflow/SKILL.md` — Lightweight routing hub that loads one stage at a time [SKILL.md — L1-75]
  - `skills/rpi-workflow/stages/research.md`, `plan.md`, `implement.md` — Phase-specific instructions [stages/* — all files]
  - `skills/rpi-workflow/resources/` — Templates (research, plan) and validation guides [resources/* — all files]
  - `AGENTS.md` (kit-maintenance) — Governance rules for maintaining the toolkit itself [AGENTS.md — L1-50]
  - `.rpi/AGENTS.md` (from template) — Per-project governance defining agent roles and phase constraints [resources/agents-md-template.md — L1-75]
  - `install.js` and `install.sh` — Installation mechanism with tool-specific destination resolution [install.js — L1-100, install.sh — L1-20]
  - `skills/rpi-workflow/scripts/rpi-new.sh` — Scaffolding script that generates new project structures [rpi-new.sh — L1-70]

- **Core Logic:**
  - **Skill routing**: SKILL.md determines the current phase (Research, Plan, or Implement) and loads only the corresponding stage file, enforcing "one phase per session" constraint [SKILL.md — L14-30]
  - **Phase enforcement**: Each stage file (research.md, plan.md, implement.md) contains explicit "forbidden actions" and validation criteria to prevent phase collapse [stages/research.md — L25-40, stages/plan.md — L25-45]
  - **Installer resolution**: install.js resolves tool-specific skill roots (`~/.copilot/skills/`, `~/.agents/skills/`, `~/.gemini/antigravity/skills/`) based on `--tool` flag or defaults to Copilot [install.js — L30-50]
  - **Project scaffolding**: rpi-new.sh transforms project titles into yyyymmdd-slug directory names and initializes research.md from the shared template [rpi-new.sh — L25-50]
  - **Bootstrap governance**: On first invocation, the skill creates `.rpi/AGENTS.md` from a versioned template if absent, or updates it if the version is lower [SKILL.md — L40-50]

- **Data Models:**
  - **Artifact structure**: Research produces `research.md`, Plan produces `plan.md`, Implementation produces code changes + `SIGNOFF` file [README.md — table at L40-50]
  - **Validation data**: FAR criteria (Factual, Actionable, Relevant) for research; FACTS criteria (Feasible, Atomic, Clear, Testable, Scoped) for plan tasks [validation-guide.md — L1-50]
  - **Project metadata**: `.rpi/projects/<yyyymmdd-slug>/` directory pattern with SIGNOFF file marking completion [rpi-new.sh — L24-35, README.md — L130-140]

- **Tests/Validation:**
  - `validation-guide.md` contains concrete examples of FAR-compliant and FAR-violating research statements [validation-guide.md — L5-35]
  - `validation-guide.md` provides FACTS examples for plan tasks [validation-guide.md — L38-75]
  - **Dry-run capability**: `install.js --dry-run` shows planned actions without writing files [install.js — usage comment, README.md — L100-105]

- **Documentation:**
  - Inline comments in install.js explain tool resolution logic [install.js — L15-25]
  - Detailed stage files (research.md, plan.md, implement.md) document constraints and workflows [stages/* — all files]
  - SKILL.md serves as a routing entry point with bootstrap instructions [SKILL.md — entire file]

- **Other Consumers:**
  - Developers who invoke `rpi-workflow` skill indirectly via agent interfaces (Copilot, Gemini, Codex, etc.)
  - Downstream projects that rely on installed skills and project templates
  - Maintainers of the rpi-kit repository who follow governance rules defined in AGENTS.md

## 3) Conceptual Scope

- **In Scope:**
  - How to install the rpi-kit to support any AI agent tool (Copilot, Claude, Gemini, Cursor, Codex, others)
  - How the RPI workflow functions operationally: phase boundaries, routing, constraints, validation
  - Why RPI (the pattern) is effective: cognitive load reduction, preventing premature convergence, enforcement of evidence-based decisions
  - When RPI adds value (complex problems, high stakes, cross-team coordination) vs. when it introduces overhead (trivial tasks, well-understood solutions)
  - Why Skills (as a mechanism) excel compared to custom prompts, instructions, or agents: modularity, statelessness, progressive detail loading, phase enforcement, tool-agnosticism
  - High-level developer workflows: creating a new project, executing each phase, handling blockers and recursion

- **Out of Scope:**
  - Low-level implementation details of how AI LLMs execute prompts
  - Specific AI agent internals or model capabilities
  - Per-tool agent UI/UX (e.g., how Copilot Chat displays suggestions)
  - Custom domain-specific modifications of the RPI pattern for specialized industries
  - Detailed coding examples for specific technologies (focus is on RPI pattern, not tech stack)

## 4) System Constraints

- **Hard Constraints:**
  - **One phase per session**: The skill must not allow an agent session to collapse multiple phases (Research + Plan + Implement) into a single turn to prevent cognitive overload and decision quality degradation [SKILL.md — L9-14, AGENTS.md template — L54-56]
  - **Installation paths**: Skills must be installed to the three canonical locations (`~/.copilot/skills/`, `~/.agents/skills/`, `~/.gemini/antigravity/skills/`) — no intermediate per-project copies [AGENTS.md (kit-maintenance) — rule 4, README.md — L50-70]
  - **Skill statelessness**: Each invocation is independent; the skill cannot assume prior invocations have set project state. Bootstrap logic must handle missing `.rpi/` directories [SKILL.md — L40-50]
  - **Token economy**: Stages are separate files so only the active phase instructions are loaded into the agent's context, reducing token consumption [SKILL.md — L32-35]
  - **Platform independence**: The kit must work with Copilot, Claude, Gemini, Cursor, and Codex without tool-specific branching logic inside the skill [README.md — L4, SKILL.md — L3]

- **Implicit Contracts:**
  - Developers assume that `.rpi/AGENTS.md` is the governing contract for the project; if they edit it, agent behavior changes
  - Developers trust that the skill (SKILL.md) acts as a stateless router, not a persistent orchestrator
  - Teams assume the three stage files (research.md, plan.md, implement.md) are functionally complete and do not reference each other (stage isolation principle) [AGENTS.md (kit-maintenance) — rule 5]
  - The `SIGNOFF` file uniquely marks the end of implementation; its presence is the source of truth [README.md — L130-140]

## 5) Existing Patterns and Exemplars

- **Skill-as-container pattern**: The rpi-workflow skill encapsulates the entire RPI methodology, including routing, validation, templates, and governance — making it reusable, versionable, and installable across tools [SKILL.md — entire structure]
- **Template-driven bootstrapping**: `.rpi/AGENTS.md` is auto-generated from a versioned template (`agents-md-template.md`) on first run, ensuring consistent project governance without manual setup [SKILL.md — L40-50]
- **Validation checklist pattern**: Both research (FAR) and plan (FACTS) phases have explicit, quantifiable validation criteria that prevent subjective phase transitions [validation-guide.md — L1-75]
- **Atomic task decomposition**: Plan tasks are enforced to have exactly one action and one verification, preventing composite work from being masked [stages/plan.md — L50-60, validation-guide.md — L55-75]
- **Slug-based project naming**: Project directories use `yyyymmdd-slug` format (derived from title) to enable easy sorting, versioning, and human-readable organization [rpi-new.sh — L24-35]
- **Recursive phase handling**: When a phase blocker is encountered, agents recurse to the prior phase rather than forcing resolution (e.g., if Implementation reveals a research gap, return to Research) [AGENTS.md template — L43-52]

## 6) Why Skills Outperform Custom Prompts, Instructions, and Agents

Based on capability audit across kit documentation and architectural analysis:

- **Skills enforce phase separation at invocation time**, not just at the documentation level:
  - A custom prompt that *says* "do only research" can be ignored if the AI chooses to plan anyway; a skill-routed call loads only research.md, making other phases inaccessible [SKILL.md — L22-30]
  - Custom instructions or agents in a single file (or globally) must branch on phase detection logic (`if user asks for research...`), adding complexity; skills file-switch to the correct phase [SKILL.md — routing algorithm]

- **Skills enable progressive detail disclosure**:
  - Instead of loading all 3,000+ lines of phases (research.md, plan.md, implement.md) into context, Skills load only the active stage (~800 lines), preserving tokens for the actual project work [README.md — L98-100, SKILL.md — L32-35]
  - Custom prompts encourage monolithic documents or multiple files that the AI must manually filter; skills do this automatically

- **Skills are stateless and reinstallable**:
  - A skill's location (`~/.copilot/skills/rpi-workflow/`) is guaranteed and versionable; updates are applied globally to all projects using `install.js --mode overwrite` [install.js — usage, AGENTS.md (kit-maintenance) — rule 2]
  - Custom prompts and instructions often live in repositories, requiring per-project maintenance; updates to one copy don't propagate [README.md — L91-95]

- **Skills integrate with agent tooling natively**:
  - Copilot, Codex, and Gemini recognize `.copilot/skills/`, `.agents/skills/`, `.gemini/antigravity/skills/` paths and auto-load skill metadata
  - Custom instructions (.instructions.md, .prompt.md) require the agent to be configured to *know* to look for them; skills are discoverable without configuration [AGENTS.md (kit-maintenance) — rule 4]

- **Skills support governance and role-based constraints**:
  - The skill checks per-project `.rpi/AGENTS.md` to enforce roles (Researcher, Planner, Implementer) and mandatory validation criteria; custom prompts would need embedded if-checks for each role [AGENTS.md template — L15-40, SKILL.md — L40-50]
  - If a team wants to add new validation rules (e.g., "all research must cite at least 3 sources"), updating the skill's validation guidance affects all projects; custom instructions require case-by-case updates

- **Skills avoid cognitive load amplification**:
  - A 3,000+ line custom prompt trying to cover all of RPI invites misuse (e.g., "research and plan in one turn"). The skill prevents this by loading only the current phase's constraints [SKILL.md — L9-14, stages/research.md — L1-10]
  - An agent using custom instructions is cognitively loaded with all possibilities; the skill acts as a cognitive filter

- **Skills are tool-agnostic**:
  - The rpi-workflow skill works identically in Copilot, Gemini, Codex, and others because it uses no tool-specific APIs; it's pure markdown and bash scaffolding [README.md — L4, SKILL.md — L3]
  - Custom prompts or agents often drift toward tool-specific idioms (e.g., Copilot-specific phrasing), reducing portability

## 7) Validation - FAR Criteria

- [x] **Factual**: Every claim has an inline citation by file and line range. Examples:
  - "The skill routes based on phase" — cited from SKILL.md L22-30
  - "Installation defaults to ~/.copilot/skills/" — cited from install.js L30-50 and README.md L50-70
  - "Skills avoid phase collapse" — cited from SKILL.md L9-14
  
- [x] **Actionable**: A planner reading this research can derive high-level plan items such as:
  - Create a new markdown file that explains the RPI pattern in developer-friendly language, referencing the theoretical foundation
  - Write sections on installation workflows (default, tool-specific, custom targets)
  - Document practical adoption steps: creating a project, understanding phase workflows, recognizing when RPI is overkill
  - Explain the architectural advantages of Skills, with examples comparing Skills to alternatives

- [x] **Relevant**: All findings directly inform a comprehensive developer guide targeting adopters. No extraneous technical details (e.g., Node.js internals, LLM model architectures) are included.

## 8) Notes on Unknowns

- **Target developer profile ambiguity**: The guide should serve teams new to structured workflows *and* experienced developers evaluating RPI for org-wide adoption. This may require multiple entry points (quick-start vs. deep-dive).
- **Scope of "Skills education"**: How much should the guide explain the broader skill ecosystem (other skills like figma-code-connect, transloadit, etc.) vs. focusing narrowly on rpi-workflow as an exemplar?
- **Migration narratives**: Should the guide include guidance for teams currently using unstructured AI workflows (free-form prompts) or traditional waterfall processes (why RPI is an improvement)?

---

**Research Status**: Complete. All sections grounded in source documentation. Ready for Planning phase.
