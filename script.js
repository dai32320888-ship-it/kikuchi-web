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
