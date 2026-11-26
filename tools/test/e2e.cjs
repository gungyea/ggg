// End-to-end smoke test: photo -> body -> play with every tool. Saves screenshots.
const { chromium } = require('playwright');
const OUT = process.env.OUT || '.';
const URL = process.env.URL || 'http://localhost:8765/';
const FACE = process.env.FACE;
(async () => {
  const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const page = await browser.newPage({ viewport: { width: +(process.env.W || 1280), height: +(process.env.H || 800) } });
  const errors = [];
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  await page.goto(URL);
  await page.waitForFunction(() => document.body.classList.contains('ready'), null, { timeout: 30000 });
  await page.click('#start');
  if (FACE) await page.setInputFiles('#file', FACE);
  await page.waitForTimeout(500);
  await page.screenshot({ path: OUT + '/1-photo.png' });
  await page.click(FACE ? '#photo-next' : '#photo-skip');
  await page.waitForFunction(() => window.__game.character, null, { timeout: 30000 });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: OUT + '/2-custom.png' });
  await page.click('#custom-go');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: OUT + '/3-play.png' });
  // aim at the head / chest via projected physics bodies
  const aim = (part) => page.evaluate((part) => {
    const g = window.__game, b = g.character.rag.parts[part].position;
    const v = { x: b.x, y: b.y, z: b.z };
    const THREEv = g.camera.position.constructor;
    const p = new THREEv(v.x, v.y, v.z).project(g.camera);
    return { x: (p.x + 1) / 2 * innerWidth, y: (1 - p.y) / 2 * innerHeight };
  }, part);
  const tools = ['punch', 'slap', 'kick', 'hammer', 'bat', 'tomato', 'pie', 'egg', 'shock', 'grab'];
  for (const t of tools) {
    await page.click(`#toolbar button[data-id="${t}"]`);
    await page.waitForTimeout(150);
    const p = await aim(t === 'kick' || t === 'bat' ? 'chest' : 'head');
    if (t === 'kick' || t === 'shock') {
      await page.mouse.move(p.x, p.y); await page.mouse.down(); await page.waitForTimeout(700); await page.mouse.up();
    } else if (t === 'grab') {
      await page.mouse.move(p.x, p.y); await page.mouse.down();
      for (let i = 0; i < 10; i++) { await page.mouse.move(p.x + i * 25, p.y - i * 15); await page.waitForTimeout(16); }
      await page.mouse.up();
    } else {
      await page.mouse.click(p.x, p.y);
    }
    await page.waitForTimeout(t === 'tomato' || t === 'pie' || t === 'egg' ? 700 : 350);
    if (['punch', 'bat', 'pie'].includes(t)) await page.screenshot({ path: OUT + `/4-${t}.png` });
  }
  await page.waitForTimeout(2500);
  await page.screenshot({ path: OUT + '/5-after.png' });
  // regression: after standing back up, thrown food must still reach the body
  await page.click('#btn-reset');
  await page.waitForTimeout(1500);
  await page.click('#toolbar button[data-id="tomato"]');
  let landed = 0;
  for (const part of ['chest', 'head', 'hips']) {
    const before = await page.evaluate(() => window.__game.hits);
    const p = await aim(part);
    await page.mouse.click(p.x, p.y);
    await page.waitForTimeout(100);
    await page.waitForFunction(() => window.__game.tools.projectiles.length === 0, null, { timeout: 5000 });
    const after = await page.evaluate(() => window.__game.hits);
    if (after > before) landed++;
  }
  console.log('THROW_AFTER_RESET', landed + '/3');
  if (landed < 2) errors.push('tomato did not reach the body after reset');
  await page.screenshot({ path: OUT + '/6-tomato-after-reset.png' });
  const state = await page.evaluate(() => ({ hits: window.__game.hits, head: window.__game.character.rag.parts.head.position.y }));
  console.log('STATE', JSON.stringify(state));
  console.log('ERRORS', errors.length ? errors.join('\n') : 'none');
  await browser.close();
})();
