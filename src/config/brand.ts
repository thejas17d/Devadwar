/**
 * BRAND CONFIGURATION — the single place to rename the product.
 *
 * "Devadwar" (देवद्वार, "Gateway of the Divine") is a WORKING NAME only.
 * See docs/BRANDING.md for the shortlist. Domain and trademark availability
 * have NOT been verified — run a TM search (ipindia.gov.in) and domain checks
 * before committing to any name.
 *
 * Every placeholder in [square brackets] must be filled before launch.
 */
export const brand = {
  name: "Devadwar",
  nameDevanagari: "देवद्वार",
  meaning: "Gateway of the Divine",
  tagline: "A gateway to quiet devotion",
  intro:
    "Step through the celestial gate into a sanctuary of light, music and prayer. Choose your deity, offer your Sankalp, and spend a peaceful moment in devotion — for as long as you wish.",
  shortDescription:
    "An independent digital devotional experience. Not affiliated with any temple or religious trust.",

  // ── Legal / contact placeholders (must be completed before launch) ──
  legalEntityName: "[Legal entity name — to be confirmed]",
  registeredAddress: "[Registered office address — to be confirmed]",
  supportEmail: "[support email — to be confirmed]",
  supportPhone: "[support phone — optional]",
  jurisdictionCity: "[City]",
  grievanceOfficer: {
    name: "[Grievance Officer name — to be appointed]",
    designation: "Grievance Officer",
    email: "[grievance email — to be confirmed]",
    address: "[Address for correspondence — to be confirmed]",
    responseWindow: "acknowledge within 48 hours and resolve within one month",
  },
  legalReviewNotice:
    "DRAFT — This document must be reviewed and approved by a qualified Indian lawyer before commercial launch.",
  copyrightYear: 2026,
} as const;

export type Brand = typeof brand;

/** Closing blessings shown on the completion screen (no outcome guarantees). */
export const closingMessages = [
  "May your path ahead be filled with peace and positivity.",
  "May you find strength, clarity and hope in every step.",
  "Thank you for spending this moment in devotion.",
  "May the light you carried today stay gently with you.",
] as const;
