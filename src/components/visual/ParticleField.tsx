"use client";

import { useEffect, useRef } from "react";
import { glowSprite } from "@/lib/sprites";

interface Props {
  stars?: number;
  motes?: number;
  moteColor?: string; // "r,g,b"
  className?: string;
}

/**
 * Lightweight Canvas2D star + floating-mote field. Caps DPR, scales particle
 * counts to screen size, pauses when off-screen or the tab is hidden, and
 * renders a single static frame for prefers-reduced-motion.
 */
export function ParticleField({ stars = 90, motes = 26, moteColor = "255,214,140", className = "" }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let w = 0,
      h = 0,
      raf = 0,
      running = true,
      visible = true;

    type Star = { x: number; y: number; r: number; p: number; s: number };
    type Mote = { x: number; y: number; r: number; vy: number; sway: number; p: number; life: number };
    const sprite = glowSprite(moteColor, 48);
    let S: Star[] = [];
    let M: Mote[] = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const area = Math.min(1.4, (w * h) / (1280 * 800));
      const ns = Math.round(stars * Math.max(0.45, area));
      const nm = Math.round(motes * Math.max(0.5, area));
      S = Array.from({ length: ns }, () => ({ x: Math.random() * w, y: Math.random() * h * 0.85, r: Math.random() * 1.2 + 0.3, p: Math.random() * 6.28, s: 0.5 + Math.random() * 1.5 }));
      M = Array.from({ length: nm }, () => newMote(true));
    };
    const newMote = (anywhere = false): Mote => ({
      x: Math.random() * w,
      y: anywhere ? Math.random() * h : h + 10,
      r: Math.random() * 1.8 + 0.6,
      vy: 0.12 + Math.random() * 0.35,
      sway: 0.3 + Math.random() * 0.8,
      p: Math.random() * 6.28,
      life: 0,
    });

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      const time = t / 1000;
      for (const s of S) {
        const a = reduce ? 0.7 : 0.45 + 0.55 * Math.abs(Math.sin(time * s.s + s.p));
        ctx.fillStyle = `rgba(255,248,230,${a * 0.85})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, 6.283);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < M.length; i++) {
        const m = M[i];
        if (!reduce) {
          m.y -= m.vy;
          m.life += 1;
          m.x += Math.sin(time * m.sway + m.p) * 0.25;
          if (m.y < -10) M[i] = newMote();
        }
        const a = Math.min(1, m.life / 60) * (0.35 + 0.35 * Math.sin(time * 2 + m.p));
        const rr = m.r * 5;
        ctx.globalAlpha = Math.max(0, 0.85 * Math.max(a, reduce ? 0.5 : 0));
        ctx.drawImage(sprite, m.x - rr, m.y - rr, rr * 2, rr * 2);
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    };

    // Ambient stars/motes don't need 60 fps — 30 fps halves the cost (and battery use).
    let last = 0;
    const loop = (t: number) => {
      if (!running) return;
      if (visible && !document.hidden && t - last >= 33) {
        last = t;
        draw(t);
      }
      raf = requestAnimationFrame(loop);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(canvas);
    if (reduce) draw(0);
    else raf = requestAnimationFrame(loop);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [stars, motes, moteColor]);

  return <canvas ref={ref} className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} aria-hidden="true" />;
}
