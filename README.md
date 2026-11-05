# Portfolio

Personal portfolio for Adam — an aspiring AI/software engineer. A dark,
terminal-flavoured one-pager built with **plain HTML, CSS and JavaScript**: no
build step, no dependencies, deploys as static files.

## Stack

| Layer | Choice |
| --- | --- |
| Markup | Semantic HTML5 |
| Styles | Hand-written CSS with custom-property design tokens |
| Behaviour | Vanilla ES5-compatible JS, loaded with `defer` |
| Fonts | Geist (body + headings) + Geist Mono (terminal chrome) via Google Fonts, with system fallbacks |
| Icons / images | Hand-authored SVG, no external image services |
| Hosting | GitHub Pages (or any static host) |

## Structure

```
Portfolio/
├─ index.html                 Single page: status bar, header, hero,
│                             projects, about/stack, footer
├─ css/
│  ├─ reset.css               Minimal modern reset
│  ├─ tokens.css              Colour, type, space, motion tokens (dark-only)
│  └─ style.css               Layout + components, mobile-first
├─ js/
│  ├─ main.js                 Mobile nav, header scroll state, hero file
│  │                          render, scroll reveal fallback, UTC clock,
│  │                          footer year
│  ├─ animations.js           GSAP layer: hero intro, #projects SplitText +
│  │                          ScrollTrigger sequence, reveals, card tilt,
│  │                          magnetic buttons, thumb parallax, progress rail
│  └─ vendor/                 Vendored gsap.min.js + ScrollTrigger.min.js
│                             (SplitText is CDN-only and optional)
├─ assets/
│  ├─ img/
│  │  ├─ project-remi.svg           Remi project thumbnail
│  │  └─ project-campusconnect.svg  CampusConnect project thumbnail
│  └─ resume.pdf              Resume PDF (real copy in place)
└─ README.md
```

## Design notes

- **Dark only by design.** `color-scheme: dark` is set in `tokens.css`; there is
  no light theme or theme toggle. Canvas `#0d1117`, accent `#39d353`, copy
  `#c9d1d9`, with electric blue / purple reserved for hover states.
- **Re-theme in one place.** Every colour, size and easing lives in
  `css/tokens.css`; change `--color-accent` and the whole site follows.
- **Terminal motif.** Status bar with a live UTC clock, macOS-style terminal
  windows, an `ls -l` directory listing above the project cards, `$` prompts and
  a blinking block cursor.
- **No-JS safe.** Reveal animations only hide content when `.js` is present, and
  the hero terminal's profile is authored line by line in the markup — the
  file-render effect only staggers those existing lines. `prefers-reduced-motion`
  disables the render, the reveal and the blinking cursor.
- **Typography.** Geist carries body copy and headings; Geist Mono is reserved
  for terminal chrome — status bar, nav links, hero role, terminal windows. The
  `#projects` heading is split into characters with GSAP SplitText (CDN-only) for
  a typing reveal; if that file never loads, the same beats fade whole elements.
- **Mobile nav** uses `inert` on the page behind the panel, closes on `Esc` and
  on link activation, and resets when the viewport grows past the breakpoint.

## Local development

No install step. Either:

```powershell
# Option A — VS Code "Live Server" extension: right-click index.html → Open with Live Server

# Option B — one-off static server
npx serve .
```

Then open the printed `http://localhost:...` URL. Opening `index.html` directly
from the filesystem also works.

## Content status

| Area | State |
| --- | --- |
| Hero, status bar, nav, footer | Done |
| Projects (Remi, CampusConnect) | Done — copy written, SVG thumbnails in place |
| About + tech-stack terminal + quote | Done |
| Scroll reveal, hero file render, live UTC clock | Done |
| Responsive pass (390px → 1440px) | Done — no horizontal overflow |
| `assets/resume.pdf` | Done — real PDF (76 KB) in place |
| LinkedIn footer link | **Placeholder** — `linkedin.com/in/` needs a real profile URL |
| Email address | `adam.tagbo@gmail.com` — confirm before publishing |
| `[ view source ]` links | Both point at the GitHub profile, not individual repos |

## Deploying

```powershell
git add .
git commit -m "feat: terminal portfolio"
git branch -M main
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main
```

GitHub → **Settings → Pages → Source: Deploy from a branch → `main` / `/ (root)`**.
