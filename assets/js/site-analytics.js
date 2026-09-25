(() => {
  "use strict";

  const config = window.Studios216AnalyticsConfig || {};
  const consent = config.consent || {};
  const providers = config.providers || {};
  const events = config.events || {};
  const storageKey = consent.storage_key || "studios216.analytics.consent.v1";
  const allowed = new Set([...(events.ga4 || []), ...(events.meta_pixel || []), ...(events.clarity || [])]);
  let providerLoadStarted = false;

  const lang = (document.documentElement.lang || "en").toLowerCase().startsWith("es") ? "es" : "en";
  const copy = {
    en: {
      title: "Analytics choices",
      body: "Studios216 uses GA4, Meta Pixel and Microsoft Clarity only if you accept non-essential analytics. This helps us understand traffic and product interest.",
      accept: "Accept analytics",
      reject: "Reject non-essential",
      privacy: "Privacy",
      choices: "Privacy choices"
    },
    es: {
      title: "Preferencias de analítica",
      body: "Studios216 usa GA4, Meta Pixel y Microsoft Clarity solo si aceptas la analítica no esencial. Esto nos ayuda a entender el tráfico y el interés en productos.",
      accept: "Aceptar analítica",
      reject: "Rechazar no esenciales",
      privacy: "Privacidad",
      choices: "Preferencias de privacidad"
    }
  }[lang];

  function readChoice() {
    try {
      const value = localStorage.getItem(storageKey);
      return value === "accepted" || value === "rejected" ? value : null;
    } catch (_) {
      return null;
    }
  }

  function writeChoice(value) {
    try { localStorage.setItem(storageKey, value); } catch (_) {}
  }

  function injectScript(src, attributes = {}) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.async = true;
      script.src = src;
      Object.entries(attributes).forEach(([key, value]) => script.setAttribute(key, value));
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  function initConsentMode() {
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function(){ window.dataLayer.push(arguments); };
    window.gtag("consent", "default", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied"
    });
  }

  function loadGA4() {
    const ga = providers.ga4 || {};
    if (!ga.enabled || !ga.measurement_id) return;
    window.gtag("consent", "update", {
      analytics_storage: "granted",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied"
    });
    injectScript("https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(ga.measurement_id))
      .then(() => {
        window.gtag("js", new Date());
        window.gtag("config", ga.measurement_id);
      })
      .catch(() => {});
  }

  function loadMetaPixel() {
    const meta = providers.meta_pixel || {};
    if (!meta.enabled || !meta.pixel_id || window.fbq) return;
    !function(f,b,e,v,n,t,s){
      if(f.fbq)return;
      n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;
      n.push=n;n.loaded=!0;n.version="2.0";n.queue=[];
      t=b.createElement(e);t.async=!0;t.src=v;
      s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s);
    }(window,document,"script","https://connect.facebook.net/en_US/fbevents.js");
    window.fbq("init", meta.pixel_id);
    window.fbq("track", "PageView");
  }

  function loadClarity() {
    const clarityConfig = providers.clarity || {};
    if (!clarityConfig.enabled || !clarityConfig.project_id || window.__studios216ClarityLoaded) return;
    window.__studios216ClarityLoaded = true;
    (function(c,l,a,r,i,t,y){
      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
      t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", clarityConfig.project_id);
  }

  function loadProviders() {
    if (providerLoadStarted) return;
    providerLoadStarted = true;
    loadGA4();
    loadMetaPixel();
    loadClarity();
  }

  function sanitizedParams(params) {
    const out = {};
    Object.entries(params || {}).forEach(([key, value]) => {
      if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") out[key] = value;
    });
    return out;
  }

  function track(name, params = {}) {
    if (!allowed.has(name) || readChoice() !== "accepted") return false;
    const payload = sanitizedParams(params);

    if ((events.ga4 || []).includes(name) && typeof window.gtag === "function") {
      window.gtag("event", name, payload);
    }
    if ((events.meta_pixel || []).includes(name) && typeof window.fbq === "function") {
      window.fbq("trackCustom", name, payload);
    }
    if ((events.clarity || []).includes(name) && typeof window.clarity === "function") {
      window.clarity("event", name);
    }
    return true;
  }

  function setConsent(value) {
    if (value !== "accepted" && value !== "rejected") return;
    const previous = readChoice();
    writeChoice(value);
    dismissBanner();

    if (value === "accepted") {
      loadProviders();
      showChoicesButton();
      return;
    }

    showChoicesButton();
    if (previous === "accepted") window.location.reload();
  }

  function dismissBanner() {
    document.getElementById("studios216-consent")?.remove();
  }

  function button(label, className, handler) {
    const el = document.createElement("button");
    el.type = "button";
    el.className = className;
    el.textContent = label;
    el.addEventListener("click", handler);
    return el;
  }

  function showBanner() {
    if (document.getElementById("studios216-consent")) return;
    document.getElementById("studios216-privacy-choices")?.remove();

    const box = document.createElement("section");
    box.id = "studios216-consent";
    box.className = "s216-consent";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-live", "polite");
    box.setAttribute("aria-label", copy.title);

    const text = document.createElement("div");
    text.className = "s216-consent__text";
    const title = document.createElement("strong");
    title.textContent = copy.title;
    const body = document.createElement("p");
    body.textContent = copy.body;
    text.append(title, body);

    const actions = document.createElement("div");
    actions.className = "s216-consent__actions";
    actions.append(
      button(copy.accept, "s216-consent__button s216-consent__button--primary", () => setConsent("accepted")),
      button(copy.reject, "s216-consent__button", () => setConsent("rejected"))
    );
    const privacy = document.createElement("a");
    privacy.className = "s216-consent__link";
    privacy.href = consent.policy_url || "/privacy.html";
    privacy.textContent = copy.privacy;
    actions.appendChild(privacy);

    box.append(text, actions);
    document.body.appendChild(box);
  }

  function showChoicesButton() {
    if (document.getElementById("studios216-privacy-choices")) return;
    const el = button(copy.choices, "s216-privacy-choices", showBanner);
    el.id = "studios216-privacy-choices";
    document.body.appendChild(el);
  }

  function productParams(el) {
    return {
      product_id: el.dataset.productId || "",
      product_name: el.dataset.productName || "",
      placement: el.dataset.analyticsPlacement || "",
      destination: el.dataset.analyticsDestination || el.getAttribute("href") || ""
    };
  }

  function bindDeclarativeEvents() {
    document.addEventListener("click", (event) => {
      const target = event.target.closest("[data-analytics-event]");
      if (!target) return;
      track(target.dataset.analyticsEvent || "", productParams(target));
    });

    const targets = [...document.querySelectorAll("[data-analytics-impression]")];
    if (!targets.length || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        track(el.dataset.analyticsImpression || "product_impression", productParams(el));
        observer.unobserve(el);
      });
    }, { threshold: 0.5 });
    targets.forEach((el) => observer.observe(el));
  }

  initConsentMode();

  window.Studios216Analytics = {
    track,
    getConsent: readChoice,
    setConsent
  };

  function start() {
    const choice = readChoice();
    if (!consent.required || choice === "accepted") {
      if (!choice) writeChoice("accepted");
      loadProviders();
      showChoicesButton();
    } else if (choice === "rejected") {
      showChoicesButton();
    } else {
      showBanner();
    }
    bindDeclarativeEvents();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
