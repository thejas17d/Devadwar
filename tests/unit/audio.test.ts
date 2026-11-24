/**
 * Renders every procedural soundscape offline (node-web-audio-api) and checks
 * it is audible, does not clip and contains no NaN/Infinity — a mechanical
 * proxy for "the music actually plays" since tests can't listen.
 */
import { describe, expect, it } from "vitest";
import { OfflineAudioContext } from "node-web-audio-api";
import { Composition } from "@/lib/audio/composer";
import { getAudioManifest } from "@/lib/content";
import type { ProceduralSource } from "@/lib/types";

const SR = 22050;
const SECONDS = 14;

async function render(src: ProceduralSource) {
  const ctx = new OfflineAudioContext(2, SR * SECONDS, SR) as unknown as BaseAudioContext & { startRendering(): Promise<AudioBuffer> };
  const out = ctx.createGain();
  out.gain.value = 0.85;
  out.connect(ctx.destination);
  const conv = ctx.createConvolver();
  const ir = ctx.createBuffer(2, SR * 1.5, SR);
  for (let c = 0; c < 2; c++) {
    const d = ir.getChannelData(c);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 2.6);
  }
  conv.buffer = ir;
  const rev = ctx.createGain();
  rev.gain.value = 0.55;
  conv.connect(rev).connect(ctx.destination);
  const comp = new Composition(ctx, out, conv, src);
  comp.start(0.05, false);
  comp.scheduleUntil(SECONDS);
  const buf = await ctx.startRendering();
  const d = buf.getChannelData(0);
  let peak = 0,
    sum = 0,
    bad = 0;
  for (let i = 0; i < d.length; i++) {
    const v = d[i];
    if (!Number.isFinite(v)) bad++;
    else {
      peak = Math.max(peak, Math.abs(v));
      sum += v * v;
    }
  }
  return { peak, rms: Math.sqrt(sum / d.length), bad };
}

describe("procedural soundscapes render cleanly", () => {
  const tracks = getAudioManifest().tracks.filter((t) => t.source.type === "procedural");
  for (const t of tracks) {
    it(`${t.id}`, async () => {
      const r = await render(t.source as ProceduralSource);
      expect(r.bad, "NaN/Infinity samples").toBe(0);
      expect(r.rms, "audible").toBeGreaterThan(0.004);
      expect(r.peak, "headroom before master compressor").toBeLessThan(1.0);
    }, 60_000);
  }
});
