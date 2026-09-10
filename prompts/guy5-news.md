# AI Prompt — Guy 5: News & Stories Section

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

## Your Assignment: News & Stories Section

**You own exactly these 3 files:**
1. `news.html` — The news & stories page markup
2. `css/pages/news.css` — All news page styles (ONLY this file for CSS)
3. `js/pages/news.js` — All news page JavaScript (ONLY this file for JS)

**Do NOT touch any other file.** Not `css/components.css`, not `css/base.css`, not `css/tokens.css`, not `js/nav.js`, not any other HTML file. If you think something is wrong with the shared files, flag it to the team leader — don't edit it yourself.

---

## Files You May READ (but never modify)

These are read-only shared foundations:
- `css/tokens.css` — All CSS variables (colors, spacing, font sizes, shadows, radii)
- `css/base.css` — Global reset, fluid typography, scroll reveal utility
- `css/components.css` — Sticky nav, footer, buttons, cards, modals, badges
- `js/nav.js` — Sticky header, mobile drawer, auth pill, toasts
- `js/firebase-config.js` — Firebase init (has auto mock fallback if no real credentials)
- `js/mock-data.js` — Contains `MOCK_DATA.stories` — 4 sample alumni stories
- `js/storage-service.js` — Unified async data layer (Firestore or localStorage)
- `js/auth.js` — Auth state management

---

## Current State of Your Page

`news.html` / `news.js` currently has:
- A **news feed** — approved story cards fetched from `mock-data.js` → `MOCK_DATA.stories`
- An **article reader modal** — clicking a story card opens a full-article reader in an overlay modal
- An **alumni story submission modal** — "Share Your Story" button opens a form (name, title, body text); submissions go into a moderation queue in localStorage / Firestore
- Category filtering (All, Alumni Spotlight, Career & Industry, Research, Community)

The current layout is functional but visually plain. Your job is to dramatically upgrade the visual quality into something editorial and distinctive.

---

## What the Current Data Looks Like

```js
// From mock-data.js MOCK_DATA.stories:
{
  id: 'story-1',
  title: 'From Campus to Unicorn: How I Built a $1B Climate Tech Startup',
  author: 'Elena Rostova',
  batch: "'12",
  category: 'Alumni Spotlight',
  summary: 'After finishing her PhD in biomedical engineering...',
  body: '...full article text...',
  status: 'approved',  // only 'approved' stories show in the feed
  submittedAt: '2026-04-12T10:00:00Z'
}
```

Keep this data structure and the existing render/filter/modal logic working if you refactor. Do not break the submission flow.

---

## Your Goal: Make It Beautiful

Transform `news.html` into the most editorial, magazine-quality page on the site. Think how alumni publications from Stanford, MIT, or The Economist present long-form content — curated, layered, typographically rich.

**Creative mandate:**
- Think completely outside the box. Alumni stories are the most human part of this website — they deserve a layout that honors that.
- It must NOT look AI-generated. No identical cards in a 3-column grid. No "Read More →" repeated 9 times.
- Light mode only. No dark backgrounds on the main feed (a dark pull-quote block or a dark hero for one featured article is fine if intentional).
- You are free to completely redesign the layout. The current structure is just a starting point.

**Specific ideas to consider (not mandatory — use your judgment):**
- A **magazine-style hero** — The top story gets a full-width editorial feature (large Newsreader heading, author name, category tag, abstract paragraph, styled differently from the rest)
- **Asymmetric article grid** — Mix of large feature cards and small sidebar items — like a newspaper front page, not a uniform grid
- **Category-specific visual treatments** — "Alumni Spotlight" stories might have a warm cream background; "Research" stories might have a navy stripe; "Career & Industry" a subtle gold border
- **Typographic pull-quotes** — Highlight a key line from the featured article in oversized, elegant type
- The **submission modal** should look like a real editorial submission portal — not a basic form

---

## Technical Rules

1. Run a local server to test: `npx serve .` in the project folder, then open `http://localhost:3000`
2. All CSS goes in `css/pages/news.css` — do not write `<style>` tags in the HTML
3. All JS goes in `js/pages/news.js` — do not write extra `<script>` tags
4. Use `var(--token-name)` for all CSS values — never hardcode colors or sizes
5. Keep the existing story data pipeline: `import { getDocuments } from '../storage-service.js'` and filter for `status === 'approved'` before rendering
6. Keep the "Share Your Story" submission flow working (saves to `storage-service.js`)
7. The nav and footer are controlled by `components.css` and `nav.js` — do not restyle them

---

## How to Run

```bash
# In the project folder (D:\Team-Apex-Alumni-Website)
npx serve .
# Open http://localhost:3000/news.html
```

Or use VS Code Live Server extension.

---

## Deliverables

When done, the team leader will review `news.html`, `css/pages/news.css`, and `js/pages/news.js` only. Do not commit or push changes to any other file.
