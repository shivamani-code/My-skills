---
name: ui-design-system
description: "Visual design system and craft for premium, uncluttered cinematic sites: tokens (palette 60/25/10/5, fluid type, 4px spacing, motion), premium font pairings, 4/12-col grids, hierarchy and composition for mobile hero screens, and Mani's 'no clutter' rules. Use at the start of any UI and when a page looks 'busy' or 'generic'."
---
# UI design system + visual craft

Premium = fewer things, bigger, with more space, in fewer colors. The effects only look expensive on top of a calm system.

## File
- `tokens.css`: palette, fluid type scale, spacing, grid, motion easings, button. Change the 4 palette values per project; leave the rest.

## Premium type pairings (all free: Google Fonts / Fontshare)
| Mood | Display | Text |
|---|---|---|
| Cinematic / epic | Clash Display 700 | Inter |
| Luxury / fashion | Playfair Display / Cormorant 500 | Manrope |
| Tech / sci-fi | Space Grotesk 700 | IBM Plex Sans |
| Brutal / loud | Archivo Black / Anton | Inter |
| Editorial calm | Fraunces 600 | Instrument Sans |
Self-host as WOFF2, subset to Latin (and Telugu/Devanagari if needed), max 3 files.

## Composition (mobile hero, 412x915)
- One focal point. The eye path: image -> 1-4 word headline -> one CTA. Nothing else above the fold.
- Headline at 18-22vw; body never under 16px; tap targets >= 48px.
- Thirds: subject on a third, type in the negative space; keep 24px+ edges and the bottom 80px clear of Android nav gestures.
- Contrast: text vs background >= 4.5:1 (body), >= 3:1 (display). Over footage add a 20-40% gradient scrim behind the text, not a box.
- Hierarchy by size and weight first, color last. Max 3 type sizes per screen.
- Spacing only from the scale (4/8/12/16/24/32/48/72/112). Related things close, groups far.

## Color
- Dark base, warm off-white text, ONE accent. Accent appears only on the CTA, active state and one FX.
- Pull palette from the hero image so UI and film feel like one world.
- Gradients: subtle, same hue family; never rainbow.

## Mani's 'no clutter' rules
1. If an element doesn't help the story or the action, delete it.
2. No stock icon rows, no 'feature card' grids of 6, no badges, no carousels of logos.
3. One CTA per screen. One message per screen.
4. No lorem ipsum or placeholder names: real words or nothing.
5. Unique > template: if it looks like a theme, change the concept, not the colors.
6. Clear beats clever: a visitor must know what this is within 3 seconds.

## Pitfalls
- Pure #000/#fff: harsh and cheap-looking; use near-black + warm white.
- Too many weights/sizes: looks amateur. Two families, 2-3 weights.
- Centered everything: fine for 1-word beats, tiring for paragraphs (left-align body).
- Tiny grey text for 'elegance' that nobody can read on a phone in sunlight.
