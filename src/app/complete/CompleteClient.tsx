"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Deity } from "@/lib/types";
import { closingMessages } from "@/config/brand";
import { DeityBackdrop } from "@/components/deity/DeityBackdrop";
import { Diya } from "@/components/visual/Flame";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { AudioControls } from "@/components/audio/AudioControls";
import { useSoundscape } from "@/components/audio/AudioProvider";

const FALLBACK_THEME = { skyTop: "#0b0a24", skyBottom: "#3a2a5a", glow: "#ffd98a", accent: "#f3d98b", motif: "hills" as const };

export function CompleteClient({ deities }: { deities: Deity[] }) {
  const slug = useSearchParams().get("deity");
  const deity = deities.find((d) => d.slug === slug) ?? null;
  useSoundscape(deity?.slug ?? null, deity ? "ambient" : "gallery");
  const [message, setMessage] = useState<string>(closingMessages[0]);
  useEffect(() => {
    setMessage(closingMessages[Math.floor(Math.random() * closingMessages.length)]);
  }, []);

  return (
    <div className="relative min-h-dvh">
      <DeityBackdrop theme={deity?.theme ?? FALLBACK_THEME} />
      <div className="pointer-events-none fixed inset-0 z-50 animate-[fade-in_1.6s_ease_reverse_both] bg-[radial-gradient(circle,#fff6dc,#f3d98b_50%,#c98a3a)]" aria-hidden="true" />
      <main id="main" className="mx-auto flex min-h-[85dvh] max-w-xl flex-col items-center justify-center px-4 py-12 text-center">
        <div className="animate-rise">
          <Diya size={64} />
        </div>
        <p className="eyebrow mt-6 animate-rise" style={{ animationDelay: "0.3s" }}>
          {deity ? `Darshan of ${deity.name}` : "With gratitude"}
        </p>
        <h1 className="mt-3 animate-rise font-display text-3xl font-semibold leading-snug text-gold-grad sm:text-4xl" style={{ animationDelay: "0.5s" }} data-testid="closing-message">
          {message}
        </h1>
        <p className="mt-4 animate-rise text-ivory/75" style={{ animationDelay: "0.8s" }}>
          Thank you for spending this moment in devotion. Your Sankalp, if you wrote one, has been released. Nothing was kept.
        </p>
        <div className="mt-8 flex w-full animate-rise flex-col gap-3 sm:w-auto sm:flex-row" style={{ animationDelay: "1.1s" }}>
          <Link href="/deities" className="btn-gold">
            Explore another deity
          </Link>
          <Link href="/" className="btn-ghost">
            Return home
          </Link>
        </div>
        <p className="mt-6 text-xs text-ivory/50">Saved favourites and festival reminders are planned for a future release.</p>
      </main>
      <SiteFooter />
      <AudioControls />
    </div>
  );
}
