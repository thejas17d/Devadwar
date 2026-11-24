"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Deity } from "@/lib/types";
import { formatINR, type DevotionalPackage, type PackageId } from "@/config/packages";
import { DeityBackdrop } from "@/components/deity/DeityBackdrop";
import { Shrine } from "@/components/deity/Shrine";
import { AudioControls } from "@/components/audio/AudioControls";
import { useAudio, useSoundscape } from "@/components/audio/AudioProvider";
import { SiteFooter } from "@/components/layout/SiteFooter";

export function DeityClient({ deity, packages }: { deity: Deity; packages: DevotionalPackage[] }) {
  useSoundscape(deity.slug, "ambient");
  const router = useRouter();
  const { sfx } = useAudio();
  const [selected, setSelected] = useState<PackageId | null>(null);

  const choose = (id: PackageId) => {
    setSelected(id);
    sfx("chime", { pitch: 1250, vel: 0.3 });
  };

  const proceed = () => {
    if (!selected) return;
    sfx("ghanti", { vel: 0.35 });
    router.push(`/checkout?deity=${encodeURIComponent(deity.slug)}&package=${encodeURIComponent(selected)}`);
  };

  return (
    <div className="relative min-h-dvh">
      <DeityBackdrop theme={deity.theme} />
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 pt-5">
        <Link href="/deities" className="btn-ghost !min-h-[40px] !px-4 !text-xs">
          ← Gallery
        </Link>
        <p className="font-deva text-xl text-gold-light/90" lang="sa">
          {deity.nameDevanagari}
        </p>
      </header>

      <main id="main" className="mx-auto max-w-6xl px-4 pb-28 pt-4 lg:grid lg:grid-cols-[1fr_1.05fr] lg:items-start lg:gap-10">
        <section className="animate-fade text-center lg:sticky lg:top-8" aria-label={`${deity.name} shrine`}>
          <Shrine deity={deity} />
          <h1 className="mt-4 font-display text-4xl font-semibold text-gold-grad sm:text-5xl">{deity.name}</h1>
          <p className="mt-1 font-display text-lg italic text-ivory/80">{deity.epithet}</p>
        </section>

        <section className="mt-6 animate-rise lg:mt-10" aria-labelledby="about-deity">
          <h2 id="about-deity" className="sr-only">
            About {deity.name}
          </h2>
          <p className="text-[1.08rem] leading-relaxed text-ivory/90">{deity.description}</p>
          <figure className="ornate mt-6 px-5 py-5 text-center">
            <p className="font-deva text-2xl text-gold-light sm:text-3xl" lang="sa">
              {deity.mantra.devanagari}
            </p>
            <p className="mt-1 font-display text-lg italic text-ivory/85">{deity.mantra.transliteration}</p>
            <figcaption className="mt-1 text-sm text-ivory/60">{deity.mantra.meaning}</figcaption>
          </figure>

          <h2 className="mt-9 font-display text-2xl font-semibold text-gold-light sm:text-3xl">Choose your devotional experience</h2>
          <p className="mt-1 text-sm text-ivory/65">
            Every experience is digital and symbolic, with no time limit. You stay as long as you wish.
          </p>

          <div role="radiogroup" aria-label="Devotional experience" className="mt-4 space-y-3">
            {packages.map((p) => (
              <button
                key={p.id}
                type="button"
                role="radio"
                aria-checked={selected === p.id}
                onClick={() => choose(p.id)}
                className="pkg-card w-full"
                data-testid={`pkg-${p.id}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-deva text-sm text-gold/80" lang="sa">
                      {p.nameDevanagari}
                    </p>
                    <p className="font-display text-xl font-semibold leading-tight text-ivory">
                      {p.name}
                      {p.badge && (
                        <span className="ml-2 inline-block translate-y-[-2px] rounded-full border border-gold/60 px-2 py-0.5 align-middle font-body text-[10px] uppercase tracking-widest text-gold-light">
                          {p.badge}
                        </span>
                      )}
                    </p>
                    <p className="mt-0.5 text-sm italic text-ivory/70">{p.tagline}</p>
                  </div>
                  <p className="shrink-0 font-display text-3xl font-bold text-gold-grad">{formatINR(p.pricePaise)}</p>
                </div>
                <ul className="mt-3 grid gap-1 text-sm text-ivory/80 sm:grid-cols-2">
                  {p.features.map((f) => (
                    <li key={f} className="flex gap-2">
                      <span className="text-gold" aria-hidden="true">
                        ✦
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
              </button>
            ))}
          </div>
          <p className="mt-4 text-xs leading-relaxed text-ivory/50">
            These are independent digital devotional experiences, not temple sevas or priest-performed rituals. The price
            reflects the digital features included, not the value of any blessing.
          </p>
        </section>
      </main>

      {/* sticky continue bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-gold/30 bg-night/95 px-4 py-3" style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 pr-16">
          <p className="min-w-0 truncate text-sm text-ivory/80" aria-live="polite">
            {selected ? (
              <>
                <span className="text-gold-light">{packages.find((p) => p.id === selected)?.name}</span> ·{" "}
                {formatINR(packages.find((p) => p.id === selected)!.pricePaise)}
              </>
            ) : (
              "Select an experience to continue"
            )}
          </p>
          <button type="button" className="btn-gold shrink-0 !px-5 !text-sm" disabled={!selected} onClick={proceed} data-testid="continue">
            Continue
          </button>
        </div>
      </div>
      <div className="pb-20">
        <SiteFooter />
      </div>
      <AudioControls />
    </div>
  );
}
