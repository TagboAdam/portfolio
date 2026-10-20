/* ==========================================================================
   main.js — page shell behaviour (Phase 3)
   Phase 5 adds project rendering, Phase 8 adds the theme toggle.
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

    // Keep everything behind the panel out of the tab order while it is open
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

    // Close after choosing a destination
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

    // Never leave the panel in a "closed" desktop state after resizing
    var desktop = window.matchMedia("(min-width: 48em)");
    desktop.addEventListener("change", function (event) {
      if (event.matches) setNavOpen(false, false);
    });
  }

  /* --- Header elevation on scroll ---------------------------------------- */
  if (header) {
    var updateHeader = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 4);
    };

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
  }
})();
