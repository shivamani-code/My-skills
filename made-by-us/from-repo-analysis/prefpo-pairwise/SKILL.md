---
name: prefpo-pairwise
description: "PrefPO preference-based prompt optimization: compare two prompts' outputs with an LLM judge, rewrite the loser with the judge's feedback, keep the best. Use when you have no labelled data, only criteria for good output."
---
# PrefPO: pairwise preference prompt optimization

Source: DistylAI/prefpo (implements PRPO). Not installed (needs a strong judge model with structured JSON output); the loop below works by hand or in a short script.

## When
You can say what good output looks like (criteria) but have no labelled answers. Works with 0-50 samples.

## Loop
1. Pool: start with 2+ candidate prompts (e.g. a plain one and a "think step by step" one).
2. Sample two prompts from the pool.
3. Generate outputs from both with the task model (same inputs).
4. Discriminate: a judge (ideally a stronger model) sees both outputs plus the criteria, picks the better one, and explains why in concrete terms.
5. Optimize: a second call rewrites the LOSING prompt using that feedback.
6. Grade the new prompt (your check: test cases, rule checks, or a strict judge) and add it to the pool.
7. Repeat for N iterations; return the highest-graded prompt.

Two modes:
- Instruction mode: one shared prompt applied to many questions; grade on a validation set.
- Standalone mode: the prompt is the task ("write a 300-word summary of..."); grade the single output.

## Judge prompt shape
"Here are two responses to the same task. Criteria: [list]. Which response better meets the criteria, A or B? Explain the specific differences, then give your choice." Randomise A/B order to avoid position bias.

## Tips
- Criteria are plain text: start optimizing in minutes.
- Watch for prompt hacking: the optimizer may just stuff criteria words into the prompt. Grade on real outputs, not on the prompt text.
- Run the generations concurrently; it's the slow part.
