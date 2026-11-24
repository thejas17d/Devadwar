import { getDeity } from "@/lib/content";
import { getPackage } from "@/config/packages";
import { createDemoOrder, paymentMode } from "@/lib/payments/server";
import { jsonError, jsonOk, readJson } from "@/lib/http/json";

/**
 * POST /api/orders  { deity, packageId }
 * Creates an order. The client never sends a price — it is derived from config.
 * Note: the request body never contains Sankalp text (and must never).
 */
export async function POST(req: Request) {
  const body = await readJson(req);
  if (!body) return jsonError(400, "bad_request", "Invalid request body.");
  const deity = typeof body.deity === "string" ? getDeity(body.deity) : null;
  const pkg = typeof body.packageId === "string" ? getPackage(body.packageId) : null;
  if (!deity) return jsonError(404, "unknown_deity", "That deity is not available.");
  if (!pkg) return jsonError(404, "unknown_package", "That experience is not available.");

  if (paymentMode() !== "demo") {
    // Live payments are deliberately disabled until the owner approves gateway onboarding.
    return jsonError(503, "payments_unavailable", "Live payments are not enabled.");
  }
  return jsonOk(createDemoOrder(deity.slug, pkg.id), 201);
}
