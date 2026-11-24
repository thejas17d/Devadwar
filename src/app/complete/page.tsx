import type { Metadata } from "next";
import { Suspense } from "react";
import { getAllDeities } from "@/lib/content";
import { CompleteClient } from "./CompleteClient";

export const metadata: Metadata = { title: "With gratitude", robots: { index: false } };

export default function CompletePage() {
  return (
    <Suspense fallback={<main id="main" className="min-h-dvh" aria-busy="true" />}>
      <CompleteClient deities={getAllDeities()} />
    </Suspense>
  );
}
