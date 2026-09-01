import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputDir = path.join(root, "qa", "screenshots", "codex-final");
const baseUrl = process.env.QA_BASE_URL || "http://127.0.0.1:8766";

fs.mkdirSync(outputDir, { recursive: true });

const shots = [
  { page: "/", name: "index", widths: [375, 390, 414, 430, 768, 1024, 1366, 1440] },
  { page: "/mise/", name: "mise", widths: [390, 430, 1366] },
  { page: "/services/", name: "services", widths: [390, 430, 1366] },
];

const results = [];
const runtimeErrors = [];
const browser = await chromium.launch();
const page = await browser.newPage();

page.on("pageerror", (error) => runtimeErrors.push({ type: "pageerror", message: String(error) }));
page.on("console", (message) => {
  if (message.type() === "error") runtimeErrors.push({ type: "console", message: message.text() });
});

async function revealWholePage() {
  const fullHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  const viewportHeight = await page.evaluate(() => window.innerHeight);
  for (let y = 0; y < fullHeight; y += Math.max(360, viewportHeight * 0.72)) {
    await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y);
    await page.waitForTimeout(70);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(180);
}

for (const spec of shots) {
  for (const width of spec.widths) {
    const startErrorCount = runtimeErrors.length;
    const height = width < 768 ? 844 : 900;
    await page.setViewportSize({ width, height });
    const url = new URL(spec.page, baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`).href;
    const response = await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
    await revealWholePage();

    const layout = await page.evaluate(() => ({
      viewport: window.innerWidth,
      documentScrollWidth: document.documentElement.scrollWidth,
      bodyScrollWidth: document.body.scrollWidth,
      hiddenRevealCount: Array.from(document.querySelectorAll(".reveal-v2:not(.is-in)"))
        .filter((element) => element.getClientRects().length > 0).length,
    }));
    const file = path.join(outputDir, `${spec.name}-${width}.png`);
    if (spec.name === "index" || width === 390 || width === 1366) {
      await page.screenshot({ path: path.join(outputDir, `${spec.name}-${width}-viewport.png`) });
    }
    await page.screenshot({ path: file, fullPage: true });
    const errors = runtimeErrors.slice(startErrorCount);
    const result = { page: spec.page, width, status: response?.status(), file, layout, errors };
    results.push(result);
    console.log(JSON.stringify(result));
  }
}

await browser.close();
fs.writeFileSync(path.join(outputDir, "qa-results.json"), `${JSON.stringify(results, null, 2)}\n`, "utf8");

const failures = results.filter((result) =>
  result.status !== 200 ||
  result.layout.documentScrollWidth > result.layout.viewport ||
  result.layout.bodyScrollWidth > result.layout.viewport ||
  result.layout.hiddenRevealCount > 0 ||
  result.errors.length > 0
);

if (failures.length) {
  console.error(`QA failed for ${failures.length} viewport(s). See qa-results.json.`);
  process.exit(1);
}

console.log(`QA passed: ${results.length} screenshots, no overflow, hidden reveals, or runtime errors.`);
