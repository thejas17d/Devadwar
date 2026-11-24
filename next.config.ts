import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

// Strict-but-practical CSP. When a payment gateway is enabled, its checkout
// origin must be added to script-src / frame-src / connect-src (see ARCHITECTURE.md).
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "media-src 'self' blob: data:",
  `connect-src 'self'${isDev ? " ws: wss:" : ""}`,
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

/**
 * Two build targets:
 *  - default: Node server (API routes, security headers) — production-capable.
 *  - DEPLOY_TARGET=pages: static export for GitHub Pages (see scripts/build-pages.mjs).
 *    Served under a base path, no server, no custom headers, demo payments in-browser only.
 */
const isPages = process.env.DEPLOY_TARGET === "pages";

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Dev only: let phones on the local network (e.g. 192.168.x.x) load dev assets for on-device testing.
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*"],
  poweredByHeader: false,
  ...(isPages
    ? {
        output: "export",
        distDir: "out", // the static export is written here (served by scripts/serve-pages.mjs, published by deploy-pages.mjs)
        // Static hosting can't run API routes. Every page/layout in this app is .tsx and every
        // API route is route.ts, so recognising only .tsx route files leaves the API out of the export.
        pageExtensions: ["tsx"],
        basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {
        images: { formats: ["image/avif", "image/webp"] },
        async headers() {
          return [{ source: "/:path*", headers: securityHeaders }];
        },
      }),
};

export default nextConfig;
