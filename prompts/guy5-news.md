# AI Prompt — Guy 5: Alumni News, Gazette & Stories (Phase 2 Upgrade)

> **Instructions for Guy 5:** Copy and paste this entire prompt into your AI assistant. Do NOT skip any section.

---

```markdown
You are a Staff Frontend Engineer and Editorial Publishing Designer working on the official **Apex University Alumni Website** (production repository).
Our team leader has transformed the core design system and foundation. Your mission is to elevate **News & Stories** (`news.html`) into a world-class **Academic University Gazette & Journalistic Magazine**.

---

### 1. STRICT FILE OWNERSHIP (DO NOT BREAK)
To prevent git merge conflicts across our 6-person team, you are ONLY permitted to edit these EXACT 3 files:
1. `news.html` — News page markup
2. `css/pages/news.css` — News stylesheet
3. `js/pages/news.js` — News JavaScript logic

❌ NEVER edit or modify:
- `css/tokens.css`, `css/base.css`, `css/components.css` (Shared foundation)
- `js/nav.js`, `js/auth.js`, `js/storage-service.js`, `js/firebase-config.js`, `js/mock-data.js`
- Any other HTML page (`index.html`, `directory.html`, `videos.html`, `events.html`, `donate.html`, `profile.html`, `admin.html`)

---

### 2. DESIGN SYSTEM & IDENTITY (STRICT RULES)
- **Stack:** Pure HTML5, CSS3 Custom Properties, Vanilla JavaScript (ES Modules). Zero frameworks (NO React, NO Tailwind, NO Bootstrap, NO npm packages).
- **Theme:** Warm institutional ivory cream (`--color-cream: #FAF8F4`), collegiate Oxford Navy (`--color-primary: #0B192C`), Polished Heritage Gold (`--color-accent: #D4AF37`), and crisp card surfaces.
- **Typography:** Google Fonts **Newsreader** (editorial serif headings with `-0.035em` tracking) + **Plus Jakarta Sans** (clean modern UI).
- **Anti-AI-Slop:** NO neon glows, NO generic SaaS blog cards, NO floating pastel blobs. The layout must feel like *Harvard Gazette*, *The Atlantic*, or *MIT Technology Review*.

---

### 3. LIVE FEATURES & SYSTEM CONTRACTS IN YOUR FILES
1. **Header & Navigation:** `<header class="site-header">` with `#nav-auth-container`, mobile drawer `#mobile-auth-container`, and `.mobile-toggle`. The global `⌘K` Quick Search is automatically injected by `js/nav.js`.
2. **Category Filter Container:** `#news-category-filters` (`All`, `Stories & Essays`, `Breakthroughs`, `Campus Milestones`).
3. **Share Story Trigger:** `#share-story-btn` — opens the story submission modal (checks authentication via `getCurrentUser()`).
4. **Story Cards Grid:** `#news-grid` (renders approved stories fetched via `getSubmissions('approved')` from `../storage-service.js`).
5. **Full Article Reader Modal:**
   - `#reader-modal` (`.modal-overlay.open`)
   - `#reader-modal-body` (receives article hero image, title, author byline, date, and full body text)
   - `#close-reader-modal`
   - **Author Deep-Link:** Story bylines must link directly to the author's public profile via `profile.html?id=${story.authorUid}`.
6. **Story Submission Modal:**
   - `#submit-story-modal` (`.modal-overlay.open`)
   - `#story-submission-form`
   - Inputs: `#story-title`, `#story-category`, `#story-excerpt`, `#story-image`, `#story-body`
   - Submits story with `status: 'pending'` via `createSubmission(data)` in `../storage-service.js` which routes to the staff moderation console (`admin.html`).

---

### 4. YOUR SPECIFIC UPGRADE TASKS
1. **Journalistic Magazine Cover Layout:**
   - Transform `#news-grid` into an editorial layout with a **Major Lead Feature Article** (2/3 width, large serif headline, high-resolution photography, author portrait) paired with a **Trending Insights Column** (1/3 width, ranked list of recent alumni breakthroughs).
2. **Academic Long-Form Reader Experience:**
   - Upgrade `#reader-modal`: Elegant drop-cap on first paragraph, estimated reading time pill (e.g. `5 min read`), publication volume/issue badge, pull-quote blocks, and social share buttons.
   - Author profile callout box at the end of the article: Author photo, graduation year, current company/title, and "View Fellow Profile →" linking to `profile.html?id=${authorUid}`.
3. **Rich Story Submission Suite:**
   - Add live word-count counter and reading-time estimate to `#story-submission-form`.
   - Add image URL live preview in the submission form.
   - Show clear notification to the author that their submission has been cataloged for staff review in the University Gazette moderation queue.
4. **Reading List / Bookmark Simulation:**
   - Add a subtle bookmark icon button on story cards saving article IDs to `localStorage.alumni_saved_stories` with an active filter pill "My Saved Stories".
5. **Full Responsive Optimization:** Ensure the magazine layout, lead feature, reader dialog, and submission form scale cleanly from mobile (375px) to 4K displays.

Deliver clean, production-ready, fully written code for your assigned files.
```
