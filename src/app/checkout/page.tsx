import type { Metadata } from "next";
import Link from "next/link";
import { getDeity } from "@/lib/content";
import { getPackage } from "@/config/packages";
import { CheckoutClient } from "./CheckoutClient";

export const metadata: Metadata = { title: "Confirm your experience", robots: { index: false } };

export default async function CheckoutPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const deity = typeof sp.deity === "string" ? getDeity(sp.deity) : null;
  const pkg = typeof sp.package === "string" ? getPackage(sp.package) : null;

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
  return <CheckoutClient deity={deity} pkg={pkg} />;
}
