// Ragdoll physics (cannon-es only — no three.js here so it can be tested in node)
import * as CANNON from '../vendor/cannon/cannon-es.js';

export { CANNON };
export const G_BODY = 1, G_ENV = 2, G_PROJ = 4;

export const ROOM = { halfW: 3.2, back: -2.6, front: 2.4, height: 3.2 };

export function createWorld() {
  const world = new CANNON.World({ gravity: new CANNON.Vec3(0, -9.82, 0) });
  world.broadphase = new CANNON.SAPBroadphase(world);
  world.solver.iterations = 20;
  world.allowSleep = false;
  world.defaultContactMaterial.friction = 0.6;
  world.defaultContactMaterial.restitution = 0.05;

  const env = (shape, pos, quat) => {
    const b = new CANNON.Body({ mass: 0, shape, collisionFilterGroup: G_ENV, collisionFilterMask: G_BODY | G_PROJ });
    b.position.copy(pos);
    if (quat) b.quaternion.copy(quat);
    world.addBody(b);
    return b;
  };
  const q = (x, y, z, a) => new CANNON.Quaternion().setFromAxisAngle(new CANNON.Vec3(x, y, z), a);
  env(new CANNON.Plane(), new CANNON.Vec3(0, 0, 0), q(1, 0, 0, -Math.PI / 2)); // floor
  env(new CANNON.Plane(), new CANNON.Vec3(0, ROOM.height, 0), q(1, 0, 0, Math.PI / 2)); // ceiling
  env(new CANNON.Plane(), new CANNON.Vec3(0, 0, ROOM.back), null); // back wall (normal +z)
  // invisible front wall keeps the body in the room. Only the body collides with it:
  // the camera (and every thrown object's start point) sits outside it.
  const front = env(new CANNON.Plane(), new CANNON.Vec3(0, 0, ROOM.front), q(0, 1, 0, Math.PI));
  front.collisionFilterMask = G_BODY;
  env(new CANNON.Plane(), new CANNON.Vec3(-ROOM.halfW, 0, 0), q(0, 1, 0, Math.PI / 2));
  env(new CANNON.Plane(), new CANNON.Vec3(ROOM.halfW, 0, 0), q(0, 1, 0, -Math.PI / 2));
  return world;
}

const V = (a) => new CANNON.Vec3(a[0], a[1], a[2]);

// quaternion whose local +Y = dir, and local +Z as close as possible to ref
function basisQuat(dir, ref) {
  const y = dir.clone(); y.normalize();
  let z = ref.vsub(y.scale(ref.dot(y)));
  if (z.length() < 1e-3) z = new CANNON.Vec3(1, 0, 0).vsub(y.scale(y.x));
  z.normalize();
  const x = y.cross(z);
  // rotation matrix columns x,y,z -> quaternion
  const m00 = x.x, m01 = y.x, m02 = z.x, m10 = x.y, m11 = y.y, m12 = z.y, m20 = x.z, m21 = y.z, m22 = z.z;
  const tr = m00 + m11 + m22;
  let qw, qx, qy, qz;
  if (tr > 0) { const S = Math.sqrt(tr + 1) * 2; qw = 0.25 * S; qx = (m21 - m12) / S; qy = (m02 - m20) / S; qz = (m10 - m01) / S; }
  else if (m00 > m11 && m00 > m22) { const S = Math.sqrt(1 + m00 - m11 - m22) * 2; qw = (m21 - m12) / S; qx = 0.25 * S; qy = (m01 + m10) / S; qz = (m02 + m20) / S; }
  else if (m11 > m22) { const S = Math.sqrt(1 + m11 - m00 - m22) * 2; qw = (m02 - m20) / S; qx = (m01 + m10) / S; qy = 0.25 * S; qz = (m12 + m21) / S; }
  else { const S = Math.sqrt(1 + m22 - m00 - m11) * 2; qw = (m10 - m01) / S; qx = (m02 + m20) / S; qy = (m12 + m21) / S; qz = 0.25 * S; }
  return new CANNON.Quaternion(qx, qy, qz, qw).normalize();
}

// mass fractions of a human body
const MASS = {
  hips: 0.14, spine: 0.10, chest: 0.20, neck: 0.02, head: 0.07,
  upperarm: 0.028, lowerarm: 0.016, hand: 0.006, upperleg: 0.10, lowerleg: 0.045, foot: 0.015,
};
// [cone angle, twist angle]
const LIMITS = {
  spine: [0.35, 0.3], chest: [0.35, 0.3], neck: [0.5, 0.4], head: [0.55, 0.6],
  upperarm: [1.6, 0.8], lowerarm: [1.5, 0.4], hand: [0.9, 0.3],
  upperleg: [1.2, 0.4], lowerleg: [1.4, 0.2], foot: [0.6, 0.2],
};
// joint stiffness (relative)
const STIFF = {
  spine: 1.4, chest: 1.2, neck: 0.9, head: 0.7, upperarm: 0.6, lowerarm: 0.45, hand: 0.25,
  upperleg: 2, lowerleg: 2, foot: 0.6,
};
let TWIST_FREE = true; // cannon-es cone-twist misreads the rest twist of our bones; muscles (PD) hold twist instead
export function setTwistFree(v) { TWIST_FREE = v; }
const kind = (n) => n.replace(/\.(L|R)$/, '');
const avgI = (b) => (b.inertia.x + b.inertia.y + b.inertia.z) / 3;

export class RagdollPhysics {
  /**
   * meta: character json (bones with head/tail in model space, metres)
   * opts: { scale, width, massKg, headScale }
   */
  constructor(world, meta, opts) {
    this.world = world;
    this.meta = meta;
    const s = opts.scale, wf = opts.width, hs = opts.headScale || 1;
    this.s = s;
    this.massKg = opts.massKg;
    this.parts = {};
    this.joints = [];
    this.control = 1;          // 1 = standing firmly, 0 = limp
    this.recoverDelay = 0;
    this.grabbed = false;
    this.home = new CANNON.Vec3(0, 0, 0);

    const order = Object.keys(meta.bones);
    for (const name of order) {
      const b = meta.bones[name];
      const k = kind(name);
      const h = V(b.head).scale(s), t = V(b.tail).scale(s);
      const dir = t.vsub(h); let L = dir.length();
      let shape, center = h.vadd(t).scale(0.5);
      const vertical = Math.abs(dir.y) / L > 0.6;
      const ref = vertical ? new CANNON.Vec3(0, 0, 1) : new CANNON.Vec3(0, 1, 0);
      const q = basisQuat(dir, ref);
      const r = (v) => v * s * wf;
      switch (k) {
        case 'hips': shape = new CANNON.Box(new CANNON.Vec3(r(0.15), Math.max(L / 2, 0.06 * s), r(0.1))); break;
        case 'spine': shape = new CANNON.Box(new CANNON.Vec3(r(0.135), L / 2, r(0.095))); break;
        case 'chest': shape = new CANNON.Box(new CANNON.Vec3(r(0.16), L / 2 * 0.9, r(0.105))); break;
        case 'neck': shape = new CANNON.Cylinder(r(0.05), r(0.05), L, 8); break;
        case 'head': {
          const rad = L * 0.52 * hs;
          shape = new CANNON.Sphere(rad);
          center = h.vadd(dir.scale(0.5 * hs));
          break;
        }
        case 'upperarm': shape = new CANNON.Cylinder(r(0.045), r(0.04), L, 8); break;
        case 'lowerarm': shape = new CANNON.Cylinder(r(0.037), r(0.03), L, 8); break;
        case 'hand': shape = new CANNON.Box(new CANNON.Vec3(0.045 * s, L / 2, 0.018 * s)); break;
        case 'upperleg': shape = new CANNON.Cylinder(r(0.075), r(0.055), L, 8); break;
        case 'lowerleg': shape = new CANNON.Cylinder(r(0.05), r(0.04), L, 8); break;
        case 'foot': shape = new CANNON.Box(new CANNON.Vec3(0.045 * s, L / 2 + 0.02 * s, 0.035 * s)); break;
      }
      // tiny parts (hands/feet of a small body) make the solver jittery
      const mass = Math.max(0.7, MASS[k] * opts.massKg / 0.95);
      const body = new CANNON.Body({
        mass, shape, position: center, quaternion: q,
        collisionFilterGroup: G_BODY, collisionFilterMask: G_ENV | G_PROJ,
        linearDamping: 0.05, angularDamping: /arm|hand/.test(k) ? 0.6 : 0.2,
      });
      body.partName = name;
      body.halfLen = Math.max(L / 2, 0.05 * s);
      body.restPos = center.clone();
      body.restQuat = q.clone();
      world.addBody(body);
      this.parts[name] = body;
    }

    // nothing may start inside the floor
    let minY = Infinity;
    for (const b of Object.values(this.parts)) { b.updateAABB(); minY = Math.min(minY, b.aabb.lowerBound.y); }
    this.lift = Math.max(0, 0.005 - minY);
    for (const b of Object.values(this.parts)) { b.position.y += this.lift; b.restPos.y += this.lift; }

    for (const name of order) {
      const pName = meta.bones[name].parent;
      if (!pName) continue;
      const A = this.parts[pName], B = this.parts[name];
      const pivotW = V(meta.bones[name].head).scale(s);
      pivotW.y += this.lift;
      const pivotA = A.quaternion.inverse().vmult(pivotW.vsub(A.position));
      const pivotB = B.quaternion.inverse().vmult(pivotW.vsub(B.position));
      const axisW = B.quaternion.vmult(new CANNON.Vec3(0, 1, 0));
      const axisA = A.quaternion.inverse().vmult(axisW);
      const [angle, twist] = LIMITS[kind(name)];
      const c = new CANNON.ConeTwistConstraint(A, B, {
        pivotA, pivotB, axisA, axisB: new CANNON.Vec3(0, 1, 0), angle, twistAngle: TWIST_FREE ? Math.PI : twist, collideConnected: false,
      });
      world.addConstraint(c);
      // relaxed standing pose: the model is built in an A-pose with wide legs;
      // muscles aim for arms down and feet a bit closer together
      const relax = 0; // the model is already built in a relaxed standing pose
      const R = new CANNON.Quaternion().setFromAxisAngle(new CANNON.Vec3(0, 0, 1), relax);
      this.joints.push({
        A, B, c, stiff: STIFF[kind(name)] || 1,
        qRest: A.quaternion.inverse().mult(R.mult(B.quaternion)),
        Ia: Math.min(A.inertia.x, A.inertia.y, A.inertia.z) * 4,
      });
    }
    this.totalMass = Object.values(this.parts).reduce((a, b) => a + b.mass, 0);
    this.hipsRestY = this.parts.hips.position.y;

    this._pre = () => this.control_step(1 / 120);
    world.addEventListener('preStep', this._pre);
  }

  destroy() {
    this.world.removeEventListener('preStep', this._pre);
    for (const j of this.joints) this.world.removeConstraint(j.c);
    for (const b of Object.values(this.parts)) this.world.removeBody(b);
  }

  // called on every physics sub-step
  control_step(dt) {
    const ctl = this.control;
    const tone = 0.12 + 0.88 * ctl;  // muscles never fully off
    const tmp = new CANNON.Vec3();
    for (const j of this.joints) {
      const { A, B } = j;
      // target world orientation for child
      const target = A.quaternion.mult(j.qRest);
      const err = target.mult(B.quaternion.conjugate());
      if (err.w < 0) { err.x *= -1; err.y *= -1; err.z *= -1; err.w *= -1; }
      const sinHalf = Math.sqrt(err.x * err.x + err.y * err.y + err.z * err.z);
      const ang = 2 * Math.atan2(sinHalf, err.w);
      // Gains come from the child's inertia, per local axis: a stiff spring on a
      // thin limb's long axis would otherwise blow up the explicit integration.
      const wn = 26 * Math.sqrt(j.stiff * tone);
      const kp = wn * wn, kd = 2 * wn * 0.8;
      const qi = B.quaternion.conjugate();
      const e = sinHalf > 1e-6
        ? qi.vmult(new CANNON.Vec3(err.x / sinHalf * ang, err.y / sinHalf * ang, err.z / sinHalf * ang))
        : new CANNON.Vec3();
      const w = qi.vmult(B.angularVelocity.vsub(A.angularVelocity));
      const Ia = j.Ia, Ib = B.inertia;
      tmp.set(
        Math.min(Ib.x, Ia) * (kp * e.x - kd * w.x),
        Math.min(Ib.y, Ia) * (kp * e.y - kd * w.y),
        Math.min(Ib.z, Ia) * (kp * e.z - kd * w.z));
      B.quaternion.vmult(tmp, tmp);
      B.torque.vadd(tmp, B.torque);
      A.torque.vsub(tmp, A.torque);
    }

    if (ctl <= 0.01 || this.grabbed) return;
    const g = 9.82, M = this.totalMass;
    const hips = this.parts.hips, chest = this.parts.chest;
    // An invisible "puppet string" on the chest holds the body up; the body
    // hangs below it, which keeps it upright without stiff torques.
    // Gets weaker when knocked, so the body crumples and then rises again.
    // arms are held by the shoulders while standing (otherwise gravity swings them into the torso)
    for (const n of ['upperarm.L', 'lowerarm.L', 'hand.L', 'upperarm.R', 'lowerarm.R', 'hand.R']) {
      const b = this.parts[n];
      b.force.y += b.mass * g * 0.95 * ctl;
    }
    const head = this.parts.head;
    // Weight support: a bit less than the full weight, the rest stays on the
    // legs so the feet stay planted and the knees don't splay.
    for (const [b, share] of [[chest, 0.36], [hips, 0.36], [head, 0.08]]) {
      const dy = (b.restPos.y - b.position.y) / this.s;
      b.force.y += share * M * (g * ctl * Math.max(0, Math.min(2.5, 1 + 8 * dy)) - b.velocity.y * 12 * ctl);
    }
    // Posture: two soft "strings" per torso part (top and bottom point) pull it
    // back to its standing place, which holds both position and tilt stably.
    const tgt = new CANNON.Vec3(), wp = new CANNON.Vec3(), rel = new CANNON.Vec3(), vp = new CANNON.Vec3(), f = new CANNON.Vec3();
    const P = this.parts;
    for (const [b, gain] of [[hips, 260], [P.spine, 260], [chest, 260],
      [P['upperleg.L'], 150], [P['upperleg.R'], 150], [P['lowerleg.L'], 150], [P['lowerleg.R'], 150]]) {
      const k = b.mass * gain * ctl, c = b.mass * 2 * Math.sqrt(gain) * 0.8 * ctl;
      for (const sg of [1, -1]) {
        const lp = new CANNON.Vec3(0, sg * b.halfLen, 0);
        b.restQuat.vmult(lp, tgt); tgt.vadd(b.restPos, tgt); tgt.x += this.home.x; tgt.z += this.home.z;
        b.quaternion.vmult(lp, rel); rel.vadd(b.position, wp);
        b.angularVelocity.cross(rel, vp); vp.vadd(b.velocity, vp);
        // x/z: full spring. y: only the tilt part (top vs bottom), height is the weight support's job
        const ty = (tgt.y - b.restPos.y) - rel.y;
        f.set((tgt.x - wp.x) * k - vp.x * c, ty * k - (vp.y - b.velocity.y) * c, (tgt.z - wp.z) * k - vp.z * c);
        b.applyForce(f, rel);
      }
    }
    // head over the shoulders
    {
      const k = head.mass * 120 * ctl, c = head.mass * 2 * 11 * 0.8 * ctl;
      head.force.x += (head.restPos.x + this.home.x - head.position.x) * k - head.velocity.x * c;
      head.force.z += (head.restPos.z + this.home.z - head.position.z) * k - head.velocity.z * c;
    }
    // face the camera (+z): gentle yaw torque
    for (const b of [hips, chest]) {
      const fwd = b.quaternion.vmult(new CANNON.Vec3(0, 0, 1));
      const I = avgI(b);
      const wn = 8 * ctl;
      b.torque.y += -Math.atan2(fwd.x, fwd.z) * I * wn * wn - b.angularVelocity.y * 2 * I * wn;
    }
  }

  // per-frame (not per sub-step) bookkeeping
  update(dt) {
    if (this.grabbed) { this.control = Math.max(0, this.control - dt * 4); return; }
    if (this.recoverDelay > 0) { this.recoverDelay -= dt; return; }
    this.control = Math.min(1, this.control + dt * 0.55);
  }

  knock(amount) {
    this.control = Math.max(0, this.control - amount);
    if (this.control < 0.35) this.recoverDelay = 0.6 + (0.35 - this.control) * 3;
  }

  reset() {
    for (const b of Object.values(this.parts)) {
      b.position.copy(b.restPos);
      b.quaternion.copy(b.restQuat);
      b.velocity.set(0, 0, 0);
      b.angularVelocity.set(0, 0, 0);
      b.force.set(0, 0, 0);
      b.torque.set(0, 0, 0);
    }
    this.control = 1; this.recoverDelay = 0;
  }
}
