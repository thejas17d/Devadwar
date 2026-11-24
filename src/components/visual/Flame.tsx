/** CSS diya flame — layered gradients with flicker; cheap enough for several on screen. */
export function Flame({ size = 18, delay = 0, className = "" }: { size?: number; delay?: number; className?: string }) {
  const d = `${-delay}s`;
  return (
    <div className={`flame ${className}`} style={{ ["--fw" as string]: `${size}px` }} aria-hidden="true">
      <span className="flame-glow" style={{ animationDelay: d }} />
      <span className="flame-body" style={{ animationDelay: d }} />
      <span className="flame-core" style={{ animationDelay: d }} />
    </div>
  );
}

/** Small clay/brass diya with flame. */
export function Diya({ size = 60, delay = 0 }: { size?: number; delay?: number }) {
  return (
    <div className="relative flex flex-col items-center" style={{ width: size }} aria-hidden="true">
      <Flame size={size * 0.26} delay={delay} />
      <svg viewBox="0 0 60 26" width={size} style={{ marginTop: -size * 0.04 }}>
        <defs>
          <linearGradient id="diya-brass" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fbe3a0" />
            <stop offset="0.45" stopColor="#d29b3c" />
            <stop offset="1" stopColor="#6e4812" />
          </linearGradient>
        </defs>
        <path d="M2 6 Q30 2 58 6 Q54 22 30 24 Q6 22 2 6Z" fill="url(#diya-brass)" stroke="#5a3a0c" strokeWidth="0.8" />
        <ellipse cx="30" cy="6" rx="27" ry="3.2" fill="#3a2208" opacity="0.85" />
        <ellipse cx="30" cy="6" rx="22" ry="2" fill="#c98a2a" opacity="0.5" />
        <path d="M8 12 Q30 16 52 12" stroke="#fff1c2" strokeOpacity="0.45" strokeWidth="0.8" fill="none" />
      </svg>
    </div>
  );
}
