---
name: cl-lessons
description: "cl-agent continual-learning loop for coding agents: record each task episode, replay relevant past failures before new work, distill durable lessons into a project file, and check they help. Use at the start and end of coding tasks in a repo you work in repeatedly."
---
# Lessons loop (cl-agent)

Source: dattgoswami/cl-agent ("a thin substrate of episode recording, replay, rule-based skill distillation and context injection can improve coding-agent performance across repeated tasks without fine-tuning"). Its Python layer is not installed; this is the loop as plain files.

## Files (in the project root)
- `.agents/episodes.md`: one short entry per task.
- `AGENTS.md` (section "Lessons"): distilled, durable rules. This agent loads AGENTS.md every session, so lessons placed there are read automatically.

## 1. Before a task: replay
Read the Lessons section and search episodes.md for the files/area you'll touch. Note any past failure that applies, in one line, before you start.

## 2. After a task: capture
Append an episode:
```
## <date> <task in 6 words>
Result: pass | fail | partial
Files: ...
What broke / what fixed it: ...
Evidence: test command + result
```
Record failures too; they are the most valuable.

## 3. Distill (every few episodes)
Turn repeated patterns into a rule only when seen at least twice or the cause is certain:
"- Run `npm run build` before tests; tests read dist/." Keep rules inspectable and short; date them.

## 4. Gate
A lesson stays only if it helps: if a rule was followed and the task still failed for that reason, fix or delete the rule. Remove rules that no longer match the code. Lessons are reversible; that's the point.

Keep the loop cheap: 3-5 lines per episode, at most ~20 rules.
