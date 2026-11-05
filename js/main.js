/* ==========================================================================
   main.js — page behaviour
   Small, dependency-free: mobile navigation, header hairline on scroll,
   one-time section reveals and the footer year. All content is in the markup,
   so nothing here is required for the page to read.
   ========================================================================== */

(function () {
  "use strict";

  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  var main = document.getElementById("main");
  var footer = document.querySelector(".site-footer");

  /* --- Mobile navigation ------------------------------------------------- */
  function setNavOpen(open, moveFocus) {
    if (!toggle || !nav) return;

    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    nav.dataset.open = String(open);
    document.body.classList.toggle("nav-open", open);

    // Keep the page behind the open panel out of the tab order
    if (main) main.inert = open;
    if (footer) footer.inert = open;

    if (open && moveFocus) {
      var firstLink = nav.querySelector("a");
      if (firstLink) firstLink.focus();
    }
  }

  function isNavOpen() {
    return !!toggle && toggle.getAttribute("aria-expanded") === "true";
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      setNavOpen(!isNavOpen(), true);
    });

    // Choosing a destination closes the panel
    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) setNavOpen(false, false);
    });

    // Escape closes and returns focus to the trigger
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && isNavOpen()) {
        setNavOpen(false, false);
        toggle.focus();
      }
    });

    // A resize past the breakpoint must never leave the panel stuck open
    var desktop = window.matchMedia("(min-width: 641px)");
    desktop.addEventListener("change", function (event) {
      if (event.matches) setNavOpen(false, false);
    });
  }

  /* --- Header hairline --------------------------------------------------- */
  if (header) {
    var updateHeader = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 4);
    };

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
  }

  /* --- Section reveals --------------------------------------------------- */
  /* Hidden state lives behind `.js .reveal`, so without this script (or when
     the observer is unavailable) the content is simply visible. */
  var revealItems = document.querySelectorAll(".reveal");

  if (revealItems.length) {
    if ("IntersectionObserver" in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          });
        },
        { rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
      );

      revealItems.forEach(function (item) {
        observer.observe(item);
      });
    } else {
      revealItems.forEach(function (item) {
        item.classList.add("is-visible");
      });
    }
  }

  /* --- Copy email ------------------------------------------------------- */
  /* A small piece of UI worth having: one click copies the address, swaps the
     icon to a check for two seconds and announces the result to screen
     readers. Falls back to a temporary textarea where the Clipboard API is
     unavailable or denied. */
  var copyButton = document.querySelector("[data-copy-email]");
  var copyLabel = document.querySelector("[data-copy-label]");
  var copyStatus = document.querySelector("[data-copy-status]");
  var copyIcon = document.querySelector("[data-copy-icon] use");

  if (copyButton && copyLabel && copyStatus) {
    var copyResetTimer;

    var setCopied = function (copied) {
      copyButton.dataset.copied = copied ? "true" : "false";
      copyLabel.textContent = copied ? "copied" : "copy email address";

      if (copyIcon) {
        copyIcon.setAttribute("href", copied ? "#i-check" : "#i-copy");
      }

      if (!copied) return;

      copyStatus.textContent = "Email address copied to clipboard";
      window.clearTimeout(copyResetTimer);
      copyResetTimer = window.setTimeout(function () {
        setCopied(false);
      }, 2000);
    };

    var copyFailed = function () {
      copyStatus.textContent = "Copy failed. Use the email link above.";
    };

    var legacyCopy = function (text) {
      var field = document.createElement("textarea");
      field.value = text;
      field.setAttribute("readonly", "");
      field.style.position = "fixed";
      field.style.top = "-1000px";
      document.body.appendChild(field);
      field.select();

      var ok = false;
      try {
        ok = document.execCommand("copy");
      } catch (error) {
        ok = false;
      }

      document.body.removeChild(field);
      return ok;
    };

    copyButton.addEventListener("click", function () {
      var email = copyButton.getAttribute("data-copy-email") || "";

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(
          function () {
            setCopied(true);
          },
          function () {
            if (legacyCopy(email)) {
              setCopied(true);
            } else {
              copyFailed();
            }
          }
        );
      } else if (legacyCopy(email)) {
        setCopied(true);
      } else {
        copyFailed();
      }
    });
  }

  /* --- Footer year ------------------------------------------------------- */
  var year = document.getElementById("year");

  if (year) {
    year.textContent = String(new Date().getFullYear());
  }
})();
