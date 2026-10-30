---
name: audio-reactive-visuals
description: "Visuals that move with sound: Web Audio analyser giving smoothed bass/mid/high/level and beat onsets each frame, wired into shaders, CSS variables, Three.js, or scroll films; plus a sound design layer for cinematic sites (mute toggle, drone, impact on THE CUT). Use for music pages, artist sites, launches, interactive art."
---
# Audio-reactive visuals

Sound makes a page feel alive and cinematic. Two uses: visuals driven by music, and sound driven by the story.

## Files
- `audio-reactive.js`: `audioReactive({src | element | mic})` -> `read()` returns `{bass, mid, high, level, beat}` (0..1, smoothed).

## Steps (music -> visuals)
1. Start on a tap ("Enter with sound" / speaker button). Browsers block audio before a gesture.
2. `const ar = await audioReactive({ src: 'track.mp3' })` inside the click handler.
3. Map, don't overdo: bass -> scale/glow/embers, mid -> colour or distortion, high -> grain/sparkle, beat -> one flash or camera kick. Smooth everything.
   ```js
   gsap.ticker.add(() => { const a = ar.read();
     fx.set({ embers: .2 + a.bass * .8, grain: .06 + a.high * .06 });
     if (a.beat) gsap.fromTo(fx.state, { flash: .25 }, { flash: 0, duration: .25 }); });
   ```
4. CSS: set `--pulse` on `:root` and use it in `transform: scale(calc(1 + var(--pulse) * .05))`.

## Steps (story -> sound)
1. Sound off by default, a clear speaker toggle top-right, remembered in localStorage.
2. Layers: a quiet drone bed (loop), a whoosh tied to scroll velocity (gain = |velocity| x k), one impact at THE CUT.
3. Use Web Audio buffers (preloaded, decoded) for hits so they are sample-accurate; `<audio>` is fine for the bed.
4. Music: licensed or generated (a music generation model; instrumental flag in options).

## Budget (mid-range Android)
- `fftSize` 256-512 is plenty; one analyser; read once per frame.
- Audio files: bed <= 600 KB (AAC/Opus 96 kbps), hits <= 30 KB each.

## Pitfalls
- `createMediaElementSource` on a cross-origin file without CORS gives silence (zeros): serve same-origin.
- iOS: AudioContext must be created/resumed inside the gesture; the mute switch silences Web Audio.
- Reacting to raw values = jitter. Smooth (done) and clamp.
- Sound that auto-plays or can't be turned off: instant exit. Respect reduced motion for visual pulses too.
