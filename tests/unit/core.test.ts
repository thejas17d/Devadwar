import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { formatINR, getPackage, listPackages, packages } from "@/config/packages";
import { initialGesture, normalizeAngle, releaseGesture, roundsCompleted, stepGesture, TAU } from "@/lib/aarti/gesture";
import {
  completeDemoPayment,
  createDemoOrder,
  verifyGatewayPaymentSignature,
  verifyGatewayWebhookSignature,
  verifyOrderToken,
  verifyReceipt,
} from "@/lib/payments/server";
import { validateDeity, validateTrack } from "@/lib/validate";
import { getAllDeities, getAudioManifest, getPlayableManifest } from "@/lib/content";
import { pickTrack } from "@/components/audio/AudioProvider";
import { sanitizeSankalp, SANKALP_MAX } from "@/components/experience/SankalpRitual";
import { hasEmblem } from "@/components/deity/emblems";
import { brand } from "@/config/brand";

describe("pricing configuration", () => {
  it("has exactly the three launch packages at ₹10 / ₹20 / ₹30", () => {
    const list = listPackages();
    expect(list.map((p) => p.id)).toEqual(["digitalDarshan", "digitalAarti", "interactiveAarti"]);
    expect(list.map((p) => p.pricePaise)).toEqual([1000, 2000, 3000]);
  });
  it("formats INR without decimals for whole rupees", () => {
    expect(formatINR(1000)).toBe("₹10");
    expect(formatINR(3000)).toBe("₹30");
    expect(formatINR(1050)).toBe("₹10.50");
  });
  it("capabilities escalate as described", () => {
    expect(packages.digitalDarshan.capabilities).toMatchObject({ watchAarti: false, interactiveAarti: false, sankalp: true });
    expect(packages.digitalAarti.capabilities).toMatchObject({ watchAarti: true, interactiveAarti: false, sankalp: true });
    expect(packages.interactiveAarti.capabilities).toMatchObject({ watchAarti: true, interactiveAarti: true, sankalp: true });
  });
  it("rejects unknown / prototype package ids", () => {
    expect(getPackage("nope")).toBeNull();
    expect(getPackage("__proto__")).toBeNull();
    expect(getPackage("toString")).toBeNull();
    expect(getPackage(null)).toBeNull();
  });
  it("package copy never promises outcomes or ties price to blessings", () => {
    const text = JSON.stringify(packages).toLowerCase();
    for (const banned of ["guarantee", "stronger blessing", "more blessing", "wish will", "fulfil", "miracle", "official", "priest"]) {
      expect(text, `found "${banned}"`).not.toContain(banned);
    }
  });
});

describe("interactive aarti gesture", () => {
  const cx = 200,
    cy = 200;
  const circle = (n: number, steps = 64, dir = 1, r = 100) => {
    let s = initialGesture();
    for (let i = 0; i <= n * steps; i++) {
      const a = dir * (i / steps) * TAU;
      s = stepGesture(s, cx + Math.cos(a) * r, cy + Math.sin(a) * r, cx, cy).state;
    }
    return s;
  };
  it("counts clockwise (screen-space) circles", () => {
    expect(roundsCompleted(circle(1))).toBe(1);
    expect(roundsCompleted(circle(7))).toBe(7);
  });
  it("ignores counter-clockwise movement without penalty", () => {
    expect(roundsCompleted(circle(3, 64, -1))).toBe(0);
  });
  it("ignores jitter near the centre", () => {
    expect(roundsCompleted(circle(3, 64, 1, 10))).toBe(0);
  });
  it("ignores teleport jumps (finger lifted and placed elsewhere)", () => {
    let s = initialGesture();
    s = stepGesture(s, cx + 100, cy, cx, cy).state;
    const r = stepGesture(s, cx - 100, cy + 1, cx, cy); // ~180° jump
    expect(r.delta).toBe(0);
  });
  it("release resets the anchor but keeps progress", () => {
    const s = releaseGesture(circle(2));
    expect(s.lastAngle).toBeNull();
    expect(roundsCompleted(s)).toBe(2);
  });
  it("normalizes angles into (-π, π]", () => {
    expect(normalizeAngle(3 * Math.PI)).toBeCloseTo(Math.PI);
    expect(normalizeAngle(-Math.PI / 2)).toBeCloseTo(-Math.PI / 2);
  });
});

describe("demo payments (server)", () => {
  it("creates orders whose amount comes from config, signed", () => {
    const { order, token } = createDemoOrder("shiva", "interactiveAarti");
    expect(order.amountPaise).toBe(3000);
    expect(order.mode).toBe("demo");
    expect(verifyOrderToken(order, token)).toBe(true);
  });
  it("rejects a tampered amount", () => {
    const { order, token } = createDemoOrder("shiva", "interactiveAarti");
    const tampered = { ...order, amountPaise: 100 };
    expect(verifyOrderToken(tampered, token)).toBe(false);
    expect(completeDemoPayment(tampered, token)).toBeNull();
  });
  it("rejects a tampered package (upgrade for free)", () => {
    const { order, token } = createDemoOrder("shiva", "digitalDarshan");
    expect(completeDemoPayment({ ...order, packageId: "interactiveAarti" }, token)).toBeNull();
  });
  it("issues a verifiable demo receipt and marks it as demo", () => {
    const { order, token } = createDemoOrder("krishna", "digitalAarti");
    const r = completeDemoPayment(order, token)!;
    expect(r.status).toBe("demo_completed");
    expect(verifyReceipt(r)).toBe(true);
    expect(verifyReceipt({ ...r, packageId: "interactiveAarti" })).toBe(false);
  });
  it("expires orders after 30 minutes", () => {
    const { order, token } = createDemoOrder("rama", "digitalDarshan", new Date("2026-01-01T00:00:00Z"));
    expect(completeDemoPayment(order, token, new Date("2026-01-01T00:31:00Z"))).toBeNull();
    expect(completeDemoPayment(order, token, new Date("2026-01-01T00:10:00Z"))).not.toBeNull();
  });
  it("gateway signature helpers verify HMAC correctly (not wired up yet)", () => {
    const secret = "test_secret";
    const sig = crypto.createHmac("sha256", secret).update("order_1|pay_1").digest("hex");
    expect(verifyGatewayPaymentSignature("order_1", "pay_1", sig, secret)).toBe(true);
    expect(verifyGatewayPaymentSignature("order_1", "pay_2", sig, secret)).toBe(false);
    expect(verifyGatewayPaymentSignature("order_1", "pay_1", sig, "")).toBe(false);
    const body = '{"event":"payment.captured"}';
    const wsig = crypto.createHmac("sha256", "wh").update(body).digest("hex");
    expect(verifyGatewayWebhookSignature(body, wsig, "wh")).toBe(true);
    expect(verifyGatewayWebhookSignature(body + " ", wsig, "wh")).toBe(false);
    expect(verifyGatewayWebhookSignature(body, null, "wh")).toBe(false);
  });
});

describe("content library", () => {
  it("loads all 10 launch deities, valid and ordered", () => {
    const d = getAllDeities();
    expect(d.map((x) => x.slug)).toEqual(["shiva", "ganesha", "vishnu", "krishna", "hanuman", "durga", "lakshmi", "saraswati", "rama", "venkateswara"]);
    for (const x of d) {
      expect(validateDeity(x)).toEqual([]);
      expect(hasEmblem(x.art.emblem)).toBe(true);
    }
  });
  it("rejects a malformed deity file", () => {
    expect(validateDeity({ slug: "Bad Slug!" }).length).toBeGreaterThan(3);
    const ok = getAllDeities()[0];
    expect(validateDeity({ ...ok, art: { ...ok.art, image: "https://evil.example/x.png" } })).toContain("art.image must be null or a path under /deities/");
  });
  it("every deity has a distinct ambient, mantra and aarti soundscape", () => {
    const m = getAudioManifest();
    for (const d of getAllDeities()) {
      for (const role of ["ambient", "mantra", "aarti"] as const) {
        const t = m.tracks.find((x) => x.deity === d.slug && x.role === role && x.cleared);
        expect(t, `${d.slug}/${role}`).toBeTruthy();
      }
    }
    const seeds = m.tracks.filter((t) => t.source.type === "procedural").map((t) => (t.source as { seed: number }).seed);
    expect(new Set(seeds).size).toBe(seeds.length);
  });
  it("every track carries rights metadata; uncleared tracks never reach the client", () => {
    const m = getAudioManifest();
    for (const t of m.tracks) expect(validateTrack(t)).toEqual([]);
    expect(m.tracks.some((t) => !t.cleared)).toBe(true); // the template slot
    expect(getPlayableManifest().tracks.every((t) => t.cleared)).toBe(true);
  });
  it("pickTrack never returns an uncleared track, even if explicitly selected", () => {
    const tracks = getAudioManifest().tracks;
    const t = pickTrack(tracks, { deity: "shiva", role: "mantra" }, "shiva-mantra-recorded");
    expect(t?.id).toBe("shiva-mantra");
  });
  it("falls back sensibly for a deity without tracks", () => {
    const t = pickTrack(getAudioManifest().tracks, { deity: "new-deity", role: "ambient" });
    expect(t?.id).toBe("gallery-hall");
  });
  it("no deity copy implies temple affiliation or guaranteed outcomes", () => {
    const text = JSON.stringify(getAllDeities()).toLowerCase();
    for (const banned of ["guarantee", "official", "ttd", "devasthanam", "will be fulfilled", "will come true"]) expect(text).not.toContain(banned);
  });
});

describe("sankalp privacy & input", () => {
  it("strips control and bidi-override characters and clamps length", () => {
    expect(sanitizeSankalp("a\u0000b‮c​d")).toBe("abcd");
    expect(sanitizeSankalp("x".repeat(SANKALP_MAX + 50))).toHaveLength(SANKALP_MAX);
    expect(sanitizeSankalp("line1\nline2")).toBe("line1\nline2");
  });
  it("keeps Devanagari and other scripts intact", () => {
    expect(sanitizeSankalp("मेरे परिवार को शांति मिले 🙏")).toBe("मेरे परिवार को शांति मिले 🙏");
  });
  it("no source file sends sankalp text anywhere (static check)", () => {
    const files: string[] = [];
    const walk = (dir: string) => {
      for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
        const p = path.join(dir, f.name);
        if (f.isDirectory()) walk(p);
        else if (/\.(ts|tsx)$/.test(f.name)) files.push(p);
      }
    };
    walk(path.join(process.cwd(), "src"));
    const ritual = fs.readFileSync(path.join(process.cwd(), "src/components/experience/SankalpRitual.tsx"), "utf8");
    for (const banned of ["fetch(", "localStorage", "sessionStorage", "navigator.sendBeacon", "console.log", "XMLHttpRequest"]) {
      expect(ritual, banned).not.toContain(banned);
    }
    // no analytics / tracking SDKs anywhere
    for (const f of files) {
      const src = fs.readFileSync(f, "utf8");
      expect(src, f).not.toMatch(/gtag\(|googletagmanager|mixpanel|segment\.io|hotjar|fbq\(/i);
    }
  });
});

describe("brand configuration", () => {
  it("is centralised and flags legal placeholders", () => {
    expect(brand.name.length).toBeGreaterThan(0);
    expect(brand.legalReviewNotice).toMatch(/Indian lawyer/);
  });
});
