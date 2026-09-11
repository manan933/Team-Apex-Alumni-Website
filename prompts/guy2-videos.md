# AI Prompt — Guy 2: Video Section & Multimedia Archives

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

## Your Assignment: Video Showcase & Theater Player

**You own exactly these 3 files:**
1. `videos.html` — The video archive page markup
2. `css/pages/videos.css` — All video page styles (ONLY this file for CSS)
3. `js/pages/videos.js` — All video page JavaScript (ONLY this file for JS)

**Do NOT touch any other file.** Not `css/components.css`, not `css/base.css`, not `css/tokens.css`, not `js/nav.js`, not any other HTML file.

---

## Files You May READ (Shared Foundations — Never Edit):
- `css/tokens.css` — Design tokens
- `css/base.css` — Global typography and utility classes
- `css/components.css` — Header, mobile drawer, buttons, modal overlays, footer
- `js/nav.js` — Global nav controller, toast notifications
- `js/storage-service.js` — `getVideos(category)` API
- `js/mock-data.js` — `INITIAL_VIDEOS` schema (`{ id, title, youtubeId, description, category, addedAt }`)

---

## Critical DOM Element IDs (Must Be Preserved in videos.html):
- Header & Nav: `#nav-auth-container`, `#mobile-auth-container`, `.mobile-toggle`
- Video Controls:
  - `video-category-pills` — Filter pills container (`All`, `Reunions`, `Keynotes & Interviews`, `Campus Life`)
  - `videos-grid` — Target container for video thumbnail cards
- Theater Modal Player:
  - `theater-modal` — Modal overlay (`.modal-overlay.open`)
  - `theater-iframe` — YouTube embed iframe (`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`)
  - `theater-video-title` — Video title display
  - `theater-video-desc` — Video description display
  - `close-theater-modal` — Modal close trigger

---

## Your Mission & Enhancement Goals:
1. **Interactive Category Filtering:** Smooth real-time filtering between Reunion galas, academic keynotes, and campus tour features.
2. **Theater Modal Mode:** Make the video modal feel like an auditorium theater view — black background, high-definition embed, clean typography details below the player.
3. **Card Polish:** Use 16:9 aspect-ratio covers with YouTube thumbnail fallbacks (`https://img.youtube.com/vi/${v.youtubeId}/hqdefault.jpg`), gold play icon badges with scale on hover, and category pills.
4. **Search / Duration Tagging:** Optionally add duration indicators (e.g. "14 min", "45 min") or an interactive search bar within your files.
