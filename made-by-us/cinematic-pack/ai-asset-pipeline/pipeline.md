# Generation pipeline (still -> motion -> frames)

Request shapes below are for a fal-style generation API (model ids as fal lists them). Adapt the call to whatever client you use.

## 1. Hero still (consistent look)
request.json:
{"step_id":"hero-still-1","provider":"fal","model":"openai/gpt-image-2.5/sunburst/text-to-image","medium":"image",
 "filename":"assets/<proj>-still.png",
 "prompt":"Vertical cinematic frame, 9:16. <subject>, <place>, <light>. Huge empty negative space in the upper half for typography. Palette strictly limited: <4 colors>. Anamorphic lens look, soft film grain, realistic photographic lighting, no text, no logos, no watermark.",
 "options":{"image_size":{"width":1088,"height":1920},"quality":"high"}}
Submit request.json to your generation API; a still takes ~1-2 min.
image_size MUST be an object {width,height} or a named size (portrait_16_9); a "1088x1920" string is rejected (422).
Desktop tier: {"width":1920,"height":1088}.

Consistency across shots: feed the approved still back as a reference to an edit model
(openai/gpt-image-2.5/sunburst/edit with "reference_files":{"image_urls":["/abs/still.png"]}) and change only
the camera/pose in the prompt. Same palette sentence in every prompt.

## 2. Image -> video (one continuous move)
{"step_id":"hero-film-1","provider":"fal","model":"bytedance/seedance-2.5/image-to-video","medium":"video",
 "filename":"assets/<proj>-film.mp4",
 "prompt":"One continuous unbroken camera move, no cuts: the camera glides <direction> toward <subject>... Steady, smooth, no shake, no text.",
 "reference_files":{"image_url":"assets/<proj>-still.png"},
 "options":{"duration":6,"resolution":"720p","generate_audio":false}}
~4-5 min. Cost ~ $0.47/s at 720p, ~$0.22/s at 480p (provider rate). 480p is enough for the mobile tier.
For a seamless start->end, add "end_image_url" (a second still) to control where the move lands.

## 3. Check before use
ffprobe -v error -show_entries stream=width,height,duration -of csv=p=0 film.mp4
ffmpeg -ss 1 -i film.mp4 -frames:v 1 f1.png  (also at 3 s and 5 s): look for morphing hands/faces, text, watermark.
Reject clips with cuts or camera reversals.

## 4. Watermark-free crop (only for generator marks you are licensed to remove, never stock)
ffmpeg -i in.mp4 -vf "crop=iw:ih-80:0:0" -c:a copy out.mp4   # drop an 80px bottom band
Or zoom 6%: -vf "scale=iw*1.06:-2,crop=iw/1.06:ih/1.06"

## 5. Frames + compression
bash ../scroll-scrub-film/extract-frames.sh film.mp4 public/frames 12 24
Poster: ffmpeg -i film.mp4 -frames:v 1 -vf scale=1080:-2 -c:v libwebp -quality 72 public/poster.webp
Loop bg video for non-scrub sections: ffmpeg -i film.mp4 -an -vf scale=720:-2 -c:v libx264 -crf 28 -preset slow -movflags +faststart -pix_fmt yuv420p bg.mp4

## 6. Cleanup
Delete source mp4s and intermediate PNGs from assets/ once frames are made.
