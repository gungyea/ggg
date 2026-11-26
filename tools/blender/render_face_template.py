"""
Renders an orthographic front view of the character's head that exactly covers
the face-texture box, so face landmarks found on this image are directly the
texture coordinates where the photo's landmarks must land.

  blender -b -P tools/blender/render_face_template.py -- public/models/male.glb out.png
"""
import bpy, sys, json, math
from mathutils import Vector

argv = sys.argv[sys.argv.index("--") + 1:]
GLB, OUT = argv[0], argv[1]
meta = json.load(open(GLB.replace(".glb", ".json")))
FX0, FX1, FZ0, FZ1 = meta["faceBox"]
lm = meta["face"]

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=GLB)
sc = bpy.context.scene

skin = bpy.data.materials.new("skin"); skin.use_nodes = True
b = skin.node_tree.nodes["Principled BSDF"]
b.inputs["Base Color"].default_value = (0.75, 0.52, 0.42, 1)
b.inputs["Roughness"].default_value = 0.5
b.inputs["Subsurface Weight"].default_value = 0.15
def flat(c):
    m = bpy.data.materials.new("m"); m.use_nodes = True
    n = m.node_tree.nodes["Principled BSDF"]; n.inputs["Base Color"].default_value = (*c, 1); n.inputs["Roughness"].default_value = 0.3
    return m
iris, sclera, lips = flat((0.03, 0.02, 0.015)), flat((0.85, 0.83, 0.8)), flat((0.5, 0.2, 0.2))

eyes = []
for ex in (lm["eyeLX"], lm["eyeRX"]):
    eyes.append((FX0 + ex * (FX1 - FX0), FZ1 - lm["eyeY"] * (FZ1 - FZ0)))
mouth_z = FZ1 - (lm["eyeY"] + (lm["chinY"] - lm["eyeY"]) * 0.62) * (FZ1 - FZ0)

for o in sc.objects:
    if o.type != "MESH":
        continue
    me = o.data
    me.materials.clear()
    for m in (skin, iris, sclera, lips):
        me.materials.append(m)
    mw = o.matrix_world
    for p in me.polygons:
        c = mw @ p.center
        p.material_index = 0
        for ex, ez in eyes:
            d = math.hypot(c.x - ex, c.z - ez)
            if d < 0.016 and p.normal.y < -0.3:
                # eyeballs sit behind the lids: only the eyeball helper is this deep
                pass
        # eyeball helper vertices are not weighted to anything but the head and lie inside the socket
    # classify eyeball polygons by closeness to the eye centre in 3D
    ys = [(mw @ v.co).y for v in me.vertices]
    for p in me.polygons:
        c = mw @ p.center
        for ex, ez in eyes:
            d = math.hypot(c.x - ex, c.z - ez)
            if d < 0.0125 and p.normal.y < -0.2:
                p.material_index = 1 if d < 0.0062 else 2

cam = bpy.data.objects.new("cam", bpy.data.cameras.new("cam"))
sc.collection.objects.link(cam)
cam.data.type = "ORTHO"
cam.data.sensor_fit = "VERTICAL"
cam.data.ortho_scale = FZ1 - FZ0
cam.location = ((FX0 + FX1) / 2, -2.0, (FZ0 + FZ1) / 2)
cam.rotation_euler = (math.radians(90), 0, 0)
sc.camera = cam
sc.render.resolution_y = 1000
sc.render.resolution_x = round(1000 * (FX1 - FX0) / (FZ1 - FZ0))
sc.render.engine = "CYCLES"
sc.cycles.samples = 32
for loc, e in [((0.6, -1.5, 2.2), 120), ((-0.8, -1.5, 1.6), 50)]:
    L = bpy.data.objects.new("L", bpy.data.lights.new("L", "AREA"))
    L.data.energy = e; L.data.size = 1.5; L.location = loc
    L.rotation_euler = (Vector((0, 0, 1.55)) - Vector(loc)).to_track_quat("-Z", "Y").to_euler()
    sc.collection.objects.link(L)
w = bpy.data.worlds.new("w"); w.use_nodes = True
w.node_tree.nodes["Background"].inputs[0].default_value = (0.35, 0.4, 0.45, 1)
sc.world = w
sc.render.filepath = OUT
bpy.ops.render.render(write_still=True)
print("RENDERED", OUT, sc.render.resolution_x, sc.render.resolution_y)
