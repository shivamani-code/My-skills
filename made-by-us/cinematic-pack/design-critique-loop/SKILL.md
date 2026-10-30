---
name: design-critique-loop
description: "Judge a page with Mani's taste (unique, insane-looking, clear, no clutter) from real screenshots at phone and desktop sizes, against a named reference bar, score it on a 20-point sheet, fix the top 3, repeat until >= 17. Use before showing any visual work."
---
# Design critique loop

Never ship the first version. Look at it the way Mani will, on a phone, in 3 seconds, then fix what matters most.

## File
- `critique.md`: the 10-test, 20-point sheet.

## Steps
1. Capture: `mobile-perf-budget/check_mobile.py URL out/pass1` gives top/mid/end screenshots at 412x915 (Android UA); add one 1440x900 desktop shot.
2. Pick a bar: a named, fetchable page that is the best of its kind (e.g. a top Awwwards Site of the Day in the same genre). Screenshot it at the same sizes. Without a bar, a critique is just opinion.
3. Look at the screenshots, not the code (actually open the images). Fill `critique.md` with evidence for each score: "hero headline is 34px, gets lost", not "type could be better".
4. Be a harsh separate critic: assume it's someone else's work. Ask: "If this appeared in my feed, would I stop?" and "What would make Mani say 'robotic' or 'unclear'?"
5. Pick the top 3 fixes by visual gain per effort. Typical high-gain fixes: bigger type, remove 2 elements, stronger first frame, one accent color, better scroll pacing, real content.
6. Fix, re-capture, re-score. Stop at >= 17/20 with no zeros, or after 3 passes (then report the remaining gaps honestly).

## Mani's taste, decoded
- Unique: original concept and world; not a theme, not a copy of the reference.
- Insane-looking: a cinematic first frame, depth, light, motion that feels expensive.
- Clear: no guessing what it is or what to do; human words, not robotic text.
- No clutter: few elements, big, lots of space, one message per screen.

## Pitfalls
- Judging from memory or from code ("the CSS says 64px") instead of the rendered pixels.
- Critiquing only desktop. Mani's phone is Android: mobile first.
- Fixing 15 small things instead of the 3 big ones.
- Endless polishing: cap at 3 passes, then ship with an honest note.
- Self-flattery: every score needs a visible piece of evidence.
