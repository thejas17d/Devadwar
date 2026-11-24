import { verifyReceipt } from "@/lib/payments/server";
import type { Receipt } from "@/lib/payments/types";
import { jsonError, jsonOk, readJson } from "@/lib/http/json";

/** POST /api/receipts/verify { receipt } → { valid } */
export async function POST(req: Request) {
  const body = await readJson(req);
  const receipt = body?.receipt as Receipt | undefined;
  if (!receipt || typeof receipt !== "object") return jsonError(400, "bad_request", "Invalid request body.");
  return jsonOk({ valid: verifyReceipt(receipt) });
}
