# AI Prompt — Guy 5: Alumni News, Gazette & Stories

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
- Heading Font: **Newsreader** (Google Fonts, serif)
- UI Font: **Plus Jakarta Sans** (Google Fonts, sans-serif)
- Strict Rule: **Light mode only** — warm, prestigious, academic. NO dark mode.
- Strict Rule: **No AI-slop anti-patterns** — NO excessive glassmorphism, NO neon glow borders, NO generic SaaS dashboard cards.

---

## Your Assignment: Editorial Gazette & Story Submission Engine

**You own exactly these 3 files:**
1. `news.html` — The alumni news and gazette page markup
2. `css/pages/news.css` — All news styles (ONLY this file for CSS)
3. `js/pages/news.js` — All news JavaScript (ONLY this file for JS)

**Do NOT touch any other file.** Not `css/components.css`, not `css/base.css`, not `css/tokens.css`, not `js/nav.js`, not any other HTML file.

---

## Files You May READ (Shared Foundations — Never Edit):
- `css/tokens.css` — Design tokens
- `css/base.css` — Typography scale and resets
- `css/components.css` — Nav header, mobile drawer, buttons, form controls, modals, footer
- `js/nav.js` — Toast notification system (`showToast(msg, type)`)
- `js/auth.js` — `getCurrentUser()`, `onAuthStateChange(cb)`
- `js/storage-service.js` — `getSubmissions('approved')`, `createSubmission(data)`
- `js/mock-data.js` — `INITIAL_SUBMISSIONS` schema

---

## Critical DOM Element IDs (Must Be Preserved in news.html):
- Header & Nav: `#nav-auth-container`, `#mobile-auth-container`, `.mobile-toggle`
- News Toolbar & Grid:
  - `news-category-filters` — Container for category pills (`All`, `Story`, `Achievement`, `News`)
  - `share-story-btn` — Button to open story submission modal (checks auth status)
  - `news-grid` — Target container for published story cards
- Full-Article Reader Modal:
  - `reader-modal` — Modal overlay
  - `reader-modal-body` — Target for article cover image, title, date, author, and full body text
  - `close-reader-modal` — Close button
- Story Submission Modal:
  - `submit-story-modal` — Modal overlay
  - `close-submit-modal` — Close button
  - `story-submission-form` — Submission form
  - Form inputs: `#story-title`, `#story-category`, `#story-excerpt`, `#story-image`, `#story-body`

---

## Your Mission & Enhancement Goals:
1. **Editorial Magazine Presentation:** Elevate the story grid into a journalistic magazine feed (lead feature story, pull quotes, rich bylines).
2. **Article Reader Experience:** Enhance the `#reader-modal` so it reads like an academic journal or The Atlantic article — elegant serif typography, generous line-height, beautiful drop-caps or image captions.
3. **Seamless Story Submission:** Keep the auth-guarded submission flow working flawlessly — unauthenticated users are directed to login, authenticated users submit stories that enter the moderation queue (`status: 'pending'`).
4. **Category Filtering:** Smooth switching between Career Milestones, Alumni Narratives, and Campus News.
