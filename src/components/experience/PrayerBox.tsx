/** Carved rosewood prayer box with brass fittings. Symbolic only. */
export function PrayerBox({ closed, glowing = false, size = 180 }: { closed: boolean; glowing?: boolean; size?: number }) {
  return (
    <div className="relative" style={{ width: size }} aria-hidden="true">
      {glowing && (
        <div className="absolute left-1/2 top-1/2 -z-0 aspect-square w-[180%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,215,130,0.45),transparent_65%)] mantra-breathe" />
      )}
      <svg viewBox="0 0 200 150" className="relative w-full" style={{ overflow: "visible" }}>
        <defs>
          <linearGradient id="pb-wood" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#7a2e1a" />
            <stop offset="1" stopColor="#3a120a" />
          </linearGradient>
          <linearGradient id="pb-brass" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff0b8" />
            <stop offset="0.5" stopColor="#d29b3c" />
            <stop offset="1" stopColor="#7a5216" />
          </linearGradient>
        </defs>
        {/* body */}
        <path d="M20 70 L180 70 L172 140 L28 140 Z" fill="url(#pb-wood)" stroke="#2a0a05" strokeWidth="1.5" />
        <rect x="16" y="136" width="168" height="10" rx="2" fill="url(#pb-brass)" stroke="#5a3a0c" />
        <path d="M40 84 L160 84 L155 128 L45 128 Z" fill="none" stroke="#d29b3c" strokeWidth="1.5" />
        {[60, 100, 140].map((x) => (
          <g key={x}>
            <circle cx={x} cy="106" r="11" fill="none" stroke="#d29b3c" strokeWidth="1.3" />
            {Array.from({ length: 8 }, (_, i) => (
              <ellipse key={i} cx={x} cy="99" rx="2" ry="5" fill="#d29b3c" transform={`rotate(${i * 45} ${x} 106)`} opacity="0.85" />
            ))}
          </g>
        ))}
        {[22, 170].map((x) => (
          <path key={x} d={`M${x} 72 l8 0 l-1 66 l-8 0 Z`} fill="url(#pb-brass)" opacity="0.9" />
        ))}
        {/* opening (visible when lid is open) */}
        {!closed && <path d="M24 70 L176 70 L170 76 L30 76 Z" fill="#1a0603" />}
        {/* lid */}
        <g
          style={{
            transformOrigin: "100px 70px",
            transform: closed ? "rotateX(0deg)" : "translateY(-46px) rotate(-14deg)",
            transition: "transform 0.9s cubic-bezier(.5,0,.3,1)",
          }}
        >
          <path d="M14 70 L186 70 L178 46 Q100 30 22 46 Z" fill="url(#pb-wood)" stroke="#2a0a05" strokeWidth="1.5" />
          <path d="M14 70 L186 70" stroke="url(#pb-brass)" strokeWidth="5" />
          <path d="M30 52 Q100 38 170 52" stroke="#d29b3c" strokeWidth="1.3" fill="none" />
          <circle cx="100" cy="46" r="7" fill="url(#pb-brass)" stroke="#5a3a0c" />
          <rect x="94" y="64" width="12" height="14" rx="2" fill="url(#pb-brass)" stroke="#5a3a0c" />
        </g>
      </svg>
    </div>
  );
}
