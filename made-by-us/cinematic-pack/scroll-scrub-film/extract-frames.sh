#!/usr/bin/env bash
# Video -> two WebP frame tiers for FrameScrubber.
# usage: extract-frames.sh input.mp4 out_dir [mobile_fps=12] [desktop_fps=24] [crop]
#   crop (optional) is an ffmpeg crop expr, e.g. "iw:ih-90:0:0" to drop a bottom watermark band.
# Output: out_dir/m/f_0001.webp (540 px wide), out_dir/d/f_0001.webp (1080 px wide), out_dir/manifest.json
set -euo pipefail
IN="$1"; OUT="$2"; MFPS="${3:-12}"; DFPS="${4:-24}"; CROP="${5:-}"
mkdir -p "$OUT/m" "$OUT/d"
PRE=""; [ -n "$CROP" ] && PRE="crop=$CROP,"
# mobile: 540w, q58. desktop: 1080w, q70. -an: frames carry no audio. lanczos keeps type edges crisp.
ffmpeg -nostdin -loglevel error -y -i "$IN" -an -vf "${PRE}fps=$MFPS,scale=540:-2:flags=lanczos" \
  -c:v libwebp -quality 58 -compression_level 6 -preset photo "$OUT/m/f_%04d.webp"
ffmpeg -nostdin -loglevel error -y -i "$IN" -an -vf "${PRE}fps=$DFPS,scale=1080:-2:flags=lanczos" \
  -c:v libwebp -quality 70 -compression_level 6 -preset photo "$OUT/d/f_%04d.webp"
M=$(ls "$OUT/m" | wc -l); D=$(ls "$OUT/d" | wc -l)
MB=$(du -sk "$OUT/m" | cut -f1); DB=$(du -sk "$OUT/d" | cut -f1)
printf '{"mobile":{"count":%s,"kb":%s,"width":540},"desktop":{"count":%s,"kb":%s,"width":1080}}\n' "$M" "$MB" "$D" "$DB" | tee "$OUT/manifest.json"
# Optional AVIF (~30% smaller): if `avifenc` exists, convert each webp->png->avif. ffmpeg 5.x has no AVIF image muxer.
