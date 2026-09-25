/**
 * ==========================================================================
 * PAGE LOGIC: ALUMNI EVENTS & REUNIONS (events.html)
 * Owner: Guy 4 — Events Developer
 * Features:
 * - Past Events directory featuring verified institutional media (YouTube & Instagram)
 * - Upcoming Events directory featuring Shurjan 5.0 and Ayayakt 6.0
 * - Clean modular pagination (6 items per page) for scalability
 * - Accessible lightweight Media Viewer Modal with autoplay and stop-on-close
 * ==========================================================================
 */

/* --------------------------------------------------------------------------
   1. CONSTANTS & EVENT DATASETS
   -------------------------------------------------------------------------- */
const PAGE_SIZE = 6;

/**
 * Past Events Dataset
 * Features verified media links (YouTube Live/Videos/Shorts & Instagram Reels)
 * with easily replaceable titles and metadata.
 */
const PAST_EVENTS_DATA = [
  {
    id: 'past-event-1',
    title: 'Alumni Cultural Gathering',
    month: 'MAR',
    day: '15',
    year: '2026',
    dateDisplay: 'Sunday, March 15, 2026',
    time: '6:00 PM – 9:30 PM',
    location: 'University Auditorium & Amphitheatre',
    speaker: 'Guest: Alumni Cultural Committee & Faculty',
    description: 'An evening celebrating artistic performances, music, and dramatic arts by current students and returning alumni cohorts.',
    coverImage: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
    mediaType: 'YouTube',
    mediaCategory: 'Live Stream Recording',
    mediaUrl: 'https://www.youtube.com/live/kbz_m7rsxtg?si=nW83l1oNnK6KRcpw',
    embedUrl: 'kbz_m7rsxtg'
  },
  {
    id: 'past-event-2',
    title: 'Annual Alumni Meet',
    month: 'FEB',
    day: '20',
    year: '2026',
    dateDisplay: 'Friday, February 20, 2026',
    time: '10:00 AM – 4:00 PM',
    location: 'Apex Grand Conference Center',
    speaker: 'Guest: Chancellor & Distinguished Alumni Panel',
    description: 'Our flagship gathering celebrating university milestones, alumni achievements, and collaborative community mentorship initiatives.',
    coverImage: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80',
    mediaType: 'YouTube',
    mediaCategory: 'Shorts Highlight',
    mediaUrl: 'https://youtube.com/shorts/DLVOemFDeX4?si=o2GzIdJ5ImCDWT2a',
    embedUrl: 'https://www.youtube-nocookie.com/embed/DLVOemFDeX4'
  },
  {
    id: 'past-event-3',
    title: 'Campus Reunion Highlights',
    month: 'JAN',
    day: '18',
    year: '2026',
    dateDisplay: 'Sunday, January 18, 2026',
    time: '11:00 AM – 3:30 PM',
    location: 'Central Campus Quadrangle',
    speaker: 'Guest: Class Coordinators & Association Board',
    description: 'Milestone reunion welcoming alumni back to campus for department walkthroughs, laboratory tours, and celebratory campus moments.',
    coverImage: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=800&q=80',
    mediaType: 'YouTube',
    mediaCategory: 'Video Showcase',
    mediaUrl: 'https://youtu.be/GHpgeeI9b2A?si=Kxt3-Tc586XRedLa',
    embedUrl: 'GHpgeeI9b2A'
  },
  {
    id: 'past-event-4',
    title: 'Alumni Talk & Leadership Panel',
    month: 'DEC',
    day: '10',
    year: '2025',
    dateDisplay: 'Wednesday, December 10, 2025',
    time: '4:00 PM – 6:30 PM',
    location: 'Science & Technology Lecture Hall',
    speaker: 'Guest: Industry Leaders & Research Fellows',
    description: 'An insightful panel discussion highlighting career trajectories, technological disruptions, and emerging leadership opportunities.',
    coverImage: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80',
    mediaType: 'YouTube',
    mediaCategory: 'Keynote Panel',
    mediaUrl: 'https://youtu.be/kxIuh21ZP6o?si=1ah2fa5D9MZqHylJ',
    embedUrl: 'https://www.youtube-nocookie.com/embed/kxIuh21ZP6o'
  },
  {
    id: 'past-event-5',
    title: 'Grand Alumni Reunion Gala',
    month: 'NOV',
    day: '15',
    year: '2025',
    dateDisplay: 'Saturday, November 15, 2025',
    time: '7:00 PM – 10:30 PM',
    location: 'Heritage Ballroom, University Club',
    speaker: 'Guest: Alumni Association Executive Board',
    description: 'An elegant evening of dining, live music fellowship, and commemorative reflections marking university milestones and achievements.',
    coverImage: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80',
    mediaType: 'YouTube',
    mediaCategory: 'Gala Live Stream',
    mediaUrl: 'https://www.youtube.com/live/qBfPCK69Q3A?si=AF8K98herAXEtjRi',
    embedUrl: 'https://www.youtube-nocookie.com/embed/qBfPCK69Q3A'
  },
  {
    id: 'past-event-6',
    title: 'Student-Alumni Spotlight',
    month: 'OCT',
    day: '28',
    year: '2025',
    dateDisplay: 'Tuesday, October 28, 2025',
    time: '2:00 PM – 5:00 PM',
    location: 'Innovation & Design Atrium',
    speaker: 'Guest: Student Mentorship Circle',
    description: 'Candid moments and reflections connecting senior alumni mentors with student project teams and young researchers.',
    coverImage: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
    mediaType: 'Instagram',
    mediaCategory: 'Instagram Reel',
    mediaUrl: 'https://www.instagram.com/reel/DQih0tEj3Az/?stkn=M2pjeXlrMTh0ZmQw',
    embedUrl: null
  },
  {
    id: 'past-event-7',
    title: 'Campus Moments & Memories',
    month: 'SEP',
    day: '19',
    year: '2025',
    dateDisplay: 'Friday, September 19, 2025',
    time: '3:00 PM – 7:00 PM',
    location: 'Student Union & Old Courtyard',
    speaker: 'Guest: Alumni Heritage Society',
    description: 'A heartwarming look back at memorable campus traditions, nostalgic walks, and timeless bonds forged at Apex University.',
    coverImage: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80',
    mediaType: 'Instagram',
    mediaCategory: 'Instagram Reel',
    mediaUrl: 'https://www.instagram.com/reel/DQOqtFDj1Rf/?stkn=dXRtb2l6YXV5M3Jt',
    embedUrl: null
  }
];

/**
 * Upcoming Events Dataset
 * Includes Shurjan 5.0 and Ayayakt 6.0 with clean, replaceable fields.
 */
const UPCOMING_EVENTS_DATA = [
  {
    id: 'upcoming-event-1',
    title: 'Shurjan 5.0',
    month: 'NOV',
    day: '20',
    year: '2026',
    dateDisplay: 'November 20–22, 2026',
    time: '9:00 AM – 9:00 PM Daily (Nov 20–22, 2026)',
    location: 'Apex University Main Campus & Stadium',
    speaker: 'Organizer: Student Council & Festival Directorate',
    description: "The 5th edition of Apex University's flagship annual cultural and technical festival. Features inter-batch hackathons, music performances, startup pitch competitions, and alumni reunions.",
    coverImage: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
    badgeText: 'Upcoming Gathering',
    statusNote: 'Open to All Alumni & Students'
  },
  {
    id: 'upcoming-event-2',
    title: 'Ayayakt 6.0',
    month: 'JAN',
    day: '15',
    year: '2027',
    dateDisplay: 'January 15–17, 2027',
    time: '10:00 AM – 6:00 PM (Jan 15–17, 2027)',
    location: 'Grand Innovation Hall & Apex Convention Center',
    speaker: 'Organizer: Apex Leadership Forum & Alumni Board',
    description: 'The 6th annual leadership and technology conclave uniting global alumni innovators, founders, policy experts, and academic leaders for keynote dialogues and collaborative masterclasses.',
    coverImage: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=800&q=80',
    badgeText: 'Upcoming Gathering',
    statusNote: 'Program Schedule Announced'
  }
];

/* --------------------------------------------------------------------------
   2. STATE MANAGEMENT
   -------------------------------------------------------------------------- */
let pastEventsCurrentPage = 1;
let upcomingEventsCurrentPage = 1;
let lastFocusedElement = null;

/* --------------------------------------------------------------------------
   3. DOM ELEMENT REFERENCES
   -------------------------------------------------------------------------- */
const pastEventsList = document.getElementById('past-events-list');
const pastEventsPagination = document.getElementById('past-events-pagination');
const upcomingEventsList = document.getElementById('upcoming-events-list');
const upcomingEventsPagination = document.getElementById('upcoming-events-pagination');

// Media Viewer Modal Elements
const mediaModal = document.getElementById('media-modal');
const closeMediaModalBtn = document.getElementById('close-media-modal');
const mediaModalCloseBtn = document.getElementById('media-modal-close-btn');
const mediaModalBody = document.getElementById('media-modal-body');
const mediaModalTitle = document.getElementById('media-modal-title');
const mediaModalBadge = document.getElementById('media-modal-badge');
const mediaExternalLink = document.getElementById('media-external-link');

/* --------------------------------------------------------------------------
   4. TEMPLATE RENDERING FUNCTIONS
   -------------------------------------------------------------------------- */

/**
 * Creates HTML string for a single Past Event card
 */
function createPastEventCardHTML(event) {
  return `
    <article class="event-card" data-event-id="${escapeHTML(event.id)}">
      <div class="event-card-img-wrap">
        <img src="${escapeHTML(event.coverImage)}" alt="${escapeHTML(event.title)}" class="event-card-img" loading="lazy" />
        <span class="event-card-badge-floating badge badge-accent">${escapeHTML(event.mediaCategory || 'Recorded Media')}</span>
        <div class="event-card-date-floating event-date-badge" aria-label="Date: ${escapeHTML(event.month)} ${escapeHTML(event.day)}, ${escapeHTML(event.year)}">
          <span class="event-date-month">${escapeHTML(event.month)}</span>
          <span class="event-date-day">${escapeHTML(event.day)}</span>
        </div>
      </div>
      <div class="event-card-body">
        <h3 class="event-card-title">${escapeHTML(event.title)}</h3>
        <p class="event-card-desc">${escapeHTML(event.description)}</p>
        <div class="event-meta-list">
          <div class="event-meta-item">
            <svg class="event-meta-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            <span>${escapeHTML(event.time)}</span>
          </div>
          <div class="event-meta-item">
            <svg class="event-meta-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            <span>${escapeHTML(event.location)}</span>
          </div>
          <div class="event-meta-item">
            <svg class="event-meta-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            <span>${escapeHTML(event.speaker)}</span>
          </div>
        </div>
      </div>
      <div class="event-card-actions">
        <button type="button" class="btn btn-outline btn-sm view-media-btn" data-event-id="${escapeHTML(event.id)}">
          View Event Media &rarr;
        </button>
      </div>
    </article>
  `;
}

/**
 * Creates HTML string for a single Upcoming Event card
 */
function createUpcomingEventCardHTML(event) {
  return `
    <article class="event-card" data-event-id="${escapeHTML(event.id)}">
      <div class="event-card-img-wrap">
        <img src="${escapeHTML(event.coverImage)}" alt="${escapeHTML(event.title)}" class="event-card-img" loading="lazy" />
        <span class="event-card-badge-floating badge badge-primary">${escapeHTML(event.badgeText || 'Upcoming Gathering')}</span>
        <div class="event-card-date-floating event-date-badge" aria-label="Date: ${escapeHTML(event.month)} ${escapeHTML(event.day)}, ${escapeHTML(event.year)}">
          <span class="event-date-month">${escapeHTML(event.month)}</span>
          <span class="event-date-day">${escapeHTML(event.day)}</span>
        </div>
      </div>
      <div class="event-card-body">
        <h3 class="event-card-title">${escapeHTML(event.title)}</h3>
        <p class="event-card-desc">${escapeHTML(event.description)}</p>
        <div class="event-meta-list">
          <div class="event-meta-item">
            <svg class="event-meta-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            <span>${escapeHTML(event.time)}</span>
          </div>
          <div class="event-meta-item">
            <svg class="event-meta-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            <span>${escapeHTML(event.location)}</span>
          </div>
          <div class="event-meta-item">
            <svg class="event-meta-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            <span>${escapeHTML(event.speaker)}</span>
          </div>
        </div>
      </div>
      <div class="event-card-actions">
        <span class="upcoming-status-badge">
          <span class="status-dot" aria-hidden="true"></span>
          ${escapeHTML(event.statusNote || 'Upcoming Gathering')}
        </span>
      </div>
    </article>
  `;
}

/**
 * Renders Past Events for the specified page
 */
function renderPastEvents(page = 1) {
  if (!pastEventsList) return;
  pastEventsCurrentPage = page;

  const totalItems = PAST_EVENTS_DATA.length;
  const startIndex = (page - 1) * PAGE_SIZE;
  const pageItems = PAST_EVENTS_DATA.slice(startIndex, startIndex + PAGE_SIZE);

  pastEventsList.innerHTML = pageItems.map(createPastEventCardHTML).join('');
  renderPaginationControls('past', totalItems, PAGE_SIZE, page);
}

/**
 * Renders Upcoming Events for the specified page
 */
function renderUpcomingEvents(page = 1) {
  if (!upcomingEventsList) return;
  upcomingEventsCurrentPage = page;

  const totalItems = UPCOMING_EVENTS_DATA.length;
  const startIndex = (page - 1) * PAGE_SIZE;
  const pageItems = UPCOMING_EVENTS_DATA.slice(startIndex, startIndex + PAGE_SIZE);

  upcomingEventsList.innerHTML = pageItems.map(createUpcomingEventCardHTML).join('');
  renderPaginationControls('upcoming', totalItems, PAGE_SIZE, page);
}

/**
 * Builds and mounts pagination controls
 */
function renderPaginationControls(type, totalItems, pageSize, currentPage) {
  const container = type === 'past' ? pastEventsPagination : upcomingEventsPagination;
  if (!container) return;

  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  let pagesHTML = '';
  for (let i = 1; i <= totalPages; i++) {
    const isActive = i === currentPage;
    pagesHTML += `
      <button type="button" class="page-number ${isActive ? 'active' : ''}" data-page="${i}" ${isActive ? 'aria-current="page"' : ''}>
        ${i}
      </button>
    `;
  }

  container.innerHTML = `
    <nav class="pagination-nav" aria-label="${type === 'past' ? 'Past' : 'Upcoming'} events navigation">
      <button type="button" class="pagination-btn pagination-prev" aria-label="Previous ${type} events page" ${currentPage <= 1 ? 'disabled' : ''}>
        &larr; Previous
      </button>
      <div class="pagination-pages">
        ${pagesHTML}
      </div>
      <button type="button" class="pagination-btn pagination-next" aria-label="Next ${type} events page" ${currentPage >= totalPages ? 'disabled' : ''}>
        Next &rarr;
      </button>
    </nav>
  `;

  // Attach Pagination Event Listeners
  const prevBtn = container.querySelector('.pagination-prev');
  const nextBtn = container.querySelector('.pagination-next');
  const pageButtons = container.querySelectorAll('.page-number');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentPage > 1) {
        if (type === 'past') {
          renderPastEvents(currentPage - 1);
          scrollToSection('past-events-section');
        } else {
          renderUpcomingEvents(currentPage - 1);
          scrollToSection('upcoming-events-section');
        }
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentPage < totalPages) {
        if (type === 'past') {
          renderPastEvents(currentPage + 1);
          scrollToSection('past-events-section');
        } else {
          renderUpcomingEvents(currentPage + 1);
          scrollToSection('upcoming-events-section');
        }
      }
    });
  }

  pageButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedPage = parseInt(btn.dataset.page, 10);
      if (selectedPage && selectedPage !== currentPage) {
        if (type === 'past') {
          renderPastEvents(selectedPage);
          scrollToSection('past-events-section');
        } else {
          renderUpcomingEvents(selectedPage);
          scrollToSection('upcoming-events-section');
        }
      }
    });
  });
}

function scrollToSection(sectionId) {
  const el = document.getElementById(sectionId);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/* --------------------------------------------------------------------------
   5. MEDIA VIEWER MODAL LOGIC
   -------------------------------------------------------------------------- */

/**
 * Opens the lightweight Media Viewer Modal for a specific past event
 */
function openMediaModal(event) {
  if (!mediaModal || !event) return;

  lastFocusedElement = document.activeElement;

  if (mediaModalTitle) {
    mediaModalTitle.textContent = `${event.title} — Event Media`;
  }

  if (mediaModalBadge) {
    mediaModalBadge.textContent = event.mediaType === 'Instagram' ? 'Instagram Reel' : 'Video Recording';
  }

  if (mediaModalBody) {
    if (event.mediaType === 'YouTube' && event.embedUrl) {
      mediaModalBody.innerHTML = `
        <div class="media-video-container">
          <iframe 
           src="https://www.youtube-nocookie.com/embed/${escapeHTML(event.embedUrl)}?autoplay=1&rel=0&modestbranding=1" 
            title="${escapeHTML(event.title)}" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen>
          </iframe>
        </div>
        <div class="media-info-block">
          <p class="media-meta-text"><strong>Date:</strong> ${escapeHTML(event.dateDisplay)} &bull; <strong>Venue:</strong> ${escapeHTML(event.location)}</p>
          <p class="media-desc-text">${escapeHTML(event.description)}</p>
        </div>
      `;
    } else {
      // Instagram presentation card
      mediaModalBody.innerHTML = `
        <div class="media-instagram-card">
          <div class="media-instagram-header">
            <svg class="instagram-icon" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
            <div>
              <h4 class="media-instagram-title">Instagram Reel Highlight</h4>
              <span style="font-size: var(--text-xs); color: var(--color-text-muted);">Official Apex University Alumni Network</span>
            </div>
          </div>
          <div class="media-instagram-preview">
            <img src="${escapeHTML(event.coverImage)}" alt="${escapeHTML(event.title)}" class="media-instagram-thumb" />
            <div class="media-instagram-overlay">
              <svg width="44" height="44" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            </div>
          </div>
          <div class="media-info-block">
            <p class="media-meta-text"><strong>Date:</strong> ${escapeHTML(event.dateDisplay)} &bull; <strong>Venue:</strong> ${escapeHTML(event.location)}</p>
            <p class="media-desc-text">${escapeHTML(event.description)}</p>
            <p class="media-subnote">This highlight was published as an Instagram Reel. Click below to view the original full video and audio on Instagram.</p>
          </div>
        </div>
      `;
    }
  }

  if (mediaExternalLink) {
    mediaExternalLink.href = event.mediaUrl;
    mediaExternalLink.textContent = event.mediaType === 'Instagram' ? 'Open Reel on Instagram ↗' : 'Watch on YouTube ↗';
  }

  mediaModal.removeAttribute('hidden');
  document.body.style.overflow = 'hidden';

  if (closeMediaModalBtn) {
    closeMediaModalBtn.focus();
  }
}

/**
 * Closes the Media Viewer Modal and cleans up iframes to stop playback
 */
function closeMediaModal() {
  if (!mediaModal) return;

  mediaModal.setAttribute('hidden', '');
  document.body.style.overflow = '';

  // Clear modal body so video/audio stops playing immediately
  if (mediaModalBody) {
    mediaModalBody.innerHTML = '';
  }

  if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
    lastFocusedElement.focus();
  }
}

/* --------------------------------------------------------------------------
   6. EVENT LISTENERS & INITIALIZATION
   -------------------------------------------------------------------------- */

function initEventsPage() {
  // Render initial pages
  renderPastEvents(1);
  renderUpcomingEvents(1);

  // Delegated click listener for "View Event Media" buttons
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.view-media-btn');
    if (btn) {
      const eventId = btn.dataset.eventId;
      const foundEvent = PAST_EVENTS_DATA.find(ev => ev.id === eventId);
      if (foundEvent) {
        openMediaModal(foundEvent);
      }
    }
  });

  // Modal Close Handlers
  if (closeMediaModalBtn) {
    closeMediaModalBtn.addEventListener('click', closeMediaModal);
  }
  if (mediaModalCloseBtn) {
    mediaModalCloseBtn.addEventListener('click', closeMediaModal);
  }

  // Backdrop click closes modal
  if (mediaModal) {
    mediaModal.addEventListener('click', (e) => {
      if (e.target === mediaModal) {
        closeMediaModal();
      }
    });
  }

  // Escape key closes modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mediaModal && !mediaModal.hasAttribute('hidden')) {
      closeMediaModal();
    }
  });
}

/**
 * Utility: HTML sanitizer helper
 */
function escapeHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Self-initializing lifecycle
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initEventsPage);
} else {
  initEventsPage();
}
