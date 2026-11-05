# Implementation handoff — portfolio

Short, operational notes for whoever (or whichever agent) touches this next.

## Files to read, in order

1. `DESIGN.md` — the nine-section visual contract.
2. `design/design-contract.md` — why the direction exists, the evidence tables.
3. `css/tokens.css` — the only place colours, type sizes, spacing and motion
   values may be declared.
4. `index.html` — section order, `data-od-id`s, copy.
5. `css/style.css` — components, grouped in ten numbered sections.
6. `js/main.js` — nav, header hairline, reveals, year.

## Hard constraints

- **No colour outside `css/tokens.css`.** No raw hex anywhere else in `css/`;
  derive variants with `color-mix()` or existing alpha tokens.
- **One accent (`--accent`), four uses max.** Availability dot, focus ring,
  project arrow hover, contact link underline. No fills, no headings.
- **One typeface.** Geist for everything; Geist Mono only for labels, captions,
  metadata and numerals. No serif, script or extra display face.
- **Black stays black.** `--bg` is `#000000`; do not lighten it with bloom,
  grain or overlays. The contact band is pure black with one hairline above.
- **The image is never boxed.** `assets/img/hero.jpg` sits at `max-width: 620px`,
  masked with the radial ellipse, mildly desaturated, with its caption row.
  Do not crop it (it is 475×473 and must keep its ratio).
- **No terminal references.** No prompts, cursors, fake windows, shell paths,
  green, typewriter effects, or character-splitting text animation.

## Asset rules

- Images are local and referenced relatively (`assets/img/...`), never hotlinked.
- Every `<img>` keeps intrinsic `width`/`height`; content images are not cropped.
- The still's credit line lives in the `figcaption`; keep it unless the asset is
  replaced with an original homage.
- Fonts: Geist + Geist Mono from Google Fonts, with the system stack fallback
  already bound in tokens. No additional webfonts.

## Responsive requirements

| Breakpoint | Behaviour |
| --- | --- |
| ≥ 981px | 7/5 hero, image right at up to 620px, six-column work rows |
| ≤ 980px | hero stacks (text, then image ≤ 560px), about stacks, contact stacks |
| ≤ 760px | work rows collapse to `index | title/year` with description and stack beneath |
| ≤ 640px | nav collapses to the 44×44 toggle + full-width panel; meta separators drop |
| ≤ 420px | image caps at `88vw`; caption stacks |

No horizontal scroll at any width, including 320px.

## Motion rules

Three interactions only: hero entrance (CSS), one-time section reveals
(IntersectionObserver), and hover states (CSS). Everything must be gated by
`prefers-reduced-motion: no-preference`, and the hidden state may only exist
behind `.js` so the page reads without JavaScript.

## Verification

```powershell
# preview
python -m http.server 8123
# structural + colour audit (contrast, raw hex, links, emoji, leftovers)
python design/check.py
```

The site is done when: `python design/check.py` prints `ALL CHECKS PASS`, the
page reads correctly at 390 / 768 / 1440 px, and the hero image dissolves into
the canvas rather than sitting on it.
