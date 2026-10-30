---
name: ai-asset-pipeline
description: "Make original cinematic assets with AI: consistent hero stills, image-to-video with one continuous camera move, frame checks, watermark-free crops, frame extraction and compression for web. Use before scroll-scrub-film or any hero needing custom footage."
---
# AI asset pipeline

The film is the expensive, slow part. Get it right in one pass: still first (cheap, fast to iterate), motion second (slow, costly).

## Files
- `pipeline.md`: exact generation request JSONs (GPT Image 2.5 still, Seedance 2.5 image-to-video), ffmpeg commands for checks, crops, frames, posters, loops.

## Steps
1. Write the shot from the brief (`cinematic-direction`): subject, place, light, camera, palette sentence, 'empty sky for type'.
2. Still: generate 1, look at it, fix the prompt, repeat until it's right. Stills cost cents and take ~1-2 min.
3. Second shot, same world: use the approved still as a reference image for an edit model, change only camera/pose.
4. Motion: image-to-video, 5-8 s, one continuous move, 'no cuts, steady, no text'. 480p for mobile-only, 720p for both tiers. ~4-5 min per render.
5. Check 3 frames (20/50/80%): morphing faces/hands, warped text, watermark, camera reversal. Reject and re-render rather than hide flaws.
6. Crop marks, extract frames (`scroll-scrub-film/extract-frames.sh`), make a poster WebP, delete the big sources.

## Prompt rules that work
- Describe what literally happens ('the camera glides low over the water toward...'), not adjectives ('epic').
- One subject, one action, one camera move per clip.
- Name the palette in every prompt, same words each time = consistent series.
- Small or back-facing figures avoid face morphing; crowds are where models fail (mush faces).
- Plan negative space where the type will sit.

## Budget
- Per hero: ~3-5 stills + 1-2 videos. At provider rates that's about $3-6 at 720p.
- Web output: mobile frames <= 4 MB, poster <= 120 KB, loop video <= 1.5 MB.

## Pitfalls
- `image_size` as a string ('1088x1920') is rejected; use an object or a named size.
- Re-submitting with a new step_id = paying twice; check status on the old one first.
- Text in generated images is often garbled: add real type in HTML, never bake it in.
- Copyrighted characters/logos: don't. Original worlds only for client work.
- Generator watermarks: crop, never blur or inpaint over someone else's stock watermark.
