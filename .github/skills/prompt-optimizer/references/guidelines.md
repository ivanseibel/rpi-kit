# Prompt Optimizer — Guidelines

Purpose
- Reduce token usage while preserving the task intent, required constraints, and output format.

Priority order
1. Preserve semantic intent and any constraints that affect correctness (formats, negatives, length limits, required fields).
2. Preserve explicit output formats (JSON, CSV, YAML, code blocks) and tokens that trigger a specific behavior.
3. Preserve critical examples when they change the required output; otherwise remove or summarize them.
4. Remove politeness, verbosity, rhetorical flourishes, and redundant qualifiers.
5. Prefer concise synonyms and imperative phrasing.

Compression techniques
- Convert sentences to imperative instructions: "Please write a short summary" → "Write a short summary".
- Replace long phrases with short equivalents: "in order to" → "to"; "make sure that" → "ensure".
- Compress enumerations: "List A, B, C, and D" → "List A, B, C, D" or "List A–D" when context allows.
- Turn examples into constraints only when needed: "for example: X" → remove unless X is required.

Translation
- When input language ≠ English, translate to English first, then compress.
- Maintain nuance for negative constraints and modality (must, should, avoid).

Ambiguities
- If the input lacks critical information that affects output (e.g., unspecified product, missing data), the optimizer should include a concise clarification request only when necessary. Otherwise, include a sensible default only if safe.

Output rules (enforced)
- The final output returned by the skill MUST contain only the optimized prompt in English.
- No explanation, no meta-comments, no markup wrappers.

Edge cases
- Large multimodal prompts: preserve modality hints (e.g., "include image alt text: ...").
- System messages: merge system role into concise instruction when possible: "You are an expert X" → "As an expert X: ...".

Evaluation suggestions
- Token reduction percentage = (1 - optimized_tokens/original_tokens) * 100.
- Spot-check semantic similarity to ensure meaning preserved.
