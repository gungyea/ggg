// Headless check: ragdoll stands, takes hits, recovers, never explodes.
import fs from 'fs';
import { createWorld, RagdollPhysics, CANNON } from '../../public/js/physics.js';
const meta = JSON.parse(fs.readFileSync(new URL('../../public/models/' + (process.argv[2] || 'male') + '.json', import.meta.url)));
const cases = [{ scale: 1, width: 1, massKg: 70 }, { scale: 1.2, width: 1.5, massKg: 150 }, { scale: 0.62, width: 0.8, massKg: 30 }];
let ok = true;
for (const c of cases) {
  const world = createWorld();
  const r = new RagdollPhysics(world, meta, c);
  const head = r.parts.head, hips = r.parts.hips;
  const h0 = head.position.y;
  const log = [];
  for (let i = 0; i < 60 * 12; i++) {
    const t = i / 60;
    if (i === 120) { head.applyImpulse(new CANNON.Vec3(0, 0, -6 * head.mass * 1.5), new CANNON.Vec3(0, 0.03, 0)); r.knock(0.5); }
    if (i === 300) { r.parts.chest.applyImpulse(new CANNON.Vec3(12 * r.parts.chest.mass * 2, 4 * r.parts.chest.mass, 0), new CANNON.Vec3(0, 0.05, 0)); r.knock(1.2); }
    world.step(1 / 120, 1 / 60, 4);
    r.update(1 / 60);
    if (i % 30 === 0) log.push(`${t.toFixed(1)}s head=${head.position.y.toFixed(2)} hipsX=${hips.position.x.toFixed(2)} ctl=${r.control.toFixed(2)}`);
    if (!Number.isFinite(head.position.y)) { ok = false; break; }
  }
  const stand = head.position.y / h0;
  console.log(`scale ${c.scale} kg ${c.massKg}: head0=${h0.toFixed(2)} final=${head.position.y.toFixed(2)} ratio=${stand.toFixed(2)}`);
  console.log(log.filter((_, i) => i % 2 === 0).join('\n'));
  if (!(stand > 0.9)) ok = false;
}
console.log(ok ? 'PASS' : 'FAIL');
process.exit(ok ? 0 : 1);
