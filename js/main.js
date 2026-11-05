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

  /* --- Footer year ------------------------------------------------------- */
  var year = document.getElementById("year");

  if (year) {
    year.textContent = String(new Date().getFullYear());
  }
})();
