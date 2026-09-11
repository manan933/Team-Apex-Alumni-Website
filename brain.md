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
- **Editorial & Human-Centered:** Alumni are presented as distinguished people (editorial portraits, pull quotes, rich career trajectories), not database rows.
- **Light Mode Only:** Warm cream (`#FAF8F4`), crisp white card surfaces (`#FFFFFF`), deep collegiate navy (`#0B192C`), and polished heritage gold (`#D4AF37`).
- **Typography-Led:** Google Fonts **Newsreader** (editorial serif heading) + **Plus Jakarta Sans** (clean modern UI sans-serif).
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
| **Team Leader** | Directory, Auth, Admin, Core | `directory.html`, `login.html`, `signup.html`, `profile.html`, `admin.html`, `404.html` | `directory.css`, `auth.css`, `profile.css`, `admin.css`, + **all shared files** | `directory.js`, `auth-page.js`, `profile.js`, `admin.js`, + **all shared services** |

### 🔒 Read-Only Shared Foundation Files (Team Leader Only):
- `css/tokens.css` — Central design tokens
- `css/base.css` — Global reset, typography, containers, `.reveal` animations
- `css/components.css` — Nav header, mobile drawer, buttons, badges, modals, toasts, footer
- `js/nav.js` — Global navigation controller, auth listener, toast system (`showToast(msg, type)`)
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

## 4. Work Completed in Frontend Redesign

1. **Design Tokens (`css/tokens.css`):**
   - Added `--color-cream: #FAF8F4` and `--color-cream-deep: #F5F0E8`
   - Added warm border `--color-border-warm: #E8E1D9`
   - Added aliases: `--font-family-heading`, `--font-family-sans`, `--font-weight-bold`, `--color-gold`, `--color-navy`
   - Subtler shadows, tighter border radii (`--radius-sm: 6px`, `--radius-md: 10px`)

2. **Base CSS (`css/base.css`):**
   - Headings with `-0.025em` to `-0.03em` tight tracking and `text-wrap: balance`
   - `.section-cream`, `.section-dark`, `.divider-gold`, `.divider-warm`

3. **Components (`css/components.css`):**
   - Masthead sticky header with glass blur and gold accent line
   - Standardized 4-column footer across all pages
   - Refined `.btn` radii (sharp, prestigious)
   - Refined `.modal-overlay.open` and `.toast` notifications

4. **Home Page (`index.html`, `home.css`, `home.js`):**
   - Typographic masthead hero on warm cream
   - Integrated 4-column stats counter strip
   - Full-width dark spotlight card with Elena Rostova's pull-quote
   - 6-graduate alumni mosaic grid
   - Editorial Gazette 2/3 + 1/3 layout for latest stories
   - Featured video layout

5. **Alumni Directory (`directory.html`, `directory.css`, `directory.js`):**
   - Clean page header with subtitle
   - Streamlined sticky search & filter toolbar (batch, company, industry, degree)
   - 4:4.5 rectangular portrait alumni cards with gold verified checkmarks
   - Editorial modal banner view with detailed metadata grid & LinkedIn integration

6. **Profile Page (`profile.html`, `profile.css`, `profile.js`):**
   - Aligned the live preview directory card to match the new rectangular portrait design
   - Synchronized typing preview and photo upload

7. **Auth Pages (`login.html`, `signup.html`, `auth.css`, `auth-page.js`):**
   - Clean cream backdrop, sharp authentication card, pill tab switcher, reset modal

8. **Admin Portal (`admin.html`, `admin.css`, `admin.js`):**
   - Fixed stylesheet from deprecated `stubs.css` to dedicated `admin.css`
   - Staff moderation queue for pending stories

9. **Other Pages (`videos.html`, `news.html`, `events.html`, `donate.html`, `404.html`):**
   - Elevated with warm cream headers, consistent navigation, and 4-column footers

10. **Team Prompts (`prompts/guy1-5`):**
    - Completely regenerated with updated design tokens, anti-patterns, and file boundaries

---

## 5. How to Run & Verify Locally

```bash
# In the project directory:
npx serve .
# Or Python:
python -m http.server 8080
```
> **Note:** Because ES Modules (`<script type="module">`) are used, you cannot view the site via `file://` — an HTTP server is required.

---

## 6. What's Next / Handover Checklist for the Next Session

- [x] Shared design system, tokens, and components fully updated
- [x] Home page redesigned
- [x] Directory redesigned
- [x] Auth pages updated
- [x] Profile preview card synchronized
- [x] All 5 team member prompts updated in `prompts/`
- [ ] Guy 1-5 to begin their feature expansions in their assigned files
- [ ] Connect real Firebase project credentials in `js/firebase-config.js` when ready for production deployment
