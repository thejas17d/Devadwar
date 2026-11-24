"use client";

import { useMemo } from "react";

const COLORS = ["#ff9f1c", "#ffb703", "#f77f00", "#e63946", "#ffd166", "#fb8500", "#ffcad4"];

/** A one-shot shower of marigold and rose petals. Remount (change `burst`) to replay. */
export function Petals({ count = 36, burst = 0 }: { count?: number; burst?: number }) {
  const petals = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 2.5,
        dur: 5 + Math.random() * 4,
        drift: (Math.random() - 0.5) * 220,
        spin: 300 + Math.random() * 600,
        color: COLORS[i % COLORS.length],
        scale: 0.6 + Math.random() * 0.8,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [count, burst],
  );
  return (
    <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden" aria-hidden="true" key={burst}>
      {petals.map((p, i) => (
        <span
          key={i}
          className="petal"
          style={{
            left: `${p.left}%`,
            background: `radial-gradient(circle at 30% 30%, #fff5 0, ${p.color} 45%, ${p.color})`,
            animationDuration: `${p.dur}s`,
            animationDelay: `${p.delay}s`,
            transform: `scale(${p.scale})`,
            ["--drift" as string]: `${p.drift}px`,
            ["--spin" as string]: `${p.spin}deg`,
          }}
        />
      ))}
    </div>
  );
}
