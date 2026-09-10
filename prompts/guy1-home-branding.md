# AI Prompt — Guy 1: Home Page + College Branding

Paste this entire prompt into your AI assistant at the start of each session.

---

## Project Context

You are helping develop the **Apex University Alumni Website** — a real, production-bound university alumni platform. The live site is at **https://apexalumni.vercel.app/**. This is not a demo or a portfolio toy. It must look premium.

**Tech Stack:** Pure HTML, CSS, and Vanilla JavaScript (ES Modules). Absolutely no React, no Vue, no Tailwind, no Bootstrap, no npm packages, no build steps. Just `.html`, `.css`, and `.js` files.

**Design Identity:**
- Primary color: `#0B192C` (Collegiate Oxford Navy)
- Accent color: `#D4AF37` (Polished Heritage Gold)
- Background: `#F8FAFC` (Light Canvas — NO dark mode whatsoever)
- Heading font: **Newsreader** (Google Fonts, serif) — loaded in `css/base.css`
- UI font: **Plus Jakarta Sans** (Google Fonts, sans-serif)
- All sizes, colors, spacing use CSS custom properties from `css/tokens.css`

**The project has 6 developers.** Each person works in completely isolated files. You must NEVER touch any file outside the list below. There is no merge conflict tolerance — one wrong edit to a shared file breaks everyone else.

---

## Your Assignment: Home Page + College Branding

**You own exactly these 3 files:**
1. `index.html` — The home page markup
2. `css/pages/home.css` — All home page styles (ONLY this file for CSS)
3. `js/pages/home.js` — All home page JavaScript (ONLY this file for JS)

**Do NOT touch any other file.** Not `css/components.css`, not `css/base.css`, not `css/tokens.css`, not `js/nav.js`, not any other HTML file. If you think something is wrong with the shared files, flag it to the team leader — don't edit it yourself.

---

## Files You May READ (but never modify)

These are read-only shared foundations:
- `css/tokens.css` — All CSS variables (colors, spacing, font sizes, shadows, radii)
- `css/base.css` — Global reset, fluid typography, scroll reveal utility
- `css/components.css` — Sticky nav, footer, buttons, cards, modals, badges
- `js/nav.js` — Sticky header, mobile drawer, auth pill, toasts
- `js/firebase-config.js` — Firebase init (has auto mock fallback if no real credentials)
- `js/mock-data.js` — Dummy alumni data, stats, stories for demo mode
- `js/storage-service.js` — Unified async data layer (Firestore or localStorage)
- `js/auth.js` — Auth state management

---

## Current State of Your Page

`index.html` currently has these sections:
1. **Hero** — Full-viewport headline with two CTAs
2. **Stats Strip** — Animated counters (alumni count, countries, companies, giving)
3. **Spotlight** — Featured alumni profile card
4. **Featured Videos** — 2–3 video preview cards
5. **News Preview** — 3 latest news cards
6. **Giving Banner** — CTA for the donate page

The page is a functional foundation but visually basic. Your job is to dramatically upgrade the visual quality, layout, motion, and branding.

---

## Your Goal: Make It Beautiful

Transform `index.html` into the most visually stunning page on the site. Think 2026-era product website, not a university web template from 2015.

**Branding task:** The site currently uses `Ω` as a placeholder crest. This is fine to keep for now — but your job also includes making the entire header identity feel more premium and collegiate. Think about wordmark treatment, color contrast, and typographic personality.

**Creative mandate:**
- Think completely outside the box. What's the most memorable way to present an alumni website's home page?
- It must NOT look AI-generated or like a "vibe coded" template. No generic hero text on a gradient background. No 3-column card grids with identical heights. No stock-photo look-alike banners.
- Light mode only. No dark backgrounds except for intentional high-contrast accent sections (like a dark-navy pull-quote block), and only if it genuinely improves the design.
- You are free to completely restructure the layout of any section if you have a better idea. The current section themes are a starting point, not a constraint.
- Use CSS animations, custom clip-paths, layered typography, editorial photo-style placeholders (CSS-only) — anything that creates visual richness without an image dependency.

**Specific ideas to consider (not mandatory — use your judgment):**
- A hero with editorial stacked type and a subtle animated background texture (CSS only)
- Stats strip with oversized typographic numbers and animated count-up
- A spotlight section designed like a magazine feature — one prominent alumni, full-width editorial treatment
- A giving banner that feels more like an impact statement than a button row

---

## Technical Rules

1. Run a local server to test: `npx serve .` in the project folder, then open `http://localhost:3000`
2. All CSS goes in `css/pages/home.css` — do not write `<style>` tags in the HTML
3. All JS goes in `js/pages/home.js` — do not write `<script>` tags other than what's already in `index.html`
4. Use `var(--token-name)` for everything — never hardcode `#colors` or `px` sizes that already have tokens
5. Do not break the existing JS data flow in `home.js` — the stats counter and spotlight feed data from `mock-data.js` via `storage-service.js`. If you refactor, keep those IDs and data hooks working.
6. The nav and footer are controlled by `components.css` and `nav.js` — do not restyle them in `home.css`

---

## How to Run

```bash
# In the project folder (D:\Team-Apex-Alumni-Website)
npx serve .
# Open http://localhost:3000
```

Or use VS Code Live Server extension.

---

## Deliverables

When done, the team leader will review `index.html`, `css/pages/home.css`, and `js/pages/home.js` only. Do not commit or push changes to any other file.
