Based on the RPI operational doctrine and the VS Code Custom Agent specifications Source: 3, 6, 8, here is the technical definition file for the Plan Phase.

# RPI Phase II: Plan (Decision Theory)

**Version:** 2.0**Enforcement:** Strict (Pre-Implementation)**Input Dependency:** research.md (Validated)**Agent Configuration:** Strategy Mode / Read-Only Tools

## 1\. Phase Objective

The objective of the Plan phase is **Decision Theory**—the transformation of validated *Knowledge* (from Research) into deterministic *Intent*.  
This phase deconstructs the problem into atomic units of work so that execution (Implementation) becomes a purely mechanical act of compliance, requiring no further strategic decision-making.

## 2\. Operational Constraints

These constraints are enforced via the .agent.md configuration for the Planning Agent Source: 3, 6\.  
Constraint,Definition,Technical Enforcement  
No Production Code,The Planner must not write application code. It only writes instructions for code.,"Agent tools list limited to \['search', 'fetch'\] (read-only) Source: 3."  
Input Strictness,Planning cannot begin without a valid research.md.,"System prompt: ""Refuse to plan until research.md is ingested and validated."""  
Atomic Output,"The output must be a checklist where every item is a single, verifiable action.",Custom Instructions requiring a checkbox format \[ \] for all tasks.
Single-Artifact Output,"The only file the Planner may write is plan.md. No supplemental markdowns, drafts, implementation previews, or extra checklists. Writing any additional file is a critical phase violation.","Governance: stop immediately and notify the operator if any other file is produced."
## 3\. The Plan Artifact (plan.md)

The output of this phase is a single markdown file named plan.md. This file serves as the **executable directive** for the Implementation phase.

### Artifact Schema

The plan.md file must follow the canonical template at
`.github/skills/rpi-workflow/resources/plan-template.md`.

Required section headings (exact):

\# Plan: \[Ticket/Issue ID\]
\#\# 1\) Strategy and Scope
\#\# 2\) Architectural Decomposition
\#\# 3\) Atomic Task List
\#\# 4\) Verification Plan
\#\# 5\) Validation - FACTS Criteria

Required Strategy and Scope fields:

- Approach
- Trade-offs
- Safe State
- In Scope
- Out of Scope

Each atomic task must include Action and Verification with explicit Pass/Fail criteria.

## 4\. Validation Protocol (The FACTS Gate)

Transition to the **Implement** phase is strictly forbidden until the plan.md artifact passes the **FACTS** criteria.

1. **F (Feasible):** Can this actually be built given the constraints in research.md?  
2. **A (Atomic):** Can a junior dev (or AI) complete one task without reading the others?  
3. **C (Clear):** Are there "TBDs" or "Figure it out later"? (If yes, Fail).  
4. **T (Testable):** Does every task have a specific verification step?  
5. **S (Scoped):** Does the plan explicitly state what it will *not* do?

## 5\. Handoff Trigger

Once the FACTS score is satisfying (Pass), the workflow triggers a **Handoff** Source: 1, 8 to the Implementation Agent.

* **Source Agent:** planning-agent  
* **Target Agent:** implementation-agent  
* **Prompt:** "Plan validated. Execute Task A.1. Remember to run tests after every step."
