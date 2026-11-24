"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { brand } from "@/config/brand";
import { Gateway } from "@/components/gateway/Gateway";
import { Clouds } from "@/components/visual/Clouds";
import { ParticleField } from "@/components/visual/ParticleField";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { useAudio, useSoundscape } from "@/components/audio/AudioProvider";
import { AudioControls } from "@/components/audio/AudioControls";

export function HomeClient() {
  const router = useRouter();
  const audio = useAudio();
  const [withSound, setWithSound] = useState(true);
  const [phase, setPhase] = useState<"idle" | "opening" | "zoom">("idle");
  useSoundscape(null, "home");

  useEffect(() => {
    router.prefetch("/deities");
  }, [router]);

  const enter = async () => {
    if (phase !== "idle") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (withSound) {
      await audio.enableSound();
      audio.sfx("gong", { vel: 0.7 });
      setTimeout(() => audio.sfx("bell", { pitch: 277, vel: 0.45 }), 900);
    }
    setPhase("opening");
    setTimeout(() => setPhase("zoom"), reduce ? 200 : 2000);
    setTimeout(() => router.push("/deities?via=gate"), reduce ? 600 : 3300);
  };

  const zooming = phase === "zoom";

  return (
    <div className="relative min-h-dvh overflow-hidden">
      {/* sky */}
      <div className="pointer-events-none fixed inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#04061a_0%,#0e1440_28%,#2b2160_52%,#6b3a6e_70%,#c76f4a_86%,#f0b36a_100%)]" />
        <div className="rays absolute left-1/2 top-[52%] aspect-square w-[180vmax] -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute left-1/2 top-[56%] h-[60vmin] w-[60vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,226,160,0.55),rgba(255,180,90,0.15)_45%,transparent_70%)]" />
        <ParticleField stars={130} motes={34} />
      </div>
      <div className="pointer-events-none fixed inset-0" aria-hidden="true">
        <Clouds variant="dusk" />
      </div>

      <main
        id="main"
        className="relative z-10 flex min-h-dvh flex-col items-center px-4 pt-6 text-center transition-[transform,opacity] ease-in"
        style={{
          transform: zooming ? "scale(2.6) translateY(-4%)" : undefined,
          // promote to its own layer as soon as the doors start opening, so the zoom scales a texture instead of re-rasterising
          willChange: phase !== "idle" ? "transform, opacity" : undefined,
          transformOrigin: "50% 52%",
          transitionDuration: "1400ms",
          opacity: zooming ? 0 : 1,
        }}
      >
        <header className="animate-rise">
          <p className="font-deva text-2xl text-gold-light/90 sm:text-3xl" lang="sa">
            {brand.nameDevanagari}
          </p>
          <h1 className="mt-1 font-display text-4xl font-semibold uppercase tracking-[0.28em] text-gold-grad sm:text-6xl">{brand.name}</h1>
          <p className="mt-1 font-display text-base italic tracking-wide text-ivory/80 sm:text-lg">{brand.tagline}</p>
        </header>

        <div className="relative mt-4 w-[min(84vw,44dvh,460px)] animate-fade" style={{ animationDelay: "0.3s" }}>
          <Gateway open={phase !== "idle"} glow={0.4} />
          {/* cloud bank at the gate's feet */}
          <div className="pointer-events-none absolute -bottom-[10%] left-1/2 h-[26%] w-[170%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(ellipse_at_50%_40%,rgba(255,236,214,0.9),rgba(214,180,220,0.55)_45%,transparent_70%)]" />
        </div>

        <section
          className="relative z-10 mt-6 max-w-xl animate-rise transition-opacity duration-700"
          style={{ animationDelay: "0.6s", opacity: phase === "idle" ? undefined : 0 }}
          aria-label="Welcome"
        >
          <p className="text-[1.05rem] leading-relaxed text-ivory/90 sm:text-lg">{brand.intro}</p>
          <div className="mt-5 flex flex-col items-center gap-3">
            <button type="button" className="btn-gold min-w-[220px] text-lg" onClick={enter} disabled={phase !== "idle"} data-testid="enter">
              <span aria-hidden="true">✦</span> Enter <span aria-hidden="true">✦</span>
            </button>
            <button
              type="button"
              role="switch"
              aria-checked={withSound}
              onClick={() => setWithSound((s) => !s)}
              className="text-sm text-ivory/75 underline-offset-4 hover:text-gold-light hover:underline"
            >
              {withSound ? "♪ Entering with devotional sound — tap for silence" : "Entering in silence — tap to enable sound"}
            </button>
          </div>
        </section>

        <div className="mt-auto w-full pt-8">
          <SiteFooter compact />
        </div>
      </main>

      {/* white-gold bloom as we pass through the gate */}
      <div
        className="pointer-events-none fixed inset-0 z-20 bg-[radial-gradient(circle_at_50%_52%,#fffdf2,#ffe2a0_60%,#f0b36a)] transition-opacity duration-[1200ms]"
        style={{ opacity: zooming ? 1 : 0 }}
        aria-hidden="true"
      />
      {phase === "idle" && <AudioControls />}
    </div>
  );
}
