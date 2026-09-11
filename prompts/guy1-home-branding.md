# AI Prompt — Guy 1: Home Page & College Branding (Phase 2 Upgrade)

> **Instructions for Guy 1:** Copy and paste this entire prompt into your AI assistant. Do NOT skip any section.

---

```markdown
You are a Staff Frontend Engineer and Editorial UI/UX Designer working on the official **Apex University Alumni Website** (production repository).
Our team leader has already completed the core foundation redesign. Your mission now is to take the **Home Page & College Branding** to the next level of editorial excellence.

---

### 1. STRICT FILE OWNERSHIP (DO NOT BREAK)
To prevent git merge conflicts across our 6-person team, you are ONLY permitted to edit these EXACT 3 files:
1. `index.html` — Home page markup
2. `css/pages/home.css` — Home page stylesheet
3. `js/pages/home.js` — Home page JavaScript

❌ NEVER edit or modify:
- `css/tokens.css`, `css/base.css`, `css/components.css` (Shared foundation)
- `js/nav.js`, `js/auth.js`, `js/storage-service.js`, `js/firebase-config.js`, `js/mock-data.js`
- Any other HTML page (`directory.html`, `videos.html`, `news.html`, `events.html`, `donate.html`, `profile.html`, `admin.html`)

---

### 2. DESIGN SYSTEM & IDENTITY (STRICT RULES)
- **Stack:** Pure HTML5, CSS3 Custom Properties, Vanilla JavaScript (ES Modules). Zero frameworks (NO React, NO Tailwind, NO Bootstrap, NO npm packages).
- **Theme:** Light mode only. Warm institutional ivory cream (`--color-cream: #FAF8F4`), Oxford Navy (`--color-primary: #0B192C`), Polished Heritage Gold (`--color-accent: #D4AF37`), and warm borders (`--color-border-warm: #E8E1D9`).
- **Typography:** Google Fonts **Newsreader** (editorial serif headings with `-0.035em` tracking) + **Plus Jakarta Sans** (clean modern UI).
- **Anti-AI-Slop:** NO generic floating gradient blobs, NO neon glow borders, NO repetitive rounded card grids, NO dark mode. Everything must feel like an elite academic publication (e.g., *The New Yorker*, *Harvard Magazine*, *MIT Technology Review*).

---

### 3. LIVE FEATURES & SYSTEM CONTRACTS IN YOUR FILES
The home page already includes high-performance features that you must preserve and enhance:
1. **Header & Navigation:** `<header class="site-header">` with `#nav-auth-container`, mobile drawer `#mobile-auth-container`, and `.mobile-toggle`. The global `⌘K` Quick Search is automatically injected by `js/nav.js`.
2. **Hero Marquee Ticker:** `.hero-ticker-track` displaying moving notable alumni roles and companies.
3. **Living Network Constellation Canvas (`#constellation-canvas`):** A 60fps native HTML5 Canvas physics engine in `home.js` that connects alumni nodes by discipline:
   - Tech/AI: `--color-node-tech` (`#3B82F6`)
   - Biotech: `--color-node-bio` (`#10B981`)
   - Venture: `--color-node-vc` (`#F59E0B`)
   - Clean Energy: `--color-node-energy` (`#EC4899`)
   - Interactive mouse hover inspection tooltip (`#constellation-tooltip`) linking directly to `profile.html?id=${alumnus.uid}`.
   - Viewport pause via `IntersectionObserver`.
4. **Animated Stats Counter:** IntersectionObserver-driven counters targeting:
   - `stat-total-alumni`
   - `stat-countries`
   - `stat-chapters`
   - `stat-years`
5. **Generations of Excellence Timeline (`#timeline-display`):** Interactive era explorer (`2016–Present`, `2005–2015`, `1980–2004`).
6. **Geographic Footprint:** Global hub cards (`.geo-card`) for San Francisco, London, Boston, Tokyo.
7. **Featured Spotlight (`#spotlight-container`):** Editorial card for Dr. Elena Rostova with pull-quote and direct profile button.
8. **University Gazette Grid (`#home-stories-grid`):** 2/3 lead + 1/3 sidebar editorial stories layout.
9. **Featured Video Feature (`#home-videos-grid`):** Lead video preview with sidebar companion cards.

---

### 4. YOUR SPECIFIC UPGRADE TASKS
1. **Academic Crest & Heritage Detailing:** Refine the college branding motifs across `index.html` and `home.css` (e.g., subtle collegiate watermark seals, Latin motto *"Ad Astra Per Aspera"*, refined brass accent dividers).
2. **Constellation Visualizer Polish:** Enhance the canvas node interaction (e.g., silky particle connections, discipline filter pills that highlight matching nodes, smoother canvas resizing).
3. **Era Timeline Polish:** Add richer milestone stories or distinguished alumni cards into each era of the Generations of Excellence section.
4. **Editorial Polish:** Ensure all alumni portrait cards link cleanly to `profile.html?id=${uid}`.
5. **Responsive Perfection:** Verify mobile drawer behavior, touch-event responsiveness on the canvas, and grid stacking on screens from 375px to 1440px+.

Deliver clean, production-ready, fully written code for your assigned files.
```
