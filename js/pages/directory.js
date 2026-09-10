/**
 * ==========================================================================
 * PAGE LOGIC: ALUMNI DIRECTORY (directory.html)
 * Real-time multi-filter engine (AND logic), search, modal detail viewer
 * ==========================================================================
 */

import { getAlumni } from '../storage-service.js';

let allAlumni = [];
let filteredAlumni = [];

// Filter state
const filterState = {
  searchQuery: '',
  batch: 'ALL',
  company: 'ALL',
  industry: 'ALL',
  degree: 'ALL'
};

document.addEventListener('DOMContentLoaded', async () => {
  allAlumni = await getAlumni();
  
  // Read any initial query params (e.g. ?search=Elena)
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('search')) {
    filterState.searchQuery = urlParams.get('search');
    const searchInput = document.getElementById('search-name');
    if (searchInput) searchInput.value = filterState.searchQuery;
  }
  if (urlParams.get('company')) {
    filterState.company = urlParams.get('company');
  }

  populateFilterDropdowns();
  bindFilterEvents();
  applyFilters();
  initDetailModal();
});

/**
 * Dynamically extract unique values from alumni dataset to populate dropdowns
 */
function populateFilterDropdowns() {
  const selectBatch = document.getElementById('filter-batch');
  const selectCompany = document.getElementById('filter-company');
  const selectIndustry = document.getElementById('filter-industry');
  const selectDegree = document.getElementById('filter-degree');

  if (selectBatch) {
    const batches = [...new Set(allAlumni.map(a => a.gradYear).filter(Boolean))].sort((a, b) => b - a);
    batches.forEach(year => {
      const opt = document.createElement('option');
      opt.value = year;
      opt.textContent = `Class of ${year}`;
      selectBatch.appendChild(opt);
    });
  }

  if (selectCompany) {
    const companies = [...new Set(allAlumni.map(a => a.company).filter(Boolean))].sort();
    companies.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c;
      opt.textContent = c;
      if (filterState.company === c) opt.selected = true;
      selectCompany.appendChild(opt);
    });
  }

  if (selectIndustry) {
    const industries = [...new Set(allAlumni.map(a => a.industry).filter(Boolean))].sort();
    industries.forEach(ind => {
      const opt = document.createElement('option');
      opt.value = ind;
      opt.textContent = ind;
      selectIndustry.appendChild(opt);
    });
  }

  if (selectDegree) {
    const degrees = [...new Set(allAlumni.map(a => a.degree).filter(Boolean))].sort();
    degrees.forEach(d => {
      const opt = document.createElement('option');
      opt.value = d;
      opt.textContent = d;
      selectDegree.appendChild(opt);
    });
  }
}

/**
 * Wire filter listeners
 */
function bindFilterEvents() {
  const searchInput = document.getElementById('search-name');
  const selectBatch = document.getElementById('filter-batch');
  const selectCompany = document.getElementById('filter-company');
  const selectIndustry = document.getElementById('filter-industry');
  const selectDegree = document.getElementById('filter-degree');
  const clearBtn = document.getElementById('clear-filters-btn');

  searchInput?.addEventListener('input', (e) => {
    filterState.searchQuery = e.target.value.trim().toLowerCase();
    applyFilters();
  });

  selectBatch?.addEventListener('change', (e) => {
    filterState.batch = e.target.value;
    applyFilters();
  });

  selectCompany?.addEventListener('change', (e) => {
    filterState.company = e.target.value;
    applyFilters();
  });

  selectIndustry?.addEventListener('change', (e) => {
    filterState.industry = e.target.value;
    applyFilters();
  });

  selectDegree?.addEventListener('change', (e) => {
    filterState.degree = e.target.value;
    applyFilters();
  });

  clearBtn?.addEventListener('click', resetAllFilters);
}

/**
 * Reset all filter controls
 */
function resetAllFilters() {
  filterState.searchQuery = '';
  filterState.batch = 'ALL';
  filterState.company = 'ALL';
  filterState.industry = 'ALL';
  filterState.degree = 'ALL';

  const searchInput = document.getElementById('search-name');
  const selectBatch = document.getElementById('filter-batch');
  const selectCompany = document.getElementById('filter-company');
  const selectIndustry = document.getElementById('filter-industry');
  const selectDegree = document.getElementById('filter-degree');

  if (searchInput) searchInput.value = '';
  if (selectBatch) selectBatch.value = 'ALL';
  if (selectCompany) selectCompany.value = 'ALL';
  if (selectIndustry) selectIndustry.value = 'ALL';
  if (selectDegree) selectDegree.value = 'ALL';

  // Clear URL query string
  window.history.replaceState({}, document.title, window.location.pathname);

  applyFilters();
}

/**
 * Multi-criteria filter engine (Strict AND logic)
 */
function applyFilters() {
  filteredAlumni = allAlumni.filter(alum => {
    // Search query matches name, company, title, degree, city, country, or bio
    if (filterState.searchQuery) {
      const q = filterState.searchQuery;
      const haystack = [
        alum.name,
        alum.company,
        alum.jobTitle,
        alum.degree,
        alum.city,
        alum.country,
        alum.bio
      ].filter(Boolean).join(' ').toLowerCase();

      if (!haystack.includes(q)) return false;
    }

    // Batch filter
    if (filterState.batch !== 'ALL') {
      if (String(alum.gradYear) !== String(filterState.batch)) return false;
    }

    // Company filter
    if (filterState.company !== 'ALL') {
      if (alum.company !== filterState.company) return false;
    }

    // Industry filter
    if (filterState.industry !== 'ALL') {
      if (alum.industry !== filterState.industry) return false;
    }

    // Degree filter
    if (filterState.degree !== 'ALL') {
      if (alum.degree !== filterState.degree) return false;
    }

    return true;
  });

  renderAlumniGrid();
  renderResultsCounter();
}

/**
 * Render alumni cards
 */
function renderAlumniGrid() {
  const container = document.getElementById('directory-grid');
  if (!container) return;

  if (filteredAlumni.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div class="empty-icon">🔍</div>
        <h3 class="empty-title">No Alumni Found</h3>
        <p class="empty-text">No alumni currently match your selected filters. Try broadening your criteria or search query.</p>
        <button id="empty-clear-btn" class="btn btn-outline btn-sm">Clear All Filters</button>
      </div>
    `;
    document.getElementById('empty-clear-btn')?.addEventListener('click', resetAllFilters);
    return;
  }

  container.innerHTML = filteredAlumni.map(alum => `
    <div class="alumni-card" data-uid="${alum.uid}">
      <div class="alumni-card-cover">
        ${alum.verified ? `<span class="alumni-badge-verified">✓ Verified Alum</span>` : ''}
        <div class="alumni-avatar-wrap">
          <img 
            src="${alum.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}" 
            alt="${escapeHTML(alum.name)}" 
            class="alumni-avatar"
            loading="lazy" 
          />
        </div>
      </div>
      <div class="alumni-card-body">
        <h3 class="alumni-name">${escapeHTML(alum.name)}</h3>
        <div class="alumni-role">
          ${escapeHTML(alum.jobTitle || 'Alum')} ${alum.company ? `at <strong>${escapeHTML(alum.company)}</strong>` : ''}
        </div>
        <div class="alumni-meta-list">
          <div class="alumni-meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>
            <span>Class of ${alum.gradYear} · ${escapeHTML(alum.degree || '')}</span>
          </div>
          ${alum.city ? `
          <div class="alumni-meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            <span>${escapeHTML(alum.city)}${alum.country ? `, ${escapeHTML(alum.country)}` : ''}</span>
          </div>
          ` : ''}
        </div>
      </div>
    </div>
  `).join('');

  // Attach card click handlers for modal
  container.querySelectorAll('.alumni-card').forEach(card => {
    card.addEventListener('click', () => {
      const uid = card.getAttribute('data-uid');
      openAlumniModal(uid);
    });
  });
}

/**
 * Results Counter Bar
 */
function renderResultsCounter() {
  const counterEl = document.getElementById('results-count');
  if (!counterEl) return;

  counterEl.innerHTML = `Showing <span class="highlight">${filteredAlumni.length}</span> of <span class="highlight">${allAlumni.length}</span> alumni`;

  const clearBtn = document.getElementById('clear-filters-btn');
  const hasActiveFilters = (
    filterState.searchQuery ||
    filterState.batch !== 'ALL' ||
    filterState.company !== 'ALL' ||
    filterState.industry !== 'ALL' ||
    filterState.degree !== 'ALL'
  );

  if (clearBtn) {
    clearBtn.style.display = hasActiveFilters ? 'inline' : 'none';
  }
}

/**
 * Alumni Detail Modal
 */
function initDetailModal() {
  const modal = document.getElementById('alumni-detail-modal');
  const closeBtn = document.getElementById('close-alumni-modal');

  closeBtn?.addEventListener('click', () => {
    modal.classList.remove('open');
  });

  modal?.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('open');
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal?.classList.contains('open')) {
      modal.classList.remove('open');
    }
  });
}

function openAlumniModal(uid) {
  const alum = allAlumni.find(a => a.uid === uid);
  if (!alum) return;

  const modal = document.getElementById('alumni-detail-modal');
  const modalBody = document.getElementById('alumni-modal-content-body');
  if (!modal || !modalBody) return;

  modalBody.innerHTML = `
    <div class="alumni-modal-header">
      <img src="${alum.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}" alt="${escapeHTML(alum.name)}" class="alumni-modal-avatar" />
    </div>
    <div class="alumni-modal-body">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;">
        <div>
          <h2 class="alumni-modal-name">${escapeHTML(alum.name)}</h2>
          <div class="alumni-modal-headline">${escapeHTML(alum.jobTitle || 'Alum')} at ${escapeHTML(alum.company || 'Independent')}</div>
        </div>
        ${alum.verified ? `<span class="badge badge-accent">Verified</span>` : ''}
      </div>

      <p class="alumni-modal-bio">
        ${escapeHTML(alum.bio || 'Proud member of the university alumni network.')}
      </p>

      <div class="alumni-modal-grid">
        <div>
          <div class="alumni-info-label">Graduation Batch</div>
          <div class="alumni-info-val">Class of ${alum.gradYear}</div>
        </div>
        <div>
          <div class="alumni-info-label">Degree / Program</div>
          <div class="alumni-info-val">${escapeHTML(alum.degree || 'Bachelor of Science')}</div>
        </div>
        <div>
          <div class="alumni-info-label">Industry</div>
          <div class="alumni-info-val">${escapeHTML(alum.industry || 'General')}</div>
        </div>
        <div>
          <div class="alumni-info-label">Location</div>
          <div class="alumni-info-val">${escapeHTML(alum.city || 'Global')}${alum.country ? `, ${escapeHTML(alum.country)}` : ''}</div>
        </div>
      </div>

      ${alum.linkedin ? `
      <div style="margin-top: var(--space-6); text-align: right;">
        <a href="${escapeHTML(alum.linkedin)}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
          Connect on LinkedIn &nearr;
        </a>
      </div>
      ` : ''}
    </div>
  `;

  modal.classList.add('open');
}

function escapeHTML(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
