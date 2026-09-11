/**
 * ==========================================================================
 * PAGE LOGIC: ALUMNI DIRECTORY (directory.html)
 * Real-time multi-filter engine, search, portrait cards, detail modal
 * ==========================================================================
 */

import { getAlumni } from '../storage-service.js';

let allAlumni = [];
let filteredAlumni = [];
let filterState = {
  search: '',
  batch: '',
  company: '',
  industry: '',
  degree: ''
};

function escapeHTML(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = String(str);
  return div.innerHTML;
}

document.addEventListener('DOMContentLoaded', async () => {
  try {
    allAlumni = await getAlumni();
    filteredAlumni = [...allAlumni];

    checkURLParams();
    populateFilterDropdowns();
    bindFilterEvents();
    initDetailModal();
    applyFilters();
  } catch (err) {
    console.error('Error loading alumni directory:', err);
  }
});

function checkURLParams() {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('search')) {
    filterState.search = urlParams.get('search').toLowerCase();
    const searchInput = document.getElementById('search-name');
    if (searchInput) searchInput.value = urlParams.get('search');
  }
  if (urlParams.has('company')) {
    filterState.company = urlParams.get('company');
  }
}

function populateFilterDropdowns() {
  // Extract unique batches (years)
  const batches = [...new Set(allAlumni.map(a => a.gradYear).filter(Boolean))].sort((a, b) => b - a);
  const companies = [...new Set(allAlumni.map(a => a.company).filter(Boolean))].sort();
  const industries = [...new Set(allAlumni.map(a => a.industry).filter(Boolean))].sort();
  const degrees = [...new Set(allAlumni.map(a => a.degree).filter(Boolean))].sort();

  const batchSelect = document.getElementById('filter-batch');
  if (batchSelect) {
    batches.forEach(b => {
      const opt = document.createElement('option');
      opt.value = String(b);
      opt.textContent = `Class of ${b}`;
      batchSelect.appendChild(opt);
    });
    if (filterState.batch) batchSelect.value = filterState.batch;
  }

  const companySelect = document.getElementById('filter-company');
  if (companySelect) {
    companies.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c;
      opt.textContent = c;
      companySelect.appendChild(opt);
    });
    if (filterState.company) companySelect.value = filterState.company;
  }

  const industrySelect = document.getElementById('filter-industry');
  if (industrySelect) {
    industries.forEach(i => {
      const opt = document.createElement('option');
      opt.value = i;
      opt.textContent = i;
      industrySelect.appendChild(opt);
    });
    if (filterState.industry) industrySelect.value = filterState.industry;
  }

  const degreeSelect = document.getElementById('filter-degree');
  if (degreeSelect) {
    degrees.forEach(d => {
      const opt = document.createElement('option');
      opt.value = d;
      opt.textContent = d;
      degreeSelect.appendChild(opt);
    });
    if (filterState.degree) degreeSelect.value = filterState.degree;
  }
}

function bindFilterEvents() {
  const searchInput = document.getElementById('search-name');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      filterState.search = e.target.value.toLowerCase().trim();
      applyFilters();
    });
  }

  const selects = [
    { id: 'filter-batch', key: 'batch' },
    { id: 'filter-company', key: 'company' },
    { id: 'filter-industry', key: 'industry' },
    { id: 'filter-degree', key: 'degree' }
  ];

  selects.forEach(({ id, key }) => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('change', (e) => {
        filterState[key] = e.target.value;
        applyFilters();
      });
    }
  });

  const clearBtn = document.getElementById('clear-filters-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      selects.forEach(({ id }) => {
        const el = document.getElementById(id);
        if (el) el.value = '';
      });

      filterState = { search: '', batch: '', company: '', industry: '', degree: '' };
      applyFilters();
    });
  }
}

function applyFilters() {
  filteredAlumni = allAlumni.filter(a => {
    // Search keyword
    const matchesSearch = !filterState.search ||
      (a.name && a.name.toLowerCase().includes(filterState.search)) ||
      (a.jobTitle && a.jobTitle.toLowerCase().includes(filterState.search)) ||
      (a.company && a.company.toLowerCase().includes(filterState.search)) ||
      (a.degree && a.degree.toLowerCase().includes(filterState.search)) ||
      (a.city && a.city.toLowerCase().includes(filterState.search)) ||
      (a.country && a.country.toLowerCase().includes(filterState.search)) ||
      (a.bio && a.bio.toLowerCase().includes(filterState.search)) ||
      (a.industry && a.industry.toLowerCase().includes(filterState.search));

    const matchesBatch = !filterState.batch || String(a.gradYear) === filterState.batch;
    const matchesCompany = !filterState.company || a.company === filterState.company;
    const matchesIndustry = !filterState.industry || a.industry === filterState.industry;
    const matchesDegree = !filterState.degree || a.degree === filterState.degree;

    return matchesSearch && matchesBatch && matchesCompany && matchesIndustry && matchesDegree;
  });

  renderAlumniGrid();
  renderResultsCounter();
}

function renderResultsCounter() {
  const countSpan = document.getElementById('results-count');
  if (countSpan) {
    countSpan.textContent = `Showing ${filteredAlumni.length} of ${allAlumni.length} alumni`;
  }

  const hasActiveFilters = Object.values(filterState).some(val => val !== '');
  const clearBtn = document.getElementById('clear-filters-btn');
  if (clearBtn) {
    clearBtn.style.display = hasActiveFilters ? 'inline-block' : 'none';
  }
}

function renderAlumniGrid() {
  const grid = document.getElementById('directory-grid');
  if (!grid) return;

  grid.innerHTML = '';

  if (filteredAlumni.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div class="empty-icon">&empty;</div>
        <h3 class="empty-title">No alumni found</h3>
        <p class="empty-text">No profiles match your active search filters. Try clearing your filters or broadening your search terms.</p>
        <button class="btn btn-outline btn-sm" onclick="document.getElementById('clear-filters-btn').click();">Reset Filters</button>
      </div>
    `;
    return;
  }

  filteredAlumni.forEach(alumnus => {
    const card = document.createElement('article');
    card.className = 'alumni-card';
    card.setAttribute('data-uid', alumnus.uid);

    const verifiedBadge = alumnus.verified ? `
      <div class="alumni-badge-verified" title="Verified Alumni">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>
    ` : '';

    const roleText = alumnus.jobTitle && alumnus.company 
      ? `${alumnus.jobTitle} at ${alumnus.company}` 
      : (alumnus.jobTitle || alumnus.company || 'Alumni');

    const metaItems = [];
    if (alumnus.gradYear) metaItems.push(`<span class="alumni-meta-item">'${String(alumnus.gradYear).slice(-2)}</span>`);
    if (alumnus.city || alumnus.country) {
      metaItems.push(`<span class="alumni-meta-item">${escapeHTML(alumnus.city || alumnus.country)}</span>`);
    }
    if (alumnus.industry) {
      metaItems.push(`<span class="alumni-meta-item">${escapeHTML(alumnus.industry.split('&')[0].trim())}</span>`);
    }

    card.innerHTML = `
      <div class="alumni-card-photo-wrapper">
        <img src="${escapeHTML(alumnus.photoURL)}" alt="${escapeHTML(alumnus.name)}" class="alumni-card-photo" loading="lazy" />
        ${verifiedBadge}
      </div>
      <div class="alumni-card-body">
        <h3 class="alumni-name">${escapeHTML(alumnus.name)}</h3>
        <div class="alumni-role">${escapeHTML(roleText)}</div>
        <div class="alumni-meta-list">
          ${metaItems.join('')}
        </div>
      </div>
    `;

    card.addEventListener('click', () => openAlumniModal(alumnus.uid));
    grid.appendChild(card);
  });
}

window.openAlumniModal = function(uid) {
  const alumnus = allAlumni.find(a => a.uid === uid);
  if (!alumnus) return;

  const body = document.getElementById('alumni-modal-content-body');
  if (!body) return;

  const roleText = alumnus.jobTitle && alumnus.company 
    ? `${alumnus.jobTitle} at ${alumnus.company}` 
    : (alumnus.jobTitle || alumnus.company || 'Alumni');

  const loc = [alumnus.city, alumnus.country].filter(Boolean).join(', ') || 'Not specified';

  body.innerHTML = `
    <div class="alumni-modal-header">
      <img src="${escapeHTML(alumnus.photoURL)}" alt="${escapeHTML(alumnus.name)}" class="alumni-modal-photo" />
    </div>
    <div class="alumni-modal-body">
      <h2 class="alumni-modal-name">${escapeHTML(alumnus.name)}</h2>
      <div class="alumni-modal-headline">${escapeHTML(roleText)}</div>
      
      ${alumnus.bio ? `<p class="alumni-modal-bio">"${escapeHTML(alumnus.bio)}"</p>` : ''}

      <div class="alumni-modal-grid">
        <div class="modal-grid-item">
          <span class="alumni-info-label">Degree &amp; Program</span>
          <span class="alumni-info-val">${escapeHTML(alumnus.degree || 'Not specified')}</span>
        </div>
        <div class="modal-grid-item">
          <span class="alumni-info-label">Graduation Class</span>
          <span class="alumni-info-val">Class of ${escapeHTML(String(alumnus.gradYear))}</span>
        </div>
        <div class="modal-grid-item">
          <span class="alumni-info-label">Location</span>
          <span class="alumni-info-val">${escapeHTML(loc)}</span>
        </div>
        <div class="modal-grid-item">
          <span class="alumni-info-label">Industry Domain</span>
          <span class="alumni-info-val">${escapeHTML(alumnus.industry || 'Not specified')}</span>
        </div>
      </div>

      ${alumnus.linkedin ? `
        <div style="margin-top: var(--space-4);">
          <a href="${escapeHTML(alumnus.linkedin)}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm">
            Connect on LinkedIn &rarr;
          </a>
        </div>
      ` : ''}
    </div>
  `;

  const modal = document.getElementById('alumni-detail-modal');
  if (modal) {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
};

function initDetailModal() {
  const modal = document.getElementById('alumni-detail-modal');
  const closeBtn = document.getElementById('close-alumni-modal');

  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('open')) {
      closeModal();
    }
  });
}
