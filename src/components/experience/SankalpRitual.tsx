"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useAudio } from "../audio/AudioProvider";
import { PrayerBox } from "./PrayerBox";

export const SANKALP_MAX = 600;

const INTENTIONS = ["Wish", "Prayer", "Gratitude", "Intention", "Hope"] as const;
type Intention = (typeof INTENTIONS)[number];

/** Remove control characters (except newlines) and clamp length. Rendered as text only — never HTML. */
export function sanitizeSankalp(input: string): string {
  return input
    .replace(/[\u0000-\u0009\u000B-\u001F\u007F​-‏‪-‮⁦-⁩]/g, "")
    .replace(/\n{4,}/g, "\n\n\n")
    .slice(0, SANKALP_MAX);
}

type Stage = "write" | "sealing" | "rolling" | "placing" | "closed";

/**
 * PRIVACY: the Sankalp text lives ONLY in this component's state. It is never
 * sent over the network, written to storage, logged or passed to analytics.
 * When this component unmounts (after placing), the text is gone.
 */
export function SankalpRitual({ deityName, onPlaced, onSkip }: { deityName: string; onPlaced: () => void; onSkip: () => void }) {
  const { sfx } = useAudio();
  const [text, setText] = useState("");
  const [intention, setIntention] = useState<Intention>("Prayer");
  const [stage, setStage] = useState<Stage>("write");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const id = useId();

  useEffect(() => {
    const ts = timers.current;
    return () => ts.forEach(clearTimeout);
  }, []);

  const place = () => {
    const clean = sanitizeSankalp(text).trim();
    if (!clean) return;
    setText(clean);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const k = reduce ? 0.25 : 1;
    setStage("sealing");
    sfx("chime", { vel: 0.35 });
    timers.current.push(setTimeout(() => setStage("rolling"), 1600 * k));
    timers.current.push(setTimeout(() => setStage("placing"), 2700 * k));
    timers.current.push(
      setTimeout(() => {
        setStage("closed");
        setText(""); // the words are now "inside the box" — discard them from memory
        sfx("bell", { vel: 0.5 });
      }, 4000 * k),
    );
  };

  const remaining = SANKALP_MAX - text.length;

  return (
    <div className="absolute inset-0 z-40 overflow-y-auto bg-night/85" role="dialog" aria-modal="true" aria-labelledby={`${id}-title`}>
      <div className="mx-auto flex min-h-full max-w-xl flex-col items-center justify-center px-4 py-10">
        {stage === "closed" ? (
          <div className="animate-rise text-center" role="status">
            <PrayerBox closed glowing size={200} />
            <h2 id={`${id}-title`} className="mt-6 font-display text-3xl text-gold-light">
              Your Sankalp has been placed with reverence
            </h2>
            <p className="mx-auto mt-3 max-w-md text-ivory/80">
              It remains yours alone. It was never sent or stored, and it is released when you conclude your visit.
            </p>
            <button type="button" className="btn-gold mt-6" onClick={onPlaced} data-testid="sankalp-continue">
              Continue to Darshan
            </button>
          </div>
        ) : (
          <>
            <div
              className={`parchment w-full px-6 pb-6 pt-7 sm:px-9 ${stage === "rolling" ? "scroll-roll" : ""} ${stage === "placing" ? "scroll-roll into-box" : ""}`}
              style={{ ["--drop" as string]: "260px" }}
            >
              <div className="parchment-border" aria-hidden="true" />
              <p className="text-center font-deva text-xl text-maroon" lang="sa">
                संकल्प
              </p>
              <h2 id={`${id}-title`} className="text-center font-display text-3xl font-bold text-[#4a2510]">
                {stage === "write" ? "Write Your Sankalp" : "Your Sankalp"}
              </h2>
              <p className="mt-1 text-center text-sm italic text-[#6b4a2a]">A private offering before {deityName}</p>

              {stage === "write" ? (
                <>
                  <div className="mt-4 flex flex-wrap justify-center gap-2" role="group" aria-label="What would you like to offer?">
                    {INTENTIONS.map((i) => (
                      <button key={i} type="button" className="chip" aria-pressed={intention === i} onClick={() => setIntention(i)}>
                        {i}
                      </button>
                    ))}
                  </div>
                  <label htmlFor={`${id}-text`} className="sr-only">
                    Your {intention.toLowerCase()}
                  </label>
                  <textarea
                    id={`${id}-text`}
                    className="sankalp-textarea mt-4"
                    value={text}
                    maxLength={SANKALP_MAX}
                    onChange={(e) => setText(sanitizeSankalp(e.target.value))}
                    placeholder={
                      intention === "Gratitude"
                        ? "I am grateful for…"
                        : intention === "Hope"
                          ? "I hope…"
                          : intention === "Intention"
                            ? "I resolve to…"
                            : "Write from your heart…"
                    }
                    autoComplete="off"
                    autoCorrect="on"
                    spellCheck={false}
                    data-testid="sankalp-text"
                  />
                  <div className="mt-1 flex items-center justify-between text-xs text-[#6b4a2a]">
                    <span>🔒 Private · stays on this device · never sent or saved</span>
                    <span aria-live="polite">{remaining < 100 ? `${remaining} left` : ""}</span>
                  </div>
                </>
              ) : (
                <div className="mt-5 min-h-[8rem]">
                  <p className="font-display text-sm uppercase tracking-[0.25em] text-maroon/80">{intention}</p>
                  <p className="mt-2 whitespace-pre-wrap break-words font-hand text-xl leading-relaxed text-[#2d1a0c]">{text}</p>
                  <div className="mt-4 flex items-center justify-end gap-3">
                    <span className="font-hand text-[#6b4a2a]">— offered with devotion</span>
                    <span className="grid h-12 w-12 place-items-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#e04a3a,#8a0f12)] font-deva text-lg text-[#fbe7c0] shadow-[0_2px_6px_rgba(0,0,0,0.4)]" aria-hidden="true">
                      ॐ
                    </span>
                  </div>
                </div>
              )}
            </div>

            {stage === "write" ? (
              <div className="mt-6 flex w-full flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <button type="button" className="btn-gold w-full sm:w-auto" disabled={!text.trim()} onClick={place} data-testid="sankalp-place">
                  Place in the Prayer Box
                </button>
                <button type="button" className="btn-ghost w-full sm:w-auto" onClick={onSkip} data-testid="sankalp-skip">
                  Skip for now
                </button>
              </div>
            ) : (
              <div className="mt-6">
                <PrayerBox closed={false} size={170} />
              </div>
            )}
            <p className="mt-4 max-w-md text-center text-xs text-ivory/55">
              The Prayer Box is a symbolic digital element. Your words are not sent to any temple, priest or person.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
