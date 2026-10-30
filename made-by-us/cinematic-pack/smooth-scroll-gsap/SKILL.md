---
name: smooth-scroll-gsap
description: "Lenis smooth scroll + GSAP ScrollTrigger patterns: one shared clock, pinned scenes, scrubbed timelines, horizontal galleries, reveals, mobile URL-bar fixes. Use for any scroll-driven storytelling page."
---
# Smooth scroll + GSAP

Lenis makes wheel scroll feel weighty; ScrollTrigger maps scroll to time. Together they are the spine of every cinematic page.

## Files
- `scroll-setup.js`: `setupScroll()` (Lenis wired into the GSAP ticker), `scene(el, build)` (pinned scrubbed timeline), `reveals()`.

## Steps
1. Load GSAP + ScrollTrigger + Lenis (CDN or npm). GSAP is free for all use, plugins included (since 2025).
2. `const { lenis, velocity } = setupScroll();`
3. A pinned scene:
   ```js
   scene(document.querySelector('#rise'), tl => {
     tl.from('.rise .ch', { yPercent: 120, stagger: .05 })
       .to('.rise', { scale: 1.6, opacity: 0 }, '>.3');
   }, { length: '+=200%' });
   ```
4. Horizontal gallery: pin the section, tween the track `x: () => -(track.scrollWidth - innerWidth)`, `invalidateOnRefresh: true`.
5. Per-frame work (canvas, shaders) goes on `gsap.ticker.add(fn)`, never a second rAF loop.
6. Anchor links: `lenis.scrollTo('#contact', { duration: 1.4 })`. Scroll lock for menus/modals: `lenis.stop()` / `lenis.start()`.
7. After fonts/images change layout: `ScrollTrigger.refresh()` once (e.g. on `document.fonts.ready`).

## Choosing pin vs sticky
- CSS `position: sticky` in a tall section is cheapest and never jitters on Android: prefer it for frame-sequence stages.
- GSAP `pin` when you need spacing calculated for you or nested timelines.

## Budget (mid-range Android)
- Lenis `syncTouch: false` (default): phones keep native momentum. Smoothing touch feels laggy and costs frames.
- <= ~15 active ScrollTriggers per page, `scrub: 0.5-1` (number, not `true`) for a little inertia.
- Tween transforms/opacity only. No `filter: blur()` tweens on large elements.
- Kill triggers on route change: `ScrollTrigger.getAll().forEach(t => t.kill())`.

## Pitfalls
- Two clocks (Lenis's own rAF + GSAP ticker) cause stutter: use only the GSAP ticker and `lagSmoothing(0)`.
- Missing `ignoreMobileResize`: Android URL-bar collapse triggers refresh and jumps.
- `100vh` pinned sections overflow on Android: use `100svh`/`100dvh`.
- Pinning inside a transformed parent breaks (`pinReparent` or move the transform).
- `html { scroll-behavior: smooth }` fights Lenis: remove it.
- Markers left on (`markers: true`) in production.
- Reduced motion: no Lenis, no scrubbed parallax; keep instant reveals.
