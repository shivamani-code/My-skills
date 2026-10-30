---
name: threejs-scenes
description: "Three.js hero scenes (vanilla or React Three Fiber): device perf tiers, GLTF + Draco loading, bloom only where affordable, fog/tone mapping for a filmic look, scroll-linked camera, off-screen pause. Use for 3D heroes, portals, floating objects, particle worlds."
---
# Three.js scenes

Real 3D when frames can't do it: the user moves the camera, objects react to pointer/scroll, scenes are infinite. Default to vanilla Three.js for one hero; R3F when the app is already React.

## Files
- `hero-scene.js`: `tier()` (0 static / 1 phone / 2 desktop) and `heroScene(canvas, {gltfUrl})` with Draco GLTF, filmic tone mapping, fog, cheap sprite glow on phones, UnrealBloom on desktop, IntersectionObserver pause, `progress` setter for scroll.

## Steps
1. Import map (in the file header) or `npm i three`.
2. `const hero = await heroScene(canvas, { gltfUrl: 'model.glb' });` then `ScrollTrigger ... onUpdate: s => hero.progress = s.progress`.
3. Look: ACES tone mapping + sRGB output, one warm key light + cool hemisphere fill, `FogExp2` for depth, an HDRI only on desktop (`RGBELoader`, 1k .hdr).
4. Assets: optimise every GLB (`3d-design-modeling` skill): Draco/meshopt, textures as KTX2 or 1k WebP.
5. R3F version: `<Canvas dpr={[1, tier===2?2:1.25]} gl={{antialias: tier===2}}>`, `useGLTF` + `<Preload all/>`, `@react-three/postprocessing` `<Bloom>` only when tier 2, `<PerformanceMonitor onDecline={...}>` to drop DPR live.
6. Tier 0 (reduced motion / no WebGL): show a rendered poster image instead of the canvas.

## Budget (mid-range Android, tier 1)
- <= 100k triangles visible, <= 50 draw calls (merge or instance), textures <= 1024 px, total GPU memory <= 150 MB.
- DPR 1.25, no MSAA, no post-processing passes (fake glow with additive sprites / emissive).
- GLB <= 2 MB over the wire (Draco), first render < 2.5 s on 4G.
- Pause the loop when off-screen or the tab is hidden.

## Pitfalls
- Forgetting `outputColorSpace`/tone mapping: washed-out, 'unfinished' look.
- Bloom on phones: halves FPS. Emissive + sprite looks 90% as good.
- New geometries/materials created per frame: memory leak. Create once, mutate.
- Shadows: expensive; use baked AO or a blurred contact-shadow texture.
- Multiple WebGL canvases: share one renderer and use scissor, or one canvas per page.
- Raycasting every pointermove on complex meshes: raycast a simple proxy mesh.
