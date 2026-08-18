/* Trust Shahid — sample site scripts: language toggle, mobile nav, contact form */
(function () {
  "use strict";

  var TITLES = {
    ja: "トラストシャヒード株式会社｜インド人材送り出し機関（デザインB）",
    en: "Trust Shahid Co., Ltd. | India-based sending organization (Design B)"
  };
  var DESCRIPTIONS = {
    ja: "トラストシャヒードは、介護・建設製造・IT分野のインド人材を日本の受入企業様・監理団体様・登録支援機関様へお繋ぎする送り出し機関のサンプルサイトです。",
    en: "Trust Shahid is a sample website for an India-based sending organization connecting caregiving, construction/manufacturing, and IT talent to Japanese receiving organizations."
  };

  /* ---------- Language toggle (JP ⇄ EN) ---------- */
  function setLang(lang) {
    if (lang !== "ja" && lang !== "en") lang = "ja";
    var root = document.documentElement;
    root.setAttribute("data-lang", lang);
    root.setAttribute("lang", lang);
    document.title = TITLES[lang];
    var meta = document.getElementById("meta-desc");
    if (meta) meta.setAttribute("content", DESCRIPTIONS[lang]);

    document.querySelectorAll(".lang-btn").forEach(function (btn) {
      btn.setAttribute("aria-pressed", String(btn.dataset.setLang === lang));
    });

    // <option> elements can't hold per-language spans, so swap their labels
    document.querySelectorAll("option[data-ja]").forEach(function (opt) {
      opt.textContent = lang === "en" ? opt.dataset.en : opt.dataset.ja;
    });

    try { localStorage.setItem("ts-lang", lang); } catch (e) { /* private mode etc. */ }
  }

  document.querySelectorAll(".lang-btn").forEach(function (btn) {
    btn.addEventListener("click", function () { setLang(btn.dataset.setLang); });
  });

  var saved = null;
  try { saved = localStorage.getItem("ts-lang"); } catch (e) { /* ignore */ }
  setLang(saved || "ja");

  /* ---------- Mobile navigation ---------- */
  var menuBtn = document.getElementById("menu-btn");
  var nav = document.getElementById("site-nav");
  if (menuBtn && nav) {
    menuBtn.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      menuBtn.setAttribute("aria-expanded", String(open));
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        nav.classList.remove("is-open");
        menuBtn.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- Contact form (frontend only — sample site) ---------- */
  var form = document.getElementById("contact-form");
  var status = document.getElementById("form-status");
  if (form && status) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var lang = document.documentElement.getAttribute("data-lang") || "ja";
      if (!form.checkValidity()) {
        status.classList.add("is-error");
        status.textContent = lang === "en"
          ? "Please fill in all required fields with valid values."
          : "必須項目をご入力のうえ、内容をご確認ください。";
        form.reportValidity();
        return;
      }

      /* ==================================================================
         REAL SUBMISSION HANDLER GOES HERE.
         In production, replace the block below with a POST of the form
         data to a backend endpoint — e.g. a Cloudflare Pages Function:

           const data = Object.fromEntries(new FormData(form));
           const res = await fetch("/api/contact", {
             method: "POST",
             headers: { "Content-Type": "application/json" },
             body: JSON.stringify(data),
           });

         (Create functions/api/contact.js in this repo and Cloudflare Pages
         will serve it at /api/contact — it could relay to email via an
         email API, or store to KV/D1.) This sample site only simulates
         success client-side.
         ================================================================== */
      status.classList.remove("is-error");
      status.textContent = lang === "en"
        ? "Thank you. Your inquiry has been received (sample site — nothing was actually sent)."
        : "お問い合わせありがとうございます。送信を受け付けました（サンプルサイトのため実際には送信されていません）。";
      form.reset();
    });
  }
})();
