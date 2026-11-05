# Implementation handoff — portfolio

Short, operational notes for whoever (or whichever agent) touches this next.

## Files to read, in order

1. `DESIGN.md` — the nine-section visual contract.
2. `design/design-contract.md` — why the direction exists, the evidence tables.
3. `css/tokens.css` — the only place colours, type sizes, spacing and motion
   values may be declared.
4. `index.html` — section order, `data-od-id`s, copy.
5. `css/style.css` — components, grouped in ten numbered sections.
6. `js/main.js` — nav, header hairline, reveals, project carousel, copy email,
   year.

## Hard constraints

- **No colour outside `css/tokens.css`.** No raw hex anywhere else in `css/`;
  derive variants with `color-mix()` or existing alpha tokens.
- **One accent (`--accent`), four uses max.** Focus ring, contact link icon
  hover, contact link arrow hover, copy success icon. No fills, no headings, and
  nothing inside the project carousel.
- **One typeface.** Geist for everything; Geist Mono only for labels, captions,
  metadata and numerals. No serif, script or extra display face.
- **Black stays black.** `--bg` is `#000000`; do not lighten it with bloom,
  grain or overlays. The contact band is pure black with one hairline above.
- **The hero image is never boxed.** `assets/img/hero.jpg` sits at
  `max-width: 620px`, masked with the radial ellipse, mildly desaturated, with
  its caption row. Do not crop it (it is 475×473 and must keep its ratio). The
  project plates are the one exception that *is* framed, because they read as
  screenshots.
- **No terminal references.** No prompts, cursors, fake windows, shell paths,
  green, typewriter effects, or character-splitting text animation.
- **No em dashes or en dashes in page copy.** Use a period, comma, colon or a
  spaced hyphen. `design/check.py` fails the build if one appears.
- **Icons come from the inlined Phosphor sprite only.**
  `<svg class="icon"><use href="#i-..."/></svg>`; never hand-draw a glyph and
  never add an icon font. Available symbols are declared at the top of
  `index.html`; the sprite is validated by `design/check.py`.
- **The carousel never hides a project.** The mono index names all of them, the
  counter says where you are, there is no autoplay, and the arrow keys only act
  while focus is inside the controls. Anything that adds a project must add a
  tab, a `data-slide`, and an entry in `design/carousel-test.html`.

## Asset rules

- Images are local and referenced relatively (`assets/img/...`), never hotlinked.
- Every `<img>` keeps intrinsic `width`/`height`; content images are not cropped.
- Project plates live in `assets/img/work/` and are authored at 1600×1000. To
  swap a placeholder for a real capture: export at 16:10, drop the file in,
  update the `width`/`height` attributes, and `design/check.py` will confirm the
  markup and the file agree.
- The still's credit line lives in the `figcaption`; keep it unless the asset is
  replaced with an original homage.
- Fonts: Geist + Geist Mono from Google Fonts, with the system stack fallback
  already bound in tokens. No additional webfonts.

## Responsive requirements

| Breakpoint | Behaviour |
| --- | --- |
| ≥ 981px | 7/5 hero, image right at up to 620px, project in two columns (words left, plate right) |
| ≤ 980px | hero stacks (text, then image ≤ 560px), about stacks, contact stacks |
| ≤ 880px | project stacks with the plate first; project links stay 12.5px mono |
| ≤ 760px | index tabs drop to 11px, fact labels narrow to 64px |
| ≤ 640px | nav collapses to the 44×44 toggle + full-width panel; meta separators drop |
| ≤ 420px | image caps at `88vw`; caption stacks |

No horizontal scroll at any width, including 320px. The index scrolls on its own
axis if three names ever stop fitting.

## Motion rules

Four interactions only: hero entrance (CSS), one-time section reveals
(IntersectionObserver), the carousel slide (transform on the track, `520ms`),
and hover states (CSS). Everything must be gated by
`prefers-reduced-motion: no-preference` or cancelled under
`prefers-reduced-motion: reduce`, and the hidden state may only exist behind
`.js` so the page reads without JavaScript.

## Verification

```powershell
# preview
python -m http.server 8123
# structural + colour audit (contrast, raw hex, links, svg sizes, emoji, leftovers)
python design/check.py
# carousel behaviour: index, arrows, wrap, keyboard, marker, status region
msedge --headless=new --virtual-time-budget=8000 --dump-dom `
  http://127.0.0.1:8123/design/carousel-test.html
# layout: no-JS fallback, single-column reflow at 860 / 390 px, no overflow
msedge --headless=new --virtual-time-budget=8000 --dump-dom `
  http://127.0.0.1:8123/design/reflow-test.html
```

The site is done when: `python design/check.py` prints `ALL CHECKS PASS`, both
scripted tests print their `ALL ... TESTS PASS` line, the page reads correctly
at 390 / 768 / 1440 px, and the hero image dissolves into the canvas rather
than sitting on it.
