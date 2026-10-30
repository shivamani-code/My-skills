---
name: stepwise-reasoning
description: "Structured multi-step reasoning with titled steps, confidence, reflect/backtrack and a verified final answer (LLM-Reasoner method). Use for tricky logic, math, debugging hypotheses, design decisions."
---
# Stepwise reasoning

Source: harishsg993010/LLM-Reasoner (its system prompt and step loop). Condensed for use inside a coding agent.

Small models fail by jumping to an answer. Force a short chain of explicit steps instead.

## The loop
Write each step as:
```
Step N: <title>
<the work: facts, calculation, code reading, what this shows>
Confidence: 0.0-1.0
Next: continue | reflect | final_answer
```
Rules:
1. At least 3 steps before a final answer (5 for hard problems).
2. Confidence guides direction:
   - 0.8+: keep going on this approach.
   - 0.5-0.7: adjust (check an assumption, read one more file, run one command).
   - below 0.5: backtrack and try a different approach.
3. "reflect" step: re-read the original question, list what you assumed, find the weakest step and test it.
4. For maths or numbers, show every calculation; never do arithmetic "in your head".
5. Consider at least 2-3 different ways to reach the answer (LLM-Reasoner says 5 for hard ones) and check they agree.
6. Facts you can check with a tool (run code, grep, read docs) are checked, not reasoned about.

## Final answer
- One-line answer first, then the 1-3 steps that matter most as justification.
- If confidence is still below 0.7, say so and say what would settle it.

## In coding work
- Debugging: each step = one hypothesis + one cheap test (a print, a failing test, a grep). Record result, update confidence.
- Design: each step = one option with its main cost; final step picks one and says why.
- Keep the chain in your reply short; the point is discipline, not length.
