// Weapons / interactions and their 3D props.
import * as THREE from 'three';
import { CANNON, G_BODY, G_ENV, G_PROJ } from './physics.js';
import { sfx } from './audio.js';

export const TOOLS = [
  { id: 'punch', icon: '🥊', name: '펀치', mode: 'tap', dv: 6.5, knock: 0.22, sound: 'punch', words: ['퍽!', '빡!', '퍼억!'] },
  { id: 'slap', icon: '🖐️', name: '싸대기', mode: 'tap', dv: 7.5, knock: 0.18, sound: 'slap', words: ['짝!', '철썩!', '짜악!'] },
  { id: 'kick', icon: '🦶', name: '발차기', mode: 'charge', dv: 5, dvMax: 17, knock: 0.3, sound: 'punch', words: ['뻥!', '퍽!!'], hint: '꾹 눌렀다 떼면 강하게' },
  { id: 'grab', icon: '✊', name: '잡아 던지기', mode: 'drag', hint: '잡고 끌어서 던지세요' },
  { id: 'hammer', icon: '🔨', name: '고무망치', mode: 'tap', dv: 9, knock: 0.6, sound: 'bonk', words: ['쾅!', '띵!'] },
  { id: 'bat', icon: '🏏', name: '방망이', mode: 'tap', dv: 15, knock: 1.1, sound: 'bat', words: ['딱!', '홈런!', '빠악!'] },
  { id: 'tomato', icon: '🍅', name: '토마토', mode: 'throw', color: '#c4161c', r: 0.045, sound: 'splat', words: ['철퍽!'] },
  { id: 'pie', icon: '🥧', name: '크림 파이', mode: 'throw', color: '#fbf6ea', r: 0.09, sound: 'splat', words: ['푸욱!', '철퍽!'] },
  { id: 'egg', icon: '🥚', name: '날계란', mode: 'throw', color: '#f6c228', r: 0.035, sound: 'splat', words: ['퍽!', '찌익!'] },
  { id: 'shock', icon: '⚡', name: '전기 충격', mode: 'hold', sound: 'zap', words: ['지지직!', '찌릿!'], hint: '누르고 있으면 계속' },
];

// ------------------------------------------------------------ props
const M = (c, r = 0.5, extra = {}) => new THREE.MeshStandardMaterial({ color: c, roughness: r, ...extra });

function makeGlove() {
  const g = new THREE.Group();
  const leather = M('#b3121a', 0.35, { metalness: 0.05 });
  const fist = new THREE.Mesh(new THREE.SphereGeometry(0.075, 24, 16), leather);
  fist.scale.set(1, 0.85, 1.25);
  const thumb = new THREE.Mesh(new THREE.SphereGeometry(0.03, 16, 12), leather);
  thumb.position.set(0.06, -0.01, 0.0);
  const cuff = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.06, 0.09, 20), M('#f2f2f2', 0.6));
  cuff.rotation.x = Math.PI / 2; cuff.position.z = 0.11;
  g.add(fist, thumb, cuff);
  return g;
}
function makeHand() {
  const g = new THREE.Group();
  const skin = M('#e0ac8e', 0.55);
  const palm = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.1, 0.025), skin);
  g.add(palm);
  for (let i = 0; i < 4; i++) {
    const f = new THREE.Mesh(new THREE.CapsuleGeometry(0.01, 0.06, 4, 8), skin);
    f.position.set(-0.033 + i * 0.022, 0.085, 0);
    g.add(f);
  }
  const th = new THREE.Mesh(new THREE.CapsuleGeometry(0.011, 0.045, 4, 8), skin);
  th.position.set(0.06, 0.01, 0); th.rotation.z = -0.9;
  g.add(th);
  return g;
}
function makeShoe() {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.05, 0.16, 6, 12), M('#222', 0.6));
  body.rotation.x = Math.PI / 2; body.scale.set(1, 1, 0.75);
  const sole = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.02, 0.27), M('#eee', 0.7));
  sole.position.y = -0.04;
  g.add(body, sole);
  return g;
}
function makeHammer() {
  const g = new THREE.Group();
  const head = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.2, 24), M('#1d1f24', 0.7));
  head.rotation.z = Math.PI / 2;
  const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.018, 0.45, 12), M('#b88a55', 0.6));
  handle.position.y = -0.22;
  g.add(head, handle);
  return g;
}
function makeBat() {
  const pts = [];
  for (let i = 0; i <= 20; i++) {
    const t = i / 20;
    pts.push(new THREE.Vector2(0.013 + Math.pow(t, 2.2) * 0.022 + (t > 0.97 ? -0.01 : 0), t * 0.85));
  }
  const bat = new THREE.Mesh(new THREE.LatheGeometry(pts, 24), M('#c89a5f', 0.35));
  bat.rotation.z = -Math.PI / 2;
  bat.position.x = -0.65;
  const g = new THREE.Group(); g.add(bat);
  return g;
}
function makeStunGun() {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.04, 0.16), M('#22252b', 0.4));
  const tip1 = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.03), M('#ccc', 0.2, { metalness: 1 }));
  tip1.rotation.x = Math.PI / 2; tip1.position.set(0.012, 0, -0.09);
  const tip2 = tip1.clone(); tip2.position.x = -0.012;
  g.add(body, tip1, tip2);
  return g;
}
function makeThrowable(t) {
  if (t.id === 'pie') {
    const g = new THREE.Group();
    const tin = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.07, 0.03, 24), M('#c8ccd2', 0.3, { metalness: 0.8 }));
    const cream = new THREE.Mesh(new THREE.SphereGeometry(0.085, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), M('#fffaf0', 0.4));
    cream.position.y = 0.012; cream.scale.y = 0.5;
    g.add(tin, cream);
    return g;
  }
  if (t.id === 'egg') {
    const m = new THREE.Mesh(new THREE.SphereGeometry(t.r, 16, 12), M('#f3ead8', 0.35));
    m.scale.y = 1.3;
    return m;
  }
  const g = new THREE.Group();
  g.add(new THREE.Mesh(new THREE.SphereGeometry(t.r, 20, 14), M('#c4161c', 0.25)));
  const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.02, 0.015, 6), M('#2f7a2a', 0.6));
  leaf.position.y = t.r; g.add(leaf);
  return g;
}

const PROPS = { punch: makeGlove, slap: makeHand, kick: makeShoe, hammer: makeHammer, bat: makeBat, shock: makeStunGun };

// ------------------------------------------------------------ controller
export class ToolController {
  constructor(game) {
    this.g = game;
    this.tool = TOOLS[0];
    this.props = {};
    this.anims = [];
    this.projectiles = [];
    this.slapSide = 1;
    this.charge = null;
    this.grab = null;
    this.shock = null;
  }

  select(id) {
    this.cancel();
    this.tool = TOOLS.find((t) => t.id === id);
  }

  prop(id) {
    if (!this.props[id]) {
      const p = PROPS[id]();
      p.traverse((o) => { if (o.isMesh) o.castShadow = true; });
      p.visible = false;
      this.g.scene.add(p);
      this.props[id] = p;
    }
    return this.props[id];
  }

  pick(ndc) {
    const g = this.g;
    const ray = new THREE.Raycaster();
    ray.setFromCamera(ndc, g.camera);
    const from = ray.ray.origin, to = from.clone().addScaledVector(ray.ray.direction, 20);
    const res = new CANNON.RaycastResult();
    g.world.raycastClosest(new CANNON.Vec3(from.x, from.y, from.z), new CANNON.Vec3(to.x, to.y, to.z),
      { collisionFilterMask: G_BODY, skipBackfaces: true }, res);
    const dir = ray.ray.direction.clone();
    if (!res.hasHit || !res.body.partName) return { hit: null, dir, origin: from };
    const p = res.hitPointWorld, n = res.hitNormalWorld;
    return {
      hit: { body: res.body, part: res.body.partName, point: new THREE.Vector3(p.x, p.y, p.z), normal: new THREE.Vector3(n.x, n.y, n.z) },
      dir, origin: from,
    };
  }

  down(ndc) {
    const t = this.tool, g = this.g;
    const pk = this.pick(ndc);
    if (t.mode === 'tap') {
      if (pk.hit) this.strike(t, pk, 1);
      else this.whiff(t, pk);
    } else if (t.mode === 'charge') {
      this.charge = { t0: performance.now(), ndc };
      g.ui.chargeStart();
    } else if (t.mode === 'drag' && pk.hit) {
      this.startGrab(pk);
    } else if (t.mode === 'throw') {
      this.throwIt(t, pk);
    } else if (t.mode === 'hold') {
      this.shock = { ndc, last: 0 };
    }
  }

  move(ndc) {
    if (this.charge) this.charge.ndc = ndc;
    if (this.shock) this.shock.ndc = ndc;
    if (this.grab) this.moveGrab(ndc);
  }

  up(ndc) {
    if (this.charge) {
      const k = Math.min(1, (performance.now() - this.charge.t0) / 900);
      this.charge = null;
      this.g.ui.chargeEnd();
      const pk = this.pick(ndc);
      if (pk.hit) this.strike(this.tool, pk, k);
      else this.whiff(this.tool, pk);
    }
    if (this.grab) this.endGrab();
    this.shock = null;
  }

  cancel() {
    if (this.grab) this.endGrab();
    if (this.charge) { this.charge = null; this.g.ui.chargeEnd(); }
    this.shock = null;
  }

  // ---------------------------------------------------------- melee
  strike(t, pk, k) {
    const g = this.g, { hit } = pk;
    const camRight = new THREE.Vector3().setFromMatrixColumn(g.camera.matrixWorld, 0);
    let dir = pk.dir.clone(), dv = t.dv, knock = t.knock;
    if (t.id === 'kick') { dv = t.dv + (t.dvMax - t.dv) * k; knock = 0.25 + k * 0.9; dir.y += 0.25 + k * 0.2; }
    if (t.id === 'slap') { this.slapSide *= -1; dir = camRight.clone().multiplyScalar(this.slapSide).addScaledVector(pk.dir, 0.35); }
    if (t.id === 'bat') { this.slapSide *= -1; dir = camRight.clone().multiplyScalar(this.slapSide).addScaledVector(pk.dir, 0.5); dir.y += 0.35; }
    if (t.id === 'hammer') { dir.set(pk.dir.x * 0.4, -1, pk.dir.z * 0.4); }
    dir.normalize();

    const delay = this.swing(t, hit.point, dir, k);
    setTimeout(() => {
      if (!g.character || !g.character.rag) return;
      g.applyHit(hit, dir, dv, knock, t);
    }, delay);
  }

  whiff(t, pk) {
    const p = pk.origin.clone().addScaledVector(pk.dir, 2.2);
    this.swing(t, p, pk.dir, 0.5);
  }

  // animate the prop into the hit point; returns ms until contact
  swing(t, point, dir, k) {
    sfx.whoosh(0.6 + k * 0.6);
    if (!PROPS[t.id]) return 0;
    const p = this.prop(t.id);
    p.visible = true;
    const cam = this.g.camera;
    const camRight = new THREE.Vector3().setFromMatrixColumn(cam.matrixWorld, 0);
    const toCam = cam.position.clone().sub(point).normalize();
    let start;
    if (t.id === 'slap' || t.id === 'bat') start = point.clone().addScaledVector(dir, -0.6).addScaledVector(toCam, 0.15);
    else if (t.id === 'hammer') start = point.clone().add(new THREE.Vector3(0, 0.55, 0)).addScaledVector(toCam, 0.2);
    else start = point.clone().addScaledVector(toCam, 0.6);
    const end = point.clone().addScaledVector(toCam, t.id === 'punch' ? 0.07 : t.id === 'shock' ? 0.08 : 0.03);
    const dur = t.id === 'bat' ? 140 : t.id === 'hammer' ? 130 : 90;
    const look = point.clone().addScaledVector(dir, 1);
    this.anims.push({ p, start, end, t0: performance.now(), dur, hold: 120, look, id: t.id, side: this.slapSide });
    return dur;
  }

  // ---------------------------------------------------------- grab & throw
  startGrab(pk) {
    const g = this.g, { hit } = pk;
    const mouse = new CANNON.Body({ mass: 0, collisionFilterGroup: 0, collisionFilterMask: 0 });
    mouse.position.set(hit.point.x, hit.point.y, hit.point.z);
    g.world.addBody(mouse);
    const local = hit.body.pointToLocalFrame(new CANNON.Vec3(hit.point.x, hit.point.y, hit.point.z));
    const c = new CANNON.PointToPointConstraint(hit.body, local, mouse, new CANNON.Vec3(0, 0, 0), hit.body.mass * 400);
    g.world.addConstraint(c);
    const camDir = new THREE.Vector3(); g.camera.getWorldDirection(camDir);
    const plane = new THREE.Plane().setFromNormalAndCoplanarPoint(camDir.clone().negate(), hit.point);
    this.grab = { mouse, c, plane, hist: [] };
    g.character.rag.grabbed = true;
    g.ui.toast('잡았다!');
  }

  moveGrab(ndc) {
    const ray = new THREE.Raycaster();
    ray.setFromCamera(ndc, this.g.camera);
    const p = new THREE.Vector3();
    if (!ray.ray.intersectPlane(this.grab.plane, p)) return;
    p.y = Math.max(0.05, Math.min(3.0, p.y));
    this.grab.mouse.position.set(p.x, p.y, p.z);
    this.grab.hist.push({ p: p.clone(), t: performance.now() });
    if (this.grab.hist.length > 6) this.grab.hist.shift();
  }

  endGrab() {
    const g = this.g, gr = this.grab;
    this.grab = null;
    g.world.removeConstraint(gr.c);
    g.world.removeBody(gr.mouse);
    if (!g.character.rag) return;
    g.character.rag.grabbed = false;
    g.character.rag.knock(1);
    // throw velocity from recent pointer motion
    if (gr.hist.length >= 2) {
      const a = gr.hist[0], b = gr.hist[gr.hist.length - 1];
      const dt = Math.max(16, b.t - a.t) / 1000;
      const v = b.p.clone().sub(a.p).divideScalar(dt).clampLength(0, 14);
      for (const part of Object.values(g.character.rag.parts)) {
        part.velocity.x += v.x * 0.6; part.velocity.y += v.y * 0.6; part.velocity.z += v.z * 0.6;
      }
      if (v.length() > 4) { sfx.whoosh(1); g.score(v.length() * 0.6, '휘익~'); }
    }
  }

  // ---------------------------------------------------------- projectiles
  throwIt(t, pk) {
    const g = this.g;
    sfx.throw();
    const mesh = makeThrowable(t);
    mesh.traverse((o) => { if (o.isMesh) o.castShadow = true; });
    g.scene.add(mesh);
    const camDown = new THREE.Vector3().setFromMatrixColumn(g.camera.matrixWorld, 1).negate();
    const start = pk.origin.clone().addScaledVector(pk.dir, 0.4).addScaledVector(camDown, 0.25);
    const target = pk.hit ? pk.hit.point : pk.origin.clone().addScaledVector(pk.dir, 4);
    // ballistic aim: flight time from distance
    const dist = start.distanceTo(target);
    const T = Math.max(0.18, dist / 11);
    const v = target.clone().sub(start).divideScalar(T);
    v.y += 0.5 * 9.82 * T;
    const body = new CANNON.Body({
      mass: 0.25, shape: new CANNON.Sphere(t.r), position: new CANNON.Vec3(start.x, start.y, start.z),
      collisionFilterGroup: G_PROJ, collisionFilterMask: G_BODY | G_ENV,
    });
    body.velocity.set(v.x, v.y, v.z);
    body.angularVelocity.set(Math.random() * 10, Math.random() * 10, 0);
    g.world.addBody(body);
    const proj = { body, mesh, t, dead: false, age: 0 };
    body.addEventListener('collide', (e) => {
      if (proj.dead) return;
      proj.dead = true;
      const other = e.body;
      const ci = e.contact;
      const p = new THREE.Vector3(body.position.x, body.position.y, body.position.z);
      let n = new THREE.Vector3(ci.ni.x, ci.ni.y, ci.ni.z);
      if (ci.bi === body) n.negate();
      // contact normal pointing from the surface outwards
      const vel = new THREE.Vector3(body.velocity.x, body.velocity.y, body.velocity.z);
      if (n.dot(vel) > 0) n.negate();
      proj.hitInfo = { other, p, n, vel };
    });
    this.projectiles.push(proj);
  }

  // ---------------------------------------------------------- per frame
  update(dt) {
    const g = this.g, now = performance.now();
    // prop animations
    for (const a of this.anims) {
      const e = (now - a.t0) / a.dur;
      if (e < 1) {
        const k = e * e;
        a.p.position.lerpVectors(a.start, a.end, k);
      } else {
        a.p.position.copy(a.end);
        if (now - a.t0 > a.dur + a.hold) { a.p.visible = false; a.done = true; }
      }
      a.p.lookAt(a.look);
      if (a.id === 'slap') a.p.rotateY(Math.PI / 2 * a.side);
      if (a.id === 'bat') a.p.rotateY(Math.PI / 2 * -a.side);
      if (a.id === 'hammer') { a.p.rotation.set(0, 0, 0); a.p.rotateZ(Math.PI / 2); a.p.rotateX(-0.3); }
      if (a.id === 'kick') a.p.rotateY(Math.PI);
    }
    this.anims = this.anims.filter((a) => !a.done);

    // projectiles
    for (const pr of this.projectiles) {
      pr.age += dt;
      pr.mesh.position.set(pr.body.position.x, pr.body.position.y, pr.body.position.z);
      pr.mesh.quaternion.set(pr.body.quaternion.x, pr.body.quaternion.y, pr.body.quaternion.z, pr.body.quaternion.w);
      if (pr.hitInfo && !pr.handled) {
        pr.handled = true;
        const { other, p, n, vel } = pr.hitInfo;
        if (other.partName && g.character) {
          g.character.splat(p, n, pr.t.color, other.partName, pr.t.id === 'pie' ? 0.24 : 0.14);
          g.applyHit({ body: other, part: other.partName, point: p, normal: n }, vel.clone().normalize(),
            pr.t.id === 'pie' ? 3 : 1.6, 0.08, pr.t, { noBruise: true });
        } else {
          g.envSplat(p, n, pr.t.color);
          sfx.splat(0.5);
        }
      }
      if (pr.handled || pr.age > 4) pr.remove = true;
    }
    for (const pr of this.projectiles.filter((p) => p.remove)) {
      g.world.removeBody(pr.body);
      g.scene.remove(pr.mesh);
    }
    this.projectiles = this.projectiles.filter((p) => !p.remove);

    // charging
    if (this.charge) g.ui.chargeSet(Math.min(1, (now - this.charge.t0) / 900));

    // electric shock
    if (this.shock && g.character && g.character.rag) {
      const pk = this.pick(this.shock.ndc);
      const rag = g.character.rag;
      const stun = this.prop('shock');
      if (pk.hit) {
        stun.visible = true;
        stun.position.copy(pk.hit.point).addScaledVector(pk.dir, -0.09);
        stun.lookAt(pk.hit.point);
        rag.knock(dt * 2.5);
        for (const b of Object.values(rag.parts)) {
          const m = b.mass * 0.9;
          b.angularVelocity.x += (Math.random() - 0.5) * 6;
          b.angularVelocity.z += (Math.random() - 0.5) * 6;
          b.velocity.y += (Math.random() - 0.3) * 0.15;
          void m;
        }
        g.fx.zap(pk.hit.point);
        if (now - this.shock.last > 110) {
          this.shock.last = now;
          sfx.zap();
          g.score(1.6, Math.random() < 0.15 ? '지지직!' : null, pk.hit.point);
          if (navigator.vibrate) navigator.vibrate(20);
        }
      } else stun.visible = false;
    } else if (this.props.shock && !this.anims.some((a) => a.id === 'shock')) {
      this.props.shock.visible = false;
    }
  }
}
