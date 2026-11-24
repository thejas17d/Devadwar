import { chromium } from "@playwright/test";
const b = await chromium.launch({ channel: "chrome" });
const p = await b.newPage();
p.on("console", (m) => { if (m.type() === "error") console.log(m.text().split("\n").filter(l => /^\s*[+-]/.test(l)).slice(0, 12).join("\n")); });
await p.goto("http://localhost:3123" + (process.argv[2] || "/deities/shiva"));
await p.waitForTimeout(2500);
await b.close();
