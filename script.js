/* =========================================================
   MUZAMMIL HUSSAIN — FRONTEND DEVELOPER PORTFOLIO
   script.js  —  Vanilla JavaScript
   ========================================================= */

(function () {
  "use strict";

  /* =========================================================
     EMAILJS CONFIGURATION
     ---------------------------------------------------------
     Replace the placeholder values below with your real
     EmailJS credentials from https://dashboard.emailjs.com/

     Steps:
       1. Create a free EmailJS account.
       2. Add an Email Service (connect your Gmail account).
       3. Create an Email Template with these variables:
            {{from_name}}  {{from_email}}  {{subject}}  {{message}}
       4. Copy your Public Key, Service ID and Template ID here.
       5. Never paste your Gmail password anywhere in this file.
     ========================================================= */
  const EMAILJS_CONFIG = {
    publicKey:  "BdZLTchFFISamPe9j",       // EmailJS → Account → Public Key
    serviceId:  "service_a38kt66",       // EmailJS → Email Services → Service ID
    templateId: "template_mpcp8as",      // EmailJS → Email Templates → Template ID
    recipientEmail: "khanmuzzamilhussain@gmail.com"
  };

const EMAILJS_READY =
  Boolean(EMAILJS_CONFIG.publicKey)  &&
  Boolean(EMAILJS_CONFIG.serviceId)  &&
  Boolean(EMAILJS_CONFIG.templateId) &&
  EMAILJS_CONFIG.publicKey  !== "YOUR_PUBLIC_KEY"  &&
  EMAILJS_CONFIG.serviceId  !== "YOUR_SERVICE_ID"  &&
  EMAILJS_CONFIG.templateId !== "YOUR_TEMPLATE_ID";
    

  /* =========================================================
     HELPERS
     ========================================================= */
  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* =========================================================
     1. THEME TOGGLE (dark / light)
     ========================================================= */
  const themeToggle = $("#themeToggle");
  const themeIcon   = $("#themeIcon");

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.setAttribute("data-bs-theme", theme);

    if (themeIcon) {
      themeIcon.className = theme === "dark"
        ? "bi bi-moon-stars-fill"
        : "bi bi-sun-fill";
    }

    if (themeToggle) {
      themeToggle.setAttribute(
        "aria-label",
        theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
      );
    }

    try { localStorage.setItem("mh-theme", theme); } catch (_) {}
  }

  // Sync icon with the theme already applied by the inline <head> script
  applyTheme(document.documentElement.getAttribute("data-theme") || "dark");

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      const current = document.documentElement.getAttribute("data-theme");
      applyTheme(current === "dark" ? "light" : "dark");
    });
  }

  /* =========================================================
     2. NAVBAR — scrolled state, mobile close, active links
     ========================================================= */
  const nav = $("#siteNav");

  function onScrollNav() {
    if (!nav) return;
    if (window.scrollY > 40) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScrollNav, { passive: true });
  onScrollNav();

  // Close mobile menu when a nav link is clicked
  const navCollapse = $("#navMenu");
  $$(".navbar-nav .nav-link, .navbar-nav .btn").forEach(function (link) {
    link.addEventListener("click", function () {
      if (navCollapse && navCollapse.classList.contains("show")) {
        const bsCollapse = bootstrap.Collapse.getInstance(navCollapse)
          || new bootstrap.Collapse(navCollapse, { toggle: false });
        bsCollapse.hide();
      }
    });
  });

  // Highlight the active nav link based on the visible section
  const navLinks = $$(".navbar-nav .nav-link[href^='#']");
  const sectionIds = navLinks
    .map(function (a) { return a.getAttribute("href").slice(1); })
    .filter(function (id) { return document.getElementById(id); });

  const sections = sectionIds
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);

  if (sections.length && "IntersectionObserver" in window) {
    const navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          const id = entry.target.id;
          navLinks.forEach(function (link) {
            link.classList.toggle("active", link.getAttribute("href") === "#" + id);
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach(function (sec) { navObserver.observe(sec); });
  }

  /* =========================================================
     3. TYPING EFFECT (hero role)
     ========================================================= */
  const typedEl = $("#typedRole");
  const roles = [
    "Frontend Developer",
    "Responsive Web Developer",
    "JavaScript Developer"
  ];

  if (typedEl) {
    let roleIndex = 0;
    let charIndex = 0;
    let deleting = false;
    const typeSpeed = 80;
    const deleteSpeed = 40;
    const holdTime = 1800;

    function tick() {
      const current = roles[roleIndex];

      if (!deleting) {
        charIndex++;
        typedEl.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          return setTimeout(tick, holdTime);
        }
        return setTimeout(tick, typeSpeed);
      }

      charIndex--;
      typedEl.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        return setTimeout(tick, 400);
      }
      return setTimeout(tick, deleteSpeed);
    }

    // Respect reduced-motion preference
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      typedEl.textContent = roles[0];
    } else {
      setTimeout(tick, 700);
    }
  }

  /* =========================================================
     4. SCROLL REVEAL ANIMATIONS
     ========================================================= */
  const revealEls = $$("[data-reveal]");

  if ("IntersectionObserver" in window && revealEls.length) {
    revealEls.forEach(function (el) {
      const delay = parseInt(el.getAttribute("data-delay"), 10) || 0;
      el.style.transitionDelay = delay + "ms";
    });

    const revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("revealed"); });
  }

  /* =========================================================
     5. PROJECT FILTER
     ========================================================= */
  const filterButtons = $$(".filter-btn");
  const projectItems  = $$(".project-item");

  filterButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      const filter = btn.getAttribute("data-filter");

      filterButtons.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");

      projectItems.forEach(function (item) {
        const categories = (item.getAttribute("data-category") || "").split(/\s+/);
        const show = filter === "all" || categories.includes(filter);

        if (show) {
          item.classList.remove("is-hidden");
          item.style.opacity = "0";
          item.style.transform = "translateY(14px)";
          requestAnimationFrame(function () {
            item.style.opacity = "1";
            item.style.transform = "translateY(0)";
          });
        } else {
          item.classList.add("is-hidden");
        }
      });
    });
  });

  /* =========================================================
     6. SCROLL-TO-TOP BUTTON
     ========================================================= */
  const scrollTopBtn = $("#scrollTopBtn");

  if (scrollTopBtn) {
    window.addEventListener(
      "scroll",
      function () {
        scrollTopBtn.classList.toggle("visible", window.scrollY > 500);
      },
      { passive: true }
    );

    scrollTopBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* =========================================================
     7. TOAST NOTIFICATIONS
     ========================================================= */
  const toastStack = $("#toastStack");

  function showToast(type, title, message, duration) {
    if (!toastStack) return;

    duration = typeof duration === "number" ? duration : 5000;

    const icons = {
      success: "bi-check-circle-fill",
      error:   "bi-x-circle-fill",
      info:    "bi-info-circle-fill"
    };

    const toast = document.createElement("div");
    toast.className = "toast-card toast-" + type;
    toast.setAttribute("role", "alert");
    toast.innerHTML =
      '<div class="toast-icon"><i class="bi ' + (icons[type] || icons.info) + '"></i></div>' +
      '<div class="toast-content">' +
        '<div class="toast-title">' + escapeHtml(title) + "</div>" +
        '<div class="toast-msg">' + escapeHtml(message) + "</div>" +
      "</div>" +
      '<button type="button" class="toast-close" aria-label="Close notification">' +
        '<i class="bi bi-x-lg"></i>' +
      "</button>";

    toastStack.appendChild(toast);

    requestAnimationFrame(function () { toast.classList.add("show"); });

    const remove = function () {
      toast.classList.remove("show");
      setTimeout(function () { toast.remove(); }, 350);
    };

    toast.querySelector(".toast-close").addEventListener("click", remove);
    if (duration > 0) setTimeout(remove, duration);
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  /* =========================================================
     8. CONTACT FORM — validation + EmailJS
     ========================================================= */
  const form      = $("#contactForm");
  const submitBtn = $("#submitBtn");

  if (form && submitBtn) {
    const btnLabel   = $(".btn-label", submitBtn);
    const btnLoading = $(".btn-loading", submitBtn);

    const fields = ["name", "email", "subject", "message"];

    // ---- validation rules ----
    function validateField(name) {
      const field = $("#" + name);
      const errEl = $('[data-error-for="' + name + '"]');
      if (!field || !errEl) return true;

      const value = field.value.trim();
      let error = "";

      if (name === "name") {
        if (!value)             error = "Please enter your full name.";
        else if (value.length < 2) error = "Your name looks too short.";
      } else if (name === "email") {
        if (!value)             error = "Please enter your email address.";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value))
                                error = "Please enter a valid email address.";
      } else if (name === "subject") {
        if (!value)             error = "Please add a subject.";
      } else if (name === "message") {
        if (!value)             error = "Please write your message.";
        else if (value.length < 10) error = "Message should be at least 10 characters.";
      }

      if (error) {
        field.classList.add("is-invalid");
        field.classList.remove("is-valid");
        errEl.textContent = error;
        return false;
      }

      field.classList.remove("is-invalid");
      field.classList.add("is-valid");
      errEl.textContent = "";
      return true;
    }

    function validateAll() {
      let firstInvalid = null;
      fields.forEach(function (name) {
        const ok = validateField(name);
        if (!ok && !firstInvalid) firstInvalid = $("#" + name);
      });
      if (firstInvalid) firstInvalid.focus();
      return !firstInvalid;
    }

    // Live validation
    fields.forEach(function (name) {
      const field = $("#" + name);
      if (!field) return;

      field.addEventListener("blur", function () {
        if (field.value.trim() !== "" || field.classList.contains("is-invalid")) {
          validateField(name);
        }
      });

      field.addEventListener("input", function () {
        if (field.classList.contains("is-invalid")) {
          validateField(name);
        }
      });
    });

    // ---- submit button state ----
    function setLoading(loading) {
      submitBtn.disabled = loading;
      if (btnLabel)   btnLabel.classList.toggle("d-none", loading);
      if (btnLoading) btnLoading.classList.toggle("d-none", !loading);
    }

    // ---- submit handler ----
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      // Honeypot (spam protection)
      const honeypot = $("#company");
      if (honeypot && honeypot.value.trim() !== "") {
        // Silently reject bots
        form.reset();
        return;
      }

      if (!validateAll()) {
        showToast("error", "Missing information", "Please fill in all required fields correctly.", 4500);
        return;
      }

      const name    = $("#name").value.trim();
      const email   = $("#email").value.trim();
      const subject = $("#subject").value.trim();
      const message = $("#message").value.trim();

      setLoading(true);

      // If EmailJS is not configured yet, show an informative message
      if (!EMAILJS_READY || typeof emailjs === "undefined") {
        setTimeout(function () {
          setLoading(false);
          showToast(
            "info",
            "EmailJS not configured yet",
            "Add your public key, service ID and template ID in script.js to enable sending.",
            7000
          );
        }, 700);
        return;
      }

      const templateParams = {
        from_name:  name,
        from_email: email,
        subject:    subject,
        message:    message,
        to_email:   EMAILJS_CONFIG.recipientEmail
      };

      emailjs
        .send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, templateParams)
        .then(function () {
          setLoading(false);
          form.reset();
          fields.forEach(function (name) {
            const f = $("#" + name);
            if (f) f.classList.remove("is-valid", "is-invalid");
            const e = $('[data-error-for="' + name + '"]');
            if (e) e.textContent = "";
          });
          showToast("success", "Message sent!", "Thanks for reaching out — I'll get back to you soon.");
        })
        .catch(function (err) {
          console.error("[EmailJS] Send failed:", err);
          setLoading(false);
          showToast("error", "Message not sent", "Something went wrong. Please try again or email me directly.", 6000);
        });
    });
  }

  /* =========================================================
     9. PENDING LIVE DEMO LINKS
     (Netlify dashboard URLs were provided instead of public URLs)
     ========================================================= */
  $$('[data-pending="true"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      showToast(
        "info",
        "Demo link coming soon",
        "This project's public URL is being updated. Please check back shortly.",
        5000
      );
    });
  });

  /* =========================================================
     10. FOOTER YEAR
     ========================================================= */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* =========================================================
     11. INIT EMAILJS SDK
     ========================================================= */
  if (EMAILJS_READY && typeof emailjs !== "undefined") {
    try {
      if (typeof emailjs.init === "function") {
        // EmailJS v4 signature
        emailjs.init({ publicKey: EMAILJS_CONFIG.publicKey });
      }
    } catch (err) {
      console.warn("[EmailJS] Init failed:", err);
    }
  } else if (!EMAILJS_READY) {
    console.info(
      "[EmailJS] Configuration pending. " +
      "Update EMAILJS_CONFIG in script.js with your real keys to enable form delivery."
    );
  }

})();