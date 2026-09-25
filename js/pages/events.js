/**
 * ==========================================================================
 * PAGE LOGIC: ALUMNI EVENTS & REUNIONS (events.html)
 * Owner: Guy 4 — Events Developer
 * Features:
 * - Past Events directory featuring verified institutional media (YouTube & Instagram)
 * - Dynamic YouTube URL detection & responsive 16:9 embedded player
 * - Support for watch?v=, youtu.be/, live/, and shorts/ YouTube formats
 * - Support for multiple media items per event (YouTube embeds + Instagram links)
 * - Upcoming Events directory featuring Shurjan 5.0 and Ayayakt 6.0
 * - Clean modular pagination (6 items per page) for scalability
 * - Accessible lightweight Media Viewer Modal with stop-on-close playback control
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
    mediaCategory: 'Live Stream Recording',
    mediaUrl: 'https://www.youtube.com/live/kbz_m7rsxtg?si=nW83l1oNnK6KRcpw'
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
    mediaCategory: 'Shorts Highlight',
    mediaUrl: 'https://youtube.com/shorts/DLVOemFDeX4?si=o2GzIdJ5ImCDWT2a'
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
    mediaCategory: 'Video Showcase',
    mediaUrl: 'https://youtu.be/GHpgeeI9b2A?si=Kxt3-Tc586XRedLa'
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
    mediaCategory: 'Keynote Panel',
    mediaUrl: 'https://youtu.be/kxIuh21ZP6o?si=1ah2fa5D9MZqHylJ'
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
    mediaCategory: 'Gala Live Stream',
    mediaUrl: 'https://www.youtube.com/live/qBfPCK69Q3A?si=AF8K98herAXEtjRi'
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
    mediaCategory: 'Instagram Reel',
    mediaUrl: 'https://www.instagram.com/reel/DQih0tEj3Az/?stkn=M2pjeXlrMTh0ZmQw'
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
    mediaCategory: 'Instagram Reel',
    mediaUrl: 'https://www.instagram.com/reel/DQOqtFDj1Rf/?stkn=dXRtb2l6YXV5M3Jt'
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
   2. YOUTUBE URL PARSER & MEDIA DETECTOR
   Converts:
   - youtube.com/watch?v=...
   - youtu.be/...
   - youtube.com/live/...
   - youtube.com/shorts/...
   - youtube.com/embed/...
   -------------------------------------------------------------------------- */

/**
 * Extracts 11-character YouTube video ID from any standard YouTube URL
 * @param {string} url - Input URL to parse
 * @returns {string|null} - YouTube video ID or null
 */
function extractYouTubeVideoId(url) {
  if (!url || typeof url !== 'string') return null;
  const cleanUrl = url.trim();

  // 1. youtube.com/shorts/VIDEO_ID
  const shortsMatch = cleanUrl.match(/(?:https?:\/\/)?(?:www\.|m\.)?youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/i);
  if (shortsMatch && shortsMatch[1]) return shortsMatch[1];

  // 2. youtube.com/live/VIDEO_ID
  const liveMatch = cleanUrl.match(/(?:https?:\/\/)?(?:www\.|m\.)?youtube\.com\/live\/([a-zA-Z0-9_-]{11})/i);
  if (liveMatch && liveMatch[1]) return liveMatch[1];

  // 3. youtu.be/VIDEO_ID
  const shortUrlMatch = cleanUrl.match(/(?:https?:\/\/)?youtu\.be\/([a-zA-Z0-9_-]{11})/i);
  if (shortUrlMatch && shortUrlMatch[1]) return shortUrlMatch[1];

  // 4. youtube.com/watch?v=VIDEO_ID
  const watchMatch = cleanUrl.match(/(?:https?:\/\/)?(?:www\.|m\.)?youtube\.com\/watch\?(?:.*&)?v=([a-zA-Z0-9_-]{11})/i);
  if (watchMatch && watchMatch[1]) return watchMatch[1];

  // 5. youtube.com/embed/VIDEO_ID
  const embedMatch = cleanUrl.match(/(?:https?:\/\/)?(?:www\.|m\.)?youtube(?:-nocookie)?\.com\/embed\/([a-zA-Z0-9_-]{11})/i);
  if (embedMatch && embedMatch[1]) return embedMatch[1];

  // 6. Generic query parameter fallback
  try {
    const parsed = new URL(cleanUrl);
    if (parsed.searchParams.has('v')) {
      const v = parsed.searchParams.get('v');
      if (v && v.length === 11) return v;
    }
  } catch (e) {
    // If not a valid standard URL, return null
  }

  return null;
}

/**
 * Normalizes all media sources for an event into a unified list.
 * Supports multiple YouTube videos, Instagram Reels, or fallback links.
 * @param {object} event - Event data object
 * @returns {Array} - Array of normalized media items
 */
function getEventMediaList(event) {
  const list = [];
  const seenUrls = new Set();

  function addMedia(rawUrl, label) {
    if (!rawUrl || typeof rawUrl !== 'string') return;
    const url = rawUrl.trim();
    if (!url || seenUrls.has(url)) return;
    seenUrls.add(url);

    const ytId = extractYouTubeVideoId(url);
    if (ytId) {
      list.push({
        type: 'youtube',
        url: url,
        videoId: ytId,
        embedUrl: `https://www.youtube.com/embed/${ytId}`,
        label: label || 'YouTube Video'
      });
    } else if (/instagram\.com\/(?:reel|p|tv)\//i.test(url) || url.includes('instagram.com')) {
      list.push({
        type: 'instagram',
        url: url,
        label: label || 'Instagram Reel'
      });
    } else {
      list.push({
        type: 'other',
        url: url,
        label: label || 'External Media'
      });
    }
  }

  // Check multiple media sources if defined
  if (Array.isArray(event.media)) {
    event.media.forEach(item => {
      if (typeof item === 'string') {
        addMedia(item);
      } else if (item && typeof item === 'object') {
        addMedia(item.url || item.src, item.title || item.label);
      }
    });
  }

  if (Array.isArray(event.mediaUrls)) {
    event.mediaUrls.forEach(url => addMedia(url));
  }

  // Check single properties
  if (event.mediaUrl) addMedia(event.mediaUrl, event.mediaCategory);
  if (event.youtubeUrl) addMedia(event.youtubeUrl, 'YouTube Video');
  if (event.videoUrl) addMedia(event.videoUrl, 'Video Recording');

  return list;
}

/* --------------------------------------------------------------------------
   3. STATE MANAGEMENT
   -------------------------------------------------------------------------- */
let pastEventsCurrentPage = 1;
let upcomingEventsCurrentPage = 1;
let lastFocusedElement = null;

/* --------------------------------------------------------------------------
   4. DOM ELEMENT REFERENCES
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
   5. TEMPLATE RENDERING FUNCTIONS
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
        <button type="button" class="btn btn-outline btn-sm view-media-btn" data-event-id="${escapeHTML(event.id)}" data-media-url="${escapeHTML(event.mediaUrl || '')}">
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
   6. MEDIA VIEWER MODAL LOGIC (YouTube Embeds & Instagram Highlights)
   -------------------------------------------------------------------------- */

/**
 * Opens the lightweight Media Viewer Modal for an event.
 * Detects YouTube videos from all supported formats and renders playable iframes.
 * Handles Instagram Reels with dedicated launch cards.
 * Supports multiple media sources cleanly and responsively.
 * @param {object} event - Event details object
 */
function openMediaModal(event) {
  if (!mediaModal || !event) return;

  lastFocusedElement = document.activeElement;

  if (mediaModalTitle) {
    mediaModalTitle.textContent = `${event.title} — Event Media`;
  }

  // Extract all media sources for this event
  const mediaList = getEventMediaList(event);
  const hasYouTube = mediaList.some(m => m.type === 'youtube');
  const hasInstagram = mediaList.some(m => m.type === 'instagram');

  if (mediaModalBadge) {
    if (hasYouTube && hasInstagram) {
      mediaModalBadge.textContent = 'Video & Social Highlights';
    } else if (hasYouTube) {
      mediaModalBadge.textContent = 'YouTube Video';
    } else if (hasInstagram) {
      mediaModalBadge.textContent = 'Instagram Reel';
    } else {
      mediaModalBadge.textContent = 'Event Media';
    }
  }

  let mediaContentHTML = '';

  if (mediaList.length > 0) {
    const youtubeItems = mediaList.filter(m => m.type === 'youtube');
    const instagramItems = mediaList.filter(m => m.type === 'instagram');
    const otherItems = mediaList.filter(m => m.type === 'other');

    // 1. Render YouTube videos as playable responsive embedded iframes
    youtubeItems.forEach((yt, index) => {
      const isMultiple = youtubeItems.length > 1;
      mediaContentHTML += `
        <div class="media-video-section">
          ${isMultiple ? `<h4 class="media-video-subheading">Video ${index + 1}: ${escapeHTML(yt.label || 'Video Recording')}</h4>` : ''}
          <div class="media-video-container">
            <iframe 
              src="${escapeHTML(yt.embedUrl)}" 
              title="${escapeHTML(event.title)}${isMultiple ? ` - Video ${index + 1}` : ''}" 
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              referrerpolicy="strict-origin-when-cross-origin" 
              allowfullscreen>
            </iframe>
          </div>
          <div class="media-video-secondary-bar">
            <a href="${escapeHTML(yt.url)}" target="_blank" rel="noopener noreferrer" class="media-external-direct-link">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              <span>Open on YouTube &nearr;</span>
            </a>
          </div>
        </div>
      `;
    });

    // 2. Render Instagram Reels as clear external preview cards
    instagramItems.forEach(ig => {
      mediaContentHTML += `
        <div class="media-instagram-card">
          <div class="media-instagram-header">
            <svg class="instagram-icon" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
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
            <a href="${escapeHTML(ig.url)}" target="_blank" rel="noopener noreferrer" class="media-instagram-overlay" aria-label="Watch Reel on Instagram">
              <svg width="44" height="44" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            </a>
          </div>
          <p class="media-subnote">This highlight was published as an Instagram Reel. Click below to view the original video on Instagram.</p>
          <div style="margin-top: var(--space-3); margin-bottom: var(--space-2);">
            <a href="${escapeHTML(ig.url)}" class="btn btn-primary btn-sm" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; gap: 6px;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              View on Instagram &nearr;
            </a>
          </div>
        </div>
      `;
    });

    // 3. Render any generic external links
    otherItems.forEach(other => {
      mediaContentHTML += `
        <div class="media-other-link-box" style="margin-bottom: var(--space-3);">
          <a href="${escapeHTML(other.url)}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm">
            View External Resource &nearr;
          </a>
        </div>
      `;
    });
  } else {
    mediaContentHTML = `
      <div class="media-info-block" style="text-align: center; padding: var(--space-6);">
        <p style="color: var(--color-text-muted); margin-bottom: 0;">Media recordings for this gathering are currently being prepared by the campus archive team.</p>
      </div>
    `;
  }

  // Append Event Metadata & Description Block
  mediaContentHTML += `
    <div class="media-info-block">
      <div class="media-meta-text">
        <strong>Date:</strong> ${escapeHTML(event.dateDisplay || `${event.month} ${event.day}, ${event.year}`)} &bull; 
        <strong>Venue:</strong> ${escapeHTML(event.location)}
      </div>
      ${event.speaker ? `<div style="font-size: var(--text-xs); color: var(--color-text-muted); margin-bottom: var(--space-2);">${escapeHTML(event.speaker)}</div>` : ''}
      <p class="media-desc-text">${escapeHTML(event.description)}</p>
    </div>
  `;

  if (mediaModalBody) {
    mediaModalBody.innerHTML = mediaContentHTML;
  }

  // Update Footer Primary Action Link
  if (mediaExternalLink) {
    if (mediaList.length > 0) {
      const primary = mediaList[0];
      mediaExternalLink.href = primary.url;
      mediaExternalLink.style.display = 'inline-flex';
      if (primary.type === 'youtube') {
        mediaExternalLink.textContent = 'Open on YouTube ↗';
      } else if (primary.type === 'instagram') {
        mediaExternalLink.textContent = 'View on Instagram ↗';
      } else {
        mediaExternalLink.textContent = 'Open Link ↗';
      }
    } else {
      mediaExternalLink.style.display = 'none';
    }
  }

  mediaModal.removeAttribute('hidden');
  document.body.style.overflow = 'hidden';

  if (closeMediaModalBtn) {
    closeMediaModalBtn.focus();
  }
}

/**
 * Closes the Media Viewer Modal and cleans up iframes to immediately halt video/audio playback
 */
function closeMediaModal() {
  if (!mediaModal) return;

  mediaModal.setAttribute('hidden', '');
  document.body.style.overflow = '';

  // Crucial: Clear innerHTML to immediately stop YouTube iframe audio & video playback
  if (mediaModalBody) {
    mediaModalBody.innerHTML = '';
  }

  if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
    lastFocusedElement.focus();
  }
}

/* --------------------------------------------------------------------------
   7. EVENT LISTENERS & INITIALIZATION
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
      let foundEvent = PAST_EVENTS_DATA.find(ev => ev.id === eventId);

      // Fallback: If not found by ID, build event object from button / card DOM attributes
      if (!foundEvent) {
        const card = btn.closest('.event-card');
        const mediaUrl = btn.dataset.mediaUrl || card?.dataset.mediaUrl;
        if (mediaUrl || card) {
          foundEvent = {
            id: eventId || 'custom-event',
            title: card?.querySelector('.event-card-title')?.textContent?.trim() || 'Event Media',
            description: card?.querySelector('.event-card-desc')?.textContent?.trim() || '',
            dateDisplay: card?.querySelector('.event-date-badge')?.getAttribute('aria-label')?.replace('Date: ', '') || '',
            location: card?.querySelectorAll('.event-meta-item')[1]?.textContent?.trim() || 'Campus',
            speaker: card?.querySelectorAll('.event-meta-item')[2]?.textContent?.trim() || '',
            coverImage: card?.querySelector('.event-card-img')?.getAttribute('src') || '',
            mediaUrl: mediaUrl
          };
        }
      }

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
