import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllDeities, getDeity } from "@/lib/content";
import { listPackages } from "@/config/packages";
import { DeityClient } from "./DeityClient";

// New deity JSON files are picked up without code changes; unknown slugs 404.
export const dynamicParams = true;

export function generateStaticParams() {
  return getAllDeities().map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const d = getDeity(slug);
  if (!d) return { title: "Not found" };
  return { title: d.name, description: d.shortDescription };
}

export default async function DeityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const deity = getDeity(slug);
  if (!deity) notFound();
  return <DeityClient deity={deity} packages={listPackages()} />;
}
