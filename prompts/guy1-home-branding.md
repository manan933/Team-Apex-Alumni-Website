# AI Prompt — Guy 1: Home Page + College Branding

Paste this entire prompt into your AI assistant at the start of each session.

---

## Project Context

You are helping develop the **Apex University Alumni Website** — a prestigious, production-bound university alumni platform. The live deployment is at **https://apexalumni.vercel.app/**. This is not a toy or template demo. It must look like an elite institutional product — confident typography, editorial polish, intentional whitespace.

**Tech Stack:** Pure HTML, CSS, and Vanilla JavaScript (ES Modules). Absolutely no React, no Tailwind, no Bootstrap, no npm packages, no build steps. Just clean `.html`, `.css`, and `.js` files running natively in modern browsers.

**Design System Tokens (`css/tokens.css`):**
- Primary Color: `#0B192C` (Deep Collegiate Oxford Navy)
- Accent Color: `#D4AF37` (Polished Heritage Gold)
- Canvas Background: `#F8FAFC`
- Warm Editorial Surface: `#FAF8F4` (`--color-cream`)
- Warm Divider: `#E8E1D9` (`--color-border-warm`)
- Heading Font: **Newsreader** (Google Fonts, serif) — loaded in `css/base.css`
- UI Font: **Plus Jakarta Sans** (Google Fonts, sans-serif)
- Strict Rule: **Light mode only** — warm, prestigious, academic. NO dark mode.
- Strict Rule: **No AI-slop anti-patterns** — NO excessive glassmorphism, NO neon glow borders, NO meaningless floating gradient blobs, NO generic SaaS dashboard cards.

**The project has 6 developers.** Each person works in strictly isolated files. You must NEVER touch any file outside your assigned list.

---

## Your Assignment: Home Page + College Branding

**You own exactly these 3 files:**
1. `index.html` — The home page markup
2. `css/pages/home.css` — All home page styles (ONLY this file for CSS)
3. `js/pages/home.js` — All home page JavaScript (ONLY this file for JS)

**Do NOT touch any other file.** Not `css/components.css`, not `css/base.css`, not `css/tokens.css`, not `js/nav.js`, not any other page HTML.

---

## Files You May READ (Shared Foundations — Never Edit):
- `css/tokens.css` — All CSS variables (`--color-primary`, `--color-accent`, `--color-cream`, `--space-*`, `--radius-*`, etc.)
- `css/base.css` — Global reset, typography scale, `.reveal` scroll animations
- `css/components.css` — Nav header, mobile drawer, buttons, badges, footer
- `js/nav.js` — Sticky header, mobile drawer, auth dropdown, toasts
- `js/firebase-config.js` — Firebase init (with auto localStorage mock fallback)
- `js/mock-data.js` — Data schemas: `INITIAL_STATS`, `INITIAL_ALUMNI`, `INITIAL_SUBMISSIONS`, `INITIAL_VIDEOS`
- `js/storage-service.js` — Unified async data layer (`getAlumni`, `getSubmissions`, `getVideos`, `getStats`)
- `js/auth.js` — Auth state management

---

## Critical DOM Element IDs (Must Be Preserved in index.html):
- Header & Nav: `#nav-auth-container`, `#mobile-auth-container`, `.mobile-toggle`
- Stats Counters: `stat-total-alumni`, `stat-countries`, `stat-chapters`, `stat-years`
- Dynamic Sections:
  - `spotlight-container` — Featured alumni profile card (populated by `home.js`)
  - `alumni-mosaic` — 6-alumni editorial mosaic grid (populated by `home.js`)
  - `home-stories-grid` — Latest stories lead + sidebar (populated by `home.js`)
  - `home-videos-grid` — Featured video preview layout (populated by `home.js`)

---

## Your Mission & Enhancement Goals:
1. **Editorial Masthead Hero:** Elevate the hero with authentic academic crest details, confident editorial typography, and university mission statements.
2. **Featured Alumni Spotlight:** Make the spotlight card feel like a profile in The New Yorker or MIT Technology Review.
3. **Alumni Mosaic:** Ensure the 6 varied alumni showcase real global diversity (founders, researchers, artists, public servants).
4. **Branding Details:** Add subtle collegiate motifs, refined typographic dividers (`divider-gold`), and campus history notes.
5. **Responsiveness:** Test on mobile (375px), tablet (768px), and desktop (1200px+). All grids must collapse cleanly.
