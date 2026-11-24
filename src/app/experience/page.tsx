import type { Metadata } from "next";
import { getAllDeities } from "@/lib/content";
import { ExperienceClient } from "./ExperienceClient";

export const metadata: Metadata = { title: "Darshan", robots: { index: false } };

export default function ExperiencePage() {
  return <ExperienceClient deities={getAllDeities()} />;
}
