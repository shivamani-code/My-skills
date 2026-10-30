---
name: micro-interactions
description: "Premium micro-interactions: magnetic buttons, touch press ripples with haptics, custom cursors, hover image previews, and page transitions with the View Transitions API (same-document and cross-document). Use for CTAs, nav, project lists, and route changes."
---
# Micro-interactions

The small things you feel. Desktop gets magnetism and cursors; phones get press feedback and haptics (most of Mani's audience is on Android, so touch is not an afterthought).

## Files
- `micro.js`: `magnetic(el)`, `pressable(el)`, `cursor()`, `transition(fn)`.
- `transitions.css`: cross-document View Transitions + shared-element morph.

## Recipes
1. Magnetic CTA: `<a class="cta"><span>Start a project</span></a>` then `magnetic(cta); pressable(cta);`.
2. Custom cursor: call `cursor()` once; mark special targets `data-cursor`. It auto-disables on touch and reduced motion.
3. Hover preview (project list): one fixed `<img>` that follows the pointer with lerp; swap `src` on `mouseenter` of each row; scale from 0.8 to 1 + clip-path reveal. On touch, show thumbnails inline instead.
4. Same-page transition (SPA / tabs / filters):
   ```js
   transition(() => { list.innerHTML = renderFiltered(); });
   ```
5. Page-to-page (multi-page site): include `transitions.css` on both pages. For a card-to-hero morph, set `view-transition-name: hero` on the clicked card image before navigating and on the hero image of the next page.
6. Buttons: state change in under 100 ms, motion 200-400 ms, ease `cubic-bezier(.16,1,.3,1)` (expo-out).

## Rules
- One signature interaction per page (the magnetic CTA, or the cursor, or the preview), not all at once.
- Every hover effect needs a touch equivalent or must be purely decorative.
- Hit areas at least 44x44 px; the magnetic pull must never move the button out from under a finger.
- Focus styles stay visible (`:focus-visible` ring in the accent color).

## Budget (mid-range Android)
- Pointer listeners `passive: true`; rAF only while something is settling (`magnetic` stops its loop at rest).
- No `mix-blend-mode` cursor on mobile (it is skipped automatically).
- View transitions snapshot the page: keep blur radius small, duration < 700 ms.

## Pitfalls
- `navigator.vibrate` exists on Android Chrome only; iOS ignores it (fine, it's a bonus).
- `startViewTransition` callbacks must update the DOM synchronously or return a promise.
- Two elements with the same `view-transition-name` on one page abort the transition.
- Custom cursors that hide the real cursor (`cursor:none`) hurt usability: keep the native one or hide it only over the hero.
