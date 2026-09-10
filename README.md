# Apex University Alumni Website — Foundation Build

A production-grade, dependency-light foundation for an official university alumni website built with **HTML5, CSS3 (Design Tokens), and Vanilla JavaScript (ES Modules)**, wired to **Firebase (Auth, Firestore, Storage)** with an automatic, zero-setup **Local Mock Fallback** for instant browser preview and local testing.

---

## 🌟 Key Architecture Highlights

1. **Zero Framework Bloat**: Pure HTML5, CSS3, and native ES Modules. No heavy React/Vue runtime, no Webpack or build step required.
2. **Instant Demo Mode**: The application detects if Firebase API keys are placeholders and automatically falls back to an offline/local storage data layer. Filters, search, profile editing, live card preview, video theater modal, and story moderation work **out of the box** without any cloud account setup.
3. **2026 Academic Visual Identity**: High-contrast collegiate navy (`#0B192C`), burnished heritage gold (`#D4AF37`), modern glassmorphic sticky navigation, and disciplined typography (`Plus Jakarta Sans` + `Newsreader`).
4. **Moderated Community Layer**: Public visitors browse approved content; authenticated alumni can self-edit their directory profiles with live card preview and submit stories; admins can review submissions in the moderation queue.
5. **Clear Developer Scaffolding**: Events, Donations, and Admin features are scaffolded with code comments, data schemas, and design token integration for seamless team handoff.

---

## 📁 Project Directory Structure

```
├── index.html                   # Home page (Hero, animated stats, spotlight, previews, giving CTA)
├── directory.html               # Alumni Directory (AND-logic multi-filters, free search, modal)
├── login.html                   # Alumni login & password reset
├── signup.html                  # Registration flow (auto-initializes alumni profile)
├── profile.html                 # Self-service Profile editor + Live Card Preview + My Submissions
├── videos.html                  # YouTube video gallery with category filters & theater modal
├── news.html                    # Approved story feed, article reader modal, story submission form
├── events.html                  # [STUB] Events & reunions calendar scaffold for events team
├── donate.html                  # [STUB] Giving & donor recognition wall scaffold for finance team
├── admin.html                   # [STUB] Admin console with role gate & live story moderation queue
├── 404.html                     # Custom branded 404 page
├── sitemap.xml                  # SEO sitemap
├── firestore.rules              # Production Firestore security rules
├── README.md                    # Handoff documentation
│
├── css/
│   ├── tokens.css               # Design tokens (colors, typography, spacing, shadows, radii)
│   ├── base.css                 # Reset, typography, scroll reveal animations, utilities
│   ├── components.css           # Sticky nav, mobile drawer, buttons, cards, modals, footer
│   └── pages/
│       ├── home.css             # Hero, stats strip, spotlight card, giving banner
│       ├── directory.css        # Multi-filter toolbar, alumni cards, detail modal
│       ├── auth.css             # Authentication cards & password recovery modal
│       ├── profile.css          # Split editor & live preview layout, submissions list
│       ├── videos.css           # Video cards, category pills, theater modal
│       ├── news.css             # Magazine feed, reader modal, submission dialog
│       └── stubs.css            # Events, donate, and admin dashboard styling
│
└── js/
    ├── firebase-config.js       # Modular Firebase v10/v11 SDK init with mock mode toggle
    ├── mock-data.js             # Initial mock data for alumni, stories, videos, and stats
    ├── storage-service.js       # Unified async data layer (Firestore OR localStorage)
    ├── auth.js                  # Auth state management, login/signup/logout, session listeners
    ├── nav.js                   # Sticky header scroll effects, mobile drawer, dynamic profile dropdown
    └── pages/
        ├── home.js              # Stats counter animation, dynamic spotlight, preview feeds
        ├── directory.js         # Multi-filter engine (batch, company, industry, degree, search) + modal
        ├── auth-page.js         # Auth form handling, validation, error display, redirection
        ├── profile.js           # Form population, real-time live preview sync, photo upload, submissions
        ├── videos.js            # Video gallery rendering, category filter, theater player modal
        ├── news.js              # Approved stories feed, story reader, submission flow
        └── admin.js             # Role check gate (isAdmin: true) & moderation queue actions
```

---

## 🚀 How to Run Locally

Because the project uses standard **ES Modules** (`import` / `export`), it must be served over HTTP rather than opened as a local `file://` URL.

### Option 1: Using Node.js / npx (Zero install)
```bash
# From the project root folder:
npx serve .
```
Then open `http://localhost:3000` in your browser.

### Option 2: Using Python (Built-in)
```bash
# Python 3
python -m http.server 8000
```
Then open `http://localhost:8000`.

### Option 3: VS Code Live Server
Right-click on `index.html` and click **"Open with Live Server"**.

---

## 🔑 Firebase Setup (When Ready for Cloud Deployment)

The website is pre-wired for Google Firebase. When you are ready to switch from Demo Mode to a live backend:

1. Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/).
2. Enable:
   - **Authentication**: Email/Password provider.
   - **Cloud Firestore**: Start in production mode.
   - **Cloud Storage**: For alumni profile avatars.
3. Open `js/firebase-config.js` and replace the placeholder configuration:
   ```javascript
   export const firebaseConfig = {
     apiKey: "AIzaSy...",
     authDomain: "your-app.firebaseapp.com",
     projectId: "your-app",
     storageBucket: "your-app.appspot.com",
     messagingSenderId: "...",
     appId: "..."
   };
   ```
4. Deploy the security rules in `firestore.rules`:
   ```bash
   firebase deploy --only firestore:rules
   ```
*(Note: Client-side Firebase keys are designed by Google to be public; security is enforced on the server through Firestore Security Rules).*

---

## 🎨 Design System & Tokens Guide

All styles inherit from `css/tokens.css`. When extending pages or building new components, always use CSS variables:

### Color Palette
- `--color-primary`: `#0B192C` (Collegiate Oxford Navy)
- `--color-primary-light`: `#1E3E62` (Slate Navy Accent)
- `--color-accent`: `#D4AF37` (Polished Heritage Gold)
- `--color-accent-hover`: `#BF9B30`
- `--color-bg-main`: `#F8FAFC` (Canvas Background)
- `--color-surface`: `#FFFFFF` (Card Surface)
- `--color-text-primary`: `#0F172A` (Charcoal headings)
- `--color-text-secondary`: `#475569` (Body slate)

### Typography
- Headings: `'Newsreader', Georgia, serif` (Editorial, authoritative academic tone)
- Body & UI: `'Plus Jakarta Sans', sans-serif` (Clean, contemporary geometric sans)

### Radii & Shadows
- Cards: `border-radius: var(--radius-lg)` (18px)
- Buttons: `border-radius: var(--radius-sm)` (8px)
- Elevations: `box-shadow: var(--shadow-sm)` hovering to `var(--shadow-md)`

---

## 👥 Audience & Testing Guide

### 1. Public Visitor (Logged Out)
- Open `index.html`: Scroll through animated stats, spotlight, video previews, and giving banner.
- Open `directory.html`: Test the multi-filter toolbar:
  - Select Company (e.g. `Google`, `SpaceX`, `Apex Capital`).
  - Filter by Graduating Batch (e.g. `Class of 2012`).
  - Search by keyword (e.g. `Elena` or `Artificial Intelligence`).
  - Click any card to open the accessible Alumni Detail Modal.
- Open `videos.html`: Filter by category, click any video thumbnail to launch the **Theater Mode** player.
- Open `news.html`: Browse published stories, click to open the full article reader.

### 2. Logged In Alum
- Go to `login.html`:
  - **Quick Demo Login**: Use `elena.rostova@biotech-innovations.org` (any password) OR click **New Registration** on `signup.html`.
- Redirects to `profile.html`:
  - Edit Job Title, Company, or Bio.
  - Watch the **Live Directory Preview Card** update in real-time on the right.
  - Click "Change Photo" to upload an image.
  - Click "Save Profile Changes".
- Go to `news.html` and click **"Share Your Story +"**:
  - Fill out the submission form.
  - Submit the story — it will enter `pending` status.
  - Return to `profile.html` to see the new submission listed under **My Submissions** with a `Pending` badge!

### 3. Admin Moderation
- Open `admin.html`:
  - If not logged in as admin, click **"Simulate Admin Login (Marcus Vance)"**.
  - Review the **Editorial Moderation Queue** showing pending stories.
  - Click **"Approve & Publish"** — the story is instantly approved and becomes visible in the public feed on `news.html`!

---

## 🛠️ Handoff Notes for Future Teams

- **Events Team (`events.html`)**: Scaffold is in place with sample cards and suggested Firestore collection schema (`events/{id}`). Reuse `.card` and filter styles from `directory.html`.
- **Giving / Donations Team (`donate.html`)**: Donor wall and tiered amount cards are scaffolded. Connect to Stripe Payment Links or a custom payment gateway webhook that writes to `donations/{id}`.
- **Admin Team (`admin.html`)**: The moderation queue is fully functional for stories. Future expansion tabs for Events and Donations management are cleanly stubbed with tab switcher logic in `js/pages/admin.js`.
