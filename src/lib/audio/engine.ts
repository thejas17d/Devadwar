/**
 * AudioEngine — one AudioContext for the whole site.
 *
 *   music ─┐                    ┌─> reverb ─┐
 *          ├─> (dry + send) ────┤           ├─> master ─> compressor ─> speakers
 *   sfx ───┘                    └───────────┘
 *
 * The context is only created inside a user gesture (`unlock`), so nothing can
 * ever autoplay. Music and sound effects have independent on/off switches.
 */
import type { Track } from "../types";
import { Composition } from "./composer";
import * as I from "./instruments";

export type SfxName = "bell" | "ghanti" | "chime" | "gong" | "shankha" | "manjira";

interface Playing {
  track: Track;
  gain: GainNode;
  comp?: Composition;
  media?: HTMLAudioElement;
}

function makeImpulse(ctx: AudioContext, seconds = 2.8, decay = 2.6) {
  const len = Math.floor(ctx.sampleRate * seconds);
  const buf = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let c = 0; c < 2; c++) {
    const d = buf.getChannelData(c);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
  }
  return buf;
}

export class AudioEngine {
  ctx: AudioContext | null = null;
  private master!: GainNode;
  private musicBus!: GainNode;
  private sfxBus!: GainNode;
  private reverb!: ConvolverNode;
  private current: Playing | null = null;
  private volume = 0.8;
  private muted = false;
  private musicEnabled = true;
  private sfxEnabled = true;
  private onVisibility = () => this.handleVisibility();
  private suspendedByVisibility = false;

  get unlocked() {
    return !!this.ctx;
  }

  /** Must be called from a user gesture (click / tap / key). */
  async unlock(): Promise<boolean> {
    if (typeof window === "undefined") return false;
    try {
      if (!this.ctx) {
        const Ctor: typeof AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!Ctor) return false;
        // iOS: play through the ringer/silent switch (Safari 16.4+).
        try {
          const nav = navigator as any;
          if (nav.audioSession) nav.audioSession.type = "playback";
        } catch {}
        const ctx = new Ctor({ latencyHint: "playback" });
        this.ctx = ctx;
        const comp = ctx.createDynamicsCompressor();
        comp.threshold.value = -14;
        comp.ratio.value = 3;
        this.master = ctx.createGain();
        this.master.connect(comp).connect(ctx.destination);
        this.reverb = ctx.createConvolver();
        this.reverb.buffer = makeImpulse(ctx);
        const revOut = ctx.createGain();
        revOut.gain.value = 0.55;
        this.reverb.connect(revOut).connect(this.master);
        this.musicBus = ctx.createGain();
        this.sfxBus = ctx.createGain();
        this.musicBus.connect(this.master);
        this.sfxBus.connect(this.master);
        this.applyLevels(0);
        document.addEventListener("visibilitychange", this.onVisibility);
      }
      if (this.ctx.state !== "running") await this.ctx.resume();
      return this.ctx.state === "running";
    } catch (e) {
      console.warn("[audio] unlock failed", e);
      return false;
    }
  }

  private handleVisibility() {
    if (!this.ctx) return;
    if (document.hidden) {
      if (this.ctx.state === "running") {
        this.suspendedByVisibility = true;
        this.ctx.suspend().catch(() => {});
      }
    } else if (this.suspendedByVisibility) {
      this.suspendedByVisibility = false;
      this.ctx.resume().catch(() => {});
    }
  }

  private applyLevels(ramp = 0.25) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const set = (p: AudioParam, v: number) => {
      p.cancelScheduledValues(t);
      p.setValueAtTime(p.value, t);
      p.linearRampToValueAtTime(v, t + ramp);
    };
    set(this.master.gain, this.muted ? 0 : this.volume);
    set(this.musicBus.gain, this.musicEnabled ? 0.85 : 0);
    set(this.sfxBus.gain, this.sfxEnabled ? 1 : 0);
  }

  setVolume(v: number) {
    this.volume = Math.max(0, Math.min(1, v));
    this.applyLevels();
  }
  setMuted(m: boolean) {
    this.muted = m;
    this.applyLevels();
  }
  setMusicEnabled(b: boolean) {
    this.musicEnabled = b;
    this.applyLevels(0.6);
  }
  setSfxEnabled(b: boolean) {
    this.sfxEnabled = b;
    this.applyLevels();
  }

  get currentTrackId() {
    return this.current?.track.id ?? null;
  }

  /** Cross-fades to a track. Uncleared tracks are refused. */
  playTrack(track: Track, fade = 2) {
    if (!this.ctx) return;
    if (!track.cleared) {
      console.warn(`[audio] refusing to play uncleared track ${track.id}`);
      return;
    }
    if (this.current?.track.id === track.id) return;
    this.stopMusic(fade);
    const ctx = this.ctx;
    const t = ctx.currentTime;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(1, t + fade);
    gain.connect(this.musicBus);
    const send = ctx.createGain();
    send.gain.value = 1;
    send.connect(this.reverb);
    const playing: Playing = { track, gain };
    if (track.source.type === "procedural") {
      const comp = new Composition(ctx, gain, send, track.source);
      comp.start(t + 0.05);
      playing.comp = comp;
    } else {
      const el = new Audio(track.source.src);
      el.loop = true;
      el.crossOrigin = "anonymous";
      const node = ctx.createMediaElementSource(el);
      node.connect(gain);
      el.play().catch((e) => console.warn("[audio] file playback failed", e));
      playing.media = el;
    }
    this.current = playing;
  }

  stopMusic(fade = 1.5) {
    const cur = this.current;
    if (!cur || !this.ctx) return;
    this.current = null;
    const t = this.ctx.currentTime;
    cur.gain.gain.cancelScheduledValues(t);
    cur.gain.gain.setValueAtTime(Math.max(cur.gain.gain.value, 0.0001), t);
    cur.gain.gain.exponentialRampToValueAtTime(0.0001, t + fade);
    cur.comp?.stop(t + fade);
    setTimeout(() => {
      cur.media?.pause();
      try {
        cur.gain.disconnect();
      } catch {}
    }, (fade + 2.5) * 1000);
  }

  sfx(name: SfxName, opts: { pitch?: number; vel?: number } = {}) {
    if (!this.ctx || !this.sfxEnabled || this.muted || this.ctx.state !== "running") return;
    const send = this.ctx.createGain();
    send.gain.value = 1;
    send.connect(this.reverb);
    const dest: I.Dest = { ctx: this.ctx, out: this.sfxBus, send };
    const t = this.ctx.currentTime + 0.01;
    const v = opts.vel ?? 0.6;
    switch (name) {
      case "bell":
        I.templeBell(dest, t, opts.pitch ?? 277, v, 6);
        break;
      case "ghanti":
        I.ghanti(dest, t, opts.pitch ?? 1550, v);
        break;
      case "chime":
        I.chime(dest, t, opts.pitch ?? 1320, v);
        break;
      case "gong":
        I.gong(dest, t, opts.pitch ?? 72, v);
        break;
      case "shankha":
        I.shankha(dest, t, opts.pitch ?? 330, 3.2, v);
        break;
      case "manjira":
        I.manjira(dest, t, v, true);
        break;
    }
  }
}

let singleton: AudioEngine | null = null;
export function getEngine() {
  if (!singleton) singleton = new AudioEngine();
  return singleton;
}
