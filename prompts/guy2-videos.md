# AI Prompt — Guy 2: Video Section

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

## Your Assignment: Video Section

**You own exactly these 3 files:**
1. `videos.html` — The video gallery page markup
2. `css/pages/videos.css` — All video page styles (ONLY this file for CSS)
3. `js/pages/videos.js` — All video page JavaScript (ONLY this file for JS)

**Do NOT touch any other file.** Not `css/components.css`, not `css/base.css`, not `css/tokens.css`, not `js/nav.js`, not any other HTML file. If you think something is wrong with the shared files, flag it to the team leader — don't edit it yourself.

---

## Files You May READ (but never modify)

These are read-only shared foundations:
- `css/tokens.css` — All CSS variables (colors, spacing, font sizes, shadows, radii)
- `css/base.css` — Global reset, fluid typography, scroll reveal utility
- `css/components.css` — Sticky nav, footer, buttons, cards, modals, badges
- `js/nav.js` — Sticky header, mobile drawer, auth pill, toasts
- `js/firebase-config.js` — Firebase init (has auto mock fallback if no real credentials)
- `js/mock-data.js` — Dummy videos array for demo mode
- `js/storage-service.js` — Unified async data layer (Firestore or localStorage)
- `js/auth.js` — Auth state management

---

## Current State of Your Page

`videos.html` / `videos.js` currently has:
- A **category filter bar** (pill tabs: All, Alumni Spotlights, Panel Talks, Campus Life, etc.)
- A **video card grid** — YouTube lazy-loaded embed iframes in card containers
- A **theater mode modal** — clicking a card opens a centered overlay with the full YouTube embed
- Data sourced from `MOCK_DATA.videos` in `mock-data.js`

The current layout is a functional foundation but visually standard. Your job is to dramatically upgrade the layout, feel, and visual hierarchy.

---

## Your Goal: Make It Beautiful

Transform `videos.html` into the most visually compelling media gallery on the site. Think of how high-end media companies (Bloomberg, Vox, The Verge) present video content — editorial, curated, immersive.

**Creative mandate:**
- Think completely outside the box. What's the most memorable way to present a curated alumni video library?
- It must NOT look AI-generated or like a generic YouTube-style grid. No identical square thumbnails in a boring 3-column grid.
- Light mode only. A dark theater mode overlay for the modal is acceptable — but the main page must be on a light background.
- You are free to completely restructure the layout if you have a better idea. Ideas to consider (not mandatory):
  - A **featured video hero** at the top — one full-width editorial treatment for the "most watched" video
  - A **horizontal scroll carousel** for one category, vertical grid for another
  - **Category sections with editorial headers** rather than just a filter tab bar
  - A **hover reveal** on video cards that shows a title/description overlay on hover
  - A **custom video thumbnail placeholder** (CSS-only illustrated frame — no images needed)
  - The theater modal could be a full-screen takeover with a dark backdrop and animated entrance

---

## Technical Notes

- Videos are lazy-loaded: the `<iframe>` src is set only when the user clicks to play (prevents auto-loading 12 YouTube iframes)
- The current approach uses `data-video-id` attributes on cards and sets `iframe.src` on click
- The mock video data looks like: `{ id, title, category, videoId (YouTube ID), description, duration, views }`
- Category filter works by comparing `data.category` against the active pill

Keep this logic working if you refactor — don't break the lazy load or the modal.

---

## Technical Rules

1. Run a local server to test: `npx serve .` in the project folder, then open `http://localhost:3000`
2. All CSS goes in `css/pages/videos.css` — do not write `<style>` tags in the HTML
3. All JS goes in `js/pages/videos.js` — do not write extra `<script>` tags in the HTML
4. Use `var(--token-name)` for colors, spacing, sizes — never hardcode values
5. Do not break the existing data pipeline — videos come from `mock-data.js` via `storage-service.js`
6. The nav and footer are controlled by `components.css` and `nav.js` — do not restyle them

---

## How to Run

```bash
# In the project folder (D:\Team-Apex-Alumni-Website)
npx serve .
# Open http://localhost:3000/videos.html
```

Or use VS Code Live Server extension.

---

## Deliverables

When done, the team leader will review `videos.html`, `css/pages/videos.css`, and `js/pages/videos.js` only. Do not commit or push changes to any other file.
