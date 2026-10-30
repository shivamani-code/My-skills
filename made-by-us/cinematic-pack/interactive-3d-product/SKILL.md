---
name: interactive-3d-product
description: "Interactive 3D product viewer/configurator: damped orbit with touch, auto-rotate until the user grabs it, colour/material swatches, 3D-pinned hotspots, scroll-driven exploded views, AR handoff with <model-viewer>. Use for product launches, e-commerce heroes, jewellery/perfume/sneaker showcases."
---
# Interactive 3D product

Let people hold the product. Build on `threejs-scenes` (renderer, tiers, GLTF) and `3d-design-modeling` (an optimised GLB).

## Files
- `configurator.js`: `configurator({renderer, scene, camera, model, swatchEls, hotspots})` -> OrbitControls (damped, limited angles, auto-rotate until touched), colour lerp on swatches, hotspots projected from 3D to DOM. Call `tick()` in the render loop.

## Steps
1. Model: one GLB, materials named (`body`, `strap`, `glass`) so code can find them. <= 2 MB.
2. Scene: `heroScene(canvas, { gltfUrl })`, then `const cfg = configurator({...hero, swatchEls: [...document.querySelectorAll('[data-color]')], hotspots })`.
3. Swatches: real `<button data-color="#c9a227" aria-pressed="false">` elements with labels (accessible, tappable 48px).
4. Hotspots: small DOM buttons positioned by `tick()`; tap opens a one-line detail. Max 4.
5. Exploded view on scroll: give parts separate nodes; tween each part's position along its own axis by ScrollTrigger progress (`part.position.y = base + p * offset`).
6. AR / zero-code alternative: `<model-viewer src="x.glb" ios-src="x.usdz" ar camera-controls auto-rotate>` (Google's web component) gives orbit + 'View in your space' on Android (Scene Viewer) and iOS (Quick Look).
7. Fallback (tier 0): a 24-36 frame turntable image sequence driven by drag (reuse `scroll-scrub-film` FrameScrubber with drag progress instead of scroll).

## Budget (mid-range Android)
- <= 80k tris, 1 HDRI at 1k, no shadows (use a baked contact-shadow plane), DPR 1.25.
- Render on demand: when controls are idle and nothing animates, skip rendering (`controls.addEventListener('change', requestRender)`).

## Pitfalls
- OrbitControls stealing page scroll on mobile: set `touch-action: pan-y` on the canvas and only rotate on horizontal drags, or require a tap to 'activate' the viewer.
- Colour swatches on textured materials tint the texture: use a separate mask or swap materials.
- Hotspots that don't hide when behind the model: check depth (done via `v.z`, or raycast for accuracy).
- Unlit, untoned GLB looks plastic: tone mapping + HDRI reflections are what sell 'premium'.
