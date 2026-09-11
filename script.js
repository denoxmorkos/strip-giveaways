/* Token Guide — minimal vanilla JS: nav, promo bar, chat assistant.
   The page remains usable without JavaScript: content, links and the
   video are plain HTML; JS only enhances navigation, dismissal and chat. */
(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Sticky header shadow ---------- */
  var header = document.querySelector(".site-header");
  function onScroll() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile navigation ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("primary-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
        toggle.focus();
      }
    });
  }

  /* ---------- Sticky promo bar: close + body clearance ---------- */
  var promoBar = document.getElementById("promo-bar");
  var promoClose = document.querySelector(".promo-close");
  var DISMISS_KEY = "tg-promo-dismissed";

  function syncBodyPadding() {
    if (!promoBar || promoBar.hidden) {
      document.body.style.paddingBottom = "0px";
      return;
    }
    // Keep content clear of the fixed bar on any viewport size.
    var h = promoBar.getBoundingClientRect().height;
    document.body.style.paddingBottom = Math.ceil(h) + "px";
  }

  if (promoBar) {
    var dismissed = false;
    try {
      dismissed = window.sessionStorage.getItem(DISMISS_KEY) === "1";
    } catch (err) {
      dismissed = false;
    }
    if (dismissed) {
      promoBar.hidden = true;
    }
    syncBodyPadding();
    window.addEventListener("resize", syncBodyPadding);
    window.addEventListener("orientationchange", function () {
      window.setTimeout(syncBodyPadding, 150);
    });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(syncBodyPadding);
    }
  }

  if (promoClose && promoBar) {
    promoClose.addEventListener("click", function () {
      promoBar.hidden = true;
      try {
        window.sessionStorage.setItem(DISMISS_KEY, "1");
      } catch (err) {
        /* storage unavailable — still hide for this view */
      }
      syncBodyPadding();
    });
  }

  /* ---------- Footer year ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* ---------- Print checklist ---------- */
  document.querySelectorAll("[data-print]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      window.print();
    });
  });

  /* ============================================================
     Chat assistant — rule-based, fully client-side.
     - Directs offer questions to StripTks.Live with hedged wording.
     - Never requests passwords, payment or private credentials.
     - Never guarantees tokens; never claims official affiliation.
     ============================================================ */
  var chatForm = document.getElementById("chat-form");
  var chatInput = document.getElementById("chat-input");
  var chatLog = document.getElementById("chat-messages");

  var OFFER_URL = "https://striptks.live";
  var OFFER_HOST = "StripTks.Live";

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (typeof text === "string") node.textContent = text;
    return node;
  }

  function offerLink() {
    var a = document.createElement("a");
    a.href = OFFER_URL;
    a.target = "_blank";
    a.rel = "nofollow sponsored noopener noreferrer";
    a.textContent = OFFER_HOST;
    return a;
  }

  function internalLink(href, text) {
    var a = document.createElement("a");
    a.href = href;
    a.textContent = text;
    return a;
  }

  // Bot answers as arrays of segments: strings, {offer: true} or {link: href, text: t}
  var ANSWERS = {
    free: [
      "To learn more about the available offer, visit ",
      { offer: true },
      ". The website provides information about a promotional offer of 50 tokens, with draws held on its own schedule. Terms, eligibility, and availability may vary — please review the current details on the destination website before participating."
    ],
    legitimate: [
      "I can't verify any third-party offer for you. Please visit ",
      { offer: true },
      " and carefully review the offer details, terms, eligibility requirements, and contact information before participating. A trustworthy page shows clear terms and never asks for your Stripchat password."
    ],
    howMany: [
      "According to the promotional information, eligible users may have a chance to receive 50 tokens. Visit ",
      { offer: true },
      " for the current details and terms. Nothing is guaranteed — eligibility and availability may vary."
    ],
    password: [
      "No — never share your Stripchat password, recovery codes, or payment details with any promotional website, chat, or email. Legitimate ",
      { link: "#offers", text: "token offers" },
      " never ask for them. If a site demands your login, leave immediately."
    ],
    affiliated: [
      "This website is not affiliated with or endorsed by Stripchat unless explicitly stated. The same caution applies to third-party promotion sites: do not assume an official relationship unless it is confirmed in verifiable official documentation."
    ],
    scam: [
      "Good instinct to ask. Warning signs include unlimited-token promises, token generators, APK downloads, and countdown timers. See ",
      { link: "#scam-warnings", text: "how to identify a token scam" },
      " and run through the ",
      { link: "#safety-checklist", text: "5-minute safety checklist" },
      " before trusting any offer."
    ],
    buy: [
      "The safest way to buy tokens is the official platform checkout or a clearly disclosed authorized partner. Check the exact domain, use secure payment methods, and keep your receipt. Our ",
      { link: "#legal-methods", text: "legal methods guide" },
      " walks through the details."
    ],
    giveaway: [
      "A legitimate giveaway publishes its rules: dates, eligibility, entry steps, prize, winner selection, and geographic limits. If any of that is missing, treat it as a red flag. Anything specific — ",
      { offer: true },
      " describes its own current promotion and terms."
    ],
    sensitive: [
      "For your safety, please never share passwords, recovery codes, or payment details here or on any promotional website. I can't process personal information, and legitimate offers never ask for it. If you already shared something sensitive, change your passwords and contact your payment provider right away."
    ],
    greeting: [
      "Hi! I can explain legal ways to find token promotions, how to check whether an offer is real, and how to stay safe. Try a sample question above, or ask about the current promotional information on ",
      { offer: true },
      "."
    ],
    fallback: [
      "I can help with questions about legal token methods, checking promotions, giveaway rules, and staying safe from scams. For the current promotional details, visit ",
      { offer: true },
      " and verify the terms there. What would you like to know first?"
    ]
  };

  function pickAnswer(raw) {
    var q = " " + raw.toLowerCase() + " ";

    // Refuse anything that looks like shared secrets — never echo them.
    if (
      /\b(password|passwd|pwd|recovery\s*code|otp|ssn|social\s*security)\b\s*(is|:|=)/.test(q) ||
      /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{1,4}\b/.test(q) ||
      /\b\d{3}-\d{2}-\d{4}\b/.test(q)
    ) {
      return ANSWERS.sensitive;
    }
    if (/(affiliat|endorsed|official|partner of stripchat|run by stripchat)/.test(q)) return ANSWERS.affiliated;
    if (/(password|login|log\s*in|credential|share my|same password|reuse)/.test(q)) return ANSWERS.password;
    if (/(legit|real\?|trust|scam|fake|safe\?|fraud|verify|genuine)/.test(q) && /(offer|site|website|striptks|promotion|promo)/.test(q)) {
      // "Is the offer legitimate?" style questions
      if (/(scam|fake|fraud)/.test(q) && !/(legit|real|trust|genuine)/.test(q)) return ANSWERS.scam;
      return ANSWERS.legitimate;
    }
    if (/(scam|fake|fraud|generator|hack|unlimited|bot\b)/.test(q)) return ANSWERS.scam;
    if (/(how many|50|fifty|amount|quantity|much can i get)/.test(q)) return ANSWERS.howMany;
    if (/\b(buy|buys|purchase|payment|pay|paying|checkout|credit card)\b/.test(q)) return ANSWERS.buy;
    if (/(free|get tokens|how (can|do|to)|obtain|earn|claim|win|draw|hourly)/.test(q)) return ANSWERS.free;
    if (/(giveaway|contest|draw|raffle|sweepstake|promo code|promotion|bonus|discount)/.test(q)) return ANSWERS.giveaway;
    if (/(^(hi|hello|hey|yo|sup|good (morning|afternoon|evening))\b|help|start)/.test(q.trim())) return ANSWERS.greeting;
    return ANSWERS.fallback;
  }

  function scrollChat() {
    if (!chatLog) return;
    chatLog.scrollTop = chatLog.scrollHeight;
  }

  function appendUser(text) {
    chatLog.appendChild(el("div", "chat-msg user", text));
    scrollChat();
  }

  function appendBot(segments) {
    var msg = el("div", "chat-msg bot", null);
    segments.forEach(function (seg) {
      if (typeof seg === "string") {
        msg.appendChild(document.createTextNode(seg));
      } else if (seg && seg.offer) {
        msg.appendChild(offerLink());
      } else if (seg && seg.link) {
        msg.appendChild(internalLink(seg.link, seg.text));
      }
    });
    chatLog.appendChild(msg);
    scrollChat();
  }

  function appendTyping() {
    var t = el("div", "chat-msg bot typing", null);
    t.setAttribute("aria-hidden", "true");
    for (var i = 0; i < 3; i++) t.appendChild(document.createElement("span"));
    chatLog.appendChild(t);
    scrollChat();
    return t;
  }

  function respond(raw) {
    var answer = pickAnswer(raw);
    if (prefersReducedMotion) {
      appendBot(answer);
      return;
    }
    var typing = appendTyping();
    window.setTimeout(function () {
      typing.remove();
      appendBot(answer);
    }, 650);
  }

  if (chatForm && chatInput && chatLog) {
    chatForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var value = chatInput.value.trim();
      if (!value) return;
      if (value.length > 500) value = value.slice(0, 500);
      appendUser(value);
      chatInput.value = "";
      respond(value);
    });

    document.querySelectorAll("[data-sample]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var q = btn.getAttribute("data-sample");
        appendUser(q);
        respond(q);
        chatInput.focus({ preventScroll: true });
      });
    });
  }
})();
