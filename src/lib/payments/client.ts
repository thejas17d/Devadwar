/**
 * Browser-side payment calls. Picks the right implementation for the build target.
 *
 * Server build → calls the API routes (server prices + signs).
 * Static build (GitHub Pages) → an in-browser DEMO that mirrors the same shapes.
 *   It is not secure and does not need to be: no money ever moves in demo mode,
 *   and live payments require the server build (see ARCHITECTURE.md §8).
 */
import { getPackage, type PackageId } from "@/config/packages";
import { STATIC_DEMO } from "@/lib/env";
import type { Receipt, SignedOrder } from "./types";

const STATIC_SIG = "static-demo-unsigned";

const rid = (prefix: string) => {
  const bytes = new Uint8Array(9);
  crypto.getRandomValues(bytes);
  return `${prefix}_${Array.from(bytes, (b) => b.toString(36).padStart(2, "0")).join("").slice(0, 12)}`;
};

async function post<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || "Something went wrong. Please try again.");
  return data as T;
}

export async function createOrder(deity: string, packageId: PackageId): Promise<SignedOrder> {
  if (!STATIC_DEMO) return post<SignedOrder>("/api/orders", { deity, packageId });
  const pkg = getPackage(packageId);
  if (!pkg) throw new Error("That experience is not available.");
  return {
    order: {
      orderId: rid("demo_order"),
      deity,
      packageId: pkg.id,
      amountPaise: pkg.pricePaise, // always from config, never from the UI
      currency: "INR",
      mode: "demo",
      createdAt: new Date().toISOString(),
    },
    token: STATIC_SIG,
  };
}

export async function confirmDemoPayment(signed: SignedOrder): Promise<Receipt> {
  if (!STATIC_DEMO) return (await post<{ receipt: Receipt }>("/api/payments/demo/confirm", signed)).receipt;
  const { order } = signed;
  const pkg = getPackage(order.packageId);
  if (!pkg || pkg.pricePaise !== order.amountPaise) throw new Error("This order could not be confirmed. Please start again.");
  return {
    receiptId: rid("demo_rcpt"),
    orderId: order.orderId,
    paymentId: rid("demo_pay"),
    deity: order.deity,
    packageId: order.packageId,
    amountPaise: order.amountPaise,
    currency: "INR",
    mode: "demo",
    status: "demo_completed",
    issuedAt: new Date().toISOString(),
    signature: STATIC_SIG,
  };
}

export async function verifyReceipt(receipt: Receipt): Promise<boolean> {
  if (!STATIC_DEMO) return (await post<{ valid: boolean }>("/api/receipts/verify", { receipt })).valid === true;
  // Static demo: sanity-check against config (nothing to protect — no money moved).
  const pkg = getPackage(receipt.packageId);
  return !!pkg && receipt.status === "demo_completed" && receipt.amountPaise === pkg.pricePaise;
}
