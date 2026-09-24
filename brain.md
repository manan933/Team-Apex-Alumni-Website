# 🧠 BRAIN FILE — APEX UNIVERSITY ALUMNI WEBSITE
> **Purpose:** Full context persistence & handover document for any AI assistant picking up this codebase.
> **Date Updated:** September 11, 2026
> **Live URL:** https://apexalumni.vercel.app/
> **Repository Root:** `D:\Team-Apex-Alumni-Website\`
> **Team Lead / Project Manager:** Manan Patel

---

## 1. Executive Summary & Philosophy

This project is a **production-bound, official university alumni network website** for Apex University.
It has undergone a **complete frontend transformation** from a generic starter card template into an **editorial, prestigious academic institution platform**.

### Core Principles:
- **No AI Slop / Vibe-Coding:** Strictly NO excessive glassmorphism, NO random gradient blobs, NO glowing neon borders, NO over-rounded bouncy cards, NO SaaS-dashboard aesthetics.
- **Editorial & Human-Centered:** Alumni are presented as distinguished people (editorial portraits, pull quotes, rich career trajectories, verified credentials), not database rows.
- **Light Mode Only:** Warm cream (`#FAF8F4`), crisp white card surfaces (`#FFFFFF`), deep collegiate navy (`#0B192C`), and polished heritage gold (`#D4AF37`).
- **Typography-Led:** Google Fonts **Playfair Display** (majestic academic display serif) + **Inter** (gold-standard crisp UI sans-serif) + **Cinzel** (classical Roman inscriptions & seal).
- **Pure Native Stack:** HTML5, CSS3 Custom Properties, Vanilla JavaScript with native **ES Modules** (`type="module"`). NO React, NO Vue, NO Tailwind, NO Bootstrap, NO build tools or bundlers.

---

## 2. Team Structure & Strict File Ownership

The project has a team of 6 (1 Team Leader + 5 Assigned Developers). To prevent Git merge conflicts, file ownership is strictly divided:

| Developer | Feature Area | Owned HTML | Owned CSS | Owned JS |
|---|---|---|---|---|
| **Guy 1** | Home & College Branding | `index.html` | `css/pages/home.css` | `js/pages/home.js` |
| **Guy 2** | Videos & Theater Player | `videos.html` | `css/pages/videos.css` | `js/pages/videos.js` |
| **Guy 3** | Donate & Philanthropy | `donate.html` | `css/pages/donate.css` | `js/pages/donate.js` |
| **Guy 4** | Events & Reunions | `events.html` | `css/pages/events.css` | `js/pages/events.js` |
| **Guy 5** | News & Alumni Stories | `news.html` | `css/pages/news.css` | `js/pages/news.js` |
| **Team Leader** | Directory, Profile, Auth, Admin, Core | `directory.html`, `login.html`, `signup.html`, `profile.html`, `admin.html`, `404.html` | `directory.css`, `auth.css`, `profile.css`, `admin.css`, + **all shared files** | `directory.js`, `auth-page.js`, `profile.js`, `admin.js`, + **all shared services** |

### 🔒 Read-Only Shared Foundation Files (Team Leader Only):
- `css/tokens.css` — Central design tokens
- `css/base.css` — Global reset, typography, containers, `.reveal` animations
- `css/components.css` — Nav header, mobile drawer, buttons, badges, modals, toasts, footer
- `js/nav.js` — Global navigation controller, auth listener, toast system (`showToast(msg, type)`), scroll reveals
- `js/auth.js` — Authentication state machine (Firebase Auth + seamless localStorage mock)
- `js/storage-service.js` — Asynchronous data layer (Firestore + localStorage mock)
- `js/firebase-config.js` — Firebase initialization & mock mode detector
- `js/mock-data.js` — Seed database (`INITIAL_STATS`, `INITIAL_ALUMNI`, `INITIAL_SUBMISSIONS`, `INITIAL_VIDEOS`)

---

## 3. Data Flow & Mock System Architecture

### Offline / Mock Mode Automatic Detection:
In `js/firebase-config.js`:
```javascript
export const isMockMode = (
  !firebaseConfig.apiKey || 
  firebaseConfig.apiKey.includes("YOUR_API_KEY") || 
  firebaseConfig.projectId.includes("your-alumni-app")
);
```
When placeholder credentials exist, the app operates 100% locally using `localStorage`.

### LocalStorage Keys:
- `alumni_network_profiles` — Alumni directory records (array of alumni objects)
- `alumni_network_submissions` — Story submissions (status: `'approved'` | `'pending'` | `'rejected'`)
- `alumni_network_videos` — Video records
- `alumni_network_donations` — Philanthropic contributions & endowment records
- `alumni_network_rsvps` — Event attendance reservations
- `alumni_auth_current_user` — Active logged-in user session
- `alumni_network_subscribers` — Newsletter email subscriptions

### Alumni Data Model:
```javascript
{
  uid: "alumni-001",
  name: "Dr. Elena Rostova",
  email: "elena.rostova@biotech-innovations.org",
  gradYear: 2012,
  degree: "Ph.D. Biomedical Engineering",
  company: "Genovate Therapeutics",
  jobTitle: "VP of Molecular Therapeutics",
  city: "Boston, MA",
  country: "United States",
  industry: "Biotechnology & Healthcare",
  linkedin: "https://linkedin.com",
  bio: "Pioneering novel mRNA delivery mechanisms...",
  photoURL: "https://images.unsplash.com/...",
  verified: true,
  profileComplete: true,
  isAdmin: false
}
```
*(Notice: use `uid`, `gradYear`, `jobTitle`, `photoURL` — NOT `id`, `graduationYear`, `role`, or `photoUrl`!)*

### Admin Test Account:
- **Email:** `marcus.vance@apexcapital.co` (pre-seeded with `isAdmin: true`)
- **Password:** Any password (in mock mode)
- **Shortcut:** On `admin.html`, click the "Simulate Admin Login (Marcus Vance)" button to instantly test staff moderation.

---

## 4. Frontend Architecture & Features Implemented

1. **Design Tokens & System (`css/tokens.css`, `css/base.css`, `css/components.css`):**
   - Editorial typography: Google Fonts Newsreader serif (-0.035em letter spacing, `text-wrap: balance`) paired with Plus Jakarta Sans.
   - Clean, accessible navigation across all devices without pop-up modals.

2. **Home Page (`index.html`, `css/pages/home.css`, `js/pages/home.js`):**
   - **Hero:** Spatial alumni cards, continuous marquee ticker of alumni roles, Newsreader masthead, direct CTA to Directory and Join Network.
   - **Stats Bar:** Animated numbers (`stat-total-alumni`, `stat-countries`, `stat-chapters`, `stat-years`).
   - **Generations of Excellence:** Interactive timeline exploring alumni impact across eras (`2016–Present`, `2005–2015`, `1980–2004`).
   - **Geographic Footprint:** Regional alumni hub exploration cards (San Francisco, London, Boston, Tokyo).
   - **Spotlight:** Full-width dark editorial showcase for Dr. Elena Rostova.
   - **Gazette & Videos:** 2/3 lead + 1/3 sidebar layouts.
   - **Giving Statement:** Prestigious institutional appeal.

3. **Alumni Discovery Engine (`directory.html`, `css/pages/directory.css`, `js/pages/directory.js`):**
   - **Multi-Mode View Switcher:** Instant toggling between **Editorial Cards** (4:4.6 portrait crops, verified badges) and **Dense Table** view.
   - **Natural Discovery Chips:** Instant exploration presets (`✨ Verified & Notable`, `🤖 AI & DeepTech`, `🧬 Biotech`, `⚡ Clean Energy`, `📈 Venture Capital`, `📍 San Francisco`, `📍 London`, `🎓 Class of '18`).
   - **Deep Search & Multi-Filter Toolbar:** Live debounced search across name, role, company, location, degree, bio; dynamic dropdowns for Batch, Company, Industry, Degree; active filter counter and reset.
   - **Quick Detail Modal:** Banner crop portrait, pull-quote bio, credentials grid, and direct profile navigation.

4. **Individual Alumni Profile Experience (`profile.html`, `css/pages/profile.css`, `js/pages/profile.js`):**
   - **Dual-Mode System:**
     - **Public Editorial Profile:** Deep-linkable via `profile.html?id=alumni-xxx`. Renders large portrait, verified fellow badge, personal narrative quote, visual career trajectory timeline (`career-timeline`), official academic registry seal card, gazette stories authored by this alumnus, and **Related Alumni Network** (same batch and same industry fellows).
     - **Self-Service Mode:** If the logged-in user views their own record, an "Edit My Profile Record" toggle switches to the form editor with real-time live preview synchronization, avatar upload, and gazette submission tracking.

5. **Giving & Philanthropy Portal (`donate.html`, `css/pages/donate.css`, `js/pages/donate.js`):**
   - **Interactive Giving Circles:** Century Club ($100), Dean's Circle ($500), President's Council ($2,500), Founder's Trust ($10,000), plus Custom Amount input.
   - **Fund Designation Switcher:** Financial Aid, Quantum & Robotics, Climate & Clean Energy, Venture Catalyst, Dean's Strategic Excellence.
   - **Dynamic Impact Engine:** Live recalculation of educational impact based on selected dollar amount and pillar.
   - **2026 Annual Campaign Progress Tracker:** Dynamic progress bar showing funds raised towards $5,000,000 goal, allocation breakdown legend, and patron quote.
   - **Gift Confirmation Modal & Digital Certificate:** Prefilled donor data, dedication note, anonymous listing toggle, simulated institutional payment gateway, and digital **Certificate of Benefaction** receipt with official crest seal.
   - **2026 Donor Honor Roll:** Real-time updates prepending newly recorded gifts to the honor roll, with filter pills (`All Benefactors`, `Endowments ($2,500+)`, `Recent Contributions`).

6. **Events Section (`events.html`, `css/pages/events.css`, `js/pages/events.js`):**
   - Interactive RSVP Modal flow saving attendee records to `localStorage.alumni_network_rsvps` with celebratory toast notification.

7. **News & Stories Gazette (`news.html`, `css/pages/news.css`, `js/pages/news.js`):**
   - Journalistic article reader modal, category filter pills, story submission modal for authenticated members, and direct author profile links (`profile.html?id=${story.authorUid}`).

8. **Videos Showcase (`videos.html`, `css/pages/videos.css`, `js/pages/videos.js`):**
   - Category filtering and cinema theater mode modal with clean typography.

9. **Admin Portal (`admin.html`, `css/pages/admin.css`, `js/pages/admin.js`):**
   - Staff role gate, pending stories moderation queue with instant approve and publish / reject actions.

10. **Auth Experience (`login.html`, `signup.html`, `css/pages/auth.css`, `js/pages/auth-page.js`):**
    - Clean institutional aesthetic, pill switcher, validation, and demo mock accounts.

---

## 5. How to Run & Verify Locally

```bash
# In the project directory:
npx serve .
# Or Python:
python -m http.server 8080
```
> **Note:** Because native ES Modules (`<script type="module">`) are used, you cannot view the site via `file://` — an HTTP server is required.

---

## 6. Handover Checklist & Verification State

- [x] All 11 pages updated and styled with pure HTML/CSS/JS (no frameworks)
- [x] Warm ivory cream light-mode design tokens enforced
- [x] Command Palette (⌘K) removed across all pages per user request
- [x] Living Alumni Constellation Canvas removed per user request
- [x] Directory multi-mode switcher and discovery chips implemented
- [x] Dual-mode public profile and self-service editor implemented
- [x] Giving & Philanthropy portal with live honor roll and digital receipt implemented
- [x] Events RSVP flow implemented
- [x] Team member prompts updated in `prompts/guy1-5.md`
- [x] `memory.md` and `brain.md` synchronized
