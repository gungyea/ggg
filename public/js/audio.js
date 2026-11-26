// All sounds are synthesized with WebAudio — no audio files to download.
let ctx = null, master = null, noiseBuf = null;

export function unlockAudio() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.8;
    const comp = ctx.createDynamicsCompressor();
    master.connect(comp).connect(ctx.destination);
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  if (ctx.state === 'suspended') ctx.resume();
}

export function setMuted(m) { if (master) master.gain.value = m ? 0 : 0.8; }

function noise(dur, type, freq, q, gain, attack = 0.002, t0 = 0) {
  const t = ctx.currentTime + t0;
  const src = ctx.createBufferSource();
  src.buffer = noiseBuf;
  const f = ctx.createBiquadFilter();
  f.type = type; f.frequency.value = freq; f.Q.value = q;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(gain, t + attack);
  g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  src.connect(f).connect(g).connect(master);
  src.start(t, Math.random() * 0.5);
  src.stop(t + dur + 0.05);
  return f;
}

function tone(f0, f1, dur, type, gain, t0 = 0) {
  const t = ctx.currentTime + t0;
  const o = ctx.createOscillator();
  o.type = type;
  o.frequency.setValueAtTime(f0, t);
  o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
  const g = ctx.createGain();
  g.gain.setValueAtTime(gain, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  o.connect(g).connect(master);
  o.start(t); o.stop(t + dur + 0.05);
}

// a short "oof" — sawtooth through two formant filters
function grunt(pitch = 1) {
  const t = ctx.currentTime + 0.03;
  const o = ctx.createOscillator();
  o.type = 'sawtooth';
  const f = 120 * pitch * (0.9 + Math.random() * 0.2);
  o.frequency.setValueAtTime(f * 1.3, t);
  o.frequency.exponentialRampToValueAtTime(f * 0.8, t + 0.22);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(0.35, t + 0.02);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
  const sum = ctx.createGain();
  for (const [fq, q, a] of [[650, 6, 1], [1100, 8, 0.6], [2400, 10, 0.25]]) {
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass'; bp.frequency.value = fq * (0.9 + Math.random() * 0.2); bp.Q.value = q;
    const ga = ctx.createGain(); ga.gain.value = a;
    o.connect(bp).connect(ga).connect(sum);
  }
  sum.connect(g).connect(master);
  o.start(t); o.stop(t + 0.32);
}

export const sfx = {
  whoosh(speed = 1) {
    if (!ctx) return;
    const f = noise(0.18, 'bandpass', 600, 1.5, 0.25 * speed);
    f.frequency.setValueAtTime(400, ctx.currentTime);
    f.frequency.exponentialRampToValueAtTime(2200, ctx.currentTime + 0.15);
  },
  punch(power = 1, voice = 1) {
    if (!ctx) return;
    tone(140, 45, 0.18, 'sine', 0.9 * Math.min(1.4, power));
    noise(0.12, 'lowpass', 1800, 0.8, 0.7 * power);
    noise(0.05, 'bandpass', 3500, 1, 0.2 * power);
    if (Math.random() < 0.6) grunt(voice);
  },
  slap(power = 1, voice = 1) {
    if (!ctx) return;
    noise(0.09, 'highpass', 1800, 0.7, 1.0 * power, 0.001);
    noise(0.05, 'bandpass', 4500, 2, 0.5 * power, 0.001);
    tone(300, 120, 0.06, 'triangle', 0.3);
    if (Math.random() < 0.4) grunt(voice * 1.1);
  },
  bonk(power = 1, voice = 1) {
    if (!ctx) return;
    tone(420, 160, 0.25, 'sine', 0.5 * power);
    tone(90, 40, 0.25, 'sine', 0.9 * power);
    noise(0.15, 'lowpass', 1200, 1, 0.6 * power);
    grunt(voice * 0.9);
  },
  bat(power = 1, voice = 1) {
    if (!ctx) return;
    tone(900, 500, 0.12, 'triangle', 0.4);
    tone(120, 40, 0.3, 'sine', 1.0 * power);
    noise(0.2, 'lowpass', 2500, 0.7, 0.9 * power);
    grunt(voice * 0.85);
  },
  splat(power = 1) {
    if (!ctx) return;
    const f = noise(0.25, 'lowpass', 900, 3, 0.9 * power);
    f.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.2);
    tone(220, 60, 0.12, 'sine', 0.3);
  },
  throw() { if (ctx) this.whoosh(0.7); },
  thud(power = 1) {
    if (!ctx) return;
    tone(90, 35, 0.2, 'sine', Math.min(1, 0.6 * power));
    noise(0.1, 'lowpass', 600, 0.7, Math.min(0.8, 0.5 * power));
  },
  zap() {
    if (!ctx) return;
    const t = ctx.currentTime;
    const o = ctx.createOscillator(); o.type = 'sawtooth';
    o.frequency.setValueAtTime(60 + Math.random() * 40, t);
    const lfo = ctx.createOscillator(); lfo.frequency.value = 30;
    const lg = ctx.createGain(); lg.gain.value = 40; lfo.connect(lg).connect(o.frequency);
    const g = ctx.createGain(); g.gain.setValueAtTime(0.25, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
    o.connect(g).connect(master); o.start(t); o.stop(t + 0.16); lfo.start(t); lfo.stop(t + 0.16);
    noise(0.12, 'highpass', 5000, 1, 0.35, 0.001);
  },
  combo(level) {
    if (!ctx) return;
    const base = 520 * Math.pow(1.06, Math.min(level, 24));
    tone(base, base * 1.5, 0.12, 'square', 0.12);
  },
  win() {
    if (!ctx) return;
    [523, 659, 784, 1047].forEach((f, i) => tone(f, f, 0.25, 'triangle', 0.25, i * 0.11));
  },
};
