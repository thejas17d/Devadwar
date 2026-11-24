import type { Deity } from "@/lib/types";
import { DeityArt } from "./DeityArt";
import { Diya } from "../visual/Flame";
import { r2 } from "@/lib/num";

/**
 * The deity within an ornate prabhavali (arched halo) on a pedestal,
 * flanked by standing lamps, with a marigold toran above.
 */
export function Shrine({ deity, size = "lg", glowBoost = 0 }: { deity: Deity; size?: "md" | "lg" | "xl"; glowBoost?: number }) {
  const w = size === "xl" ? "min(86vw, 54dvh, 540px)" : size === "lg" ? "min(78vw, 46vh, 440px)" : "min(64vw, 34vh, 320px)";
  return (
    <div className="relative mx-auto" style={{ width: w }}>
      {/* aura */}
      <div
        className="absolute left-1/2 top-[42%] -z-0 aspect-square w-[140%] -translate-x-1/2 -translate-y-1/2 rounded-full transition-opacity duration-1000"
        style={{
          background: `radial-gradient(circle, color-mix(in srgb, ${deity.theme.glow} ${45 + glowBoost * 40}%, transparent) 0%, transparent 62%)`,
        }}
        aria-hidden="true"
      />
      <svg viewBox="0 0 300 380" className="relative w-full" aria-hidden="true">
        <defs>
          <linearGradient id="pr-gold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff0b8" />
            <stop offset="0.4" stopColor="#e2b55a" />
            <stop offset="0.75" stopColor="#9c6c1f" />
            <stop offset="1" stopColor="#e2b55a" />
          </linearGradient>
          <radialGradient id="pr-inner" cx="50%" cy="45%" r="60%">
            <stop offset="0" stopColor={deity.theme.glow} stopOpacity="0.35" />
            <stop offset="1" stopColor="#05071a" stopOpacity="0.55" />
          </radialGradient>
        </defs>
        {/* prabhavali: outer flame-edged arch */}
        <path
          d="M30 330 L30 150 C 30 60, 90 18, 150 10 C 210 18, 270 60, 270 150 L270 330"
          fill="url(#pr-inner)"
          stroke="url(#pr-gold)"
          strokeWidth="7"
        />
        <path d="M44 330 L44 152 C 44 74, 98 34, 150 26 C 202 34, 256 74, 256 152 L256 330" fill="none" stroke="#f3d98b" strokeOpacity="0.5" strokeWidth="1.5" />
        {Array.from({ length: 23 }, (_, i) => {
          // flames along the arch
          const t = i / 22;
          const ang = Math.PI * (1 - t);
          const x = r2(150 + Math.cos(ang) * 124);
          const y = r2(150 - Math.sin(ang) * 136);
          const rot = r2(90 - (ang * 180) / Math.PI);
          return <path key={i} d="M-5 0 Q 0 -16 5 0 Z" transform={`translate(${x} ${y}) rotate(${rot})`} fill="#ffcf70" opacity="0.9" />;
        })}
        {/* kirtimukha-esque crest */}
        <circle cx="150" cy="12" r="10" fill="url(#pr-gold)" stroke="#5a3a0c" />
        <circle cx="150" cy="12" r="4" fill="#c1121f" />
        {/* pedestal */}
        <path d="M60 330 L240 330 L250 346 L50 346 Z" fill="url(#pr-gold)" stroke="#5a3a0c" />
        <path d="M40 346 L260 346 L270 368 L30 368 Z" fill="url(#pr-gold)" stroke="#5a3a0c" />
        <path d="M40 357 L260 357" stroke="#5a3a0c" strokeOpacity="0.6" />
        {Array.from({ length: 11 }, (_, i) => (
          <circle key={i} cx={50 + i * 20} cy={357} r="2.6" fill="#c1121f" />
        ))}
        {/* marigold toran */}
        <path d="M44 70 Q 150 128 256 70" fill="none" stroke="#f08a24" strokeWidth="0" />
        {Array.from({ length: 17 }, (_, i) => {
          const t = i / 16;
          const x = 50 + t * 200;
          const y = r2(64 + Math.sin(t * Math.PI) * 30);
          return <circle key={i} cx={x} cy={y} r="6.5" fill={i % 2 ? "#ff9f1c" : "#ffbe0b"} stroke="#b5560a" strokeWidth="0.8" />;
        })}
        {[0, 4, 8, 12, 16].map((i) => {
          const t = i / 16;
          const x = 50 + t * 200;
          const y = r2(64 + Math.sin(t * Math.PI) * 30);
          return (
            <g key={i}>
              <path d={`M${x} ${y} L${x} ${y + 26}`} stroke="#4f8a3a" strokeWidth="2" />
              <circle cx={x} cy={y + 14} r="4.5" fill="#ff9f1c" />
              <circle cx={x} cy={y + 26} r="5" fill="#e63946" />
            </g>
          );
        })}
      </svg>
      {/* deity art inside the arch */}
      <div className="absolute left-[16%] right-[16%] top-[19%] bottom-[14%] flex items-end justify-center">
        <DeityArt deity={deity} className="h-full w-full drop-shadow-[0_0_18px_rgba(255,220,150,0.35)]" priority />
      </div>
      {/* standing lamps */}
      <div className="absolute -left-[6%] bottom-[2%]">
        <Diya size={size === "md" ? 40 : 54} delay={0.3} />
      </div>
      <div className="absolute -right-[6%] bottom-[2%]">
        <Diya size={size === "md" ? 40 : 54} delay={1.1} />
      </div>
    </div>
  );
}
