/* ==========================================================================
   main.js — page behaviour
   Mobile nav, header elevation, hero typing effect, scroll reveal,
   UTC status-bar clock and footer year. Vanilla JS, no dependencies.
   Every animation is skipped when the user prefers reduced motion.
   ========================================================================== */

(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

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

  /* --- Hero typing effect ------------------------------------------------ */
  /* The full sentence is already in the markup, so the page is readable
     without JS; we only reset and retype it when motion is welcome. */
  var typingTarget = document.querySelector("[data-typing]");

  if (typingTarget && !prefersReducedMotion) {
    var fullText = typingTarget.getAttribute("data-typing") || "";

    if (fullText.length) {
      var index = 0;
      typingTarget.textContent = "";

      var typeNextCharacter = function () {
        index += 1;
        typingTarget.textContent = fullText.slice(0, index);

        if (index < fullText.length) {
          window.setTimeout(typeNextCharacter, 45);
        }
      };

      window.setTimeout(typeNextCharacter, 400);
    }
  }

  /* --- Fade sections in as they enter the viewport ----------------------- */
  var revealItems = document.querySelectorAll(".reveal");

  if (revealItems.length) {
    if ("IntersectionObserver" in window && !prefersReducedMotion) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          });
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
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

  /* --- Status-bar clock -------------------------------------------------- */
  var clock = document.getElementById("clock");

  function pad(value) {
    return value < 10 ? "0" + value : String(value);
  }

  function updateClock() {
    var now = new Date();
    clock.textContent =
      pad(now.getUTCHours()) +
      ":" +
      pad(now.getUTCMinutes()) +
      ":" +
      pad(now.getUTCSeconds()) +
      " UTC";
  }

  if (clock) {
    updateClock();
    window.setInterval(updateClock, 1000);
  }

  /* --- Footer year ------------------------------------------------------- */
  var year = document.getElementById("year");

  if (year) {
    year.textContent = String(new Date().getFullYear());
  }
})();
