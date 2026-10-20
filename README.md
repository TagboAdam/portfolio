# Portfolio

Personal portfolio site for Adam — front-end developer and computer science
student. Built with **plain HTML, CSS and JavaScript**: no build step, no
dependencies, deploys as static files.

## Stack

| Layer | Choice |
| --- | --- |
| Markup | Semantic HTML5 |
| Styles | Hand-written CSS with custom-property design tokens |
| Behaviour | Vanilla ES5-compatible JS, loaded with `defer` |
| Fonts | Inter via Google Fonts, with a system-font fallback stack |
| Hosting | GitHub Pages (or any static host) |

## Structure

```
Portfolio/
├─ index.html          Page shell: header, hero, section frames, footer
├─ css/
│  ├─ reset.css        Minimal modern reset
│  ├─ tokens.css       Colour, type, space, motion tokens (+ dark values)
│  └─ style.css        Layout and components
├─ js/
│  └─ main.js          Mobile nav toggle, header scroll state
├─ assets/
│  ├─ img/             Portrait + project screenshots (Phase 4-5)
│  └─ resume.pdf       TODO — not committed yet
└─ README.md
```

## Local development

No install step. Either:

```powershell
# Option A — VS Code "Live Server" extension: right-click index.html → Open with Live Server

# Option B — one-off static server
npx serve .
```

Then open the printed `http://localhost:...` URL.

## Progress

- [x] Phase 1 — Scaffold, git, dev loop
- [x] Phase 2 — Reset, tokens, global styles
- [x] Phase 3 — Header, mobile nav, section frames, footer
- [ ] Phase 4 — Hero section (needs copy + portrait)
- [ ] Phase 5 — Projects grid + `js/projects.js` data
- [ ] Phase 6 — About + skills
- [ ] Phase 7 — Contact form / mailto CTA
- [ ] Phase 8 — Responsive + theme toggle + motion
- [ ] Phase 9 — Accessibility + SEO
- [ ] Phase 10 — Performance + QA
- [ ] Phase 11 — Deploy + documentation

## Placeholders to replace

| Where | Currently | Replace with |
| --- | --- | --- |
| `index.html` header + hero | Name "Adam", monogram "A" | Your full name / initials |
| Hero copy | "Available for internships", pitch sentence | Final positioning copy |
| `assets/resume.pdf` | File missing (links 404) | Your résumé PDF |
| Footer links | `github.com/your-username`, `linkedin.com/in/your-profile` | Real profiles |
| `<head>` | Title, description, inline SVG favicon | Final copy + `assets/favicon.svg` |
| Each section | Dashed "Phase N" panel | Real section content |

## Design tokens

All colour, spacing and type decisions live in `css/tokens.css`. Change
`--color-accent` there and the whole site re-themes. Dark values already exist
under `prefers-color-scheme` and `[data-theme]`; Phase 8 wires up the toggle.

## Deploying

```powershell
git add .
git commit -m "feat: page shell"
git branch -M main
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main
```

GitHub → **Settings → Pages → Source: Deploy from a branch → `main` / `/ (root)`**.
