# Portfolio

Personal portfolio for **Adam** — a junior AI/software engineer. A quiet,
one-page dark portfolio built with **plain HTML, CSS and JavaScript**: no build
step, no dependencies, deploys as static files.

## Design

The visual system lives in three documents:

| File | Purpose |
| --- | --- |
| [DESIGN.md](DESIGN.md) | The nine-section visual contract (theme, colour, type, grid, layout, components, motion, voice, anti-patterns) |
| [design/design-contract.md](design/design-contract.md) | Why this direction exists: evidence, keep/change/do-not-copy, risks, quality gate |
| [design/implementation-handoff.md](design/implementation-handoff.md) | Operational constraints for the next person or agent touching the page |

The short version:

- **True black canvas** (`#000000`) with a silver bloom and 3.5% film grain;
  black is structural: canvas, contact band, image vignette.
- **Geist only.** Geist Mono is demoted to small labels, captions and metadata.
  No serif, no script, no terminal glyphs, no em dashes.
- **One cold accent** (`#cfe3ff`), capped at four uses on the whole page.
- **One flourish:** the Lain still, feathered into the black on the right of the
  hero. Never boxed, never cropped.
- **Work gets the weight:** a hairline index names all three projects, then one
  project fills the screen with words left and a 16:10 plate right. Index
  buttons, arrows, swipe and arrow keys move it; no autoplay, no dots.
- **Spec-sheet detail:** mono labels, hairline rules, numbered projects, a
  stack/role/year fact list.
- **Components:** Phosphor icon sprite (MIT), bordered icon link rows, a
  one-click "copy email" control with success state, and a project carousel.
- **Four interactions:** hero entrance, one-time section reveals, the carousel
  slide, hover states. All gated by `prefers-reduced-motion`.

## Stack

| Layer | Choice |
| --- | --- |
| Markup | Semantic HTML5, one `data-od-id` per section |
| Styles | Hand-written CSS with custom-property design tokens |
| Behaviour | Vanilla ES5-compatible JS, `defer`, no dependencies |
| Fonts | Geist + Geist Mono via Google Fonts, system fallbacks |
| Images | Local SVG/JPG only, no remote images |
| Hosting | GitHub Pages (or any static host) |

## Structure

```
Portfolio/
├─ index.html                 One page: header, hero, work carousel, about/now, contact, footer
├─ DESIGN.md                  Visual contract
├─ design/
│  ├─ design-contract.md      Decision record
│  ├─ implementation-handoff.md
│  ├─ check.py                Automated audit (structure, links, contrast, leftovers)
│  ├─ carousel-test.html      Scripted interaction test for the work carousel
│  └─ reflow-test.html        Scripted layout test (no-JS fallback, 860 / 390 px)
├─ css/
│  ├─ reset.css               Minimal modern reset
│  ├─ tokens.css              Colour, type, space, motion — the single contract
│  └─ style.css               Layout + components (ten numbered sections)
├─ js/
│  └─ main.js                 Nav, header hairline, reveals, carousel, copy email, year
├─ assets/
│  ├─ img/hero.jpg            Hero still (Serial Experiments Lain, 1998)
│  ├─ img/work/remi.svg       Project plate placeholders (16:10, swap for real captures)
│  ├─ img/work/campusconnect.svg
│  ├─ img/work/this-site.svg
│  └─ resume.pdf              Resume PDF
└─ README.md
```

## Local development

No install step. Either:

```powershell
# Option A — VS Code "Live Server": right-click index.html → Open with Live Server

# Option B — one-off static server
python -m http.server 8123
```

Then open the printed URL. Opening `index.html` directly from the filesystem
also works.

Run the audit at any time:

```powershell
python design/check.py
```

It checks HTML nesting and IDs, local links and assets, image `alt`/intrinsic
sizes (including that each SVG plate declares the same size as its `<img>`),
carousel wiring (one tab per slide, a status region), raw hex outside `:root`,
terminal-era leftovers, emoji, and the WCAG contrast of every text token. Exit
code 0 means everything passed.

The carousel has its own scripted tests, which drive the real page in iframes:

```powershell
# index, arrows, wrap-around, keyboard, marker, status region
msedge --headless=new --virtual-time-budget=8000 --dump-dom `
  http://127.0.0.1:8123/design/carousel-test.html

# no-JS fallback, single-column reflow at 860 / 390 px, no horizontal scroll
msedge --headless=new --virtual-time-budget=8000 --dump-dom `
  http://127.0.0.1:8123/design/reflow-test.html
```

The `<pre id="out">` block in each dumped HTML lists every assertion, and ends
with `ALL CAROUSEL TESTS PASS` / `ALL REFLOW TESTS PASS` when everything
behaves.

## Content status

| Area | State |
| --- | --- |
| Hero headline | Done: "I like to make things visually appealing" |
| Hero image | Real asset, credited in the caption, personal non-commercial use |
| Work carousel | Three projects (Remi, CampusConnect, This site) with description, stack, role and year. Copy is written but should be confirmed; links point at the GitHub profile |
| Project screenshots | Placeholders: `assets/img/work/*.svg` are designed 16:10 mock-ups stamped "placeholder". Swap the files (and the `width`/`height` attributes) for real captures |
| About + watching row | Done (`silicon valley`, `black clover`) |
| Contact | "Connect with me", icon link rows, one-click copy of `adamtagbo.berlin@gmail.com` |
| Icons | Phosphor regular set (MIT), inlined as an SVG sprite, no remote icon requests |
| LinkedIn | Hidden: no real profile URL yet |
| Resume | Real PDF in `assets/resume.pdf` |
| Removed | The retired GSAP layer (`js/animations.js`, `js/vendor/`), the terminal-era `assets/img/project-*.svg` plates, and the design-round `specimens/` folder are gone from the working tree |

## Deploying

```powershell
git add .
git commit -m "feat: black silver portfolio"
git push
```

GitHub → **Settings → Pages → Source: Deploy from a branch → `main` / `/ (root)`**.
