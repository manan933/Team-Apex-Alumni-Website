/**
 * ==========================================================================
 * PAGE LOGIC: ALUMNI EVENTS & REUNIONS (events.html)
 * Owner: Guy 4 — Events Developer
 * Features:
 * - Category filter tabs (All Gatherings, Reunions, Dinners, Webinars, Panels)
 * - Split month/day event cards with realistic academic schedules
 * - Event Schedule & Speakers modal with profile links to mock alumni
 * - Accessible RSVP modal with form validation & user prefill
 * - LocalStorage persistence (alumni_network_rsvps)
 * - Global toast integration (showToast)
 * - Alumni Boarding Pass / Reservation Ticket modal with CSS barcode & print
 * - 18 Global Chapters directory with regional filter
 * ==========================================================================
 */

import { showToast } from '../nav.js';
import { getCurrentUser } from '../auth.js';

/* --------------------------------------------------------------------------
   1. EVENTS DATASET
   Includes the 3 mandatory core events + representative gatherings for all categories
   -------------------------------------------------------------------------- */
const EVENTS_DATA = [
  {
    id: 'event-homecoming-2026',
    title: 'Annual Homecoming & Innovation Gala',
    category: 'Class Reunions & Homecomings',
    categoryBadge: 'badge-accent',
    month: 'OCT',
    day: '24',
    year: '2026',
    dateDisplay: 'Saturday, October 24, 2026',
    time: '5:30 PM – 10:00 PM EDT',
    location: 'Campus Quadrangle • Boston, MA',
    description: 'Celebrate decades of academic excellence and visionary research. Reconnect with classmates under the grand pavilion with dinner, student innovation showcases, and distinguished alumni awards.',
    dressCode: 'Black Tie / Formal',
    venue: {
      name: 'Main Campus Quadrangle & Great Hall',
      address: 'Apex University, 100 University Ave, Boston, MA 02115',
      directions: 'Enter through the Memorial Arch on Commonwealth Ave. Valet parking available at North Gate.'
    },
    schedule: [
      { time: '5:30 PM', desc: 'Guest Registration & Welcome Reception in the Rose Courtyard' },
      { time: '6:15 PM', desc: "President's Opening Address & State of the University" },
      { time: '6:45 PM', desc: 'Innovation Showcase & Student Research Demonstrations' },
      { time: '7:30 PM', desc: 'Keynote Address & Distinguished Alumni Medal Presentation' },
      { time: '8:30 PM', desc: 'Seated Three-Course Gala Dinner & Live Jazz Fellowship' },
      { time: '10:00 PM', desc: 'Concluding Quadrangle Toast & Alma Mater' }
    ],
    speakers: [
      {
        id: 'alumni-001',
        name: 'Dr. Elena Rostova',
        role: 'VP of Molecular Therapeutics, Genovate (Ph.D. 2012)',
        photoURL: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
        desc: 'Keynote Speaker: Pioneering mRNA delivery mechanisms for neurodegenerative therapies.'
      },
      {
        id: 'alumni-004',
        name: 'David Adebayo',
        role: 'Head of Smart Grid Architecture, Lumina Energy (B.S. 2015)',
        photoURL: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
        desc: 'Alumni Honoree: Deploying off-grid solar microgrids across East Africa.'
      }
    ]
  },
  {
    id: 'event-london-dinner-2026',
    title: 'London Regional Chapter Autumn Dinner',
    category: 'Regional Chapter Dinners',
    categoryBadge: 'badge-subtle',
    month: 'NOV',
    day: '12',
    year: '2026',
    dateDisplay: 'Thursday, November 12, 2026',
    time: '6:30 PM – 10:00 PM GMT',
    location: 'The Royal Society • London, UK',
    description: 'Gather with European-based alumni and visiting faculty in the historic library of the Royal Society for an evening of cross-border fellowship, drinks, and academic discussion.',
    dressCode: 'Business Formal',
    venue: {
      name: 'The Kohn Centre & Historic Library, The Royal Society',
      address: '6-9 Carlton House Terrace, St. James\'s, London SW1Y 5AG',
      directions: 'Situated along Carlton House Terrace near St. James\'s Park and Piccadilly Circus underground stations.'
    },
    schedule: [
      { time: '6:30 PM', desc: 'Champagne & Canapé Arrival Reception in the Council Room' },
      { time: '7:15 PM', desc: 'Fireside Dialogue: Global Capital, Climate Transition & UK-US Research' },
      { time: '8:00 PM', desc: 'Seated Three-Course Autumn Dinner with Curated Wine Pairings' },
      { time: '9:15 PM', desc: 'European Chapter Mentorship Network Launch & Closing Remarks' },
      { time: '10:00 PM', desc: 'Evening Concludes' }
    ],
    speakers: [
      {
        id: 'alumni-002',
        name: 'Marcus Vance',
        role: 'Managing Director, Apex Capital Partners (B.S. 2008)',
        photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        desc: 'Fireside Host: Backing early-stage clean infrastructure and venture ecosystems.'
      },
      {
        id: 'alumni-005',
        name: 'Sofia Rodriguez',
        role: 'Chief Human Rights Counsel, International Justice Council (J.D. 2011)',
        photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        desc: 'Guest Speaker: Cross-border legal compliance and international diplomacy.'
      }
    ]
  },
  {
    id: 'event-virtual-office-hours-2026',
    title: 'Virtual Tech & Founder Office Hours',
    category: 'Virtual Symposia & Webinars',
    categoryBadge: 'badge-primary',
    month: 'DEC',
    day: '05',
    year: '2026',
    dateDisplay: 'Saturday, December 5, 2026',
    time: '11:00 AM – 1:00 PM EST (Global Live Stream)',
    location: 'Online Global Live Stream',
    description: 'An intimate digital gathering designed for alumni founders, engineers, and researchers to discuss emerging AI architectures, startup fundraising, and product engineering.',
    dressCode: 'Smart Casual / Remote',
    venue: {
      name: 'Apex Virtual Symposium & Breakout Hub',
      address: 'Online Global Broadcast',
      directions: 'Online event — joining instructions and calendar credentials will be delivered to your registered email upon RSVP.'
    },
    schedule: [
      { time: '11:00 AM', desc: 'Virtual Auditorium Opens & Welcome by Moderator' },
      { time: '11:15 AM', desc: 'Technical Deep Dive: Frontier Foundation Models & Robotics' },
      { time: '11:50 AM', desc: 'Live Audience Q&A with Senior Research Alumni' },
      { time: '12:15 PM', desc: 'Interactive Breakout Tables: AI Engineering, Biotech & Climate Venture' },
      { time: '1:00 PM', desc: 'Symposium Concludes & Community Resource Distribution' }
    ],
    speakers: [
      {
        id: 'alumni-003',
        name: 'Aria Chen',
        role: 'Senior Research Scientist, Google DeepMind (M.S. 2019)',
        photoURL: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
        desc: 'Discussion Lead: Multimodal foundation models and robotics dexterity research.'
      },
      {
        id: 'alumni-001',
        name: 'Dr. Elena Rostova',
        role: 'VP of Molecular Therapeutics, Genovate (Ph.D. 2012)',
        photoURL: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
        desc: 'Guest Advisor: Translating laboratory computational models into clinical pipelines.'
      }
    ]
  },
  {
    id: 'event-climate-summit-2027',
    title: 'Global Venture & Climate Tech Summit',
    category: 'Career & Founder Panels',
    categoryBadge: 'badge-accent',
    month: 'JAN',
    day: '18',
    year: '2027',
    dateDisplay: 'Monday, January 18, 2027',
    time: '2:00 PM – 6:30 PM PST',
    location: 'Palace of Fine Arts • San Francisco, CA',
    description: 'Join West Coast alumni venture capitalists, founders, and climate scientists for high-impact panels on decarbonization, early-stage syndicates, and university venture spin-offs.',
    dressCode: 'Smart Casual',
    venue: {
      name: 'Innovation Amphitheater, Palace of Fine Arts',
      address: '3301 Lyon St, San Francisco, CA 94123',
      directions: 'Located in the Marina District. Accessible via Muni 30 and 43 routes. Dedicated guest parking on site.'
    },
    schedule: [
      { time: '2:00 PM', desc: 'Check-in & Founder Networking Lounge' },
      { time: '2:30 PM', desc: 'Panel: Deploying Capital for the Net-Zero Frontier' },
      { time: '3:45 PM', desc: 'Showcase: Apex Alumni Early-Stage Climate Startups' },
      { time: '4:45 PM', desc: 'Lightning Mentorship & Seed Syndicate Roundtables' },
      { time: '5:30 PM', desc: 'Sunset Terrace Fellowship & Wine Reception' }
    ],
    speakers: [
      {
        id: 'alumni-002',
        name: 'Marcus Vance',
        role: 'Managing Director, Apex Capital Partners (B.S. 2008)',
        photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        desc: 'Panel Moderator: Institutional LP allocations and clean infrastructure syndicates.'
      },
      {
        id: 'alumni-004',
        name: 'David Adebayo',
        role: 'Head of Smart Grid Architecture, Lumina Energy (B.S. 2015)',
        photoURL: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
        desc: 'Panelist: Scalable clean energy grids and decentralized infrastructure deployment.'
      }
    ]
  },
  {
    id: 'event-tokyo-forum-2027',
    title: 'Tokyo Alumni Executive Forum & Reception',
    category: 'Regional Chapter Dinners',
    categoryBadge: 'badge-subtle',
    month: 'FEB',
    day: '20',
    year: '2027',
    dateDisplay: 'Saturday, February 20, 2027',
    time: '6:00 PM – 9:00 PM JST',
    location: 'Roppongi Hills Club • Tokyo, Japan',
    description: 'Apex alumni in Japan gather atop the Mori Tower overlooking the Tokyo skyline for an executive discussion on sustainable urbanism and global architecture.',
    dressCode: 'Business Formal',
    venue: {
      name: 'Fifty-One Room, Roppongi Hills Mori Tower 51F',
      address: '6-10-1 Roppongi, Minato-ku, Tokyo 106-6151',
      directions: 'Direct underground access from Roppongi Station (Tokyo Metro Hibiya & Toei Oedo Lines).'
    },
    schedule: [
      { time: '6:00 PM', desc: 'Skyline Reception & Traditional Japanese Welcome Cocktail' },
      { time: '6:30 PM', desc: 'Keynote Presentation: Biophilic Megacities & Next-Gen Architecture' },
      { time: '7:15 PM', desc: 'Seated Kaiseki-Inspired Dinner & Cross-Discipline Dialogue' },
      { time: '8:30 PM', desc: 'Closing Toast & Asia-Pacific Alumni Chapter Updates' }
    ],
    speakers: [
      {
        id: 'alumni-006',
        name: 'Kenji Sato',
        role: 'Lead Urban Designer, Kengo Kuma & Associates (M.Arch 2016)',
        photoURL: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
        desc: 'Keynote Speaker: Pioneering timber-concrete hybrids for Tokyo Olympic architectural legacies.'
      }
    ]
  },
  {
    id: 'event-law-policy-2027',
    title: 'Alumni Law & Public Policy Colloquium',
    category: 'Virtual Symposia & Webinars',
    categoryBadge: 'badge-primary',
    month: 'MAR',
    day: '14',
    year: '2027',
    dateDisplay: 'Sunday, March 14, 2027',
    time: '10:00 AM – 12:30 PM CET',
    location: 'Online Global Live Stream',
    description: 'Examining the intersection of synthetic intelligence, privacy law, and international human rights frameworks with alumni policymakers and legal counsels.',
    dressCode: 'Smart Casual / Remote',
    venue: {
      name: 'Geneva Global Policy Hub (Virtual)',
      address: 'Online Global Stream',
      directions: 'Interactive broadcast with live multilingual closed captions and Q&A room.'
    },
    schedule: [
      { time: '10:00 AM', desc: 'Colloquium Opening & Welcome by Faculty Chair' },
      { time: '10:15 AM', desc: 'Plenary Lecture: Algorithmic Governance & Global Treaties' },
      { time: '11:00 AM', desc: 'Panel Discussion: Comparative Transatlantic AI Regulation' },
      { time: '11:45 AM', desc: 'Audience Q&A & Policy Working Group Breakouts' },
      { time: '12:30 PM', desc: 'Colloquium Adjourns' }
    ],
    speakers: [
      {
        id: 'alumni-005',
        name: 'Sofia Rodriguez',
        role: 'Chief Human Rights Counsel, International Justice Council (J.D. 2011)',
        photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        desc: 'Plenary Speaker: Advising international tribunals on data privacy and sovereign algorithmic audits.'
      }
    ]
  }
];

/* --------------------------------------------------------------------------
   2. 18 GLOBAL CHAPTERS DATASET
   All 18 chapters with realistic institutional leadership and contact points
   -------------------------------------------------------------------------- */
const CHAPTERS_DATA = [
  { city: 'Boston', country: 'United States', region: 'Americas', president: "Dr. Sarah Lin ('09)", email: 'boston.chapter@apexalumni.org' },
  { city: 'New York', country: 'United States', region: 'Americas', president: "Michael Thorne ('11)", email: 'newyork.chapter@apexalumni.org' },
  { city: 'San Francisco', country: 'United States', region: 'Americas', president: "Jessica Hayes ('14)", email: 'sf.chapter@apexalumni.org' },
  { city: 'Chicago', country: 'United States', region: 'Americas', president: "Robert Sterling ('08)", email: 'chicago.chapter@apexalumni.org' },
  { city: 'Toronto', country: 'Canada', region: 'Americas', president: "Claire Tremblay ('13)", email: 'toronto.chapter@apexalumni.org' },
  { city: 'São Paulo', country: 'Brazil', region: 'Americas', president: "Thiago Silva ('16)", email: 'saopaulo.chapter@apexalumni.org' },
  { city: 'London', country: 'United Kingdom', region: 'Europe', president: "Alistair Campbell ('07)", email: 'london.chapter@apexalumni.org' },
  { city: 'Paris', country: 'France', region: 'Europe', president: "Camille Dubois ('12)", email: 'paris.chapter@apexalumni.org' },
  { city: 'Berlin', country: 'Germany', region: 'Europe', president: "Florian Weber ('15)", email: 'berlin.chapter@apexalumni.org' },
  { city: 'Zurich', country: 'Switzerland', region: 'Europe', president: "Beatrice Meyer ('10)", email: 'zurich.chapter@apexalumni.org' },
  { city: 'Tokyo', country: 'Japan', region: 'Asia-Pacific', president: "Kenji Sato ('16)", email: 'tokyo.chapter@apexalumni.org' },
  { city: 'Singapore', country: 'Singapore', region: 'Asia-Pacific', president: "Rachel Tan ('17)", email: 'singapore.chapter@apexalumni.org' },
  { city: 'Hong Kong', country: 'Hong Kong SAR', region: 'Asia-Pacific', president: "Derek Wong ('11)", email: 'hongkong.chapter@apexalumni.org' },
  { city: 'Sydney', country: 'Australia', region: 'Asia-Pacific', president: "Liam Gallagher ('12)", email: 'sydney.chapter@apexalumni.org' },
  { city: 'Seoul', country: 'South Korea', region: 'Asia-Pacific', president: "Min-Jun Park ('18)", email: 'seoul.chapter@apexalumni.org' },
  { city: 'Mumbai', country: 'India', region: 'Asia-Pacific', president: "Ananya Sharma ('14)", email: 'mumbai.chapter@apexalumni.org' },
  { city: 'Dubai', country: 'United Arab Emirates', region: 'Middle East & Africa', president: "Tariq Al-Mansoor ('13)", email: 'dubai.chapter@apexalumni.org' },
  { city: 'Nairobi', country: 'Kenya', region: 'Middle East & Africa', president: "David Adebayo ('15)", email: 'nairobi.chapter@apexalumni.org' }
];

/* --------------------------------------------------------------------------
   3. APP INITIALIZATION & STATE
   -------------------------------------------------------------------------- */
let activeCategory = 'all';
let currentSelectedEvent = null;

document.addEventListener('DOMContentLoaded', () => {
  initEventsApp();
});

function initEventsApp() {
  renderEvents('all');
  initCategoryFilters();
  initScheduleModal();
  initRSVPModal();
  initTicketModal();
  initChapters();
  initGlobalKeyboard();
}

/* --------------------------------------------------------------------------
   4. EVENT CARDS RENDERING & FILTERING
   -------------------------------------------------------------------------- */
function renderEvents(category = 'all') {
  const container = document.getElementById('events-list');
  if (!container) return;

  const filtered = category === 'all'
    ? EVENTS_DATA
    : EVENTS_DATA.filter(evt => evt.category === category);

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="events-empty-state">
        <p>No upcoming gatherings found in this category at this time.</p>
        <button type="button" class="btn btn-outline btn-sm" id="reset-filter-btn">Show All Gatherings</button>
      </div>
    `;
    document.getElementById('reset-filter-btn')?.addEventListener('click', () => {
      const allBtn = document.querySelector('.event-filter-tab[data-category="all"]');
      allBtn?.click();
    });
    return;
  }

  container.innerHTML = filtered.map(evt => `
    <article class="event-card" data-event-id="${evt.id}">
      <div class="event-card-top">
        <div class="event-date-badge" aria-label="Date: ${evt.month} ${evt.day}, ${evt.year}">
          <span class="event-date-month">${evt.month}</span>
          <span class="event-date-day">${evt.day}</span>
        </div>
        <span class="badge ${evt.categoryBadge}">${evt.category}</span>
      </div>

      <div class="event-card-body">
        <h3 class="event-card-title">${escapeHtml(evt.title)}</h3>
        <p class="event-card-desc">${escapeHtml(evt.description)}</p>

        <div class="event-meta-list">
          <div class="event-meta-item">
            <svg class="event-meta-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span>${escapeHtml(evt.time)}</span>
          </div>
          <div class="event-meta-item">
            <svg class="event-meta-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span>${escapeHtml(evt.location)}</span>
          </div>
        </div>
      </div>

      <div class="event-card-actions">
        <button type="button" class="btn btn-outline btn-sm view-schedule-btn" data-event-id="${evt.id}">
          View Schedule / Speakers
        </button>
        <button type="button" class="btn btn-primary btn-sm reserve-place-btn" data-event-id="${evt.id}">
          Reserve Place &rarr;
        </button>
      </div>
    </article>
  `).join('');

  // Attach event listeners to newly rendered card buttons
  container.querySelectorAll('.view-schedule-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const eventId = btn.dataset.eventId;
      openScheduleModal(eventId);
    });
  });

  container.querySelectorAll('.reserve-place-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const eventId = btn.dataset.eventId;
      openRSVPModal(eventId);
    });
  });
}

function initCategoryFilters() {
  const tabs = document.querySelectorAll('.event-filter-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      activeCategory = tab.dataset.category;
      renderEvents(activeCategory);
    });
  });
}

/* --------------------------------------------------------------------------
   5. SCHEDULE & SPEAKERS MODAL
   -------------------------------------------------------------------------- */
function initScheduleModal() {
  const modal = document.getElementById('schedule-modal');
  const closeBtn = document.getElementById('close-schedule-modal');
  const cancelBtn = document.getElementById('schedule-modal-close-btn');
  const reserveBtn = document.getElementById('schedule-modal-reserve-btn');

  const close = () => closeModal(modal);

  closeBtn?.addEventListener('click', close);
  cancelBtn?.addEventListener('click', close);
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) close();
  });

  reserveBtn?.addEventListener('click', () => {
    if (currentSelectedEvent) {
      close();
      openRSVPModal(currentSelectedEvent.id);
    }
  });
}

function openScheduleModal(eventId) {
  const evt = EVENTS_DATA.find(e => e.id === eventId);
  if (!evt) return;

  currentSelectedEvent = evt;
  const modal = document.getElementById('schedule-modal');
  const catEl = document.getElementById('schedule-modal-category');
  const titleEl = document.getElementById('schedule-modal-title');
  const bodyEl = document.getElementById('schedule-modal-body');

  if (catEl) {
    catEl.textContent = evt.category;
    catEl.className = `badge ${evt.categoryBadge}`;
  }
  if (titleEl) {
    titleEl.textContent = evt.title;
  }

  if (bodyEl) {
    bodyEl.innerHTML = `
      <!-- Event Hero / Summary -->
      <div class="schedule-hero">
        <div class="schedule-hero-title">${escapeHtml(evt.title)}</div>
        <div class="schedule-hero-meta">
          <span><strong>Date:</strong> ${escapeHtml(evt.dateDisplay)}</span>
          <span>&bull;</span>
          <span><strong>Time:</strong> ${escapeHtml(evt.time)}</span>
          <span>&bull;</span>
          <span><strong>Dress Code:</strong> ${escapeHtml(evt.dressCode)}</span>
        </div>
      </div>

      <p style="font-size: var(--text-sm); color: var(--color-text-secondary); line-height: var(--leading-relaxed); margin-bottom: var(--space-4);">
        ${escapeHtml(evt.description)}
      </p>

      <!-- Chronological Itinerary -->
      <div class="schedule-block-heading">Order of Events &bull; Schedule</div>
      <div class="schedule-timeline">
        ${evt.schedule.map(item => `
          <div class="timeline-item">
            <span class="timeline-dot" aria-hidden="true"></span>
            <div class="timeline-time">${escapeHtml(item.time)}</div>
            <div class="timeline-desc">${escapeHtml(item.desc)}</div>
          </div>
        `).join('')}
      </div>

      <!-- Featured Speakers -->
      <div class="schedule-block-heading">Featured Keynotes &amp; Speakers</div>
      <div class="speakers-grid">
        ${evt.speakers.map(spk => `
          <div class="speaker-card">
            <img src="${escapeHtml(spk.photoURL)}" alt="${escapeHtml(spk.name)}" class="speaker-avatar" loading="lazy" />
            <div class="speaker-info">
              <div class="speaker-name">${escapeHtml(spk.name)}</div>
              <div class="speaker-role">${escapeHtml(spk.role)}</div>
              <p style="font-size: 0.6875rem; color: var(--color-text-secondary); margin-bottom: var(--space-1); line-height: 1.3;">
                ${escapeHtml(spk.desc)}
              </p>
              <a href="profile.html?id=${encodeURIComponent(spk.id)}" class="speaker-link">
                View Fellow Profile &rarr;
              </a>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Venue & Directions -->
      <div class="schedule-block-heading">Venue &amp; Directions</div>
      <div class="venue-details-box">
        <div class="venue-name">${escapeHtml(evt.venue.name)}</div>
        <div class="venue-address">${escapeHtml(evt.venue.address)}</div>
        <div class="venue-note">${escapeHtml(evt.venue.directions)}</div>
      </div>
    `;
  }

  openModal(modal);
}

/* --------------------------------------------------------------------------
   6. RSVP FLOW & LOCALSTORAGE PERSISTENCE
   -------------------------------------------------------------------------- */
function initRSVPModal() {
  const modal = document.getElementById('rsvp-modal');
  const closeBtn = document.getElementById('close-rsvp-modal');
  const cancelBtn = document.getElementById('cancel-rsvp-btn');
  const form = document.getElementById('rsvp-form');

  const close = () => closeModal(modal);

  closeBtn?.addEventListener('click', close);
  cancelBtn?.addEventListener('click', close);
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) close();
  });

  form?.addEventListener('submit', handleRSVPSubmit);
}

function openRSVPModal(eventId) {
  const evt = EVENTS_DATA.find(e => e.id === eventId);
  if (!evt) return;

  currentSelectedEvent = evt;
  const modal = document.getElementById('rsvp-modal');
  const nameSummaryEl = document.getElementById('rsvp-event-name');
  const locSummaryEl = document.getElementById('rsvp-event-loc');

  if (nameSummaryEl) nameSummaryEl.textContent = evt.title;
  if (locSummaryEl) locSummaryEl.textContent = `${evt.location} • ${evt.time}`;

  // Reset errors
  const nameError = document.getElementById('rsvp-name-error');
  const emailError = document.getElementById('rsvp-email-error');
  if (nameError) nameError.style.display = 'none';
  if (emailError) emailError.style.display = 'none';

  // Pre-populate if user is logged in
  const user = getCurrentUser();
  const nameInput = document.getElementById('rsvp-name');
  const emailInput = document.getElementById('rsvp-email');
  const batchInput = document.getElementById('rsvp-batch');
  const guestSelect = document.getElementById('rsvp-guests');

  if (user) {
    if (nameInput && user.name) nameInput.value = user.name;
    if (emailInput && user.email) emailInput.value = user.email;
    if (batchInput && user.gradYear) batchInput.value = user.gradYear;
  } else {
    // Keep empty or leave existing inputs
    if (nameInput && !nameInput.value) nameInput.value = '';
    if (emailInput && !emailInput.value) emailInput.value = '';
    if (batchInput && !batchInput.value) batchInput.value = '';
  }

  if (guestSelect) guestSelect.value = '1';

  openModal(modal);
}

function handleRSVPSubmit(e) {
  e.preventDefault();

  const nameInput = document.getElementById('rsvp-name');
  const emailInput = document.getElementById('rsvp-email');
  const batchInput = document.getElementById('rsvp-batch');
  const guestSelect = document.getElementById('rsvp-guests');

  const name = nameInput?.value.trim() || '';
  const email = emailInput?.value.trim() || '';
  const gradYear = batchInput?.value.trim() || 'Alumnus';
  const guestCount = parseInt(guestSelect?.value || '1', 10);

  // Validation
  let hasError = false;
  const nameError = document.getElementById('rsvp-name-error');
  const emailError = document.getElementById('rsvp-email-error');

  if (!name) {
    if (nameError) nameError.style.display = 'block';
    hasError = true;
  } else if (nameError) {
    nameError.style.display = 'none';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    if (emailError) emailError.style.display = 'block';
    hasError = true;
  } else if (emailError) {
    emailError.style.display = 'none';
  }

  if (hasError) return;

  // Generate unique reservation ID (e.g. APX-2026-7842)
  const randCode = Math.floor(1000 + Math.random() * 9000);
  const reservationId = `APX-2026-${randCode}`;

  const newReservation = {
    reservationId,
    eventId: currentSelectedEvent ? currentSelectedEvent.id : 'unknown-event',
    eventTitle: currentSelectedEvent ? currentSelectedEvent.title : 'Apex Alumni Gathering',
    eventDate: currentSelectedEvent ? currentSelectedEvent.dateDisplay : 'TBD',
    eventTime: currentSelectedEvent ? currentSelectedEvent.time : 'TBD',
    eventLocation: currentSelectedEvent ? currentSelectedEvent.location : 'Campus Quadrangle',
    attendeeName: name,
    email,
    gradYear: gradYear || 'Alumnus',
    guestCount,
    timestamp: new Date().toISOString()
  };

  // Safe localStorage append
  try {
    const rawRsvps = localStorage.getItem('alumni_network_rsvps');
    const rsvps = rawRsvps ? JSON.parse(rawRsvps) : [];
    if (Array.isArray(rsvps)) {
      rsvps.push(newReservation);
      localStorage.setItem('alumni_network_rsvps', JSON.stringify(rsvps));
    } else {
      localStorage.setItem('alumni_network_rsvps', JSON.stringify([newReservation]));
    }
  } catch (err) {
    console.warn('LocalStorage error while saving RSVP:', err);
  }

  // Close RSVP modal
  const rsvpModal = document.getElementById('rsvp-modal');
  closeModal(rsvpModal);

  // Global toast integration (Section 10 requirement)
  showToast('Your place has been reserved!', 'success');

  // Open Confirmation Boarding Pass / Reservation Ticket modal
  openTicketModal(newReservation);
}

/* --------------------------------------------------------------------------
   7. ALUMNI BOARDING PASS / RESERVATION TICKET MODAL
   -------------------------------------------------------------------------- */
function initTicketModal() {
  const modal = document.getElementById('ticket-modal');
  const printBtn = document.getElementById('print-ticket-btn');
  const closeBtn = document.getElementById('close-ticket-btn');

  const close = () => closeModal(modal);

  closeBtn?.addEventListener('click', close);
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) close();
  });

  printBtn?.addEventListener('click', () => {
    window.print();
  });
}

function openTicketModal(reservation) {
  const modal = document.getElementById('ticket-modal');
  if (!modal) return;

  const eventTitleEl = document.getElementById('ticket-event-title');
  const nameEl = document.getElementById('ticket-attendee-name');
  const yearEl = document.getElementById('ticket-class-year');
  const dateTimeEl = document.getElementById('ticket-date-time');
  const locEl = document.getElementById('ticket-location');
  const guestsEl = document.getElementById('ticket-guest-count');
  const resIdEl = document.getElementById('ticket-reservation-id');
  const barcodeNumEl = document.getElementById('ticket-barcode-num');

  if (eventTitleEl) eventTitleEl.textContent = reservation.eventTitle;
  if (nameEl) nameEl.textContent = reservation.attendeeName;
  if (yearEl) yearEl.textContent = reservation.gradYear || 'Class of Alumni';
  if (dateTimeEl) dateTimeEl.textContent = `${reservation.eventDate} • ${reservation.eventTime}`;
  if (locEl) locEl.textContent = reservation.eventLocation;
  if (guestsEl) guestsEl.textContent = `${reservation.guestCount} ${reservation.guestCount > 1 ? 'Guests' : 'Guest'}`;
  if (resIdEl) resIdEl.textContent = reservation.reservationId;
  if (barcodeNumEl) barcodeNumEl.textContent = reservation.reservationId;

  openModal(modal);
}

/* --------------------------------------------------------------------------
   8. 18 GLOBAL CHAPTERS DIRECTORY
   -------------------------------------------------------------------------- */
function initChapters() {
  const container = document.getElementById('chapters-grid');
  const tabs = document.querySelectorAll('.chapter-tab');
  if (!container) return;

  renderChapters('all');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const region = tab.dataset.region || 'all';
      renderChapters(region);
    });
  });
}

function renderChapters(region = 'all') {
  const container = document.getElementById('chapters-grid');
  if (!container) return;

  const filtered = region === 'all'
    ? CHAPTERS_DATA
    : CHAPTERS_DATA.filter(ch => ch.region === region);

  container.innerHTML = filtered.map(ch => `
    <article class="chapter-card">
      <div class="chapter-card-top">
        <h3 class="chapter-city">${escapeHtml(ch.city)}</h3>
        <span class="chapter-region-badge">${escapeHtml(ch.region)}</span>
      </div>
      <p style="font-size: var(--text-xs); color: var(--color-text-muted); margin-bottom: var(--space-2);">
        ${escapeHtml(ch.country)}
      </p>
      <div class="chapter-leader">
        Chapter President: <strong>${escapeHtml(ch.president)}</strong>
      </div>
      <a href="mailto:${encodeURIComponent(ch.email)}" class="chapter-email-link" aria-label="Email ${escapeHtml(ch.city)} Chapter President">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
          <polyline points="22,6 12,13 2,6"></polyline>
        </svg>
        <span>${escapeHtml(ch.email)}</span>
      </a>
    </article>
  `).join('');
}

/* --------------------------------------------------------------------------
   9. MODAL HELPERS & ACCESSIBILITY
   -------------------------------------------------------------------------- */
function openModal(modalEl) {
  if (!modalEl) return;
  modalEl.removeAttribute('hidden');
  // Small delay to allow CSS transitions
  requestAnimationFrame(() => {
    modalEl.classList.add('open');
  });
  document.body.style.overflow = 'hidden';
}

function closeModal(modalEl) {
  if (!modalEl) return;
  modalEl.classList.remove('open');
  setTimeout(() => {
    modalEl.setAttribute('hidden', '');
    // Only restore body scrolling if no other modals are open
    if (!document.querySelector('.modal-overlay.open')) {
      document.body.style.overflow = '';
    }
  }, 200);
}

function initGlobalKeyboard() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const openModals = document.querySelectorAll('.modal-overlay.open');
      openModals.forEach(m => closeModal(m));
    }
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

