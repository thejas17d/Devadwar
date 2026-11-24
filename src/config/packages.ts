/**
 * DEVOTIONAL PACKAGE & PRICING CONFIGURATION — the only place prices live.
 *
 * Prices are stored in PAISE (integer) to avoid floating-point money bugs.
 * The server (/api/orders) re-derives the amount from this file; the client
 * never sends a price. Change a price here and every screen updates.
 *
 * Copy rules (legal): never imply a higher price gives stronger blessings,
 * better outcomes or wish fulfilment. These are digital experiences only.
 */

export type PackageId = "digitalDarshan" | "digitalAarti" | "interactiveAarti";

export interface PackageCapabilities {
  darshan: boolean;
  sankalp: boolean;
  watchAarti: boolean;
  interactiveAarti: boolean;
}

export interface DevotionalPackage {
  id: PackageId;
  order: number;
  available: boolean;
  name: string;
  nameDevanagari: string;
  pricePaise: number;
  currency: "INR";
  tagline: string;
  description: string;
  /** Human-readable features, shown on cards and the confirmation screen. */
  features: string[];
  capabilities: PackageCapabilities;
  /** Optional decorative badge. Must never claim spiritual superiority. */
  badge?: string;
}

export const packages: Record<PackageId, DevotionalPackage> = {
  digitalDarshan: {
    id: "digitalDarshan",
    order: 1,
    available: true,
    name: "Digital Darshan",
    nameDevanagari: "दर्शन",
    pricePaise: 1000,
    currency: "INR",
    tagline: "A quiet moment before the deity",
    description:
      "Enter a dedicated devotional environment and spend a peaceful moment in the presence of your chosen deity.",
    features: [
      "Full-screen digital viewing of the deity",
      "Dedicated devotional environment",
      "Deity-specific devotional music",
      "Optional private Sankalp note",
      "Peaceful ambient effects — stay as long as you wish",
    ],
    capabilities: { darshan: true, sankalp: true, watchAarti: false, interactiveAarti: false },
  },
  digitalAarti: {
    id: "digitalAarti",
    order: 2,
    available: true,
    name: "Digital Darshan + Aarti",
    nameDevanagari: "दर्शन · आरती",
    pricePaise: 2000,
    currency: "INR",
    tagline: "Watch a digital Aarti unfold",
    description:
      "Everything in Digital Darshan, plus a presented digital Aarti sequence with a brass lamp, temple bells and Aarti music.",
    features: [
      "Everything in Digital Darshan",
      "Presented digital Aarti sequence",
      "Brass Aarti lamp with animated flame",
      "Temple bell sound effects and Aarti music",
      "Aarti styled for your chosen deity",
    ],
    capabilities: { darshan: true, sankalp: true, watchAarti: true, interactiveAarti: false },
  },
  interactiveAarti: {
    id: "interactiveAarti",
    order: 3,
    available: true,
    name: "Interactive Digital Aarti",
    nameDevanagari: "स्वयं आरती",
    pricePaise: 3000,
    currency: "INR",
    tagline: "Hold the lamp yourself",
    description:
      "Everything in Darshan + Aarti, plus a virtual Aarti lamp you guide around the deity with your own finger or mouse.",
    features: [
      "Everything in Digital Darshan + Aarti",
      "Guide a virtual Aarti lamp with touch or mouse",
      "Flame and bells respond to your movement",
      "Tap-to-offer alternative for accessibility",
      "Completion moment when your circles are done",
    ],
    capabilities: { darshan: true, sankalp: true, watchAarti: true, interactiveAarti: true },
    badge: "Interactive",
  },
};

/** Aarti behaviour, shared by the watched and interactive experiences. */
export const aartiConfig = {
  /**
   * Watched Aarti follows a widely taught pattern: circles at the feet,
   * the navel, the face, then around the whole form. Each step is
   * {region, rounds}. Region is a 0–1 vertical position on the deity.
   */
  watchedSequence: [
    { region: "feet", y: 0.82, radius: 0.18, rounds: 4 },
    { region: "navel", y: 0.55, radius: 0.16, rounds: 2 },
    { region: "face", y: 0.3, radius: 0.14, rounds: 1 },
    { region: "whole", y: 0.52, radius: 0.42, rounds: 7 },
  ],
  secondsPerSmallRound: 1.9,
  secondsPerFullRound: 3.0,
  /** Clockwise circles the devotee completes in the interactive Aarti. */
  interactiveRounds: 7,
} as const;

export function listPackages(): DevotionalPackage[] {
  return Object.values(packages)
    .filter((p) => p.available)
    .sort((a, b) => a.order - b.order);
}

export function getPackage(id: string | null | undefined): DevotionalPackage | null {
  if (!id || !Object.prototype.hasOwnProperty.call(packages, id)) return null;
  const pkg = packages[id as PackageId];
  return pkg.available ? pkg : null;
}

/** ₹10, ₹20 … (whole rupees shown without decimals). */
export function formatINR(paise: number): string {
  const rupees = paise / 100;
  const whole = Number.isInteger(rupees);
  return (
    "₹" +
    rupees.toLocaleString("en-IN", {
      minimumFractionDigits: whole ? 0 : 2,
      maximumFractionDigits: 2,
    })
  );
}
