# AI Prompt — Guy 4: Events Section

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

## Your Assignment: Events Section

**You own exactly these 3 files:**
1. `events.html` — The events page markup
2. `css/pages/events.css` — All events page styles (ONLY this file for CSS)
3. `js/pages/events.js` — All events page JavaScript (ONLY this file for JS)

**Do NOT touch any other file.** Not `css/components.css`, not `css/base.css`, not `css/tokens.css`, not `js/nav.js`, not any other HTML file. If you think something is wrong with the shared files, flag it to the team leader — don't edit it yourself.

---

## Files You May READ (but never modify)

These are read-only shared foundations:
- `css/tokens.css` — All CSS variables (colors, spacing, font sizes, shadows, radii)
- `css/base.css` — Global reset, fluid typography, scroll reveal utility
- `css/components.css` — Sticky nav, footer, buttons, cards, modals, badges
- `js/nav.js` — Sticky header, mobile drawer, auth pill, toasts
- `js/firebase-config.js` — Firebase init (has auto mock fallback if no real credentials)
- `js/mock-data.js` — Dummy data for demo mode (you can add a `MOCK_DATA.events` array here if needed — but ask team leader first before editing this file)
- `js/storage-service.js` — Unified async data layer (Firestore or localStorage)
- `js/auth.js` — Auth state management

---

## Current State of Your Page

`events.html` / `events.js` is currently a **stub scaffold**:
- Page heading + description
- A developer handoff box explaining what needs to be built (you should REMOVE this and replace it with the real UI)
- 3 placeholder event cards (stub grid)
- A Firestore schema comment showing expected data structure

Your job is to build this out into a real, beautiful events page.

---

## What Needs to Be Built

This is the community heartbeat of the alumni network. Events bring people back — to campus, to each other. The page must feel like it's always alive with activity.

**Core UI to build:**
1. **Featured / upcoming event hero** — The next major event (e.g. Annual Homecoming Gala) gets a full-width editorial treatment at the top. Date, location, a brief description, and an RSVP button.
2. **Filter system** — Category pills or a sidebar: All Events / Reunions / Webinars / Chapter Meetups / Career Panels
3. **Events grid/list** — Display upcoming events. Each event card should show: title, date, location (city or virtual), category badge, RSVP button
4. **Past events section** — A smaller, lower-prominence row of past events (greyed out or a "gallery" style)
5. **Countdown timer** — For the next major event, show a live countdown (days, hours, minutes)
6. **RSVP interaction** — Button that either links externally (Eventbrite/Luma style) or opens a simple "Register Interest" modal (name + email form, saves to localStorage in demo mode)

**For event data in demo mode:** Create a `const EVENTS = [...]` array directly in `events.js` with 5–8 realistic placeholder events. This avoids needing to touch `mock-data.js`.

Example event object structure:
```js
{
  id: 'e1',
  title: 'Annual Homecoming & Innovation Gala',
  date: '2026-10-18T18:00:00',
  location: 'University Quadrangle, Boston MA',
  category: 'Reunion',
  description: 'Join us for an evening of reconnection...',
  isFeatured: true,
  rsvpUrl: '#'  // placeholder
}
```

---

## Creative Mandate

- Think completely outside the box. What's the most compelling way to display events for alumni who are scattered across the globe?
- It must NOT look AI-generated. No boring table-style event list.
- Light mode only. No dark backgrounds.
- You are free to completely redesign the layout. Some ideas (not mandatory):
  - A **large editorial calendar view** showing events by month — elegant, magazine-style
  - A **world map background** (CSS-only, SVG or illustrated) showing which cities events are in, with pins
  - A **horizontal timeline** that scrolls sideways for upcoming events
  - Each event card with a unique visual flavor based on category (Reunion events look different from Webinars)
  - A sticky "Next Event" countdown bar at the top of the page

---

## Technical Rules

1. Run a local server to test: `npx serve .` in the project folder, then open `http://localhost:3000`
2. All CSS goes in `css/pages/events.css` — do not write `<style>` tags in the HTML
3. All JS goes in `js/pages/events.js` — do not write extra `<script>` tags
4. Use `var(--token-name)` for all CSS values — never hardcode colors or sizes
5. The nav and footer are controlled by `components.css` and `nav.js` — do not restyle them

---

## How to Run

```bash
# In the project folder (D:\Team-Apex-Alumni-Website)
npx serve .
# Open http://localhost:3000/events.html
```

Or use VS Code Live Server extension.

---

## Deliverables

When done, the team leader will review `events.html`, `css/pages/events.css`, and `js/pages/events.js` only. Do not commit or push changes to any other file.
