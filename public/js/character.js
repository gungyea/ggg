// The 3D person: model loading, materials, body sliders, face texture and ragdoll sync.
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { skinNormal, fabricNormal, splatCanvas } from './textures.js';
import { RagdollPhysics } from './physics.js';

const loader = new GLTFLoader();
const cache = {};
const sanitize = (n) => THREE.PropertyBinding.sanitizeNodeName(n);

export const OUTFITS = [
  { id: 'tee', name: '흰 티 + 청바지', shirt: '#e9e9ea', pants: '#2b3d63', shoes: '#f2f2f2', denim: true },
  { id: 'black', name: '올블랙', shirt: '#1d1d20', pants: '#18181b', shoes: '#111', denim: false },
  { id: 'office', name: '셔츠 + 슬랙스', shirt: '#cfdcef', pants: '#2a2a30', shoes: '#2a1a12', denim: false },
  { id: 'gym', name: '운동복', shirt: '#6b7380', pants: '#3a3f48', shoes: '#e94d3c', denim: false },
  { id: 'orange', name: '주황 죄수복', shirt: '#e8731f', pants: '#e0701c', shoes: '#ddd', denim: false },
  { id: 'pink', name: '분홍 잠옷', shirt: '#f2b5c8', pants: '#efa9bf', shoes: '#fff', denim: false },
];

async function loadModel(gender) {
  if (!cache[gender]) {
    cache[gender] = Promise.all([
      loader.loadAsync(`models/${gender}.glb`),
      fetch(`models/${gender}.json`).then((r) => r.json()),
    ]);
  }
  const [gltf, meta] = await cache[gender];
  return { gltf, meta };
}

export class Character {
  static async create(scene, opts) {
    const c = new Character();
    await c.init(scene, opts);
    return c;
  }

  async init(scene, { gender, faceCanvas, skinColor }) {
    this.scene = scene;
    this.gender = gender;
    const { gltf, meta } = await loadModel(gender);
    this.meta = meta;
    // fresh copy of the scene graph (the cache keeps the original)
    const { clone } = await import('three/addons/utils/SkeletonUtils.js');
    this.root = clone(gltf.scene);
    scene.add(this.root);
    this.root.updateMatrixWorld(true);

    this.mesh = null;
    this.root.traverse((o) => {
      if (o.isSkinnedMesh) {
        if (!this.mesh) this.mesh = o;
        o.castShadow = true; o.receiveShadow = true;
        o.frustumCulled = false;
      }
    });
    this.meshes = [];
    this.root.traverse((o) => { if (o.isSkinnedMesh) this.meshes.push(o); });

    // bones: remember bind pose (world), then flatten so we can drive world transforms directly
    this.bones = {};
    this.bind = {};
    this.boneRoot = new THREE.Group();
    scene.add(this.boneRoot);
    for (const name of Object.keys(meta.bones)) {
      const b = this.root.getObjectByName(sanitize(name));
      this.bones[name] = b;
      const p = new THREE.Vector3(), q = new THREE.Quaternion(), s = new THREE.Vector3();
      b.matrixWorld.decompose(p, q, s);
      this.bind[name] = { p, q, m: b.matrixWorld.clone() };
    }
    for (const name of Object.keys(meta.bones)) this.boneRoot.attach(this.bones[name]);

    // ----- materials
    const skinN = skinNormal();
    this.faceCanvas = faceCanvas;
    this.faceTex = new THREE.CanvasTexture(faceCanvas);
    this.faceTex.colorSpace = THREE.SRGBColorSpace;
    this.faceTex.flipY = false;
    this.faceTex.anisotropy = 8;
    const skinParams = {
      roughness: 0.55, normalMap: skinN, normalScale: new THREE.Vector2(0.25, 0.25),
      sheen: 0.15, sheenRoughness: 0.7, sheenColor: new THREE.Color('#ff9f8a'),
      clearcoat: 0.04, clearcoatRoughness: 0.6,
    };
    this.mats = {
      skin: new THREE.MeshPhysicalMaterial({ ...skinParams, color: new THREE.Color(skinColor) }),
      face: new THREE.MeshPhysicalMaterial({ ...skinParams, map: this.faceTex, normalScale: new THREE.Vector2(0.12, 0.12) }),
      shirt: new THREE.MeshPhysicalMaterial({ roughness: 0.92, normalMap: fabricNormal('knit'), normalScale: new THREE.Vector2(0.6, 0.6), sheen: 0.6, sheenRoughness: 0.8 }),
      pants: new THREE.MeshPhysicalMaterial({ roughness: 0.9, normalMap: fabricNormal('denim'), normalScale: new THREE.Vector2(0.7, 0.7), sheen: 0.4, sheenRoughness: 0.8 }),
      shoes: new THREE.MeshPhysicalMaterial({ roughness: 0.45, clearcoat: 0.3 }),
    };
    for (const m of this.meshes) {
      const n = m.material.name;
      if (this.mats[n]) m.material = this.mats[n];
    }
    this.morphMeshes = this.meshes.filter((m) => m.morphTargetDictionary);

    this.body = { heightCm: gender === 'male' ? 175 : 162, weightKg: gender === 'male' ? 72 : 55, muscle: 0.3, headScale: 1 };
    this.applyBody(this.body);
    this.setOutfit(OUTFITS[0]);
    this.decals = [];
  }

  setSkinColor(c) { this.mats.skin.color.set(c); }

  setOutfit(o) {
    this.outfit = o;
    this.mats.shirt.color.set(o.shirt);
    this.mats.shirt.sheenColor = new THREE.Color(o.shirt);
    this.mats.pants.color.set(o.pants);
    this.mats.pants.sheenColor = new THREE.Color(o.pants);
    this.mats.pants.normalMap = fabricNormal(o.denim ? 'denim' : 'knit');
    this.mats.pants.needsUpdate = true;
    this.mats.shoes.color.set(o.shoes);
  }

  // height/weight/muscle/head-size sliders
  applyBody(b) {
    this.body = { ...this.body, ...b };
    const { heightCm, weightKg, muscle, headScale } = this.body;
    const h = heightCm / 100;
    this.scale = h / this.meta.height_m;
    const bmi = weightKg / (h * h);
    this.bmi = bmi;
    const fat = THREE.MathUtils.clamp((bmi - 23) / 13, 0, 1);
    const thin = THREE.MathUtils.clamp((21 - bmi) / 5, 0, 1);
    for (const m of this.morphMeshes) {
      const d = m.morphTargetDictionary;
      m.morphTargetInfluences[d.fat] = fat;
      m.morphTargetInfluences[d.thin] = thin;
      m.morphTargetInfluences[d.muscle] = muscle * (1 - fat * 0.5);
    }
    // physics width factor follows the visible girth
    this.width = THREE.MathUtils.clamp(1 + fat * 0.55 - thin * 0.18 + muscle * 0.08, 0.8, 1.7);
    this.headScale = headScale;
    if (!this.rag) this.poseRest();
  }

  poseRest(offset = new THREE.Vector3()) {
    const s = this.scale;
    for (const [name, bone] of Object.entries(this.bones)) {
      const bd = this.bind[name];
      bone.position.copy(bd.p).multiplyScalar(s).add(offset);
      bone.quaternion.copy(bd.q);
      bone.scale.setScalar(name === 'head' ? s * this.headScale : s);
    }
    this.boneRoot.updateMatrixWorld(true);
  }

  // ---------------------------------------------------------- ragdoll
  startRagdoll(world) {
    this.stopRagdoll();
    const rag = new RagdollPhysics(world, this.meta, {
      scale: this.scale, width: this.width, massKg: this.body.weightKg, headScale: this.headScale,
    });
    this.rag = rag;
    this.poseRest(new THREE.Vector3(0, rag.lift, 0));
    // bone pose relative to its physics body
    this.rel = {};
    for (const [name, bone] of Object.entries(this.bones)) {
      const body = rag.parts[name];
      const bq = new THREE.Quaternion(body.quaternion.x, body.quaternion.y, body.quaternion.z, body.quaternion.w);
      const bp = new THREE.Vector3(body.position.x, body.position.y, body.position.z);
      const inv = bq.clone().invert();
      this.rel[name] = {
        p: bone.position.clone().sub(bp).applyQuaternion(inv),
        q: inv.multiply(bone.quaternion.clone()),
      };
    }
    return rag;
  }

  stopRagdoll() {
    if (this.rag) { this.rag.destroy(); this.rag = null; }
    this.poseRest();
  }

  syncFromPhysics() {
    if (!this.rag) return;
    const tq = new THREE.Quaternion(), tp = new THREE.Vector3();
    for (const [name, bone] of Object.entries(this.bones)) {
      const b = this.rag.parts[name], r = this.rel[name];
      tq.set(b.quaternion.x, b.quaternion.y, b.quaternion.z, b.quaternion.w);
      tp.set(b.position.x, b.position.y, b.position.z);
      bone.quaternion.copy(tq).multiply(r.q);
      bone.position.copy(r.p).applyQuaternion(tq).add(tp);
    }
    this.boneRoot.updateMatrixWorld(true);
  }

  // world point on the head -> face canvas pixel (or null if not on the face)
  faceUV(worldPoint) {
    const head = this.bones.head;
    const local = head.worldToLocal(worldPoint.clone());
    const model = local.applyMatrix4(this.bind.head.m);
    const [x0, x1, z0, z1] = this.meta.faceBox;
    if (model.z < 0.0) return null; // back of the head
    const u = (model.x - x0) / (x1 - x0), v = 1 - (model.y - z0) / (z1 - z0);
    if (u < 0 || u > 1 || v < 0 || v > 1) return null;
    return { x: u * this.faceCanvas.width / 2, y: v * this.faceCanvas.height }; // left half = front
  }

  // replace the whole face texture (new photo / hair colour)
  setFace(canvas) {
    this.paintFace((ctx, c) => { ctx.clearRect(0, 0, c.width, c.height); ctx.drawImage(canvas, 0, 0); });
  }

  paintFace(fn) {
    const ctx = this.faceCanvas.getContext('2d');
    ctx.save(); fn(ctx, this.faceCanvas); ctx.restore();
    this.faceTex.needsUpdate = true;
  }

  // redness where slapped/punched
  bruise(worldPoint, amount = 1) {
    const uv = this.faceUV(worldPoint);
    if (!uv) return;
    const [x0, x1, z0, z1] = this.meta.faceBox;
    const aspect = (x1 - x0) / (z1 - z0); // canvas pixels are not square in metres
    this.paintFace((ctx, c) => {
      const r = c.width * 0.13;
      ctx.translate(uv.x, uv.y);
      ctx.scale(1, aspect);
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
      g.addColorStop(0, `rgba(200,35,35,${0.1 * amount})`);
      g.addColorStop(1, 'rgba(200,35,35,0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
    });
  }

  splat(worldPoint, normal, color, partName, size = 0.16) {
    if (partName === 'head') {
      const uv = this.faceUV(worldPoint);
      if (uv) {
        const st = splatCanvas(color);
        const [x0, x1, z0, z1] = this.meta.faceBox;
        const aspect = (x1 - x0) / (z1 - z0);
        this.paintFace((ctx, c) => {
          const w = c.width * size * 3.2;
          ctx.globalAlpha = 0.95;
          ctx.translate(uv.x, uv.y);
          ctx.rotate(Math.random() * 6.28);
          ctx.drawImage(st, -w / 2, -w * aspect / 2, w, w * aspect);
        });
        return;
      }
    }
    const bone = this.bones[partName];
    if (!bone || this.decals.length > 40) return;
    const tex = new THREE.CanvasTexture(splatCanvas(color, 128));
    tex.colorSpace = THREE.SRGBColorSpace;
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(size, size),
      new THREE.MeshStandardMaterial({ map: tex, transparent: true, roughness: 0.25, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4 }),
    );
    m.position.copy(worldPoint).addScaledVector(normal, 0.01);
    m.lookAt(worldPoint.clone().add(normal));
    m.rotateZ(Math.random() * 6.28);
    bone.attach(m);
    this.decals.push(m);
  }

  clearMess(cleanFace) {
    for (const d of this.decals) { d.parent.remove(d); d.material.map.dispose(); d.material.dispose(); d.geometry.dispose(); }
    this.decals = [];
    if (cleanFace) cleanFace();
  }

  dispose() {
    this.stopRagdoll();
    this.clearMess();
    this.scene.remove(this.root);
    this.scene.remove(this.boneRoot);
  }
}
