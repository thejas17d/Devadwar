/**
 * Procedurally synthesised Indian devotional instruments (Web Audio API).
 *
 * Every sound here is generated from oscillators, noise and Karplus–Strong
 * string models at runtime — no samples, no third-party recordings, so there
 * are no copyright dependencies and zero audio bytes to download.
 *
 * Each function schedules a one-shot voice at time `t` into `out`.
 * `send` is an optional reverb send.
 */

export interface Dest {
  ctx: BaseAudioContext;
  out: AudioNode;
  send?: AudioNode;
}

// ── shared buffers ───────────────────────────────────────────────

const noiseCache = new WeakMap<BaseAudioContext, AudioBuffer>();
export function noiseBuffer(ctx: BaseAudioContext): AudioBuffer {
  let b = noiseCache.get(ctx);
  if (!b) {
    b = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const d = b.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    noiseCache.set(ctx, b);
  }
  return b;
}

const pluckCache = new WeakMap<BaseAudioContext, Map<string, { buf: AudioBuffer; rate: number }>>();

/**
 * Karplus–Strong plucked string. Returns a buffer plus the playbackRate that
 * corrects integer-delay tuning error (so strings stay in tune).
 */
export function pluck(
  ctx: BaseAudioContext,
  freq: number,
  seconds: number,
  opts: { brightness?: number; sustain?: number } = {},
) {
  const brightness = opts.brightness ?? 0.5;
  const sustain = opts.sustain ?? 0.996;
  const key = `${freq.toFixed(1)}|${seconds}|${brightness}|${sustain}`;
  let cache = pluckCache.get(ctx);
  if (!cache) pluckCache.set(ctx, (cache = new Map()));
  const hit = cache.get(key);
  if (hit) return hit;

  const sr = ctx.sampleRate;
  const N = Math.max(2, Math.round(sr / freq));
  const len = Math.floor(sr * seconds);
  const buf = ctx.createBuffer(1, len, sr);
  const d = buf.getChannelData(0);
  const ring = new Float32Array(N);
  // Excitation: noise, low-passed according to brightness (softer pluck = darker).
  let lp = 0;
  for (let i = 0; i < N; i++) {
    const n = Math.random() * 2 - 1;
    lp = lp + (n - lp) * (0.25 + brightness * 0.75);
    ring[i] = lp;
  }
  let idx = 0;
  let peak = 0;
  for (let i = 0; i < len; i++) {
    const cur = ring[idx];
    const nxt = ring[(idx + 1) % N];
    ring[idx] = sustain * 0.5 * (cur + nxt);
    d[i] = cur;
    if (Math.abs(cur) > peak) peak = Math.abs(cur);
    idx = (idx + 1) % N;
  }
  // Normalise and add a short fade-out to avoid clicks.
  const g = peak > 0 ? 0.9 / peak : 1;
  const fade = Math.floor(sr * 0.05);
  for (let i = 0; i < len; i++) {
    d[i] *= g * (i > len - fade ? (len - i) / fade : 1);
  }
  const rate = (freq * (N + 0.5)) / sr; // compensate for averaging-filter half-sample delay
  const res = { buf, rate };
  cache.set(key, res);
  return res;
}

function connect(node: AudioNode, dest: Dest, sendLevel = 0.3) {
  node.connect(dest.out);
  if (dest.send && sendLevel > 0) {
    const s = dest.ctx.createGain();
    s.gain.value = sendLevel;
    node.connect(s);
    s.connect(dest.send);
  }
}

function envGain(ctx: BaseAudioContext, t: number, attack: number, peak: number, hold: number, release: number) {
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(Math.max(peak, 0.0002), t + attack);
  g.gain.setValueAtTime(Math.max(peak, 0.0002), t + attack + hold);
  g.gain.exponentialRampToValueAtTime(0.0001, t + attack + hold + release);
  return g;
}

// ── strings ──────────────────────────────────────────────────────

/** Tanpura pluck: long-sustaining string with a bright "jawari" edge. */
export function tanpura(dest: Dest, t: number, freq: number, vel = 0.5) {
  const { ctx } = dest;
  const { buf, rate } = pluck(ctx, freq, 4.5, { brightness: 0.85, sustain: 0.9985 });
  const shelf = ctx.createBiquadFilter();
  shelf.type = "peaking";
  shelf.frequency.value = 2200;
  shelf.Q.value = 0.8;
  shelf.gain.value = 7; // jawari-like buzz emphasis
  const g = ctx.createGain();
  g.gain.value = vel * 0.32;
  shelf.connect(g);
  connect(g, dest, 0.45);
  for (const detune of [0, 4]) {
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.playbackRate.value = rate * Math.pow(2, detune / 1200);
    src.connect(shelf);
    src.start(t + detune * 0.004);
  }
}

/** Veena: plucked string with a meend (glide) from the previous note. */
export function veena(dest: Dest, t: number, freq: number, dur: number, vel = 0.6, fromFreq?: number) {
  const { ctx } = dest;
  const { buf, rate } = pluck(ctx, freq, 3, { brightness: 0.7, sustain: 0.997 });
  const src = ctx.createBufferSource();
  src.buffer = buf;
  if (fromFreq && Math.abs(fromFreq - freq) > 1) {
    const r0 = rate * (fromFreq / freq);
    src.playbackRate.setValueAtTime(r0, t);
    src.playbackRate.linearRampToValueAtTime(rate, t + Math.min(0.18, dur * 0.35));
  } else {
    src.playbackRate.setValueAtTime(rate, t);
  }
  // gentle gamaka (oscillation) on long notes
  if (dur > 1.2) {
    const lfo = ctx.createOscillator();
    const lg = ctx.createGain();
    lfo.frequency.value = 3.2;
    lg.gain.value = rate * 0.012;
    lfo.connect(lg);
    lg.connect(src.playbackRate);
    lfo.start(t + 0.4);
    lfo.stop(t + Math.min(dur, 3));
  }
  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 3200;
  const body = ctx.createBiquadFilter();
  body.type = "peaking";
  body.frequency.value = 280;
  body.gain.value = 5;
  const g = ctx.createGain();
  g.gain.setValueAtTime(vel * 0.5, t);
  g.gain.setTargetAtTime(0.0001, t + Math.max(dur, 0.6) + 0.6, 0.4);
  src.connect(lp).connect(body).connect(g);
  connect(g, dest, 0.4);
  src.start(t);
  src.stop(t + Math.max(dur, 0.6) + 2.5);
}

// ── winds ────────────────────────────────────────────────────────

/** Bansuri (bamboo flute): soft sine core, breath noise, delayed vibrato. */
export function bansuri(dest: Dest, t: number, freq: number, dur: number, vel = 0.6, fromFreq?: number) {
  const { ctx } = dest;
  const end = t + dur;
  const amp = ctx.createGain();
  const attack = 0.09;
  amp.gain.setValueAtTime(0.0001, t);
  amp.gain.exponentialRampToValueAtTime(vel * 0.22, t + attack);
  amp.gain.setValueAtTime(vel * 0.22, Math.max(t + attack, end - 0.12));
  amp.gain.exponentialRampToValueAtTime(0.0001, end + 0.28);

  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = Math.min(freq * 5, 6000);
  lp.connect(amp);
  connect(amp, dest, 0.5);

  const vib = ctx.createOscillator();
  const vibG = ctx.createGain();
  vib.frequency.value = 5.1;
  vibG.gain.setValueAtTime(0, t);
  vibG.gain.linearRampToValueAtTime(freq * 0.0065, t + Math.min(0.45, dur * 0.6));
  vib.connect(vibG);

  const parts: [OscillatorType, number, number][] = [
    ["sine", 1, 1],
    ["sine", 2, 0.14],
    ["sine", 3, 0.05],
  ];
  for (const [type, mult, gain] of parts) {
    const o = ctx.createOscillator();
    o.type = type;
    if (fromFreq && Math.abs(fromFreq - freq) > 1) {
      o.frequency.setValueAtTime(fromFreq * mult, t);
      o.frequency.exponentialRampToValueAtTime(freq * mult, t + 0.1);
    } else o.frequency.setValueAtTime(freq * mult, t);
    vibG.connect(o.frequency);
    const g = ctx.createGain();
    g.gain.value = gain;
    o.connect(g).connect(lp);
    o.start(t);
    o.stop(end + 0.35);
  }
  // breath
  const n = ctx.createBufferSource();
  n.buffer = noiseBuffer(ctx);
  const bp = ctx.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = freq * 2;
  bp.Q.value = 2;
  const ng = ctx.createGain();
  ng.gain.setValueAtTime(0.0001, t);
  ng.gain.exponentialRampToValueAtTime(vel * 0.045, t + 0.05);
  ng.gain.exponentialRampToValueAtTime(vel * 0.012, t + 0.3);
  ng.gain.exponentialRampToValueAtTime(0.0001, end + 0.2);
  n.connect(bp).connect(ng).connect(lp);
  n.start(t, Math.random());
  n.stop(end + 0.3);
  vib.start(t);
  vib.stop(end + 0.35);
}

/** Nadaswaram / shehnai-like double reed: bright, nasal, ceremonial. */
export function nadaswaram(dest: Dest, t: number, freq: number, dur: number, vel = 0.5, fromFreq?: number) {
  const { ctx } = dest;
  const end = t + dur;
  const o = ctx.createOscillator();
  o.type = "sawtooth";
  if (fromFreq && Math.abs(fromFreq - freq) > 1) {
    o.frequency.setValueAtTime(fromFreq, t);
    o.frequency.exponentialRampToValueAtTime(freq, t + 0.09);
  } else o.frequency.setValueAtTime(freq, t);
  const vib = ctx.createOscillator();
  const vg = ctx.createGain();
  vib.frequency.value = 5.8;
  vg.gain.setValueAtTime(0, t);
  vg.gain.linearRampToValueAtTime(freq * 0.009, t + 0.3);
  vib.connect(vg).connect(o.frequency);
  const f1 = ctx.createBiquadFilter();
  f1.type = "bandpass";
  f1.frequency.value = 1150;
  f1.Q.value = 1.1;
  const f2 = ctx.createBiquadFilter();
  f2.type = "lowpass";
  f2.frequency.value = 3400;
  const amp = ctx.createGain();
  amp.gain.setValueAtTime(0.0001, t);
  amp.gain.exponentialRampToValueAtTime(vel * 0.2, t + 0.05);
  amp.gain.setValueAtTime(vel * 0.2, Math.max(t + 0.05, end - 0.08));
  amp.gain.exponentialRampToValueAtTime(0.0001, end + 0.15);
  o.connect(f1).connect(f2).connect(amp);
  connect(amp, dest, 0.45);
  o.start(t);
  o.stop(end + 0.2);
  vib.start(t);
  vib.stop(end + 0.2);
}

/** Shankha (conch): a swelling, buzzy horn call. */
export function shankha(dest: Dest, t: number, freq = 320, dur = 3.2, vel = 0.6) {
  const { ctx } = dest;
  const o = ctx.createOscillator();
  o.type = "sawtooth";
  o.frequency.setValueAtTime(freq * 0.93, t);
  o.frequency.exponentialRampToValueAtTime(freq, t + 0.7);
  o.frequency.setValueAtTime(freq, t + dur - 0.5);
  o.frequency.exponentialRampToValueAtTime(freq * 0.9, t + dur);
  const o2 = ctx.createOscillator();
  o2.type = "square";
  o2.frequency.setValueAtTime(freq * 0.5 * 0.93, t);
  o2.frequency.exponentialRampToValueAtTime(freq * 0.5, t + 0.7);
  const vib = ctx.createOscillator();
  const vg = ctx.createGain();
  vib.frequency.value = 4.2;
  vg.gain.value = freq * 0.006;
  vib.connect(vg);
  vg.connect(o.frequency);
  const f1 = ctx.createBiquadFilter();
  f1.type = "bandpass";
  f1.frequency.value = 900;
  f1.Q.value = 1.4;
  const f2 = ctx.createBiquadFilter();
  f2.type = "peaking";
  f2.frequency.value = 1800;
  f2.gain.value = 6;
  const amp = ctx.createGain();
  amp.gain.setValueAtTime(0.0001, t);
  amp.gain.exponentialRampToValueAtTime(vel * 0.3, t + 1.1);
  amp.gain.setValueAtTime(vel * 0.3, t + dur - 0.6);
  amp.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  const g2 = ctx.createGain();
  g2.gain.value = 0.35;
  o.connect(f1);
  o2.connect(g2).connect(f1);
  f1.connect(f2).connect(amp);
  connect(amp, dest, 0.7);
  for (const n of [o, o2, vib]) {
    n.start(t);
    n.stop(t + dur + 0.1);
  }
}

// ── bells & metal ────────────────────────────────────────────────

/** Large temple bell: inharmonic partials with long decay. */
export function templeBell(dest: Dest, t: number, base = 330, vel = 0.5, decay = 6) {
  const { ctx } = dest;
  const ratios = [0.5, 1, 1.183, 1.506, 2.0, 2.514, 2.662, 3.011, 4.166];
  const amps = [0.45, 1, 0.55, 0.4, 0.33, 0.22, 0.18, 0.12, 0.07];
  const g = ctx.createGain();
  g.gain.value = vel * 0.09;
  connect(g, dest, 0.6);
  ratios.forEach((r, i) => {
    const o = ctx.createOscillator();
    o.frequency.value = base * r * (1 + (Math.random() - 0.5) * 0.002);
    const e = ctx.createGain();
    const d = decay / (1 + i * 0.45);
    e.gain.setValueAtTime(0.0001, t);
    e.gain.exponentialRampToValueAtTime(amps[i], t + 0.004);
    e.gain.exponentialRampToValueAtTime(0.0001, t + d);
    o.connect(e).connect(g);
    o.start(t);
    o.stop(t + d + 0.05);
  });
  strikeNoise(dest, t, 2600, vel * 0.05, 0.03, g);
}

/** Hand bell (ghanti) rung during Aarti. */
export function ghanti(dest: Dest, t: number, base = 1550, vel = 0.4) {
  const { ctx } = dest;
  const ratios = [1, 2.32, 4.25, 6.63];
  const amps = [1, 0.5, 0.25, 0.12];
  const g = ctx.createGain();
  g.gain.value = vel * 0.07;
  connect(g, dest, 0.35);
  ratios.forEach((r, i) => {
    const o = ctx.createOscillator();
    o.frequency.value = base * r;
    const e = ctx.createGain();
    const d = 1.3 / (1 + i * 0.7);
    e.gain.setValueAtTime(0.0001, t);
    e.gain.exponentialRampToValueAtTime(amps[i], t + 0.002);
    e.gain.exponentialRampToValueAtTime(0.0001, t + d);
    o.connect(e).connect(g);
    o.start(t);
    o.stop(t + d + 0.05);
  });
  strikeNoise(dest, t, 5000, vel * 0.04, 0.015, g);
}

/** Manjira (small cymbals). */
export function manjira(dest: Dest, t: number, vel = 0.35, open = true) {
  const { ctx } = dest;
  const base = 2650;
  const g = ctx.createGain();
  g.gain.value = vel * 0.05;
  connect(g, dest, 0.3);
  [1, 1.47, 2.09, 2.56].forEach((r, i) => {
    const o = ctx.createOscillator();
    o.frequency.value = base * r;
    const e = ctx.createGain();
    const d = (open ? 0.9 : 0.12) / (1 + i * 0.4);
    e.gain.setValueAtTime(0.0001, t);
    e.gain.exponentialRampToValueAtTime(1 / (1 + i), t + 0.002);
    e.gain.exponentialRampToValueAtTime(0.0001, t + d);
    o.connect(e).connect(g);
    o.start(t);
    o.stop(t + d + 0.05);
  });
  strikeNoise(dest, t, 7000, vel * 0.08, open ? 0.08 : 0.03, g);
}

function strikeNoise(dest: Dest, t: number, freq: number, vel: number, dur: number, into?: AudioNode) {
  const { ctx } = dest;
  const n = ctx.createBufferSource();
  n.buffer = noiseBuffer(ctx);
  const bp = ctx.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = freq;
  bp.Q.value = 0.9;
  const e = ctx.createGain();
  e.gain.setValueAtTime(vel, t);
  e.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  n.connect(bp).connect(e);
  if (into) e.connect(into);
  else connect(e, dest, 0.2);
  n.start(t, Math.random());
  n.stop(t + dur + 0.02);
}

/** Soft UI chime. */
export function chime(dest: Dest, t: number, freq = 1320, vel = 0.3) {
  const { ctx } = dest;
  [1, 2.76, 5.4].forEach((r, i) => {
    const o = ctx.createOscillator();
    o.frequency.value = freq * r;
    const e = envGain(ctx, t, 0.003, (vel * 0.06) / (1 + i * 2), 0, 1.4 / (1 + i));
    o.connect(e);
    connect(e, dest, 0.5);
    o.start(t);
    o.stop(t + 1.6);
  });
}

/** Deep gong for the opening of the celestial gate. */
export function gong(dest: Dest, t: number, base = 72, vel = 0.6) {
  const { ctx } = dest;
  const ratios = [1, 1.52, 2.03, 2.71, 3.4, 4.2, 5.1];
  const g = ctx.createGain();
  g.gain.value = vel * 0.16;
  connect(g, dest, 0.8);
  ratios.forEach((r, i) => {
    const o = ctx.createOscillator();
    o.frequency.setValueAtTime(base * r * 1.01, t);
    o.frequency.exponentialRampToValueAtTime(base * r, t + 1.2);
    const e = ctx.createGain();
    const d = 7 / (1 + i * 0.5);
    e.gain.setValueAtTime(0.0001, t);
    e.gain.exponentialRampToValueAtTime(1 / (1 + i * 0.6), t + 0.02 + i * 0.03);
    e.gain.exponentialRampToValueAtTime(0.0001, t + d);
    o.connect(e).connect(g);
    o.start(t);
    o.stop(t + d + 0.1);
  });
}

// ── drums ────────────────────────────────────────────────────────

function drumTone(dest: Dest, t: number, f0: number, f1: number, decay: number, vel: number, type: OscillatorType = "sine") {
  const { ctx } = dest;
  const o = ctx.createOscillator();
  o.type = type;
  o.frequency.setValueAtTime(f0, t);
  o.frequency.exponentialRampToValueAtTime(f1, t + decay * 0.6);
  const e = ctx.createGain();
  e.gain.setValueAtTime(0.0001, t);
  e.gain.exponentialRampToValueAtTime(vel, t + 0.004);
  e.gain.exponentialRampToValueAtTime(0.0001, t + decay);
  o.connect(e);
  connect(e, dest, 0.15);
  o.start(t);
  o.stop(t + decay + 0.05);
}

export type TablaBol = "dha" | "dhi" | "ge" | "na" | "tin" | "ka" | "ti";

/** Tabla bols: dayan (treble, tuned to Sa) + bayan (bass with glide). */
export function tabla(dest: Dest, t: number, bol: TablaBol, sa: number, vel = 0.5) {
  const bass = bol === "dha" || bol === "dhi" || bol === "ge";
  const treble = bol !== "ge" && bol !== "ka";
  if (bass) drumTone(dest, t, 105, 68, 0.7, vel * 0.38);
  if (treble) {
    const muted = bol === "tin" || bol === "ti";
    [1, 2, 3, 4.1].forEach((r, i) => drumTone(dest, t, sa * r, sa * r * 0.995, (muted ? 0.18 : 0.45) / (1 + i * 0.5), (vel * 0.16) / (1 + i)));
    strikeNoise(dest, t, 3200, vel * 0.08, 0.02);
  }
  if (bol === "ka") strikeNoise(dest, t, 1800, vel * 0.18, 0.05);
}

/** Damaru: a quick double-headed rattle. */
export function damaru(dest: Dest, t: number, vel = 0.45) {
  drumTone(dest, t, 240, 170, 0.14, vel * 0.32);
  strikeNoise(dest, t, 900, vel * 0.14, 0.05);
}

/** Dholak: bass + treble slap. */
export function dholak(dest: Dest, t: number, stroke: "bass" | "slap" | "both", vel = 0.5) {
  if (stroke !== "slap") drumTone(dest, t, 120, 72, 0.45, vel * 0.4);
  if (stroke !== "bass") {
    drumTone(dest, t, 420, 380, 0.12, vel * 0.18, "triangle");
    strikeNoise(dest, t, 2000, vel * 0.16, 0.05);
  }
}

/** Dhak: big ceremonial drum with stick attack. */
export function dhak(dest: Dest, t: number, accent: boolean, vel = 0.5) {
  drumTone(dest, t, accent ? 92 : 120, accent ? 48 : 70, accent ? 0.8 : 0.35, vel * (accent ? 0.5 : 0.3));
  strikeNoise(dest, t, accent ? 600 : 1400, vel * 0.2, 0.06);
}

/** Celestial shimmer note: soft high sine with slow swell. */
export function shimmer(dest: Dest, t: number, freq: number, dur: number, vel = 0.3) {
  const { ctx } = dest;
  const o = ctx.createOscillator();
  o.frequency.value = freq;
  const o2 = ctx.createOscillator();
  o2.frequency.value = freq * 1.003;
  const e = envGain(ctx, t, dur * 0.4, vel * 0.05, dur * 0.2, dur * 0.6);
  o.connect(e);
  o2.connect(e);
  connect(e, dest, 0.9);
  o.start(t);
  o2.start(t);
  o.stop(t + dur * 1.3);
  o2.stop(t + dur * 1.3);
}

/** Sustained drone pad (for mantra meditation). Returns a stop function. */
export function dronePad(dest: Dest, t: number, sa: number, vel = 0.4) {
  const { ctx } = dest;
  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 420;
  lp.Q.value = 0.7;
  const lfo = ctx.createOscillator();
  const lfoG = ctx.createGain();
  lfo.frequency.value = 0.07;
  lfoG.gain.value = 160;
  lfo.connect(lfoG).connect(lp.frequency);
  const amp = ctx.createGain();
  amp.gain.setValueAtTime(0.0001, t);
  amp.gain.exponentialRampToValueAtTime(vel * 0.14, t + 4);
  lp.connect(amp);
  connect(amp, dest, 0.6);
  const oscs: OscillatorNode[] = [];
  for (const [mult, det, type] of [
    [0.5, -4, "sawtooth"],
    [0.5, 4, "sawtooth"],
    [0.75, 0, "triangle"],
    [0.25, 0, "sine"],
  ] as [number, number, OscillatorType][]) {
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.value = sa * mult;
    o.detune.value = det;
    o.connect(lp);
    o.start(t);
    oscs.push(o);
  }
  lfo.start(t);
  return (at: number) => {
    amp.gain.cancelScheduledValues(at);
    amp.gain.setValueAtTime(amp.gain.value || vel * 0.14, at);
    amp.gain.exponentialRampToValueAtTime(0.0001, at + 1.5);
    for (const o of [...oscs, lfo]) o.stop(at + 1.6);
  };
}
