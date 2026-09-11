# AI Prompt — Guy 4: Alumni Events, Reunions & Chapter Gatherings

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

## Your Assignment: Events Calendar & Chapter Meetups

**You own exactly these 3 files:**
1. `events.html` — The alumni events and reunions page markup
2. `css/pages/events.css` — All events styles (ONLY this file for CSS)
3. `js/pages/events.js` — All events JavaScript (ONLY this file for JS)

**Do NOT touch any other file.** Not `css/components.css`, not `css/base.css`, not `css/tokens.css`, not `js/nav.js`, not any other HTML file.

---

## Files You May READ (Shared Foundations — Never Edit):
- `css/tokens.css` — Design tokens
- `css/base.css` — Global typography scale and reset
- `css/components.css` — Nav header, mobile drawer, buttons, badges, modals, footer
- `js/nav.js` — Global toast notification system (`showToast(msg, type)`)
- `js/auth.js` — `getCurrentUser()`, `onAuthStateChange(cb)`
- `js/storage-service.js` — Unified storage layer
- `js/firebase-config.js` — Firebase Firestore configuration

---

## Current Architecture in events.html:
- Typographic Header: "Alumni Events & Reunions"
- Handoff Guidance Box: Schema for Firestore collection `events/{id}`
- Featured Upcoming Gatherings:
  - Annual Homecoming & Innovation Gala (Boston, MA)
  - London Regional Chapter Autumn Dinner (London, UK)
  - Virtual Tech & Founder Office Hours (Online Live Stream)
- Date Badges: Split month/day badge design with warm cream backgrounds

---

## Your Mission & Enhancement Goals:
1. **Interactive Event Calendar & Filter Tabs:** Build category filters for "All", "Reunions", "Regional Chapters", "Webinars", and "Career Panels".
2. **Interactive RSVP Flow:** When an alumni clicks "RSVP", open a clean RSVP modal or track attendance. Show a confirmation modal and celebratory toast.
3. **Event Detail Drawer/Modal:** Allow clicking on an event card to view full schedule, guest speakers, location map info, and dress code.
4. **Data Seed & Persistence:** Add a clean array of seed events in `js/pages/events.js` (or store in localStorage), rendering cards dynamically so new events can easily be added.
