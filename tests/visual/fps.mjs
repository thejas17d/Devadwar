// Measures requestAnimationFrame rate per page — a cheap proxy for main-thread / raster load.
import { chromium, devices } from "@playwright/test";
const BASE = "http://localhost:3123";
const b = await chromium.launch({ channel: "chrome" });
const profiles = { desktop: { viewport: { width: 1366, height: 820 } }, mobile: devices["Pixel 7"] };
const hide = process.argv[2]; // optional CSS selector to hide, to bisect
for (const [pn, opts] of Object.entries(profiles)) {
  const ctx = await b.newContext(opts);
  const p = await ctx.newPage();
  for (const url of ["/", "/deities", "/deities/shiva"]) {
    await p.goto(BASE + url);
    if (hide) await p.addStyleTag({ content: `${hide}{display:none!important}` });
    await p.waitForTimeout(1500);
    const fps = await p.evaluate(() => new Promise((res) => { let n = 0; const t0 = performance.now(); const f = () => { n++; if (performance.now() - t0 < 2000) requestAnimationFrame(f); else res(n / 2); }; requestAnimationFrame(f); }));
    console.log(pn.padEnd(8), url.padEnd(16), "fps", fps);
  }
  await ctx.close();
}
await b.close();
