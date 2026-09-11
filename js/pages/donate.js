/**
 * ==========================================================================
 * PAGE LOGIC: DONATE & PHILANTHROPY (donate.html)
 * Giving tiers, custom calculation, impact engine, gift modal, digital receipt,
 * and live 2026 Donor Honor Roll
 * ==========================================================================
 */

import { getCurrentUser } from '../auth.js';
import { showToast } from '../nav.js';

// Pre-seeded prominent institutional patrons
const INITIAL_HONOR_ROLL = [
  { id: 'don-001', name: 'Marcus Vance', gradYear: 'Class of \'08', amount: 50000, tier: 'Founder\'s Trust', fund: 'Quantum & Autonomous Robotics Labs', isEndowment: true, createdAt: '2026-08-15T10:00:00Z' },
  { id: 'don-002', name: 'Dr. Elena Rostova', gradYear: 'Class of \'12', amount: 15000, tier: 'Founder\'s Trust', fund: 'Undergraduate Need-Blind Financial Aid', isEndowment: true, createdAt: '2026-08-20T14:30:00Z' },
  { id: 'don-003', name: 'Aria Chen', gradYear: 'Class of \'19', amount: 5000, tier: 'President\'s Council', fund: 'Alumni Venture Catalyst Micro-Grants', isEndowment: true, createdAt: '2026-08-29T11:20:00Z' },
  { id: 'don-004', name: 'Class of 2015 Memorial Fellowship', gradYear: 'Reunion Gift', amount: 12500, tier: 'Founder\'s Trust', fund: 'Undergraduate Need-Blind Financial Aid', isEndowment: true, createdAt: '2026-09-01T09:00:00Z' },
  { id: 'don-005', name: 'Liam O\'Connor', gradYear: 'Class of \'23', amount: 500, tier: 'Dean\'s Circle', fund: 'Global Climate & Clean Energy Initiative', isEndowment: false, createdAt: '2026-09-05T16:15:00Z' },
  { id: 'don-006', name: 'Devon Park', gradYear: 'Class of \'16', amount: 2500, tier: 'President\'s Council', fund: 'Quantum & Autonomous Robotics Labs', isEndowment: true, createdAt: '2026-09-07T12:00:00Z' },
  { id: 'don-007', name: 'Anonymous Benefactor', gradYear: 'Apex Parent', amount: 1000, tier: 'Dean\'s Circle', fund: 'Dean\'s Strategic Excellence Fund', isEndowment: false, createdAt: '2026-09-08T18:40:00Z' },
  { id: 'don-008', name: 'Sofia Rodriguez', gradYear: 'Class of \'18', amount: 250, tier: 'Century Club', fund: 'Undergraduate Need-Blind Financial Aid', isEndowment: false, createdAt: '2026-09-10T08:10:00Z' }
];

let selectedAmount = 500;
let selectedTierName = "Dean's Circle";
let selectedFrequency = 'one-time';
let selectedFund = 'Undergraduate Need-Blind Financial Aid';
let activeHonorFilter = 'all';

document.addEventListener('DOMContentLoaded', () => {
  initFrequencyToggle();
  initTierSelection();
  initCustomAmount();
  initFundDesignation();
  updateImpactBanner();
  initDonationModal();
  initReceiptModal();
  renderDonorHonorRoll();
});

/**
 * Frequency Toggle (One-Time vs Annual)
 */
function initFrequencyToggle() {
  const buttons = document.querySelectorAll('.freq-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedFrequency = btn.getAttribute('data-freq');
      updateImpactBanner();
    });
  });
}

/**
 * Giving Tiers Selector
 */
function initTierSelection() {
  const tierCards = document.querySelectorAll('.tier-card');
  const customInput = document.getElementById('custom-amount-input');

  tierCards.forEach(card => {
    card.addEventListener('click', () => {
      tierCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      if (customInput) customInput.value = '';

      selectedAmount = parseInt(card.getAttribute('data-amount'), 10) || 500;
      selectedTierName = card.getAttribute('data-tier') || "Dean's Circle";

      updateUI();
    });
  });
}

/**
 * Custom Amount Input
 */
function initCustomAmount() {
  const customInput = document.getElementById('custom-amount-input');
  if (!customInput) return;

  customInput.addEventListener('input', (e) => {
    const val = parseInt(e.target.value, 10);
    const tierCards = document.querySelectorAll('.tier-card');

    if (!val || val < 1) {
      selectedAmount = 50;
      selectedTierName = 'Alumni Supporter';
    } else {
      selectedAmount = val;
      // Deselect predefined cards
      tierCards.forEach(c => c.classList.remove('active'));

      if (val >= 10000) {
        selectedTierName = "Founder's Trust";
      } else if (val >= 2500) {
        selectedTierName = "President's Council";
      } else if (val >= 500) {
        selectedTierName = "Dean's Circle";
      } else if (val >= 100) {
        selectedTierName = "Century Club";
      } else {
        selectedTierName = "Alumni Scholar Patron";
      }
    }

    updateUI();
  });
}

/**
 * Fund Designation Selection
 */
function initFundDesignation() {
  const options = document.querySelectorAll('.fund-option');
  options.forEach(opt => {
    opt.addEventListener('click', () => {
      options.forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      const radio = opt.querySelector('input[type="radio"]');
      if (radio) {
        radio.checked = true;
        selectedFund = radio.value;
      }
      updateImpactBanner();
    });
  });
}

/**
 * Update dynamic impact and button labels
 */
function updateUI() {
  const btnAmount = document.getElementById('btn-gift-amount');
  if (btnAmount) {
    btnAmount.textContent = `$${selectedAmount.toLocaleString()}`;
  }
  updateImpactBanner();
}

function updateImpactBanner() {
  const previewAmount = document.getElementById('impact-preview-amount');
  const previewText = document.getElementById('impact-preview-text');
  if (!previewAmount || !previewText) return;

  const freqSuffix = selectedFrequency === 'annual' ? ' Annual Fellow' : '';
  previewAmount.textContent = `$${selectedAmount.toLocaleString()}${freqSuffix} • ${selectedTierName}`;

  let impactMsg = '';
  if (selectedAmount >= 10000) {
    impactMsg = `Your visionary benefaction establishes permanent fixtures in the ${selectedFund}, underwriting multiple scholar fellowships or laboratory instrumentation for years to come.`;
  } else if (selectedAmount >= 2500) {
    impactMsg = `Your gift directly endows an annual named graduate student fellowship and covers essential research stipends in the ${selectedFund}.`;
  } else if (selectedAmount >= 500) {
    impactMsg = `Your gift directly underwrites 1 full semester of specialized research laboratory equipment and materials for an undergraduate scholar in ${selectedFund}.`;
  } else {
    impactMsg = `Your contribution funds vital research travel grants, technical textbooks, and symposium access for students supported by the ${selectedFund}.`;
  }

  previewText.textContent = impactMsg;
}

/**
 * Donation Modal Setup & Submission
 */
function initDonationModal() {
  const modal = document.getElementById('donation-modal');
  const openBtn = document.getElementById('open-gift-modal-btn');
  const closeBtn = document.getElementById('close-donation-modal');
  const cancelBtn = document.getElementById('cancel-donation-btn');
  const form = document.getElementById('donation-form');

  const openModal = () => {
    // Populate summary
    const summaryAmount = document.getElementById('modal-summary-amount');
    const summaryFund = document.getElementById('modal-summary-fund');
    const tierBadge = document.getElementById('modal-tier-badge');
    const modalBtnAmount = document.getElementById('modal-btn-amount');

    if (summaryAmount) summaryAmount.textContent = `$${selectedAmount.toLocaleString()}.00`;
    if (summaryFund) summaryFund.textContent = selectedFund;
    if (tierBadge) tierBadge.textContent = selectedTierName;
    if (modalBtnAmount) modalBtnAmount.textContent = `$${selectedAmount.toLocaleString()}`;

    // Prefill user details if logged in
    const user = getCurrentUser();
    if (user) {
      const nameInput = document.getElementById('donor-full-name');
      const emailInput = document.getElementById('donor-email');
      const gradInput = document.getElementById('donor-grad-year');

      if (nameInput && !nameInput.value) nameInput.value = user.name || '';
      if (emailInput && !emailInput.value) emailInput.value = user.email || '';
      if (gradInput && !gradInput.value && user.gradYear) gradInput.value = `Class of '${String(user.gradYear).slice(-2)}`;
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

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal?.classList.contains('open')) closeModal();
  });

  // Handle donation submission
  form?.addEventListener('submit', (e) => {
    e.preventDefault();

    const fullName = document.getElementById('donor-full-name')?.value.trim();
    const gradYear = document.getElementById('donor-grad-year')?.value.trim();
    const email = document.getElementById('donor-email')?.value.trim();
    const isAnonymous = document.getElementById('donor-anonymous')?.checked || false;

    if (!fullName || !email) {
      showToast('Please provide your name and email address.', 'warning');
      return;
    }

    const newDonation = {
      id: 'don-' + Date.now(),
      name: isAnonymous ? 'Anonymous Benefactor' : fullName,
      gradYear: gradYear || 'Apex Alumnus',
      amount: selectedAmount,
      tier: selectedTierName,
      fund: selectedFund,
      isAnonymous: isAnonymous,
      isEndowment: selectedAmount >= 2500,
      createdAt: new Date().toISOString()
    };

    saveDonation(newDonation);
    closeModal();
    showToast('Your institutional gift has been successfully recorded. Thank you!', 'success');

    // Open Certificate / Receipt Modal
    openReceiptModal(newDonation);

    // Refresh Honor Roll & Campaign Progress
    renderDonorHonorRoll();
    incrementCampaignTotal(selectedAmount);
  });
}

/**
 * Save donation to localStorage
 */
function saveDonation(don) {
  try {
    const raw = localStorage.getItem('alumni_network_donations');
    const list = raw ? JSON.parse(raw) : [];
    list.unshift(don);
    localStorage.setItem('alumni_network_donations', JSON.stringify(list));
  } catch (err) {
    console.error('Error saving donation:', err);
  }
}

function getStoredDonations() {
  try {
    const raw = localStorage.getItem('alumni_network_donations');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Receipt & Digital Certificate Modal
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
  const serialEl = document.getElementById('receipt-serial-num');

  if (nameEl) nameEl.textContent = don.isAnonymous ? 'An Anonymous Alumnus' : don.name;
  if (tierEl) tierEl.textContent = don.tier;
  if (amountEl) amountEl.textContent = `$${don.amount.toLocaleString()}.00 USD`;
  if (fundEl) fundEl.textContent = don.fund;
  if (dateEl) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    dateEl.textContent = new Date().toLocaleDateString('en-US', options);
  }
  if (serialEl) {
    serialEl.textContent = `REC-2026-ENDOW-${Math.floor(10000 + Math.random() * 90000)}`;
  }

  modal.classList.add('open');
}

/**
 * Donor Honor Roll List & Filtering
 */
function renderDonorHonorRoll() {
  const container = document.getElementById('donor-honor-roll-list');
  if (!container) return;

  const stored = getStoredDonations();
  // Merge stored donations on top of initial
  const allDonors = [...stored, ...INITIAL_HONOR_ROLL];

  let filtered = allDonors;
  if (activeHonorFilter === 'endowment') {
    filtered = allDonors.filter(d => d.amount >= 2500 || d.isEndowment);
  } else if (activeHonorFilter === 'recent') {
    filtered = allDonors.slice(0, 8);
  }

  container.innerHTML = filtered.map(d => `
    <div class="donor-card-item ${d.amount >= 2500 ? 'is-endowment' : ''}">
      <div class="donor-card-left">
        <span class="donor-name-strong">${escapeHTML(d.name)}</span>
        <span class="donor-meta-sub">${escapeHTML(d.gradYear)} &bull; ${escapeHTML(d.fund)}</span>
      </div>
      <span class="donor-tier-tag">${escapeHTML(d.tier)}</span>
    </div>
  `).join('');

  // Wire filter pill events
  const filterPills = document.querySelectorAll('.honor-pill');
  filterPills.forEach(pill => {
    pill.onclick = () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeHonorFilter = pill.getAttribute('data-filter');
      renderDonorHonorRoll();
    };
  });
}

/**
 * Increment campaign total
 */
function incrementCampaignTotal(addAmount) {
  const totalEl = document.getElementById('campaign-total-raised');
  const pctEl = document.getElementById('campaign-pct');
  const barFill = document.getElementById('campaign-bar-fill');

  let base = 3842500;
  const stored = getStoredDonations();
  const extra = stored.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const currentTotal = base + extra;
  const goal = 5000000;
  const pct = Math.min(100, (currentTotal / goal) * 100);

  if (totalEl) totalEl.textContent = `$${currentTotal.toLocaleString()}`;
  if (pctEl) pctEl.textContent = `${pct.toFixed(1)}%`;
  if (barFill) barFill.style.width = `${pct.toFixed(1)}%`;
}

function escapeHTML(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
