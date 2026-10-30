---
name: ux-flow-and-ia
description: "UX before visuals: define the user and job, map the flow and information architecture, wireframe in code (grey boxes at 412px), and run a heuristics checklist. Use at the start of any site/app and when a page is pretty but confusing."
---
# UX flow and IA

An insane-looking page that nobody understands fails. Decide what the visitor needs, in what order, then make it beautiful.

## File
- `wireframe.html`: grey-box template, one section per screen, each tagged with its job (Hook / Proof / Detail / Action).

## Steps
1. Who + job: "A ___ on their phone wants to ___ so they can ___." One sentence. One primary action.
2. Flow: write the path as arrows: `Instagram link -> hero (what is this?) -> proof -> detail -> contact`. Every step answers the question the visitor has at that moment.
3. IA: list all content, then group (card sort in your head: what belongs together?), then cut 30%. Max 5 nav items; on a story page, often zero nav plus a menu button.
4. Wireframe in code: copy `wireframe.html`, replace boxes with real words (real copy, not lorem), open at 412 px. If the grey version is clear, the styled one will be.
5. Map scroll beats to screens (`cinematic-direction` shot list), then style.
6. Run the heuristics below; fix, then hand to visual design.

## Heuristics checklist (Nielsen, adapted for cinematic sites)
- [ ] Within 3 s a stranger can say what this is and who it's for.
- [ ] The primary action is visible on the first and last screen.
- [ ] Visitors know where they are: progress indicator or chapter label on long scroll stories.
- [ ] Control: skip intro, mute sound, a way to jump to contact/menu at any time.
- [ ] Consistency: same action looks and behaves the same everywhere.
- [ ] Errors prevented: forms validate inline, phone keyboard types (`inputmode`, `autocomplete`).
- [ ] Recognition over recall: labels on icons; no mystery-meat navigation.
- [ ] Minimal: every element earns its place (`ui-design-system` no-clutter rules).
- [ ] Accessible: real text in the DOM, alt text, focus order, contrast, reduced motion.
- [ ] Fast: content readable before the effects finish loading.

## Patterns that work for story sites
- Hook -> Proof -> Detail -> Action (4 screens) for portfolios and launches.
- Sticky mini CTA after the hero (small pill bottom-right), full CTA at the end.
- Chapter dots or a thin progress bar so long scroll doesn't feel endless.

## Pitfalls
- Designing the effect first and fitting content into it.
- Hiding navigation for "immersion" with no way out.
- Long intro loaders: show the poster immediately, load behind it.
- Contact as a form with 7 fields; an email link + WhatsApp link converts better for small studios.
