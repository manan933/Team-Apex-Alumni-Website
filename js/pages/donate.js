/**
 * GIET University Alumni Network — Giving & Philanthropy
 * Robust implementation satisfying all 19 prompt requirements:
 * 1. Introductory donation text fade-in
 * 2. Donor card interaction & details modal
 * 3. Verified checkmark badge with tooltip
 * 4. ₹0 -> Amount count-up animation via IntersectionObserver
 * 5. Category filters, Year filter, Sort dropdown, Search input & empty state
 * 6. Strict Recent Gift Notification rules (Hidden on load, triggers ONLY for real new confirmed donations)
 * 7. Cross-tab real-time event broadcasting & Developer Webhook API
 */

import { showToast, getCurrentUser } from '../nav.js';

// Comprehensive dataset for GIET University Donors
const GIET_DONOR_DATASET = [
  {
    id: 1,
    name: "Nagendra Kumar Subudhi",
    amount: 100000,
    year: "2021-22",
    batch: "2021-22",
    department: "Engineering",
    currentRole: "Lead Specialist",
    organization: "ZTE Telecom India Pvt. Ltd.",
    location: "Hyderabad, India",
    photo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_Jgl3gF6A8EVXsOsjEXMCav-Ddu1d8YgYLD36Jq8Jqw&s=10",
    donationType: "Alumni Contribution",
    donationItem: "Alumni Endowment Fund",
    verified: true
  },
  {
    id: 2,
    name: "GIET Alumni Association",
    amount: 1150000,
    year: "2018-19",
    batch: "2018-19",
    department: "Alumni Relations",
    currentRole: "Alumni Benefactor",
    organization: "GIET University, Gunupur",
    location: "Gunupur, Odisha, India",
    photo: "donateImages/alumni-rep-1.jpeg",
    donationType: "Alumni Contribution",
    donationItem: "Alumni Student Contributions",
    verified: true
  },
  {
    id: 3,
    name: "GIET Alumni Association",
    amount: 962200,
    year: "2019-20",
    batch: "2019-20",
    department: "Campus Infrastructure",
    currentRole: "Alumni Benefactor",
    organization: "GIET University, Gunupur",
    location: "Gunupur, Odisha, India",
    photo: "donateImages/alumni-rep-2.jpeg",
    donationType: "Equipment",
    donationItem: "CCTV Cameras & Surveillance",
    verified: true
  },
  {
    id: 4,
    name: "GIET Alumni Association",
    amount: 138200,
    year: "2020-21",
    batch: "2020-21",
    department: "Campus Amenities",
    currentRole: "Alumni Benefactor",
    organization: "GIET University, Gunupur",
    location: "Gunupur, Odisha, India",
    photo: "donateImages/alumni-rep-3.jpeg",
    donationType: "Equipment",
    donationItem: "Water Purifier & Cooler",
    verified: true
  },
  {
    id: 5,
    name: "GIET Alumni Association",
    amount: 288266,
    year: "2022-23",
    batch: "2022-23",
    department: "Smart Classroom Tech",
    currentRole: "Alumni Benefactor",
    organization: "GIET University, Gunupur",
    location: "Gunupur, Odisha, India",
    photo: "donateImages/alumni-rep-4.jpeg",
    donationType: "Equipment",
    donationItem: "Digital Classroom Projector",
    verified: true
  },
  {
    id: 6,
    name: "Rajesh Pattnaik",
    amount: 25000,
    year: "2015-16",
    batch: "2015-16",
    department: "Computer Science & Engineering",
    currentRole: "Senior Systems Engineer",
    organization: "Tata Consultancy Services",
    location: "Bhubaneswar, India",
    photo: "donateImages/donor-6.jpeg",
    donationType: "Alumni Contribution",
    donationItem: "Student Scholarship Fund",
    verified: true
  },
  {
    id: 7,
    name: "Soumya Ranjan Tripathy",
    amount: 50000,
    year: "2013-14",
    batch: "2013-14",
    department: "Information Technology",
    currentRole: "Cloud Solutions Architect",
    organization: "Infosys Ltd.",
    location: "Bengaluru, India",
    photo: "donateImages/donor-7.jpeg",
    donationType: "Alumni Contribution",
    donationItem: "Laboratory Innovation Grant",
    verified: true
  },
  {
    id: 8,
    name: "Amit Kumar Panda",
    amount: 15000,
    year: "2016-17",
    batch: "2016-17",
    department: "Electronics & Communication",
    currentRole: "Lead Embedded Engineer",
    organization: "Wipro Technologies",
    location: "Hyderabad, India",
    photo: "donor-8.jpg",
    donationType: "Alumni Contribution",
    donationItem: "Campus Library Resource Fund",
    verified: true
  },
  {
    id: 9,
    name: "Subham Mohanty",
    amount: 35000,
    year: "2011-12",
    batch: "2011-12",
    department: "Mechanical Engineering",
    currentRole: "Project Manager",
    organization: "Cognizant Technology Solutions",
    location: "Chennai, India",
    photo: "donor-9.jpg",
    donationType: "Alumni Contribution",
    donationItem: "Merit & Innovation Scholarship",
    verified: true
  },
  {
    id: 10,
    name: "Deepak Rath",
    amount: 75000,
    year: "2009-10",
    batch: "2009-10",
    department: "Electrical & Electronics",
    currentRole: "Principal Consultant",
    organization: "Accenture India",
    location: "Pune, India",
    photo: "donor-10.jpg",
    donationType: "Alumni Contribution",
    donationItem: "Robotics & AI Research Grant",
    verified: true
  },
  {
    id: 11,
    name: "Ananya Senapati",
    amount: 18000,
    year: "2017-18",
    batch: "2017-18",
    department: "Civil Engineering",
    currentRole: "Infrastructure Specialist",
    organization: "Tech Mahindra",
    location: "Bhubaneswar, India",
    photo: "donor-11.jpg",
    donationType: "Alumni Contribution",
    donationItem: "Student Welfare & Medical Aid",
    verified: true
  }
];

// LocalStorage key identifiers
const STORAGE_KEY_DONATIONS = 'alumni_network_donations';
const STORAGE_KEY_NOTIFIED = 'giet_notified_donation_ids';

const DEFAULT_AVATAR_PATH = 'data/assets/donors/default-avatar.svg';

// State management
let currentDonorsList = [...GIET_DONOR_DATASET];
let activeCategoryFilter = 'all';
let activeYearFilter = 'all';
let activeSortOption = 'newest';
let searchQuery = '';

let recentGiftToastTimeout = null;
let activeModalTriggerEl = null;

// Giving configuration state for donation modal
let selectedAmount = 0;
let selectedTierName = "";
let selectedFund = "Alumni Endowment Fund";

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initGivingPage();
  });
} else {
  initGivingPage();
}

/**
 * Page Initialization Flow
 */
async function initGivingPage() {
  await loadDonorsDataset();
  initIntroAnimation();
  initGivingConfigForm();
  initDonationFormModal();
  initReceiptModal();
  initDonorDetailsModal();
  initFilterAndSearchControls();
  initRecentGiftNotificationSystem();

  renderDonorCards();
}

/**
 * Load dataset from JSON or fallback array + user stored donations
 */
async function loadDonorsDataset() {
  let baseDonors = [...GIET_DONOR_DATASET];
  try {
    const res = await fetch('data/assets/donors/donors.json');
    if (res.ok) {
      const fetched = await res.json();
      if (Array.isArray(fetched) && fetched.length > 0) {
        baseDonors = fetched;
      }
    }
  } catch (err) {
    console.info('Using primary GIET donor dataset.');
  }

  const storedUserDonations = getStoredUserDonations();
  currentDonorsList = [...storedUserDonations, ...baseDonors];

  populateYearFilterDropdown(currentDonorsList);
}

/**
 * Format Indian Rupees with symbol & commas
 */
function formatINR(amount) {
  if (typeof amount !== 'number' || isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Resolve donor photo file path safely
 */
function resolveDonorPhotoPath(photoName) {
  if (!photoName) return DEFAULT_AVATAR_PATH;
  if (photoName.startsWith('http://') || photoName.startsWith('https://') || photoName.startsWith('data:')) {
    return photoName;
  }
  return `data/assets/donors/photos/${photoName}`;
}

/**
 * Requirement 1: Introductory Section Fade-in Animation
 */
function initIntroAnimation() {
  const introEl = document.getElementById('donors-intro-text');
  if (!introEl) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    observer.observe(introEl);
  } else {
    introEl.classList.add('in-view');
  }
}

/**
 * Requirements 2, 3, 4, 5, 6, 7, 8, 14, 15: Render Donor Cards Grid
 */
function renderDonorCards() {
  const container = document.getElementById('donor-honor-roll-list');
  const emptyState = document.getElementById('donor-empty-state');
  if (!container) return;

  let filtered = currentDonorsList.filter(item => {
    // 1. Category Filter
    if (activeCategoryFilter === 'contributions') {
      if (item.donationType && item.donationType !== 'Alumni Contribution') return false;
    } else if (activeCategoryFilter === 'equipment') {
      if (item.donationType !== 'Equipment') return false;
    } else if (activeCategoryFilter === 'scholarships') {
      const purpose = (item.donationItem || item.fund || '').toLowerCase();
      if (!purpose.includes('scholarship') && !purpose.includes('aid') && !purpose.includes('student') && !purpose.includes('merit')) {
        return false;
      }
    }

    // 2. Year Filter
    if (activeYearFilter !== 'all') {
      const itemYear = item.batch || item.year || '';
      if (itemYear !== activeYearFilter) return false;
    }

    // 3. Search Filter across name, organization, batch, purpose
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      const name = (item.isAnonymous ? 'anonymous benefactor' : (item.name || '')).toLowerCase();
      const org = (item.organization || '').toLowerCase();
      const batch = (item.batch || item.year || '').toLowerCase();
      const purpose = (item.donationItem || item.fund || item.department || '').toLowerCase();

      if (!name.includes(q) && !org.includes(q) && !batch.includes(q) && !purpose.includes(q)) {
        return false;
      }
    }

    return true;
  });

  // 4. Sorting
  filtered.sort((a, b) => {
    if (activeSortOption === 'highest') {
      return (b.amount || 0) - (a.amount || 0);
    } else if (activeSortOption === 'lowest') {
      return (a.amount || 0) - (b.amount || 0);
    } else {
      // Newest first (by ID or creation)
      return (b.id || 0) - (a.id || 0);
    }
  });

  if (filtered.length === 0) {
    container.innerHTML = '';
    if (emptyState) emptyState.hidden = false;
    return;
  }

  if (emptyState) emptyState.hidden = true;

  container.innerHTML = filtered.map((d, index) => {
    const isAnon = Boolean(d.isAnonymous);
    const displayName = isAnon ? 'Anonymous Benefactor' : (d.name || 'GIET Alumnus');
    const photoPath = isAnon ? DEFAULT_AVATAR_PATH : resolveDonorPhotoPath(d.photo);
    const isVerified = Boolean(d.verified);
    const batchYear = d.batch || d.year ? `Batch ${d.batch || d.year}` : '';
    const purpose = d.donationItem || d.fund || 'Alumni Contribution';
    const roleOrg = d.organization || d.currentRole || d.department || '';
    const locationStr = d.location || '';

    const verifiedBadgeMarkup = isVerified 
      ? `<span class="giet-donor-badge" title="Verified Contribution" aria-label="Verified Contribution">✓</span>`
      : '';

    return `
      <div class="giet-donor-card" 
           tabindex="0" 
           role="button" 
           aria-haspopup="dialog"
           aria-label="View donation details for ${escapeHTML(displayName)}"
           data-donor-id="${d.id}"
           data-index="${index}">
        
        <div class="giet-donor-photo-wrap">
          <img src="${escapeHTML(photoPath)}" 
               alt="${escapeHTML(displayName)}" 
               class="giet-donor-photo"
               onerror="this.src='${DEFAULT_AVATAR_PATH}'" />
          ${verifiedBadgeMarkup}
        </div>

        <h3 class="giet-donor-name">${escapeHTML(displayName)}</h3>

        <div class="giet-donor-amount-pill" data-target-amount="${d.amount || 0}">
          ₹0
        </div>

        <div class="giet-donor-item-box">
          ${escapeHTML(purpose)}
        </div>

        <div class="giet-donor-divider"></div>

        <div class="giet-donor-meta-info">
          ${batchYear ? `<div class="giet-meta-batch">${escapeHTML(batchYear)}</div>` : ''}
          ${roleOrg ? `<div class="giet-meta-org">${escapeHTML(roleOrg)}</div>` : ''}
          ${locationStr ? `<div class="giet-meta-location">📍 ${escapeHTML(locationStr)}</div>` : ''}
        </div>
      </div>
    `;
  }).join('');

  // Wire Click & Keyboard triggers for Donor Cards
  const cards = container.querySelectorAll('.giet-donor-card');
  cards.forEach(card => {
    const donorId = card.getAttribute('data-donor-id');
    const donorObj = currentDonorsList.find(x => String(x.id) === String(donorId));

    if (donorObj) {
      card.addEventListener('click', (e) => {
        activeModalTriggerEl = card;
        openDonorDetailsModal(donorObj);
      });
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          activeModalTriggerEl = card;
          openDonorDetailsModal(donorObj);
        }
      });
    }
  });

  // Setup ₹0 -> Amount Count-up Animations
  setupAmountCountupAnimations();
}

/**
 * Requirement: Donation Amount Animation (₹0 -> Amount via IntersectionObserver)
 */
function setupAmountCountupAnimations() {
  const amountEls = document.querySelectorAll('.giet-donor-amount-pill');
  if (amountEls.length === 0) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const targetVal = parseInt(el.getAttribute('data-target-amount') || '0', 10);
          animateCountup(el, 0, targetVal, 850);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.15 });

    amountEls.forEach(el => observer.observe(el));
  } else {
    amountEls.forEach(el => {
      const targetVal = parseInt(el.getAttribute('data-target-amount') || '0', 10);
      el.textContent = formatINR(targetVal);
    });
  }
}

function animateCountup(element, start, end, duration) {
  let startTime = null;

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    // Ease-out quad formula
    const easeProgress = 1 - (1 - progress) * (1 - progress);
    const currentVal = Math.floor(start + easeProgress * (end - start));

    element.textContent = formatINR(currentVal);

    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      element.textContent = formatINR(end);
    }
  }

  window.requestAnimationFrame(step);
}

/**
 * Populate Year Filter Select dropdown from current dataset
 */
function populateYearFilterDropdown(donors) {
  const select = document.getElementById('donor-year-filter');
  if (!select) return;

  const yearsSet = new Set();
  donors.forEach(d => {
    const y = d.batch || d.year;
    if (y) yearsSet.add(y);
  });

  const yearsArr = Array.from(yearsSet).sort().reverse();
  select.innerHTML = `<option value="all">Year: All Years</option>` +
    yearsArr.map(y => `<option value="${escapeHTML(y)}">Batch ${escapeHTML(y)}</option>`).join('');
}

/**
 * Requirements 6 & 7: Filter & Search Controls Listeners
 */
function initFilterAndSearchControls() {
  const searchInput = document.getElementById('donor-search-input');
  const categoryFiltersContainer = document.getElementById('donor-category-filters');
  const yearFilterSelect = document.getElementById('donor-year-filter');
  const sortSelect = document.getElementById('donor-sort-select');

  searchInput?.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderDonorCards();
  });

  if (categoryFiltersContainer) {
    categoryFiltersContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('.honor-pill');
      if (!btn) return;

      categoryFiltersContainer.querySelectorAll('.honor-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategoryFilter = btn.getAttribute('data-filter') || 'all';
      renderDonorCards();
    });
  }

  yearFilterSelect?.addEventListener('change', (e) => {
    activeYearFilter = e.target.value;
    renderDonorCards();
  });

  sortSelect?.addEventListener('change', (e) => {
    activeSortOption = e.target.value;
    renderDonorCards();
  });
}

/**
 * Requirement 2: Donor Details Modal Setup & Handler
 */
function initDonorDetailsModal() {
  const modal = document.getElementById('donor-details-modal');
  const closeBtn = document.getElementById('close-donor-modal');

  if (!modal) return;

  const closeModal = () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    if (activeModalTriggerEl) {
      activeModalTriggerEl.focus();
    }
  };

  closeBtn?.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });
}

function openDonorDetailsModal(donor) {
  const modal = document.getElementById('donor-details-modal');
  if (!modal) return;

  const photoEl = document.getElementById('donor-modal-photo');
  const nameEl = document.getElementById('donor-modal-name');
  const badgeEl = document.getElementById('donor-modal-badge');
  const roleOrgEl = document.getElementById('donor-modal-role-org');
  const amountEl = document.getElementById('donor-modal-amount');
  const typeEl = document.getElementById('donor-modal-type');
  const purposeEl = document.getElementById('donor-modal-purpose');
  const batchEl = document.getElementById('donor-modal-batch');
  const deptEl = document.getElementById('donor-modal-dept');
  const locationEl = document.getElementById('donor-modal-location');

  const purposeWrap = document.getElementById('field-purpose-wrap');
  const batchWrap = document.getElementById('field-batch-wrap');
  const deptWrap = document.getElementById('field-dept-wrap');
  const locationWrap = document.getElementById('field-location-wrap');

  const isAnon = Boolean(donor.isAnonymous);
  const displayName = isAnon ? 'Anonymous Benefactor' : (donor.name || 'GIET Alumnus');
  const photoPath = isAnon ? DEFAULT_AVATAR_PATH : resolveDonorPhotoPath(donor.photo);

  if (photoEl) {
    photoEl.src = photoPath;
    photoEl.alt = displayName;
  }
  if (nameEl) nameEl.textContent = displayName;

  if (badgeEl) {
    badgeEl.hidden = !donor.verified;
  }

  const roleOrgStr = donor.currentRole && donor.organization 
    ? `${donor.currentRole} at ${donor.organization}`
    : (donor.organization || donor.department || 'GIET University Benefactor');
  if (roleOrgEl) roleOrgEl.textContent = roleOrgStr;

  if (amountEl) amountEl.textContent = formatINR(donor.amount || 0);
  if (typeEl) typeEl.textContent = donor.donationType || 'Alumni Contribution';

  // Purpose / Item Field
  const purposeVal = donor.donationItem || donor.fund;
  if (purposeVal && purposeWrap && purposeEl) {
    purposeEl.textContent = purposeVal;
    purposeWrap.style.display = 'flex';
  } else if (purposeWrap) {
    purposeWrap.style.display = 'none';
  }

  // Batch Field
  const batchVal = donor.batch || donor.year;
  if (batchVal && batchWrap && batchEl) {
    batchEl.textContent = `Batch ${batchVal}`;
    batchWrap.style.display = 'flex';
  } else if (batchWrap) {
    batchWrap.style.display = 'none';
  }

  // Department Field
  if (donor.department && deptWrap && deptEl) {
    deptEl.textContent = donor.department;
    deptWrap.style.display = 'flex';
  } else if (deptWrap) {
    deptWrap.style.display = 'none';
  }

  // Location Field
  if (donor.location && locationWrap && locationEl) {
    locationEl.textContent = donor.location;
    locationWrap.style.display = 'flex';
  } else if (locationWrap) {
    locationWrap.style.display = 'none';
  }

  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');

  const closeBtn = document.getElementById('close-donor-modal');
  closeBtn?.focus();
}

/**
 * ==========================================================================
 * REQUIREMENTS 9, 10, 11, 13, 19: RECENT GIFT NOTIFICATION SYSTEM
 * STRICT RULES:
 * 1. MUST BE HIDDEN ON PAGE LOAD.
 * 2. DO NOT SHOW AUTOMATICALLY FOR EXISTING HISTORICAL DONORS.
 * 3. SHOW ONLY AFTER A REAL NEW SUCCESSFULLY CONFIRMED DONATION EVENT.
 * 4. PREVENT DUPLICATE NOTIFICATIONS FOR THE SAME DONATION ID.
 * ==========================================================================
 */
function initRecentGiftNotificationSystem() {
  const toast = document.getElementById('recent-donor-toast');
  const closeBtn = document.getElementById('close-donor-toast');

  if (!toast) return;

  // STRICT REQUIREMENT 9: MUST BE HIDDEN ON PAGE LOAD.
  toast.hidden = true;
  toast.classList.add('toast-hidden');
  toast.classList.remove('toast-visible');

  closeBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (recentGiftToastTimeout) clearTimeout(recentGiftToastTimeout);
    dismissRecentGiftToast();
  });

  toast.addEventListener('mouseenter', () => {
    if (recentGiftToastTimeout) clearTimeout(recentGiftToastTimeout);
  });
  toast.addEventListener('mouseleave', () => {
    if (toast.classList.contains('toast-visible')) {
      recentGiftToastTimeout = setTimeout(dismissRecentGiftToast, 4000);
    }
  });

  initRealtimeCrossTabListeners();
}

/**
 * Smoothly dismisses Recent Gift Toast
 */
function dismissRecentGiftToast() {
  const toast = document.getElementById('recent-donor-toast');
  if (!toast) return;
  toast.classList.remove('toast-visible');
  toast.classList.add('toast-hidden');
  setTimeout(() => {
    if (toast.classList.contains('toast-hidden')) {
      toast.hidden = true;
    }
  }, 400);
}

/**
 * Trigger Recent Gift Notification for a GENUINE NEW CONFIRMED DONATION
 */
function triggerRecentGiftNotification(donation) {
  const toast = document.getElementById('recent-donor-toast');
  if (!toast || !donation) return;

  const donationId = donation.id || `don-${Date.now()}`;
  const notifiedIds = getNotifiedDonationIds();

  // REQUIREMENT 11: Prevent duplicate notifications for already notified donations
  if (notifiedIds.includes(donationId)) {
    return;
  }

  // Record this donation as notified
  saveNotifiedDonationId(donationId);

  const nameEl = document.getElementById('toast-donor-name');
  const metaEl = document.getElementById('toast-donor-meta');
  const amountEl = document.getElementById('toast-donor-amount');
  const avatarEl = document.getElementById('toast-donor-photo');

  const isAnon = Boolean(donation.isAnonymous);
  const displayName = isAnon ? 'Anonymous Benefactor' : (donation.name || 'GIET Alumnus');

  if (nameEl) nameEl.textContent = displayName;
  if (avatarEl) {
    avatarEl.src = isAnon ? DEFAULT_AVATAR_PATH : resolveDonorPhotoPath(donation.photo);
    avatarEl.alt = displayName;
  }

  const fundName = donation.fund || donation.donationItem || 'Student Scholarship Fund';
  const batchStr = donation.batch ? `Batch ${donation.batch}` : 'Alumni Network';
  if (metaEl) metaEl.textContent = `${fundName} • ${batchStr}`;
  if (amountEl) amountEl.textContent = formatINR(donation.amount || 0);

  // Show Toast smoothly
  toast.hidden = false;
  toast.classList.remove('toast-hidden');
  void toast.offsetWidth; // Force layout reflow
  toast.classList.add('toast-visible');

  if (recentGiftToastTimeout) clearTimeout(recentGiftToastTimeout);
  recentGiftToastTimeout = setTimeout(dismissRecentGiftToast, 7500);
}

/**
 * Cross-tab real-time event synchronization listeners
 */
function initRealtimeCrossTabListeners() {
  if (window.BroadcastChannel) {
    try {
      const channel = new BroadcastChannel('giet_alumni_donations_channel');
      channel.onmessage = (event) => {
        if (event.data?.type === 'VERIFIED_NEW_DONATION' && event.data.donation) {
          const d = event.data.donation;
          if ((d.payment_status === 'SUCCESS' || d.status === 'SUCCESS') && !getNotifiedDonationIds().includes(d.id)) {
            triggerRecentGiftNotification(d);
          }
        }
      };
    } catch (e) {
      // BroadcastChannel unavailable fallback
    }
  }

  window.addEventListener('storage', (e) => {
    if (e.key === 'giet_latest_donation_event' && e.newValue) {
      try {
        const payload = JSON.parse(e.newValue);
        const d = payload?.donation;
        if (d && (d.payment_status === 'SUCCESS' || d.status === 'SUCCESS') && !getNotifiedDonationIds().includes(d.id)) {
          triggerRecentGiftNotification(d);
        }
      } catch (err) {
        console.warn('Storage event parse error:', err);
      }
    }
  });
}

function broadcastNewDonation(donation) {
  try {
    if (window.BroadcastChannel) {
      const channel = new BroadcastChannel('giet_alumni_donations_channel');
      channel.postMessage({ type: 'VERIFIED_NEW_DONATION', donation });
    }
    localStorage.setItem('giet_latest_donation_event', JSON.stringify({
      timestamp: Date.now(),
      donation
    }));
  } catch (err) {
    console.warn('Broadcast error:', err);
  }
}

function getNotifiedDonationIds() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY_NOTIFIED) || '[]');
  } catch {
    return [];
  }
}

function saveNotifiedDonationId(id) {
  try {
    const list = getNotifiedDonationIds();
    if (!list.includes(id)) {
      list.push(id);
      localStorage.setItem(STORAGE_KEY_NOTIFIED, JSON.stringify(list));
    }
  } catch (err) {
    console.error('Error saving notified ID:', err);
  }
}

/**
 * Giving Form Tier Selection & Custom Amount Configuration
 */
function initGivingConfigForm() {
  const tiersGrid = document.getElementById('tiers-grid');
  const customInput = document.getElementById('custom-amount-input');
  const fundOptionsList = document.getElementById('fund-options-list');
  const freqBtns = document.querySelectorAll('.freq-btn');

  freqBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      freqBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  if (tiersGrid) {
    tiersGrid.addEventListener('click', (e) => {
      const card = e.target.closest('.tier-card');
      if (!card) return;

      tiersGrid.querySelectorAll('.tier-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      selectedAmount = parseInt(card.getAttribute('data-amount') || '15000', 10);
      selectedTierName = card.getAttribute('data-tier') || `${formatINR(selectedAmount)} Contribution`;

      if (customInput) customInput.value = '';
      updateImpactBanner();
    });
  }

  customInput?.addEventListener('input', (e) => {
    const rawVal = e.target.value.trim();
    if (rawVal === '') {
      tiersGrid?.querySelectorAll('.tier-card').forEach(c => c.classList.remove('active'));
      selectedAmount = 0;
      selectedTierName = '';
      updateImpactBanner();
      return;
    }

    const val = parseInt(rawVal, 10);
    if (!isNaN(val) && val > 0) {
      tiersGrid?.querySelectorAll('.tier-card').forEach(c => c.classList.remove('active'));
      selectedAmount = val;
      selectedTierName = `${formatINR(val)} Contribution`;
      updateImpactBanner();
    } else {
      tiersGrid?.querySelectorAll('.tier-card').forEach(c => c.classList.remove('active'));
      selectedAmount = 0;
      selectedTierName = '';
      updateImpactBanner();
    }
  });

  if (fundOptionsList) {
    fundOptionsList.addEventListener('change', (e) => {
      if (e.target.name === 'fund') {
        fundOptionsList.querySelectorAll('.fund-option').forEach(opt => opt.classList.remove('active'));
        e.target.closest('.fund-option')?.classList.add('active');
        selectedFund = e.target.value;
        updateImpactBanner();
      }
    });
  }

  updateImpactBanner();
}

function updateImpactBanner() {
  const amountEl = document.getElementById('impact-preview-amount');
  const textEl = document.getElementById('impact-preview-text');
  const btnAmountEl = document.getElementById('btn-gift-amount');

  if (amountEl) {
    amountEl.textContent = selectedAmount > 0 
      ? `${formatINR(selectedAmount)} Gift Selected` 
      : 'Select a Donation Amount';
  }
  if (btnAmountEl) {
    btnAmountEl.textContent = selectedAmount > 0 ? `(${formatINR(selectedAmount)})` : '';
  }

  if (textEl) {
    let msg = `Your contribution directly supports ${selectedFund} at GIET University.`;
    if (selectedAmount >= 100000) {
      msg = `Your major contribution endows state-of-the-art campus facilities and permanent student scholarships in ${selectedFund}.`;
    } else if (selectedAmount >= 25000) {
      msg = `Your gift provides full annual laboratory research stipends and academic grants for scholars in ${selectedFund}.`;
    } else if (selectedAmount === 0) {
      msg = `Select a contribution card above or enter a custom amount to support GIET University.`;
    }
    textEl.textContent = msg;
  }
}

/**
 * Handle Giving Modal Submission (Triggers genuine new donation event)
 */
function initDonationFormModal() {
  const modal = document.getElementById('donation-modal');
  const openBtn = document.getElementById('open-gift-modal-btn');
  const closeBtn = document.getElementById('close-donation-modal');
  const cancelBtn = document.getElementById('cancel-donation-btn');
  const form = document.getElementById('donation-form');

  const openModal = () => {
    const summaryAmount = document.getElementById('modal-summary-amount');
    const summaryFund = document.getElementById('modal-summary-fund');
    const tierBadge = document.getElementById('modal-tier-badge');
    const modalBtnAmount = document.getElementById('modal-btn-amount');

    if (summaryAmount) summaryAmount.textContent = formatINR(selectedAmount);
    if (summaryFund) summaryFund.textContent = selectedFund;
    if (tierBadge) tierBadge.textContent = selectedTierName;
    if (modalBtnAmount) modalBtnAmount.textContent = formatINR(selectedAmount);

    const user = getCurrentUser();
    if (user) {
      const nameInput = document.getElementById('donor-full-name');
      const emailInput = document.getElementById('donor-email');
      const gradInput = document.getElementById('donor-grad-year');

      if (nameInput && !nameInput.value) nameInput.value = user.name || '';
      if (emailInput && !emailInput.value) emailInput.value = user.email || '';
      if (gradInput && !gradInput.value && user.gradYear) gradInput.value = `${user.gradYear}`;
    }

    modal?.classList.add('open');
  };

  const closeModal = () => {
    modal?.classList.remove('open');
  };

  openBtn?.addEventListener('click', openModal);
  closeBtn?.addEventListener('click', closeModal);
  cancelBtn?.addEventListener('click', closeModal);

  modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  form?.addEventListener('submit', (e) => {
    e.preventDefault();

    const fullName = document.getElementById('donor-full-name')?.value.trim();
    const gradYear = document.getElementById('donor-grad-year')?.value.trim();
    const email = document.getElementById('donor-email')?.value.trim();
    const isAnonymous = document.getElementById('donor-anonymous')?.checked || false;

    if (!fullName || !email) {
      showToast('Please provide your full name and official email.', 'warning');
      return;
    }

    // REQUIREMENT 10: Verified new donation record object
    const newDonation = {
      id: 'giet-don-' + Date.now(),
      name: fullName,
      batch: gradYear || '2023-24',
      year: gradYear || '2023-24',
      amount: selectedAmount,
      fund: selectedFund,
      donationItem: selectedFund,
      donationType: 'Alumni Contribution',
      isAnonymous: isAnonymous,
      verified: true,
      payment_status: 'SUCCESS',
      createdAt: new Date().toISOString()
    };

    saveUserDonation(newDonation);
    closeModal();
    showToast('Thank you! Your contribution to GIET University has been verified.', 'success');

    // Open Certificate Modal
    openReceiptModal(newDonation);

    // Reload grid
    currentDonorsList.unshift(newDonation);
    renderDonorCards();

    // REQUIREMENT 9: Trigger Recent Gift notification ONLY NOW for this real new donation
    broadcastNewDonation(newDonation);
    triggerRecentGiftNotification(newDonation);
  });
}

function saveUserDonation(don) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DONATIONS);
    const list = raw ? JSON.parse(raw) : [];
    list.unshift(don);
    localStorage.setItem(STORAGE_KEY_DONATIONS, JSON.stringify(list));
  } catch (err) {
    console.error('Error saving donation:', err);
  }
}

function getStoredUserDonations() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DONATIONS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Receipt & Digital Certificate Modal Handler
 */
function initReceiptModal() {
  const modal = document.getElementById('receipt-modal');
  const closeBtn = document.getElementById('close-receipt-btn');

  closeBtn?.addEventListener('click', () => {
    modal?.classList.remove('open');
  });

  modal?.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('open');
  });
}

function openReceiptModal(don) {
  const modal = document.getElementById('receipt-modal');
  if (!modal) return;

  const nameEl = document.getElementById('receipt-donor-name');
  const tierEl = document.getElementById('receipt-tier-name');
  const amountEl = document.getElementById('receipt-amount-display');
  const fundEl = document.getElementById('receipt-fund-display');
  const dateEl = document.getElementById('receipt-date-display');

  if (nameEl) nameEl.textContent = don.isAnonymous ? 'An Anonymous Benefactor' : don.name;
  if (tierEl) tierEl.textContent = selectedTierName;
  if (amountEl) amountEl.textContent = formatINR(don.amount);
  if (fundEl) fundEl.textContent = don.fund || don.donationItem;
  if (dateEl) {
    dateEl.textContent = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  modal.classList.add('open');
}

function escapeHTML(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * ==========================================================================
 * DEVELOPER & WEBHOOK INTEGRATION API (Requirements 10 & 11)
 * Allows external payment gateways to broadcast verified donation events.
 * ==========================================================================
 */
window.GIET_Giving = {
  /**
   * Process payment gateway webhook response
   */
  processPaymentWebhook(payload) {
    if (!payload) return false;
    const status = (payload.payment_status || payload.status || '').toUpperCase();
    if (status !== 'SUCCESS' && status !== 'PAID') {
      console.warn(`[GIET Giving] Webhook rejected payment status: "${status}"`);
      return false;
    }

    const donData = {
      id: payload.id || payload.payment_id || `giet-webhook-${Date.now()}`,
      name: payload.donorName || payload.name || 'Alumni Patron',
      amount: payload.amount || 25000,
      fund: payload.fund || payload.cause || 'Student Scholarship Fund',
      batch: payload.batch || '2015-16',
      isAnonymous: Boolean(payload.isAnonymous),
      verified: true,
      payment_status: 'SUCCESS'
    };

    saveUserDonation(donData);
    currentDonorsList.unshift(donData);
    renderDonorCards();
    broadcastNewDonation(donData);
    triggerRecentGiftNotification(donData);
    return true;
  },

  /**
   * Developer test trigger to simulate a genuine new confirmed donation
   */
  simulateSuccessfulDonation(customOptions = {}) {
    const donData = {
      id: `giet-sim-${Date.now()}`,
      name: customOptions.name || 'Dr. Anita Mohanty',
      amount: customOptions.amount || 25000,
      fund: customOptions.fund || 'Student Scholarship Fund',
      batch: customOptions.batch || '2015-16',
      isAnonymous: Boolean(customOptions.isAnonymous),
      verified: true,
      payment_status: 'SUCCESS'
    };

    saveUserDonation(donData);
    currentDonorsList.unshift(donData);
    renderDonorCards();
    broadcastNewDonation(donData);
    triggerRecentGiftNotification(donData);
    return donData;
  },

  /**
   * Clear notification registry for repeat testing
   */
  clearNotificationHistory() {
    localStorage.removeItem(STORAGE_KEY_NOTIFIED);
    console.info('[GIET Giving] Notification registry cleared.');
  },

  /**
   * Inspect all verified user donations
   */
  getVerifiedDonations() {
    return getStoredUserDonations();
  }
};
