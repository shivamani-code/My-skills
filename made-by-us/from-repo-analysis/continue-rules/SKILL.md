---
name: continue-rules
description: "Continue-style project rules: short, scoped instruction files (AGENTS.md / rules with globs) and plan-before-act mode. Use to set up or update a project's instructions so the agent stops repeating mistakes."
---
# Project rules (Continue)

Source: continuedev/continue (docs: customize/deep-dives/rules). Continue's IDE extension is not installed; this is its rules method, adapted to this agent.

## Where rules live here
This agent loads `AGENTS.md` or `CLAUDE.md` from the project as project instructions every session, and `knowledge.md` as a knowledge file. Continue keeps rules in `.continue/rules/*.md`; the same content works in AGENTS.md.

## Writing a rule
- One topic per rule, a few bullet lines, concrete and checkable:
  "- Use pnpm, never npm." "- API handlers live in src/api/<name>.ts and return Result<T>."
- Scope it: say which files it applies to (Continue uses `globs: src/**/*.ts`; in AGENTS.md write a heading "For src/**/*.ts").
- Add a one-line description so it can be pulled in only when relevant.
- Rules are joined into the system message, so every line costs context on every request. Keep the total short; delete stale rules.

## When to add a rule
- The user corrects you twice on the same thing.
- A command or convention had to be discovered (test command, env vars, build quirks).
- After a fix, if the cause was a project-specific gotcha.
Ask: "Create a rule for this?" then write it.

## Plan mode before agent mode
For non-trivial work: first a read-only pass (read files, search, no edits) that ends in a short plan; then switch to editing. Continue enforces this with Plan mode (read-only tools) vs Agent mode.

## Minimal AGENTS.md template
```
# Project
What it is, where the key code lives (3 lines).
## Commands
install / dev / test / lint / build
## Rules
- ...
```
