---
name: openhands-workflow
description: "OpenHands problem-solving workflow for autonomous coding: explore, analyse, test-first, minimal implementation, verify; plus troubleshooting when stuck. Use for bug fixes and features done end to end."
---
# OpenHands workflow

Source: All-Hands-AI/OpenHands (the agent's system prompt now lives in OpenHands/software-agent-sdk, sections PROBLEM_SOLVING_WORKFLOW and TROUBLESHOOTING). The Docker runtime is not installed; this is the workflow only.

## Workflow
1. EXPLORATION: find and read the relevant files before proposing anything.
2. ANALYSIS: consider more than one approach; pick the most promising and say why in one line.
3. TESTING:
   - Bug fix: write a test or script that reproduces the bug BEFORE fixing it.
   - Feature: consider writing the test first.
   - No tests for docs/config-only changes.
   - Test real code paths; avoid mocks unless strictly needed.
   - If there's no test setup and building one is big, ask the user first.
4. IMPLEMENTATION: focused, minimal changes. Edit existing files in place; never create `file_v2.py` copies. Delete temporary files when done.
5. VERIFICATION: run the tests, including edge cases. If tests can't run, say so.

## Troubleshooting (when repeated attempts fail)
1. Stop. List 5-7 different possible sources of the problem.
2. Rate how likely each is.
3. Check the most likely first, one at a time, with a cheap test.
4. Explain your reasoning to the user.
If a major obstacle blocks the user's plan, propose a new plan and confirm before working around it.

## Efficiency habits
- Combine related shell commands; use grep/find with filters instead of reading everything.
- Don't run long or interactive commands without a timeout or background flag.
