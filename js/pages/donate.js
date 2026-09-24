/**
 * ==========================================================================
 * PAGE LOGIC: DONATE & PHILANTHROPY (donate.html)
 * Giving tiers, custom calculation, impact engine, corporate matching,
 * endowment legacy perpetuity calculator, gift modal, digital receipt,
 * and live 2026 Donor Honor Roll
 * ==========================================================================
 */

import { getCurrentUser } from '../auth.js';
import { showToast } from '../nav.js';

// Pre-seeded prominent institutional patrons across diverse eras and causes
const INITIAL_HONOR_ROLL = [
  { id: 'don-001', name: 'Marcus Vance', gradYear: "Class of '08", amount: 50000, tier: "Founder's Trust", fund: 'Quantum, AI & Robotics Discovery Labs', isFounder: true, isEndowment: true, dedicationType: 'honor', honoreeName: 'Dean Arthur Pendelton', createdAt: '2026-08-15T10:00:00Z' },
  { id: 'don-002', name: 'Dr. Elena Rostova', gradYear: "Class of '12", amount: 15000, tier: "Founder's Trust", fund: 'Undergraduate Need-Blind Scholarship Fund', isFounder: true, isEndowment: true, dedicationType: 'none', honoreeName: '', createdAt: '2026-08-20T14:30:00Z' },
  { id: 'don-003', name: 'Aria Chen', gradYear: "Class of '19", amount: 5000, tier: "President's Council", fund: 'Alumni Venture Catalyst Micro-Grants', isFounder: false, isEndowment: true, dedicationType: 'honor', honoreeName: 'Class of 2019 Founders', createdAt: '2026-08-29T11:20:00Z' },
  { id: 'don-004', name: 'Class of 2015 Memorial Fund', gradYear: "Class of '15", amount: 12500, tier: "Founder's Trust", fund: 'Undergraduate Need-Blind Scholarship Fund', isFounder: true, isEndowment: true, dedicationType: 'memory', honoreeName: 'Departed Classmates', createdAt: '2026-09-01T09:00:00Z' },
  { id: 'don-005', name: "Liam O'Connor", gradYear: "Class of '23", amount: 500, tier: "Dean's Circle", fund: 'Global Climate & Clean Energy Initiative', isFounder: false, isEndowment: false, dedicationType: 'none', honoreeName: '', createdAt: '2026-09-05T16:15:00Z' },
  { id: 'don-006', name: 'Devon Park', gradYear: "Class of '16", amount: 2500, tier: "President's Council", fund: 'Quantum, AI & Robotics Discovery Labs', isFounder: false, isEndowment: true, dedicationType: 'none', honoreeName: '', createdAt: '2026-09-07T12:00:00Z' },
  { id: 'don-007', name: 'Anonymous Benefactor', gradYear: 'Apex Parent', amount: 1000, tier: "Dean's Circle", fund: "Dean's Strategic Excellence Fund", isFounder: false, isEndowment: false, dedicationType: 'honor', honoreeName: 'Dr. James Sterling', createdAt: '2026-09-08T18:40:00Z' },
  { id: 'don-008', name: 'Sofia Rodriguez', gradYear: "Class of '18", amount: 250, tier: 'Century Club', fund: 'Undergraduate Need-Blind Scholarship Fund', isFounder: false, isEndowment: false, dedicationType: 'none', honoreeName: '', createdAt: '2026-09-10T08:10:00Z' },
  { id: 'don-009', name: 'Karthik Ramanathan', gradYear: "Class of '08", amount: 3500, tier: "President's Council", fund: 'Alumni Venture Catalyst Micro-Grants', isFounder: false, isEndowment: true, dedicationType: 'honor', honoreeName: 'Apex Robotics Club', createdAt: '2026-09-14T11:00:00Z' },
  { id: 'don-010', name: 'Emily & David Zhao', gradYear: 'Parents & Friends', amount: 10000, tier: "Founder's Trust", fund: "Dean's Strategic Excellence Fund", isFounder: true, isEndowment: true, dedicationType: 'honor', honoreeName: 'Undergraduate Scholar Cohort', createdAt: '2026-09-18T15:20:00Z' }
];

// Pre-seeded Corporate Matching Directory
const CORPORATE_MATCH_DIRECTORY = [
  { name: 'Google', ratio: '1:1', pct: '100%', cap: 10000 },
  { name: 'Microsoft', ratio: '1:1', pct: '100%', cap: 15000 },
  { name: 'Apple', ratio: '1:1', pct: '100%', cap: 10000 },
  { name: 'Amazon', ratio: '1:1', pct: '100%', cap: 5000 },
  { name: 'Meta', ratio: '1:1', pct: '100%', cap: 10000 },
  { name: 'Tata Consultancy Services', ratio: '1:1', pct: '100%', cap: 5000 },
  { name: 'Infosys Foundation', ratio: '1:1', pct: '100%', cap: 5000 },
  { name: 'Deloitte', ratio: '1:1', pct: '100%', cap: 7500 },
  { name: 'McKinsey & Company', ratio: '1:1', pct: '100%', cap: 10000 },
  { name: 'Goldman Sachs', ratio: '1:1', pct: '100%', cap: 20000 },
  { name: 'JPMorgan Chase', ratio: '1:1', pct: '100%', cap: 15000 },
  { name: 'Salesforce', ratio: '1:1', pct: '100%', cap: 5000 },
  { name: 'Cisco Systems', ratio: '1:1', pct: '100%', cap: 10000 },
  { name: 'Intel Foundation', ratio: '1:1', pct: '100%', cap: 10000 },
  { name: 'Nvidia', ratio: '1:1', pct: '100%', cap: 15000 },
  { name: 'Adobe', ratio: '1:1', pct: '100%', cap: 10000 },
  { name: 'Oracle', ratio: '1:1', pct: '100%', cap: 5000 },
  { name: 'IBM', ratio: '1:1', pct: '100%', cap: 5000 },
  { name: 'Accenture', ratio: '1:1', pct: '100%', cap: 5000 },
  { name: 'Wipro Cares', ratio: '1:1', pct: '100%', cap: 4000 }
];

// State
let selectedAmount = 500;
let selectedTierName = "Dean's Circle";
let selectedFrequency = 'one-time';
let selectedFund = 'Undergraduate Need-Blind Financial Aid';
let activeTierFilter = 'all';
let activeClassFilter = 'all';
let activeSearchQuery = '';
let selectedMatchedCompany = null;

document.addEventListener('DOMContentLoaded', () => {
  initFrequencyToggle();
  initTierSelection();
  initCustomAmount();
  initFundDesignation();
  initCorporateMatching();
  initEndowmentCalculator();
  initDonationModal();
  initReceiptModal();
  initHonorRollFilters();
  renderDonorHonorRoll();
  incrementCampaignTotal(0);
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
 * Custom Amount Input & Quick Chips
 */
function initCustomAmount() {
  const customInput = document.getElementById('custom-amount-input');
  if (!customInput) return;

  customInput.addEventListener('input', (e) => {
    const val = parseInt(e.target.value, 10);
    const tierCards = document.querySelectorAll('.tier-card');

    if (!val || val < 1) {
      selectedAmount = 50;
      selectedTierName = 'Alumni Scholar Patron';
    } else {
      selectedAmount = val;
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

  // Quick Chips
  const chips = document.querySelectorAll('.amount-chip');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const amt = parseInt(chip.getAttribute('data-chip'), 10);
      if (amt && customInput) {
        customInput.value = amt;
        customInput.dispatchEvent(new Event('input'));
      }
    });
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
 * Update dynamic impact, button labels, and corporate match banner
 */
function updateUI() {
  const btnAmount = document.getElementById('btn-gift-amount');
  if (btnAmount) {
    btnAmount.textContent = `$${selectedAmount.toLocaleString()}`;
  }

  updateImpactBanner();
  updateCorporateMatchBanner();
}

function updateImpactBanner() {
  const previewAmount = document.getElementById('impact-preview-amount');
  const previewText = document.getElementById('impact-preview-text');
  if (!previewAmount || !previewText) return;

  const freqSuffix = selectedFrequency === 'annual' ? ' Annual Fellow' : '';
  previewAmount.textContent = `$${selectedAmount.toLocaleString()}${freqSuffix} • ${selectedTierName}`;

  let impactMsg = '';
  if (selectedAmount >= 10000) {
    impactMsg = `Your visionary benefaction of $${selectedAmount.toLocaleString()} establishes permanent fixtures in the ${selectedFund}, underwriting multiple scholar fellowships, faculty grants, or laboratory instruments into perpetuity.`;
  } else if (selectedAmount >= 2500) {
    impactMsg = `Your gift directly endows an annual named graduate student fellowship and covers essential research stipends in the ${selectedFund}.`;
  } else if (selectedAmount >= 500) {
    impactMsg = `Your gift directly underwrites 1 full semester of specialized laboratory equipment, cloud compute, and living stipends for a student scholar in ${selectedFund}.`;
  } else {
    impactMsg = `Your contribution funds essential research symposium travel grants, laboratory textbooks, and student project hardware supported by the ${selectedFund}.`;
  }

  previewText.textContent = impactMsg;
}

/**
 * Corporate Matching Engine
 */
function initCorporateMatching() {
  const searchInput = document.getElementById('employer-search-input');
  const dropdown = document.getElementById('employer-results');
  if (!searchInput || !dropdown) return;

  searchInput.addEventListener('input', (e) => {
    const q = e.target.value.trim().toLowerCase();
    if (!q || q.length < 2) {
      dropdown.innerHTML = '';
      dropdown.hidden = true;
      return;
    }

    const matches = CORPORATE_MATCH_DIRECTORY.filter(c => c.name.toLowerCase().includes(q));
    if (matches.length === 0) {
      dropdown.innerHTML = `<div class="match-result-item" style="cursor: default; color: #64748B;">No direct match found. You can submit manual proof after giving.</div>`;
      dropdown.hidden = false;
      return;
    }

    dropdown.innerHTML = matches.map(c => `
      <div class="match-result-item" data-company="${escapeHTML(c.name)}">
        <strong>${escapeHTML(c.name)}</strong>
        <span class="match-ratio-badge">${c.pct} Match (Up to $${c.cap.toLocaleString()})</span>
      </div>
    `).join('');
    dropdown.hidden = false;

    // Attach click handlers
    dropdown.querySelectorAll('.match-result-item[data-company]').forEach(item => {
      item.addEventListener('click', () => {
        const compName = item.getAttribute('data-company');
        const found = CORPORATE_MATCH_DIRECTORY.find(c => c.name === compName);
        if (found) {
          selectedMatchedCompany = found;
          searchInput.value = found.name;
          dropdown.hidden = true;
          updateCorporateMatchBanner();
        }
      });
    });
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.hidden = true;
    }
  });
}

function updateCorporateMatchBanner() {
  const banner = document.getElementById('match-callout');
  const nameEl = document.getElementById('match-company-name');
  const doubledEl = document.getElementById('match-doubled-amount');
  const ratioBadge = document.getElementById('match-ratio-badge');

  if (!banner || !selectedMatchedCompany) return;

  banner.hidden = false;
  if (nameEl) nameEl.textContent = selectedMatchedCompany.name;
  if (ratioBadge) ratioBadge.textContent = `${selectedMatchedCompany.pct} Match Verified`;
  
  const matchedAmount = Math.min(selectedAmount, selectedMatchedCompany.cap);
  const totalImpact = selectedAmount + matchedAmount;
  if (doubledEl) doubledEl.textContent = `$${totalImpact.toLocaleString()}`;
}

/**
 * Endowment Legacy Perpetuity Calculator
 */
function initEndowmentCalculator() {
  const slider = document.getElementById('legacy-slider');
  const principalDisplay = document.getElementById('calc-principal-display');
  const annualPayout = document.getElementById('calc-annual-payout');
  const yield10yr = document.getElementById('calc-10yr-yield');
  const yield25yr = document.getElementById('calc-25yr-yield');
  const btnAmount = document.getElementById('calc-btn-amount');
  const applyBtn = document.getElementById('calc-apply-btn');
  const presetChips = document.querySelectorAll('.preset-chip');

  if (!slider) return;

  const calculate = (principal) => {
    const rate = 0.05; // 5% annual payout standard
    const annual = principal * rate;
    const tenYear = annual * 10;
    const twentyFiveYear = annual * 25;

    if (principalDisplay) principalDisplay.textContent = `$${principal.toLocaleString()}`;
    if (annualPayout) annualPayout.textContent = `$${annual.toLocaleString()} / yr`;
    if (yield10yr) yield10yr.textContent = `$${tenYear.toLocaleString()}`;
    if (yield25yr) yield25yr.textContent = `$${twentyFiveYear.toLocaleString()}`;
    if (btnAmount) btnAmount.textContent = `${principal.toLocaleString()}`;
  };

  slider.addEventListener('input', (e) => {
    const val = parseInt(e.target.value, 10);
    presetChips.forEach(c => {
      c.classList.toggle('active', parseInt(c.getAttribute('data-calc'), 10) === val);
    });
    calculate(val);
  });

  presetChips.forEach(chip => {
    chip.addEventListener('click', () => {
      presetChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const val = parseInt(chip.getAttribute('data-calc'), 10);
      slider.value = val;
      calculate(val);
    });
  });

  applyBtn?.addEventListener('click', () => {
    const val = parseInt(slider.value, 10);
    const customInput = document.getElementById('custom-amount-input');
    if (customInput) {
      customInput.value = val;
      customInput.dispatchEvent(new Event('input'));
      window.scrollTo({ top: document.querySelector('.giving-form-card').offsetTop - 80, behavior: 'smooth' });
      showToast(`Selected $${val.toLocaleString()} endowed contribution.`, 'info');
    }
  });

  calculate(parseInt(slider.value, 10) || 5000);
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

  // Dedication pill selector toggle
  const dedicationPills = document.querySelectorAll('.dedication-pill');
  const dedicationDetails = document.getElementById('dedication-details');
  const honoreeLabel = document.getElementById('honoree-label');

  dedicationPills.forEach(pill => {
    pill.addEventListener('click', () => {
      dedicationPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const radio = pill.querySelector('input[type="radio"]');
      if (radio) {
        radio.checked = true;
        if (radio.value === 'none') {
          if (dedicationDetails) dedicationDetails.hidden = true;
        } else {
          if (dedicationDetails) dedicationDetails.hidden = false;
          if (honoreeLabel) {
            honoreeLabel.textContent = radio.value === 'honor' ? 'Honoree Full Name (In Honor Of)' : 'Honoree Full Name (In Memory Of)';
          }
        }
      }
    });
  });

  const openModal = () => {
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

    const dedicationTypeRadio = document.querySelector('input[name="dedicationType"]:checked');
    const dedicationType = dedicationTypeRadio ? dedicationTypeRadio.value : 'none';
    const honoreeName = document.getElementById('donor-honoree-name')?.value.trim() || '';
    const honoreeEmail = document.getElementById('donor-honoree-email')?.value.trim() || '';

    if (!fullName || !email) {
      showToast('Please provide your name and official email address.', 'warning');
      return;
    }

    const newDonation = {
      id: 'don-' + Date.now(),
      name: isAnonymous ? 'Anonymous Benefactor' : fullName,
      gradYear: gradYear || 'Apex Alumnus',
      amount: selectedAmount,
      tier: selectedTierName,
      fund: selectedFund,
      dedicationType: dedicationType,
      honoreeName: honoreeName,
      honoreeEmail: honoreeEmail,
      isAnonymous: isAnonymous,
      isEndowment: selectedAmount >= 2500,
      isFounder: selectedAmount >= 10000,
      createdAt: new Date().toISOString()
    };

    saveDonation(newDonation);
    closeModal();
    showToast(`Your institutional gift of $${selectedAmount.toLocaleString()} has been sealed. Thank you!`, 'success');

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
  const printBtn = document.getElementById('print-receipt-btn');

  closeBtn?.addEventListener('click', () => {
    modal?.classList.remove('open');
    const honorSection = document.getElementById('recognition-wall');
    if (honorSection) {
      honorSection.scrollIntoView({ behavior: 'smooth' });
    }
  });

  printBtn?.addEventListener('click', () => {
    window.print();
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
  const dedicationEl = document.getElementById('receipt-dedication-display');

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

  if (dedicationEl) {
    if (don.dedicationType && don.dedicationType !== 'none' && don.honoreeName) {
      const prefix = don.dedicationType === 'honor' ? 'In Honor of' : 'In Memory of';
      dedicationEl.textContent = `Dedicated ${prefix} ${don.honoreeName}`;
      dedicationEl.hidden = false;
    } else {
      dedicationEl.hidden = true;
    }
  }

  modal.classList.add('open');
}

/**
 * Honor Roll Filter Controls Setup
 */
function initHonorRollFilters() {
  const filterPills = document.querySelectorAll('.honor-pill');
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeTierFilter = pill.getAttribute('data-filter') || 'all';
      renderDonorHonorRoll();
    });
  });

  const classSelect = document.getElementById('class-year-filter');
  classSelect?.addEventListener('change', (e) => {
    activeClassFilter = e.target.value;
    renderDonorHonorRoll();
  });

  const searchInput = document.getElementById('honor-search-input');
  searchInput?.addEventListener('input', (e) => {
    activeSearchQuery = e.target.value.trim().toLowerCase();
    renderDonorHonorRoll();
  });
}

/**
 * Donor Honor Roll List & Filtering
 */
function renderDonorHonorRoll() {
  const container = document.getElementById('donor-honor-roll-list');
  const totalCountBadge = document.getElementById('honor-total-count');
  const metricCount = document.getElementById('metric-donors-count');
  if (!container) return;

  const stored = getStoredDonations();
  const allDonors = [...stored, ...INITIAL_HONOR_ROLL];

  if (totalCountBadge) totalCountBadge.textContent = allDonors.length;
  if (metricCount) metricCount.textContent = `${allDonors.length}+`;

  let filtered = allDonors;

  // 1. Tier Filter
  if (activeTierFilter === 'endowment') {
    filtered = filtered.filter(d => d.amount >= 2500 || d.isEndowment || d.isFounder);
  } else if (activeTierFilter === 'dean') {
    filtered = filtered.filter(d => d.amount >= 500);
  } else if (activeTierFilter === 'century') {
    filtered = filtered.filter(d => d.tier === 'Century Club' || (d.amount >= 100 && d.amount < 500));
  } else if (activeTierFilter === 'recent') {
    filtered = filtered.slice(0, 8);
  }

  // 2. Class Year Filter
  if (activeClassFilter !== 'all') {
    if (activeClassFilter === 'parent') {
      filtered = filtered.filter(d => d.gradYear && (d.gradYear.toLowerCase().includes('parent') || d.gradYear.toLowerCase().includes('friend')));
    } else {
      filtered = filtered.filter(d => d.gradYear && d.gradYear.includes(activeClassFilter));
    }
  }

  // 3. Keyword / Search Query
  if (activeSearchQuery) {
    filtered = filtered.filter(d => 
      d.name.toLowerCase().includes(activeSearchQuery) ||
      (d.gradYear && d.gradYear.toLowerCase().includes(activeSearchQuery)) ||
      (d.fund && d.fund.toLowerCase().includes(activeSearchQuery)) ||
      (d.honoreeName && d.honoreeName.toLowerCase().includes(activeSearchQuery))
    );
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px; background: #FAF8F4; border: 1px dashed #E8E1D9; border-radius: 6px; color: #64748B;">
        No benefactor records found matching your filters.
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(d => {
    let tierClass = '';
    if (d.amount >= 10000 || d.isFounder) {
      tierClass = 'is-founder';
    } else if (d.amount >= 2500 || d.isEndowment) {
      tierClass = 'is-endowment';
    }

    let dedicationMarkup = '';
    if (d.honoreeName) {
      const prefix = d.dedicationType === 'memory' ? 'In memory of' : 'In honor of';
      dedicationMarkup = `<span class="donor-dedication-tag">${prefix} ${escapeHTML(d.honoreeName)}</span>`;
    }

    return `
      <div class="donor-card-item ${tierClass}">
        <div class="donor-card-left">
          <span class="donor-name-strong">${escapeHTML(d.name)}</span>
          <span class="donor-meta-sub">${escapeHTML(d.gradYear)} &bull; ${escapeHTML(d.fund)}</span>
          ${dedicationMarkup}
        </div>
        <span class="donor-tier-tag">${escapeHTML(d.tier)}</span>
      </div>
    `;
  }).join('');
}

/**
 * Increment campaign total
 */
function incrementCampaignTotal(addAmount) {
  const totalEl = document.getElementById('campaign-total-raised');
  const pctEl = document.getElementById('campaign-pct');
  const barFill = document.getElementById('campaign-bar-fill');

  const base = 3842500;
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
