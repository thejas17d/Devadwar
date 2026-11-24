import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllDeities, getDeity } from "@/lib/content";
import { listPackages } from "@/config/packages";
import { DeityClient } from "./DeityClient";

// Every deity page is pre-rendered from the JSON files at build time (works on
// static hosting too). Adding a deity = add a JSON file + rebuild. Unknown slugs 404.
export const dynamicParams = false;

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
