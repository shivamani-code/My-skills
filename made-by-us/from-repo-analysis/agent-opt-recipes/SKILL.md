---
name: agent-opt-recipes
description: "Which prompt-optimization algorithm to use, from future-agi agent-opt: Random Search, Bayesian, ProTeGi textual gradients, Meta-Prompt, PromptWizard, GEPA. Use when planning a prompt-optimization run."
---
# agent-opt: choosing a prompt optimizer

Source: future-agi/agent-opt (six optimizers behind one API, LiteLLM models, any metric). Not installed by default; `pip install agent-opt` in a venv if you want to run it.

## Pick by problem shape
| Algorithm | Use when | How it works |
|---|---|---|
| Random Search | quick baseline | try N prompt variants, keep best |
| Bayesian (Optuna) | tuning few-shot count/selection | search over demo choices + params |
| ProTeGi | iterative refinement from failures | "textual gradients": list why each failure happened, edit the prompt to fix them, beam-search the edits |
| Meta-Prompt | a strong teacher model is available | teacher reads failures and rewrites the whole prompt |
| PromptWizard | multi-stage tasks | mutate -> critique -> refine, N rounds |
| GEPA | best quality, more budget | reflective evolution with a Pareto front |

## Do any of them by hand (ProTeGi in 5 steps)
1. Run the prompt on 10-20 examples; collect failures.
2. Ask: "Here is the prompt and these failures. Give 4 distinct reasons the prompt caused them." (the gradients)
3. For each reason, write an edited prompt that fixes it.
4. Score each edit on the examples; keep the top 2-4 (the beam).
5. Repeat 2-3 rounds; confirm the best on fresh examples.

## Always
- Fix the metric and dataset before optimizing.
- Keep a test split the optimizer never sees.
- Use a stronger model as teacher/critic than the model being optimized.
