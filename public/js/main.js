import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { createWorld, ROOM, CANNON } from './physics.js';
import { Character, OUTFITS } from './character.js';
import { PhotoEditor, loadImageFile, preloadFaceDetector } from './photo.js';
import { ToolController, TOOLS } from './tools.js';
import { woodFloor, wallTexture, splatCanvas } from './textures.js';
import { sfx, unlockAudio, setMuted } from './audio.js';
import { V } from './version.js';

const $ = (s) => document.querySelector(s);
const METAS = {}; // per gender, loaded from model json

// ================================================================ renderer / scene
const canvas = $('#scene');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;

const scene = new THREE.Scene();
scene.background = new THREE.Color('#2a2622');
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
scene.environmentIntensity = 0.55;

const camera = new THREE.PerspectiveCamera(38, 1, 0.05, 50);

// lights
const hemi = new THREE.HemisphereLight('#fff4e6', '#3a2f26', 0.6);
scene.add(hemi);
const key = new THREE.DirectionalLight('#fff1de', 2.4);
key.position.set(1.8, 3.6, 2.6);
key.castShadow = true;
key.shadow.mapSize.set(2048, 2048);
key.shadow.camera.left = -3; key.shadow.camera.right = 3; key.shadow.camera.top = 3.2; key.shadow.camera.bottom = -0.5;
key.shadow.camera.near = 0.5; key.shadow.camera.far = 12;
key.shadow.bias = -0.0004; key.shadow.normalBias = 0.02;
key.shadow.radius = 4;
scene.add(key);
const rim = new THREE.DirectionalLight('#bcd4ff', 1.1);
rim.position.set(-2.5, 2.5, -2);
scene.add(rim);
const fill = new THREE.PointLight('#ffd9b0', 6, 8, 2);
fill.position.set(-1.6, 1.6, 2);
scene.add(fill);

// room
function buildRoom() {
  const g = new THREE.Group();
  const floorMat = new THREE.MeshStandardMaterial({ map: woodFloor(), roughness: 0.55 });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(ROOM.halfW * 2, ROOM.front - ROOM.back + 4), floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.z = (ROOM.front + ROOM.back) / 2 + 2;
  floor.receiveShadow = true;
  const wt = wallTexture();
  const wallMat = new THREE.MeshStandardMaterial({ map: wt, roughness: 0.92 });
  const back = new THREE.Mesh(new THREE.PlaneGeometry(ROOM.halfW * 2, ROOM.height), wallMat);
  back.position.set(0, ROOM.height / 2, ROOM.back);
  back.receiveShadow = true;
  const sideL = new THREE.Mesh(new THREE.PlaneGeometry(ROOM.front - ROOM.back + 4, ROOM.height), wallMat);
  sideL.rotation.y = Math.PI / 2;
  sideL.position.set(-ROOM.halfW, ROOM.height / 2, (ROOM.front + ROOM.back) / 2 + 2);
  sideL.receiveShadow = true;
  const sideR = sideL.clone();
  sideR.rotation.y = -Math.PI / 2; sideR.position.x = ROOM.halfW;
  // skirting boards
  const skirtMat = new THREE.MeshStandardMaterial({ color: '#efe9df', roughness: 0.6 });
  const sk = new THREE.Mesh(new THREE.BoxGeometry(ROOM.halfW * 2, 0.12, 0.02), skirtMat);
  sk.position.set(0, 0.06, ROOM.back + 0.01);
  // a framed "window" glow + poster on the back wall for depth
  const win = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 1.0), new THREE.MeshBasicMaterial({ color: '#dfe9f2' }));
  win.position.set(-1.7, 1.75, ROOM.back + 0.005);
  const frame = new THREE.Mesh(new THREE.BoxGeometry(1.42, 1.12, 0.04), new THREE.MeshStandardMaterial({ color: '#f5f1ea', roughness: 0.5 }));
  frame.position.set(-1.7, 1.75, ROOM.back);
  const mat = new THREE.Mesh(new THREE.CircleGeometry(1.1, 48), new THREE.MeshStandardMaterial({ color: '#3f5f7a', roughness: 0.95 }));
  mat.rotation.x = -Math.PI / 2; mat.position.y = 0.003; mat.receiveShadow = true;
  g.add(floor, back, sideL, sideR, sk, frame, win, mat);
  scene.add(g);
}
buildRoom();

// ================================================================ effects
class FX {
  constructor() {
    this.items = [];
    const sprite = document.createElement('canvas');
    sprite.width = sprite.height = 64;
    const c = sprite.getContext('2d');
    const gr = c.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.4, 'rgba(255,240,200,0.6)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
    c.fillStyle = gr; c.fillRect(0, 0, 64, 64);
    this.tex = new THREE.CanvasTexture(sprite);
    this.zapLight = new THREE.PointLight('#7fb6ff', 0, 3, 2);
    scene.add(this.zapLight);
  }
  burst(p, color = '#fff0c8', n = 14, speed = 2.5, size = 0.06) {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(n * 3), vel = [];
    for (let i = 0; i < n; i++) {
      pos.set([p.x, p.y, p.z], i * 3);
      vel.push(new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.3, Math.random() - 0.5).normalize().multiplyScalar(speed * (0.4 + Math.random())));
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({ map: this.tex, color, size, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
    const pts = new THREE.Points(geo, mat);
    scene.add(pts);
    this.items.push({ obj: pts, vel, life: 0.45, t: 0 });
    // shock ring
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.05, 0.075, 32), new THREE.MeshBasicMaterial({ color: '#fff', transparent: true, depthWrite: false, side: THREE.DoubleSide }));
    ring.position.copy(p);
    ring.lookAt(camera.position);
    scene.add(ring);
    this.items.push({ obj: ring, ring: true, life: 0.25, t: 0 });
  }
  zap(p) {
    this.zapLight.position.copy(p);
    this.zapLight.intensity = 6 + Math.random() * 14;
    this.zapT = 0.08;
    if (Math.random() < 0.5) this.burst(p, '#8ec5ff', 5, 1.5, 0.04);
  }
  update(dt) {
    if (this.zapT > 0) { this.zapT -= dt; if (this.zapT <= 0) this.zapLight.intensity = 0; }
    for (const it of this.items) {
      it.t += dt;
      const k = it.t / it.life;
      if (it.ring) {
        it.obj.scale.setScalar(1 + k * 5);
        it.obj.material.opacity = 1 - k;
      } else {
        const a = it.obj.geometry.attributes.position;
        it.vel.forEach((v, i) => {
          v.y -= 6 * dt;
          a.array[i * 3] += v.x * dt; a.array[i * 3 + 1] += v.y * dt; a.array[i * 3 + 2] += v.z * dt;
        });
        a.needsUpdate = true;
        it.obj.material.opacity = 1 - k;
      }
      if (k >= 1) { scene.remove(it.obj); it.obj.geometry.dispose(); it.obj.material.dispose(); it.dead = true; }
    }
    this.items = this.items.filter((i) => !i.dead);
  }
}

// ================================================================ UI helpers
const ui = {
  show(id) {
    document.querySelectorAll('.screen').forEach((s) => s.classList.toggle('active', s.id === id));
    document.body.dataset.screen = id;
  },
  toast(msg) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(this._tt);
    this._tt = setTimeout(() => t.classList.remove('show'), 1400);
  },
  pop(text, worldPoint, big = false) {
    const v = worldPoint.clone().project(camera);
    const el = document.createElement('div');
    el.className = 'pop' + (big ? ' big' : '');
    el.textContent = text;
    el.style.left = ((v.x + 1) / 2 * innerWidth + (Math.random() - 0.5) * 40) + 'px';
    el.style.top = ((1 - v.y) / 2 * innerHeight - 30) + 'px';
    el.style.setProperty('--rot', ((Math.random() - 0.5) * 24) + 'deg');
    $('#pops').appendChild(el);
    setTimeout(() => el.remove(), 900);
  },
  chargeStart() { $('#charge').classList.add('on'); this.chargeSet(0); },
  chargeSet(k) { $('#charge i').style.width = (k * 100) + '%'; },
  chargeEnd() { $('#charge').classList.remove('on'); },
};

// ================================================================ game state
const game = {
  scene, camera, renderer, ui,
  world: createWorld(),
  fx: new FX(),
  character: null,
  gender: 'male',
  face: null,               // {canvas, skin, hair}
  stress: 100,
  hits: 0, combo: 0, maxCombo: 0, lastHit: 0, startTime: 0, finished: false,
  hitstop: 0, shake: 0,
  camYaw: 0, camDist: 3.3, camTarget: new THREE.Vector3(0, 1.1, 0),
  envDecals: [],
};
game.tools = new ToolController(game);

game.applyHit = function (hit, dir, dv, knock, tool, opt = {}) {
  const rag = this.character.rag;
  if (!rag) return;
  const b = hit.body;
  const isHead = hit.part === 'head' || hit.part === 'neck';
  const mult = isHead ? 1.15 : 1;
  const imp = dir.clone().multiplyScalar(dv * b.mass * 1.6 * mult);
  // cannon-es wants the point relative to the body's centre
  const rel = new CANNON.Vec3(hit.point.x - b.position.x, hit.point.y - b.position.y, hit.point.z - b.position.z);
  b.applyImpulse(new CANNON.Vec3(imp.x, imp.y, imp.z), rel);
  // spread a little into the rest of the body so heavy people still move
  const spread = dv * 0.12;
  for (const p of Object.values(rag.parts)) { p.velocity.x += dir.x * spread; p.velocity.y += dir.y * spread * 0.5; p.velocity.z += dir.z * spread; }
  rag.knock(knock * (isHead ? 1.3 : 1));
  if (!opt.noBruise && isHead && ['punch', 'slap', 'hammer', 'bat', 'kick'].includes(tool.id)) this.character.bruise(hit.point, tool.id === 'slap' ? 1.4 : 1);

  const power = Math.min(1.6, dv / 9);
  const voice = this.gender === 'male' ? 1 : 1.7;
  (sfx[tool.sound] || sfx.punch).call(sfx, power, voice);
  this.hitstop = Math.min(0.12, 0.03 + dv * 0.005);
  this.shake = Math.min(0.09, 0.012 + dv * 0.004);
  this.fx.burst(hit.point, tool.mode === 'throw' ? tool.color : '#fff0c8', tool.mode === 'throw' ? 18 : 14, 1.5 + dv * 0.2);
  if (navigator.vibrate) navigator.vibrate(Math.min(80, 15 + dv * 4));
  const words = tool.words || ['퍽!'];
  this.score(dv, words[(Math.random() * words.length) | 0], hit.point);
};

game.score = function (amount, word, point) {
  const now = performance.now();
  this.combo = now - this.lastHit < 1300 ? this.combo + 1 : 1;
  this.lastHit = now;
  this.maxCombo = Math.max(this.maxCombo, this.combo);
  this.hits++;
  const dmg = amount * 0.55 * (1 + Math.min(this.combo, 30) * 0.06);
  this.stress = Math.max(0, this.stress - dmg);
  updateHud();
  if (word && point) ui.pop(word, point, amount > 10);
  if (this.combo >= 3) {
    const cb = $('#combo');
    cb.textContent = `${this.combo} 콤보!`;
    cb.classList.remove('bump'); void cb.offsetWidth; cb.classList.add('bump');
    if (this.combo % 5 === 0) {
      sfx.combo(this.combo / 5);
      const msg = { 5: '좋아!', 10: '대박!', 15: '속이 뻥!', 20: '미쳤다!', 30: '전설의 손맛' }[this.combo];
      if (msg) ui.toast(msg);
    }
  }
  if (this.stress <= 0 && !this.finished) {
    this.finished = true;
    setTimeout(showResult, 900);
  }
};

game.envSplat = function (p, n, color) {
  const tex = new THREE.CanvasTexture(splatCanvas(color, 128));
  tex.colorSpace = THREE.SRGBColorSpace;
  const m = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.3),
    new THREE.MeshStandardMaterial({ map: tex, transparent: true, roughness: 0.2, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4 }));
  m.position.copy(p).addScaledVector(n, 0.005);
  m.lookAt(p.clone().add(n));
  scene.add(m);
  this.envDecals.push(m);
  if (this.envDecals.length > 30) { const o = this.envDecals.shift(); scene.remove(o); }
};

function updateHud() {
  $('#stress i').style.width = game.stress + '%';
  $('#stress b').textContent = Math.ceil(game.stress) + '%';
  $('#hits').textContent = game.hits;
}

function showResult() {
  sfx.win();
  const secs = Math.round((performance.now() - game.startTime) / 1000);
  $('#r-hits').textContent = game.hits;
  $('#r-combo').textContent = game.maxCombo;
  $('#r-time').textContent = secs >= 60 ? `${Math.floor(secs / 60)}분 ${secs % 60}초` : `${secs}초`;
  $('#result').classList.add('show');
}

// ================================================================ flow: photo
let editor = null;
async function loadMeta(g) {
  if (!METAS[g]) METAS[g] = await (await fetch(`models/${g}.json?v=${V}`)).json();
  return METAS[g];
}

async function initPhoto() {
  editor = new PhotoEditor($('#crop'), await loadMeta(game.gender));
  const st = $('#fit-status');
  editor.onstatus = (s) => {
    const msg = {
      detecting: ['⏳ 얼굴 찾는 중…', ''],
      auto: ['✅ 얼굴을 자동으로 맞췄어요', 'ok'],
      noface: ['얼굴을 자동으로 못 찾았어요. 노란 핀 4개를 눈·입·턱 위로 끌어 주세요.', 'warn'],
      nodetector: ['자동 인식을 쓸 수 없어요. 노란 핀 4개를 눈·입·턱 위로 끌어 주세요.', 'warn'],
      pins: ['노란 핀 4개를 사진 속 눈·입·턱에 맞춰 주세요. 얼굴형은 자동으로 맞춰져요.', ''],
    }[s];
    st.textContent = msg[0];
    st.className = 'fit-status ' + msg[1];
    $('#auto-fit').hidden = !(editor.mode === 'pins' && editor.detected);
    $('#pin-fit').hidden = editor.mode !== 'auto';
    // if matching finished after the character was built, refresh its face
    if (s === 'auto' && game.character && game.mode !== 'photo') refreshFace();
  };
  $('#auto-fit').onclick = () => editor.enableAuto();
  $('#pin-fit').onclick = () => editor.startPins('pins');
  const pick = async (file) => {
    if (!file) return;
    try {
      const img = await loadImageFile(file);
      editor.setImage(img);
      $('#photo-step').classList.add('has-photo');
    } catch (e) {
      ui.toast('사진을 열 수 없어요. 다른 사진을 골라 주세요.');
    }
  };
  $('#file').addEventListener('change', (e) => pick(e.target.files[0]));
  $('#cam').addEventListener('change', (e) => pick(e.target.files[0]));
  $('#file2').addEventListener('change', (e) => pick(e.target.files[0]));
  $('#zoom-in').onclick = () => editor.zoom(1.06);
  $('#zoom-out').onclick = () => editor.zoom(1 / 1.06);
  $('#rot-l').onclick = () => editor.rotate(-0.03);
  $('#rot-r').onclick = () => editor.rotate(0.03);
  let warnedManual = false;
  $('#photo-next').onclick = async () => {
    // never put an unaligned photo on the 3D face: wait for face matching first
    if (editor.detecting) {
      $('#loading-text').textContent = '얼굴 인식 준비 중… (처음 한 번은 오래 걸릴 수 있어요)';
      $('#loading-cancel').hidden = false;
      $('#loading').classList.add('show');
      const cancelled = await Promise.race([
        editor.detecting.then(() => false),
        new Promise((r) => { $('#loading-cancel').onclick = () => r(true); }),
      ]);
      $('#loading').classList.remove('show');
      $('#loading-cancel').hidden = true;
      if (cancelled) { editor.startPins('pins'); warnedManual = true; ui.toast('노란 핀 4개를 눈·입·턱에 맞춘 뒤 다음을 눌러 주세요'); return; }
    }
    if (editor.img && editor.mode !== 'auto' && !warnedManual) {
      warnedManual = true;
      ui.toast('핀 4개를 눈·입·턱에 맞췄으면 다음을 한 번 더 눌러 주세요');
      return;
    }
    warnedManual = false;
    toCustomize(false);
  };
  $('#photo-skip').onclick = () => { editor.img = null; toCustomize(true); };
}

// ================================================================ flow: customize
function refreshFace() {
  const face = editor.compose(1024, game.hairOverride);
  game.face = face;
  game.character.setSkinColor(face.skin);
  game.character.setFace(face.canvas);
  game.character.fitFaceShape(editor.fitLandmarks());
}

async function rebuildCharacter() {
  const old = game.character;
  const face = editor.compose(1024, game.hairOverride);
  game.face = face;
  $('#loading-text').textContent = '3D 몸 만드는 중…';
  $('#loading').classList.add('show');
  const c = await Character.create(scene, { gender: game.gender, faceCanvas: face.canvas, skinColor: face.skin });
  $('#loading').classList.remove('show');
  if (old) {
    c.applyBody({ ...old.body, heightCm: old.gender === game.gender ? old.body.heightCm : c.body.heightCm, weightKg: old.gender === game.gender ? old.body.weightKg : c.body.weightKg });
    c.setOutfit(old.outfit);
    old.dispose();
  }
  game.character = c;
  c.fitFaceShape(editor.fitLandmarks());
  syncSliders();
}

function syncSliders() {
  const b = game.character.body;
  $('#s-height').value = b.heightCm; $('#v-height').textContent = b.heightCm + 'cm';
  $('#s-weight').value = b.weightKg; $('#v-weight').textContent = b.weightKg + 'kg';
  $('#s-muscle').value = Math.round(b.muscle * 100); $('#v-muscle').textContent = Math.round(b.muscle * 100) + '%';
  $('#s-head').value = Math.round(b.headScale * 100); $('#v-head').textContent = Math.round(b.headScale * 100) + '%';
  $('#v-bmi').textContent = `BMI ${game.character.bmi.toFixed(1)} · ${bmiLabel(game.character.bmi)}`;
  document.querySelectorAll('#gender button').forEach((x) => x.classList.toggle('on', x.dataset.g === game.gender));
  document.querySelectorAll('#hair button').forEach((x) => x.classList.toggle('on', x.dataset.id === (game.hairId || 'auto')));
  document.querySelectorAll('#outfits button').forEach((x) => x.classList.toggle('on', x.dataset.id === game.character.outfit.id));
}
const HAIR = [
  ['auto', '사진에서', 'conic-gradient(#222,#7a5230,#d9b26a,#222)'],
  ['black', '검정', '#151312'], ['brown', '갈색', '#4a2e1c'], ['blonde', '금발', '#c9a25e'],
  ['gray', '회색', '#9a9a9a'], ['bald', '대머리', 'var(--skin, #e0ac8e)'],
];
const bmiLabel = (b) => (b < 18.5 ? '마름' : b < 23 ? '보통' : b < 25 ? '통통' : b < 30 ? '뚱뚱' : '고도비만');

async function toCustomize(skipped) {
  ui.show('screen-custom');
  if (skipped) editor.img = null;
  game.mode = 'custom';
  await rebuildCharacter();
}

function initCustomize() {
  const bind = (id, fn) => $(id).addEventListener('input', (e) => { fn(+e.target.value); syncSliders(); });
  bind('#s-height', (v) => game.character.applyBody({ heightCm: v }));
  bind('#s-weight', (v) => game.character.applyBody({ weightKg: v }));
  bind('#s-muscle', (v) => game.character.applyBody({ muscle: v / 100 }));
  bind('#s-head', (v) => game.character.applyBody({ headScale: v / 100 }));
  document.querySelectorAll('#gender button').forEach((btn) => btn.addEventListener('click', async () => {
    if (game.gender === btn.dataset.g) return;
    game.gender = btn.dataset.g;
    editor.setMeta(await loadMeta(game.gender));
    await rebuildCharacter();
  }));
  const oc = $('#outfits');
  for (const o of OUTFITS) {
    const b = document.createElement('button');
    b.dataset.id = o.id;
    b.innerHTML = `<span class="sw" style="background:linear-gradient(${o.shirt} 50%, ${o.pants} 50%)"></span>${o.name}`;
    b.onclick = () => { game.character.setOutfit(o); syncSliders(); };
    oc.appendChild(b);
  }
  const hc = $('#hair');
  for (const [id, label, color] of HAIR) {
    const b = document.createElement('button');
    b.dataset.id = id;
    b.title = label;
    b.innerHTML = `<span class="dot" style="background:${color}"></span>${label}`;
    b.onclick = () => {
      game.hairOverride = id === 'auto' ? null : id === 'bald' ? 'bald' : color;
      game.hairId = id;
      const face = editor.compose(1024, game.hairOverride);
      game.face = face;
      game.character.setFace(face.canvas);
      syncSliders();
    };
    hc.appendChild(b);
  }
  $('#custom-back').onclick = () => { game.mode = 'photo'; ui.show('screen-photo'); };
  $('#custom-go').onclick = startPlay;
}

// ================================================================ flow: play
function startPlay() {
  unlockAudio();
  ui.show('screen-play');
  game.mode = 'play';
  game.character.startRagdoll(game.world);
  game.stress = 100; game.hits = 0; game.combo = 0; game.maxCombo = 0; game.finished = false;
  game.startTime = performance.now();
  game.camYaw = 0;
  updateHud();
  ui.toast('마음껏 패세요!');
}

function initPlay() {
  const bar = $('#toolbar');
  for (const t of TOOLS) {
    const b = document.createElement('button');
    b.dataset.id = t.id;
    b.innerHTML = `<span>${t.icon}</span><small>${t.name}</small>`;
    b.onclick = () => {
      game.tools.select(t.id);
      bar.querySelectorAll('button').forEach((x) => x.classList.toggle('on', x === b));
      if (t.hint) ui.toast(t.hint);
    };
    bar.appendChild(b);
  }
  bar.firstChild.classList.add('on');

  const ndc = (e) => {
    const r = canvas.getBoundingClientRect();
    return new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
  };
  canvas.addEventListener('pointerdown', (e) => {
    if (game.mode !== 'play') return;
    unlockAudio();
    canvas.setPointerCapture(e.pointerId);
    game.tools.down(ndc(e));
  });
  canvas.addEventListener('pointermove', (e) => { if (game.mode === 'play') game.tools.move(ndc(e)); });
  canvas.addEventListener('pointerup', (e) => { if (game.mode === 'play') game.tools.up(ndc(e)); });
  canvas.addEventListener('pointercancel', () => game.tools.cancel());
  canvas.addEventListener('wheel', (e) => { game.camDist = THREE.MathUtils.clamp(game.camDist * Math.exp(e.deltaY * 0.001), 1.6, 5.5); }, { passive: true });

  $('#cam-l').onclick = () => { game.camYaw -= 0.5; };
  $('#cam-r').onclick = () => { game.camYaw += 0.5; };
  $('#btn-reset').onclick = () => { game.character.rag.reset(); };
  $('#btn-clean').onclick = () => {
    const face = editor.compose(1024, game.hairOverride);
    game.character.clearMess(() => game.character.setFace(face.canvas));
    game.envDecals.forEach((d) => scene.remove(d)); game.envDecals = [];
    ui.toast('깨끗하게 닦았어요');
  };
  $('#btn-body').onclick = () => {
    game.tools.cancel();
    game.character.stopRagdoll();
    game.mode = 'custom';
    ui.show('screen-custom');
  };
  let muted = false;
  $('#btn-sound').onclick = () => { muted = !muted; setMuted(muted); $('#btn-sound').textContent = muted ? '🔇' : '🔊'; };
  $('#r-again').onclick = () => {
    $('#result').classList.remove('show');
    game.stress = 100; game.finished = false; updateHud();
  };
  $('#r-new').onclick = () => {
    $('#result').classList.remove('show');
    game.tools.cancel();
    game.character.stopRagdoll();
    game.mode = 'photo';
    ui.show('screen-photo');
  };
}

// ================================================================ loop
function resize() {
  const w = innerWidth, h = innerHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  // keep the whole body in frame on tall phone screens
  camera.fov = w / h < 0.8 ? 52 : 38;
  camera.updateProjectionMatrix();
}
addEventListener('resize', resize);
resize();

const clock = new THREE.Clock();
let turntable = 0;
function frame() {
  requestAnimationFrame(frame);
  const dt = Math.min(clock.getDelta(), 1 / 20);
  const ch = game.character;

  if (game.mode === 'play' && ch && ch.rag) {
    if (game.hitstop > 0) game.hitstop -= dt;
    else {
      game.world.step(1 / 120, dt, 6);
      ch.rag.update(dt);
    }
    game.tools.update(dt);
    ch.syncFromPhysics();
    const c = ch.rag.parts.chest.position;
    game.camTarget.lerp(new THREE.Vector3(c.x * 0.85, Math.max(0.5, c.y * 0.85), c.z * 0.6), 1 - Math.exp(-dt * 3));
    if (performance.now() - game.lastHit > 1300 && game.combo) { game.combo = 0; $('#combo').textContent = ''; }
  } else if (ch) {
    // showroom: slowly turn the camera around the model
    turntable += dt * 0.25;
    const h = ch.body.heightCm / 100;
    game.camTarget.set(0, h * 0.55, 0);
  }

  if (game.camLock) game.camTarget.copy(game.camLock); // debug / photo checks
  // camera
  const portrait = innerWidth / innerHeight < 0.8;
  const h = ch ? ch.body.heightCm / 100 : 1.7;
  const dist = game.mode === 'custom' ? Math.max(2.6, h * 1.9) * (portrait ? 1.75 : 1) : game.camDist * Math.max(1, h / 1.75);
  const yaw = game.mode === 'custom' ? Math.sin(turntable) * 0.6 : game.camYaw;
  camera.position.set(game.camTarget.x + Math.sin(yaw) * dist, game.camTarget.y + 0.25, game.camTarget.z + Math.cos(yaw) * dist);
  camera.position.z = Math.min(camera.position.z, ROOM.front + 1.8);
  camera.lookAt(game.camTarget);
  if (game.mode === 'custom') {
    // keep the model clear of the settings panel: left of it on wide screens, above it on phones
    if (portrait) camera.setViewOffset(innerWidth, innerHeight, 0, innerHeight * 0.26, innerWidth, innerHeight);
    else camera.setViewOffset(innerWidth, innerHeight, innerWidth * 0.17, 0, innerWidth, innerHeight);
  } else camera.clearViewOffset();
  if (game.shake > 0) {
    camera.position.x += (Math.random() - 0.5) * game.shake;
    camera.position.y += (Math.random() - 0.5) * game.shake;
    game.shake = Math.max(0, game.shake - dt * 0.4);
  }
  game.fx.update(dt);
  renderer.render(scene, camera);
}

// ================================================================ boot
$('#start').onclick = () => { unlockAudio(); ui.show('screen-photo'); game.mode = 'photo'; preloadFaceDetector(); };
await initPhoto();
initCustomize();
initPlay();
ui.show('screen-title');
document.body.classList.add('ready');
frame();
// warm the model cache while the player picks a photo
import('./character.js');
fetch(`models/male.glb?v=${V}`); fetch(`models/female.glb?v=${V}`);
window.__game = game; // debugging / automated checks
window.__editor = editor;
