import type { Metadata } from "next";
import { getDeity } from "@/lib/content";
import { CompleteClient } from "./CompleteClient";

export const metadata: Metadata = { title: "With gratitude", robots: { index: false } };

export default async function CompletePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const deity = typeof sp.deity === "string" ? getDeity(sp.deity) : null;
  return <CompleteClient deity={deity} />;
}
