import { completeDemoPayment, paymentMode } from "@/lib/payments/server";
import type { Order } from "@/lib/payments/types";
import { jsonError, jsonOk, readJson } from "@/lib/http/json";

/** POST /api/payments/demo/confirm { order, token } → signed DEMO receipt. No money moves. */
export async function POST(req: Request) {
  if (paymentMode() !== "demo") return jsonError(404, "not_found", "Not available.");
  const body = await readJson(req);
  const order = body?.order as Order | undefined;
  const token = body?.token;
  if (!order || typeof order !== "object" || typeof token !== "string") {
    return jsonError(400, "bad_request", "Invalid request body.");
  }
  const receipt = completeDemoPayment(order, token);
  if (!receipt) return jsonError(400, "invalid_order", "This order could not be confirmed. Please start again.");
  return jsonOk({ receipt });
}
