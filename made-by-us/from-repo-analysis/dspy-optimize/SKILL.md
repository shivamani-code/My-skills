---
name: dspy-optimize
description: "Prompt and pipeline optimization with DSPy: signatures, modules, metrics, and optimizers (BootstrapFewShot, MIPROv2, GEPA). Use when a prompt must be tuned against examples, or to build an LLM pipeline in Python."
---
# DSPy: program LLMs instead of hand-tuning prompts

Source: stanfordnlp/dspy. Installed locally in a venv: `~/Apps/venvs/dspy/bin/python` (installed with `uv pip install dspy`).

## Core idea
Describe WHAT you want (a signature), compose modules, define a metric, and let an optimizer find instructions and few-shot examples that score best on your data.

## Minimal recipe
```python
import dspy
lm = dspy.LM("openai/gpt-4o-mini")        # any litellm model id; needs that provider's key in env
dspy.configure(lm=lm)

class Classify(dspy.Signature):
    '''Classify a support ticket's priority.'''
    ticket: str = dspy.InputField()
    priority: str = dspy.OutputField(desc="one of: low, medium, high")

prog = dspy.ChainOfThought(Classify)    # or dspy.Predict, dspy.ReAct(sig, tools=[...])

trainset = [dspy.Example(ticket="site down", priority="high").with_inputs("ticket"), ...]
def metric(ex, pred, trace=None): return ex.priority == pred.priority.strip().lower()

opt = dspy.MIPROv2(metric=metric, auto="light")   # or dspy.BootstrapFewShot(metric=metric)
best = opt.compile(prog, trainset=trainset)
best.save("classify.json")
```

## Choosing an optimizer
- ~10 examples: `BootstrapFewShot` (adds good demos).
- 50+ examples: `MIPROv2` (tunes instructions + demos).
- Need feedback-driven rewrites: `GEPA` (reflective, evolutionary; metric can return text feedback). Use a stronger model as the reflection LM.

## Rules
- Hold out a test split; report test score, not train score.
- Metric first. If you can't write a metric, you can't optimize; write a small LLM-judge metric with a strict yes/no.
- Exact-match or "contains" metrics are less noisy than judges.
- You can use DSPy only to discover a better prompt, then paste the optimized instruction into plain code (inspect with `best.predictors()[0].signature.instructions`).
