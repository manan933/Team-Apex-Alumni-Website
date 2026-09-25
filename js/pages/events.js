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
 * - Past Events directory featuring verified institutional media (YouTube & Instagram)
 * - Upcoming Events directory featuring Shurjan 5.0 and Ayayakt 6.0
 * - Clean modular pagination (6 items per page) for scalability
 * - Accessible lightweight Media Viewer Modal with autoplay and stop-on-close
* ==========================================================================
*/

import { showToast } from '../nav.js';
import { getCurrentUser } from '../auth.js';

/* --------------------------------------------------------------------------
   1. EVENTS DATASET
   Includes the 3 mandatory core events + representative gatherings for all categories
   1. CONSTANTS & EVENT DATASETS
  -------------------------------------------------------------------------- */
const EVENTS_DATA = [
const PAGE_SIZE = 6;

/**
 * Past Events Dataset
 * Features verified media links (YouTube Live/Videos/Shorts & Instagram Reels)
 * with easily replaceable titles and metadata.
 */
const PAST_EVENTS_DATA = [
{
    id: 'event-homecoming-2026',
    title: 'Annual Homecoming & Innovation Gala',
    category: 'Class Reunions & Homecomings',
    categoryBadge: 'badge-accent',
    month: 'OCT',
    day: '24',
    id: 'past-event-1',
    title: 'Alumni Cultural Gathering',
    month: 'MAR',
    day: '15',
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
    dateDisplay: 'Sunday, March 15, 2026',
    time: '6:00 PM – 9:30 PM',
    location: 'University Auditorium & Amphitheatre',
    speaker: 'Guest: Alumni Cultural Committee & Faculty',
    description: 'An evening celebrating artistic performances, music, and dramatic arts by current students and returning alumni cohorts.',
    coverImage: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
    mediaType: 'YouTube',
    mediaCategory: 'Live Stream Recording',
    mediaUrl: 'https://www.youtube.com/live/kbz_m7rsxtg?si=nW83l1oNnK6KRcpw',
    embedUrl: 'https://www.youtube-nocookie.com/embed/kbz_m7rsxtg'
},
{
    id: 'event-london-dinner-2026',
    title: 'London Regional Chapter Autumn Dinner',
    category: 'Regional Chapter Dinners',
    categoryBadge: 'badge-subtle',
    month: 'NOV',
    day: '12',
    id: 'past-event-2',
    title: 'Annual Alumni Meet',
    month: 'FEB',
    day: '20',
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
    id: 'event-virtual-office-hours-2026',
    title: 'Virtual Tech & Founder Office Hours',
    category: 'Virtual Symposia & Webinars',
    categoryBadge: 'badge-primary',
    month: 'DEC',
    day: '05',
    id: 'past-event-3',
    title: 'Campus Reunion Highlights',
    month: 'JAN',
    day: '18',
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
    dateDisplay: 'Sunday, January 18, 2026',
    time: '11:00 AM – 3:30 PM',
    location: 'Central Campus Quadrangle',
    speaker: 'Guest: Class Coordinators & Association Board',
    description: 'Milestone reunion welcoming alumni back to campus for department walkthroughs, laboratory tours, and celebratory campus moments.',
    coverImage: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=800&q=80',
    mediaType: 'YouTube',
    mediaCategory: 'Video Showcase',
    mediaUrl: 'https://youtu.be/GHpgeeI9b2A?si=Kxt3-Tc586XRedLa',
    embedUrl: 'https://www.youtube-nocookie.com/embed/GHpgeeI9b2A'
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
    id: 'event-tokyo-forum-2027',
    title: 'Tokyo Alumni Executive Forum & Reception',
    category: 'Regional Chapter Dinners',
    categoryBadge: 'badge-subtle',
    month: 'FEB',
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
    id: 'event-law-policy-2027',
    title: 'Alumni Law & Public Policy Colloquium',
    category: 'Virtual Symposia & Webinars',
    categoryBadge: 'badge-primary',
    month: 'MAR',
    day: '14',
    id: 'upcoming-event-2',
    title: 'Ayayakt 6.0',
    month: 'JAN',
    day: '15',
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
   2. 18 GLOBAL CHAPTERS DATASET
   All 18 chapters with realistic institutional leadership and contact points
   2. STATE MANAGEMENT
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
let pastEventsCurrentPage = 1;
let upcomingEventsCurrentPage = 1;
let lastFocusedElement = null;

/* --------------------------------------------------------------------------
   3. APP INITIALIZATION & STATE
   3. DOM ELEMENT REFERENCES
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
   4. EVENT CARDS RENDERING & FILTERING
   4. TEMPLATE RENDERING FUNCTIONS
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
        <span class="badge ${evt.categoryBadge}">${evt.category}</span>
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
        <h3 class="event-card-title">${escapeHtml(evt.title)}</h3>
        <p class="event-card-desc">${escapeHtml(evt.description)}</p>

        <h3 class="event-card-title">${escapeHTML(event.title)}</h3>
        <p class="event-card-desc">${escapeHTML(event.description)}</p>
       <div class="event-meta-list">
         <div class="event-meta-item">
            <svg class="event-meta-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span>${escapeHtml(evt.time)}</span>
            <svg class="event-meta-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            <span>${escapeHTML(event.time)}</span>
         </div>
         <div class="event-meta-item">
            <svg class="event-meta-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span>${escapeHtml(evt.location)}</span>
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
        <button type="button" class="btn btn-outline btn-sm view-schedule-btn" data-event-id="${evt.id}">
          View Schedule / Speakers
        </button>
        <button type="button" class="btn btn-primary btn-sm reserve-place-btn" data-event-id="${evt.id}">
          Reserve Place &rarr;
        </button>
        <span class="upcoming-status-badge">
          <span class="status-dot" aria-hidden="true"></span>
          ${escapeHTML(event.statusNote || 'Upcoming Gathering')}
        </span>
     </div>
   </article>
  `).join('');
  `;
}

  // Attach event listeners to newly rendered card buttons
  container.querySelectorAll('.view-schedule-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const eventId = btn.dataset.eventId;
      openScheduleModal(eventId);
    });
  });
/**
 * Renders Past Events for the specified page
 */
function renderPastEvents(page = 1) {
  if (!pastEventsList) return;
  pastEventsCurrentPage = page;

  container.querySelectorAll('.reserve-place-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const eventId = btn.dataset.eventId;
      openRSVPModal(eventId);
    });
  });
}
  const totalItems = PAST_EVENTS_DATA.length;
  const startIndex = (page - 1) * PAGE_SIZE;
  const pageItems = PAST_EVENTS_DATA.slice(startIndex, startIndex + PAGE_SIZE);

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
  pastEventsList.innerHTML = pageItems.map(createPastEventCardHTML).join('');
  renderPaginationControls('past', totalItems, PAGE_SIZE, page);
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
/**
 * Renders Upcoming Events for the specified page
 */
function renderUpcomingEvents(page = 1) {
  if (!upcomingEventsList) return;
  upcomingEventsCurrentPage = page;

  reserveBtn?.addEventListener('click', () => {
    if (currentSelectedEvent) {
      close();
      openRSVPModal(currentSelectedEvent.id);
    }
  });
  const totalItems = UPCOMING_EVENTS_DATA.length;
  const startIndex = (page - 1) * PAGE_SIZE;
  const pageItems = UPCOMING_EVENTS_DATA.slice(startIndex, startIndex + PAGE_SIZE);

  upcomingEventsList.innerHTML = pageItems.map(createUpcomingEventCardHTML).join('');
  renderPaginationControls('upcoming', totalItems, PAGE_SIZE, page);
}

function openScheduleModal(eventId) {
  const evt = EVENTS_DATA.find(e => e.id === eventId);
  if (!evt) return;
/**
 * Builds and mounts pagination controls
 */
function renderPaginationControls(type, totalItems, pageSize, currentPage) {
  const container = type === 'past' ? pastEventsPagination : upcomingEventsPagination;
  if (!container) return;

  currentSelectedEvent = evt;
  const modal = document.getElementById('schedule-modal');
  const catEl = document.getElementById('schedule-modal-category');
  const titleEl = document.getElementById('schedule-modal-title');
  const bodyEl = document.getElementById('schedule-modal-body');
  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  if (catEl) {
    catEl.textContent = evt.category;
    catEl.className = `badge ${evt.categoryBadge}`;
  }
  if (titleEl) {
    titleEl.textContent = evt.title;
  let pagesHTML = '';
  for (let i = 1; i <= totalPages; i++) {
    const isActive = i === currentPage;
    pagesHTML += `
      <button type="button" class="page-number ${isActive ? 'active' : ''}" data-page="${i}" ${isActive ? 'aria-current="page"' : ''}>
        ${i}
      </button>
    `;
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

      <!-- Venue & Directions -->
      <div class="schedule-block-heading">Venue &amp; Directions</div>
      <div class="venue-details-box">
        <div class="venue-name">${escapeHtml(evt.venue.name)}</div>
        <div class="venue-address">${escapeHtml(evt.venue.address)}</div>
        <div class="venue-note">${escapeHtml(evt.venue.directions)}</div>
      </div>
    `;
function scrollToSection(sectionId) {
  const el = document.getElementById(sectionId);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

  openModal(modal);
}

/* --------------------------------------------------------------------------
   6. RSVP FLOW & LOCALSTORAGE PERSISTENCE
   5. MEDIA VIEWER MODAL LOGIC
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
/**
 * Opens the lightweight Media Viewer Modal for a specific past event
 */
function openMediaModal(event) {
  if (!mediaModal || !event) return;

  openModal(modal);
}
  lastFocusedElement = document.activeElement;

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
  if (mediaModalTitle) {
    mediaModalTitle.textContent = `${event.title} — Event Media`;
}

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    if (emailError) emailError.style.display = 'block';
    hasError = true;
  } else if (emailError) {
    emailError.style.display = 'none';
  if (mediaModalBadge) {
    mediaModalBadge.textContent = event.mediaType === 'Instagram' ? 'Instagram Reel' : 'Video Recording';
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
  if (mediaModalBody) {
    if (event.mediaType === 'YouTube' && event.embedUrl) {
      mediaModalBody.innerHTML = `
        <div class="media-video-container">
          <iframe 
            src="${escapeHTML(event.embedUrl)}?autoplay=1&rel=0" 
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
      localStorage.setItem('alumni_network_rsvps', JSON.stringify([newReservation]));
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
  } catch (err) {
    console.warn('LocalStorage error while saving RSVP:', err);
}

  // Close RSVP modal
  const rsvpModal = document.getElementById('rsvp-modal');
  closeModal(rsvpModal);
  if (mediaExternalLink) {
    mediaExternalLink.href = event.mediaUrl;
    mediaExternalLink.textContent = event.mediaType === 'Instagram' ? 'Open Reel on Instagram ↗' : 'Watch on YouTube ↗';
  }

  // Global toast integration (Section 10 requirement)
  showToast('Your place has been reserved!', 'success');
  mediaModal.removeAttribute('hidden');
  document.body.style.overflow = 'hidden';

  // Open Confirmation Boarding Pass / Reservation Ticket modal
  openTicketModal(newReservation);
  if (closeMediaModalBtn) {
    closeMediaModalBtn.focus();
  }
}

/* --------------------------------------------------------------------------
   7. ALUMNI BOARDING PASS / RESERVATION TICKET MODAL
   -------------------------------------------------------------------------- */
function initTicketModal() {
  const modal = document.getElementById('ticket-modal');
  const printBtn = document.getElementById('print-ticket-btn');
  const closeBtn = document.getElementById('close-ticket-btn');

  const close = () => closeModal(modal);
/**
 * Closes the Media Viewer Modal and cleans up iframes to stop playback
 */
function closeMediaModal() {
  if (!mediaModal) return;

  closeBtn?.addEventListener('click', close);
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) close();
  });
  mediaModal.setAttribute('hidden', '');
  document.body.style.overflow = '';

  printBtn?.addEventListener('click', () => {
    window.print();
  });
}
  // Clear modal body so video/audio stops playing immediately
  if (mediaModalBody) {
    mediaModalBody.innerHTML = '';
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
  if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
    lastFocusedElement.focus();
  }
}

/* --------------------------------------------------------------------------
   8. 18 GLOBAL CHAPTERS DIRECTORY
   6. EVENT LISTENERS & INITIALIZATION
  -------------------------------------------------------------------------- */
function initChapters() {
  const container = document.getElementById('chapters-grid');
  const tabs = document.querySelectorAll('.chapter-tab');
  if (!container) return;

  renderChapters('all');
function initEventsPage() {
  // Render initial pages
  renderPastEvents(1);
  renderUpcomingEvents(1);

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const region = tab.dataset.region || 'all';
      renderChapters(region);
    });
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
  // Modal Close Handlers
  if (closeMediaModalBtn) {
    closeMediaModalBtn.addEventListener('click', closeMediaModal);
  }
  if (mediaModalCloseBtn) {
    mediaModalCloseBtn.addEventListener('click', closeMediaModal);
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
  // Backdrop click closes modal
  if (mediaModal) {
    mediaModal.addEventListener('click', (e) => {
      if (e.target === mediaModal) {
        closeMediaModal();
      }
    });
  }

function initGlobalKeyboard() {
  // Escape key closes modal
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const openModals = document.querySelectorAll('.modal-overlay.open');
      openModals.forEach(m => closeModal(m));
    if (e.key === 'Escape' && mediaModal && !mediaModal.hasAttribute('hidden')) {
      closeMediaModal();
}
});
}

function escapeHtml(str) {
/**
 * Utility: HTML sanitizer helper
 */
function escapeHTML(str) {
if (!str) return '';
return String(str)
.replace(/&/g, '&amp;')
@@ -793,3 +569,9 @@ function escapeHtml(str) {
.replace(/'/g, '&#039;');
}

// Self-initializing lifecycle
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initEventsPage);
} else {
  initEventsPage();
}
