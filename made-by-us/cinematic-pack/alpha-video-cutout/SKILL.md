---
name: alpha-video-cutout
description: "Person or object cut out of video and composited in front of giant type (or between layers) using a packed RGB+alpha H.264 video and a tiny WebGL shader. Safari/iOS-safe, one file. Includes the ffmpeg packing recipe. Use for 'hero walks in front of the title' and layered depth shots."
---
# Alpha video cutout

The 'person in front of huge type' shot: background film, then the giant word, then the cutout person on top. Transparent video is the hard part: WebM alpha doesn't play in Safari and HEVC alpha doesn't play in Chrome. Packing colour + matte side by side in one normal MP4 works everywhere.

## Files
- `packed-alpha.js`: `packedAlpha(canvas, video)` WebGL compositor (premultiplied, matte noise crush, `requestVideoFrameCallback`).

## Steps
1. Get a matte. Options: a video background-removal model from a generation API (check the endpoint id first), or shoot/generate the subject on flat green and key it: `ffmpeg -i in.mp4 -vf "chromakey=0x00ff00:0.15:0.05,format=rgba" -c:v png keyed.mov`.
2. Pack colour | matte side by side (H.264, even sizes):
   ```bash
   ffmpeg -i keyed.mov -filter_complex "[0:v]scale=540:-2,format=rgba,split[a][b];[a]format=rgb24[c];[b]alphaextract,format=rgb24[m];[c][m]hstack,format=yuv420p" \
     -an -c:v libx264 -crf 22 -movflags +faststart person-packed.mp4
   ```
   (Output is 1080 wide: 540 colour + 540 matte. Tested with ffmpeg 5.1.)
3. Layers: `film canvas (z1) -> giant type (z2) -> cutout canvas (z3) -> FX grain (z4)`.
4. Play: `packedAlpha(canvas, video).start()`. Scrub with scroll: encode all-intra (`-g 1 -bf 0`) so seeking is instant, `video.pause()`, then `cut.seek(progress)` from ScrollTrigger.
5. Static version: export one frame as a transparent WebP (`ffmpeg -ss 2 -i keyed.mov -frames:v 1 -c:v libwebp -lossless 0 -q 80 cut.webp`) for reduced motion and as the poster.

## Budget (mid-range Android)
- Packed video 720x640 (two 360x640 halves) for mobile, CRF 24-26: ~0.6-1.2 MB for 5 s.
- One texture upload per new video frame only (rVFC), DPR <= 1.5.
- All-intra files are ~2-3x bigger: only for scrubbed cutouts, keep them <= 4 s.

## Pitfalls
- iOS needs `muted playsinline` for autoplay; set them as properties AND attributes.
- yuv420p bleeds colour into the matte edge: crush with `smoothstep(.04,.96)` (done) and keep the matte half slightly eroded (`erosion` filter) if halos show.
- Not premultiplying alpha gives dark fringes on light backgrounds.
- Cross-origin video taints WebGL: serve same-origin or with CORS + `crossOrigin='anonymous'`.
- A still cutout PNG/WebP is often enough. Use video only when the subject must move.
