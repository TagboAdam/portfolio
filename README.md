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
  black is structural — canvas, contact band, image vignette.
- **Geist only.** Geist Mono is demoted to small labels, captions and metadata.
  No serif, no script, no terminal glyphs.
- **One cold accent** (`#cfe3ff`), capped at four uses on the whole page.
- **One flourish:** the Lain still, feathered into the black on the right of the
  hero — never boxed, never cropped.
- **Spec-sheet detail:** mono labels, hairline rules, indexed work rows.
- **Three interactions:** hero entrance, one-time section reveals, hover states.
  All gated by `prefers-reduced-motion`.

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
├─ index.html                 One page: header, hero, work, about/now, contact, footer
├─ DESIGN.md                  Visual contract
├─ design/
│  ├─ design-contract.md      Decision record
│  ├─ implementation-handoff.md
│  └─ check.py                Automated audit (structure, links, contrast, leftovers)
├─ css/
│  ├─ reset.css               Minimal modern reset
│  ├─ tokens.css              Colour, type, space, motion — the single contract
│  └─ style.css               Layout + components (ten numbered sections)
├─ js/
│  └─ main.js                 Nav, header hairline, reveals, footer year
├─ assets/
│  ├─ img/hero.jpg            Hero still (Serial Experiments Lain, 1998)
│  ├─ img/project-*.svg       Previous project thumbnails — no longer referenced
│  └─ resume.pdf              Resume PDF
├─ specimens/                 A/B hero specimens from the design round — safe to delete
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
sizes, raw hex outside `:root`, terminal-era leftovers, emoji, and the WCAG
contrast of every text token. Exit code 0 means everything passed.

## Content status

| Area | State |
| --- | --- |
| Hero headline | **Placeholder** — Adam is writing his own line; marked in `index.html` |
| Hero image | Real asset, credited in the caption, personal non-commercial use |
| Work rows (Remi, CampusConnect) | Copy written; links point at the GitHub profile |
| About + watching row | Done (`silicon valley`, `black clover`) |
| Contact | `adamtagbo.berlin@gmail.com` |
| LinkedIn | Hidden — no real profile URL yet |
| Resume | Real PDF in `assets/resume.pdf` |
| Retired | `js/animations.js` and `js/vendor/` (previous GSAP layer) are no longer loaded and can be deleted |
| Unused assets | `assets/img/project-*.svg` are not referenced any more |

## Deploying

```powershell
git add .
git commit -m "feat: black silver portfolio"
git push
```

GitHub → **Settings → Pages → Source: Deploy from a branch → `main` / `/ (root)`**.
