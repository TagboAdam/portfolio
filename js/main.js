/* ==========================================================================
   main.js — page behaviour
   Mobile nav, header elevation, hero file render (GSAP + ScrollTrigger),
   scroll reveal, UTC status-bar clock and footer year. Vanilla JS, with the
   hero render as the only GSAP consumer. Every animation is skipped when the
   user prefers reduced motion.
   ========================================================================== */

(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // GSAP is loaded before this file (defer order), so the hero file render
  // below can drive itself with ScrollTrigger. js/animations.js still owns the
  // rest of the choreography; main.js keeps its fallbacks for when the library
  // never arrives.
  var gsapActive = !!window.gsap;

  // Register the plugins once, up front, so every builder can assume they are
  // ready: ScrollTrigger is vendored, SplitText comes from the CDN. Either can
  // be absent (offline / blocked), so both registrations are guarded.
  if (gsapActive) {
    if (window.ScrollTrigger) window.gsap.registerPlugin(window.ScrollTrigger);
    if (window.SplitText) window.gsap.registerPlugin(window.SplitText);
  }

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

  /* --- Hero file render -------------------------------------------------- */
  /* The hero terminal's `cat ~/profile.json` output is revealed the way a file
     is read off disk: every line snaps in on a fast stagger while a soft
     highlight sweeps down the block. The text is authored in the markup, so the
     page reads fine without JS, without GSAP or without motion.

     ScrollTrigger plays it once, as the terminal enters the viewport; on first
     load that is immediately, so the timing below is tuned against the hero
     intro in js/animations.js. */
  var fileBlock = document.querySelector("[data-file-render]");

  if (
    fileBlock &&
    !prefersReducedMotion &&
    window.gsap &&
    window.ScrollTrigger
  ) {
    var gsap = window.gsap;
    var ScrollTrigger = window.ScrollTrigger;

    // js/animations.js registers the plugin as well; a second call is a no-op.
    gsap.registerPlugin(ScrollTrigger);

    var fileLines = Array.prototype.slice.call(
      fileBlock.querySelectorAll(".file-line")
    );

    if (fileLines.length) {
      // Line boxes are uniform, so one computed line height is enough to size
      // the highlight and to work out how far it has to travel.
      var lineHeight =
        parseFloat(window.getComputedStyle(fileLines[0]).height) ||
        fileLines[0].offsetHeight ||
        20;
      var travel = fileLines[fileLines.length - 1].offsetTop || 0;

      // Purely decorative scan bar, so it stays out of the accessibility tree.
      var scan = document.createElement("span");
      scan.className = "file-render__scan";
      scan.setAttribute("aria-hidden", "true");
      fileBlock.appendChild(scan);

      var stagger = 0.045;
      var lineDuration = 0.2;
      var spread = lineDuration + stagger * (fileLines.length - 1);
      // js/animations.js fades the terminal window in first; starting after
      // that beat means the render is actually seen rather than happening
      // behind an invisible parent.
      var start = 0.6;

      gsap.set(fileLines, { autoAlpha: 0, y: 10 });
      gsap.set(scan, { height: lineHeight, autoAlpha: 0 });

      // If the terminal is already on screen at load — the side-by-side desktop
      // hero, or the stacked hero on a tall phone — render straight away so the
      // window is never left sitting empty inside the first viewport. Only when
      // it starts out below the fold do we wait for it to scroll in.
      var onScreen = fileBlock.getBoundingClientRect().top < window.innerHeight;

      gsap
        .timeline({
          scrollTrigger: {
            trigger: fileBlock,
            start: onScreen ? "top bottom" : "top 85%",
            once: true
          }
        })
        .to(
          fileLines,
          {
            autoAlpha: 1,
            y: 0,
            duration: lineDuration,
            ease: "power2.out",
            stagger: stagger
          },
          start
        )
        .to(scan, { autoAlpha: 1, duration: 0.12, ease: "power1.out" }, start)
        // `none` keeps the bar glued to the line that is currently landing.
        .to(
          scan,
          { y: travel, duration: Math.max(spread - 0.12, 0.1), ease: "none" },
          start + 0.12
        )
        .to(
          scan,
          { autoAlpha: 0, duration: 0.28, ease: "power1.out" },
          start + spread - 0.14
        );
    }
  }

  /* --- Fade sections in as they enter the viewport ----------------------- */
  var revealItems = document.querySelectorAll(".reveal");

  if (revealItems.length) {
    // With GSAP present, js/animations.js runs the scroll reveals instead.
    if (
      "IntersectionObserver" in window &&
      !prefersReducedMotion &&
      !gsapActive
    ) {
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
