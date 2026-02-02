// Puzzle Marketing site scripts (v4)
// script.js

(() => {
  const $ = (s, el=document) => el.querySelector(s);
  const $$ = (s, el=document) => Array.from(el.querySelectorAll(s));

  // Year
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Burger menu
  const burger = $("#burger");
  const mobileNav = $("#mobileNav");
  if (burger && mobileNav) {
    burger.addEventListener("click", () => {
      const open = mobileNav.classList.toggle("open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    $$("#mobileNav a").forEach(a => a.addEventListener("click", () => {
      mobileNav.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
    }));
  }

  // FAQ accordion
  $$(".qa > button").forEach(btn => {
    btn.addEventListener("click", () => {
      const qa = btn.closest(".qa");
      const isOpen = qa.getAttribute("aria-expanded") === "true";
      $$(".qa").forEach(x => x.setAttribute("aria-expanded", "false"));
      qa.setAttribute("aria-expanded", isOpen ? "false" : "true");
    });
  });

  // Modal
  const modal = $("#consultModal");
  const successBox = $("#successBox");
  const errorBox = $("#errorBox");
  const leadForm = $("#leadForm");
  const submitBtn = $("#submitBtn");

  let lastFocused = null;
  let lockedScrollY = 0;

  const enableForm = (enabled) => {
    if (!leadForm) return;
    const fields = $$("input,textarea,select,button[type='submit']", leadForm);
    fields.forEach(el => { el.disabled = !enabled; });
  };

  const clearErrors = () => {
    $("#name")?.classList.remove("error");
    $("#contactField")?.classList.remove("error");
  };

  const hideMessages = () => {
    successBox?.classList.remove("show");
    errorBox?.classList.remove("show");
  };

  const lockBodyScroll = () => {
    lockedScrollY = window.scrollY || 0;
    document.body.classList.add("modal-open");
    document.body.style.position = "fixed";
    document.body.style.top = `-${lockedScrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
  };

  const unlockBodyScroll = () => {
    document.body.classList.remove("modal-open");
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.left = "";
    document.body.style.right = "";
    document.body.style.width = "";
    window.scrollTo(0, lockedScrollY);
  };

  const openModal = () => {
    if (!modal) return;
    lastFocused = document.activeElement;

    // Close mobile nav if open
    if (mobileNav?.classList.contains("open")) {
      mobileNav.classList.remove("open");
      burger?.setAttribute("aria-expanded", "false");
    }

    modal.setAttribute("aria-hidden", "false");
    lockBodyScroll();

    hideMessages();
    enableForm(true);
    clearErrors();
    leadForm?.reset();

    const first = $("#name", modal) || $("input,select,textarea,button", modal);
    if (first) setTimeout(() => first.focus(), 0);
  };

  const closeModal = () => {
    if (!modal) return;
    modal.setAttribute("aria-hidden", "true");
    unlockBodyScroll();
    if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
  };

  $$("[data-open-consult]").forEach(el => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      openModal();
    });
  });

  $$("[data-close-modal]").forEach(el => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      closeModal();
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal && modal.getAttribute("aria-hidden") === "false") {
      closeModal();
    }
  });

  // Focus trap
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Tab") return;
    if (!modal || modal.getAttribute("aria-hidden") !== "false") return;

    const focusables = $$("a,button,input,select,textarea,[tabindex]:not([tabindex='-1'])", modal)
      .filter(x => !x.hasAttribute("disabled"));

    if (!focusables.length) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  });

  // Form submit -> Web3Forms
  if (leadForm) {
    leadForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      hideMessages();

      const name = $("#name")?.value?.trim();
      const contact = $("#contactField")?.value?.trim();

      if (!name || !contact) {
        $("#name")?.classList.toggle("error", !name);
        $("#contactField")?.classList.toggle("error", !contact);
        return;
      }

      clearErrors();

      // disable submit while sending
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Відправляємо...";
      }

      try {
        const fd = new FormData(leadForm);
        fd.append("page", window.location.href);
        fd.append("timestamp", new Date().toISOString());

        const res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          body: fd
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok || data.success === false) {
          throw new Error(data.message || "Submit failed");
        }

        // show success message and keep modal open
        successBox?.classList.add("show");

        // disable form fields but keep close buttons working
        const fields = $$("input,textarea,select,button[type='submit']", leadForm);
        fields.forEach(el => { el.disabled = true; });

        // ensure success text is visible on small screens
        successBox?.scrollIntoView({ block: "nearest", behavior: "smooth" });

      } catch (err) {
        errorBox?.classList.add("show");
        enableForm(true);
      } finally {
        // IMPORTANT: return submit button to normal state
        // (disabled state for form fields remains after success)
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = "Відправити";
        }
      }
    });
  }
})();
