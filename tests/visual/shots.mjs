// Visual review screenshots. Usage: node shots.mjs <outdir> [which]
import { chromium, devices } from "@playwright/test";
const out = process.argv[2];
const which = process.argv[3] || "all";
const BASE = "http://localhost:3123";
const browser = await chromium.launch({ channel: "chrome" });

async function shoot(ctxOpts, name, fn) {
  const ctx = await browser.newContext(ctxOpts);
  const page = await ctx.newPage();
  const errs = [];
  page.on("pageerror", (e) => errs.push(e.message));
  page.on("console", (m) => m.type() === "error" && errs.push(m.text()));
  try {
    await fn(page);
  } catch (e) {
    console.log(name, "FAILED", e.message);
  }
  if (errs.length) console.log(name, "ERRORS:", errs.slice(0, 5));
  await ctx.close();
}
const desk = { viewport: { width: 1366, height: 820 } };
const mob = { ...devices["Pixel 7"] };

if (which === "all" || which === "home") {
  await shoot(desk, "home-d", async (p) => {
    await p.goto(BASE + "/");
    await p.waitForTimeout(1800);
    await p.screenshot({ path: `${out}/home-desktop.png` });
  });
  await shoot(mob, "home-m", async (p) => {
    await p.goto(BASE + "/");
    await p.waitForTimeout(1800);
    await p.screenshot({ path: `${out}/home-mobile.png` });
    await p.getByTestId("enter").click();
    await p.waitForTimeout(1500);
    await p.screenshot({ path: `${out}/home-opening.png` });
  });
}
if (which === "all" || which === "gallery") {
  await shoot(desk, "gal-d", async (p) => {
    await p.goto(BASE + "/deities");
    await p.waitForTimeout(1500);
    await p.screenshot({ path: `${out}/gallery-desktop.png`, fullPage: true });
  });
  await shoot(mob, "gal-m", async (p) => {
    await p.goto(BASE + "/deities");
    await p.waitForTimeout(1500);
    await p.screenshot({ path: `${out}/gallery-mobile.png`, fullPage: true });
  });
}
if (which === "all" || which === "deity") {
  for (const slug of (process.argv[4] || "shiva").split(",")) {
    await shoot(desk, "deity-d", async (p) => {
      await p.goto(BASE + "/deities/" + slug);
      await p.waitForTimeout(1200);
      await p.screenshot({ path: `${out}/deity-${slug}-desktop.png` });
    });
  }
  await shoot(mob, "deity-m", async (p) => {
    await p.goto(BASE + "/deities/krishna");
    await p.waitForTimeout(1200);
    await p.getByTestId("pkg-interactiveAarti").click();
    await p.screenshot({ path: `${out}/deity-mobile.png`, fullPage: true });
  });
}
if (which === "all" || which === "flow") {
  await shoot(mob, "flow", async (p) => {
    await p.goto(BASE + "/checkout?deity=durga&package=interactiveAarti");
    await p.waitForTimeout(800);
    await p.screenshot({ path: `${out}/checkout-mobile.png`, fullPage: true });
    await p.getByTestId("ack").check();
    await p.getByTestId("pay").click();
    await p.getByTestId("confirm-demo").waitFor();
    await p.screenshot({ path: `${out}/demo-sheet.png` });
    await p.getByTestId("confirm-demo").click();
    await p.waitForURL("**/experience");
    await p.getByTestId("open-curtain").waitFor();
    await p.screenshot({ path: `${out}/exp-curtain.png` });
    await p.getByTestId("open-curtain").click();
    await p.getByTestId("sankalp-text").waitFor();
    await p.getByTestId("sankalp-text").fill("May my family be healthy and at peace.\nGrateful for this day.");
    await p.screenshot({ path: `${out}/exp-sankalp.png` });
    await p.getByTestId("sankalp-place").click();
    await p.waitForTimeout(2000);
    await p.screenshot({ path: `${out}/exp-sankalp-rolling.png` });
    await p.getByTestId("sankalp-continue").waitFor({ timeout: 8000 });
    await p.screenshot({ path: `${out}/exp-sankalp-done.png` });
    await p.getByTestId("sankalp-continue").click();
    await p.waitForTimeout(1200);
    await p.screenshot({ path: `${out}/exp-darshan.png` });
    await p.getByTestId("perform-aarti").click();
    await p.waitForTimeout(600);
    // perform a few clockwise circles by touch-drag with mouse emulation
    const vp = p.viewportSize();
    const box = await p.locator("[data-testid=experience] main > div").first().boundingBox();
    const cx = box.x + box.width / 2, cy = box.y + box.height / 2, r = Math.min(box.width, box.height) * 0.45;
    await p.mouse.move(cx, cy + r);
    await p.mouse.down();
    for (let i = 0; i <= 2 * 48; i++) {
      const a = Math.PI / 2 + (i / 48) * Math.PI * 2;
      await p.mouse.move(cx + Math.cos(a) * r, cy + Math.sin(a) * r + 40);
      await p.waitForTimeout(16);
      if (i === 30) await p.screenshot({ path: `${out}/exp-aarti-interactive.png` });
    }
    await p.mouse.up();
    await p.waitForTimeout(500);
    await p.screenshot({ path: `${out}/exp-aarti-progress.png` });
  });
}
if (which === "all" || which === "watch") {
  await shoot(desk, "watch", async (p) => {
    await p.goto(BASE + "/checkout?deity=venkateswara&package=digitalAarti");
    await p.getByTestId("sankalp-option").uncheck();
    await p.getByTestId("ack").check();
    await p.getByTestId("pay").click();
    await p.getByTestId("confirm-demo").click();
    await p.waitForURL("**/experience");
    await p.getByTestId("open-curtain").click();
    await p.waitForTimeout(2200);
    await p.screenshot({ path: `${out}/watch-darshan.png` });
    await p.getByTestId("watch-aarti").click();
    await p.waitForTimeout(9000);
    await p.screenshot({ path: `${out}/watch-aarti.png` });
    await p.getByTestId("conclude").click();
    await p.waitForURL("**/complete**");
    await p.waitForTimeout(2500);
    await p.screenshot({ path: `${out}/complete.png` });
  });
}
await browser.close();
console.log("done");
