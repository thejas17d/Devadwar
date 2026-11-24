/**
 * Generative devotional composer.
 *
 * Interprets a ProceduralSource (raga pitch-set, tonic, tempo, instruments)
 * and plays an endless, gently varying composition using a look-ahead
 * scheduler (events are scheduled ~0.3 s ahead on the AudioContext clock,
 * which keeps timing tight even when the main thread is busy).
 *
 * Melodies come from a seeded random walk over the raga's notes, resolving on
 * stable notes (Sa / Pa), so each deity's soundscape is consistent across
 * visits yet never loops audibly.
 */
import type { ProceduralSource, LeadInstrument } from "../types";
import * as I from "./instruments";

export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const semis = (base: number, s: number) => base * Math.pow(2, s / 12);

interface Layer {
  next: number;
  fire(t: number): number; // schedules events at t and returns the next fire time
}

const LOOKAHEAD = 0.35;

export class Composition {
  private layers: Layer[] = [];
  private timer: ReturnType<typeof setInterval> | null = null;
  private stops: ((at: number) => void)[] = [];
  private rng: () => number;
  private spb: number;
  private dest: I.Dest;
  private notes: number[]; // semitone offsets usable by the melody
  stopped = false;

  constructor(
    ctx: BaseAudioContext,
    out: AudioNode,
    send: AudioNode,
    private src: ProceduralSource,
  ) {
    this.dest = { ctx, out, send };
    this.rng = mulberry32(src.seed);
    this.spb = 60 / src.tempo;
    const notes: number[] = [];
    for (const oct of [-12, 0, 12]) for (const s of src.scale) notes.push(s + oct);
    notes.push(24);
    // usable range: Pa below Sa (-5) up to Ga/Ma above upper Sa (+17)
    this.notes = notes.filter((n) => n >= -5 && n <= 17).sort((a, b) => a - b);
  }

  private get ctx() {
    return this.dest.ctx;
  }

  /**
   * @param realtime false = no timer; call scheduleUntil() yourself (offline
   *        rendering for tests or exporting a composition to an audio file).
   */
  start(at = this.ctx.currentTime + 0.1, realtime = true) {
    const s = this.src;
    const style = s.style;

    if (s.shankha && style === "aarti") {
      I.shankha(this.dest, at, semis(s.tonic, 12) * 1.0, 3.4, 0.6);
      at += 2.6;
    }
    if (style === "mantra" || style === "celestial") {
      this.stops.push(I.dronePad(this.dest, at, s.tonic, style === "mantra" ? 0.55 : 0.3));
    }
    this.layers.push(this.tanpuraLayer(at));
    if (style === "celestial") this.layers.push(this.shimmerLayer(at + 1.5));
    if (s.lead !== "none" && style !== "mantra" && style !== "celestial") this.layers.push(this.leadLayer(at + this.spb * 4));
    if (s.percussion !== "none") this.layers.push(this.percussionLayer(at + this.spb * (style === "aarti" ? 0 : 8)));
    if (s.bells !== "none") this.layers.push(this.bellLayer(at + 0.5));

    if (!realtime) return;
    this.tick();
    this.timer = setInterval(() => this.tick(), 60);
  }

  /** Offline mode: schedule every event up to `until` seconds. */
  scheduleUntil(until: number) {
    for (const l of this.layers) {
      let guard = 0;
      while (l.next < until && guard++ < 100000) l.next = l.fire(l.next);
    }
  }

  stop(at = this.ctx.currentTime) {
    this.stopped = true;
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    for (const s of this.stops) s(at);
    this.stops = [];
  }

  private tick() {
    if (this.stopped) return;
    const horizon = this.ctx.currentTime + LOOKAHEAD;
    for (const l of this.layers) {
      let guard = 0;
      while (l.next < horizon && guard++ < 32) {
        // never schedule in the past (e.g. after a tab was suspended)
        if (l.next < this.ctx.currentTime - 0.05) l.next = this.ctx.currentTime + 0.02;
        l.next = l.fire(l.next);
      }
    }
  }

  // ── layers ───────────────────────────────────────────────────

  private tanpuraLayer(at: number): Layer {
    const sa = this.src.tonic;
    // Classic tuning: Pa (or Ma/Ni if Pa absent), Sa', Sa', Sa (low)
    const scale = this.src.scale;
    const firstString = scale.includes(7) ? 7 - 12 : scale.includes(5) ? 5 - 12 : 11 - 12;
    const strings = [semis(sa, firstString), sa, sa, sa * 0.5];
    let i = 0;
    const gap = this.src.style === "aarti" ? 0.75 : 1.05;
    const vel = this.src.style === "aarti" ? 0.35 : 0.5;
    return {
      next: at,
      fire: (t) => {
        I.tanpura(this.dest, t, strings[i % 4], vel * (i % 4 === 0 ? 0.9 : 1));
        i++;
        return t + (i % 4 === 0 ? gap * 1.6 : gap);
      },
    };
  }

  private shimmerLayer(at: number): Layer {
    return {
      next: at,
      fire: (t) => {
        const n = this.src.scale[Math.floor(this.rng() * this.src.scale.length)];
        I.shimmer(this.dest, t, semis(this.src.tonic * 4, n), 4 + this.rng() * 3, 0.45);
        if (this.rng() < 0.35) I.chime(this.dest, t + 1.2, semis(this.src.tonic * 8, n), 0.18);
        return t + 2.5 + this.rng() * 3.5;
      },
    };
  }

  private leadLayer(at: number): Layer {
    const s = this.src;
    const density = s.density ?? 0.5;
    const aarti = s.style === "aarti";
    const play = (inst: LeadInstrument, t: number, f: number, dur: number, vel: number, from?: number) => {
      if (inst === "bansuri") I.bansuri(this.dest, t, f, dur, vel, from);
      else if (inst === "veena") I.veena(this.dest, t, f, dur, vel, from);
      else if (inst === "nadaswaram") I.nadaswaram(this.dest, t, f, dur, vel, from);
    };
    const baseFor = (inst: LeadInstrument) => (inst === "bansuri" ? s.tonic * 4 : s.tonic * 2);

    const centre = this.notes.indexOf(0) >= 0 ? this.notes.indexOf(0) : Math.floor(this.notes.length / 2);
    let idx = centre + Math.floor(this.rng() * 3);
    let prevFreq: number | undefined;
    let phrase: { semi: number; beats: number }[] = [];
    let inst: LeadInstrument = s.lead;

    const newPhrase = () => {
      inst = s.lead2 && this.rng() < 0.4 ? s.lead2 : s.lead;
      const len = 3 + Math.floor(this.rng() * (aarti ? 6 : 5));
      const out: { semi: number; beats: number }[] = [];
      const durs = aarti ? [0.5, 0.5, 1, 1, 1, 2] : [0.5, 1, 1, 1.5, 2, 2, 3];
      for (let k = 0; k < len; k++) {
        const r = this.rng();
        const step = r < 0.35 ? 1 : r < 0.7 ? -1 : r < 0.82 ? 2 : r < 0.94 ? -2 : 0;
        // gravitate back toward the centre of the range
        const pull = idx > centre + 5 ? -1 : idx < centre - 3 ? 1 : 0;
        idx = Math.min(this.notes.length - 1, Math.max(0, idx + step + (this.rng() < 0.3 ? pull : 0)));
        out.push({ semi: this.notes[idx], beats: durs[Math.floor(this.rng() * durs.length)] });
      }
      // resolve on a stable note (Sa, Pa or upper Sa) and hold it
      const stable = [0, 12, ...(s.scale.includes(7) ? [7] : [])];
      const last = out[out.length - 1].semi;
      const target = stable.reduce((a, b) => (Math.abs(b - last) < Math.abs(a - last) ? b : a));
      idx = Math.max(0, this.notes.indexOf(target));
      out.push({ semi: target, beats: aarti ? 2 : 3 + Math.floor(this.rng() * 2) });
      return out;
    };

    return {
      next: at,
      fire: (t) => {
        if (phrase.length === 0) phrase = newPhrase();
        const n = phrase.shift()!;
        const f = semis(baseFor(inst), n.semi);
        const dur = n.beats * this.spb;
        const vel = (aarti ? 0.6 : 0.5) * (0.85 + this.rng() * 0.3);
        play(inst, t, f, dur * 0.95, vel, prevFreq && this.rng() < 0.55 ? prevFreq : undefined);
        prevFreq = f;
        let next = t + dur;
        if (phrase.length === 0) {
          prevFreq = undefined;
          const restBeats = aarti ? 1 + Math.floor(this.rng() * 3) : (2 + this.rng() * 6) * (1.4 - density);
          next += restBeats * this.spb;
        }
        return next;
      },
    };
  }

  private percussionLayer(at: number): Layer {
    const s = this.src;
    const aarti = s.style === "aarti";
    const half = this.spb / 2;
    let step = 0;
    let cycle = 0;
    const soft = s.style === "ambient" || s.style === "mantra";
    const v = aarti ? 0.6 : soft ? 0.35 : 0.5;
    const sa = s.tonic * 2;

    // Patterns in half-beat steps. Keherwa (8 beats) for tabla.
    const keherwa: (I.TablaBol | null)[] = ["dha", null, "ge", null, "na", null, "tin", null, "na", null, "ka", null, "dhi", null, "na", null];
    const aartiTabla: (I.TablaBol | null)[] = ["dha", "ge", "na", "tin", "na", "ka", "dhi", "na"];

    return {
      next: at,
      fire: (t) => {
        const swing = (this.rng() - 0.5) * 0.012;
        switch (s.percussion) {
          case "tabla": {
            const pat = aarti ? aartiTabla : keherwa;
            const bol = pat[step % pat.length];
            // ambient: play 3 cycles, rest 1
            const resting = !aarti && Math.floor(step / pat.length) % 4 === 3;
            if (bol && !resting) I.tabla(this.dest, t + swing, bol, sa, v * (step % pat.length === 0 ? 1.2 : 1));
            break;
          }
          case "damaru": {
            // da-ra-ra rolls: in ambient/mantra an accent roll every 4 bars
            const len = aarti ? 4 : 32;
            const pos = step % len;
            if (aarti ? pos !== 3 : pos < 3) {
              I.damaru(this.dest, t, v);
              I.damaru(this.dest, t + half / 3, v * 0.7);
              I.damaru(this.dest, t + (2 * half) / 3, v * 0.7);
            }
            break;
          }
          case "dholak": {
            const pat = ["both", null, "slap", "bass", "slap", null, "bass", "slap"] as const;
            const st = pat[step % pat.length];
            if (st) I.dholak(this.dest, t + swing, st, v);
            break;
          }
          case "dhak": {
            const pat = [true, null, false, false, true, false, null, false] as const;
            const st = pat[step % pat.length];
            if (st !== null && (aarti || cycle % 3 !== 2)) I.dhak(this.dest, t + swing, st, v);
            break;
          }
        }
        step++;
        if (step % 16 === 0) cycle++;
        return t + half;
      },
    };
  }

  private bellLayer(at: number): Layer {
    const s = this.src;
    const half = this.spb / 2;
    let step = 0;
    return {
      next: at,
      fire: (t) => {
        if (s.bells === "aarti") {
          // continuous hand-bell, manjira on the beat, temple bell every 2 bars
          I.ghanti(this.dest, t, step % 2 ? 1490 : 1555, 0.45 + this.rng() * 0.15);
          if (step % 2 === 0) I.manjira(this.dest, t, 0.4, step % 4 === 0);
          if (step % 16 === 0) I.templeBell(this.dest, t, semis(s.tonic * 2, 0), 0.5, 5);
          step++;
          return t + half;
        }
        const big = s.bells === "temple" ? this.rng() < 0.6 : this.rng() < 0.35;
        if (big) I.templeBell(this.dest, t, semis(s.tonic * 2, 0), 0.38, 7);
        else I.chime(this.dest, t, semis(s.tonic * 8, s.scale[Math.floor(this.rng() * s.scale.length)]), 0.25);
        if (s.bells === "temple" && this.rng() < 0.3) I.templeBell(this.dest, t + 0.9, semis(s.tonic * 2, 0), 0.25, 6);
        const gap = s.bells === "temple" ? 7 + this.rng() * 7 : 10 + this.rng() * 12;
        return t + gap;
      },
    };
  }
}
