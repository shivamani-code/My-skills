---
name: scroll-scrub-film
description: "Scroll-scrubbed film: a video turned into a WebP frame sequence drawn on canvas so scrolling plays the film. Use for cinematic hero sections, 'the film is the site' pages, product reveals. Includes a tested FrameScrubber engine and an ffmpeg frame pipeline."
---
# Scroll-scrub film

Scroll position = film time. The film is not a `<video>`; it is N stills drawn on one `<canvas>`. This is the core trick behind most "insane" scroll sites (Apple product pages, Gireesh's GoT/freefall). Our version is lighter: coarse-to-fine loading, neighbour blending (ship half the frames), mobile tier.

## Files here
- `frame-scrubber.js`: the engine (no deps, ES module, tested on a 412x915 Android viewport).
- `extract-frames.sh`: video -> `m/` (540w) and `d/` (1080w) WebP tiers + manifest.

## Steps
1. Get a clip that is ONE continuous camera move (dolly, fall, orbit). Cuts look broken when scrubbed backwards. 4-8 s is plenty. See `ai-asset-pipeline`.
2. `bash extract-frames.sh clip.mp4 public/frames 12 24` (add a crop arg to remove a watermark band).
3. Markup: a tall section with a sticky stage.
   ```html
   <section id="film" style="height:400vh"><div style="position:sticky;top:0;height:100svh">
     <canvas id="c" style="width:100%;height:100%;display:block"></canvas></div></section>
   ```
4. Pick the tier by viewport/memory, then wire progress:
   ```js
   const tier = innerWidth < 800 ? 'm' : 'd';
   const film = new FrameScrubber({ canvas: c, count, src: i => `frames/${tier}/f_${String(i+1).padStart(4,'0')}.webp` });
   film.load();
   ScrollTrigger.create({ trigger:'#film', start:'top top', end:'bottom bottom', onUpdate: s => film.progress = s.progress });
   gsap.ticker.add(() => film.render());
   ```
   No GSAP? `progress = -rect.top / (rect.height - innerHeight)`.
5. Story beats are scroll % (cut at 0.47, flash at 0.58...). Keep them in one `BEATS` array so direction and code agree.
6. Show the first frame as a CSS `background` / `<img>` poster under the canvas so the page is never blank.

## Budget (mid-range Android, e.g. Moto G / Galaxy A)
- Mobile tier: 60-90 frames, 540 px wide, WebP q55-60, 25-45 KB each => 2-4 MB total. Desktop tier: 120-180 frames at 1080w, under 12 MB.
- Decoded RAM = w x h x 4 per frame. 72 frames at 540x960 is ~150 MB if all are ImageBitmaps; that is why `bitmaps` is off on mobile (plain Image lets the browser evict).
- Canvas backing store: DPR capped at 1.5 on mobile.
- One draw per changed frame; zero work when idle.

## Pitfalls
- Shipping 700 frames (22 MB) is the #1 mistake. Blend instead: 12 fps + `blend:true` reads as 24 fps when scrubbing.
- `100vh` jumps on Android when the URL bar hides: use `100svh` for the sticky stage.
- Don't decode on the main thread in the scroll handler; the engine decodes in its loader and draws in rAF.
- PNG frames: 5-10x heavier than WebP for no visible gain.
- Watermarks from video generators: crop them in step 2, never blur.
- `prefers-reduced-motion`: show the poster frame + text, skip loading the sequence.
- Alternative for very long films: an all-intra MP4 (`ffmpeg -g 1 -crf 28`) and set `video.currentTime`. Smaller download, but seeking is janky on iOS Safari. Frames stay the safe default.
