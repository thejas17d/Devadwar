"use client";

import { useEffect, useRef } from "react";
import { glowSprite } from "@/lib/sprites";

export interface Emitter {
  x: number;
  y: number;
  active: boolean;
  /** 0..1 — brightens the glow (e.g. as rounds complete). */
  intensity: number;
  /** number of wicks: 1 or 5 (pancha-arati) laid out around the emitter */
  wicks: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  size: number;
  kind: 0 | 1; // 0 = flame lick, 1 = ember
}

const WICK_OFFSETS: Record<number, [number, number][]> = {
  1: [[0, 0]],
  // centre wick first, then the four around it (matches AartiThali at size 132)
  5: [
    [0, 0],
    [-12, 6],
    [12, 6],
    [-7, 12],
    [7, 12],
  ],
};

/**
 * Full-stage canvas that renders realistic lamp flames at a moving emitter.
 * The flame leans against the direction of motion, sheds embers when moved
 * quickly and leaves a short trail of light. Driven by a mutable ref — no
 * React re-renders per frame.
 */
export function FlameCanvas({ emitter }: { emitter: React.MutableRefObject<Emitter> }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lowPower = (navigator.hardwareConcurrency || 4) <= 4;
    const dpr = Math.min(window.devicePixelRatio || 1, lowPower ? 1.25 : 1.75);
    const MAX = lowPower ? 140 : 260;
    let w = 0,
      h = 0,
      raf = 0,
      alive = true;
    const P: Particle[] = [];
    let px = emitter.current.x,
      py = emitter.current.y,
      vx = 0,
      vy = 0;
    const trail: { x: number; y: number; a: number }[] = [];
    const sGlow = glowSprite("255,170,70", 128);
    const sTrail = glowSprite("255,205,120", 32);
    const sLick = glowSprite("255,150,60", 32, 0.2);

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // The flame body is rendered ONCE into a sprite; per frame we only apply
    // skew (lean against motion) and scale (flicker). Far cheaper than building
    // gradients for every wick on every frame.
    const FW = 32, FH = 40, BASE_X = 16, BASE_Y = 34, RES = 3;
    const flameSprite = (() => {
      const c = document.createElement("canvas");
      c.width = FW * RES;
      c.height = FH * RES;
      const g = c.getContext("2d")!;
      g.scale(RES, RES);
      const x = BASE_X, y = BASE_Y, H = 30, W = 8.5;
      const layer = (wm: number, hm: number, stops: [number, string][]) => {
        const hh = H * hm, ww = W * wm, ty = y - hh;
        const gr = g.createRadialGradient(x, y - hh * 0.22, 0, x, y - hh * 0.35, hh * 0.85);
        for (const [o, col] of stops) gr.addColorStop(o, col);
        g.fillStyle = gr;
        g.beginPath();
        g.moveTo(x, y + ww * 0.35);
        g.bezierCurveTo(x - ww * 1.25, y, x - ww * 0.6, ty + hh * 0.45, x, ty);
        g.bezierCurveTo(x + ww * 0.6, ty + hh * 0.45, x + ww * 1.25, y, x, y + ww * 0.35);
        g.fill();
      };
      g.globalCompositeOperation = "lighter";
      layer(1.25, 1, [
        [0, "rgba(255,200,90,0.85)"],
        [0.55, "rgba(255,120,30,0.55)"],
        [1, "rgba(200,40,0,0)"],
      ]);
      layer(0.85, 0.78, [
        [0, "rgba(255,255,235,1)"],
        [0.4, "rgba(255,226,120,0.95)"],
        [1, "rgba(255,150,40,0)"],
      ]);
      const b = g.createRadialGradient(x, y, 0, x, y, W * 0.9);
      b.addColorStop(0, "rgba(140,190,255,0.55)");
      b.addColorStop(1, "rgba(80,120,255,0)");
      g.fillStyle = b;
      g.beginPath();
      g.arc(x, y, W * 0.9, 0, 6.283);
      g.fill();
      return c;
    })();

    const drawFlame = (x: number, y: number, scale: number, lean: number, t: number, seed: number) => {
      const flick = Math.sin(t * 13 + seed) * 0.06 + Math.sin(t * 7.3 + seed * 2) * 0.05 + Math.sin(t * 23 + seed) * 0.03;
      const sx = scale * (1 - flick * 0.5);
      const sy = scale * (1 + flick);
      const sway = Math.sin(t * 9 + seed) * 0.04;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.translate(x, y);
      ctx.transform(1, 0, -(lean + sway), 1, 0, 0); // skew so the tip leans
      ctx.drawImage(flameSprite, -BASE_X * sx, -BASE_Y * sy, FW * sx, FH * sy);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const frame = (now: number) => {
      if (!alive) return;
      raf = requestAnimationFrame(frame);
      if (document.hidden) return;
      const t = now / 1000;
      const e = emitter.current;
      // smoothed velocity
      const nvx = e.x - px;
      const nvy = e.y - py;
      vx = vx * 0.75 + nvx * 0.25;
      vy = vy * 0.75 + nvy * 0.25;
      px = e.x;
      py = e.y;
      const speed = Math.hypot(vx, vy);

      ctx.clearRect(0, 0, w, h);
      if (!e.active) return;
      ctx.globalCompositeOperation = "lighter";

      // ambient glow
      const gr = 120 + e.intensity * 120;
      ctx.globalAlpha = Math.min(1, 0.55 + e.intensity * 0.35);
      ctx.drawImage(sGlow, e.x - gr, e.y - 14 - gr, gr * 2, gr * 2);
      ctx.globalAlpha = 1;

      // light trail
      if (!reduce) {
        if (speed > 1.2) trail.push({ x: e.x, y: e.y - 18, a: Math.min(1, speed / 14) });
        for (let i = trail.length - 1; i >= 0; i--) {
          const p = trail[i];
          p.a *= 0.93;
          if (p.a < 0.02) {
            trail.splice(i, 1);
            continue;
          }
          ctx.globalAlpha = p.a * 0.5;
          ctx.drawImage(sTrail, p.x - 14, p.y - 14, 28, 28);
        }
        ctx.globalAlpha = 1;
        if (trail.length > 60) trail.splice(0, trail.length - 60);
      }

      const lean = Math.max(-0.9, Math.min(0.9, -vx * 0.06));
      const offsets = WICK_OFFSETS[e.wicks] ?? WICK_OFFSETS[1];
      offsets.forEach(([ox, oy], i) => {
        const wx = e.x + ox;
        const wy = e.y + oy;
        // particles
        if (!reduce && P.length < MAX) {
          const n = 1 + (speed > 4 ? 2 : 0);
          for (let k = 0; k < n; k++) {
            const ember = Math.random() < 0.08 + Math.min(0.25, speed / 60);
            P.push({
              x: wx + (Math.random() - 0.5) * 4,
              y: wy - 8,
              vx: (Math.random() - 0.5) * 0.5 - vx * (ember ? 0.12 : 0.04),
              vy: -0.6 - Math.random() * (ember ? 1.6 : 0.9) - vy * 0.05,
              life: 0,
              max: ember ? 40 + Math.random() * 40 : 14 + Math.random() * 12,
              size: ember ? 1 + Math.random() * 1.4 : 3 + Math.random() * 3,
              kind: ember ? 1 : 0,
            });
          }
        }
        drawFlame(wx, wy, offsets.length > 1 ? 0.78 : 1.15, lean, t, i * 1.7);
      });

      for (let i = P.length - 1; i >= 0; i--) {
        const p = P[i];
        p.life++;
        if (p.life > p.max) {
          P.splice(i, 1);
          continue;
        }
        p.x += p.vx + (p.kind ? Math.sin(t * 6 + i) * 0.3 : 0);
        p.y += p.vy;
        p.vy -= p.kind ? 0.005 : 0.03;
        const k = 1 - p.life / p.max;
        if (p.kind) {
          ctx.fillStyle = `rgba(255,${180 + 60 * k | 0},${90 * k | 0},${k})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * k + 0.3, 0, 6.283);
          ctx.fill();
        } else {
          const r = p.size * (0.6 + k * 0.6);
          ctx.globalAlpha = 0.4 * k;
          ctx.drawImage(sLick, p.x - r, p.y - r, r * 2, r * 2);
          ctx.globalAlpha = 1;
        }
      }
      ctx.globalCompositeOperation = "source-over";
    };
    raf = requestAnimationFrame(frame);
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [emitter]);

  return <canvas ref={ref} className="pointer-events-none absolute inset-0 z-20 h-full w-full" aria-hidden="true" />;
}
