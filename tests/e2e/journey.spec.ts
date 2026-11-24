import { expect, test, type Page } from "@playwright/test";

/** Static (GitHub Pages) runs: E2E_STATIC=1, pages live under E2E_BASE_PATH (e.g. /Devadwar). */
const STATIC = process.env.E2E_STATIC === "1";
const BP = process.env.E2E_BASE_PATH ?? "";

const SENTINEL = "SANKALP-SECRET-7f3a peace for my family";

/** Count AudioContext constructions to prove nothing autoplays. */
async function instrumentAudio(page: Page) {
  await page.addInitScript(() => {
    (window as any).__audioCtxCount = 0;
    for (const k of ["AudioContext", "webkitAudioContext"]) {
      const C = (window as any)[k];
      if (!C) continue;
      (window as any)[k] = class extends C {
        constructor(...a: any[]) {
          super(...a);
          (window as any).__audioCtxCount++;
        }
      };
    }
  });
}

async function noHorizontalScroll(page: Page) {
  const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(over, "horizontal overflow (px)").toBeLessThanOrEqual(1);
}

async function buy(page: Page, deity: string, pkg: string, sankalp: boolean) {
  await page.goto(BP + `/deities/${deity}`);
  await page.getByTestId(`pkg-${pkg}`).click();
  await page.getByTestId("continue").click();
  await expect(page).toHaveURL(/\/checkout/, { timeout: 20_000 });
  await expect(page.getByTestId("demo-banner")).toBeVisible();
  const sank = page.getByTestId("sankalp-option");
  if (!sankalp) await sank.uncheck();
  await page.getByTestId("ack").check();
  await page.getByTestId("pay").click();
  await page.getByTestId("confirm-demo").click();
  await expect(page).toHaveURL(/\/experience\/?$/, { timeout: 20_000 });
  await page.getByTestId("open-curtain").click();
}

test.describe("gateway & gallery", () => {
  test("no audio before interaction; Enter opens the gallery", async ({ page }) => {
    await instrumentAudio(page);
    await page.goto(BP + "/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await page.waitForTimeout(800);
    expect(await page.evaluate(() => (window as any).__audioCtxCount)).toBe(0);
    await noHorizontalScroll(page);
    await page.getByTestId("enter").click();
    await expect(page).toHaveURL(/\/deities/, { timeout: 20_000 });
    await expect(page.getByRole("list", { name: "Deities" }).getByRole("listitem")).toHaveCount(10);
    await noHorizontalScroll(page);
  });

  test("entering in silence never creates an audio context", async ({ page }) => {
    await instrumentAudio(page);
    await page.goto(BP + "/");
    await page.getByRole("switch").click();
    await page.getByTestId("enter").click();
    await expect(page).toHaveURL(/\/deities/, { timeout: 20_000 });
    expect(await page.evaluate(() => (window as any).__audioCtxCount)).toBe(0);
  });

  test("deity page shows configured prices and switches deity", async ({ page }) => {
    await page.goto(BP + "/deities");
    await page.getByRole("link", { name: /Lord Krishna/ }).click();
    await expect(page.getByRole("heading", { name: "Lord Krishna", exact: true })).toBeVisible();
    for (const [id, price] of [
      ["digitalDarshan", "₹10"],
      ["digitalAarti", "₹20"],
      ["interactiveAarti", "₹30"],
    ]) {
      await expect(page.getByTestId(`pkg-${id}`)).toContainText(price);
    }
    await expect(page.getByTestId("continue")).toBeDisabled();
    await noHorizontalScroll(page);
    await page.getByRole("link", { name: /Gallery/ }).click();
    await page.getByRole("link", { name: /Goddess Saraswati/ }).click();
    await expect(page.getByRole("heading", { name: "Goddess Saraswati", exact: true })).toBeVisible();
  });

  test("broken routes are handled", async ({ page }) => {
    const r = await page.goto(BP + "/deities/not-a-deity");
    expect(r?.status()).toBe(404);
    await expect(page.getByText("This path leads nowhere")).toBeVisible();
    await page.goto(BP + "/checkout?deity=shiva&package=gold");
    await expect(page.getByText("Let us begin again")).toBeVisible();
    await page.goto(BP + "/experience");
    await expect(page.getByText("No active experience")).toBeVisible();
  });
});

test.describe("checkout", () => {
  test("acknowledgement is required and unticked by default", async ({ page }) => {
    await page.goto(BP + "/checkout?deity=ganesha&package=digitalAarti");
    await expect(page.getByTestId("ack")).not.toBeChecked();
    await expect(page.getByTestId("pay")).toBeDisabled();
    await expect(page.getByTestId("total")).toHaveText("₹20");
    await noHorizontalScroll(page);
  });

  test("server refuses tampered or unknown orders; webhook is disabled", async ({ request }) => {
    test.skip(STATIC, "No server API on static hosting (demo payment runs in the browser).");
    expect((await request.post("/api/orders", { data: { deity: "nobody", packageId: "digitalDarshan" } })).status()).toBe(404);
    expect((await request.post("/api/orders", { data: { deity: "shiva", packageId: "platinum" } })).status()).toBe(404);
    const ok = await request.post("/api/orders", { data: { deity: "shiva", packageId: "interactiveAarti", amountPaise: 1 } });
    expect(ok.status()).toBe(201);
    const signed = await ok.json();
    expect(signed.order.amountPaise).toBe(3000); // client-supplied amount ignored
    const bad = await request.post("/api/payments/demo/confirm", { data: { order: { ...signed.order, amountPaise: 100 }, token: signed.token } });
    expect(bad.status()).toBe(400);
    const good = await request.post("/api/payments/demo/confirm", { data: signed });
    expect((await good.json()).receipt.status).toBe("demo_completed");
    expect((await request.post("/api/payments/webhook", { data: {} })).status()).toBe(501);
  });
});

test.describe("devotional experiences", () => {
  test("₹10 Darshan: no Aarti controls, stays until the user concludes", async ({ page }) => {
    await buy(page, "shiva", "digitalDarshan", false);
    await expect(page.getByRole("button", { name: "Mantra" })).toBeVisible({ timeout: 10_000 });
    await expect(page.getByTestId("watch-aarti")).toHaveCount(0);
    await expect(page.getByTestId("perform-aarti")).toHaveCount(0);
    await page.getByRole("button", { name: "Mantra" }).click();
    await expect(page.getByText("ॐ नमः शिवाय")).toBeVisible();
    // no auto-exit: still here after a while
    await page.waitForTimeout(4000);
    await expect(page).toHaveURL(/\/experience\/?$/);
    await page.getByTestId("conclude").click();
    await expect(page).toHaveURL(/\/complete/, { timeout: 20_000 });
    await expect(page.getByTestId("closing-message")).toBeVisible();
    await expect(page.locator("body")).not.toContainText(/guarantee|will come true|will be fulfilled/i);
    // session released
    expect(await page.evaluate(() => sessionStorage.length)).toBe(0);
  });

  test("₹20 Darshan + Aarti: watched Aarti plays", async ({ page }) => {
    await buy(page, "venkateswara", "digitalAarti", false);
    await expect(page.getByTestId("perform-aarti")).toHaveCount(0);
    await page.getByTestId("watch-aarti").click();
    await expect(page.getByTestId("aarti-watch")).toBeVisible();
    await expect(page.getByText(/Offering at the lotus feet/)).toBeVisible({ timeout: 10_000 });
    await page.getByRole("button", { name: "End Aarti" }).click();
    await expect(page.getByTestId("watch-aarti")).toBeVisible();
  });

  test("₹30 Interactive Aarti completes via the accessible tap alternative", async ({ page }) => {
    await buy(page, "hanuman", "interactiveAarti", false);
    await page.getByTestId("perform-aarti").click();
    const bar = page.getByRole("progressbar", { name: "Aarti circles offered" });
    for (let i = 1; i <= 7; i++) {
      await page.getByTestId("assist").click();
      await expect(bar).toHaveAttribute("aria-valuenow", String(i), { timeout: 8000 });
    }
    await expect(page.getByText("Your Aarti is complete")).toBeVisible();
  });

  test("₹30 Interactive Aarti counts real clockwise drag circles", async ({ page }) => {
    await buy(page, "krishna", "interactiveAarti", false);
    await page.getByTestId("perform-aarti").click();
    const stage = page.getByTestId("aarti-interactive");
    await expect(stage).toBeVisible();
    const box = (await page.locator("[data-testid=experience] main > div").first().boundingBox())!;
    const cx = box.x + box.width / 2;
    const cy = box.y + box.height / 2;
    const r = Math.min(box.width, box.height) * 0.42;
    const pt = (a: number) => [cx + Math.cos(a) * r, cy + Math.sin(a) * r + 39] as const; // +39: lamp sits above the finger
    await page.mouse.move(...pt(Math.PI / 2));
    await page.mouse.down();
    const steps = 40;
    for (let i = 0; i <= steps * 2.3; i++) {
      await page.mouse.move(...pt(Math.PI / 2 + (i / steps) * Math.PI * 2));
      await page.waitForTimeout(20);
    }
    await page.mouse.up();
    const bar = page.getByRole("progressbar", { name: "Aarti circles offered" });
    await expect.poll(async () => Number(await bar.getAttribute("aria-valuenow"))).toBeGreaterThanOrEqual(2);
  });

  test("Sankalp stays private: never sent, never stored, released on exit", async ({ page }) => {
    const leaks: string[] = [];
    page.on("request", (req) => {
      const body = req.postData() || "";
      if (req.url().includes("SANKALP-SECRET") || body.includes("SANKALP-SECRET")) leaks.push(req.url());
    });
    await buy(page, "lakshmi", "digitalDarshan", true);
    await page.getByTestId("sankalp-text").fill(SENTINEL);
    await page.getByTestId("sankalp-place").click();
    await page.getByTestId("sankalp-continue").click({ timeout: 10_000 });
    const stored = await page.evaluate(() => JSON.stringify({ ...localStorage }) + JSON.stringify({ ...sessionStorage }));
    expect(stored).not.toContain("SANKALP-SECRET");
    await expect(page.locator("body")).not.toContainText("SANKALP-SECRET"); // words released after placing
    await page.getByTestId("conclude").click();
    await expect(page).toHaveURL(/\/complete/, { timeout: 20_000 });
    expect(leaks).toEqual([]);
  });

  test("Sankalp can be skipped", async ({ page }) => {
    await buy(page, "saraswati", "digitalDarshan", true);
    await page.getByTestId("sankalp-skip").click();
    await expect(page.getByRole("button", { name: "Write Sankalp" })).toBeVisible();
  });
});

test.describe("legal pages", () => {
  for (const path of ["/terms", "/privacy", "/refunds", "/disclaimer", "/grievance", "/contact"]) {
    test(`${path} is marked as a draft for lawyer review`, async ({ page }) => {
      await page.goto(BP + path);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await expect(page.getByRole("note")).toContainText("Indian lawyer");
      await noHorizontalScroll(page);
    });
  }
  test("/about renders", async ({ page }) => {
    await page.goto(BP + "/about");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });
});
