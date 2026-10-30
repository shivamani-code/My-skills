---
name: prompt-patterns
description: "How to write strong system prompts and agent instructions, distilled from leaked production prompts (Claude Code, Cursor, Codex and others). Use when writing a system prompt, AGENTS.md, a skill, or instructions for a subagent."
---
# Prompt-writing patterns from production system prompts

Source: asgeirtj/system_prompts_leaks (1,400+ files). Distilled patterns only; the repo is not copied here. Read a specific file in that repo only if you need an exact example.

## Structure that recurs in the best prompts
1. Identity + scope in 1-2 lines ("You are X. You help with Y.").
2. Sections with plain headings or XML tags: <environment>, doing tasks, tools, safety, tone/output format.
3. Rules stated as behaviour with the reason: "Don't explain WHAT code does; identifiers already do that." The reason lets the model generalise.
4. Concrete examples of good AND bad output, especially for formats (Cursor shows exact code-citation formats, Aider shows full SEARCH/REPLACE examples).
5. Explicit stop conditions: when to ask, when to stop retrying ("after 2-3 failed attempts, stop and explain what you tried"), when the task is done.
6. Environment facts injected as data (OS, cwd, git status, date) rather than assumed.

## Rules that production coding agents all carry
- Read before editing; follow existing conventions and libraries.
- Minimal, focused changes; no unrequested refactors or backward-compat hacks.
- Verify: run tests or the app; if you cannot verify, say so instead of claiming success.
- Reversibility: local reversible actions are free; destructive or shared actions (rm -rf, force-push, dropping tables, sending messages) need confirmation.
- Fix root causes; never bypass checks (--no-verify) to make an error go away.
- Commits only when asked; never change git config; message via heredoc.
- Parallel tool calls when independent; sequential when dependent.
- Short answers; cite code as path:line.

## Writing tips
- Positive instructions ("respond with the label only") beat negatives ("don't be verbose").
- Put the most important rule first and repeat critical ones at the end.
- Specify output format exactly, with one filled example.
- Name the failure mode you're preventing ("small models bury the answer in explanation").
- Keep it short: every extra rule dilutes the others. Delete rules the model already follows.
- Test the prompt on 3-5 real inputs and fix the failures you see; don't tune by imagination (see dspy-optimize, prefpo-pairwise).
