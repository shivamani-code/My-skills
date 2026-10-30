---
name: swe-agent-fix
description: "SWE-agent recipe for resolving a GitHub issue: locate, reproduce, fix minimally, re-run, check edge cases, review the diff before submitting. Use when fixing a reported bug or issue in a repo."
---
# SWE-agent issue fix

Source: SWE-agent/SWE-agent (config/default.yaml instance template and review_on_submit tool). Not installed (needs Docker); the recipe is below.

## Steps
1. Read the issue; restate the expected vs actual behaviour in one line.
2. Locate: search the repo (grep for error text, function names; list the file map) and read the relevant code.
3. Reproduce: write a small script (e.g. `reproduce.py`) that shows the bug; run it and confirm it fails the way the issue says.
4. Fix: the MINIMAL change to non-test source files. Don't modify existing tests unless asked.
5. Re-run the reproduction script; confirm it's fixed.
6. Edge cases: think of 2-3 (empty input, None, large values, other platforms) and check them.
7. Review before submitting (SWE-agent forces this step):
   - If you changed code after the last repro run, run it again.
   - Delete the reproduction script.
   - Revert any test files you modified: `git checkout -- path/to/test`.
   - Read the full `git diff`; every hunk must be needed for the fix.
8. Run the project's existing tests for the touched area.

## Agent-computer interface lessons
- View files in windows (~100 lines) around the target, not whole files.
- After each edit, check the file still lints/compiles; reject edits that break syntax.
- Search results should be concise: file names with match counts first, then drill in.
