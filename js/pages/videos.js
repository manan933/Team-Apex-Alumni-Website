/**
 * ==========================================================================
 * PAGE LOGIC: VIDEOS (videos.html)
 * Alumni Video Gallery — category filter, bento grid, theater modal
 * ==========================================================================
 */

// TODO(shared): once Firestore is wired for the whole project, replace
// this static array with a Firestore query on the 'videos' collection
// (fields: title, youtubeId, description, category, addedAt). Do not change
// this yourself without checking with the project owner — this file may be
// consumed by home.js for the homepage preview.

const videos = [
  {
    id: 'v-001',
    youtubeId: 'Ks-_Mh1QhMc',
    title: 'Words of Experience — Presence & Leadership',
    category: 'Interviews',
    imageOverride: 'videos images/interview 1.jpeg',
    description: 'Distinguished alumna Dr. Priya Mehta explores how confident executive presence and body language reshape career trajectories in today\'s hybrid work landscape.',
    addedAt: '2026-08-15'
  },
  {
    id: 'v-002',
    youtubeId: 'iG9CE55wbtY',
    title: 'Annual Celebration — The Creativity Forum',
    category: 'Events',
    imageOverride: 'videos images/event1.jpg',
    description: 'A panel of Apex alumni leaders revisit the landmark debate on transformative education and lifelong learning in the age of AI.',
    addedAt: '2026-07-22'
  },
  {
    id: 'v-003',
    youtubeId: 'aircAruvnKk',
    title: 'From GIET to Industry — Understanding Neural Networks',
    category: 'Interviews',
    imageOverride: 'videos images/interview 2.jpeg',
    description: 'Apex alumnus and DeepMind researcher Rohan Verma breaks down foundational AI concepts for a broad alumni audience — no PhD required.',
    addedAt: '2026-06-30'
  },
  {
    id: 'v-004',
    youtubeId: '8jPQjjsBbIc',
    title: 'Avyat — Distinguished Speaker Series',
    category: 'Events',
    imageOverride: 'videos images/event2.jpeg',
    description: 'MIT\'s celebrated communication masterclass, hosted at Apex University\'s annual Distinguished Speakers Weekend. A must-watch for every alumnus.',
    addedAt: '2026-05-18'
  },
  {
    id: 'v-005',
    youtubeId: 'UF8uR6Z6KLc',
    title: 'Batch Reunion — Connecting the Dots',
    category: 'Reunions',
    imageOverride: 'videos images/reunioun1.jpg',
    description: 'The iconic commencement address that inspired a generation of Apex graduates — replayed at our 45th Foundation Anniversary gala celebration.',
    addedAt: '2026-04-10'
  },
  {
    id: 'v-006',
    youtubeId: 'vpW2sGlCtaE',
    title: 'GIET Reunita — Highlights of a Landmark Evening',
    category: 'Reunions',
    imageOverride: 'videos images/reunioun2.jpg',
    description: 'Relive the most memorable moments from our sold-out annual alumni gala, including the Outstanding Alumni Award ceremony and live performances.',
    addedAt: '2026-03-05'
  },
  {
    id: 'v-007',
    youtubeId: 'L_LUpnjgPso',
    title: 'A Day at GIET — Exploring New Innovation Labs',
    category: 'Campus Life',
    description: 'Take a guided video tour of Apex University\'s newly unveiled STEM Innovation Complex, collaborative maker studios, and expanded campus green spaces.',
    addedAt: '2026-02-20'
  },
  {
    id: 'v-008',
    youtubeId: 'bTqVqk7FSmY',
    title: 'Alumni Meet — Singapore Regional Summit',
    category: 'Events',
    imageOverride: 'videos images/event3.jpg',
    description: 'Full recap of the Singapore alumni chapter\'s annual summit: networking sessions, startup pitches, a cultural evening, and the chapter leadership handover.',
    addedAt: '2026-01-14'
  }
];

// ─── State ────────────────────────────────────────────────────────────────────
let activeCategory = 'All';
let lastFocused = null; // for returning focus after modal closes

// Build a lookup map for O(1) access by id
const videoMap = new Map(videos.map(v => [v.id, v]));

// ─── Boot ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  buildPills();
  renderGrid();
  initModal();
  initScrollReveal();
});

// ─── Category Filter Pills ────────────────────────────────────────────────────
function buildPills() {
  const container = document.getElementById('video-category-pills');
  if (!container) return;

  const categories = ['All', ...new Set(videos.map(v => v.category))];

  container.innerHTML = categories.map(cat => `
    <button
      class="category-pill${cat === activeCategory ? ' active' : ''}"
      data-cat="${escapeAttr(cat)}"
      aria-pressed="${cat === activeCategory}"
      type="button"
    >${escapeHTML(cat)}</button>
  `).join('');

  container.addEventListener('click', e => {
    const pill = e.target.closest('.category-pill');
    if (!pill) return;
    const cat = pill.dataset.cat;
    if (cat === activeCategory) return;

    activeCategory = cat;
    container.querySelectorAll('.category-pill').forEach(p => {
      p.classList.remove('active');
      p.setAttribute('aria-pressed', 'false');
    });
    pill.classList.add('active');
    pill.setAttribute('aria-pressed', 'true');
    renderGrid();
  });
}

// ─── Video Grid Renderer ──────────────────────────────────────────────────────
function renderGrid() {
  const grid = document.getElementById('videos-grid');
  if (!grid) return;

  const list = activeCategory === 'All'
    ? videos
    : videos.filter(v => v.category === activeCategory);

  if (!list.length) {
    grid.innerHTML = `
      <div class="vg-empty-state" role="status">
        <div class="vg-empty-icon" aria-hidden="true">🎬</div>
        <h3 class="vg-empty-title">No Videos in This Category</h3>
        <p class="vg-empty-text">There are no recordings in the <strong>${escapeHTML(activeCategory)}</strong> category yet. Check back soon or browse another category above.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = list.map((v, idx) => buildCardHTML(v, idx)).join('');
  initScrollReveal();
}

function buildCardHTML(v, idx) {
  const thumbUrl = v.imageOverride || `https://img.youtube.com/vi/${encodeURIComponent(v.youtubeId)}/hqdefault.jpg`;
  const featuredClass = '';
  const dateLabel = formatDate(v.addedAt);

  return `
    <article
      class="video-card${featuredClass} reveal"
      data-vid-id="${escapeAttr(v.id)}"
      tabindex="0"
      role="button"
      aria-label="Play video: ${escapeAttr(v.title)}"
    >
      <div class="video-thumb-wrap">
        <img
          src="${thumbUrl}"
          alt="Thumbnail for ${escapeAttr(v.title)}"
          class="video-thumb-img"
          loading="lazy"
          decoding="async"
          onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'640\' height=\'360\'%3E%3Crect width=\'640\' height=\'360\' fill=\'%230B192C\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' dominant-baseline=\'middle\' text-anchor=\'middle\' fill=\'%23D4AF37\' font-size=\'48\'%3E▶%3C/text%3E%3C/svg%3E'"
        />
        <div class="video-play-btn" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <polygon points="5 3 19 12 5 21 5 3"/>
          </svg>
        </div>
        <div class="video-hover-overlay" aria-hidden="true">
          <span class="vho-cat">${escapeHTML(v.category)}</span>
          <p class="vho-title">${escapeHTML(v.title)}</p>
        </div>
      </div>
      <div class="video-card-body">
        <span class="video-card-cat">${escapeHTML(v.category)}</span>
        <h3 class="video-card-title">${escapeHTML(v.title)}</h3>
        <p class="video-card-desc">${escapeHTML(v.description)}</p>
        <time class="video-card-date" datetime="${escapeAttr(v.addedAt)}">${escapeHTML(dateLabel)}</time>
      </div>
    </article>
  `;
}

// ─── Theater Modal ────────────────────────────────────────────────────────────
function initModal() {
  const modal = document.getElementById('theater-modal');
  const closeBtn = document.getElementById('close-theater-modal');
  const grid = document.getElementById('videos-grid');
  if (!modal) return;

  // Click on video card
  grid?.addEventListener('click', handleCardActivate);

  // Keyboard on video card (Enter / Space)
  grid?.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardActivate(e);
    }
  });

  // Close button
  closeBtn?.addEventListener('click', closeModal);

  // Backdrop click closes
  modal.addEventListener('click', e => {
    if (e.target === modal) closeModal();
  });

  // Esc closes
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });

  // Trap focus strictly within modal
  modal.addEventListener('keydown', handleFocusTrap);
}

function handleCardActivate(e) {
  const card = e.target.closest('.video-card');
  if (!card) return;
  const vid = videoMap.get(card.dataset.vidId);
  if (vid) openModal(vid, card);
}

function openModal(vid, triggerEl) {
  const modal = document.getElementById('theater-modal');
  const iframe = document.getElementById('theater-iframe');
  const titleEl = document.getElementById('theater-video-title');
  const descEl = document.getElementById('theater-video-desc');
  const catEl = document.getElementById('theater-video-cat');
  if (!modal || !iframe) return;

  // Remember who triggered this for return-focus
  lastFocused = triggerEl || document.activeElement;

  // Set iframe src (lazy load — only happens on click)
  iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(vid.youtubeId)}?autoplay=1&rel=0&modestbranding=1`;

  // Update metadata
  if (titleEl) titleEl.textContent = vid.title;
  if (descEl) descEl.textContent = vid.description;
  if (catEl) catEl.textContent = vid.category;

  // Open
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden'; // prevent background scroll

  // Move focus into modal
  requestAnimationFrame(() => {
    modal.focus();
  });
}

function closeModal() {
  const modal = document.getElementById('theater-modal');
  const iframe = document.getElementById('theater-iframe');
  if (!modal) return;

  // Stop playback immediately
  if (iframe) iframe.src = '';

  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';

  // Return focus to the triggering element
  if (lastFocused && typeof lastFocused.focus === 'function') {
    requestAnimationFrame(() => lastFocused.focus());
    lastFocused = null;
  }
}

// Focus trap: keep Tab / Shift+Tab within the modal dialog
function handleFocusTrap(e) {
  if (e.key !== 'Tab') return;
  const modal = e.currentTarget;

  const focusable = [...modal.querySelectorAll(
    'a[href], button:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])'
  )].filter(el => !el.closest('[aria-hidden="true"]'));

  if (!focusable.length) { e.preventDefault(); return; }

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (e.shiftKey) {
    if (document.activeElement === first || document.activeElement === modal) {
      e.preventDefault(); last.focus();
    }
  } else {
    if (document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  }
}

// ─── Scroll Reveal ────────────────────────────────────────────────────────────
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const io = new IntersectionObserver(
    entries => entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); }
    }),
    { threshold: 0.12 }
  );
  els.forEach(el => io.observe(el));
}

// ─── Utilities ────────────────────────────────────────────────────────────────
function escapeHTML(str) {
  if (!str) return '';
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

function escapeAttr(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function formatDate(iso) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return iso;
  }
}
