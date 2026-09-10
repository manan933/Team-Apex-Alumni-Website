# AI Prompt — Guy 3: Donate Section

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

## Your Assignment: Donate / Giving Section

**You own exactly these 3 files:**
1. `donate.html` — The donation page markup
2. `css/pages/donate.css` — All donate page styles (ONLY this file for CSS)
3. `js/pages/donate.js` — All donate page JavaScript (ONLY this file for JS)

**Do NOT touch any other file.** Not `css/components.css`, not `css/base.css`, not `css/tokens.css`, not `js/nav.js`, not any other HTML file. If you think something is wrong with the shared files, flag it to the team leader — don't edit it yourself.

---

## Files You May READ (but never modify)

These are read-only shared foundations:
- `css/tokens.css` — All CSS variables (colors, spacing, font sizes, shadows, radii)
- `css/base.css` — Global reset, fluid typography, scroll reveal utility
- `css/components.css` — Sticky nav, footer, buttons, cards, modals, badges
- `js/nav.js` — Sticky header, mobile drawer, auth pill, toasts
- `js/firebase-config.js` — Firebase init (has auto mock fallback if no real credentials)
- `js/mock-data.js` — Dummy data for demo mode
- `js/storage-service.js` — Unified async data layer (Firestore or localStorage)
- `js/auth.js` — Auth state management

---

## Current State of Your Page

`donate.html` / `donate.js` is currently a **stub scaffold**:
- Page heading + description
- A developer handoff box (explaining what needs to be built — you should REMOVE this and replace it with the real UI)
- **Tiered giving options** — 4 cards for \$100, \$250, \$500, \$1,000+ with click-to-select
- A disabled "Proceed with Secure Contribution" button placeholder
- A **Donor Recognition Wall** — placeholder donor cards showing sample names

Your job is to build this out into a real, beautiful donation experience page.

---

## What Needs to Be Built

This section is the fundraising heart of the alumni network. It must feel emotionally resonant — not like a bill payment screen.

**Core UI to build:**
1. **Impact hero** — Something that immediately communicates WHY alumni should give. Not just "Donate" — show the human outcome. E.g., "Your gift this year funded 14 student research fellowships."
2. **Giving tier selector** — Redesign the 4 tier cards into something more elegant and persuasive. Each tier should feel like a distinct giving "identity" (Friend, Patron, Champion, Founder level).
3. **Custom amount input** — Let donors type any number
4. **Cause selector** — Dropdown or toggle: "Scholarship Fund" / "Innovation Lab" / "Where Most Needed"
5. **Payment placeholder** — A styled "Proceed to Secure Checkout" button. (Actual payment integration is a future phase — for now it can open a placeholder modal explaining the gateway is coming soon, OR link to a Razorpay/Stripe payment link if the team has one.)
6. **Donor Recognition Wall** — A beautiful wall of giving. Names, class year, and optional message. Pull from `mock-data.js` or build static placeholder data.
7. **Impact stats strip** — E.g., "₹1.2 Cr raised | 218 donors | 47 scholarships funded"

**For the Donor Wall specifically:** Think beyond a boring card grid. Some ideas:
- Concentric rings of donor names by tier level
- A "wall of names" typographic treatment (overlapping translucent text blocks)
- A timeline view — each year a gift was made

---

## Creative Mandate

- Think completely outside the box. How do the best endowment campaigns present giving? Look at MIT, Stanford giving pages — then do better.
- It must NOT look AI-generated. No generic "Give Today!" hero with a gold button.
- Light mode only. No dark backgrounds.
- You are free to completely restructure the page layout and theme — the current scaffold is just a starting point.
- No payment gateway integration needed right now — that's a future phase. Build a realistic-looking UI with a placeholder flow.

---

## Technical Rules

1. Run a local server to test: `npx serve .` in the project folder, then open `http://localhost:3000`
2. All CSS goes in `css/pages/donate.css` — do not write `<style>` tags in the HTML
3. All JS goes in `js/pages/donate.js` — do not write extra `<script>` tags
4. Use `var(--token-name)` for all CSS values — never hardcode colors or sizes
5. The nav and footer are controlled by `components.css` and `nav.js` — do not restyle them

---

## How to Run

```bash
# In the project folder (D:\Team-Apex-Alumni-Website)
npx serve .
# Open http://localhost:3000/donate.html
```

Or use VS Code Live Server extension.

---

## Deliverables

When done, the team leader will review `donate.html`, `css/pages/donate.css`, and `js/pages/donate.js` only. Do not commit or push changes to any other file.
