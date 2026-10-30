# Headless Blender: build a simple stylised scene procedurally and export GLB. No GUI needed.
# run: blender -b -P blender_headless.py -- out.glb
# (apt-get install blender gives an older build; the official tarball from blender.org is ~300 MB, download only when needed.)
import bpy, sys, math
out = sys.argv[sys.argv.index("--") + 1] if "--" in sys.argv else "/tmp/scene.glb"
bpy.ops.wm.read_factory_settings(use_empty=True)
# monolith ring
bpy.ops.mesh.primitive_torus_add(major_radius=1.4, minor_radius=0.06, major_segments=128, minor_segments=16)
ring = bpy.context.object
mat = bpy.data.materials.new("Glow"); mat.use_nodes = True
bsdf = mat.node_tree.nodes["Principled BSDF"]
bsdf.inputs["Base Color"].default_value = (0.02, 0.02, 0.02, 1)
bsdf.inputs["Emission Color" if "Emission Color" in bsdf.inputs else "Emission"].default_value = (1.0, 0.45, 0.15, 1)
if "Emission Strength" in bsdf.inputs: bsdf.inputs["Emission Strength"].default_value = 6
ring.data.materials.append(mat)
# ground plane, glossy
bpy.ops.mesh.primitive_plane_add(size=40, location=(0, 0, -1.6))
g = bpy.data.materials.new("Ground"); g.use_nodes = True
gb = g.node_tree.nodes["Principled BSDF"]; gb.inputs["Roughness"].default_value = 0.08
gb.inputs["Base Color"].default_value = (0.03, 0.04, 0.06, 1)
bpy.context.object.data.materials.append(g)
# slow rotation keyframes (exported as a glTF animation)
ring.rotation_euler = (math.radians(90), 0, 0); ring.keyframe_insert("rotation_euler", frame=1)
ring.rotation_euler = (math.radians(90), 0, math.radians(360)); ring.keyframe_insert("rotation_euler", frame=240)
bpy.ops.export_scene.gltf(filepath=out, export_format="GLB", export_apply=True)
print("exported", out)
