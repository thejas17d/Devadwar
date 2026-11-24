/**
 * The celestial gateway — carved pillars, a flame-edged torana arch with a
 * kalasha finial, and studded golden doors that swing inward (CSS 3D).
 * Original SVG artwork.
 */
import { r2 } from "@/lib/num";

type Pt = [number, number];
function bez(p0: Pt, p1: Pt, p2: Pt, p3: Pt, t: number): Pt {
  const u = 1 - t;
  return [
    r2(u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0]),
    r2(u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1]),
  ];
}

const ARCH_L: [Pt, Pt, Pt, Pt] = [[66, 192], [66, 108], [180, 58], [300, 36]];
const ARCH_R: [Pt, Pt, Pt, Pt] = [[534, 192], [534, 108], [420, 58], [300, 36]];

function jwala() {
  const out: { x: number; y: number; a: number }[] = [];
  for (const arc of [ARCH_L, ARCH_R]) {
    for (let i = 0; i <= 13; i++) {
      const t = i / 14;
      const [x, y] = bez(...arc, t);
      const [x2, y2] = bez(...arc, Math.min(1, t + 0.01));
      const ang = (Math.atan2(y2 - y, x2 - x) * 180) / Math.PI;
      out.push({ x, y, a: r2(arc === ARCH_L ? ang - 90 : ang + 90) });
    }
  }
  return out;
}
const FLAMES = jwala();

function Kalasha({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-4 -44 L0 -56 L4 -44 Z" fill="url(#g-gold)" />
      <ellipse cx="0" cy="-38" rx="7" ry="8" fill="url(#g-gold)" stroke="#5a3a0c" strokeWidth="0.8" />
      <path d="M-9 -30 L9 -30 L7 -26 L-7 -26 Z" fill="url(#g-gold)" stroke="#5a3a0c" strokeWidth="0.8" />
      <path d="M-7 -26 C -20 -22, -20 -4, 0 0 C 20 -4, 20 -22, 7 -26 Z" fill="url(#g-gold)" stroke="#5a3a0c" strokeWidth="0.8" />
      <path d="M-14 -12 Q 0 -8 14 -12" stroke="#c1121f" strokeWidth="1.6" fill="none" />
      <rect x="-12" y="0" width="24" height="5" fill="url(#g-gold)" stroke="#5a3a0c" strokeWidth="0.8" />
    </g>
  );
}

function Pillar({ x }: { x: number }) {
  // x = left edge of an 80px-wide pillar column
  const c = x + 40;
  return (
    <g>
      {/* base mouldings */}
      <rect x={x - 12} y="688" width="104" height="14" fill="url(#g-goldV)" stroke="#4a2e0a" />
      <rect x={x - 6} y="650" width="92" height="38" fill="url(#g-goldH)" stroke="#4a2e0a" />
      <rect x={x - 2} y="636" width="84" height="14" fill="url(#g-goldV)" stroke="#4a2e0a" />
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d={`M${x + 4 + i * 22} 662 l 9 12 l 9 -12`} fill="none" stroke="#5a3a0c" strokeWidth="1.2" />
      ))}
      {/* shaft */}
      <rect x={x + 8} y="300" width="64" height="336" fill="url(#g-goldH)" stroke="#4a2e0a" />
      {[18, 30, 40, 50, 62].map((dx) => (
        <path key={dx} d={`M${x + dx} 312 L${x + dx} 624`} stroke="#6e4812" strokeOpacity="0.55" strokeWidth="1.4" />
      ))}
      {/* carved bands with lotus medallions */}
      {[372, 520].map((y) => (
        <g key={y}>
          <rect x={x + 2} y={y - 18} width="76" height="36" fill="url(#g-goldV)" stroke="#4a2e0a" />
          <circle cx={c} cy={y} r="13" fill="#7a1424" stroke="#f3d98b" strokeWidth="1.5" />
          {Array.from({ length: 8 }, (_, i) => (
            <ellipse key={i} cx={c} cy={y - 7} rx="2.6" ry="6" fill="#f3d98b" transform={`rotate(${i * 45} ${c} ${y})`} />
          ))}
          <circle cx={c} cy={y} r="3" fill="#ffe7a0" />
          {[x + 10, x + 70].map((bx) => (
            <circle key={bx} cx={bx} cy={y} r="3" fill="#ffe7a0" stroke="#5a3a0c" strokeWidth="0.6" />
          ))}
        </g>
      ))}
      {/* capital + potika brackets */}
      <path d={`M${x + 8} 300 L${x - 4} 276 L${x + 84} 276 L${x + 72} 300 Z`} fill="url(#g-goldV)" stroke="#4a2e0a" />
      <path d={`M${x - 10} 276 C ${x - 22} 270, ${x - 20} 252, ${x - 6} 252 L${x + 86} 252 C ${x + 100} 252, ${x + 102} 270, ${x + 90} 276 Z`} fill="url(#g-goldH)" stroke="#4a2e0a" />
      <circle cx={x - 8} cy="264" r="4" fill="#7a1424" stroke="#f3d98b" />
      <circle cx={x + 88} cy="264" r="4" fill="#7a1424" stroke="#f3d98b" />
      <rect x={x - 6} y="240" width="92" height="12" fill="url(#g-goldV)" stroke="#4a2e0a" />
    </g>
  );
}

function DoorLeaf({ side }: { side: "left" | "right" }) {
  const studs: [number, number][] = [];
  for (let y = 22; y <= 446; y += 30) {
    studs.push([16, y]);
    studs.push([164, y]);
  }
  for (let x = 46; x <= 136; x += 30) {
    studs.push([x, 16]);
    studs.push([x, 450]);
  }
  const panels = [
    [30, 30, 120, 120],
    [30, 170, 120, 130],
    [30, 320, 120, 116],
  ];
  return (
    <svg viewBox="0 0 180 465" className="h-full w-full" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id={`dl-${side}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#d8a94a" />
          <stop offset="0.45" stopColor="#8f6220" />
          <stop offset="1" stopColor="#c08c34" />
        </linearGradient>
        <radialGradient id={`stud-${side}`} cx="35%" cy="30%" r="70%">
          <stop offset="0" stopColor="#fff6d0" />
          <stop offset="0.5" stopColor="#e2b55a" />
          <stop offset="1" stopColor="#6e4812" />
        </radialGradient>
      </defs>
      <g transform={side === "right" ? "translate(180 0) scale(-1 1)" : undefined}>
        <rect x="0" y="0" width="180" height="465" fill={`url(#dl-${side})`} />
        <rect x="5" y="5" width="170" height="455" fill="none" stroke="#fbe7a6" strokeWidth="2.5" />
        <rect x="24" y="24" width="132" height="417" fill="none" stroke="#4a2e0a" strokeWidth="1.5" />
        {panels.map(([x, y, w, h], i) => {
          const cx = x + w / 2;
          const cy = y + h / 2;
          return (
            <g key={i}>
              <rect x={x} y={y} width={w} height={h} rx="4" fill="#6e4512" stroke="#f3d98b" strokeWidth="1.2" />
              <rect x={x + 6} y={y + 6} width={w - 12} height={h - 12} rx="3" fill="none" stroke="#c99a3e" strokeWidth="1" />
              {Array.from({ length: 12 }, (_, k) => (
                <ellipse key={k} cx={cx} cy={cy - 20} rx="5" ry="15" fill="#e7bd62" stroke="#5a3a0c" strokeWidth="0.6" transform={`rotate(${k * 30} ${cx} ${cy})`} />
              ))}
              <circle cx={cx} cy={cy} r="11" fill="#7a1424" stroke="#fbe7a6" strokeWidth="1.5" />
              <circle cx={cx} cy={cy} r="4" fill="#ffe7a0" />
            </g>
          );
        })}
        {studs.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="5" fill={`url(#stud-${side})`} stroke="#4a2e0a" strokeWidth="0.6" />
        ))}
        {/* ring handle near the meeting edge */}
        <circle cx="160" cy="245" r="7" fill={`url(#stud-${side})`} stroke="#4a2e0a" />
        <circle cx="160" cy="262" r="13" fill="none" stroke="#f3d98b" strokeWidth="4" />
        <circle cx="160" cy="262" r="13" fill="none" stroke="#6e4812" strokeWidth="1" />
        <rect x="176" y="0" width="4" height="465" fill="#3a2208" opacity="0.6" />
      </g>
    </svg>
  );
}

export function Gateway({ open, glow = 0.35 }: { open: boolean; glow?: number }) {
  return (
    <div className={`gate-stage relative aspect-[600/760] w-full ${open ? "gate-open" : ""}`}>
      {/* doorway: light + doors (sits under the frame) */}
      <div className="absolute overflow-hidden" style={{ left: "20%", right: "20%", top: "31.6%", bottom: "7.9%" }}>
        <div
          className="absolute inset-0 transition-opacity duration-[2400ms]"
          style={{
            opacity: open ? 1 : glow,
            background: "radial-gradient(ellipse at 50% 55%, #fffdf2 0%, #ffe9a8 25%, #ffb347 55%, #7a3a10 100%)",
          }}
        />
        {/* light leaking through the seam */}
        <div className="absolute inset-y-0 left-1/2 w-[3px] -translate-x-1/2 bg-[#fff6d0] shadow-[0_0_24px_8px_rgba(255,220,140,0.7)]" style={{ opacity: open ? 0 : 0.9 }} />
        <div className="door door-left absolute inset-y-0 left-0 w-1/2">
          <DoorLeaf side="left" />
        </div>
        <div className="door door-right absolute inset-y-0 right-0 w-1/2">
          <DoorLeaf side="right" />
        </div>
      </div>

      {/* frame */}
      <svg viewBox="0 0 600 760" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <linearGradient id="g-goldV" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff0b8" />
            <stop offset="0.3" stopColor="#e9c063" />
            <stop offset="0.65" stopColor="#a87a28" />
            <stop offset="1" stopColor="#d9ad55" />
          </linearGradient>
          <linearGradient id="g-goldH" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#6e4812" />
            <stop offset="0.22" stopColor="#d9a84a" />
            <stop offset="0.46" stopColor="#fff0b8" />
            <stop offset="0.62" stopColor="#e2b55a" />
            <stop offset="1" stopColor="#5c3a0c" />
          </linearGradient>
          <linearGradient id="g-gold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff3c4" />
            <stop offset="0.5" stopColor="#e0b04e" />
            <stop offset="1" stopColor="#8f6220" />
          </linearGradient>
          <linearGradient id="g-sand" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f1d9ae" />
            <stop offset="1" stopColor="#a8875a" />
          </linearGradient>
          <radialGradient id="g-tym" cx="50%" cy="80%" r="80%">
            <stop offset="0" stopColor="#3a2a6a" />
            <stop offset="1" stopColor="#0b0a26" />
          </radialGradient>
        </defs>

        {/* torana arch */}
        <path
          d="M66 192 C 66 108 180 58 300 36 C 420 58 534 108 534 192 L 494 192 C 494 128 400 92 300 74 C 200 92 106 128 106 192 Z"
          fill="url(#g-goldV)"
          stroke="#4a2e0a"
          strokeWidth="1.5"
        />
        <path d="M106 192 C 106 128 200 92 300 74 C 400 92 494 128 494 192 Z" fill="url(#g-tym)" />
        <path d="M84 192 C 84 118 190 74 300 54 C 410 74 516 118 516 192" fill="none" stroke="#7a1424" strokeWidth="3" />
        {Array.from({ length: 21 }, (_, i) => {
          const t = i / 20;
          const left: Pt = bez([84, 192], [84, 118], [190, 74], [300, 54], Math.min(t * 2, 1));
          const right: Pt = bez([516, 192], [516, 118], [410, 74], [300, 54], Math.min(Math.max(t * 2 - 1, 0), 1));
          const [x, y] = t <= 0.5 ? left : right;
          return <circle key={i} cx={x} cy={y} r="2.8" fill="#fff0b8" />;
        })}
        {FLAMES.map((f, i) => (
          <path key={i} d="M-7 0 C -6 -10 -2 -14 0 -22 C 2 -14 6 -10 7 0 Z" transform={`translate(${f.x} ${f.y}) rotate(${f.a})`} fill="url(#g-gold)" stroke="#4a2e0a" strokeWidth="0.8" />
        ))}
        {/* tympanum medallion with Om */}
        <circle cx="300" cy="140" r="38" fill="#7a1424" stroke="url(#g-goldV)" strokeWidth="4" />
        {Array.from({ length: 16 }, (_, i) => (
          <ellipse key={i} cx="300" cy="94" rx="4" ry="8" fill="#f3d98b" transform={`rotate(${i * 22.5} 300 140)`} opacity="0.85" />
        ))}
        <text x="300" y="157" textAnchor="middle" fontSize="46" fill="#ffe7a0" style={{ fontFamily: "var(--font-deva), serif" }}>
          ॐ
        </text>
        <Kalasha x={300} y={40} s={1.1} />

        {/* lintel */}
        <rect x="16" y="186" width="568" height="12" fill="url(#g-goldV)" stroke="#4a2e0a" />
        <rect x="24" y="198" width="552" height="42" fill="url(#g-goldH)" stroke="#4a2e0a" />
        <rect x="24" y="208" width="552" height="22" fill="#7a1424" stroke="#4a2e0a" strokeWidth="0.8" />
        {Array.from({ length: 38 }, (_, i) => (
          <circle key={i} cx={36 + i * 14.5} cy="219" r="3.6" fill="url(#g-gold)" />
        ))}
        <Kalasha x={80} y={186} s={0.8} />
        <Kalasha x={520} y={186} s={0.8} />

        <Pillar x={40} />
        <Pillar x={480} />

        {/* door jambs */}
        <rect x="112" y="240" width="9" height="462" fill="url(#g-goldH)" stroke="#4a2e0a" />
        <rect x="479" y="240" width="9" height="462" fill="url(#g-goldH)" stroke="#4a2e0a" />
        <rect x="112" y="234" width="376" height="8" fill="url(#g-goldV)" stroke="#4a2e0a" />

        {/* steps */}
        <rect x="70" y="700" width="460" height="18" fill="url(#g-sand)" stroke="#6e5232" />
        <rect x="36" y="718" width="528" height="20" fill="url(#g-sand)" stroke="#6e5232" />
        <rect x="0" y="738" width="600" height="22" fill="url(#g-sand)" stroke="#6e5232" />
      </svg>
    </div>
  );
}
