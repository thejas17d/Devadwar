import type { Metadata } from "next";
import { getAllDeities } from "@/lib/content";
import { GalleryClient } from "./GalleryClient";

export const metadata: Metadata = {
  title: "The Divine Gallery",
  description: "Choose the deity you wish to visit for a digital darshan, aarti or interactive aarti.",
};

export default async function DeitiesPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  return <GalleryClient deities={getAllDeities()} arrived={sp.via === "gate"} />;
}
