# Plan - rpi-kit maintenance

## 1) Strategy and Scope

### Approach
Concentrate implementation work on repository surfaces where research identified path-language mismatch for Copilot/default context, while keeping installer behavior as the operational source of truth. The plan sequences work as: define authoritative path rules from existing behavior, update stale documentation/template references, document slug convention explicitly, then validate with dry-run and targeted text checks.

### Trade-offs
This approach touches multiple documentation and template files to improve consistency, which increases edit count but reduces ambiguity for operators and downstream generated artifacts. It avoids speculative installer logic changes unless verification shows behavior conflicts with documented source-of-truth mapping.

### Safe State
The repository is in a safe state when:
- Copilot/default path language is consistent with installer behavior across installer docs, governance docs, and workflow templates.
- Project-id naming language matches the date-prefixed slug behavior implemented by the scaffolder.
- `node install.js --dry-run` reports destinations that match published inventory and guidance.

### In Scope
- User-facing install-path references in docs and templates that research identified as mismatched.
- Inventory/install documentation alignment with current installer behavior.
- Explicit project-id slug convention documentation tied to scaffolder behavior.
- Manual verification using repository-documented installer checks.

### Out of Scope
- New runtime features outside workflow/tooling maintenance.
- New CI pipelines or test frameworks.
- Refactors unrelated to path-language alignment or slug-convention documentation.

## 2) Architectural Decomposition

- Source-of-truth behavior layer: installer path resolution and governance constraints used as authoritative references.
- Documentation and template layer: README, INVENTORY, skill guidance, and template artifacts consumed by operators.
- Scaffolding convention layer: project-id generation behavior from the scaffolding script and matching explanatory docs.
- Validation layer: dry-run and repository text-audit checks used to confirm consistency.

## 3) Atomic Task List

[x] Task 1 - Confirm authoritative destination mapping
- Source: research.md - Section 1 (Ambiguities & Open Questions), Section 5 (Existing Patterns and Exemplars)
- Action: Capture the authoritative install-path mapping from existing installer behavior and governance references for Copilot, Codex, Antigravity, and `--target` override semantics.
- Verify: Compare extracted mapping statements against current installer outputs/messages and governance wording.
- Pass: One unambiguous mapping is documented for use by all subsequent edits.
- Fail: Mapping contains conflicting destinations or unclear default semantics.

[x] Task 2 - Audit repository for stale Copilot/default path language
- Source: research.md - Section 1 (Ambiguities & Open Questions), Section 7 (Notes on Unknowns)
- Action: Search workflow/docs/template artifacts for Copilot/default references that conflict with the authoritative mapping, including the known template and inventory surfaces.
- Verify: Produce a complete file list of mismatched references discovered by text search.
- Pass: Audit list includes all conflicting references in in-scope artifacts.
- Fail: Known mismatches remain unlisted or audit evidence is incomplete.

[x] Task 3 - Align install-path wording in affected docs and templates
- Source: research.md - Section 1 (Ambiguities & Open Questions), Section 2 (Storybook/Docs), Section 3 (In Scope)
- Action: Update each audited in-scope file so Copilot/default language matches the authoritative mapping while preserving multi-agent destination clarity.
- Verify: Re-run text search for conflicting Copilot/default path phrases across edited artifacts.
- Pass: No conflicting Copilot/default wording remains in in-scope files.
- Fail: Any in-scope file still contains stale path language.

[x] Task 4 - Synchronize inventory statements with current install behavior
- Source: research.md - Section 1 (Ambiguities & Open Questions), Section 2 (Storybook/Docs)
- Action: Update inventory path statements that describe default/Copilot installation destinations so they match installer behavior and policy language.
- Verify: Cross-check inventory path statements against installer dry-run output and aligned docs.
- Pass: Inventory destination statements are consistent with installer behavior and related docs.
- Fail: Inventory text conflicts with dry-run output or other aligned docs.

[x] Task 5 - Resolve project-id convention ambiguity in docs
- Source: research.md - Section 1 (Ambiguities & Open Questions), Section 5 (Existing Patterns and Exemplars), Section 7 (Notes on Unknowns)
- Action: Document the date-prefixed slug convention in workflow-facing guidance so project-id naming matches scaffolder behavior.
- Verify: Compare published project-id description to scaffolder transformation behavior and examples.
- Pass: Documentation describes date-prefixed slugging consistently with script behavior.
- Fail: Project-id wording remains ambiguous or contradicts script behavior.

[x] Task 6 - Execute consistency validation checks
- Source: research.md - Section 2 (Tests), Section 6 (Validation - FAR Criteria)
- Action: Run repository verification checks focused on installation guidance consistency, including installer dry-run and mismatch text searches.
- Verify: Execute `node install.js --dry-run` and targeted searches for stale Copilot/default path phrases.
- Pass: Dry-run output and text search results show no contradictions in in-scope artifacts.
- Fail: Verification reveals destination or wording inconsistencies.

## 4) Verification Plan

- Automated (CI): No dedicated CI checks are documented for this maintenance area.
- Manual/Local: Run `node install.js --dry-run` and perform targeted repository text searches for stale Copilot/default path references; compare outputs with aligned docs/templates and inventory statements.

## 5) Validation - FACTS Criteria

- [x] Feasible: Tasks rely on existing repository files, installer commands, and text-audit methods identified in research.
- [x] Atomic: Each task contains one action and one verification path.
- [x] Clear: Tasks define explicit artifacts or checks without requiring implementer design invention.
- [x] Testable: Every task includes pass/fail outcomes observable through commands or file review.
- [x] Scoped: Tasks stay within path-language alignment and slug-convention documentation boundaries.

<!-- ⛔ END OF PLAN PHASE — Do NOT proceed to implementation. Do NOT edit source code. Return control to the operator. -->