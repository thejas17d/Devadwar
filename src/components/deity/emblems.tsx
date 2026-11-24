/**
 * Original placeholder emblems for each deity — drawn as engraved brass /
 * gold line-art from each deity's traditional attributes (ayudhas, symbols).
 * Created in-house for this project; no third-party artwork.
 *
 * These are deliberately symbolic rather than figurative: badly drawn
 * anthropomorphic deity art would be disrespectful. They are replaced by
 * commissioned artwork by setting `art.image` in the deity JSON.
 */
import { useId } from "react";
import { r2 } from "@/lib/num";

type P = { p: string };

function Defs({ p }: P) {
  return (
    <defs>
      <linearGradient id={`${p}-gold`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fff3c4" />
        <stop offset="0.35" stopColor="#f0c96a" />
        <stop offset="0.7" stopColor="#b9862c" />
        <stop offset="1" stopColor="#e8c06a" />
      </linearGradient>
      <linearGradient id={`${p}-goldH`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#8a5d18" />
        <stop offset="0.45" stopColor="#fff0b8" />
        <stop offset="1" stopColor="#9c6c1f" />
      </linearGradient>
      <radialGradient id={`${p}-sun`} cx="50%" cy="50%" r="50%">
        <stop offset="0" stopColor="#fff6d0" />
        <stop offset="0.5" stopColor="#ffb547" />
        <stop offset="1" stopColor="#e2581a" stopOpacity="0" />
      </radialGradient>
      <linearGradient id={`${p}-stone`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#1b2236" />
        <stop offset="0.4" stopColor="#56658c" />
        <stop offset="0.6" stopColor="#3a4666" />
        <stop offset="1" stopColor="#141a2b" />
      </linearGradient>
    </defs>
  );
}

const ink = "#4a2e0a";

// ── shared motifs ─────────────────────────────────────────────

export function Lotus({ x, y, s = 1, color = "#f4a6bd", inner = "#ffd9e4", p }: { x: number; y: number; s?: number; color?: string; inner?: string; p: string }) {
  const petal = "M0 0 C -9 -10, -9 -28, 0 -40 C 9 -28, 9 -10, 0 0 Z";
  const angles = [-70, -45, -22, 0, 22, 45, 70];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {[-82, 82].map((a) => (
        <path key={a} d={petal} transform={`rotate(${a}) scale(0.8 0.75)`} fill={color} stroke={ink} strokeWidth="0.8" opacity="0.9" />
      ))}
      {angles.map((a) => (
        <path key={a} d={petal} transform={`rotate(${a}) scale(${a === 0 ? 1 : 0.92})`} fill={Math.abs(a) > 30 ? color : inner} stroke={ink} strokeWidth="0.8" />
      ))}
      {angles.map((a) => (
        <path key={`v${a}`} d="M0 -4 L0 -30" transform={`rotate(${a})`} stroke={ink} strokeOpacity="0.25" strokeWidth="0.7" />
      ))}
      <ellipse cx="0" cy="2" rx="30" ry="5" fill={`url(#${p}-gold)`} stroke={ink} strokeWidth="0.8" />
    </g>
  );
}

export function Chakra({ x, y, r, p, spin = false }: { x: number; y: number; r: number; p: string; spin?: boolean }) {
  const flames = Array.from({ length: 16 }, (_, i) => i * 22.5);
  const spokes = Array.from({ length: 12 }, (_, i) => i * 30);
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className={spin ? "svg-spin" : undefined}>
        {flames.map((a) => (
          <path key={a} d={`M${-r * 0.16} ${-r * 0.92} Q0 ${-r * 1.35} ${r * 0.16} ${-r * 0.92} Z`} transform={`rotate(${a})`} fill="#ffb547" stroke={ink} strokeWidth="0.6" />
        ))}
        <circle r={r} fill={`url(#${p}-gold)`} stroke={ink} strokeWidth="1.2" />
        <circle r={r * 0.78} fill="#2a1a08" opacity="0.85" />
        {spokes.map((a) => (
          <path key={a} d={`M0 ${-r * 0.2} L${r * 0.07} ${-r * 0.5} L0 ${-r * 0.78} L${-r * 0.07} ${-r * 0.5} Z`} transform={`rotate(${a})`} fill={`url(#${p}-gold)`} />
        ))}
        <circle r={r * 0.22} fill={`url(#${p}-gold)`} stroke={ink} strokeWidth="0.8" />
        <circle r={r * 0.08} fill="#c1121f" />
      </g>
    </g>
  );
}

export function Shankha({ x, y, s = 1, p }: { x: number; y: number; s?: number; p: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path
        d="M-6 -34 C 10 -34, 22 -20, 22 -2 C 22 18, 10 32, -2 36 C -6 30, -8 24, -14 22 C -24 16, -26 0, -22 -14 C -19 -26, -14 -34, -6 -34 Z"
        fill="#fbf6ea"
        stroke={ink}
        strokeWidth="1.1"
      />
      <path d="M-2 36 C 2 28, 6 22, 4 10 C 2 -6, -8 -16, -18 -12" fill="none" stroke="#c9a36a" strokeWidth="1.4" />
      <path d="M-6 -34 C -2 -42, 4 -44, 8 -40 C 4 -38, 2 -36, 0 -33" fill="#fbf6ea" stroke={ink} strokeWidth="1" />
      <path d="M-20 -6 C -10 -10, 4 -8, 14 0 M-20 6 C -10 2, 4 4, 16 12" fill="none" stroke="#d8c09a" strokeWidth="1" />
      <path d="M-16 -22 Q -4 -30 10 -24" fill="none" stroke={`url(#${p}-gold)`} strokeWidth="3" />
      <path d="M-24 4 Q -2 12 20 4" fill="none" stroke={`url(#${p}-gold)`} strokeWidth="2.5" />
    </g>
  );
}

function Rays({ x, y, r, n = 24, color = "#ffcf70", opacity = 0.35 }: { x: number; y: number; r: number; n?: number; color?: string; opacity?: number }) {
  return (
    <g transform={`translate(${x} ${y})`} opacity={opacity}>
      {Array.from({ length: n }, (_, i) => (
        <path key={i} d={`M-2 ${-r * 0.55} L0 ${-r} L2 ${-r * 0.55} Z`} transform={`rotate(${(360 / n) * i})`} fill={color} />
      ))}
    </g>
  );
}

// ── emblems ───────────────────────────────────────────────────

function Shiva({ p }: P) {
  return (
    <>
      {/* crescent moon */}
      <path d="M40 40 A26 26 0 1 0 72 78 A20 20 0 1 1 40 40 Z" fill="#f4f0dc" stroke="#c9bf9a" strokeWidth="0.8" />
      {/* trishula */}
      <g stroke={ink} strokeWidth="0.9">
        <rect x="97.5" y="34" width="5" height="150" rx="2" fill={`url(#${p}-goldH)`} />
        <path d="M100 6 L93 34 L100 46 L107 34 Z" fill={`url(#${p}-gold)`} />
        <path d="M100 62 C 80 62 70 52 69 28 L65 30 L70 14 L75 30 L72 29 C 74 48 84 54 100 55 Z" fill={`url(#${p}-gold)`} />
        <path d="M100 62 C 120 62 130 52 131 28 L135 30 L130 14 L125 30 L128 29 C 126 48 116 54 100 55 Z" fill={`url(#${p}-gold)`} />
        <path d="M92 58 L100 52 L108 58 L100 66 Z" fill="#c1121f" />
        {/* damaru */}
        <path d="M86 82 L114 82 L100 94 Z M86 106 L114 106 L100 94 Z" fill={`url(#${p}-gold)`} />
        <path d="M86 82 L114 82 M86 106 L114 106" stroke="#7a1a1a" strokeWidth="3" />
      </g>
      <path d="M114 94 q10 6 6 16" stroke="#c1121f" strokeWidth="1.2" fill="none" />
      <circle cx="120" cy="112" r="2.6" fill={`url(#${p}-gold)`} />
      {/* peetha (base) */}
      <g stroke={ink} strokeWidth="1">
        <path d="M44 212 L156 212 L162 228 L38 228 Z" fill={`url(#${p}-gold)`} />
        <path d="M52 200 L148 200 L152 212 L48 212 Z" fill="#b9862c" />
        <path d="M38 178 L42 198 Q100 212 158 198 L162 178 Z" fill={`url(#${p}-stone)`} />
        <path d="M156 182 L196 188 L196 195 L156 199 Z" fill={`url(#${p}-stone)`} />
        <ellipse cx="100" cy="178" rx="62" ry="12" fill="#3b4766" />
        {/* linga */}
        <path d="M76 178 L76 130 C 76 100 124 100 124 130 L124 178 Z" fill={`url(#${p}-stone)`} />
      </g>
      <ellipse cx="100" cy="178" rx="24" ry="4.5" fill="#1b2236" opacity="0.6" />
      {/* tripundra + bindu */}
      <g stroke="#f5f1e6" strokeWidth="3" strokeLinecap="round">
        <path d="M81 136 Q100 132 119 136" fill="none" />
        <path d="M80 145 Q100 141 120 145" fill="none" />
        <path d="M80 154 Q100 150 120 154" fill="none" />
      </g>
      <circle cx="100" cy="145" r="4" fill="#c1121f" />
      <path d="M86 112 Q92 106 102 106" stroke="#a9b8de" strokeOpacity="0.6" strokeWidth="2" fill="none" />
      {/* bilva leaves */}
      <g fill="#4f8a3a" stroke="#22451a" strokeWidth="0.8">
        <ellipse cx="56" cy="172" rx="5" ry="11" transform="rotate(-50 56 172)" />
        <ellipse cx="64" cy="166" rx="5" ry="12" transform="rotate(-10 64 166)" />
        <ellipse cx="72" cy="172" rx="5" ry="11" transform="rotate(30 72 172)" />
        <ellipse cx="134" cy="172" rx="4.5" ry="10" transform="rotate(-30 134 172)" />
        <ellipse cx="141" cy="167" rx="4.5" ry="11" transform="rotate(10 141 167)" />
        <ellipse cx="148" cy="173" rx="4.5" ry="10" transform="rotate(50 148 173)" />
      </g>
    </>
  );
}

function Ganesha({ p }: P) {
  const modak = "M-11 10 C -13 0, -5 -12, 0 -20 C 5 -12, 13 0, 11 10 Q 0 15 -11 10 Z";
  return (
    <>
      <circle cx="100" cy="102" r="70" fill="#e85d1a" opacity="0.18" />
      {/* ankusha */}
      <g stroke={ink} strokeWidth="0.9">
        <path d="M26 128 L58 26" stroke={`url(#${p}-goldH)`} strokeWidth="5" strokeLinecap="round" />
        <path d="M58 26 L63 6 L54 22 Z" fill={`url(#${p}-gold)`} />
        <path d="M57 30 C 70 20, 84 28, 76 42 C 72 36, 66 34, 60 38 Z" fill={`url(#${p}-gold)`} />
        <circle cx="49" cy="56" r="3.5" fill="#c1121f" />
      </g>
      {/* pasha (noose) */}
      <g fill="none" strokeLinecap="round">
        <path d="M150 26 C 180 18, 190 52, 164 62 C 144 68, 136 42, 150 26 Z" stroke="#d6a548" strokeWidth="3.5" />
        <path d="M164 62 Q 176 92 166 118" stroke="#d6a548" strokeWidth="3.5" />
        <path d="M150 26 C 180 18, 190 52, 164 62" stroke="#fff0b8" strokeWidth="1" strokeOpacity="0.6" />
      </g>
      {/* Om */}
      <text
        x="100"
        y="158"
        textAnchor="middle"
        fontSize="128"
        style={{ fontFamily: "var(--font-deva), serif" }}
        fill={`url(#${p}-gold)`}
        stroke={ink}
        strokeWidth="1.2"
      >
        ॐ
      </text>
      {/* durva grass */}
      <g stroke="#5d9a3a" strokeWidth="1.6" fill="none" strokeLinecap="round">
        <path d="M60 206 Q 52 186 44 178" />
        <path d="M64 206 Q 62 184 66 172" />
        <path d="M140 206 Q 146 186 156 178" />
        <path d="M136 206 Q 138 186 132 174" />
      </g>
      {/* plate of modaks */}
      <ellipse cx="100" cy="214" rx="62" ry="10" fill={`url(#${p}-gold)`} stroke={ink} strokeWidth="1" />
      <ellipse cx="100" cy="211" rx="52" ry="6" fill="#8f6a22" opacity="0.5" />
      {[74, 100, 126].map((x, i) => (
        <g key={x} transform={`translate(${x} ${i === 1 ? 194 : 198}) scale(${i === 1 ? 1.15 : 1})`}>
          <path d={modak} fill="#f7e3b5" stroke="#8a6a3a" strokeWidth="0.9" />
          <path d="M0 -18 L0 10 M-6 -8 Q -7 2 -6 11 M6 -8 Q 7 2 6 11" stroke="#c9a36a" strokeWidth="0.9" fill="none" />
        </g>
      ))}
    </>
  );
}

function Vishnu({ p }: P) {
  return (
    <>
      <Chakra x={100} y={74} r={40} p={p} spin />
      <Shankha x={40} y={146} s={1.05} p={p} />
      {/* gada */}
      <g stroke={ink} strokeWidth="0.9">
        <path d="M150 204 L162 138" stroke={`url(#${p}-goldH)`} strokeWidth="6" strokeLinecap="round" />
        <circle cx="164" cy="124" r="17" fill={`url(#${p}-gold)`} />
        <path d="M164 107 L164 141 M152 112 Q 164 124 152 136 M176 112 Q 164 124 176 136" stroke="#8f6a22" strokeWidth="1.2" fill="none" />
        <path d="M164 100 L168 108 L160 108 Z" fill={`url(#${p}-gold)`} />
        <circle cx="149" cy="208" r="4" fill={`url(#${p}-gold)`} />
      </g>
      <Lotus x={100} y={208} s={1.05} p={p} />
    </>
  );
}

function Krishna({ p }: P) {
  // peacock feather barbs along the quill
  const barbs = [];
  for (let i = 0; i < 26; i++) {
    const t = i / 25;
    const x = 70 + (138 - 70) * t;
    const y = 222 - (222 - 40) * t;
    const len = r2(6 + Math.sin(t * Math.PI) * 18);
    barbs.push(
      <path key={i} d={`M${r2(x)} ${r2(y)} q ${-len} ${r2(-len * 0.2)} ${r2(-len * 1.1)} ${r2(-len * 0.9)} M${r2(x)} ${r2(y)} q ${len} ${r2(len * 0.15)} ${r2(len * 1.1)} ${r2(-len * 0.5)}`} stroke="#3f9a6a" strokeOpacity={0.75} strokeWidth="0.9" fill="none" />,
    );
  }
  return (
    <>
      {/* feather */}
      <g>
        {barbs}
        <path d="M70 224 Q 104 130 138 40" stroke="#e8d7a0" strokeWidth="1.8" fill="none" />
        <g transform="translate(134 58) rotate(20)">
          <ellipse rx="26" ry="36" fill="#2f8f5f" opacity="0.9" />
          <ellipse rx="20" ry="27" fill="#d7b24a" />
          <ellipse rx="15" ry="20" cy="2" fill="#1d6fa3" />
          <ellipse rx="10" ry="13" cy="3" fill="#0b2350" />
          <path d="M0 -4 C -6 -10 -10 0 0 9 C 10 0 6 -10 0 -4 Z" fill="#2ab0c9" />
        </g>
      </g>
      {/* bansuri */}
      <g transform="rotate(-16 100 150)">
        <rect x="18" y="143" width="168" height="13" rx="6.5" fill={`url(#${p}-goldH)`} stroke={ink} strokeWidth="1" />
        <rect x="18" y="143" width="168" height="4" rx="2" fill="#fff6d0" opacity="0.35" />
        {[48, 62, 120, 134, 148, 162].map((x) => (
          <ellipse key={x} cx={x} cy="149.5" rx="3" ry="2.6" fill="#3a2208" />
        ))}
        {[30, 90, 176].map((x) => (
          <rect key={x} x={x} y="141.5" width="5" height="16" rx="2" fill="#c1121f" stroke={ink} strokeWidth="0.6" />
        ))}
        <path d="M35 157 Q 33 178 26 192 M35 157 Q 38 180 36 196 M35 157 Q 42 176 46 190" stroke="#c1121f" strokeWidth="1.6" fill="none" />
        <circle cx="35" cy="160" r="3.4" fill={`url(#${p}-gold)`} />
      </g>
    </>
  );
}

function Hanuman({ p }: P) {
  return (
    <>
      <circle cx="104" cy="82" r="56" fill={`url(#${p}-sun)`} />
      <Rays x={104} y={82} r={84} n={28} opacity={0.4} />
      {/* banner */}
      <g>
        <path d="M44 34 L44 220" stroke={`url(#${p}-goldH)`} strokeWidth="4" strokeLinecap="round" />
        <circle cx="44" cy="30" r="4" fill={`url(#${p}-gold)`} />
        <path d="M46 36 L104 50 L80 62 L104 76 L46 90 Z" fill="#ff8a1f" stroke="#8a3a08" strokeWidth="1" />
        <text x="66" y="69" textAnchor="middle" fontSize="17" fill="#7a1408" style={{ fontFamily: "var(--font-deva), serif" }}>
          राम
        </text>
      </g>
      {/* gada */}
      <g stroke={ink} strokeWidth="1">
        <path d="M158 222 L114 108" stroke={`url(#${p}-goldH)`} strokeWidth="9" strokeLinecap="round" />
        {[180, 196].map((y, i) => (
          <path key={y} d={`M${144 + i * 6} ${y} l 14 -5`} stroke="#c1121f" strokeWidth="4" />
        ))}
        <circle cx="160" cy="226" r="6" fill={`url(#${p}-gold)`} />
        <ellipse cx="106" cy="86" rx="32" ry="34" fill={`url(#${p}-gold)`} transform="rotate(-21 106 86)" />
        <g transform="rotate(-21 106 86)" fill="none" stroke="#8f6a22" strokeWidth="1.3">
          <path d="M106 52 L106 120" />
          <path d="M90 56 Q 78 86 90 116" />
          <path d="M122 56 Q 134 86 122 116" />
          <path d="M76 86 L136 86" stroke="#c1121f" strokeWidth="3" />
        </g>
        <path d="M96 52 L94 36 L100 44 L104 30 L108 44 L114 38 L112 54 Z" fill={`url(#${p}-gold)`} transform="rotate(-21 106 86)" />
      </g>
    </>
  );
}

function Durga({ p }: P) {
  return (
    <>
      <circle cx="100" cy="64" r="44" fill="#c1121f" opacity="0.32" />
      <circle cx="100" cy="64" r="30" fill="#c1121f" opacity="0.4" />
      {/* khadga */}
      <g stroke={ink} strokeWidth="0.9">
        <path d="M70 182 L44 70 C 36 50, 40 40, 46 30 C 54 48, 58 60, 76 176 Z" fill="#e8eef6" />
        <path d="M66 180 L46 64" stroke="#9fb0c8" strokeWidth="1" />
        <path d="M60 186 L84 178" stroke={`url(#${p}-goldH)`} strokeWidth="6" strokeLinecap="round" />
        <path d="M74 184 L80 206" stroke={`url(#${p}-goldH)`} strokeWidth="5" strokeLinecap="round" />
      </g>
      <Chakra x={156} y={92} r={20} p={p} spin />
      {/* trishula */}
      <g stroke={ink} strokeWidth="0.9">
        <rect x="97" y="40" width="6" height="160" rx="2" fill={`url(#${p}-goldH)`} />
        <path d="M100 8 L92 36 L100 50 L108 36 Z" fill={`url(#${p}-gold)`} />
        <path d="M100 66 C 78 66 68 54 67 28 L62 31 L68 12 L74 31 L70 30 C 72 50 82 58 100 58 Z" fill={`url(#${p}-gold)`} />
        <path d="M100 66 C 122 66 132 54 133 28 L138 31 L132 12 L126 31 L130 30 C 128 50 118 58 100 58 Z" fill={`url(#${p}-gold)`} />
      </g>
      {/* red cloth ribbon */}
      <path d="M100 74 C 116 80, 122 96, 116 112 C 112 98, 106 90, 100 86 Z" fill="#c1121f" stroke="#5a0808" strokeWidth="0.8" />
      <path d="M100 74 C 86 82, 82 96, 88 110 C 92 96, 96 90, 100 86 Z" fill="#a50e1a" stroke="#5a0808" strokeWidth="0.8" />
      <Lotus x={100} y={210} s={1.1} color="#e84a5f" inner="#ff9aa8" p={p} />
    </>
  );
}

function Lakshmi({ p }: P) {
  return (
    <>
      <circle cx="100" cy="120" r="76" fill="#ffc8da" opacity="0.12" />
      {/* falling coins */}
      {[
        [40, 120, 0.9],
        [30, 150, 1],
        [46, 176, 0.8],
        [160, 118, 0.9],
        [170, 148, 1],
        [154, 178, 0.85],
      ].map(([x, y, s], i) => (
        <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
          <circle r="8" fill={`url(#${p}-gold)`} stroke={ink} strokeWidth="0.8" />
          <circle r="5" fill="none" stroke="#8f6a22" strokeWidth="0.8" />
        </g>
      ))}
      {/* mango leaves + coconut */}
      <g stroke="#22451a" strokeWidth="0.8" fill="#4f8a3a">
        {[-60, -32, 0, 32, 60].map((a) => (
          <path key={a} d="M0 0 C -7 -12 -5 -30 0 -40 C 5 -30 7 -12 0 0 Z" transform={`translate(100 108) rotate(${a})`} />
        ))}
      </g>
      <ellipse cx="100" cy="88" rx="17" ry="21" fill="#8a5a2b" stroke="#3a220c" strokeWidth="1" />
      <path d="M92 72 Q 100 60 108 72" stroke="#c9a36a" strokeWidth="1.5" fill="none" />
      <path d="M90 92 Q 100 98 110 92" stroke="#c1121f" strokeWidth="2" fill="none" />
      {/* kalasha */}
      <g stroke={ink} strokeWidth="1">
        <path d="M80 108 L120 108 L116 118 L84 118 Z" fill={`url(#${p}-gold)`} />
        <path d="M84 118 C 50 128, 52 186, 100 190 C 148 186, 150 128, 116 118 Z" fill={`url(#${p}-gold)`} />
      </g>
      <path d="M66 150 Q 100 160 134 150" stroke="#c1121f" strokeWidth="2.5" fill="none" />
      <text x="100" y="146" textAnchor="middle" fontSize="20" fill="#9c1a1a" style={{ fontFamily: "var(--font-deva), serif" }}>
        श्री
      </text>
      <path d="M70 132 Q 76 124 86 122" stroke="#fff6d0" strokeOpacity="0.6" strokeWidth="2" fill="none" />
      <Lotus x={100} y={214} s={1.25} p={p} />
    </>
  );
}

function Saraswati({ p }: P) {
  return (
    <>
      <circle cx="100" cy="110" r="78" fill="#fff4dc" opacity="0.1" />
      {/* veena */}
      <g stroke={ink} strokeWidth="1">
        <path d="M52 190 L156 52" stroke="#6a3a14" strokeWidth="12" strokeLinecap="round" />
        <path d="M52 190 L156 52" stroke={`url(#${p}-goldH)`} strokeWidth="7" strokeLinecap="round" />
        {Array.from({ length: 12 }, (_, i) => {
          const t = 0.22 + i * 0.055;
          const x = 52 + (156 - 52) * t;
          const y = 190 - (190 - 52) * t;
          return <path key={i} d={`M${x - 5} ${y - 4} L${x + 5} ${y + 4}`} stroke="#3a2208" strokeWidth="1.2" />;
        })}
        <path d="M58 186 L160 48 M62 190 L164 52" stroke="#fff6d0" strokeWidth="0.6" strokeOpacity="0.9" />
        <ellipse cx="52" cy="192" rx="34" ry="26" fill="#7a4a1c" transform="rotate(-30 52 192)" />
        <ellipse cx="52" cy="192" rx="26" ry="19" fill={`url(#${p}-gold)`} transform="rotate(-30 52 192)" opacity="0.85" />
        <circle cx="52" cy="192" r="7" fill="#3a2208" />
        <circle cx="140" cy="76" r="13" fill="#7a4a1c" />
        <circle cx="140" cy="76" r="9" fill={`url(#${p}-gold)`} />
        <path d="M156 52 C 170 36, 182 40, 178 28 C 172 18, 160 26, 166 34" fill="none" stroke={`url(#${p}-gold)`} strokeWidth="5" strokeLinecap="round" />
      </g>
      {/* palm-leaf manuscript */}
      <g transform="translate(148 196) rotate(-8)" stroke={ink} strokeWidth="0.9">
        <rect x="-34" y="-12" width="68" height="7" rx="3.5" fill="#7a4a1c" />
        <rect x="-32" y="-5" width="64" height="10" rx="3" fill="#e9d6a6" />
        <path d="M-28 -2 L28 -2 M-28 2 L28 2" stroke="#b8975c" strokeWidth="0.6" />
        <rect x="-34" y="5" width="68" height="7" rx="3.5" fill="#7a4a1c" />
        <path d="M-12 -14 L-12 14 M12 -14 L12 14" stroke="#c1121f" strokeWidth="1.6" />
      </g>
      <Lotus x={104} y={222} s={0.75} color="#f3efe4" inner="#ffffff" p={p} />
    </>
  );
}

function Rama({ p }: P) {
  return (
    <>
      <circle cx="104" cy="118" r="66" fill={`url(#${p}-sun)`} opacity="0.9" />
      <Rays x={104} y={118} r={96} n={32} opacity={0.35} />
      {/* crossed arrows */}
      {[
        [30, 206, 176, 44],
        [176, 206, 30, 44],
      ].map(([x1, y1, x2, y2], i) => {
        const a = r2((Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI);
        return (
          <g key={i} stroke={ink} strokeWidth="0.8">
            <path d={`M${x1} ${y1} L${x2} ${y2}`} stroke="#c9a36a" strokeWidth="2.6" />
            <path d="M0 0 L-14 -5 L-10 0 L-14 5 Z" fill={`url(#${p}-gold)`} transform={`translate(${x2} ${y2}) rotate(${a})`} />
            <g transform={`translate(${x1} ${y1}) rotate(${a})`} fill="#c1121f">
              <path d="M0 0 L14 0 L20 -6 L6 -6 Z" />
              <path d="M0 0 L14 0 L20 6 L6 6 Z" />
            </g>
          </g>
        );
      })}
      {/* kodanda bow */}
      <g strokeLinecap="round">
        <path d="M128 14 L128 226" stroke="#f3e6c4" strokeWidth="1.4" />
        <path d="M128 14 C 58 56, 58 184, 128 226" fill="none" stroke="#5a2e0c" strokeWidth="9" />
        <path d="M128 14 C 58 56, 58 184, 128 226" fill="none" stroke={`url(#${p}-goldH)`} strokeWidth="5" />
        <rect x="70" y="104" width="12" height="32" rx="4" fill="#c1121f" stroke={ink} strokeWidth="1" />
        <circle cx="128" cy="14" r="4" fill={`url(#${p}-gold)`} />
        <circle cx="128" cy="226" r="4" fill={`url(#${p}-gold)`} />
      </g>
    </>
  );
}

function Venkateswara({ p }: P) {
  return (
    <>
      <circle cx="100" cy="96" r="70" fill="#ffd98a" opacity="0.14" />
      {/* seven hills */}
      <g>
        <path d="M0 240 L0 206 Q 20 186 40 200 Q 60 176 84 196 Q 100 172 118 194 Q 138 174 158 198 Q 178 182 200 202 L200 240 Z" fill="#2a2150" />
        <path d="M0 240 L0 218 Q 30 200 56 214 Q 82 198 104 214 Q 132 196 158 214 Q 180 204 200 216 L200 240 Z" fill="#1a1438" />
      </g>
      <Shankha x={38} y={84} s={0.95} p={p} />
      <Chakra x={162} y={84} r={26} p={p} spin />
      {/* urdhva pundra (thiruman + srichurnam) */}
      <g stroke="#b9862c" strokeWidth="1.4">
        <path d="M74 30 L74 134 Q 74 168 100 168 Q 126 168 126 134 L126 30 L110 30 L110 130 Q 110 150 100 150 Q 90 150 90 130 L90 30 Z" fill="#fbf7ee" />
        <path d="M86 168 Q 100 186 114 168 Z" fill="#fbf7ee" />
      </g>
      <rect x="95.5" y="40" width="9" height="102" rx="4.5" fill="#d72d2d" stroke="#7a0a0a" strokeWidth="0.8" />
      <rect x="98" y="44" width="2.5" height="90" rx="1" fill="#ffb3a0" opacity="0.6" />
    </>
  );
}

const EMBLEMS: Record<string, (props: P) => React.ReactElement> = {
  shiva: Shiva,
  ganesha: Ganesha,
  vishnu: Vishnu,
  krishna: Krishna,
  hanuman: Hanuman,
  durga: Durga,
  lakshmi: Lakshmi,
  saraswati: Saraswati,
  rama: Rama,
  venkateswara: Venkateswara,
};

export function hasEmblem(id: string) {
  return id in EMBLEMS;
}

/** Generic fallback for new deities without an emblem yet: a lotus with a diya-like glow. */
function Fallback({ p }: P) {
  return (
    <>
      <circle cx="100" cy="110" r="60" fill={`url(#${p}-sun)`} opacity="0.7" />
      <text x="100" y="140" textAnchor="middle" fontSize="90" fill={`url(#${p}-gold)`} style={{ fontFamily: "var(--font-deva), serif" }}>
        ॐ
      </text>
      <Lotus x={100} y={212} s={1.1} p={p} />
    </>
  );
}

export function Emblem({ id, label, className = "" }: { id: string; label: string; className?: string }) {
  const p = useId().replace(/[^a-zA-Z0-9]/g, "");
  const E = EMBLEMS[id] ?? Fallback;
  return (
    <svg viewBox="0 0 200 240" role="img" aria-label={label} className={className}>
      <Defs p={p} />
      <E p={p} />
    </svg>
  );
}
