---
name: promptcraft-gepa
description: "PromptCraft recipe: optimize a prompt for a small local model (Ollama) with DSPy GEPA, held-out scoring, few-shot selection and a bigger reflection model. Use to make a small model follow a classification/format prompt reliably."
---
# PromptCraft: optimizing prompts for small local models

Source: shirkattack/PromptCraft (FastAPI + DSPy + Ollama app). The app itself is not installed (needs Ollama and a web stack); its method is below and runs with the DSPy venv: `~/Apps/venvs/dspy/bin/python`.

## Its findings (llama3.2 3B, 18-sample ticket-priority set)
- A plain meta-prompt rewrite alone scored BELOW the original (39% vs 44%); rewrite + 4 chosen examples reached 50%.
- GEPA reached 67-89% on three seeds (from 28-50%), but on only 9 held-out samples: a demo, not a benchmark.
- The common small-model misses: the right label buried in an explanation, or the model asking a clarifying question instead of answering.

## Recipe
1. Build 20-40 input/output pairs (hand-write ~12, generate more, drop near-duplicates).
2. Candidates: original prompt, rewritten prompt, and each of those + 4-8 few-shot examples chosen to cover different inputs.
3. Score each on held-out samples (k-fold if data is small). Metric: `exact` or `contains` for short answers; LLM judge only for free text.
4. GEPA loop (dspy.GEPA): run the prompt on train samples; a feedback metric scores each answer AND writes why it missed ("right label present but buried in 38 words; respond with the label alone"); a bigger reflection model rewrites the instructions; keep a Pareto front.
5. Pick the winner on held-out score. Keep the original if nothing beats it.

## Small-model prompt rules it shows
- Ask for the bare label/format: "Respond with only one word: low, medium, or high."
- Forbid clarifying questions when the task is classification.
- Few-shot examples help small models more than longer instructions.
- Let a big model write instructions; let the small model only execute them.
