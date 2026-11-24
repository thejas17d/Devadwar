/**
 * Build-target flags (inlined at build time).
 *
 * - Server build (default, `npm run build`): API routes exist; demo orders and
 *   receipts are priced and HMAC-signed on the server.
 * - Static build (`npm run build:pages`, GitHub Pages): no server exists, so the
 *   demo payment runs entirely in the browser. It is still DEMO ONLY — no money
 *   moves — and real payments can never run on static hosting.
 */
export const STATIC_DEMO = process.env.NEXT_PUBLIC_STATIC_DEMO === "1";

/** e.g. "/Devadwar" on GitHub Pages project sites, "" elsewhere. */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

/** Prefix a /public asset path with the base path (needed for plain strings, e.g. <img src>, new Audio()). */
export function assetPath(src: string): string {
  if (!src.startsWith("/") || !BASE_PATH || src.startsWith(BASE_PATH + "/")) return src;
  return BASE_PATH + src;
}
