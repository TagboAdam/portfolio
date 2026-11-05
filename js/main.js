/* ==========================================================================
   main.js — page behaviour
   Small, dependency-free: mobile navigation, header hairline on scroll,
   one-time section reveals, the project carousel and the footer year. All
   content is in the markup, so nothing here is required for the page to read.
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

  /* --- Project carousel -------------------------------------------------- */
  /* One project in view, the rest parked off track. No autoplay: the index,
     the arrows and a swipe move it, and the arrow keys work while focus is
     inside the controls. Without this script every project is stacked and
     readable, and the index and arrows stay hidden. */
  var carousel = document.querySelector("[data-carousel]");

  if (carousel) {
    var track = carousel.querySelector("[data-track]");
    var viewport = carousel.querySelector(".work__viewport");
    var marker = carousel.querySelector("[data-marker]");
    var counter = carousel.querySelector("[data-counter]");
    var status = carousel.querySelector("[data-carousel-status]");
    var prevButton = carousel.querySelector("[data-carousel-prev]");
    var nextButton = carousel.querySelector("[data-carousel-next]");
    var slides = Array.prototype.slice.call(
      carousel.querySelectorAll("[data-slide]")
    );
    var tabs = Array.prototype.slice.call(
      carousel.querySelectorAll("[data-slide-to]")
    );
    var total = slides.length;
    var current = 0;

    var pad = function (value) {
      return (value < 10 ? "0" : "") + value;
    };

    // The hairline indicator is measured from the tabs, never hard-coded
    var moveMarker = function () {
      var tab = tabs[current];

      if (!marker || !tab) return;

      marker.style.width = tab.offsetWidth + "px";
      marker.style.transform = "translateX(" + tab.offsetLeft + "px)";
    };

    var show = function (next, announce) {
      if (!total) return;

      // Wrap in both directions so the arrows never end up doing nothing
      current = ((next % total) + total) % total;

      if (track) {
        track.style.transform = "translateX(" + current * -100 + "%)";
      }

      slides.forEach(function (slide, index) {
        var active = index === current;

        slide.classList.toggle("is-active", active);

        if (active) {
          slide.removeAttribute("inert");
          slide.removeAttribute("aria-hidden");
        } else {
          slide.setAttribute("inert", "");
          slide.setAttribute("aria-hidden", "true");
        }
      });

      tabs.forEach(function (tab, index) {
        if (index === current) {
          tab.setAttribute("aria-current", "true");
        } else {
          tab.removeAttribute("aria-current");
        }
      });

      if (counter) counter.textContent = pad(current + 1);

      moveMarker();

      if (announce && status) {
        status.textContent =
          "Project " +
          (current + 1) +
          " of " +
          total +
          ": " +
          (tabs[current] ? tabs[current].getAttribute("data-name") : "");
      }
    };

    if (prevButton) {
      prevButton.addEventListener("click", function () {
        show(current - 1, true);
      });
    }

    if (nextButton) {
      nextButton.addEventListener("click", function () {
        show(current + 1, true);
      });
    }

    tabs.forEach(function (tab, index) {
      tab.addEventListener("click", function () {
        show(index, true);
      });
    });

    // Arrow keys only step the carousel while focus sits on a control, so the
    // page still scrolls normally everywhere else
    carousel.addEventListener("keydown", function (event) {
      var onControl = event.target.closest
        ? event.target.closest(".work__index, .work__buttons")
        : null;

      if (!onControl) return;

      if (event.key === "ArrowRight") {
        event.preventDefault();
        show(current + 1, true);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        show(current - 1, true);
      }
    });

    // Swipe: horizontal only, and nowhere near as eager as a scroll
    var touchStartX = 0;
    var touchStartY = 0;
    var touching = false;

    if (viewport) {
      viewport.addEventListener(
        "touchstart",
        function (event) {
          if (event.touches.length !== 1) return;
          touchStartX = event.touches[0].clientX;
          touchStartY = event.touches[0].clientY;
          touching = true;
        },
        { passive: true }
      );

      viewport.addEventListener(
        "touchend",
        function (event) {
          if (!touching) return;
          touching = false;

          var touch = event.changedTouches[0];
          var dx = touch.clientX - touchStartX;
          var dy = touch.clientY - touchStartY;

          if (Math.abs(dx) < 44 || Math.abs(dx) < Math.abs(dy) * 1.5) return;

          show(current + (dx < 0 ? 1 : -1), true);
        },
        { passive: true }
      );
    }

    var resizeFrame;
    var replaceMarker = function () {
      window.cancelAnimationFrame(resizeFrame);
      resizeFrame = window.requestAnimationFrame(moveMarker);
    };

    window.addEventListener("resize", replaceMarker);

    // Tab widths change once Geist Mono arrives, so measure again after fonts
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(moveMarker);
    }

    show(0, false);
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
