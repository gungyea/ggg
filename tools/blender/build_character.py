"""
Builds the game's rigged character (male / female) from the CC0 MakeHuman
base mesh and exports a web-ready GLB.

Run:
  blender -b -P tools/blender/build_character.py -- <male|female> <out.glb> [preview.png]

What it does
  1. Reads base.obj and applies gender/ethnicity targets (young adult).
  2. Builds a simplified 15-bone skeleton (ragdoll friendly) from the
     MakeHuman default rig joints, and merges the 163-bone CC0 weights into it.
  3. Adds shape keys: fat / thin / muscle (used by the in-game sliders).
  4. Assigns materials: skin, face (photo projection UVs), shirt, pants, shoes.
  5. Exports GLB (skin + morph targets).
"""
import bpy, bmesh, json, sys, os, math
import numpy as np
from mathutils import Vector

argv = sys.argv[sys.argv.index("--") + 1:]
GENDER = argv[0]
OUT = argv[1]
PREVIEW = argv[2] if len(argv) > 2 else None

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
SRC = os.path.join(ROOT, "assets-src")

# ---------------------------------------------------------------- obj
verts, uvs, faces, groups = [], [], [], []
cur = None
for line in open(os.path.join(SRC, "base.obj")):
    if line.startswith("v "):
        verts.append([float(x) for x in line.split()[1:4]])
    elif line.startswith("vt "):
        uvs.append([float(x) for x in line.split()[1:3]])
    elif line.startswith("g "):
        cur = line.split()[1]
    elif line.startswith("f "):
        idx = [p.split("/") for p in line.split()[1:]]
        faces.append(([int(a[0]) - 1 for a in idx], [int(a[1]) - 1 for a in idx]))
        groups.append(cur)
V = np.array(verts, dtype=np.float64)
UV = np.array(uvs, dtype=np.float64)


def load_target(name):
    d = np.zeros_like(V)
    for line in open(os.path.join(SRC, "t", name)):
        if line.startswith("#") or not line.strip():
            continue
        p = line.split()
        d[int(p[0])] = [float(p[1]), float(p[2]), float(p[3])]
    return d


g = GENDER
ETH = {"asian": 0.6, "caucasian": 0.25, "african": 0.15}
base = V.copy()
for e, w in ETH.items():
    base += w * load_target(f"{e}-{g}-young.target")

# a touch of realism: slightly more defined than the neutral average
base += 0.25 * load_target(f"u-{g}-max-average.target")

keys = {
    "fat": load_target(f"u-{g}-average-max.target"),
    "thin": load_target(f"u-{g}-average-min.target"),
    "muscle": load_target(f"u-{g}-max-average.target") * 0.75,
}

# ---------------------------------------------------------------- skeleton
skel = json.load(open(os.path.join(SRC, "default.mhskel")))
J = {k: base[v].mean(axis=0) for k, v in skel["joints"].items()}
B = skel["bones"]


def jh(b):
    return J[B[b]["head"]]


def jt(b):
    return J[B[b]["tail"]]


SIMPLE = {
    # name: (parent, head, tail, [source bones])
    "hips": (None, jh("spine05"), jh("spine04"), ["root", "spine05", "pelvis.L", "pelvis.R"]),
    "spine": ("hips", jh("spine04"), jh("spine02"), ["spine04", "spine03"]),
    "chest": ("spine", jh("spine02"), jh("neck01"), ["spine02", "spine01"]),
    "neck": ("chest", jh("neck01"), jh("head"), ["neck01", "neck02", "neck03"]),
    "head": ("neck", jh("head"), jt("head"), ["head"]),
}
for s in "LR":
    SIMPLE.update({
        f"upperarm.{s}": ("chest", jh(f"upperarm01.{s}"), jh(f"lowerarm01.{s}"), [f"upperarm01.{s}", f"upperarm02.{s}", f"clavicle.{s}", f"shoulder01.{s}"]),
        f"lowerarm.{s}": (f"upperarm.{s}", jh(f"lowerarm01.{s}"), jh(f"wrist.{s}"), [f"lowerarm01.{s}", f"lowerarm02.{s}"]),
        f"hand.{s}": (f"lowerarm.{s}", jh(f"wrist.{s}"), jt(f"finger3-1.{s}"), [f"wrist.{s}"]),
        f"upperleg.{s}": ("hips", jh(f"upperleg01.{s}"), jh(f"lowerleg01.{s}"), [f"upperleg01.{s}", f"upperleg02.{s}"]),
        f"lowerleg.{s}": (f"upperleg.{s}", jh(f"lowerleg01.{s}"), jh(f"foot.{s}"), [f"lowerleg01.{s}", f"lowerleg02.{s}"]),
        f"foot.{s}": (f"lowerleg.{s}", jh(f"foot.{s}"), jh(f"toe3-1.{s}"), [f"foot.{s}"]),
    })
# clavicle/shoulder stay on the chest mostly: split them
SPLIT = {}
for s in "LR":
    SPLIT[f"clavicle.{s}"] = {"chest": 1.0}
    SPLIT[f"shoulder01.{s}"] = {"chest": 0.6, f"upperarm.{s}": 0.4}
    SPLIT[f"breast.{s}"] = {"chest": 1.0}

src2simple = {}
for sname, (_, _, _, srcs) in SIMPLE.items():
    for b in srcs:
        src2simple[b] = sname


def resolve(b):
    while b is not None:
        if b in SPLIT:
            return SPLIT[b]
        if b in src2simple:
            return {src2simple[b]: 1.0}
        b = B[b]["parent"]
    return {"hips": 1.0}


wdata = json.load(open(os.path.join(SRC, "default_weights.mhw")))["weights"]
W = {}  # vertex -> {simple: w}
for b, lst in wdata.items():
    for sb, f in resolve(b).items():
        for vi, w in lst:
            d = W.setdefault(vi, {})
            d[sb] = d.get(sb, 0.0) + w * f

# ---------------------------------------------------------------- mesh subset
KEEP = {"body", "helper-l-eye", "helper-r-eye"}
sel = [i for i, gname in enumerate(groups) if gname in KEEP]
used = sorted({v for i in sel for v in faces[i][0]})
remap = {o: n for n, o in enumerate(used)}

# MakeHuman: Y up, +Z forward, decimetres  ->  Blender: Z up, -Y forward, metres
def conv(a):
    a = np.asarray(a)
    return np.stack([a[..., 0], -a[..., 2], a[..., 1]], axis=-1) * 0.1


P = conv(base[used])
foot_z = P[:, 2].min()
P[:, 2] -= foot_z
for k in keys:
    keys[k] = conv(base[used] + keys[k][used]) - [0, 0, foot_z] - P

mesh = bpy.data.meshes.new("Body")
mesh.from_pydata(P.tolist(), [], [[remap[v] for v in faces[i][0]] for i in sel])
mesh.update()
uvl = mesh.uv_layers.new(name="UV")
li = 0
for poly, i in zip(mesh.polygons, sel):
    for k, t in enumerate(faces[i][1]):
        uvl.data[poly.loop_start + k].uv = UV[t]
for p in mesh.polygons:
    p.use_smooth = True

for o in list(bpy.data.objects):
    bpy.data.objects.remove(o)
obj = bpy.data.objects.new("Body", mesh)
bpy.context.scene.collection.objects.link(obj)

# ---------------------------------------------------------------- armature
arm_data = bpy.data.armatures.new("Rig")
arm = bpy.data.objects.new("Rig", arm_data)
bpy.context.scene.collection.objects.link(arm)
bpy.context.view_layer.objects.active = arm
bpy.ops.object.mode_set(mode="EDIT")
for sname, (parent, h, t, _) in SIMPLE.items():
    eb = arm_data.edit_bones.new(sname)
    eb.head = Vector(conv(h) - [0, 0, foot_z])
    eb.tail = Vector(conv(t) - [0, 0, foot_z])
    if (eb.tail - eb.head).length < 0.02:
        eb.tail = eb.head + Vector((0, 0, 0.05))
    # stable roll: z axis pointing forward (-Y) where possible
    eb.align_roll(Vector((0, -1, 0)))
for sname, (parent, *_rest) in SIMPLE.items():
    if parent:
        arm_data.edit_bones[sname].parent = arm_data.edit_bones[parent]
        arm_data.edit_bones[sname].use_connect = False
bpy.ops.object.mode_set(mode="OBJECT")

vg = {s: obj.vertex_groups.new(name=s) for s in SIMPLE}
for vi_old, d in W.items():
    if vi_old not in remap:
        continue
    tot = sum(d.values())
    for s, w in d.items():
        if w / tot > 0.01:
            vg[s].add([remap[vi_old]], w / tot, "REPLACE")
# eyes follow the head rigidly
for i in sel:
    if groups[i] != "body":
        for v in faces[i][0]:
            vg["head"].add([remap[v]], 1.0, "REPLACE")

obj.parent = arm
mod = obj.modifiers.new("Armature", "ARMATURE")
mod.object = arm

# ---------------------------------------------------------------- shape keys
obj.shape_key_add(name="Basis")
for k, d in keys.items():
    sk = obj.shape_key_add(name=k)
    co = (P + d).ravel()
    sk.data.foreach_set("co", co)

# ---------------------------------------------------------------- materials
def mat(name, color, rough):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    bsdf = m.node_tree.nodes["Principled BSDF"]
    bsdf.inputs["Base Color"].default_value = (*color, 1)
    bsdf.inputs["Roughness"].default_value = rough
    return m


M = [
    mat("skin", (0.80, 0.58, 0.47), 0.5),
    mat("face", (0.80, 0.58, 0.47), 0.5),
    mat("shirt", (0.85, 0.85, 0.86), 0.85),
    mat("pants", (0.10, 0.14, 0.24), 0.9),
    mat("shoes", (0.05, 0.05, 0.05), 0.4),
]
for m in M:
    mesh.materials.append(m)

names = list(SIMPLE)
grp_index = {vgp.index: vgp.name for vgp in obj.vertex_groups}


def dominant(poly):
    acc = {}
    for v in poly.vertices:
        for ge in mesh.vertices[v].groups:
            n = grp_index[ge.group]
            acc[n] = acc.get(n, 0) + ge.weight
    return max(acc, key=acc.get) if acc else "hips"


head_bone_z = conv(jh("head"))[2] - foot_z
neck_z = conv(jh("neck01"))[2] - foot_z
head_v = P[[i for i in range(len(P)) if P[i, 2] > head_bone_z - 0.06]]
hx0, hx1 = head_v[:, 0].min(), head_v[:, 0].max()
hz1 = P[:, 2].max()
# face box: chin roughly at neck joint + few cm, top = crown
FZ0, FZ1 = head_bone_z - 0.10, hz1 + 0.005
FX0, FX1 = hx0 - 0.005, hx1 + 0.005
print("face box", FX0, FX1, FZ0, FZ1)
WAIST_Z = (conv(jh("spine04"))[2] - foot_z) + 0.01
NECKLINE_Z = (conv(jh("neck01"))[2] - foot_z) - 0.035

for poly, i in zip(mesh.polygons, sel):
    c = poly.center
    n = poly.normal
    dom = dominant(poly)
    is_eye = groups[i] != "body"
    if is_eye or (dom in ("head", "neck") and c.z > FZ0):
        poly.material_index = 1
        for k in range(poly.loop_total):
            li = poly.loop_start + k
            co = mesh.vertices[mesh.loops[li].vertex_index].co
            # face canvas is two squares side by side:
            #   left half  = front projection (the photo)
            #   right half = back projection (hair / nape / ears), mirrored so it reads as seen from behind
            u = (co.x - FX0) / (FX1 - FX0)
            v = (co.z - FZ0) / (FZ1 - FZ0)
            if n.y > 0.2 and not is_eye:
                uvl.data[li].uv = (0.5 + 0.5 * (1 - u), v)
            else:
                uvl.data[li].uv = (0.5 * u, v)
    elif dom in ("foot.L", "foot.R"):
        poly.material_index = 4
    elif not dom.startswith(("hand", "lowerarm", "upperarm", "head", "neck")):
        # one clean horizontal waist line; pants end just above the ankle
        if c.z > NECKLINE_Z and abs(c.x) < 0.11:
            poly.material_index = 0   # crew neck: neck stays bare
        elif c.z > WAIST_Z:
            poly.material_index = 2
        else:
            poly.material_index = 3 if c.z > 0.11 else 0
    elif dom in ("upperarm.L", "upperarm.R"):
        poly.material_index = 2
    else:
        poly.material_index = 0

# give clothes a little thickness so they don't look painted on
offs = np.zeros(len(P))
cloth_v = {}
for poly in mesh.polygons:
    if poly.material_index in (2, 3, 4):
        amt = {2: 0.006, 3: 0.005, 4: 0.007}[poly.material_index]
        for v in poly.vertices:
            cloth_v[v] = max(cloth_v.get(v, 0), amt)
for poly in mesh.polygons:
    if poly.material_index in (0, 1):
        for v in poly.vertices:
            if v in cloth_v:
                cloth_v[v] *= 0.5
mesh.calc_normals_split() if hasattr(mesh, "calc_normals_split") else None
for kb in obj.data.shape_keys.key_blocks:
    for v, a in cloth_v.items():
        nrm = mesh.vertices[v].normal
        kb.data[v].co = kb.data[v].co + nrm * a
mesh.vertices.foreach_set("co", np.array([kb.co for kb in obj.data.shape_keys.key_blocks["Basis"].data]).ravel())

eye_idx = sorted({remap[v] for i in sel if groups[i] != "body" for v in faces[i][0]})
eye_z = float(P[eye_idx, 2].mean())
eye_x = float(np.abs(P[eye_idx, 0]).mean())
mid = [i for i in range(len(P)) if abs(P[i, 0]) < 0.006 and eye_z - 0.14 < P[i, 2] < eye_z - 0.08]
chin_z = float(P[min(mid, key=lambda i: P[i, 1]), 2]) if mid else eye_z - 0.115
mouth = [i for i in range(len(P)) if abs(P[i, 0]) < 0.006 and eye_z - 0.08 < P[i, 2] < eye_z - 0.04]


def to_gltf(p):
    p = conv(p) - [0, 0, foot_z]
    return [float(p[0]), float(p[2]), float(-p[1])]


def fbu(x):
    return (x - FX0) / (FX1 - FX0)


def fbv(z):  # canvas row fraction, 0 = top (crown)
    return 1 - (z - FZ0) / (FZ1 - FZ0)


meta = {
    "height_m": float(P[:, 2].max()),
    "faceBox": [float(FX0), float(FX1), float(FZ0), float(FZ1)],
    # landmarks in face-canvas fractions (0..1, y from top)
    "face": {"eyeY": fbv(eye_z), "eyeLX": fbu(-eye_x), "eyeRX": fbu(eye_x), "chinY": fbv(chin_z)},
    "bones": {s: {"parent": SIMPLE[s][0], "head": to_gltf(SIMPLE[s][1]), "tail": to_gltf(SIMPLE[s][2])} for s in SIMPLE},
}
print("FACE", meta["face"])
json.dump(meta, open(OUT.replace(".glb", ".json"), "w"), indent=1)

# ---------------------------------------------------------------- export
bpy.ops.object.select_all(action="SELECT")
bpy.ops.export_scene.gltf(
    filepath=OUT,
    export_format="GLB",
    export_skins=True,
    export_morph=True,
    export_morph_normal=True,
    export_apply=False,
    export_yup=True,
    export_animations=False,
    export_materials="EXPORT",
)
print("EXPORTED", OUT, len(P), "verts")

# ---------------------------------------------------------------- preview
if PREVIEW:
    sc = bpy.context.scene
    sc.render.engine = "CYCLES"
    sc.cycles.samples = 48
    sc.cycles.device = "CPU"
    sc.render.resolution_x, sc.render.resolution_y = 640, 900
    cam = bpy.data.objects.new("cam", bpy.data.cameras.new("cam"))
    sc.collection.objects.link(cam)
    cam.location = (0.9, -3.4, 1.1)
    cam.rotation_euler = (math.radians(88), 0, math.radians(15))
    cam.data.lens = 50
    sc.camera = cam
    for loc, e in [((2, -2, 3), 900), ((-3, -1, 2), 400), ((0, 3, 3), 500)]:
        L = bpy.data.objects.new("L", bpy.data.lights.new("L", "AREA"))
        L.data.energy = e
        L.data.size = 2
        L.location = loc
        L.rotation_euler = (Vector((0, 0, 1)) - Vector(loc)).to_track_quat("-Z", "Y").to_euler()
        sc.collection.objects.link(L)
    w = bpy.data.worlds.new("w")
    w.use_nodes = True
    w.node_tree.nodes["Background"].inputs[0].default_value = (0.2, 0.2, 0.22, 1)
    sc.world = w
    sc.render.filepath = PREVIEW
    bpy.ops.render.render(write_still=True)
