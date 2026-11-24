export type Motif =
  | "kailash"
  | "temple-hall"
  | "ocean"
  | "vrindavan"
  | "sunrise"
  | "lotus-pond"
  | "river"
  | "hills";

export const MOTIFS: readonly Motif[] = [
  "kailash",
  "temple-hall",
  "ocean",
  "vrindavan",
  "sunrise",
  "lotus-pond",
  "river",
  "hills",
];

export interface DeityTheme {
  skyTop: string;
  skyBottom: string;
  glow: string;
  accent: string;
  motif: Motif;
}

export interface Deity {
  slug: string;
  order: number;
  enabled: boolean;
  name: string;
  nameDevanagari: string;
  epithet: string;
  shortDescription: string;
  description: string;
  mantra: { devanagari: string; transliteration: string; meaning: string };
  art: {
    /** Built-in SVG emblem id (see components/deity/emblems). */
    emblem: string;
    /** Optional commissioned/licensed image under /public/deities/<slug>/. Overrides the emblem. */
    image: string | null;
    imageAlt: string;
    credit: string;
  };
  theme: DeityTheme;
}

// ── Audio manifest ──────────────────────────────────────────────

export type TrackRole = "home" | "gallery" | "ambient" | "mantra" | "aarti";
export type LeadInstrument = "bansuri" | "veena" | "nadaswaram" | "none";
export type Percussion = "tabla" | "damaru" | "dholak" | "dhak" | "none";
export type BellStyle = "sparse" | "temple" | "aarti" | "none";

export interface ProceduralSource {
  type: "procedural";
  style: "celestial" | "ambient" | "mantra" | "aarti";
  /** Frequency of Sa (tonic) in Hz. */
  tonic: number;
  /** Raga pitch set as semitone offsets from Sa. */
  scale: number[];
  tempo: number;
  lead: LeadInstrument;
  lead2?: LeadInstrument;
  percussion: Percussion;
  bells: BellStyle;
  shankha?: boolean;
  density?: number;
  seed: number;
  raga?: string;
}

export interface FileSource {
  type: "file";
  src: string;
  mime: string;
}

export interface Track {
  id: string;
  title: string;
  deity: string | null;
  role: TrackRole;
  source: ProceduralSource | FileSource;
  creator: string;
  rightsHolder: string;
  licence: string;
  usage: { commercial: boolean; territory: string; attributionRequired: boolean; expires: string | null };
  /** Only cleared tracks are ever played. */
  cleared: boolean;
  notes?: string;
}

export interface AudioManifest {
  version: number;
  tracks: Track[];
}
