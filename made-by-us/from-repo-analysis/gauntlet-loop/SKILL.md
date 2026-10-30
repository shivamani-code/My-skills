---
name: gauntlet-loop
description: "Critique-and-improve loop against a real, fetchable quality bar (Matt Shumer's gauntlet loop). Use when output must be excellent, not just working: UI, landing pages, writing, CLI tools, docs."
---
# Gauntlet loop

Source: robonuggets/gauntlet-loop (CC BY 4.0), technique by Matt Shumer. Condensed.

Work stops at "good enough" when nothing holds it to a standard. Fix that with a real bar and a harsh, separate critic.

## 1. Pick the bar (before any work)
Offer the user 2-3 bars, let them pick (or pick the hardest reachable one yourself if they said "just do it"). A bar must be:
- Named: a specific thing, not a category ("Stripe's pricing page", not "a modern pricing page").
- Fetchable: you can open, screenshot, read or run it. If you cannot get it, the comparison is invented. Reject it.
- Comparable: ours and the bar can sit side by side and a judge can pick one.

| Goal | Good bar |
|---|---|
| UI / page | a named live page, screenshotted desktop + mobile |
| Writing | a named author's published piece, same length |
| Code / tool | a named repo's implementation plus its tests or benchmark |
| Analysis | a named report or paper's methods section |

If there is a measurable half (load time, tests passing, bundle size, word count) name it too. Taste plus a number beats taste alone.

## 2. Split into small pieces
Each piece can be improved and judged alone (hero, nav, typography, mobile; or parser, CLI flags, error messages).

## 3. Loop each piece
1. Builder: make or improve the piece.
2. Critic, with fresh context (a separate subagent if you can spawn one; otherwise re-open the actual output as if you had never seen it): put ours next to the bar with labels stripped, answer only "A or B is better", and name the single biggest remaining gap.
3. Back to the builder with that one gap.
Repeat until the critic picks ours blind, or the user stops it. Never stop after a fixed number of rounds.

## Rules that make it work
- The critic opens the real output (run it, screenshot it), never a description of it.
- Binary verdicts only. Scores out of 10 drift upward every round.
- Harsh critic. Praise is useless; "if ours does not win, keep going."
- The builder never judges its own work.
- Don't over-specify architecture up front; let each round decide.

## Writing a paste-ready gauntlet prompt (when asked)
~150 words, plain sentences, no bullets:
"Build [GOAL]. The bar is [BAR]. Get the real thing first and compare against it directly. Break this into the smallest pieces that can be judged alone. For each piece, run a builder and a separate critic with fresh context. The critic inspects the actual output, puts it next to the bar blind, says which is better, and names the single biggest gap. The critic is harsh; praise is not useful. Keep looping until the critic picks ours. Run builders and critics as parallel subagents."
