/**
 * Static build for GitHub Pages → ./out
 *
 *   node scripts/build-pages.mjs            (base path /Devadwar)
 *   BASE_PATH=/ node scripts/build-pages.mjs (custom domain at the root)
 *
 * API routes are excluded by next.config.ts (DEPLOY_TARGET=pages), not by moving files.
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "..");
const rawBase = process.env.BASE_PATH ?? "/Devadwar";
const basePath = rawBase === "/" ? "" : rawBase.replace(/\/$/, "");
const siteUrl = process.env.SITE_URL ?? `https://thejas17d.github.io${basePath}`;

execSync("npx next build", {
  cwd: root,
  stdio: "inherit",
  env: {
    ...process.env,
    DEPLOY_TARGET: "pages", // next.config.ts: static export, base path, .tsx-only routes (no API)
    NEXT_PUBLIC_STATIC_DEMO: "1",
    NEXT_PUBLIC_BASE_PATH: basePath,
    NEXT_PUBLIC_SITE_URL: siteUrl,
  },
});

const out = path.join(root, "out");
fs.writeFileSync(path.join(out, ".nojekyll"), ""); // keep the _next/ folder (Jekyll ignores _-prefixed dirs)
console.log(`\nStatic site ready in ./out  (base path "${basePath || "/"}", site ${siteUrl})`);
