#!/usr/bin/env bash
# Shrink a GLB for the web: dedupe, weld, simplify, resize textures to 1024 WebP, meshopt/Draco compress.
# usage: optimize-glb.sh in.glb out.glb [ratio=0.5]   (needs node; uses npx @gltf-transform/cli, ~30 MB once)
set -euo pipefail
IN="$1"; OUT="$2"; R="${3:-0.5}"
npx -y @gltf-transform/cli@4 optimize "$IN" "$OUT" \
  --compress meshopt --texture-compress webp --texture-size 1024 --simplify true --simplify-ratio "$R"
npx -y @gltf-transform/cli@4 inspect "$OUT" | head -40
ls -lh "$IN" "$OUT"
# Draco instead of meshopt: --compress draco  (needs DRACOLoader in three; meshopt needs MeshoptDecoder)
