---
name: showreel-factory
description: "Turn a scroll site into a perfectly smooth vertical showreel mp4: Playwright on a virtual clock (frame-perfect regardless of machine speed), eased auto-scroll, phone-mockup composite, synthesized drone + impact sound, 1080x1920 H.264 ready for Instagram/WhatsApp. Use to show off a build."
---
# Showreel factory

Screen-recording a heavy site drops frames. Instead, freeze time, step it one frame at a time, screenshot each, and assemble. The result is smoother than real use, which is why reels from this method look so clean.

## Files
- `record_reel.py`: `python3 record_reel.py http://localhost:8080/ reel.mp4 10 30` -> 1080x1920 mp4 with audio.

## Steps
1. Serve the site locally (`python3 -m http.server 8080`) or use the live URL.
2. Make the site deterministic: animations must read time from `performance.now()`/rAF/GSAP (all faked by `page.clock`). Kill random seeds or seed them.
3. Run the script. It holds the first 8%, scrolls with an ease-in-out to the end, holds 10%.
4. Look at frames at 20/50/80% (`ffmpeg -ss 5 -i reel.mp4 -frames:v 1 f.png`) before sharing.
5. Better audio: replace the synthesized track with a licensed or generated music bed (gateway music model) and place the impact at THE CUT's scroll %.
6. Variants: 16:9 desktop reel (viewport 1440x900, monitor mockup), or a photo mockup (overlay the screen video onto a phone photo with a perspective warp: ffmpeg `perspective` filter).

## Budget
- 10 s at 30 fps = 300 screenshots, ~1-2 min on this box. Output 3-8 MB (WhatsApp limit 16 MB for video).
- Use DPR 2 for crisp text; 3 is slower with little gain at 744 px.

## Pitfalls
- Image decoding is real time, not virtual: wait (real ms) after load so frames exist before stepping.
- Lenis + fake clock: works because Lenis runs on rAF; if a site uses `setInterval` for scroll, step the clock more finely.
- Video elements don't follow the fake clock: seek them manually per frame (`video.currentTime = t`).
- Screenshots include the scrollbar on desktop: hide it with CSS for the reel.
- Copyrighted trending audio in client reels: use licensed/generated music.
