---
name: kinetic-3d-type
description: "Kinetic 3D typography: words flying through depth with CSS perspective, split-letter reveals, scroll-velocity stretch, pointer/gyro tilt, and when to switch to WebGL text (troika). Use for hero titles, story lines over scroll films, big-type sections."
---
# Kinetic 3D type

Big type that moves in space is half of the 'insane' look. Do it with CSS 3D first (cheap, crisp, accessible), WebGL only when type must bend, melt or sit inside a 3D scene.

## Files
- `kinetic.js`: `splitLetters`, `depthField` (words down the Z axis, fly-through on progress), `velocityStretch`, `tiltToPointer` (pointer + phone gyro).
- `kinetic.css`: reveal mask, depth stage, reduced-motion fallback.

## Recipes
1. Split reveal: `splitLetters(h1)`; add `.in` with an IntersectionObserver or a ScrollTrigger `onEnter`. Keep the real text in `aria-label`.
2. Depth fly-through over a film:
   ```js
   const df = depthField(document.querySelector('.df-stage'), ['STILL','WATER','HOLDS','THE SUN']);
   ScrollTrigger.create({ trigger:'#film', start:'top top', end:'bottom bottom', onUpdate: s => df.update(s.progress) });
   ```
3. Velocity stretch: `const t = velocityStretch(title, () => lenis.velocity); gsap.ticker.add(t);`
4. Tilt: wrap the stage in a `transform-style:preserve-3d` element and tick `tiltToPointer(wrapper, 6)`. On iOS, gyro needs `DeviceOrientationEvent.requestPermission()` from a tap.
5. WebGL text (only if needed): `troika-three-text` renders SDF text inside Three.js scenes; use it when words must be lit, distorted by shaders or occluded by 3D objects.

## Type rules
- One display face, heavy (700-900), tight tracking (-0.03 to -0.05em), uppercase for 1-3 word beats. One quiet text face for the rest.
- Size with `clamp()` in vw so a 412 px phone gets 64-90 px display type.
- One idea per screen: 1-4 words per beat. Story lines max ~8 words.
- Self-host fonts as WOFF2 subsets, `font-display: swap`, preload only the display face.

## Budget (mid-range Android)
- Animate only `transform` and `opacity`. Never `top/left/font-size/letter-spacing` per frame.
- <= 8 depth words visible at once; cull hidden ones (`visibility:hidden`, done in `depthField`).
- `text-shadow` glow is costly on huge type: one shadow layer, small blur; or bake a glow PNG.
- `will-change` only on the elements that actually move.

## Pitfalls
- `perspective` on the same element you transform does nothing; put it on the parent stage.
- `overflow:hidden` on a `preserve-3d` element flattens 3D; keep the overflow clip on an outer wrapper.
- Split text breaks ligatures and screen readers if you forget `aria-label` / `aria-hidden`.
- Velocity values differ: Lenis reports px/frame; native scroll needs your own delta per frame.
- Reduced motion: show final state, no fly-through.
