import type { DeityTheme, Motif } from "@/lib/types";
import { ParticleField } from "../visual/ParticleField";

function hexToRgb(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
}

/** Silhouette landscapes that give each deity a traditional environment. */
function MotifLayer({ motif, accent }: { motif: Motif; accent: string }) {
  const dark = "#05071a";
  const mid = "rgba(5,7,26,0.75)";
  switch (motif) {
    case "kailash":
      return (
        <svg viewBox="0 0 1200 400" preserveAspectRatio="xMidYMax slice" className="h-full w-full">
          <path d="M0 400 L0 260 L160 170 L260 230 L420 90 L520 150 L600 60 L700 150 L820 110 L960 210 L1080 160 L1200 230 L1200 400 Z" fill="#1c2a4a" />
          <path d="M420 90 L470 140 L440 135 L400 110 Z M600 60 L650 112 L612 104 L575 85 Z M820 110 L860 140 L830 138 Z" fill="#e8f0ff" opacity="0.85" />
          <path d="M0 400 L0 320 L200 260 L380 310 L560 240 L760 300 L960 250 L1200 320 L1200 400 Z" fill={dark} />
        </svg>
      );
    case "ocean":
      return (
        <svg viewBox="0 0 1200 400" preserveAspectRatio="xMidYMax slice" className="h-full w-full">
          {[0, 1, 2, 3].map((i) => (
            <path
              key={i}
              d={`M0 ${230 + i * 45} Q 75 ${210 + i * 45} 150 ${230 + i * 45} T 300 ${230 + i * 45} T 450 ${230 + i * 45} T 600 ${230 + i * 45} T 750 ${230 + i * 45} T 900 ${230 + i * 45} T 1050 ${230 + i * 45} T 1200 ${230 + i * 45} L1200 400 L0 400 Z`}
              fill={i === 3 ? dark : `rgba(10,40,80,${0.45 + i * 0.15})`}
              stroke={accent}
              strokeOpacity={0.25 - i * 0.05}
            />
          ))}
        </svg>
      );
    case "vrindavan":
      return (
        <svg viewBox="0 0 1200 400" preserveAspectRatio="xMidYMax slice" className="h-full w-full">
          <path d="M0 330 Q 300 300 600 330 T 1200 320 L1200 400 L0 400 Z" fill="rgba(40,110,120,0.5)" />
          {[80, 230, 960, 1110].map((x, i) => (
            <g key={x} fill={dark}>
              <rect x={x - 8} y={190 + (i % 2) * 20} width="16" height="160" />
              <ellipse cx={x} cy={170 + (i % 2) * 20} rx="90" ry="70" />
              <ellipse cx={x - 50} cy={210 + (i % 2) * 20} rx="60" ry="45" />
              <ellipse cx={x + 55} cy={205 + (i % 2) * 20} rx="60" ry="45" />
            </g>
          ))}
          <path d="M0 360 Q 300 340 600 360 T 1200 355 L1200 400 L0 400 Z" fill={dark} />
        </svg>
      );
    case "sunrise":
      return (
        <svg viewBox="0 0 1200 400" preserveAspectRatio="xMidYMax slice" className="h-full w-full">
          <circle cx="600" cy="300" r="170" fill="#ffb347" opacity="0.28" />
          <circle cx="600" cy="300" r="110" fill="#ffd27a" opacity="0.3" />
          <path d="M0 400 L0 280 L180 220 L320 270 L480 200 L640 260 L800 190 L980 250 L1200 210 L1200 400 Z" fill={mid} />
          <path d="M0 400 L0 330 L260 300 L520 340 L780 300 L1040 330 L1200 310 L1200 400 Z" fill={dark} />
        </svg>
      );
    case "lotus-pond":
      return (
        <svg viewBox="0 0 1200 400" preserveAspectRatio="xMidYMax slice" className="h-full w-full">
          <rect x="0" y="280" width="1200" height="120" fill="rgba(5,7,26,0.7)" />
          {[120, 300, 520, 760, 940, 1100].map((x, i) => (
            <g key={x}>
              <ellipse cx={x} cy={330 + (i % 3) * 18} rx="70" ry="14" fill="#1f4a3a" opacity="0.85" />
              <path d={`M${x - 14} ${325 + (i % 3) * 18} Q ${x} ${290 + (i % 3) * 18} ${x + 14} ${325 + (i % 3) * 18} Z`} fill={accent} opacity="0.75" />
            </g>
          ))}
          <path d="M0 380 L1200 380 L1200 400 L0 400 Z" fill={dark} />
        </svg>
      );
    case "river":
      return (
        <svg viewBox="0 0 1200 400" preserveAspectRatio="xMidYMax slice" className="h-full w-full">
          <path d="M0 260 Q 300 230 600 260 T 1200 250 L1200 400 L0 400 Z" fill={mid} />
          {[0, 1, 2].map((i) => (
            <path key={i} d={`M${100 + i * 60} ${300 + i * 25} L${1100 - i * 60} ${300 + i * 25}`} stroke={accent} strokeOpacity={0.35 - i * 0.08} strokeWidth="2" strokeDasharray="40 30" />
          ))}
          {/* ghat steps */}
          <path d="M0 400 L0 330 L140 330 L140 350 L260 350 L260 370 L380 370 L380 400 Z" fill={dark} />
          <path d="M1200 400 L1200 330 L1060 330 L1060 350 L940 350 L940 370 L820 370 L820 400 Z" fill={dark} />
        </svg>
      );
    case "hills":
      return (
        <svg viewBox="0 0 1200 400" preserveAspectRatio="xMidYMax slice" className="h-full w-full">
          <path d="M0 400 L0 250 Q 90 190 180 240 Q 270 170 360 230 Q 450 160 540 220 Q 630 150 720 220 Q 810 165 900 230 Q 990 180 1080 235 Q 1140 210 1200 240 L1200 400 Z" fill="#241c46" />
          <path d="M0 400 L0 310 Q 150 270 300 305 Q 450 265 600 300 Q 750 260 900 300 Q 1050 270 1200 305 L1200 400 Z" fill={dark} />
        </svg>
      );
    case "temple-hall":
    default:
      return (
        <svg viewBox="0 0 1200 400" preserveAspectRatio="xMidYMax slice" className="h-full w-full">
          {[60, 220, 380, 820, 980, 1140].map((x) => (
            <g key={x} fill={mid}>
              <rect x={x - 28} y="40" width="56" height="320" />
              <rect x={x - 40} y="30" width="80" height="20" />
              <rect x={x - 40} y="350" width="80" height="20" />
            </g>
          ))}
          <rect x="0" y="0" width="1200" height="34" fill={mid} />
          <path d="M0 370 L1200 370 L1200 400 L0 400 Z" fill={dark} />
        </svg>
      );
  }
}

export function DeityBackdrop({ theme, particles = true }: { theme: DeityTheme; particles?: boolean }) {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
      <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${theme.skyTop} 0%, ${theme.skyBottom} 78%, #05071a 100%)` }} />
      <div
        className="absolute inset-0"
        style={{ background: `radial-gradient(60% 45% at 50% 42%, color-mix(in srgb, ${theme.glow} 22%, transparent), transparent 70%)` }}
      />
      {particles && <ParticleField stars={60} motes={22} moteColor={hexToRgb(theme.glow)} />}
      <div className="absolute inset-x-0 bottom-0 h-[38vh] min-h-[180px]">
        <MotifLayer motif={theme.motif} accent={theme.accent} />
      </div>
    </div>
  );
}
