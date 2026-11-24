import { MOTIFS } from "./types";

const isStr = (v: unknown): v is string => typeof v === "string" && v.trim().length > 0;
const isColor = (v: unknown) => typeof v === "string" && /^#[0-9a-fA-F]{6}$/.test(v);

/** Returns a list of human-readable problems; empty means valid. */
export function validateDeity(d: any): string[] {
  const e: string[] = [];
  if (!d || typeof d !== "object") return ["not an object"];
  if (!isStr(d.slug) || !/^[a-z0-9-]+$/.test(d.slug)) e.push("slug must be lowercase a-z, 0-9, -");
  if (typeof d.order !== "number") e.push("order must be a number");
  if (typeof d.enabled !== "boolean") e.push("enabled must be boolean");
  for (const k of ["name", "nameDevanagari", "epithet", "shortDescription", "description"]) {
    if (!isStr(d[k])) e.push(`${k} is required`);
  }
  if (!d.mantra || !isStr(d.mantra.devanagari) || !isStr(d.mantra.transliteration) || !isStr(d.mantra.meaning)) {
    e.push("mantra.{devanagari,transliteration,meaning} required");
  }
  if (!d.art || !isStr(d.art.emblem) || !isStr(d.art.imageAlt)) e.push("art.emblem and art.imageAlt required");
  if (d.art?.image != null && (!isStr(d.art.image) || !d.art.image.startsWith("/deities/"))) {
    e.push("art.image must be null or a path under /deities/");
  }
  const t = d.theme;
  if (!t) e.push("theme required");
  else {
    for (const k of ["skyTop", "skyBottom", "glow", "accent"]) if (!isColor(t[k])) e.push(`theme.${k} must be #rrggbb`);
    if (!MOTIFS.includes(t.motif)) e.push(`theme.motif must be one of ${MOTIFS.join(", ")}`);
  }
  return e;
}

export function validateTrack(t: any): string[] {
  const e: string[] = [];
  if (!t || typeof t !== "object") return ["not an object"];
  if (!isStr(t.id)) e.push("id required");
  if (!isStr(t.title)) e.push("title required");
  if (!["home", "gallery", "ambient", "mantra", "aarti"].includes(t.role)) e.push("invalid role");
  if (typeof t.cleared !== "boolean") e.push("cleared must be boolean");
  for (const k of ["creator", "rightsHolder", "licence"]) if (!isStr(t[k])) e.push(`${k} required (rights tracking)`);
  const s = t.source;
  if (!s) e.push("source required");
  else if (s.type === "procedural") {
    if (typeof s.tonic !== "number" || s.tonic < 50 || s.tonic > 500) e.push("tonic must be 50–500 Hz");
    if (!Array.isArray(s.scale) || s.scale.length < 3) e.push("scale needs ≥3 notes");
    if (typeof s.tempo !== "number" || s.tempo < 20 || s.tempo > 200) e.push("tempo 20–200");
  } else if (s.type === "file") {
    if (!isStr(s.src) || !s.src.startsWith("/audio/")) e.push("file src must be under /audio/");
  } else e.push("source.type must be procedural or file");
  if (t.cleared && t.usage?.commercial !== true) e.push("cleared tracks must permit commercial use");
  return e;
}
