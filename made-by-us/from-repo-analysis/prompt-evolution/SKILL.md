---
name: prompt-evolution
description: "PromptBreeder-style evolutionary prompt optimization: population of prompts, mutation prompts, thinking styles, fitness on examples. Use to improve a task prompt when you have a few test cases and can run many model calls."
---
# Prompt evolution (PromptBreeder)

Source: DeepMind PromptBreeder paper (arXiv 2309.16797); implementation reviewed: vaughanlove/PromptBreeder (the most-starred repo on the promptbreeder topic; Cohere-only, so not installed). This is the method, runnable by hand or with a short script.

## Pieces
- Task prompt: the instruction being optimized.
- Thinking style: a reasoning hint, e.g. "Let's break this into smaller parts", "What are the key assumptions?", "How could I measure progress?", "Make a list of ideas and try each".
- Mutation prompt: an instruction that rewrites a task prompt, e.g. "Rephrase the instruction without using any of the same words, so the reader is more likely to do well", "Elaborate on the instruction with detailed advice on how to do it", "What would you tell yourself to be the best in the world at this?".
- Fitness: share of held-out examples the prompt gets right.

## Loop
1. Init: population of ~10-20 units = (mutation prompt x thinking style), each generating a first task prompt from the problem description.
2. Score each unit's task prompt on ~10-20 examples.
3. Binary tournament: pick 2 units at random; the loser is replaced by a mutated copy of the winner.
4. Mutation operators (pick one at random):
   - zero-order: write a fresh prompt from the problem description + thinking style.
   - first-order: apply the mutation prompt to the winner's task prompt.
   - lineage: show the history of best prompts, ask for the next one.
   - hypermutation: first mutate the mutation prompt itself, then apply it.
   - working-out: use a correct worked answer as the new few-shot context.
5. Repeat for N generations; return the top prompt and re-test it on unseen examples.

## Practical notes
- Cost: population x examples calls per generation (20 x 20 = 400). Start tiny: population 6, 8 examples, 5 generations.
- Keep a diverse population; if all prompts converge, add zero-order units.
- Watch for overfitting to the fitness set; always keep a final test set.
- For most real tasks, prefpo-pairwise or dspy-optimize is cheaper; use evolution when you want variety and have budget.
