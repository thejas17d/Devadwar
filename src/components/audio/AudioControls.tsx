"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useAudio } from "./AudioProvider";

const ROLE_LABEL: Record<string, string> = {
  ambient: "Darshan",
  mantra: "Mantra",
  aarti: "Aarti",
  gallery: "Gallery",
  home: "Gateway",
};

function Icon({ name }: { name: "note" | "play" | "pause" | "mute" | "vol" | "close" }) {
  const p = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      {name === "note" && (
        <g {...p}>
          <path d="M9 18V5l11-2v13" />
          <circle cx="6.5" cy="18" r="2.5" />
          <circle cx="17.5" cy="16" r="2.5" />
        </g>
      )}
      {name === "play" && <path d="M8 5v14l11-7z" fill="currentColor" />}
      {name === "pause" && (
        <g fill="currentColor">
          <rect x="6" y="5" width="4" height="14" rx="1" />
          <rect x="14" y="5" width="4" height="14" rx="1" />
        </g>
      )}
      {name === "vol" && (
        <g {...p}>
          <path d="M4 9h4l5-4v14l-5-4H4z" />
          <path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" />
        </g>
      )}
      {name === "mute" && (
        <g {...p}>
          <path d="M4 9h4l5-4v14l-5-4H4z" />
          <path d="M17 9l5 6M22 9l-5 6" />
        </g>
      )}
      {name === "close" && (
        <g {...p}>
          <path d="M6 6l12 12M18 6L6 18" />
        </g>
      )}
    </svg>
  );
}

export function AudioControls({ position = "bottom-right" }: { position?: "bottom-right" | "top-left" }) {
  const a = useAudio();
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onDown = (e: PointerEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  const active = a.unlocked && a.playing && a.musicOn && !a.muted;
  const posCls = position === "bottom-right" ? "bottom-4 right-4 items-end" : "top-4 left-4 items-start";

  return (
    <div ref={wrapRef} className={`fixed z-40 flex flex-col gap-2 ${posCls}`} style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      {open && position === "bottom-right" && <Panel id={panelId} onClose={() => setOpen(false)} />}
      <button
        type="button"
        className={`sound-orb ${active ? "is-active" : ""}`}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Close sound settings" : "Open sound settings"}
        onClick={() => setOpen((o) => !o)}
      >
        <Icon name={a.muted || !a.unlocked ? "mute" : "note"} />
        {active && <span className="sound-orb-pulse" aria-hidden="true" />}
      </button>
      {open && position === "top-left" && <Panel id={panelId} onClose={() => setOpen(false)} />}
    </div>
  );
}

function Panel({ id, onClose }: { id: string; onClose: () => void }) {
  const a = useAudio();
  return (
    <div id={id} role="dialog" aria-label="Sound settings" className="audio-panel">
      <div className="flex items-center justify-between gap-3">
        <p className="font-display text-lg tracking-wide text-gold-light">Divine Music</p>
        <button type="button" onClick={onClose} className="icon-btn" aria-label="Close sound settings">
          <Icon name="close" />
        </button>
      </div>

      {!a.unlocked ? (
        <div className="mt-3 space-y-2">
          <p className="text-sm text-ivory/75">Sound is off. Music begins only when you choose.</p>
          <button type="button" className="btn-gold w-full" onClick={() => void a.enableSound()}>
            Enable devotional sound
          </button>
        </div>
      ) : (
        <>
          <div className="mt-3 flex items-center gap-3">
            <button
              type="button"
              className="icon-btn icon-btn-lg"
              onClick={a.togglePlay}
              aria-label={a.playing ? "Pause music" : "Play music"}
            >
              <Icon name={a.playing ? "pause" : "play"} />
            </button>
            <div className="min-w-0">
              <p className="truncate text-sm text-ivory" aria-live="polite">
                {a.track ? a.track.title : "No track available"}
              </p>
              {a.track?.source.type === "procedural" && a.track.source.raga && (
                <p className="text-xs text-ivory/55">Raga {a.track.source.raga} · original composition</p>
              )}
            </div>
          </div>

          {a.sceneTracks.length > 1 && (
            <fieldset className="mt-3">
              <legend className="mb-1 text-xs uppercase tracking-[0.2em] text-gold/80">Tracks</legend>
              <ul className="space-y-1">
                {a.sceneTracks.map((t) => (
                  <li key={t.id}>
                    <label className="track-option">
                      <input
                        type="radio"
                        name="track"
                        checked={a.track?.id === t.id}
                        onChange={() => a.selectTrack(t.id)}
                      />
                      <span className="flex-1 truncate">{t.title}</span>
                      <span className="text-[10px] uppercase tracking-widest text-ivory/45">{ROLE_LABEL[t.role]}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </fieldset>
          )}

          <div className="mt-3 flex items-center gap-2">
            <button type="button" className="icon-btn" onClick={a.toggleMute} aria-label={a.muted ? "Unmute" : "Mute all sound"} aria-pressed={a.muted}>
              <Icon name={a.muted ? "mute" : "vol"} />
            </button>
            <label className="sr-only" htmlFor={`${id}-vol`}>
              Volume
            </label>
            <input
              id={`${id}-vol`}
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={a.muted ? 0 : a.volume}
              onChange={(e) => a.setVolume(Number(e.target.value))}
              className="range-gold flex-1"
            />
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <Toggle label="Music" on={a.musicOn} onClick={a.toggleMusic} />
            <Toggle label="Effects" on={a.sfxOn} onClick={a.toggleSfx} />
          </div>
          <button type="button" className="mt-3 w-full text-xs text-ivory/55 underline-offset-4 hover:underline" onClick={a.disableSound}>
            Turn sound off for this site
          </button>
        </>
      )}
    </div>
  );
}

function Toggle({ label, on, onClick }: { label: string; on: boolean; onClick: () => void }) {
  return (
    <button type="button" role="switch" aria-checked={on} onClick={onClick} className={`toggle-chip ${on ? "is-on" : ""}`}>
      <span className="toggle-dot" aria-hidden="true" />
      {label} {on ? "on" : "off"}
    </button>
  );
}
