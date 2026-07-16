/**
 * 菊地Web制作所 — 営業用LP
 * 問い合わせリンクはここで一括管理できます（HTMLの href より優先）
 */
const CONTACT_LINKS = {
  instagram: "https://www.instagram.com/kikuchi_web_design/",
  email: "mailto:kikuchi.web.work@gmail.com",
  x: "https://x.com/darui_tsubushi",
  note: "#",
};

const INQUIRY_PRESETS = {
  diagnosis: {
    type: "ホームページ無料診断",
    details: "ホームページ無料診断を希望します。\n\n現在困っていること：\n",
  },
  repair: {
    type: "ホームページ修正",
    details: "ホームページの修正について相談したいです。\n\n修正したい内容：\n",
  },
  production: {
    type: "新規ホームページ制作",
    details: "ホームページ制作について相談したいです。\n\n希望する内容：\n",
  },
  management: {
    type: "更新・管理",
    details: "ホームページの更新・管理について相談したいです。\n\n希望する内容：\n",
  },
};

(function () {
  "use strict";

  // 問い合わせリンクを設定
  document.querySelectorAll("[data-contact]").forEach(function (link) {
    var key = link.getAttribute("data-contact");
    if (CONTACT_LINKS[key] && CONTACT_LINKS[key] !== "#") {
      link.setAttribute("href", CONTACT_LINKS[key]);
      link.removeAttribute("aria-disabled");
      link.removeAttribute("title");
      link.classList.remove("is-disabled");
    } else {
      link.removeAttribute("href");
      link.setAttribute("aria-disabled", "true");
      link.setAttribute("title", "リンクは公開準備中です");
      link.classList.add("is-disabled");
      link.addEventListener("click", function (e) {
        e.preventDefault();
      });
    }
  });

  // フッターの年表示
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  // モバイルナビ
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.setAttribute("aria-label", isOpen ? "メニューを閉じる" : "メニューを開く");
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "メニューを開く");
      });
    });

    document.addEventListener("click", function (e) {
      if (!nav.contains(e.target) && !toggle.contains(e.target)) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "メニューを開く");
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "メニューを開く");
        toggle.focus();
      }
    });
  }

  // サービスページからの相談内容をフォームへ反映
  var inquiryType = document.getElementById("inquiry-type");
  var inquiryDetails = document.getElementById("inquiry-details");
  var inquiryKey = new URLSearchParams(window.location.search).get("inquiry");
  var preset = inquiryKey ? INQUIRY_PRESETS[inquiryKey] : null;

  if (preset && inquiryType && inquiryDetails) {
    inquiryType.value = preset.type;
    if (!inquiryDetails.value) {
      inquiryDetails.value = preset.details;
    }
  }

  // 入力内容をメール本文にまとめてメールアプリを開く
  var contactForm = document.getElementById("contact-form");
  var formStatus = document.getElementById("contact-form-status");

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      if (!contactForm.reportValidity()) return;

      var formData = new FormData(contactForm);
      var subject = "【菊地Web制作所】" + formData.get("inquiryType");
      var body = [
        "【お名前】",
        formData.get("name"),
        "",
        "【店舗名・会社名】",
        formData.get("business") || "未入力",
        "",
        "【メールアドレス】",
        formData.get("email"),
        "",
        "【相談内容】",
        formData.get("inquiryType"),
        "",
        "【ホームページURL】",
        formData.get("website") || "未入力",
        "",
        "【InstagramなどのSNS URL】",
        formData.get("social") || "未入力",
        "",
        "【困っていること・希望内容】",
        formData.get("details"),
      ].join("\r\n");

      if (formStatus) {
        formStatus.textContent = "メール作成画面を開いています。内容を確認して送信してください。";
      }

      window.location.href =
        CONTACT_LINKS.email +
        "?subject=" +
        encodeURIComponent(subject) +
        "&body=" +
        encodeURIComponent(body);
    });
  }

  // スムーズスクロール（ヘッダー分オフセット）
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      var id = anchor.getAttribute("href");
      if (!id || id === "#") return;

      var target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();
      var header = document.querySelector(".site-header");
      var offset = header ? header.offsetHeight + 8 : 0;
      var top = target.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({ top: top, behavior: "smooth" });
    });
  });
})();
