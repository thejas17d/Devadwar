import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.E2E_PORT || 3200);
// E2E_STATIC=1 tests the GitHub Pages build (./out) through scripts/serve-pages.mjs.
const STATIC = process.env.E2E_STATIC === "1";
// E2E_BASE_URL=https://… tests an already-deployed site (no local server started).
const REMOTE = process.env.E2E_BASE_URL;

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 90_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  // Real Chrome + canvas-heavy pages: too many parallel browsers starve rAF and cause false timeouts.
  workers: process.env.CI ? 2 : 3,
  retries: 0,
  reporter: [["list"]],
  use: { baseURL: REMOTE || `http://localhost:${PORT}`, trace: "retain-on-failure" },
  webServer: REMOTE ? undefined : {
    // Tests run against a production build: `npm run build` first.
    command: STATIC ? `node scripts/serve-pages.mjs` : `npx next start -p ${PORT}`,
    port: PORT,
    reuseExistingServer: true,
    timeout: 120_000,
  },
  projects: [
    { name: "desktop-chrome", use: { ...devices["Desktop Chrome"], channel: "chrome" } },
    { name: "android-chrome", use: { ...devices["Pixel 7"], channel: "chrome" } },
    { name: "iphone-webkit", use: { ...devices["iPhone 14"] } },
  ],
});
