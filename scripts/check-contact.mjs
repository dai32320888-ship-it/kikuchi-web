import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = fs.readFileSync(path.join(root, "script.js"), "utf8");

function runContactPage(search) {
  const listeners = {};
  const status = { textContent: "" };
  const elements = {
    topic: { value: "" },
    message: { value: "" },
    email: { value: "owner@example.com", validity: { valid: true }, classList: { add() {}, remove() {} } },
  };
  const values = {
    name: "テスト店長",
    business: "テスト店舗",
    urls: "https://example.com/",
    contact_method: "メール",
    email: "owner@example.com",
  };
  const form = {
    elements,
    addEventListener(type, listener) {
      listeners[type] = listener;
    },
    querySelectorAll() {
      return [];
    },
  };
  const window = {
    location: { search, href: "http://site.local/" },
    matchMedia: () => ({ matches: true }),
    scrollY: 0,
    scrollTo() {},
  };
  const document = {
    body: { classList: { add() {}, remove() {}, toggle() {} } },
    getElementById(id) {
      if (id === "contact-form") return form;
      if (id === "form-status") return status;
      if (id === "year") return { textContent: "" };
      return null;
    },
    querySelector() {
      return null;
    },
    querySelectorAll() {
      return [];
    },
    addEventListener() {},
  };
  class TestFormData {
    get(name) {
      if (name === "topic") return elements.topic.value;
      if (name === "message") return elements.message.value;
      return values[name] || "";
    }
  }

  const context = vm.createContext({ document, window, URLSearchParams, FormData: TestFormData, Date, console });
  vm.runInContext(source, context, { filename: "script.js" });
  return { elements, listeners, status, window };
}

const normal = runContactPage("?topic=mise");
if (normal.elements.topic.value !== "みせシリーズ") {
  throw new Error("通常相談で『みせシリーズ』が選択されません");
}

const monitor = runContactPage("?topic=mise-monitor");
if (monitor.elements.topic.value !== "みせシリーズ無料モニター") {
  throw new Error("モニター相談で専用項目が選択されません");
}
if (monitor.elements.message.value !== "みせシリーズの無料モニターについて相談したいです。") {
  throw new Error("モニター相談文が自動入力されません");
}

monitor.listeners.submit({ preventDefault() {} });
if (!monitor.window.location.href.startsWith("mailto:kikuchi.web.work@gmail.com?")) {
  throw new Error("メール作成画面へのmailtoリンクが生成されません");
}
const decodedMail = decodeURIComponent(monitor.window.location.href);
if (!decodedMail.includes("ご相談の種類: みせシリーズ無料モニター") || !decodedMail.includes(monitor.elements.message.value)) {
  throw new Error("生成メールにモニター相談の内容が入りません");
}

console.log("問い合わせ導線検査成功: 通常相談、無料モニター、相談文、mailto生成を確認");
