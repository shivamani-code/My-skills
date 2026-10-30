---
name: cinematic-direction
description: "Direct a cinematic website like a short film before coding: concept, 3-act shot list mapped to scroll %, palette and type rules, sound cues, and a fill-in brief template with standing rules. Use at the start of any 'insane-looking' site, portfolio, launch or fan page."
---
# Cinematic direction

Most 'wow' sites are a good 6-second film plus discipline. Decide the film first; code is just playback.

## File
- `brief-template.md`: copy it into the project as `BRIEF.md` and fill every line before writing code.

## Steps
1. Feeling in one sentence ("weightless fall into fire", "quiet luxury, gold on black"). Every later choice is checked against it.
2. Pick the move: one continuous camera per clip (fall, dolly-in, orbit, crane up). Scrubbing makes the user the camera operator, so motion must make sense backwards too.
3. Shot list as scroll %: 4-6 beats. Mark THE CUT (one hard event around 45-60%: flash, impact, burn wipe). Peaks need valleys: calm beat before the cut.
4. Words: 1-4 per beat, written like film titles. Read them alone in order; they must tell the story without images.
5. Palette: max 4 colors, 60/25/10/5. The accent appears only on the CTA and one FX (embers, burn rim). Pull colors from the hero still with an eyedropper so type and film match.
6. Type: one heavy display face + one quiet text face (see `ui-design-system`).
7. Sound (optional, muted by default, user toggles): drone bed + one hit on THE CUT + whoosh on fast scroll.
8. Write the brief, then build in this order: poster frame -> scrub -> type -> FX -> interactions -> polish.

## Going beyond the reference (what made Gireesh's work strong, and how we beat it)
- He: AI film scrubbed by scroll, giant type, grain/embers, one palette. Keep all of that.
- We add: mobile-first framing (vertical 9:16 shots for phones, 16:9 for desktop, two tiers), 4x lighter frame budgets, gyro tilt on phones, original worlds instead of film IP, real content (not 'Arin Vale' placeholders), and an accessible static version.
- Original concept starters: 'a city drawn in light that rebuilds as you scroll', 'a single drop falling through five worlds', 'a monument that unfolds into the product'.

## Pitfalls
- Starting in code: you get a template with effects, not a film.
- Too many beats: 10 beats on a phone reads as noise. 5 is plenty.
- Cuts inside a scrubbed clip (jarring both directions).
- Text over busy footage: plan negative space in the shot prompt ('empty sky in the upper half for typography').
- IP (Marvel, HBO...) in client work: legal risk. Fan pieces only as clearly labelled concepts.

## Budget
A brief that fits on one screen. If it doesn't, the site won't either.
