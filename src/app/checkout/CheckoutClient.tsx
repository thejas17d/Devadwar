"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { Deity } from "@/lib/types";
import { formatINR, type DevotionalPackage } from "@/config/packages";
import type { SignedOrder, Receipt } from "@/lib/payments/types";
import { saveSession } from "@/lib/payments/session";
import { DeityBackdrop } from "@/components/deity/DeityBackdrop";
import { DeityArt } from "@/components/deity/DeityArt";
import { AudioControls } from "@/components/audio/AudioControls";
import { useAudio, useSoundscape } from "@/components/audio/AudioProvider";

type Stage = "review" | "creating" | "sheet" | "confirming" | "error";

export function CheckoutClient({ deity, pkg }: { deity: Deity; pkg: DevotionalPackage }) {
  useSoundscape(deity.slug, "ambient");
  const router = useRouter();
  const { sfx } = useAudio();
  const [wantsSankalp, setWantsSankalp] = useState(true);
  const [ack, setAck] = useState(false);
  const [stage, setStage] = useState<Stage>("review");
  const [error, setError] = useState<string | null>(null);
  const [signed, setSigned] = useState<SignedOrder | null>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (stage === "sheet") sheetRef.current?.querySelector<HTMLButtonElement>("[data-autofocus]")?.focus();
  }, [stage]);

  const startPayment = async () => {
    if (!ack) return;
    setError(null);
    setStage("creating");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deity: deity.slug, packageId: pkg.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Could not create the order.");
      setSigned(data as SignedOrder);
      setStage("sheet");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setStage("error");
    }
  };

  const confirmDemo = async () => {
    if (!signed) return;
    setStage("confirming");
    try {
      const res = await fetch("/api/payments/demo/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signed),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Could not confirm the demo payment.");
      const receipt = data.receipt as Receipt;
      if (!saveSession({ receipt, wantsSankalp })) throw new Error("Your browser blocked session storage. Please allow it and try again.");
      sfx("bell", { vel: 0.5 });
      router.push("/experience");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setStage("error");
    }
  };

  const busy = stage === "creating" || stage === "confirming";

  return (
    <div className="relative min-h-dvh">
      <DeityBackdrop theme={deity.theme} particles={false} />
      <header className="mx-auto flex max-w-3xl items-center justify-between px-4 pt-5">
        <Link href={`/deities/${deity.slug}`} className="btn-ghost !min-h-[40px] !px-4 !text-xs">
          ← Back
        </Link>
      </header>

      <main id="main" className="mx-auto max-w-xl px-4 pb-28 pt-6">
        <div role="note" className="mb-5 rounded-xl border-2 border-dashed border-saffron/80 bg-saffron/15 px-4 py-3 text-center text-sm" data-testid="demo-banner">
          <strong className="font-display text-base tracking-[0.18em] text-saffron">DEMO MODE</strong>
          <span className="block text-ivory/90">No real payment is taken. No card, UPI or bank details are requested.</span>
        </div>

        <h1 className="text-center font-display text-3xl font-semibold text-gold-grad sm:text-4xl">Confirm your experience</h1>

        <section className="ornate mt-6 px-5 py-6" aria-label="Order summary">
          <div className="flex items-center gap-4">
            <div className="h-24 w-20 shrink-0 rounded-t-full border border-gold/50 bg-[radial-gradient(circle_at_50%_40%,rgba(255,220,150,0.25),transparent_70%)] p-1">
              <DeityArt deity={deity} className="h-full w-full" />
            </div>
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-[0.2em] text-gold/80">Deity</p>
              <p className="font-display text-2xl font-semibold text-ivory">{deity.name}</p>
              <p className="text-sm italic text-ivory/65">{deity.epithet}</p>
            </div>
          </div>

          <div className="mt-5 border-t border-gold/25 pt-4">
            <p className="text-xs uppercase tracking-[0.2em] text-gold/80">Experience</p>
            <div className="flex items-baseline justify-between gap-3">
              <p className="font-display text-xl font-semibold text-ivory">{pkg.name}</p>
              <p className="font-display text-xl text-gold-light">{formatINR(pkg.pricePaise)}</p>
            </div>
            <ul className="mt-2 space-y-1 text-sm text-ivory/80">
              {pkg.features.map((f) => (
                <li key={f} className="flex gap-2">
                  <span className="text-gold" aria-hidden="true">
                    ✦
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-5 border-t border-gold/25 pt-4">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                className="mt-1 h-5 w-5 shrink-0 accent-[#d4a64a]"
                checked={wantsSankalp}
                onChange={(e) => setWantsSankalp(e.target.checked)}
                data-testid="sankalp-option"
              />
              <span>
                <span className="font-display text-lg text-ivory">Begin by writing a private Sankalp</span>
                <span className="block text-sm text-ivory/65">
                  Optional and included. Your words stay only on this device and are released when you conclude. You can skip
                  it at any time.
                </span>
              </span>
            </label>
          </div>

          <div className="mt-5 flex items-baseline justify-between border-t border-gold/40 pt-4">
            <p className="font-display text-xl text-ivory">Total</p>
            <p className="font-display text-3xl font-bold text-gold-grad" data-testid="total">
              {formatINR(pkg.pricePaise)}
            </p>
          </div>
          <p className="mt-1 text-left sm:text-right text-xs text-ivory/50">Demo mode: you will not be charged.</p>
        </section>

        <label className="mt-6 flex cursor-pointer items-start gap-3 text-sm text-ivory/85">
          <input type="checkbox" className="mt-0.5 h-5 w-5 shrink-0 accent-[#d4a64a]" checked={ack} onChange={(e) => setAck(e.target.checked)} data-testid="ack" />
          <span>
            I understand this is an independent <strong>digital devotional experience</strong>, not a temple service, priest-performed
            ritual or donation, and that no spiritual outcome is promised. I have read the{" "}
            <Link href="/terms" className="text-gold-light underline underline-offset-2" target="_blank">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/refunds" className="text-gold-light underline underline-offset-2" target="_blank">
              Refund Policy
            </Link>
            .
          </span>
        </label>

        {error && (
          <p role="alert" className="mt-4 rounded-lg border border-red-400/60 bg-red-900/30 px-3 py-2 text-sm text-red-100">
            {error}
          </p>
        )}

        <button type="button" className="btn-gold mt-6 w-full" disabled={!ack || busy} onClick={startPayment} data-testid="pay">
          {stage === "creating" ? "Preparing…" : `Demo payment · ${formatINR(pkg.pricePaise)}`}
        </button>
      </main>

      {/* Demo payment sheet */}
      {(stage === "sheet" || stage === "confirming") && signed && (
        <div className="fixed inset-0 z-50 grid place-items-end bg-black/80 sm:place-items-center" role="dialog" aria-modal="true" aria-labelledby="demo-sheet-title">
          <div ref={sheetRef} className="w-full max-w-md rounded-t-3xl border border-gold/50 bg-[#100c26] p-6 sm:rounded-3xl" style={{ paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))" }}>
            <p className="text-center font-display text-xs uppercase tracking-[0.3em] text-saffron">Simulated payment</p>
            <h2 id="demo-sheet-title" className="mt-1 text-center font-display text-2xl text-ivory">
              Demo payment · {formatINR(signed.order.amountPaise)}
            </h2>
            <dl className="mt-4 space-y-1 rounded-xl bg-white/5 p-4 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-ivory/60">Demo order</dt>
                <dd className="truncate font-mono text-xs text-ivory/85">{signed.order.orderId}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-ivory/60">Experience</dt>
                <dd className="text-ivory/85">{pkg.name}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-ivory/60">Amount</dt>
                <dd className="text-ivory/85">{formatINR(signed.order.amountPaise)} (not charged)</dd>
              </div>
            </dl>
            <p className="mt-4 text-sm text-ivory/75">
              This is a demonstration. Pressing the button below does <strong>not</strong> move any money. In the live product, this
              step will be handled by an RBI-authorised payment gateway.
            </p>
            <div className="mt-5 grid gap-3">
              <button type="button" className="btn-gold w-full" onClick={confirmDemo} disabled={stage === "confirming"} data-autofocus data-testid="confirm-demo">
                {stage === "confirming" ? "Opening the sanctum…" : "Complete demo payment"}
              </button>
              <button type="button" className="btn-ghost w-full" onClick={() => setStage("review")} disabled={stage === "confirming"}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <AudioControls />
    </div>
  );
}
