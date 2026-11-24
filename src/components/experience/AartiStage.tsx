"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { aartiConfig } from "@/config/packages";
import { initialGesture, releaseGesture, roundsCompleted, stepGesture, TAU, type GestureState } from "@/lib/aarti/gesture";
import { useAudio } from "../audio/AudioProvider";
import { AartiThali, WICK_ANCHOR } from "./AartiThali";
import { FlameCanvas, type Emitter } from "./FlameCanvas";
import { Petals } from "../visual/Petals";

const THALI = 132;
const THALI_H = (THALI * 120) / 160;
// Distance from the thali's plate centre (where a finger rests) to the central wick.
const FINGER_TO_WICK = THALI_H * (82 / 120 - WICK_ANCHOR.y);

type Segment =
  | { kind: "circle"; label: string; cx: number; cy: number; rx: number; ry: number; rounds: number; dur: number }
  | { kind: "move"; label: string; from: [number, number]; to: [number, number]; dur: number };

interface Props {
  mode: "watch" | "interactive";
  /** The shrine element the Aarti is offered around. */
  targetRef: React.RefObject<HTMLElement | null>;
  onGlow: (v: number) => void;
  onExit: () => void;
}

const REGION_LABEL: Record<string, string> = {
  feet: "Offering at the lotus feet",
  navel: "Offering at the heart",
  face: "Offering before the face",
  whole: "Offering around the whole form",
};

export function AartiStage({ mode, targetRef, onGlow, onExit }: Props) {
  const { sfx } = useAudio();
  const stageRef = useRef<HTMLDivElement>(null);
  const lampRef = useRef<HTMLDivElement>(null);
  const emitter = useRef<Emitter>({ x: -999, y: -999, active: false, intensity: 0, wicks: 5 });
  const pos = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const dragging = useRef(false);
  const gesture = useRef<GestureState>(initialGesture());
  const assist = useRef<{ start: number; from: number; r: number; d0: number; credited: number } | null>(null);
  const quarter = useRef(0);
  const doneRef = useRef(false);
  const userRounds = useRef(0);
  const queuedAssists = useRef(0);

  const goal = mode === "interactive" ? aartiConfig.interactiveRounds : 0;
  const [rounds, setRounds] = useState(0);
  const [caption, setCaption] = useState(mode === "watch" ? "The Aarti begins" : "");
  const [complete, setComplete] = useState(false);
  const [burst, setBurst] = useState(0);
  const [hint, setHint] = useState(true);

  // Geometry is cached: calling getBoundingClientRect every frame (right after moving
  // the lamp) forces a synchronous layout per frame and starves low-end phones.
  type Geo = { w: number; h: number; left: number; top: number; tw: number; th: number; cx: number; cy: number };
  const geoCache = useRef<{ v: Geo; t: number } | null>(null);
  useEffect(() => {
    const invalidate = () => (geoCache.current = null);
    window.addEventListener("resize", invalidate);
    window.addEventListener("orientationchange", invalidate);
    return () => {
      window.removeEventListener("resize", invalidate);
      window.removeEventListener("orientationchange", invalidate);
    };
  }, []);
  const geometry = useCallback((): Geo | null => {
    const now = performance.now();
    const c = geoCache.current;
    if (c && now - c.t < 1000) return c.v;
    const stage = stageRef.current?.getBoundingClientRect();
    const t = targetRef.current?.getBoundingClientRect();
    if (!stage || !t) return null;
    const v = {
      w: stage.width,
      h: stage.height,
      left: t.left - stage.left,
      top: t.top - stage.top,
      tw: t.width,
      th: t.height,
      cx: t.left - stage.left + t.width / 2,
      cy: t.top - stage.top + t.height * 0.5,
    };
    geoCache.current = { v, t: now };
    return v;
  }, [targetRef]);

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    setComplete(true);
    setBurst((b) => b + 1);
    onGlow(1);
    sfx("bell", { pitch: 220, vel: 0.7 });
    setTimeout(() => sfx("shankha", { vel: 0.5 }), 700);
  }, [onGlow, sfx]);

  // ── Watched Aarti: build the path from config ──────────────────
  const segments = useRef<Segment[]>([]);
  const buildSegments = useCallback(() => {
    const g = geometry();
    if (!g) return [];
    const segs: Segment[] = [];
    let prev: [number, number] = [g.w / 2, g.h * 0.92];
    for (const step of aartiConfig.watchedSequence) {
      const cx = g.cx;
      const cy = g.top + g.th * step.y;
      const r = Math.max(28, g.th * step.radius);
      const rx = step.region === "whole" ? Math.min(g.w * 0.46, Math.max(r * 0.8, g.tw * 0.62)) : r * 0.9;
      const ry = r;
      const start: [number, number] = [cx, cy + ry];
      segs.push({ kind: "move", label: REGION_LABEL[step.region], from: prev, to: start, dur: 1.1 });
      const per = step.region === "whole" ? aartiConfig.secondsPerFullRound : aartiConfig.secondsPerSmallRound;
      segs.push({ kind: "circle", label: REGION_LABEL[step.region], cx, cy, rx, ry, rounds: step.rounds, dur: step.rounds * per });
      prev = start;
    }
    segs.push({ kind: "move", label: "The Aarti is offered", from: prev, to: [g.w / 2, g.h * 0.86], dur: 1.4 });
    return segs;
  }, [geometry]);

  // ── main animation loop ────────────────────────────────────────
  useEffect(() => {
    const g = geometry();
    if (!g) return;
    const rest = { x: g.w / 2, y: Math.min(g.h * 0.84, g.top + g.th + 70) };
    pos.current = { ...rest };
    target.current = { ...rest };
    emitter.current.active = true;
    if (mode === "watch") {
      segments.current = buildSegments();
      sfx("shankha", { vel: 0.45 });
    }
    let raf = 0;
    let lastRoundSeen = 0;
    let lastFrame = performance.now();
    const t0 = performance.now() + (mode === "watch" ? 2200 : 0);
    let lastLabel = "";

    const place = () => {
      const { x, y } = pos.current;
      if (lampRef.current) {
        lampRef.current.style.transform = `translate3d(${x - THALI / 2}px, ${y + FINGER_TO_WICK - THALI_H * (82 / 120)}px, 0)`;
      }
      emitter.current.x = x;
      emitter.current.y = y;
    };

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (mode === "watch") {
        const el = (now - t0) / 1000;
        if (el < 0) {
          place();
          return;
        }
        let acc = 0;
        let found = false;
        for (const s of segments.current) {
          if (el < acc + s.dur) {
            const k = (el - acc) / s.dur;
            if (s.kind === "move") {
              const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
              pos.current.x = s.from[0] + (s.to[0] - s.from[0]) * e;
              pos.current.y = s.from[1] + (s.to[1] - s.from[1]) * e;
            } else {
              const a = Math.PI / 2 + TAU * s.rounds * k; // start at the bottom, clockwise
              pos.current.x = s.cx + Math.cos(a) * s.rx;
              pos.current.y = s.cy + Math.sin(a) * s.ry;
              const r = Math.floor(s.rounds * k);
              if (r > lastRoundSeen) {
                lastRoundSeen = r;
                sfx("ghanti", { vel: 0.35 });
              }
            }
            if (s.kind === "circle" && s.label !== lastLabel) {
              lastLabel = s.label;
              lastRoundSeen = 0;
              setCaption(`${s.label} · ${s.rounds} ${s.rounds === 1 ? "circle" : "circles"}`);
              sfx("bell", { vel: 0.35 });
            }
            found = true;
            break;
          }
          acc += s.dur;
        }
        const total = segments.current.reduce((a, s) => a + s.dur, 0);
        emitter.current.intensity = Math.min(1, el / total);
        onGlowThrottled(Math.min(1, el / total));
        if (!found && !doneRef.current) {
          setCaption("The Aarti is complete");
          finish();
        }
      } else {
        // assisted circle (accessible alternative): the lamp follows the path exactly,
        // so the round is counted reliably even on slow devices / low frame rates.
        const as = assist.current;
        const gA = as ? geometry() : null;
        if (as && gA) {
          const k = Math.min(1, (performance.now() - as.start) / 2600);
          const a = as.from + TAU * 1.08 * k; // slightly over one turn
          const rad = as.d0 + (as.r - as.d0) * Math.min(1, k / 0.15); // glide onto the circle first
          pos.current.x = target.current.x = gA.cx + Math.cos(a) * rad * 0.85;
          pos.current.y = target.current.y = gA.cy + Math.sin(a) * rad;
        } else {
          // smooth follow, frame-rate independent
          const dt = Math.min(0.1, (now - lastFrame) / 1000);
          const alpha = 1 - Math.pow(1 - 0.38, dt * 60);
          pos.current.x += (target.current.x - pos.current.x) * alpha;
          pos.current.y += (target.current.y - pos.current.y) * alpha;
        }
        lastFrame = now;
        const gg = geometry();
        if (gg && (dragging.current || assist.current)) {
          let state: GestureState;
          if (as) {
            // Assisted circle: credit progress from the animation itself, so it is
            // exact at any frame rate (the drag filter would reject big per-frame jumps).
            const k = Math.min(1, (performance.now() - as.start) / 2600);
            const credited = TAU * 1.08 * k;
            state = { lastAngle: null, total: gesture.current.total + Math.max(0, credited - as.credited) };
            as.credited = credited;
          } else {
            state = stepGesture(gesture.current, pos.current.x, pos.current.y, gg.cx, gg.cy, {
              minRadius: Math.max(24, Math.min(gg.tw, gg.th) * 0.12),
            }).state;
          }
          gesture.current = state;
          if (as && performance.now() - as.start >= 2600) {
            assist.current = null;
            // taps made while a circle was still finishing are queued, never dropped
            if (queuedAssists.current > 0 && !doneRef.current) {
              queuedAssists.current--;
              startAssist();
            }
          }
          const q = Math.floor(state.total / (TAU / 4));
          if (q > quarter.current) {
            quarter.current = q;
            if (q % 4 !== 0) sfx("ghanti", { vel: 0.2, pitch: 1500 + (q % 4) * 40 });
          }
          const r = roundsCompleted(state);
          if (r > userRounds.current) {
            userRounds.current = r;
            setRounds(r);
            sfx("bell", { vel: 0.45, pitch: 277 });
            const glow = Math.min(1, r / goal);
            emitter.current.intensity = glow;
            onGlow(glow);
            if (r >= goal) finish();
          }
        }
      }
      place();
    };

    let lastGlow = -1;
    const onGlowThrottled = (v: number) => {
      if (Math.abs(v - lastGlow) > 0.05) {
        lastGlow = v;
        onGlow(v);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      emitter.current.active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  // ── pointer handling (interactive) ─────────────────────────────
  // The stage is fixed full-screen (inset-0), so its viewport offset is effectively constant.
  const stageOrigin = useRef<{ x: number; y: number } | null>(null);
  const toLocal = (e: React.PointerEvent) => {
    if (!stageOrigin.current) {
      const r = stageRef.current!.getBoundingClientRect();
      stageOrigin.current = { x: r.left, y: r.top };
    }
    return { x: e.clientX - stageOrigin.current.x, y: e.clientY - stageOrigin.current.y - FINGER_TO_WICK };
  };
  const onDown = (e: React.PointerEvent) => {
    if (mode !== "interactive" || (e.target as HTMLElement).closest("button")) return;
    dragging.current = true;
    assist.current = null;
    stageOrigin.current = null; // refresh once per drag
    setHint(false);
    stageRef.current?.setPointerCapture(e.pointerId);
    const p = toLocal(e);
    target.current = p;
  };
  const onMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    target.current = toLocal(e);
  };
  const onUp = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    dragging.current = false;
    gesture.current = releaseGesture(gesture.current);
    try {
      stageRef.current?.releasePointerCapture(e.pointerId);
    } catch {}
  };

  const startAssist = () => {
    const g = geometry();
    if (!g) return;
    const r = Math.max(70, Math.min(g.th * 0.42, g.w * 0.42));
    const from = Math.atan2(pos.current.y - g.cy, pos.current.x - g.cx);
    const d0 = Math.hypot(pos.current.x - g.cx, (pos.current.y - g.cy) / 1) || r;
    gesture.current = releaseGesture(gesture.current);
    assist.current = { start: performance.now(), from, r, d0, credited: 0 };
  };

  const offerAssisted = () => {
    setHint(false);
    if (assist.current) queuedAssists.current = Math.min(queuedAssists.current + 1, goal);
    else startAssist();
  };

  const again = () => {
    doneRef.current = false;
    setComplete(false);
    setRounds(0);
    userRounds.current = 0;
    queuedAssists.current = 0;
    gesture.current = initialGesture();
    quarter.current = 0;
    onGlow(0);
    if (mode === "watch") onExit();
  };

  return (
    <div
      ref={stageRef}
      className={`absolute inset-0 z-20 ${mode === "interactive" ? "cursor-grab touch-none select-none active:cursor-grabbing" : ""}`}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      data-testid={`aarti-${mode}`}
    >
      <FlameCanvas emitter={emitter} />
      <div ref={lampRef} className="pointer-events-none absolute left-0 top-0 z-10 will-change-transform" style={{ width: THALI }}>
        <AartiThali size={THALI} />
      </div>

      {/* caption / instructions */}
      <div className="pointer-events-none absolute inset-x-0 top-16 z-30 px-4 text-center" aria-live="polite">
        {mode === "watch" ? (
          <p className="mx-auto inline-block rounded-full bg-night/80 px-4 py-1.5 font-display text-lg italic text-gold-light">{caption}</p>
        ) : (
          !complete && (
            <p className="mx-auto inline-block max-w-md rounded-2xl bg-night/85 px-4 py-2 text-sm text-ivory/90 sm:text-base">
              {hint ? "Touch and hold anywhere, then guide the lamp in gentle clockwise circles around the deity." : `Circle ${Math.min(rounds + 1, goal)} of ${goal}`}
            </p>
          )
        )}
      </div>

      {/* progress + controls */}
      <div className="absolute inset-x-0 bottom-0 z-30 px-4 pb-4" style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}>
        {mode === "interactive" && (
          <div className="mb-3 flex justify-center gap-2" role="progressbar" aria-valuemin={0} aria-valuemax={goal} aria-valuenow={rounds} aria-label="Aarti circles offered">
            {Array.from({ length: goal }, (_, i) => (
              <span
                key={i}
                className={`h-3 w-3 rounded-full border transition-all duration-500 ${i < rounds ? "border-gold-light bg-gold-light shadow-[0_0_12px_3px_rgba(255,210,120,0.8)]" : "border-gold/50 bg-transparent"}`}
              />
            ))}
          </div>
        )}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {mode === "interactive" && !complete && (
            <button type="button" className="btn-ghost !text-xs" onClick={offerAssisted} data-testid="assist">
              Offer a circle for me
            </button>
          )}
          <button type="button" className="btn-ghost !text-xs" onClick={onExit}>
            {complete ? "Return to Darshan" : "End Aarti"}
          </button>
        </div>
      </div>

      {complete && (
        <>
          <Petals burst={burst} count={40} />
          <div className="pointer-events-none absolute inset-0 z-30 grid place-items-center">
            <div className="ring-burst h-48 w-48 rounded-full border-2 border-gold-light/80 shadow-[0_0_60px_10px_rgba(255,210,120,0.5)]" />
          </div>
          <div className="absolute inset-x-0 top-28 z-40 flex justify-center px-4">
            <div className="ornate animate-rise px-6 py-5 text-center" role="status">
              <p className="font-display text-2xl text-gold-light">Your Aarti is complete</p>
              <p className="mt-1 text-sm text-ivory/75">Stay before the deity for as long as you wish.</p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <button type="button" className="btn-ghost !text-xs" onClick={again}>
                  {mode === "interactive" ? "Offer Aarti again" : "Close"}
                </button>
                {mode === "interactive" && (
                  <button type="button" className="btn-gold !min-h-[44px] !text-xs" onClick={onExit}>
                    Continue in Darshan
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
