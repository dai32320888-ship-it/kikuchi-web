import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const htmlFiles = [];
const failures = [];
const corePages = new Set(["index.html", path.join("services", "index.html"), path.join("mise", "index.html")]);

function collectHtml(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === ".git" || entry.name === "node_modules") continue;
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) collectHtml(target);
    if (entry.isFile() && entry.name.endsWith(".html")) htmlFiles.push(target);
  }
}

function report(condition, message) {
  if (!condition) failures.push(message);
}

function idsOf(html) {
  return [...html.matchAll(/\sid=["']([^"']+)["']/g)].map((match) => match[1]);
}

function localTarget(sourceFile, reference) {
  const sourceRelative = path.relative(root, sourceFile).replaceAll(path.sep, "/");
  const base = new URL(sourceRelative, "https://site.local/");
  const resolved = new URL(reference, base);
  if (resolved.origin !== "https://site.local") return null;
  let pathname = decodeURIComponent(resolved.pathname).replace(/^\//, "");
  if (!pathname || pathname.endsWith("/")) pathname += "index.html";
  return { file: path.join(root, ...pathname.split("/")), fragment: resolved.hash.slice(1) };
}

collectHtml(root);

for (const file of htmlFiles) {
  const relative = path.relative(root, file);
  const html = fs.readFileSync(file, "utf8");
  const ids = idsOf(html);
  const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);

  if (corePages.has(relative)) {
    report(/<html\s[^>]*lang=["']ja["']/i.test(html), `${relative}: lang=ja がありません`);
    report(/<meta\s[^>]*name=["']viewport["']/i.test(html), `${relative}: viewport がありません`);
    report(/<title>[^<]+<\/title>/i.test(html), `${relative}: title がありません`);
    report(/<meta\s[^>]*name=["']description["']/i.test(html), `${relative}: description がありません`);
    report((html.match(/<h1\b/gi) || []).length === 1, `${relative}: h1 は1件必要です`);
    for (const match of html.matchAll(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi)) {
      try {
        JSON.parse(match[1]);
      } catch {
        failures.push(`${relative}: JSON-LDが不正です`);
      }
    }
  }
  report(duplicateIds.length === 0, `${relative}: 重複id ${[...new Set(duplicateIds)].join(", ")}`);

  for (const match of html.matchAll(/\s(?:href|src)=["']([^"']+)["']/g)) {
    const reference = match[1];
    if (/^(?:https?:|mailto:|tel:|data:|javascript:)/i.test(reference)) continue;
    const target = localTarget(file, reference);
    if (!target) continue;
    report(fs.existsSync(target.file), `${relative}: リンク先がありません ${reference}`);
    if (target.fragment && fs.existsSync(target.file)) {
      const targetHtml = fs.readFileSync(target.file, "utf8");
      report(idsOf(targetHtml).includes(target.fragment), `${relative}: アンカーがありません ${reference}`);
    }
  }
}

const home = fs.readFileSync(path.join(root, "index.html"), "utf8");
const services = fs.readFileSync(path.join(root, "services", "index.html"), "utf8");
const mise = fs.readFileSync(path.join(root, "mise", "index.html"), "utf8");
const products = ["みせ日報", "みせシフト", "みせ在庫", "みせ予約", "みせカルテ", "みせボトル"];
const requiredSections = ["products", "pricing", "sets", "monitor", "faq"];
const prices = ["980", "2,480", "2,980", "3,980", "11,000", "22,000", "27,500", "33,000"];

for (const product of products) report(mise.includes(product), `mise/index.html: ${product} がありません`);
report((mise.match(/class="mise-sales-product"/g) || []).length === 6, "mise/index.html: 商品カードは6件必要です");
for (const id of requiredSections) report(idsOf(mise).includes(id), `mise/index.html: #${id} がありません`);
for (const price of prices) report(mise.includes(price), `mise/index.html: 料金 ${price} がありません`);

report(mise.includes("Windows PC"), "mise/index.html: Windows PCの説明がありません");
report(mise.includes("先着3店舗"), "mise/index.html: 先着3店舗がありません");
report(mise.includes("Web予約ではありません"), "mise/index.html: Web予約ではない説明がありません");
report(!/月980円〜|店舗に合わせてご提案|画面イメージを見る/.test(mise), "mise/index.html: 古い販売表現が残っています");
report(mise.includes("表示料金はすべて税込"), "mise/index.html: 税込料金の注記がありません");
report((mise.match(/（税込）/g) || []).length >= 14, "mise/index.html: 月額・導入費の税込表記が不足しています");
report(!/税区分.{0,30}(正式|見積)/.test(mise), "mise/index.html: 暫定的な税区分表現が残っています");
report(!/みせ(?:口コミ|アンケート|リピート|空き枠|発注|床屋)/.test(mise), "mise/index.html: 販売対象外の商品名が残っています");
report(home.includes("月980円（税込）"), "index.html: みせシリーズの税込料金がありません");
report(services.includes("月980円（税込）"), "services/index.html: みせシリーズの税込料金がありません");
report(mise.includes('../?topic=mise#contact'), "mise/index.html: 通常相談CTAがありません");
report(mise.includes('../?topic=mise-monitor#contact'), "mise/index.html: モニターCTAがありません");
report(home.includes('<option>みせシリーズ無料モニター</option>'), "index.html: モニター相談の選択肢がありません");

const script = fs.readFileSync(path.join(root, "script.js"), "utf8");
report(script.includes('requestedTopic === "mise"'), "script.js: 通常相談の選択処理がありません");
report(script.includes('topicSelect.value = "みせシリーズ"'), "script.js: みせシリーズの自動選択がありません");
report(script.includes('requestedTopic === "mise-monitor"'), "script.js: モニター相談の選択処理がありません");
report(script.includes('topicSelect.value = "みせシリーズ無料モニター"'), "script.js: モニターの自動選択がありません");
report(script.includes('みせシリーズの無料モニターについて相談したいです。'), "script.js: モニター相談文がありません");
report(script.includes('window.location.href =') && script.includes('CONTACT_LINKS.email'), "script.js: メール作成画面への遷移がありません");

const css = fs.readFileSync(path.join(root, "style.css"), "utf8");
report(css.includes("overflow-x: clip"), "style.css: 横スクロール抑止がありません");
for (const width of [1080, 760, 520]) {
  report(css.includes(`@media (max-width: ${width}px)`), `style.css: ${width}pxのレスポンシブ指定がありません`);
}
report(/\.btn\s*\{[\s\S]*?min-height:\s*50px/.test(css), "style.css: ボタンのタップ領域が不足しています");
let cssDepth = 0;
for (const character of css.replace(/\/\*[\s\S]*?\*\//g, "")) {
  if (character === "{") cssDepth += 1;
  if (character === "}") cssDepth -= 1;
  report(cssDepth >= 0, "style.css: 閉じ波括弧が多すぎます");
}
report(cssDepth === 0, "style.css: 波括弧が対応していません");

if (failures.length) {
  console.error(`サイト検査: ${failures.length}件の問題`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(`サイト検査成功: HTML ${htmlFiles.length}ページ、6商品、料金、リンク、アンカー、SEO基本項目を確認`);
}
