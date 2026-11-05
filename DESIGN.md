# DESIGN.md — Adam's portfolio

> Visual contract for the portfolio. The nine headings below follow OpenDesign's
> design-system shape. Values are authoritative in `css/tokens.css`; this file
> explains intent, rules and the accent budget.

## 1. Visual Theme & Atmosphere

A quiet gallery on true black. The page should feel engineered rather than
decorated: precise type, a lot of air, hairline rules, one photograph that
dissolves into the background instead of sitting in a box.

- **Stance:** premium utilitarian minimalism — editorial restraint with a
  spec-sheet's worth of small, exact detail.
- **Signature:** a late-90s cyber-anime still (Serial Experiments Lain, 1998)
  feathered into the black on the right of the hero, lit by a silver bloom and
  held together by a 3.5% film grain.
- **Temperature:** cold. Silver, ink, black. No warm tint in the UI; the single
  image keeps a little of its own warmth so it reads as an object, not a swatch.
- **What it is not:** a terminal, a hacker theme, a SaaS landing page, a card
  grid, a template demo.

## 2. Color

Black is structural, not decorative. Three surfaces, five ink levels, one accent.

| Token | Value | Role | Rule |
| --- | --- | --- | --- |
| `--black` / `--bg` | `#000000` | page canvas, contact band | never tinted, never a gradient |
| `--surface` | `#0a0a0b` | raised plate (reserved) | only when an element must read as an object |
| `--surface-2` | `#131316` | hover / inset surface | rarely used |
| `--fg` | `#f4f5f7` | headings, primary text | 19.2:1 on black |
| `--fg-2` | `#c3c7cf` | body copy | 12.4:1 |
| `--muted` | `#9096a0` | descriptions, secondary | 7.1:1 |
| `--meta` | `#7d828b` | mono labels, captions | 5.4:1 |
| `--dim` | `#5b6069` | decorative arrow only | never text below 14px |
| `--border` | `rgba(255,255,255,.10)` | section rules | 1px, never thicker |
| `--border-soft` | `rgba(255,255,255,.06)` | row separators | must not compete |
| `--border-strong` | `rgba(255,255,255,.18)` | hover rules | hover only |
| `--accent` | `#cfe3ff` | cold signal | 16.1:1 |

**Accent budget (hard cap):**

1. the `:focus-visible` outline,
2. the icon inside a contact link button on hover,
3. the arrow inside a contact link button on hover,
4. the check icon after "copy email address" succeeds.

No accent fills, no accent backgrounds, no accent headings, no accent borders, no
decorative status dots. The bloom is neutral white plus a 5% cold tint, never
purple, never blue-violet.

## 3. Typography

One family, two cuts, hierarchy from size, weight and tracking.

- **Display + body:** Geist 400/500. **Mono:** Geist Mono 400/500, labels only.
- **Why not a serif display:** OpenDesign's default law asks for a serif display
  face; that law exists to avoid single-sans sameness. Here the user explicitly
  chose a neutral technical single-family system (and OpenDesign's own Vercel
  system binds display to Geist sans), so the deviation is deliberate. The
  hierarchy is carried by the display scale and the mono label layer instead.

| Role | Size | Weight | Tracking / leading |
| --- | --- | --- | --- |
| Hero `h1` | `clamp(2.6rem, 1.7rem + 4.4vw, 4.75rem)` | 500 | `-0.032em`, `1.02` |
| Contact `h2` | `clamp(1.75rem, 1.4rem + 1.6vw, 2.5rem)` | 500 | `-0.032em`, `1.08` |
| Project title (`h3`) | `clamp(1.75rem, 1.4rem + 1.6vw, 2.5rem)` | 500 | `-0.032em`, `1.05` |
| About heading | `19px` | 500 | `-0.015em`, `1.3` |
| Body | `16.5px` | 400 | `1.62`, max `44–56ch` |
| Project description | `15.5px` | 400 | `1.62`, max `46ch` |
| Fact value | `14px` | 400 | `1.6` |
| Mono label / caption / meta | `11–12.5px` | 400 | `0.06em`–`0.16em`, lowercase |

Casing: brand `adam` lowercase; labels lowercase; headings sentence case. No
script, no italic accent word, no all-caps headings, no terminal glyphs.

## 4. Spacing & Grid

- 4px base scale, `--space-1` … `--space-16`.
- Container `1180px`, gutter `clamp(20px, 4vw, 48px)`, section rhythm
  `clamp(72px, 10vh, 124px)`.
- Hero: `minmax(0,1fr) minmax(0,1.02fr)` with `clamp(32px, 5vw, 72px)` gap;
  text column capped at `40rem`.
- Work: project index on a hairline, then one project per screen in
  `0.92fr | 1.08fr` (words | screenshot) with `clamp(24px, 4.4vw, 64px)` gap.
  Slides are exactly one viewport wide; the track carries `-8px` inline margin
  and each slide `8px` padding so the focus ring survives the overflow clip.
- Facts: `72px | 1fr` label grid, hairline above every row.
- About: `1.15fr | 0.85fr`; meta rows on a `96px | 1fr` label grid.
- Section heads are always label-left / link-right over a single hairline.

## 5. Layout & Composition

Page order: hero → selected work → about + now → contact (black band) → footer.

- **Hero:** statement left, image right. The image is never boxed: no border, no
  radius card, no shadow. It is masked with a radial ellipse (36% solid →
  transparent at 74%) so all four edges dissolve, then a hairline caption row
  sits beneath it (`still — serial experiments lain, 1998` / `475 × 473`).
- **Work:** the one place that carries weight. A hairline index names all three
  projects in mono (`01 remi`, `02 campusconnect`, `03 this site`); below it a
  single project fills the screen with words left and a 16:10 plate right. The
  plate is the only framed object on the page: 1px `--border`, 8px radius,
  `--surface` behind the artwork.
- **Black anchors:** the contact band is pure black separated by one hairline;
  the hero bloom is the only light on the page.
- **Rhythm:** one hairline per block boundary, generous space, no repeated
  decorative rows. The page has one decisive flourish — the feathered image —
  and everything else stays quiet.
- **Stacking:** content `z-index: 1`, bloom `0`, grain `2`, header `50`, so the
  grain covers imagery and surfaces but never the sticky header.

## 6. Components

- **Icons:** Phosphor (MIT), inlined as an SVG symbol sprite: envelope, GitHub,
  file, arrow-up-right, copy, check, arrow-up. One family, one 16px size (12px
  for inline arrows), `fill: currentColor` so icons inherit state colour.
- **Header:** sticky, `color-mix(bg 78%, transparent)` + 12–14px backdrop blur,
  hairline appears only after 4px of scroll. Brand is mono `adam`.
- **Nav:** mono 11px, `0.16em` tracking, lowercase, `--fg-2` so it reads as
  links rather than fading out; hover moves to `--fg`. Mobile: 44×44 toggle,
  full-width panel under the header, `inert` on the page.
- **Eyebrow:** mono role line only, `0.16em` tracking. No status dot.
- **Project index:** three mono buttons on one hairline — `01 Remi`,
  `02 CampusConnect`, `03 This site`. Inactive `--meta`, active `--fg` with a
  `1px` marker that slides under it (measured in JS, never hard-coded). The
  whole index is a jump control, so no project is ever hidden behind the
  carousel.
- **Project slide:** mono kicker, `h3` title, two-sentence description, a
  three-row fact list (stack, role, year) on hairlines, and one small mono
  action link. Nothing is invented that is not a fact about the build.
- **Project plate:** 16:10 artwork, `1px --border`, `8px` radius, `--surface`
  behind it. Placeholders ship as local SVG mocks stamped `PLACEHOLDER /
  replace with a real screenshot`; swapping in a real capture means replacing
  the file and the `width`/`height` attributes (`design/check.py` compares the
  two).
- **Carousel controls:** hairline above, `01 / 03` counter left, two 40px
  bordered arrow buttons right. No dots, no autoplay, no drag bar.
- **Link button (`link-row`):** icon + label + arrow in a 1px bordered row.
  Rest: `--fg-2` on transparent. Hover: `--fg`, `--border-strong`, `--surface`
  fill, accent icon and arrow. This is the component that keeps the contact
  links from sinking into the black.
- **Copy-email (`copy-email`):** ghost button under the link stack; on success
  the copy icon swaps to a check, the label becomes `copied`, the button turns
  accent, and a `role="status"` region announces "Email address copied to
  clipboard" before resetting after 2s.
- **Meta list:** `dt` mono label / `dd` value, hairline above every row.
- **Now row:** label + comma-separated items, no pills, no boxes.
- **Contact:** `Connect with me` at `--text-3xl` against pure black, link stack
  right-aligned on desktop, stacked left on mobile.
- **Footer:** © line, GitHub and email icon links, back-to-top with arrow icon.
- **Focus:** 2px `--accent` outline, `3px` offset, visible on black.

## 7. Motion & Interaction

Four interactions, no loops, no scroll-jacking, no parallax, no autoplay.

1. **Hero entrance** — copy rises 12px over `520ms` with a 60–300ms stagger;
   the image fades in and settles from `scale(1.03)` over `900ms`.
2. **Section reveals** — one-time `IntersectionObserver` add of `.is-visible`,
   `opacity 0→1` + `12px` rise, `520ms`, never replayed.
3. **Carousel** — the track slides one viewport over `520ms` with
   `--ease-out`; the index marker travels and resizes over `220ms`. Driven by
   index buttons, the two arrows, a 44px horizontal swipe, or the arrow keys
   while focus is inside the controls. Off-screen slides are `inert` and,
   once the slide lands, `visibility: hidden`.
4. **Hover states** — border lightening (`220ms`), arrow nudge (`220ms`),
   focus ring instant.

`prefers-reduced-motion: reduce` removes all of it and shows final states.
Nothing is hidden without JS: the hidden state is scoped to `.js .reveal`, and
without JS the carousel index and controls disappear while the three projects
stack under hairline rules.

## 8. Voice & Brand

Plain, specific, first person, no adjectives doing the work of facts.

- Line one: a short claim about building tools that fix real annoyances.
- Lead: what the person actually builds, in the stack they actually use.
- Work slides: a kicker, one short sentence on what the thing does, then the
  stack actually used. No metrics invented, no outcome claims, no fake users.
- Descriptions name the mechanism ("reads the time out of the message") rather
  than the benefit ("saves you time").
- About: two short paragraphs, one of them concrete (final year, two projects).
- Contact: `Connect with me` and a real address, plus a one-click copy control.
- Labels stay lowercase mono; body copy uses normal punctuation and no em or en
  dashes anywhere on the page, and no emoji.

## 9. Anti-patterns

Never ship any of these:

- Terminal costume: status bars, `$` prompts, blinking cursors, fake windows,
  `usr@host:~$`, green-on-black, typewriter effects, SplitText character typing.
- Colour: neon/ purple gradients, accent-filled buttons or headings, more than
  one accent hue, coloured section backgrounds.
- Layout: project card grids with screenshots, floating wireframe collages,
  3D-tilted carousels, autoplaying or looping carousels, pagination dots, drag
  bars, auto-scrolling tickers, testimonial walls, newsletter forms, skill bars
  or percentages. The work section is one feature at a time, never nine cards.
- Content: "passionate", "seamless", "elevate", "10×", invented metrics,
  award claims, stock-photo portraits, emoji icons, lorem ipsum.
- Punctuation and chrome: em dashes or en dashes anywhere on the page, middot
  chains as separators, decorative status dots, section-numbering eyebrows.
- Type: serif/script accent words, all-caps display headings, more than one
  display face, negative tracking on body copy.
- Effects: heavy shadows, glassmorphism, pill-shaped cards, scroll hijacking,
  looping ambient animations over text.
