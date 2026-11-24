/**
 * Server-side content loader.
 *
 * Deities are plain JSON files in src/content/deities/. Adding a deity means
 * adding a JSON file (and optionally artwork + audio tracks) — no code changes.
 * Files are validated on load; an invalid file is skipped with a console error
 * rather than taking the whole site down.
 */
import fs from "node:fs";
import path from "node:path";
import type { AudioManifest, Deity, Track } from "./types";
import { validateDeity, validateTrack } from "./validate";

const CONTENT_DIR = path.join(process.cwd(), "src", "content");

let deityCache: Deity[] | null = null;
let manifestCache: AudioManifest | null = null;

export function getAllDeities(): Deity[] {
  if (deityCache && process.env.NODE_ENV === "production") return deityCache;
  const dir = path.join(CONTENT_DIR, "deities");
  const out: Deity[] = [];
  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".json")).sort()) {
    try {
      const raw = JSON.parse(fs.readFileSync(path.join(dir, file), "utf8"));
      const errors = validateDeity(raw);
      if (errors.length) {
        console.error(`[content] Skipping deities/${file}: ${errors.join("; ")}`);
        continue;
      }
      out.push(raw as Deity);
    } catch (e) {
      console.error(`[content] Could not parse deities/${file}`, e);
    }
  }
  deityCache = out.filter((d) => d.enabled).sort((a, b) => a.order - b.order);
  return deityCache;
}

export function getDeity(slug: string): Deity | null {
  return getAllDeities().find((d) => d.slug === slug) ?? null;
}

export function getAudioManifest(): AudioManifest {
  if (manifestCache && process.env.NODE_ENV === "production") return manifestCache;
  const raw = JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, "audio", "tracks.json"), "utf8"));
  const tracks: Track[] = [];
  for (const t of raw.tracks ?? []) {
    const errors = validateTrack(t);
    if (errors.length) {
      console.error(`[audio] Skipping track ${t?.id ?? "?"}: ${errors.join("; ")}`);
      continue;
    }
    tracks.push(t as Track);
  }
  manifestCache = { version: raw.version ?? 1, tracks };
  return manifestCache;
}

/** Tracks the client is allowed to receive: licence-cleared only. */
export function getPlayableManifest(): AudioManifest {
  const m = getAudioManifest();
  return { version: m.version, tracks: m.tracks.filter((t) => t.cleared) };
}
