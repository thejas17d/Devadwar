import type { Metadata } from "next";
import { Suspense } from "react";
import { getAllDeities } from "@/lib/content";
import { CheckoutRoute } from "./CheckoutRoute";

export const metadata: Metadata = { title: "Confirm your experience", robots: { index: false } };

// The selection is read from the URL in the browser, so this page works on
// static hosting (GitHub Pages) as well as on a Node server.
export default function CheckoutPage() {
  return (
    <Suspense fallback={<main id="main" className="min-h-dvh" aria-busy="true" />}>
      <CheckoutRoute deities={getAllDeities()} />
    </Suspense>
  );
}
