const CONTACT_LINKS = {
  instagram: "https://www.instagram.com/kikuchi_web_design/",
  email: "mailto:kikuchi.web.work@gmail.com",
  x: "https://x.com/darui_tsubushi",
};

(function () {
  "use strict";

  document.querySelectorAll("[data-contact]").forEach(function (link) {
    var key = link.getAttribute("data-contact");
    if (CONTACT_LINKS[key]) {
      link.setAttribute("href", CONTACT_LINKS[key]);
    }
  });

  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");

  function closeNav() {
    if (!toggle || !nav) return;
    nav.classList.remove("is-open");
    document.body.classList.remove("nav-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "メニューを開く");
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("is-open");
      document.body.classList.toggle("nav-open", isOpen);
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.setAttribute("aria-label", isOpen ? "メニューを閉じる" : "メニューを開く");
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeNav);
    });

    document.addEventListener("click", function (event) {
      if (!nav.classList.contains("is-open")) return;
      if (!nav.contains(event.target) && !toggle.contains(event.target)) {
        closeNav();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && nav.classList.contains("is-open")) {
        closeNav();
        toggle.focus();
      }
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (event) {
      var id = anchor.getAttribute("href");
      if (!id || id === "#") return;

      var target = document.querySelector(id);
      if (!target) return;

      event.preventDefault();
      var header = document.querySelector(".site-header");
      var offset = header ? header.offsetHeight + 10 : 0;
      var top = target.getBoundingClientRect().top + window.scrollY - offset;
      var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      window.scrollTo({ top: top, behavior: reduceMotion ? "auto" : "smooth" });
    });
  });

  document.querySelectorAll("[data-track]").forEach(function (element) {
    element.addEventListener("click", function () {
      var eventName = element.getAttribute("data-track");
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "kikuchi_lp_click",
        event_label: eventName,
      });
    });
  });

  var mobileCta = document.getElementById("mobile-cta");
  var closeMobileCta = document.querySelector(".mobile-sticky-cta__close");
  if (mobileCta) {
    document.body.classList.add("has-mobile-cta");
  }
  if (closeMobileCta && mobileCta) {
    closeMobileCta.addEventListener("click", function () {
      mobileCta.hidden = true;
      document.body.classList.remove("has-mobile-cta");
    });
  }

  var form = document.getElementById("contact-form");
  var status = document.getElementById("form-status");

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var invalidFields = [];
      form.querySelectorAll("[required]").forEach(function (field) {
        field.classList.remove("is-invalid");
        if (!field.value.trim()) {
          invalidFields.push(field);
          field.classList.add("is-invalid");
        }
      });

      var email = form.elements.email;
      if (email && email.value && !email.validity.valid) {
        invalidFields.push(email);
        email.classList.add("is-invalid");
      }

      if (invalidFields.length > 0) {
        if (status) {
          status.textContent = "未入力または形式が違う項目があります。確認してください。";
        }
        invalidFields[0].focus();
        return;
      }

      var data = new FormData(form);
      var subject = "無料店舗診断の相談";
      var body = [
        "お名前: " + data.get("name"),
        "店名または事業名: " + data.get("business"),
        "ご相談の種類: " + (data.get("topic") || "未記入"),
        "URL: " + (data.get("urls") || "未記入"),
        "希望する連絡方法: " + data.get("contact_method"),
        "返信先メールアドレス: " + data.get("email"),
        "",
        "相談内容:",
        data.get("message"),
      ].join("\n");

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "kikuchi_lp_form_submit",
        event_label: "contact-form-submit",
      });

      if (status) {
        status.textContent = "メール作成画面を開きます。内容を確認して送信してください。";
      }

      window.location.href =
        CONTACT_LINKS.email +
        "?subject=" +
        encodeURIComponent(subject) +
        "&body=" +
        encodeURIComponent(body);
    });
  }
})();
