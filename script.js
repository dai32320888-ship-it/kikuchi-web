const CONTACT_LINKS = {
  instagram: "https://www.instagram.com/kikuchi_web_design/",
  email: "mailto:kikuchi.web.work@gmail.com",
};

(function () {
  "use strict";

  document.querySelectorAll("[data-contact]").forEach(function (link) {
    var key = link.getAttribute("data-contact");
    if (CONTACT_LINKS[key]) link.setAttribute("href", CONTACT_LINKS[key]);
  });

  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  var header = document.getElementById("site-header");
  var hero = document.querySelector(".hero-v2");
  function onScroll() {
    if (!header) return;
    var y = window.scrollY;
    header.classList.toggle("is-scrolled", y > 40);
    if (hero) header.classList.toggle("is-over-hero", y < hero.offsetHeight - 80);
  }
  if (typeof window.addEventListener === "function") {
    window.addEventListener("scroll", onScroll, { passive: true });
  }
  onScroll();

  var toggle = document.querySelector(".header-v2__toggle");
  var nav = document.getElementById("main-nav");
  function closeNav(restoreFocus) {
    if (!toggle || !nav) return;
    nav.classList.remove("is-open");
    document.body.classList.remove("nav-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "メニューを開く");
    if (restoreFocus) toggle.focus();
  }
  if (toggle && nav) {
    toggle.setAttribute("aria-label", "メニューを開く");
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      document.body.classList.toggle("nav-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "メニューを閉じる" : "メニューを開く");
      if (open) {
        var firstLink = nav.querySelector("a");
        if (firstLink) firstLink.focus();
      }
    });
    nav.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", function () { closeNav(false); }); });
    document.addEventListener("click", function (e) {
      if (!nav.classList.contains("is-open")) return;
      if (!nav.contains(e.target) && !toggle.contains(e.target)) closeNav(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) closeNav(true);
      if (e.key !== "Tab" || !nav.classList.contains("is-open")) return;
      var focusable = Array.prototype.slice.call(nav.querySelectorAll("a[href]"));
      if (!focusable.length) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      if (!id || id === "#") return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var offset = header ? header.offsetHeight + 8 : 0;
      var top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: top, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    });
  });

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.querySelectorAll(".reveal-v2").forEach(function (el) {
    if (reduce) el.classList.add("is-in");
    else el.classList.add("is-ready");
  });
  if (!reduce && "IntersectionObserver" in window) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); obs.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    document.querySelectorAll(".reveal-v2:not(.is-in)").forEach(function (el) { obs.observe(el); });
  } else if (!reduce) {
    document.querySelectorAll(".reveal-v2").forEach(function (el) { el.classList.add("is-in"); });
  }

  var rotateEl = document.getElementById("hero-rotate");
  if (rotateEl && !reduce) {
    var words = ["Web制作", "Instagram", "Googleマップ", "店舗診断", "みせシリーズ"];
    var wi = 0;
    rotateEl.style.transition = "opacity 0.28s ease";
    setInterval(function () {
      wi = (wi + 1) % words.length;
      rotateEl.style.opacity = "0";
      setTimeout(function () {
        rotateEl.textContent = words[wi];
        rotateEl.style.opacity = "1";
      }, 280);
    }, 2800);
  }

  var caseData = {
    food: { before: ["Instagramだけ更新", "Google情報が古い", "在庫は紙・記憶"], after: ["Googleマップ改善", "Instagram導線改善", "1ページHP", "みせ在庫"] },
    izakaya: { before: ["予約が不明瞭", "ボトルは紙台帳", "SNSが止まりがち"], after: ["Instagram運用", "予約導線整理", "みせボトル", "みせ日報"] },
    salon: { before: ["料金がSNSだけでは不明", "予約が分散", "カルテが紙"], after: ["Web制作", "みせ予約", "みせカルテ", "Googleマップ改善"] }
  };
  var beforeUl = document.getElementById("case-before");
  var afterUl = document.getElementById("case-after");
  var casePanel = document.getElementById("case-panel");
  function renderCase(key) {
    if (!beforeUl || !afterUl || !caseData[key]) return;
    beforeUl.innerHTML = caseData[key].before.map(function (t) { return "<li>" + t + "</li>"; }).join("");
    afterUl.innerHTML = caseData[key].after.map(function (t) { return "<li>" + t + "</li>"; }).join("");
  }
  renderCase("food");
  document.querySelectorAll("[data-case]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.querySelectorAll("[data-case]").forEach(function (b) {
        b.classList.toggle("is-active", b === btn);
        b.setAttribute("aria-selected", b === btn ? "true" : "false");
        b.setAttribute("tabindex", b === btn ? "0" : "-1");
      });
      renderCase(btn.getAttribute("data-case"));
      if (casePanel) casePanel.setAttribute("aria-labelledby", btn.id);
    });
  });

  function enableTabKeys(selector) {
    var tabs = Array.prototype.slice.call(document.querySelectorAll(selector));
    tabs.forEach(function (tab, index) {
      tab.addEventListener("keydown", function (e) {
        if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) return;
        e.preventDefault();
        var next = index;
        if (e.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
        if (e.key === "ArrowRight") next = (index + 1) % tabs.length;
        if (e.key === "Home") next = 0;
        if (e.key === "End") next = tabs.length - 1;
        tabs[next].focus();
        tabs[next].click();
      });
    });
  }
  enableTabKeys("[data-case]");

  var priceWeb = document.getElementById("price-web");
  var priceMise = document.getElementById("price-mise");
  document.querySelectorAll("[data-price]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.querySelectorAll("[data-price]").forEach(function (b) {
        b.classList.toggle("is-active", b === btn);
        b.setAttribute("aria-selected", b === btn ? "true" : "false");
        b.setAttribute("tabindex", b === btn ? "0" : "-1");
      });
      var isMise = btn.getAttribute("data-price") === "mise";
      if (priceWeb) priceWeb.hidden = isMise;
      if (priceMise) priceMise.hidden = !isMise;
    });
  });
  enableTabKeys("[data-price]");

  var sticky = document.getElementById("sticky-cta");
  var closeSticky = document.querySelector(".sticky-cta-v2__close");
  if (sticky) document.body.classList.add("has-sticky-cta");
  if (closeSticky && sticky) {
    closeSticky.addEventListener("click", function () {
      sticky.hidden = true;
      document.body.classList.remove("has-sticky-cta");
    });
  }
  if (sticky && "IntersectionObserver" in window) {
    var suppressTargets = document.querySelectorAll("#contact, .footer-v2, .site-footer");
    var visibleSuppressTargets = new Set();
    var stickyObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) visibleSuppressTargets.add(entry.target);
        else visibleSuppressTargets.delete(entry.target);
      });
      sticky.classList.toggle("is-suppressed", visibleSuppressTargets.size > 0);
    }, { threshold: 0.05 });
    suppressTargets.forEach(function (target) { stickyObserver.observe(target); });
  }

  var form = document.getElementById("contact-form");
  var status = document.getElementById("form-status");
  if (form) {
    var topicSelect = form.elements.topic;
    var messageField = form.elements.message;
    if (topicSelect) {
      var params = new URLSearchParams(window.location.search);
      var requestedTopic = params.get("topic");
      if (requestedTopic === "mise") topicSelect.value = "みせシリーズ";
      if (requestedTopic === "mise-monitor") {
        topicSelect.value = "みせシリーズ無料モニター";
        if (messageField) messageField.value = "みせシリーズの無料モニターについて相談したいです。";
      }
    }
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var invalid = [];
      form.querySelectorAll("[required]").forEach(function (f) {
        f.classList.remove("is-invalid");
        if (!f.value.trim()) { invalid.push(f); f.classList.add("is-invalid"); }
      });
      var email = form.elements.email;
      if (email && email.value && !email.validity.valid) { invalid.push(email); email.classList.add("is-invalid"); }
      if (invalid.length) {
        if (status) status.textContent = "未入力または形式が違う項目があります。";
        invalid[0].focus();
        return;
      }
      var data = new FormData(form);
      var body = [
        "お名前: " + data.get("name"), "店名: " + data.get("business"),
        "ご相談の種類: " + (data.get("topic") || "未記入"), "URL: " + (data.get("urls") || "未記入"),
        "連絡方法: " + data.get("contact_method"), "メール: " + data.get("email"),
        "", "相談内容:", data.get("message")
      ].join("\n");
      if (status) status.textContent = "メール作成画面を開きます。";
      window.location.href = CONTACT_LINKS.email + "?subject=" + encodeURIComponent("無料店舗診断の相談") + "&body=" + encodeURIComponent(body);
    });
    form.addEventListener("focusin", function () { document.body.classList.add("form-active"); });
    form.addEventListener("focusout", function () {
      window.setTimeout(function () {
        if (!form.contains(document.activeElement)) document.body.classList.remove("form-active");
      }, 0);
    });
  }
})();
