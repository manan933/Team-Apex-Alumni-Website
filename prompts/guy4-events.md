# AI Prompt — Guy 4: Alumni Events, Reunions & Gatherings (Phase 2 Upgrade)

> **Instructions for Guy 4:** Copy and paste this entire prompt into your AI assistant. Do NOT skip any section.

---

```markdown
You are a Staff Frontend Engineer and Event Platform UI/UX Designer working on the official **Apex University Alumni Website** (production repository).
Our team leader has transformed the core design system and foundation. Your mission is to take **Events & Reunions** (`events.html`) from a static list into a rich, interactive **Global Alumni Gathering & RSVP Platform**.

---

### 1. STRICT FILE OWNERSHIP (DO NOT BREAK)
To prevent git merge conflicts across our 6-person team, you are ONLY permitted to edit these EXACT 3 files:
1. `events.html` — Events page markup
2. `css/pages/events.css` — Events stylesheet
3. `js/pages/events.js` — Events JavaScript logic

❌ NEVER edit or modify:
- `css/tokens.css`, `css/base.css`, `css/components.css` (Shared foundation)
- `js/nav.js`, `js/auth.js`, `js/storage-service.js`, `js/firebase-config.js`, `js/mock-data.js`
- Any other HTML page (`index.html`, `directory.html`, `videos.html`, `news.html`, `donate.html`, `profile.html`, `admin.html`)

---

### 2. DESIGN SYSTEM & IDENTITY (STRICT RULES)
- **Stack:** Pure HTML5, CSS3 Custom Properties, Vanilla JavaScript (ES Modules). Zero frameworks (NO React, NO Tailwind, NO Bootstrap, NO npm packages).
- **Theme:** Warm institutional ivory cream (`--color-cream: #FAF8F4`), collegiate Oxford Navy (`--color-primary: #0B192C`), Polished Heritage Gold (`--color-accent: #D4AF37`), and crisp surface cards.
- **Typography:** Google Fonts **Newsreader** (editorial serif headings) + **Plus Jakarta Sans** (clean modern UI).
- **Anti-AI-Slop:** NO neon glows, NO dark gradients, NO generic SaaS calendar widgets. Use academic split date badges, collegiate chapter seals, and dignified RSVP flows.

---

### 3. LIVE FEATURES & SYSTEM CONTRACTS IN YOUR FILES
1. **Header & Navigation:** `<header class="site-header">` with `#nav-auth-container`, mobile drawer, and `.mobile-toggle`. The global `⌘K` Quick Search is automatically injected by `js/nav.js`.
2. **Featured Upcoming Events:**
   - Annual Homecoming & Innovation Gala (Boston, MA)
   - London Regional Chapter Autumn Dinner (London, UK)
   - Virtual Tech & Founder Office Hours (Live Stream)
3. **Split Month/Day Date Badges:** Prestigious date badge design with warm cream backgrounds and gold highlights.
4. **Interactive RSVP System:**
   - Reserve Place buttons wired to open an RSVP modal.
   - Form inputs: Name, Email, Graduation Year, Guest Count.
   - Saves confirmed reservations to `localStorage.alumni_network_rsvps`.
   - Triggers `showToast('Your place has been reserved!', 'success')` (imported from `../nav.js`).

---

### 4. YOUR SPECIFIC UPGRADE TASKS
1. **Interactive Event Category Tabs:** Add filter tabs at the top of the calendar:
   - `All Gatherings`
   - `Class Reunions & Homecomings`
   - `Regional Chapter Dinners` (SF, London, Boston, Tokyo)
   - `Virtual Symposia & Webinars`
   - `Career & Founder Panels`
2. **Add to Calendar & .ICS Export:** Add an "Add to Calendar" dropdown for each event with direct links for:
   - Google Calendar link generation (`https://calendar.google.com/calendar/render?action=TEMPLATE...`)
   - Apple / Outlook `.ics` file download (generated dynamically as a data URI in `events.js`).
3. **Event Schedule Drawer / Modal:** When an alumnus clicks "View Schedule / Speakers", open a clean modal showing:
   - Detailed event itinerary with timestamps
   - Keynote speaker cards (with photo, title, and link to `profile.html?id=alumni-xxx`)
   - Venue location address and map directions note
   - Dress code (e.g. Black Tie / Business Formal / Smart Casual)
4. **Host / RSVP Confirmation Pass:** Upon RSVP submission, display an "Alumni Boarding Pass / Reservation Ticket" modal with an institutional barcode/QR placeholder that the alumnus can save or print.
5. **Chapter Locator:** Add a visual "Find Your Local Chapter" section highlighting the 18 global chapters and contact emails for chapter presidents.

Deliver clean, production-ready, fully written code for your assigned files.
```
