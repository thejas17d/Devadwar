/** Soft, layered cloud banks (pure SVG gradients — no blur filters, mobile-friendly). */
const PUFFS: [number, number, number, number][] = [
  // cx, cy, rx, ry  (in a 400×140 box)
  [60, 95, 70, 38],
  [130, 72, 80, 50],
  [215, 64, 90, 58],
  [300, 80, 80, 46],
  [355, 100, 55, 32],
  [180, 105, 140, 34],
];

function CloudBank({ id, tint, lit, opacity }: { id: string; tint: string; lit: string; opacity: number }) {
  return (
    <svg viewBox="0 0 400 140" className="h-full w-full" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <defs>
        <radialGradient id={`${id}-g`} cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor={lit} stopOpacity="0.95" />
          <stop offset="55%" stopColor={tint} stopOpacity="0.55" />
          <stop offset="100%" stopColor={tint} stopOpacity="0" />
        </radialGradient>
      </defs>
      <g opacity={opacity}>
        {PUFFS.map(([cx, cy, rx, ry], i) => (
          <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry} fill={`url(#${id}-g)`} />
        ))}
      </g>
    </svg>
  );
}

export function Clouds({ variant = "dusk" }: { variant?: "dusk" | "night" }) {
  const tint = variant === "dusk" ? "#8a7bb8" : "#3b4680";
  const lit = variant === "dusk" ? "#ffe2b8" : "#9aa6d8";
  const banks = [
    { left: "-18%", top: "8%", w: "62%", h: "22%", o: 0.55, dur: "110s", dx: "40px" },
    { left: "55%", top: "4%", w: "60%", h: "20%", o: 0.45, dur: "130s", dx: "55px" },
    { left: "-25%", top: "58%", w: "75%", h: "30%", o: 0.75, dur: "95s", dx: "60px" },
    { left: "48%", top: "62%", w: "80%", h: "32%", o: 0.8, dur: "120s", dx: "50px" },
    { left: "10%", top: "76%", w: "90%", h: "30%", o: 0.95, dur: "150s", dx: "30px" },
  ];
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {banks.map((b, i) => (
        <div
          key={i}
          className="cloud absolute"
          style={{ left: b.left, top: b.top, width: b.w, height: b.h, ["--dur" as string]: b.dur, ["--dx" as string]: b.dx }}
        >
          <CloudBank id={`cl${i}`} tint={tint} lit={lit} opacity={b.o} />
        </div>
      ))}
    </div>
  );
}
