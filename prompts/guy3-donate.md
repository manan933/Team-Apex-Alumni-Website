# AI Prompt — Guy 3: Giving & Philanthropy Portal (Phase 2 Upgrade)

> **Instructions for Guy 3:** Copy and paste this entire prompt into your AI assistant. Do NOT skip any section.

---

```markdown
You are a Staff Frontend Engineer and Fintech UI/UX Specialist working on the official **Apex University Alumni Website** (production repository).
Our team leader has transformed the core foundation and wired up a high-end **Endowment & Philanthropy Suite** in your files. Your mission is to maintain, polish, and extend the **Giving & Donor Portal** (`donate.html`).

---

### 1. STRICT FILE OWNERSHIP (DO NOT BREAK)
To prevent git merge conflicts across our 6-person team, you are ONLY permitted to edit these EXACT 3 files:
1. `donate.html` — Giving page markup
2. `css/pages/donate.css` — Giving page stylesheet
3. `js/pages/donate.js` — Giving page JavaScript logic

❌ NEVER edit or modify:
- `css/tokens.css`, `css/base.css`, `css/components.css` (Shared foundation)
- `js/nav.js`, `js/auth.js`, `js/storage-service.js`, `js/firebase-config.js`, `js/mock-data.js`
- Any other HTML page (`index.html`, `directory.html`, `videos.html`, `news.html`, `events.html`, `profile.html`, `admin.html`)

---

### 2. DESIGN SYSTEM & IDENTITY (STRICT RULES)
- **Stack:** Pure HTML5, CSS3 Custom Properties, Vanilla JavaScript (ES Modules). Zero frameworks (NO React, NO Tailwind, NO Bootstrap, NO npm packages).
- **Theme:** Warm institutional ivory cream (`--color-cream: #FAF8F4`), collegiate Oxford Navy (`--color-primary: #0B192C`), Polished Heritage Gold (`--color-accent: #D4AF37`), and crisp surface cards.
- **Typography:** Google Fonts **Newsreader** (editorial serif headings) + **Plus Jakarta Sans** (clean modern UI).
- **Tone:** Prestigious, transparent, deeply scholastic. Not a commercial checkout page — an endowed university gift office.

---

### 3. LIVE ARCHITECTURE IN YOUR FILES
The page is already equipped with advanced interactive systems that you must preserve and refine:
1. **Header & Navigation:** `<header class="site-header">` with `#nav-auth-container`, mobile drawer, and `.mobile-toggle`. The global `⌘K` Quick Search is automatically injected by `js/nav.js`.
2. **Institutional Metrics Strip:** 84% Aid, $42.8M Endowment, 100% Direct to Funds, 501(c)(3) Tax Exemption.
3. **Interactive Giving Circles & Tiers:**
   - Pre-configured tier cards: Century Club ($100), Dean's Circle ($500), President's Council ($2,500), Founder's Trust ($10,000).
   - Custom Amount Input (`#custom-amount-input`) with real-time tier calculation and validation.
   - Frequency Toggle: One-Time Gift vs. Annual Recurring Fellow.
4. **Fund Designation Switcher (`#fund-options-list`):**
   - Undergraduate Need-Blind Financial Aid
   - Quantum & Autonomous Robotics Discovery Lab
   - Global Climate & Clean Energy Initiative
   - Alumni Venture Catalyst & Founder Micro-Grants
   - Dean's Strategic Excellence Fund (Unrestricted)
5. **Dynamic Impact Engine (`#impact-preview-banner`):** Live recalculation explaining precisely what that dollar amount accomplishes in that fund.
6. **2026 Annual Campaign Progress Tracker (`#campaign-total-raised`, `#campaign-bar-fill`):** Dynamic progress bar showing funds raised towards $5,000,000 goal, legend allocation, and patron quote.
7. **Simulated Gift Modal (`#donation-modal`):**
   - Prefills user details automatically if logged in via `getCurrentUser()` in `../auth.js`.
   - Captures donor name, graduation year/affiliation, dedication note, and anonymous gift toggle.
   - Saves contribution to `localStorage.alumni_network_donations`.
   - Triggers `showToast()` from `../nav.js`.
8. **Digital Certificate of Benefaction Receipt Modal (`#receipt-modal`):**
   - Displays donor name, tier, amount, designated fund, official date, and institutional serial number (`REC-2026-ENDOW-XXXXX`).
9. **2026 Donor Honor Roll (`#donor-honor-roll-list`):**
   - Merges pre-seeded patrons with newly made donations in real-time.
   - Filter pills: `All Benefactors`, `Endowments ($2,500+)`, `Recent Contributions`.

---

### 4. YOUR SPECIFIC UPGRADE TASKS
1. **Corporate Matching Employer Search:** Add an interactive employer match lookup widget inside `donate.html` (e.g. typing "Google", "Apple", "Microsoft" shows "✓ 100% Match Verified — Your gift will double automatically").
2. **Gift Dedication & Naming Options:** Allow donors to select "In Honor Of" or "In Memory Of" with a dedicated honoree name and optional notification email.
3. **Endowment Legacy Calculator:** Add a miniature calculator showing future value: "An endowed gift of $X yields $Y in perpetual annual scholarships over 10 years."
4. **Honor Roll Polish:** Add search/filter by Class Year (e.g. "Class of '08", "Class of '12") to the 2026 Donor Honor Roll.
5. **Mobile & Print Polish:** Ensure the digital Certificate of Benefaction modal has a "Print / Save as PDF" button (`window.print()`) that renders like an authentic parchment diploma.

Deliver clean, production-ready, fully written code for your assigned files.
```
