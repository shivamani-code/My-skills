---
name: webgl-shaders-fx
description: "Tiny WebGL shader kit for cinematic polish: animated film grain, vignette, rising embers, burn/dissolve reveal, flash, chromatic aberration, ripple distortion, heat haze, eclipse glow. Use when a page needs atmosphere on top of video/frames/type without Three.js."
---
# WebGL shaders FX

Atmosphere is what makes AI footage feel like film. One transparent full-screen WebGL canvas on top of everything, one shader, half resolution. ~3 KB, no library.

## Files
- `fx.js`: `createFX(canvas, {grain, vignette, embers, burn, flash, emberColor})`, then `fx.set({...})` from scroll. Tested at 412x915 (Android UA).
- `snippets.glsl`: chromatic aberration, ripple, two-texture dissolve, heat haze, eclipse ring.

## Steps
1. `<canvas id="fx" style="position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:50"></canvas>`
2. `const fx = createFX(fxCanvas, { grain:.08, vignette:.55, embers:.6 }); fx.start();`
3. Drive uniforms from story beats:
   ```js
   ScrollTrigger.create({ trigger:'#cut', start:'top center', end:'+=400', scrub:true,
     onUpdate: s => fx.set({ burn: s.progress }) });
   gsap.to(fx.state, { flash: 1, duration:.06, yoyo:true, repeat:1 });   // white cut flash
   ```
4. To distort an image or video (ripple, chroma, dissolve) you need it as a texture: use a small Three.js/OGL plane, or the two-texture pattern from `snippets.glsl` in your own WebGL program.
5. Fallback: `fx.ok === false` means no WebGL; add a CSS grain (a 128px noise PNG, `animation: steps(6)` jitter) and a radial-gradient vignette.

## Look rules
- Grain 0.05-0.10. If you notice it, it's too much.
- Embers are punctuation: on during fire/heat beats only, off for calm scenes.
- Burn reveal edges in the palette's accent color (amber/orange by default; set it in the shader).
- Vignette 0.4-0.6 for drama, 0 for clean product sections.

## Budget (mid-range Android)
- Render scale 0.5 on touch devices (default): the full-screen pass costs ~1-2 ms on Adreno 6xx.
- <= 4 fbm octaves, <= 3 ember layers, no loops over lights, `mediump`.
- One FX canvas per page. Never one WebGL context per card (browsers cap contexts at ~16 and kill the oldest).
- Stop the loop when the tab is hidden (`visibilitychange` -> `fx.stop()`), and for reduced motion: keep vignette, set grain 0, embers 0, render one frame.

## Pitfalls
- `premultipliedAlpha:false` + `SRC_ALPHA` blending is required; otherwise grain turns into grey haze.
- `highp` in fragment shaders fails on some old Mali GPUs; use `mediump` and keep hash inputs small (wrap time with `fract`).
- Time as float loses precision after hours; wrap it (`ms % 1e6`).
- A fixed overlay with `mix-blend-mode` forces extra compositing on Android: use plain alpha.
- Don't render grain into the frame-sequence canvas; keep it on its own layer so the film only redraws when scrolling.
