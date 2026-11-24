"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Deity, TrackRole } from "@/lib/types";
import { getPackage, type DevotionalPackage } from "@/config/packages";
import { clearSession, loadSession, type ExperienceSession } from "@/lib/payments/session";
import { verifyReceipt } from "@/lib/payments/client";
import { DeityBackdrop } from "@/components/deity/DeityBackdrop";
import { Shrine } from "@/components/deity/Shrine";
import { AudioControls } from "@/components/audio/AudioControls";
import { useAudio, useSoundscape } from "@/components/audio/AudioProvider";
import { SankalpRitual } from "@/components/experience/SankalpRitual";
import { PrayerBox } from "@/components/experience/PrayerBox";
import { AartiStage } from "@/components/experience/AartiStage";
import { Petals } from "@/components/visual/Petals";
import { Diya } from "@/components/visual/Flame";

type Phase = "loading" | "invalid" | "curtain" | "sankalp" | "darshan" | "aarti-watch" | "aarti-interactive" | "closing";

export function ExperienceClient({ deities }: { deities: Deity[] }) {
  const router = useRouter();
  const audio = useAudio();
  const [session, setSession] = useState<ExperienceSession | null>(null);
  const [deity, setDeity] = useState<Deity | null>(null);
  const [pkg, setPkg] = useState<DevotionalPackage | null>(null);
  const [phase, setPhase] = useState<Phase>("loading");
  const [curtainOpen, setCurtainOpen] = useState(false);
  const [sankalpPlaced, setSankalpPlaced] = useState(false);
  const [mantra, setMantra] = useState(false);
  const [glow, setGlow] = useState(0);
  const [petals, setPetals] = useState(0);
  const [fs, setFs] = useState(false);
  const shrineRef = useRef<HTMLDivElement>(null);

  const role: TrackRole = phase === "aarti-watch" || phase === "aarti-interactive" ? "aarti" : mantra ? "mantra" : "ambient";
  useSoundscape(deity?.slug ?? null, role);

  // Load + verify the (demo) receipt.
  useEffect(() => {
    const s = loadSession();
    const d = s ? deities.find((x) => x.slug === s.receipt.deity) ?? null : null;
    const p = s ? getPackage(s.receipt.packageId) : null;
    if (!s || !d || !p) {
      setPhase("invalid");
      return;
    }
    let cancelled = false;
    verifyReceipt(s.receipt)
      .then((valid) => {
        if (cancelled) return;
        if (!valid) return setPhase("invalid");
        setSession(s);
        setDeity(d);
        setPkg(p);
        setPhase("curtain");
      })
      .catch(() => !cancelled && setPhase("invalid"));
    return () => {
      cancelled = true;
    };
  }, [deities]);

  // Keep the screen awake during a long darshan (where supported).
  useEffect(() => {
    if (phase === "loading" || phase === "invalid" || phase === "closing") return;
    let lock: { release: () => Promise<void> } | null = null;
    const nav = navigator as Navigator & { wakeLock?: { request: (t: "screen") => Promise<{ release: () => Promise<void> }> } };
    nav.wakeLock
      ?.request("screen")
      .then((l) => (lock = l))
      .catch(() => {});
    return () => {
      lock?.release().catch(() => {});
    };
  }, [phase]);

  useEffect(() => {
    const onFs = () => setFs(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  const openCurtain = async () => {
    if (!audio.unlocked && audio.soundWanted) {
      // The tap on "Open the curtain" is a user gesture, so sound may begin here.
      await audio.enableSound();
    }
    audio.sfx("bell", { vel: 0.55 });
    setCurtainOpen(true);
    setTimeout(() => setPhase(session?.wantsSankalp ? "sankalp" : "darshan"), 1600);
  };

  const conclude = useCallback(() => {
    setPhase("closing");
    setSankalpPlaced(false);
    audio.sfx("bell", { pitch: 220, vel: 0.5 });
    const slug = deity?.slug ?? "";
    clearSession();
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    setTimeout(() => router.push(`/complete?deity=${encodeURIComponent(slug)}`), 1800);
  }, [audio, deity, router]);

  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    else document.documentElement.requestFullscreen?.().catch(() => {});
  };

  if (phase === "loading") {
    return (
      <main id="main" className="grid min-h-dvh place-items-center" aria-busy="true">
        <div className="mantra-breathe">
          <Diya size={56} />
          <span className="sr-only">Preparing the sanctum…</span>
        </div>
      </main>
    );
  }

  if (phase === "invalid" || !deity || !pkg || !session) {
    return (
      <main id="main" className="grid min-h-dvh place-items-center px-4 text-center">
        <div className="ornate max-w-md px-6 py-8">
          <h1 className="font-display text-3xl text-gold-light">No active experience</h1>
          <p className="mt-3 text-ivory/75">
            This sanctum opens after you choose a deity and an experience. If you have just concluded a visit, you are welcome to
            begin another.
          </p>
          <Link href="/deities" className="btn-gold mt-6">
            Divine Gallery
          </Link>
        </div>
      </main>
    );
  }

  const inAarti = phase === "aarti-watch" || phase === "aarti-interactive";
  const caps = pkg.capabilities;

  return (
    <div className="fixed inset-0 overflow-hidden" data-testid="experience">
      <DeityBackdrop theme={deity.theme} />

      {/* top bar */}
      <header className="absolute inset-x-0 top-0 z-40 flex items-center justify-between gap-2 px-3 pt-3" style={{ paddingTop: "max(0.75rem, env(safe-area-inset-top))" }}>
        <div className={`min-w-0 rounded-full bg-night/75 px-3 py-1 ${inAarti ? "invisible" : ""}`}>
          <p className="truncate font-display text-sm text-gold-light sm:text-base">
            {deity.name} · <span className="text-ivory/70">{pkg.name}</span>
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {typeof document !== "undefined" && document.fullscreenEnabled && (
            <button type="button" className="icon-btn !bg-night/50" onClick={toggleFullscreen} aria-label={fs ? "Exit full screen" : "Enter full screen"}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                {fs ? <path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" /> : <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />}
              </svg>
            </button>
          )}
          <button type="button" className="btn-ghost !min-h-[40px] !px-4 !text-xs" onClick={conclude} disabled={phase === "closing"} data-testid="conclude">
            Conclude
          </button>
        </div>
      </header>

      {/* sanctum */}
      <main id="main" className="absolute inset-0 flex flex-col items-center justify-center px-4 pb-28 pt-16">
        <div ref={shrineRef} className={`relative transition-transform duration-[1500ms] ${curtainOpen ? "scale-100" : "scale-95"}`}>
          <Shrine deity={deity} size="xl" glowBoost={glow} />
          {sankalpPlaced && (
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2" title="Your Sankalp rests in the Prayer Box">
              <PrayerBox closed glowing size={74} />
              <span className="sr-only">Your Sankalp rests in the Prayer Box.</span>
            </div>
          )}
        </div>
        {mantra && !inAarti && (
          <div className="mantra-breathe pointer-events-none absolute inset-x-0 top-[12%] z-10 px-4 text-center" aria-live="polite">
            <p className="font-deva text-3xl text-gold-light drop-shadow-[0_0_12px_rgba(255,210,120,0.6)] sm:text-4xl" lang="sa">
              {deity.mantra.devanagari}
            </p>
            <p className="mt-1 font-display text-lg italic text-ivory/85">{deity.mantra.transliteration}</p>
          </div>
        )}
      </main>

      {petals > 0 && <Petals burst={petals} count={28} />}

      {/* darshan actions */}
      {phase === "darshan" && (
        <nav aria-label="Devotional actions" className="absolute inset-x-0 bottom-0 z-30 px-3 pb-4" style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}>
          <div className="mx-auto flex max-w-2xl flex-wrap items-center justify-center gap-2 pr-14 sm:pr-0">
            {caps.interactiveAarti && (
              <button type="button" className="btn-gold !min-h-[44px] !px-5 !text-sm" onClick={() => setPhase("aarti-interactive")} data-testid="perform-aarti">
                🪔 Perform Aarti
              </button>
            )}
            {caps.watchAarti && (
              <button
                type="button"
                className={caps.interactiveAarti ? "btn-ghost !text-xs" : "btn-gold !min-h-[44px] !px-5 !text-sm"}
                onClick={() => setPhase("aarti-watch")}
                data-testid="watch-aarti"
              >
                Watch Aarti
              </button>
            )}
            <button type="button" className="btn-ghost !text-xs" aria-pressed={mantra} onClick={() => setMantra((m) => !m)}>
              {mantra ? "Hide mantra" : "Mantra"}
            </button>
            <button
              type="button"
              className="btn-ghost !text-xs"
              onClick={() => {
                setPetals((p) => p + 1);
                audio.sfx("chime", { vel: 0.3 });
              }}
            >
              Offer flowers
            </button>
            <button type="button" className="btn-ghost !text-xs" onClick={() => audio.sfx("bell", { vel: 0.6 })}>
              Ring bell
            </button>
            {!sankalpPlaced && caps.sankalp && (
              <button type="button" className="btn-ghost !text-xs" onClick={() => setPhase("sankalp")}>
                Write Sankalp
              </button>
            )}
          </div>
        </nav>
      )}

      {inAarti && (
        <AartiStage
          key={phase}
          mode={phase === "aarti-watch" ? "watch" : "interactive"}
          targetRef={shrineRef}
          onGlow={setGlow}
          onExit={() => {
            setGlow(0);
            setPhase("darshan");
          }}
        />
      )}

      {phase === "sankalp" && (
        <SankalpRitual
          deityName={deity.name}
          onPlaced={() => {
            setSankalpPlaced(true);
            setPhase("darshan");
          }}
          onSkip={() => setPhase("darshan")}
        />
      )}

      {/* curtains */}
      <div className={`pointer-events-none absolute inset-0 z-50 ${curtainOpen ? "curtains-open" : ""}`} aria-hidden={curtainOpen}>
        <div className="curtain curtain-left" />
        <div className="curtain curtain-right" />
      </div>
      {phase === "curtain" && !curtainOpen && (
        <div className="absolute inset-0 z-[60] grid place-items-center px-6 text-center">
          <div className="animate-rise">
            <p className="font-deva text-3xl text-gold-light" lang="sa">
              {deity.nameDevanagari}
            </p>
            <h1 className="mt-1 font-display text-4xl font-semibold text-ivory sm:text-5xl">{deity.name}</h1>
            <p className="mt-2 text-ivory/80">Take a breath. When you are ready, open the curtain.</p>
            <button type="button" className="btn-gold mt-6" onClick={openCurtain} data-testid="open-curtain">
              Open the curtain
            </button>
            <p className="mt-4 text-xs text-ivory/60">There is no time limit. Stay as long as you wish and conclude whenever you choose.</p>
          </div>
        </div>
      )}

      {/* closing fade */}
      <div
        className="pointer-events-none absolute inset-0 z-[70] bg-[radial-gradient(circle,#fff6dc,#f3d98b_50%,#c98a3a)] transition-opacity duration-[1600ms]"
        style={{ opacity: phase === "closing" ? 1 : 0 }}
        aria-hidden="true"
      />

      {!inAarti && phase !== "curtain" && <AudioControls />}
      {inAarti && <AudioControls position="top-left" />}
    </div>
  );
}
