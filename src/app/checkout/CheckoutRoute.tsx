"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { Deity } from "@/lib/types";
import { getPackage } from "@/config/packages";
import { CheckoutClient } from "./CheckoutClient";

export function CheckoutRoute({ deities }: { deities: Deity[] }) {
  const sp = useSearchParams();
  const deity = deities.find((d) => d.slug === sp.get("deity")) ?? null;
  const pkg = getPackage(sp.get("package"));

  if (!deity || !pkg) {
    return (
      <main id="main" className="grid min-h-dvh place-items-center px-4 text-center">
        <div className="ornate max-w-md px-6 py-8">
          <h1 className="font-display text-3xl text-gold-light">Let us begin again</h1>
          <p className="mt-3 text-ivory/75">We couldn&apos;t find that deity or experience. Please choose again from the gallery.</p>
          <Link href="/deities" className="btn-gold mt-6">
            Divine Gallery
          </Link>
        </div>
      </main>
    );
  }
  return <CheckoutClient key={`${deity.slug}-${pkg.id}`} deity={deity} pkg={pkg} />;
}
