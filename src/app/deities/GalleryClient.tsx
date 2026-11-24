"use client";

import Link from "next/link";
import type { Deity } from "@/lib/types";
import { brand } from "@/config/brand";
import { Emblem } from "@/components/deity/emblems";
import { ParticleField } from "@/components/visual/ParticleField";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { AudioControls } from "@/components/audio/AudioControls";
import { useAudio, useSoundscape } from "@/components/audio/AudioProvider";
import Image from "next/image";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { assetPath } from "@/lib/env";

/** Gold bloom that continues the gateway transition — only when arriving through the gate. */
function ArrivalBloom() {
  const arrived = useSearchParams().get("via") === "gate";
  if (!arrived) return null;
  return <div className="pointer-events-none fixed inset-0 z-50 animate-[fade-in_1.4s_ease_reverse_both] bg-[radial-gradient(circle,#fffdf2,#ffe2a0_60%,#f0b36a)]" aria-hidden="true" />;
}

export function GalleryClient({ deities }: { deities: Deity[] }) {
  useSoundscape(null, "gallery");
  const { sfx } = useAudio();

  return (
    <div className="relative min-h-dvh">
      {/* temple hall atmosphere */}
      <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(120%_70%_at_50%_0%,#2a1f55_0%,#0d0b2a_45%,#05071a_100%)]" />
        <div className="absolute inset-x-0 top-0 h-40 bg-[repeating-linear-gradient(90deg,rgba(212,166,74,0.06)_0_2px,transparent_2px_80px)]" />
        <ParticleField stars={40} motes={30} />
      </div>
      {/* arrival bloom continuing from the gateway */}
      <Suspense fallback={null}>
        <ArrivalBloom />
      </Suspense>

      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 pt-5">
        <Link href="/" className="font-display text-lg uppercase tracking-[0.24em] text-gold-light">
          {brand.name}
        </Link>
        <Link href="/about" className="text-sm text-ivory/70 hover:text-gold-light">
          About
        </Link>
      </header>

      <main id="main" className="mx-auto max-w-6xl px-4 pb-6 pt-8">
        <div className="text-center animate-rise">
          <p className="eyebrow">
            <span className="font-deva tracking-normal">दिव्य दर्शन</span> · The Divine Gallery
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-gold-grad sm:text-5xl">Whom do you wish to visit?</h1>
          <p className="mx-auto mt-3 max-w-xl text-ivory/75">
            Each sanctum has its own environment and its own devotional music. Choose a deity to enter their shrine.
          </p>
          <div className="divider mx-auto mt-5 max-w-xs" aria-hidden="true">
            ❁
          </div>
        </div>

        <ul className="mt-8 grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-5" aria-label="Deities">
          {deities.map((d, i) => (
            <li key={d.slug} className="animate-rise flex" style={{ animationDelay: `${0.15 + i * 0.06}s` }}>
              <Link
                href={`/deities/${d.slug}`}
                className="niche w-full"
                onClick={() => sfx("chime", { pitch: 1180 + i * 40, vel: 0.35 })}
                aria-label={`${d.name} — ${d.epithet}`}
                style={{ ["--sky-top" as string]: d.theme.skyTop, ["--sky-bottom" as string]: d.theme.skyBottom, ["--glow" as string]: d.theme.glow }}
              >
                <div className="niche-emblem relative mt-4 aspect-[200/240] w-[78%]">
                  {d.art.image ? (
                    <Image src={assetPath(d.art.image)} alt="" fill sizes="200px" className="object-contain" />
                  ) : (
                    <Emblem id={d.art.emblem} label="" className="h-full w-full" />
                  )}
                </div>
                <div className="mt-2 px-1 text-center">
                  <p className="font-deva text-lg leading-tight text-gold-light/90" lang="sa">
                    {d.nameDevanagari}
                  </p>
                  <p className="font-display text-[1.15rem] font-semibold leading-tight text-ivory">{d.name}</p>
                  <p className="mt-1 hidden text-xs leading-snug text-ivory/65 sm:block">{d.epithet}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </main>
      <SiteFooter />
      <AudioControls />
    </div>
  );
}
