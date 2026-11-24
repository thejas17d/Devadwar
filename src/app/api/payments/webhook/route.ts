import { jsonError } from "@/lib/http/json";

/**
 * Payment gateway webhook — DISABLED.
 *
 * When live payments are approved, this route will:
 *  1. read the RAW body (await req.text()) before any JSON parsing,
 *  2. verify X-Razorpay-Signature with verifyGatewayWebhookSignature(raw, sig, RAZORPAY_WEBHOOK_SECRET),
 *  3. idempotently upsert the payment record (event id) in a database,
 *  4. mark the order paid only on a verified `payment.captured` / `order.paid` event.
 * See ARCHITECTURE.md §Payments.
 */
export async function POST() {
  return jsonError(501, "not_implemented", "Payment webhooks are not enabled.");
}
