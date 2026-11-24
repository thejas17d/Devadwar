import { chromium } from "@playwright/test";
const b = await chromium.launch({ channel: "chrome" });
const p = await b.newPage({ viewport: { width: 1366, height: 820 } });
p.on("console", (m) => console.log("console:", m.type(), m.text().slice(0, 200)));
p.on("pageerror", (e) => console.log("pageerror:", e.message));
await p.goto("http://localhost:3123/");
await p.waitForTimeout(1000);
const t0 = Date.now();
await p.getByRole("switch").click();
await p.getByTestId("enter").click();
console.log("clicked", Date.now() - t0);
for (let i = 0; i < 10; i++) {
  await p.waitForTimeout(1000);
  const r = await Promise.race([
    p.evaluate(() => new Promise((res) => { let n = 0; const t = performance.now(); const f = () => { n++; performance.now() - t < 500 ? requestAnimationFrame(f) : res(n * 2); }; requestAnimationFrame(f); })).then((fps) => `fps ${fps}`),
    new Promise((r) => setTimeout(() => r("evaluate TIMEOUT"), 4000)),
  ]);
  console.log(`t+${i + 1}s`, p.url().replace("http://localhost:3123", ""), r);
}
await b.close();
