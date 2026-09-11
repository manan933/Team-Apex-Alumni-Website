# AI Prompt — Guy 3: Giving & Philanthropy Portal

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

## Your Assignment: Giving & Philanthropy Portal

**You own exactly these 3 files:**
1. `donate.html` — The donation and giving page markup
2. `css/pages/donate.css` — All donation styles (ONLY this file for CSS)
3. `js/pages/donate.js` — All donation JavaScript (ONLY this file for JS)

**Do NOT touch any other file.** Not `css/components.css`, not `css/base.css`, not `css/tokens.css`, not `js/nav.js`, not any other HTML file.

---

## Files You May READ (Shared Foundations — Never Edit):
- `css/tokens.css` — Design tokens
- `css/base.css` — Typography and container widths
- `css/components.css` — Nav header, mobile drawer, buttons, form controls, footer
- `js/nav.js` — Global toast notification system (`showToast(msg, type)`)
- `js/auth.js` — `getCurrentUser()`, `onAuthStateChange(cb)`
- `js/storage-service.js` — Data persistence layer
- `js/firebase-config.js` — Firebase Firestore credentials

---

## Current Architecture in donate.html:
- Typographic Header: "Invest in the Scholars of Tomorrow"
- Handoff Guidance Box: Schema for `donations/{id}`
- Giving Tiers Grid:
  - Century Club ($100)
  - Dean's Circle ($500) • Featured
  - President's Council ($2,500)
  - Founder's Endowment ($10,000+)
- 2026 Donor Recognition Honor Roll (Alumni benefactors cloud)

---

## Your Mission & Enhancement Goals:
1. **Interactive Tier Selection & Custom Amount:** Enable donors to click a tier or input a custom gift amount ($25, $50, $1,000, etc.).
2. **Fund Designation Switcher:** Allow alumni to direct their contribution toward specific causes:
   - Undergraduate Financial Aid & Emergency Bursaries
   - Sustainable Energy & Climate Engineering Labs
   - Robotics & AI Student Endowments
   - Athletic & Cultural Campus Facilities
3. **Simulated or Live Payment Modal:** Provide a clean modal or multi-step checkout form (Card / Bank / Apple Pay simulation), validating inputs and displaying a celebration modal + toast upon completion.
4. **Donor Wall Real-Time Updates:** Store donations into `localStorage` (or Firestore collection `donations`) so recent gifts appear dynamically on the Donor Honor Roll.
