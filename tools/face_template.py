"""
Finds the 478 MediaPipe face landmarks on the rendered head template and stores
them (as face-texture fractions) plus a triangulation in public/models/<g>.json.

  python3 tools/face_template.py <template.png> public/models/<g>.json <face_landmarker.task> [debug.png]
"""
import sys, json
import numpy as np
import mediapipe as mp
from mediapipe.tasks.python import vision, BaseOptions
from scipy.spatial import Delaunay
from PIL import Image, ImageDraw

img_path, meta_path, model = sys.argv[1:4]
dbg = sys.argv[4] if len(sys.argv) > 4 else None
det = vision.FaceLandmarker.create_from_options(vision.FaceLandmarkerOptions(
    base_options=BaseOptions(model_asset_path=model), num_faces=1))
im = Image.open(img_path).convert("RGB")
res = det.detect(mp.Image(image_format=mp.ImageFormat.SRGB, data=np.asarray(im)))
if not res.face_landmarks:
    sys.exit("no face found in template")
pts = np.array([[p.x, p.y] for p in res.face_landmarks[0]])  # normalised 0..1 = face box fractions
tri = Delaunay(pts).simplices
meta = json.load(open(meta_path))
meta["mesh"] = {"pts": np.round(pts, 5).tolist(), "tri": tri.tolist()}
# better landmarks for the manual editor too
L, R = pts[[33, 133]].mean(0), pts[[362, 263]].mean(0)
meta["face"].update({"eyeY": float((L[1] + R[1]) / 2), "eyeLX": float(min(L[0], R[0])), "eyeRX": float(max(L[0], R[0])), "chinY": float(pts[152][1])})
json.dump(meta, open(meta_path, "w"))
print("landmarks", len(pts), "triangles", len(tri), meta["face"])
if dbg:
    d = ImageDraw.Draw(im)
    W, H = im.size
    for t in tri:
        d.polygon([tuple(pts[i] * [W, H]) for i in t], outline=(0, 160, 255))
    im.save(dbg)
