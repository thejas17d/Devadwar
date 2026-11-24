/**
 * Brass Aarti thali: engraved plate with a five-wick (pancha-arati) lamp,
 * marigolds, kumkum and rice. The flames themselves are drawn by FlameCanvas
 * at the wick positions, so the SVG has no flames of its own.
 * Wick tops sit at the element's centre-top region (see WICK_ANCHOR).
 */
import { r2 } from "@/lib/num";

/** Position of the central wick relative to the thali box (fractions). */
export const WICK_ANCHOR = { x: 0.5, y: 35 / 120 };

export function AartiThali({ size = 132 }: { size?: number }) {
  return (
    <svg viewBox="0 0 160 120" width={size} height={(size * 120) / 160} aria-hidden="true" style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id="th-plate" cx="45%" cy="35%" r="70%">
          <stop offset="0" stopColor="#fff2c0" />
          <stop offset="0.45" stopColor="#dcaa48" />
          <stop offset="1" stopColor="#7a5216" />
        </radialGradient>
        <linearGradient id="th-lamp" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff0b8" />
          <stop offset="0.5" stopColor="#d29b3c" />
          <stop offset="1" stopColor="#6e4812" />
        </linearGradient>
      </defs>
      {/* plate */}
      <ellipse cx="80" cy="86" rx="76" ry="26" fill="#5a3a0c" />
      <ellipse cx="80" cy="82" rx="76" ry="26" fill="url(#th-plate)" stroke="#5a3a0c" strokeWidth="1.2" />
      <ellipse cx="80" cy="82" rx="64" ry="20" fill="none" stroke="#8f6a22" strokeWidth="1.2" />
      {Array.from({ length: 24 }, (_, i) => {
        const a = (i / 24) * Math.PI * 2;
        return <circle key={i} cx={r2(80 + Math.cos(a) * 70)} cy={r2(82 + Math.sin(a) * 23)} r="1.6" fill="#fff0b8" opacity="0.8" />;
      })}
      {/* marigolds */}
      {[
        [28, 80],
        [40, 92],
        [122, 92],
        [134, 80],
      ].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="8" fill={i % 2 ? "#ff9f1c" : "#ffbe0b"} stroke="#b5560a" strokeWidth="0.8" />
          <circle cx={x} cy={y} r="3.5" fill="#f77f00" />
        </g>
      ))}
      {/* kumkum & rice bowls */}
      <ellipse cx="58" cy="98" rx="8" ry="3.5" fill="#c1121f" stroke="#5a0808" strokeWidth="0.6" />
      <ellipse cx="102" cy="98" rx="8" ry="3.5" fill="#fbf3e2" stroke="#9c8a6a" strokeWidth="0.6" />
      {/* five-wick lamp */}
      <path d="M68 82 L92 82 L88 74 L72 74 Z" fill="url(#th-lamp)" stroke="#5a3a0c" strokeWidth="0.8" />
      <rect x="76" y="58" width="8" height="16" fill="url(#th-lamp)" stroke="#5a3a0c" strokeWidth="0.8" />
      <ellipse cx="80" cy="50" rx="30" ry="10" fill="url(#th-lamp)" stroke="#5a3a0c" strokeWidth="1" />
      <ellipse cx="80" cy="47" rx="26" ry="7" fill="#3a2208" />
      <ellipse cx="80" cy="47" rx="20" ry="4.5" fill="#c98a2a" opacity="0.55" />
      {/* wick spouts — match FlameCanvas WICK_OFFSETS */}
      {[
        [80, 35],
        [65, 42],
        [95, 42],
        [72, 49],
        [88, 49],
      ].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y + 2} r="3.4" fill="#8f6a22" stroke="#5a3a0c" strokeWidth="0.6" />
          <rect x={x - 1} y={y - 1} width="2" height="4" fill="#2a1606" />
        </g>
      ))}
    </svg>
  );
}
