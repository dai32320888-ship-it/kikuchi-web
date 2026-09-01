import { chromium } from "playwright";

const baseUrl = process.env.QA_BASE_URL || "http://127.0.0.1:8766";
const target = (path) => new URL(path, baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`).href;
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
const page = await context.newPage();
const errors = [];
const checks = [];

page.on("pageerror", (error) => errors.push(String(error)));
page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });

function assert(condition, label, detail = "") {
  checks.push({ label, pass: Boolean(condition), detail });
  if (!condition) throw new Error(`${label}${detail ? `: ${detail}` : ""}`);
}

await page.goto(target("/"), { waitUntil: "networkidle" });
assert((await page.locator(".hero-v2__media img").getAttribute("src")) === "images/kumamoto/hero-tram.jpg", "Hero keeps a JPEG fallback");
assert((await page.locator(".hero-v2__media img").evaluate((image) => image.currentSrc)).endsWith("hero-tram-mobile.webp"), "390px loads the mobile Hero WebP");

const toggle = page.locator(".header-v2__toggle");
await toggle.tap();
assert(await toggle.getAttribute("aria-expanded") === "true", "mobile nav opens");
assert(await page.locator("body").evaluate((body) => body.classList.contains("nav-open")), "mobile nav locks page scroll");
assert(await page.evaluate(() => document.activeElement?.closest("#main-nav") !== null), "mobile nav moves focus inside");
await page.touchscreen.tap(18, 180);
assert(await toggle.getAttribute("aria-expanded") === "false", "outside tap closes mobile nav");

await toggle.tap();
await page.keyboard.press("Escape");
assert(await toggle.getAttribute("aria-expanded") === "false", "Escape closes mobile nav");
assert(await toggle.evaluate((element) => element === document.activeElement), "Escape restores focus to menu button");

await toggle.tap();
await page.locator("#main-nav a[href='#capability']").tap();
await page.waitForTimeout(500);
assert(await toggle.getAttribute("aria-expanded") === "false", "nav link closes mobile nav");

const izakayaTab = page.locator("[data-case='izakaya']");
await izakayaTab.scrollIntoViewIfNeeded();
await izakayaTab.tap();
assert(await izakayaTab.getAttribute("aria-selected") === "true", "case tab active state updates");
assert((await page.locator("#case-after").textContent()).includes("みせボトル"), "case tab content updates");
await izakayaTab.press("ArrowRight");
assert(await page.locator("[data-case='salon']").getAttribute("aria-selected") === "true", "case tabs support arrow keys");

const priceMiseTab = page.locator("[data-price='mise']");
await priceMiseTab.scrollIntoViewIfNeeded();
await priceMiseTab.tap();
assert(await priceMiseTab.getAttribute("aria-selected") === "true", "price tab active state updates");
assert(!(await page.locator("#price-mise").getAttribute("hidden")), "price panel switches");

const rail = page.locator(".cap-scroll");
await rail.scrollIntoViewIfNeeded();
const box = await rail.boundingBox();
const beforeSwipe = await rail.evaluate((element) => element.scrollLeft);
if (box) {
  const session = await context.newCDPSession(page);
  const y = box.y + Math.min(box.height / 2, 180);
  await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: box.x + box.width - 40, y }] });
  await session.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: box.x + 70, y }] });
  await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await page.waitForTimeout(700);
}
const afterSwipe = await rail.evaluate((element) => element.scrollLeft);
assert(afterSwipe > beforeSwipe + 20, "touch swipe moves capability rail", `${beforeSwipe} -> ${afterSwipe}`);

const sticky = page.locator("#sticky-cta");
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(200);
assert(await sticky.isVisible(), "mobile sticky CTA is visible away from contact");
await page.locator("#contact").scrollIntoViewIfNeeded();
await page.waitForTimeout(350);
assert(!(await sticky.isVisible()), "mobile sticky CTA is suppressed at contact/footer");

const form = page.locator("#contact-form");
await form.locator("button[type='submit']").click();
assert((await page.locator("#form-status").textContent()).includes("未入力"), "form reports required-field errors");
assert(await form.locator("input[name='name']").evaluate((element) => element === document.activeElement), "form focuses first invalid field");

await form.locator("input[name='name']").fill("テスト太郎");
await form.locator("input[name='business']").fill("テスト店舗");
await form.locator("select[name='topic']").selectOption({ label: "無料店舗診断" });
await form.locator("textarea[name='message']").fill("Googleマップとホームページを見てほしいです。");
await form.locator("select[name='contact_method']").selectOption({ label: "メール" });
await form.locator("input[name='email']").fill("test@example.com");
assert(await page.locator("body").evaluate((body) => body.classList.contains("form-active")), "focused form suppresses sticky CTA");
await form.locator("button[type='submit']").click().catch(() => {});
await page.waitForTimeout(200);
assert((await page.locator("#form-status").textContent()).includes("メール作成画面"), "valid form reaches mail composer step");

await page.goto(target("/?topic=mise#contact"), { waitUntil: "networkidle" });
assert(await page.locator("select[name='topic']").inputValue() === "みせシリーズ", "mise CTA preselects inquiry type");
assert(await page.locator("a[data-contact='instagram']").first().getAttribute("href") === "https://www.instagram.com/kikuchi_web_design/", "Instagram consultation URL is correct");

const reducedContext = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
const reducedPage = await reducedContext.newPage();
await reducedPage.goto(target("/"), { waitUntil: "networkidle" });
const wordBefore = await reducedPage.locator("#hero-rotate").textContent();
await reducedPage.waitForTimeout(3000);
const wordAfter = await reducedPage.locator("#hero-rotate").textContent();
assert(wordAfter === wordBefore, "reduced motion stops rotating Hero words");
assert(await reducedPage.locator(".reveal-v2").first().evaluate((element) => getComputedStyle(element).opacity === "1"), "reduced motion keeps reveal content visible");
await reducedContext.close();

const desktopContext = await browser.newContext({ viewport: { width: 1366, height: 900 } });
const desktopPage = await desktopContext.newPage();
await desktopPage.goto(target("/"), { waitUntil: "networkidle" });
assert((await desktopPage.locator(".hero-v2__media img").evaluate((image) => image.currentSrc)).endsWith("hero-tram-desktop.webp"), "1366px loads the desktop Hero WebP");
await desktopContext.close();

assert(errors.length === 0, "no JavaScript or console errors", errors.join(" | "));
await context.close();
await browser.close();

console.log(JSON.stringify({ viewport: 390, checks, errors }, null, 2));
console.log(`Interaction QA passed: ${checks.length} checks.`);
