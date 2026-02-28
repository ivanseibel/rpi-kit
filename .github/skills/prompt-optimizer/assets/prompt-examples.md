# Prompt Optimizer — Examples

Example 1 — Portuguese instruction (long)
Input:
"Escreva um e-mail formal de acompanhamento para um cliente que não respondeu à proposta enviada há duas semanas. Inclua um tom cordial, destaque os principais benefícios do serviço e peça um retorno indicando disponibilidade para uma reunião. Limite a mensagem a 150-200 palavras."

Optimized (English):
Follow-up email to client who hasn't replied to proposal sent two weeks ago: cordial tone; highlight key benefits; ask for availability for a meeting; 150–200 words.

Example 2 — Spanish, with constraints
Input:
"Necesito un resumen ejecutivo de este informe en 5 viñetas, cada una con máximo 20 palabras. No incluyas juicios de valor."

Optimized (English):
Executive summary in 5 bullet points, each ≤20 words; no value judgments.

Example 3 — French, system + user mix
Input:
System: "You are an expert nutritionist."
User: "Préparez un plan de repas hebdomadaire végétarien pour un adulto activo, 2000 kcal/día, avec snacks."

Optimized (English):
As an expert nutritionist: provide a 7-day vegetarian meal plan for an active adult, 2000 kcal/day, include snacks.

Example 4 — Long English instruction with examples
Input:
"Rewrite the following customer review to remove identifying details and make it professional. Example: 'I spoke to John from Acme...' → remove names."

Optimized (English):
Anonymize and professionalize the customer review; remove names and identifying details.

Example 5 — Preserve format tokens
Input:
"Output MUST be valid JSON with keys: title, summary, tags (array). Keep code block formatting." 

Optimized (English):
Return valid JSON: {"title":..., "summary":..., "tags":[...]}. Preserve code block formatting.

Example 6 — Ambiguous request (ask for clarification fallback)
Input:
"Create marketing copy for our product." (no product details)

Optimized (English):
Create concise marketing copy for [PRODUCT]; include value proposition, target audience, and 3 short taglines. If PRODUCT unknown, ask for product name and key features.
