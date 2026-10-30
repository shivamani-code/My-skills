---
name: aider-edit-loop
description: "Aider's edit discipline: SEARCH/REPLACE edits, small repo map, lint-and-test after every change, one git commit per change. Use for any multi-file code change."
---
# Aider edit loop

Source: Aider-AI/aider. Aider itself is installed locally: `~/Apps/venvs/aider/bin/aider` (installed with `uv pip install aider-chat`; needs a model API key to run). This skill is its workflow, for use with your own tools.

## Loop for every change
1. Map: list the files involved and only the signatures you need (Aider's "repo map"); don't load whole large files into context.
2. Ask before editing files you haven't looked at; read them first.
3. Plan in 2-4 short sentences.
4. Edit with exact SEARCH/REPLACE semantics:
   - SEARCH text must match the file exactly (copy it, including whitespace), and be unique; include a few surrounding lines.
   - Keep each block small; several small blocks beat one big one.
   - To move code: one block deletes, another inserts.
   - New file: empty SEARCH, full content in REPLACE.
5. Lint immediately (the project's linter, or at least `python -m py_compile`, `tsc --noEmit`, `node --check`). Fix errors before moving on.
6. Test: run the project's test command; if it fails, read the output and fix (max ~3 rounds, then step back).
7. Commit: one focused commit per logical change with a clear message (`git add -A && git commit -m "..."`) if the user wants commits. Easy to undo with `git revert`/`git reset`.

## Rules
- Respect existing conventions and libraries.
- If the request is ambiguous, ask.
- Never return code outside an edit; never paste whole files to change one line.
- Use "architect then editor" for hard changes: first describe the solution, then do the edits mechanically.

## Running real aider (optional)
`~/Apps/venvs/aider/bin/aider --model <model> --auto-test --test-cmd "pytest -q" --lint-cmd "ruff check" file1.py file2.py`
