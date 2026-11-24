// Low-end device simulation: 6x CPU throttle (Chrome DevTools' "low-end mobile"), Pixel 7 viewport.
// Measures frame rate on the heavy screens, including the experience with a demo receipt.
import { chromium, devices } from "@playwright/test";
const BASE = process.env.BASE || "http://localhost:3123";
const b = await chromium.launch({ channel: "chrome" });
const ctx = await b.newContext(devices["Pixel 7"]);
const p = await ctx.newPage();
const cdp = await ctx.newCDPSession(p);
await cdp.send("Emulation.setCPUThrottlingRate", { rate: 6 });
const fps = () => p.evaluate(() => new Promise((res) => { let n = 0; const t = performance.now(); const f = () => { n++; performance.now() - t < 3000 ? requestAnimationFrame(f) : res(Math.round(n / 3)); }; requestAnimationFrame(f); }));
const out = [];
for (const url of ["/", "/deities", "/deities/durga"]) {
  await p.goto(BASE + url); await p.waitForTimeout(2500); out.push([url, await fps()]);
}
// experience: buy a ₹30 package via the demo flow
await p.goto(BASE + "/checkout?deity=durga&package=interactiveAarti");
await p.getByTestId("sankalp-option").uncheck(); await p.getByTestId("ack").check();
await p.getByTestId("pay").click(); await p.getByTestId("confirm-demo").click();
await p.waitForURL(/experience/); await p.getByTestId("open-curtain").click({ timeout: 30000 });
await p.waitForTimeout(3500); out.push(["experience: darshan", await fps()]);
await p.getByTestId("perform-aarti").click(); await p.waitForTimeout(1500);
out.push(["experience: interactive aarti (idle lamp)", await fps()]);
const box = await p.locator("[data-testid=experience] main > div").first().boundingBox();
await p.mouse.move(box.x + box.width / 2, box.y + box.height); await p.mouse.down();
const run = fps();
for (let i = 0; i < 60; i++) { const a = Math.PI / 2 + i / 20 * Math.PI; await p.mouse.move(box.x + box.width / 2 + Math.cos(a) * 120, box.y + box.height / 2 + Math.sin(a) * 140); }
out.push(["experience: interactive aarti (dragging)", await run]); await p.mouse.up();
for (const [k, v] of out) console.log(String(v).padStart(3), "fps ", k);
await b.close();
