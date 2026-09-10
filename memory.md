# 🎓 Apex University Alumni Website — Project Memory

> **Live URL:** https://apexalumni.vercel.app/  
> **Project root:** `D:\Team-Apex-Alumni-Website\`  
> **Tech Stack:** HTML · CSS · Vanilla JavaScript (ES Modules) · Firebase Firestore (optional)  
> **Last updated:** September 2026

---

## 🗂️ What Is This Project?

An **official university alumni website** for Apex University — a real, production-bound project. It must look premium, modern, and distinctly non-generic. Design philosophy: 2026-era product website. Confident typography, intentional whitespace, subtle motion, strong visual identity. No Bootstrap, no Tailwind, no React, no build tools.

### Design Identity
| Token | Value |
|---|---|
| Primary (Navy) | `#0B192C` — Collegiate Oxford Navy |
| Accent (Gold) | `#D4AF37` — Polished Heritage Gold |
| Background | `#F8FAFC` — Canvas |
| Heading Font | **Newsreader** (Google Fonts, serif) |
| UI Font | **Plus Jakarta Sans** (Google Fonts, sans-serif) |
| Monospace | **JetBrains Mono** |

All design tokens live in [`css/tokens.css`](css/tokens.css). Never hardcode colors or sizes — always use `var(--token-name)`.

---

## 📁 File Structure & Ownership

```
Team-Apex-Alumni-Website/
├── index.html             ← Guy 1 (Home + Branding)
├── videos.html            ← Guy 2 (Videos)
├── donate.html            ← Guy 3 (Donate)
├── events.html            ← Guy 4 (Events)
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
│   ├── tokens.css         ← 🔒 READ-ONLY — Design tokens
│   ├── base.css           ← 🔒 READ-ONLY — Global reset & utilities
│   ├── components.css     ← 🔒 READ-ONLY — Nav, footer, buttons, cards, modals
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
│   ├── firebase-config.js ← 🔒 READ-ONLY
│   ├── mock-data.js       ← 🔒 READ-ONLY
│   ├── storage-service.js ← 🔒 READ-ONLY
│   ├── auth.js            ← 🔒 READ-ONLY
│   ├── nav.js             ← 🔒 READ-ONLY
│   └── pages/
│       ├── home.js        ← Guy 1 ONLY
│       ├── videos.js      ← Guy 2 ONLY
│       ├── donate.js      ← Guy 3 ONLY
│       ├── events.js      ← Guy 4 ONLY
│       ├── news.js        ← Guy 5 ONLY
│       ├── directory.js   ← TEAM LEADER ONLY
│       ├── auth-page.js   ← TEAM LEADER ONLY
│       ├── profile.js     ← TEAM LEADER ONLY
│       └── admin.js       ← TEAM LEADER ONLY
│
├── memory.md              ← THIS FILE
└── README.md              ← Setup & onboarding guide
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
| **Team Leader** | Alumni Directory + DB + Auth | All other files | — | — |

### 🔒 Files Everyone Must Treat as READ-ONLY

These are the shared foundation. If you edit them you will break every other team member's page.

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

**Option A — VS Code Live Server:**
Install the "Live Server" extension → right-click `index.html` → "Open with Live Server"

**Option B — Node.js one-liner:**
```bash
npx serve .
```
Then open `http://localhost:3000`

---

## 🔥 Firebase & Demo Mode

The site has a **Zero-Setup Demo Mode**. If `js/firebase-config.js` still has `YOUR_API_KEY_HERE`, the entire data layer automatically falls back to `localStorage` + built-in mock data. You do **not** need a Firebase account to develop.

**To enable live Firebase:**
1. Create a Firebase project at https://console.firebase.google.com
2. Enable Firestore Database
3. Copy your project config into `js/firebase-config.js`

---

## 🧪 Admin Test Login

To test admin-gated features:
- Log in as `marcus.vance@apexcapital.co` (any password in demo mode)
- Or click "Simulate Admin Login" on `admin.html`

---

## 🎨 Design Principles

1. **No dark mode.** Light backgrounds, light colors only.
2. **No AI-slop.** No generic card grids, no stock-photo banners, no default-looking layouts.
3. **Motion is subtle.** Scroll reveals, hover lifts, count-up animations — never jarring.
4. **Typography leads.** Newsreader + Plus Jakarta Sans. Generous line-height. Clear hierarchy.
5. **Section themes are not final.** Each developer can redesign their section's layout and theme if they have a better idea — as long as they stay within the design token system.

---

## 📌 Pages & Current State

| Page | File | State |
|---|---|---|
| Home | `index.html` | Foundation — needs upgrade |
| Alumni Directory | `directory.html` | Foundation — Team Leader |
| Videos | `videos.html` | Foundation — needs upgrade |
| Donate | `donate.html` | Stub — ready for build |
| Events | `events.html` | Stub — ready for build |
| News & Stories | `news.html` | Foundation — needs upgrade |
| Login / Signup | `login.html`, `signup.html` | Foundation — Team Leader |
| Profile | `profile.html` | Foundation — Team Leader |
| Admin | `admin.html` | Foundation — Team Leader |
