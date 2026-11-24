/**
 * Server-only payment helpers. Never import from client components.
 *
 * DEMO MODE: orders and receipts are stateless and HMAC-signed with
 * DEMO_SIGNING_SECRET so the client cannot tamper with amounts.
 * No money moves and nothing pretends otherwise.
 *
 * LIVE MODE is intentionally not implemented — see ARCHITECTURE.md §Payments
 * for the gateway checklist (backend order creation, signature verification,
 * verified webhooks, persistent payment records).
 */
import crypto from "node:crypto";
import { getPackage, type PackageId } from "@/config/packages";
import type { Order, Receipt, SignedOrder, PaymentMode } from "./types";

const DEV_FALLBACK_SECRET = "devadwar-demo-only-not-a-secret";

export function paymentMode(): PaymentMode {
  return process.env.PAYMENT_MODE === "live" ? "live" : "demo";
}

function demoSecret(): string {
  const s = process.env.DEMO_SIGNING_SECRET;
  if (s && s.length >= 16 && s !== "change-me-to-a-long-random-string") return s;
  if (process.env.NODE_ENV === "production") {
    console.warn("[payments] DEMO_SIGNING_SECRET not set — using insecure fallback (demo mode only).");
  }
  return DEV_FALLBACK_SECRET;
}

export function hmac(data: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(data).digest("hex");
}

export function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  return ab.length === bb.length && crypto.timingSafeEqual(ab, bb);
}

const canonicalOrder = (o: Order) => [o.orderId, o.deity, o.packageId, o.amountPaise, o.currency, o.mode, o.createdAt].join("|");
const canonicalReceipt = (r: Omit<Receipt, "signature">) =>
  [r.receiptId, r.orderId, r.paymentId, r.deity, r.packageId, r.amountPaise, r.currency, r.mode, r.status, r.issuedAt].join("|");

const rid = (prefix: string) => `${prefix}_${crypto.randomBytes(9).toString("base64url")}`;

/** Creates a demo order. The amount ALWAYS comes from server-side config. */
export function createDemoOrder(deity: string, packageId: PackageId, now = new Date()): SignedOrder {
  const pkg = getPackage(packageId);
  if (!pkg) throw new Error("Unknown package");
  const order: Order = {
    orderId: rid("demo_order"),
    deity,
    packageId: pkg.id,
    amountPaise: pkg.pricePaise,
    currency: "INR",
    mode: "demo",
    createdAt: now.toISOString(),
  };
  return { order, token: hmac(canonicalOrder(order), demoSecret()) };
}

export function verifyOrderToken(order: Order, token: string): boolean {
  if (typeof token !== "string" || token.length !== 64) return false;
  return safeEqual(hmac(canonicalOrder(order), demoSecret()), token);
}

/** Simulated payment completion. Only valid for demo orders with a valid token. */
export function completeDemoPayment(order: Order, token: string, now = new Date()): Receipt | null {
  if (order.mode !== "demo" || !verifyOrderToken(order, token)) return null;
  const pkg = getPackage(order.packageId);
  if (!pkg || pkg.pricePaise !== order.amountPaise) return null; // price changed since order → re-create
  const age = now.getTime() - new Date(order.createdAt).getTime();
  if (!(age >= 0 && age < 30 * 60 * 1000)) return null; // orders expire after 30 minutes
  const base: Omit<Receipt, "signature"> = {
    receiptId: rid("demo_rcpt"),
    orderId: order.orderId,
    paymentId: rid("demo_pay"),
    deity: order.deity,
    packageId: order.packageId,
    amountPaise: order.amountPaise,
    currency: "INR",
    mode: "demo",
    status: "demo_completed",
    issuedAt: now.toISOString(),
  };
  return { ...base, signature: hmac(canonicalReceipt(base), demoSecret()) };
}

export function verifyReceipt(r: Receipt): boolean {
  const { signature, ...rest } = r;
  return typeof signature === "string" && safeEqual(hmac(canonicalReceipt(rest), demoSecret()), signature);
}

// ── Future gateway (Razorpay) — verification helpers, NOT wired up ──────────
// Razorpay documents payment signature = HMAC_SHA256(order_id + "|" + payment_id, key_secret)
// and webhook signature = HMAC_SHA256(raw_request_body, webhook_secret) in X-Razorpay-Signature.
// Confirm against current gateway documentation at integration time.

export function verifyGatewayPaymentSignature(orderId: string, paymentId: string, signature: string, keySecret: string): boolean {
  if (!orderId || !paymentId || !signature || !keySecret) return false;
  return safeEqual(hmac(`${orderId}|${paymentId}`, keySecret), signature);
}

export function verifyGatewayWebhookSignature(rawBody: string, signature: string | null, webhookSecret: string): boolean {
  if (!signature || !webhookSecret) return false;
  return safeEqual(hmac(rawBody, webhookSecret), signature);
}
