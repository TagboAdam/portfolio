# Design contract — portfolio redesign ("quiet silver on black")

## Goal and target artifact

Turn a terminal-themed student portfolio into a quiet, spec-sheet-detailed dark
portfolio that reads as personal and engineered. Target: the existing one-page
static site (`index.html` + `css/` + `js/main.js`), no build step, deployed on
GitHub Pages.

## Evidence

| Evidence | Confidence | What it told us |
| --- | --- | --- |
| User answers across five Q&A rounds | provided | quiet minimal type, Geist only, dark only, true black, silver bloom, grain, one cold accent, one page, peers audience, cut copy hard, no terminal theatrics |
| Current site (terminal hero, green accent, fake windows) | observed | what to remove: all shell chrome, typing effects, `$` prompts, status bar, 64 KB of GSAP choreography |
| `assets/img/hero.jpg` (Serial Experiments Lain still, 475×473) | provided | the emotional centre: character, 90s texture, isolation; must be feathered, not boxed |
| Maya Chen portfolio reference (pasted by user) | provided | liked *structure* only: label → heading → content rhythm, hairline rules, scale contrast; explicitly not to be copied 1:1 |
| OpenDesign `linear-app` design system tokens | observed | near-black canvas, luminance-stepped surfaces, silver body text, `rgba(255,255,255,.08)` hairlines, tight display tracking |
| OpenDesign `web-prototype` P0 checklist | observed | quality gate: no raw hex outside `:root`, accent ≤2 per screen, no emoji, no invented metrics, no remote images, `data-od-id`, 920px reflow |

## Keep / change / do not copy

| Keep | Change | Do not copy |
| --- | --- | --- |
| True black canvas + silver ink | green terminal palette → silvers + one cold accent | the literal Maya Chen layout or spacing |
| Geist for display and body | terminal chrome, status bar, cursors, prompts → gone | orange accent, gradient CTAs, emoji icons |
| Spec-sheet detail (mono labels, hairline rows, indexes) | project cards with thumbnails → metadata rows | testimonial walls, star ratings, newsletter form |
| Quiet minimal composition, generous air | copy cut to ~40% of the original volume | "award-winning", "7+ years", impact metrics |
| The Lain image as the one flourish | boxed image → radial-masked image dissolving into black | the image used as a full-bleed background |
| One-page structure | GSAP/SplitText/ScrollTrigger layer retired (CSS + IntersectionObserver) | 3D carousel, auto tickers, floating wireframes |

## Final stance

A black gallery page where type does the talking: one display line, one
feathered frame, hairline-ruled work rows, and a mono label layer that makes the
page feel measured rather than designed. Motion exists only to let the page
arrive, and the single cold accent is rationed to four moments.

## Risks and unknowns

- **Headline is a placeholder** until Adam writes his own line; it is marked in
  the HTML and tracked in the README content table.
- **LinkedIn** is hidden rather than shipped as a dead `/in/` link.
- **Hero image resolution** is 475×473 and cannot be increased locally; slight
  softness is accepted at 620px CSS width.
- **Copyright**: the Lain still is a personal, non-commercial use, credited in
  the caption; if that is not acceptable it must be swapped for an original
  homage.
- **`mask-image` support**: modern evergreen browsers only; older engines see an
  unmasked image rather than a broken layout.
- **No browser automation** in this environment, so final visual sign-off is the
  user's eyes on the local preview; automated checks cover structure, contrast,
  links and forbidden patterns.

## Quality gate

- [x] No raw hex outside `:root` (checked).
- [x] Body/meta contrast ≥ 4.5:1; accent ≥ 4.5:1 (checked: 5.44–19.25).
- [x] Accent used only for focus ring, link-row hover icon/arrow, copy success.
- [x] No emoji, no em or en dashes in page copy, no terminal leftovers, no
      remote scripts (checked).
- [x] Icon sprite integrity: every `<use href="#id">` resolves to a symbol
      (checked).
- [x] Every section has `data-od-id` and a resolving `aria-labelledby`.
- [x] Every local link and asset resolves; images carry `alt` and intrinsics.
- [x] One `h1`; heading order intact.
- [x] Reduced motion and no-JS paths keep all content visible.
- [x] Mobile reflow defined at 980 / 760 / 640 / 420 px.
