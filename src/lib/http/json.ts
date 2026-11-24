import { NextResponse } from "next/server";

const MAX_BODY = 4 * 1024;

export function jsonError(status: number, code: string, error: string) {
  return NextResponse.json({ code, error }, { status, headers: { "Cache-Control": "no-store" } });
}

export function jsonOk(data: unknown, status = 200) {
  return NextResponse.json(data, { status, headers: { "Cache-Control": "no-store" } });
}

/** Parses a small JSON body; returns null on oversize / invalid JSON / wrong content type. */
export async function readJson(req: Request): Promise<Record<string, unknown> | null> {
  if (!(req.headers.get("content-type") || "").includes("application/json")) return null;
  const text = await req.text();
  if (text.length > MAX_BODY) return null;
  try {
    const v = JSON.parse(text);
    return v && typeof v === "object" && !Array.isArray(v) ? v : null;
  } catch {
    return null;
  }
}
