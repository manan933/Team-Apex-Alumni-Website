# 🎓 Apex University Alumni Website — Project Memory

> **Live URL:** https://apexalumni.vercel.app/  
> **Project root:** `D:\Team-Apex-Alumni-Website\`  
> **Tech Stack:** HTML · CSS · Vanilla JavaScript (ES Modules) · Firebase Firestore (optional)  
> **Last updated:** September 2026

---

## 🗂️ What Is This Project?

An **official university alumni website** for Apex University — a real, production-bound project. It has been transformed into a **world-class, human-centric academic digital experience**.

Design philosophy: 2026-era elite product website. Confident typography, intentional whitespace, subtle motion, strong visual identity. **Alumni are the HERO.**
No Bootstrap, no Tailwind, no React, no build tools or bundlers. Native browser capabilities only.

### Design Identity
| Token | Value |
|---|---|
| Primary (Navy) | `#0B192C` — Collegiate Oxford Navy |
| Accent (Gold) | `#D4AF37` — Polished Heritage Gold |
| Canvas Background | `#F8FAFC` — Crisp Canvas |
| Warm Cream Surface | `#FAF8F4` (`--color-cream`) |
| Warm Divider | `#E8E1D9` (`--color-border-warm`) |
| Constellation Tokens | `--color-node-tech` (`#3B82F6`), `--color-node-bio` (`#10B981`), `--color-node-vc` (`#F59E0B`), `--color-node-energy` (`#EC4899`) |
| Heading Font | **Newsreader** (Google Fonts, serif) |
| UI Font | **Plus Jakarta Sans** (Google Fonts, sans-serif) |
| Monospace | **JetBrains Mono** / System Mono |

All design tokens live in [`css/tokens.css`](css/tokens.css). Never hardcode colors or sizes — always use `var(--token-name)`.

---

## 📁 File Structure & Ownership

```
Team-Apex-Alumni-Website/
├── index.html             ← Guy 1 (Home + Branding)
├── videos.html            ← Guy 2 (Videos)
├── donate.html            ← Guy 3 (Donate & Philanthropy)
├── events.html            ← Guy 4 (Events & Reunions)
├── news.html              ← Guy 5 (News & Stories)
│
├── directory.html         ← TEAM LEADER ONLY
├── login.html             ← TEAM LEADER ONLY
├── signup.html            ← TEAM LEADER ONLY
├── profile.html           ← TEAM LEADER ONLY
├── admin.html             ← TEAM LEADER ONLY
├── 404.html               ← TEAM LEADER ONLY
│
├── css/
│   ├── tokens.css         ← 🔒 READ-ONLY — Design tokens & color system
│   ├── base.css           ← 🔒 READ-ONLY — Global reset & typography scale
│   ├── components.css     ← 🔒 READ-ONLY — Nav, ⌘K search, buttons, cards, modals, toasts, footer
│   └── pages/
│       ├── home.css       ← Guy 1 ONLY
│       ├── videos.css     ← Guy 2 ONLY
│       ├── donate.css     ← Guy 3 ONLY
│       ├── events.css     ← Guy 4 ONLY
│       ├── news.css       ← Guy 5 ONLY
│       ├── directory.css  ← TEAM LEADER ONLY
│       ├── auth.css       ← TEAM LEADER ONLY
│       ├── profile.css    ← TEAM LEADER ONLY
│       ├── admin.css      ← TEAM LEADER ONLY
│       └── stubs.css      ← DEPRECATED — do not use
│
├── js/
│   ├── firebase-config.js ← 🔒 READ-ONLY (Auth & Firestore detector)
│   ├── mock-data.js       ← 🔒 READ-ONLY (Seed records)
│   ├── storage-service.js ← 🔒 READ-ONLY (Unified storage API)
│   ├── auth.js            ← 🔒 READ-ONLY (Auth session state)
│   ├── nav.js             ← 🔒 READ-ONLY (Header, mobile drawer, ⌘K Command Palette, toasts)
│   └── pages/
│       ├── home.js        ← Guy 1 ONLY (Constellation canvas, timeline, stats)
│       ├── videos.js      ← Guy 2 ONLY (Video filters & theater player)
│       ├── donate.js      ← Guy 3 ONLY (Giving tiers, calculator, receipt, honor roll)
│       ├── events.js      ← Guy 4 ONLY (Events calendar & RSVP system)
│       ├── news.js        ← Guy 5 ONLY (Magazine feed & story submission)
│       ├── directory.js   ← TEAM LEADER ONLY (Multi-mode discovery & detail modal)
│       ├── auth-page.js   ← TEAM LEADER ONLY (Login, signup & password reset)
│       ├── profile.js     ← TEAM LEADER ONLY (Dual-mode public profile & editor)
│       └── admin.js       ← TEAM LEADER ONLY (Story moderation console)
│
├── prompts/               ← Individual AI briefing prompts for teammates
│   ├── guy1-home-branding.md
│   ├── guy2-videos.md
│   ├── guy3-donate.md
│   ├── guy4-events.md
│   └── guy5-news.md
├── memory.md              ← THIS FILE
└── brain.md               ← Full context & handover architecture file
```

---

## 👥 Team Assignments

| Person | Section | HTML | CSS | JS |
|---|---|---|---|---|
| **Guy 1** | Home + Branding | `index.html` | `css/pages/home.css` | `js/pages/home.js` |
| **Guy 2** | Videos | `videos.html` | `css/pages/videos.css` | `js/pages/videos.js` |
| **Guy 3** | Donate | `donate.html` | `css/pages/donate.css` | `js/pages/donate.js` |
| **Guy 4** | Events | `events.html` | `css/pages/events.css` | `js/pages/events.js` |
| **Guy 5** | News & Stories | `news.html` | `css/pages/news.css` | `js/pages/news.js` |
| **Team Leader** | Directory, Profile, Auth, Admin & Shared Foundation | All other files | All other files | All other files |

### 🔒 Files Everyone Must Treat as READ-ONLY
These are the shared foundation. If you edit them you will cause merge conflicts and break other team members' pages:
- `css/tokens.css`
- `css/base.css`
- `css/components.css`
- `js/firebase-config.js`
- `js/mock-data.js`
- `js/storage-service.js`
- `js/auth.js`
- `js/nav.js`

---

## 🚀 How to Run Locally

The site uses ES Modules — it **cannot** be opened as a `file://` URL. You must serve it over HTTP.

```bash
# Option A: Node.js
npx serve .

# Option B: Python 3
python -m http.server 8080
```
Then open `http://localhost:3000` or `http://localhost:8080` in your browser.

---

## 🔥 Zero-Setup Demo / Mock Mode

If `js/firebase-config.js` contains placeholder keys, the entire application operates locally using `localStorage` and `mock-data.js`.
- Profiles stored in `alumni_network_profiles`
- Submissions stored in `alumni_network_submissions`
- Donations stored in `alumni_network_donations`
- RSVPs stored in `alumni_network_rsvps`
- Auth session stored in `alumni_auth_current_user`

### 🧪 Admin Test Credentials:
- **Email:** `marcus.vance@apexcapital.co` (pre-configured with `isAdmin: true`)
- **Password:** Any password in demo mode
- **Shortcut:** On `admin.html`, click "Simulate Admin Login (Marcus Vance)" to test staff moderation.

---

## 📌 Pages & Implementation State

| Page | File | Status & Key Features |
|---|---|---|
| **Home** | `index.html` | **Complete**: Native HTML5 60fps Canvas Constellation Visualizer, Marquee Ticker, Generations Timeline, Regional Hubs, Editorial Spotlight & Gazette. |
| **Directory** | `directory.html` | **Complete**: Multi-Mode Switcher (Editorial Cards vs Dense Table), Natural Discovery Chips, Deep Debounced Search, Filter Reset, Quick Profile Detail Modal. |
| **Profile** | `profile.html` | **Complete**: Dual-Mode Architecture: Public Editorial Profile (`?id=alumni-xxx`) with Career Journey Timeline, Academic Registry Seal, Related Alumni Fellows + Self-Service Live Editor. |
| **Donate** | `donate.html` | **Complete**: Giving Circles, Dynamic Impact Engine, Fund Designation Switcher, Simulated Endowment Gift Modal, Digital Certificate Receipt, Live 2026 Donor Honor Roll. |
| **News** | `news.html` | **Complete**: Journalistic Magazine Feed, Category Pills, Full Article Reader Modal, Authenticated Story Submission Flow, Author Profile Linking. |
| **Videos** | `videos.html` | **Complete**: Cinema Theater Mode Modal Player, YouTube embed integration, Category Filtering, Clean Typography. |
| **Events** | `events.html` | **Complete**: Upcoming Gathering Cards, Interactive RSVP Modal Flow, LocalStorage persistence, Celebratory Toast. |
| **Global ⌘K Search** | `js/nav.js` | **Complete**: Universal `⌘K` / `Ctrl+K` Command Palette across every page, instant live typing search across all alumni, batches, and disciplines. |
| **Auth** | `login.html`, `signup.html` | **Complete**: Academic Masthead, Tab Switcher, Form Validation, Forgot Password Modal, Mock Auth integration. |
| **Admin** | `admin.html` | **Complete**: Staff Role Gating, Pending Stories Moderation Queue, Live Approve & Publish / Reject Actions, Demo Shortcut. |
| **404** | `404.html` | **Complete**: Editorial "Lost in the Archive" layout with navigation return paths. |
