---
name: 3d-design-modeling
description: "Get or make 3D assets for the web for free: licensed model sources, headless Blender scripting, procedural geometry in Three.js, GLTF optimisation (gltf-transform, meshopt/Draco, KTX2/WebP textures), PBR materials, lighting and HDRIs. Use whenever a site needs a 3D model, product, environment, or a lighter GLB."
---
# 3D design + modeling

Good 3D on the web = the right asset, made small, lit well.

## Files
- `optimize-glb.sh`: one command to simplify + compress a GLB (meshopt/Draco, 1024 WebP textures).
- `blender_headless.py`: procedural scene built and exported as GLB from the command line (`blender -b -P ...`).

## Sources (check each model's licence; prefer CC0)
| Need | Where | Licence |
|---|---|---|
| Props, environments, textures, HDRIs | Poly Haven (polyhaven.com) | CC0 |
| Low-poly kits, characters | Kenney (kenney.nl), Quaternius | CC0 |
| Large variety | Sketchfab (filter "downloadable" + CC-BY/CC0) | per model; credit CC-BY |
| PBR materials | ambientCG | CC0 |
| AI text/image-to-3D | hosted 3D models (fal-ai/hunyuan3d/v2, fal-ai/trellis, fal-ai/triposr) | your output; check topology |
Never use ripped game/film models in client work.

## Ways to make it
1. Procedural in Three.js (cheapest, zero download): primitives + `TubeGeometry` along curves, instanced meshes for crowds/particles, noise-displaced spheres for planets/blobs, `ExtrudeGeometry` from SVG paths for logos.
2. Headless Blender: script geometry, modifiers, materials, keyframes, then `export_scene.gltf`. Bake lighting/AO into textures for phones.
3. AI image-to-3D: generate a clean product still (white background, 3/4 view), send to an image-to-3D model, then decimate and retexture. Good for props, weak for hard-surface precision.

## Optimise (always)
- `bash optimize-glb.sh in.glb out.glb 0.5`. Targets: hero model <= 2 MB, <= 100k tris (phone), textures 1024 (2048 desktop only).
- Textures: KTX2 (Basis) for many/large textures (GPU-compressed, lowest VRAM); WebP for simple cases.
- Merge meshes that share a material; instance repeats; remove hidden faces.

## Materials + light (filmic look)
- PBR: base color + roughness + metalness + normal map; most realism comes from roughness variation.
- Light: one HDRI for reflections (1k on phones), one warm key directional, rim light behind the subject for silhouette.
- `ACESFilmicToneMapping`, sRGB output, slight fog for depth. Emissive + bloom (desktop) for glow.

## Pitfalls
- 50 MB GLBs straight from Sketchfab: always optimise.
- Meshopt-compressed files need `MeshoptDecoder` set on GLTFLoader; Draco needs `DRACOLoader`.
- Blender's apt package may be old (glTF exporter options differ); check `blender --version`.
- Non-manifold AI meshes shade badly: recalc normals, use flat-ish materials.
- Scale/units: glTF is metres; normalise models to ~1-2 units so camera/fog values work.
