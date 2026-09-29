/**
 * ==========================================================================
 * GIET UNIVERSITY ALUMNI NETWORK — ALUMNI DIRECTORY ENGINE
 * File: js/pages/directory.js
 * 
 * Features:
 * - Multi-mode View Engine: Editorial Portrait Cards vs Dense Executive Table
 * - Deep multi-field search (Name, Title, Company, Degree, City, Industry, Bio)
 * - Dynamic Active Filter Tags with individual dismissal chips
 * - Fast debounced query input with instant clear button
 * - Presets Discovery Chips (Notable Fellows, AI, Biotech, Energy, VC, Hubs)
 * - Executive Alumni Dossier Quick-View Modal with LinkedIn integration
 * - URL state hydration (?search=, ?company=, ?industry=, ?batch=)
 * ==========================================================================
 */

import { getAlumni } from '../storage-service.js';

let allAlumni = [];
let filteredAlumni = [];
let currentViewMode = 'grid'; // 'grid' | 'table'
let searchDebounceTimer = null;
let currentPage = 1;
const itemsPerPage = 6;

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
    bindViewModeSwitcher();
    bindPaginationEvents();
    initDetailModal();
    applyFilters();
  } catch (err) {
    console.error('Error loading alumni directory:', err);
    const countSpan = document.getElementById('results-count');
    if (countSpan) countSpan.textContent = 'Failed to load alumni records. Please refresh.';
  }
});

/**
 * Check and hydrate URL search parameters
 */
function checkURLParams() {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('search')) {
    filterState.search = urlParams.get('search').toLowerCase().trim();
    const searchInput = document.getElementById('search-name');
    if (searchInput) searchInput.value = urlParams.get('search');
    toggleClearSearchBtn(Boolean(filterState.search));
  }
  if (urlParams.has('company')) {
    filterState.company = urlParams.get('company');
  }
  if (urlParams.has('industry')) {
    filterState.industry = urlParams.get('industry');
  }
  if (urlParams.has('batch')) {
    filterState.batch = urlParams.get('batch');
  }
}

/**
 * Populate dynamic dropdown filter selects from data
 */
function populateFilterDropdowns() {
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

/**
 * Bind Search input, Clear buttons, and Filter dropdowns
 */
function bindFilterEvents() {
  const searchInput = document.getElementById('search-name');
  const clearSearchBtn = document.getElementById('clear-search-btn');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const val = e.target.value.trim();
      toggleClearSearchBtn(Boolean(val));

      clearTimeout(searchDebounceTimer);
      searchDebounceTimer = setTimeout(() => {
        filterState.search = val.toLowerCase();
        currentPage = 1;
        applyFilters();
      }, 150);
    });
  }

  if (clearSearchBtn && searchInput) {
    clearSearchBtn.addEventListener('click', () => {
      searchInput.value = '';
      filterState.search = '';
      toggleClearSearchBtn(false);
      searchInput.focus();
      currentPage = 1;
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
        currentPage = 1;
        applyFilters();
      });
    }
  });

  const clearBtn = document.getElementById('clear-filters-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', resetAllFilters);
  }
}

function toggleClearSearchBtn(visible) {
  const btn = document.getElementById('clear-search-btn');
  if (btn) btn.style.display = visible ? 'flex' : 'none';
}

function resetAllFilters() {
  const searchInput = document.getElementById('search-name');
  if (searchInput) searchInput.value = '';
  toggleClearSearchBtn(false);

  const selects = ['filter-batch', 'filter-company', 'filter-industry', 'filter-degree'];
  selects.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });

  filterState = { search: '', batch: '', company: '', industry: '', degree: '' };
  currentPage = 1;
  applyFilters();
}

/**
 * Bind View Mode switcher (Cards vs Dense Table)
 */
function bindViewModeSwitcher() {
  const gridBtn = document.getElementById('view-mode-grid');
  const tableBtn = document.getElementById('view-mode-table');
  const gridContainer = document.getElementById('directory-grid');
  const tableContainer = document.getElementById('directory-table-container');

  if (gridBtn && tableBtn) {
    gridBtn.addEventListener('click', () => {
      currentViewMode = 'grid';
      gridBtn.classList.add('active');
      tableBtn.classList.remove('active');
      gridContainer.style.display = 'grid';
      tableContainer.style.display = 'none';
      applyFilters();
    });

    tableBtn.addEventListener('click', () => {
      currentViewMode = 'table';
      tableBtn.classList.add('active');
      gridBtn.classList.remove('active');
      gridContainer.style.display = 'none';
      tableContainer.style.display = 'block';
      applyFilters();
    });
  }
}

/**
 * Filter data across all criteria and apply pagination
 */
function applyFilters() {
  filteredAlumni = allAlumni.filter(a => {
    // 1. Multi-field search match
    const matchesSearch = !filterState.search ||
      (a.name && a.name.toLowerCase().includes(filterState.search)) ||
      (a.jobTitle && a.jobTitle.toLowerCase().includes(filterState.search)) ||
      (a.company && a.company.toLowerCase().includes(filterState.search)) ||
      (a.degree && a.degree.toLowerCase().includes(filterState.search)) ||
      (a.city && a.city.toLowerCase().includes(filterState.search)) ||
      (a.country && a.country.toLowerCase().includes(filterState.search)) ||
      (a.bio && a.bio.toLowerCase().includes(filterState.search)) ||
      (a.industry && a.industry.toLowerCase().includes(filterState.search));

    // 2. Select dropdown matches
    const matchesBatch = !filterState.batch || String(a.gradYear) === filterState.batch;
    const matchesCompany = !filterState.company || a.company === filterState.company;
    const matchesIndustry = !filterState.industry || a.industry === filterState.industry;
    const matchesDegree = !filterState.degree || a.degree === filterState.degree;

    return matchesSearch && matchesBatch && matchesCompany && matchesIndustry && matchesDegree;
  });

  const totalPages = Math.ceil(filteredAlumni.length / itemsPerPage) || 1;
  if (currentPage > totalPages) {
    currentPage = 1;
  }

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const pageAlumni = filteredAlumni.slice(startIndex, endIndex);

  if (currentViewMode === 'grid') {
    renderAlumniGrid(pageAlumni);
  } else {
    renderAlumniTable(pageAlumni);
  }

  renderResultsCounter(startIndex, endIndex);
  renderActiveFilterTags();
  renderPagination(totalPages);
}

/**
 * Results Counter & Reset Button State
 */
function renderResultsCounter(startIndex = 0, endIndex = 0) {
  const countSpan = document.getElementById('results-count');
  if (countSpan) {
    if (filteredAlumni.length === 0) {
      countSpan.textContent = 'No alumni match your criteria';
    } else {
      const from = startIndex + 1;
      const to = Math.min(endIndex, filteredAlumni.length);
      countSpan.textContent = `Showing ${from}–${to} of ${filteredAlumni.length} alumni`;
    }
  }

  const hasActiveFilters = Object.values(filterState).some(val => val !== '');
  const clearBtn = document.getElementById('clear-filters-btn');
  if (clearBtn) {
    clearBtn.style.display = hasActiveFilters ? 'inline-flex' : 'none';
  }
}

/**
 * Render dynamic dismissible filter pills in summary bar
 */
function renderActiveFilterTags() {
  const container = document.getElementById('active-filter-tags');
  if (!container) return;

  container.innerHTML = '';

  const tags = [];

  if (filterState.search) {
    tags.push({ key: 'search', label: 'Query', value: `"${filterState.search}"` });
  }
  if (filterState.batch) {
    tags.push({ key: 'batch', label: 'Batch', value: `Class of '${String(filterState.batch).slice(-2)}` });
  }
  if (filterState.company) {
    tags.push({ key: 'company', label: 'Company', value: filterState.company });
  }
  if (filterState.industry) {
    tags.push({ key: 'industry', label: 'Domain', value: filterState.industry.split('&')[0].trim() });
  }
  if (filterState.degree) {
    tags.push({ key: 'degree', label: 'Program', value: filterState.degree });
  }
  if (filterState.preset) {
    const presetLabels = {
      notable: 'Verified Fellows',
      ai: 'AI & DeepTech',
      biotech: 'Biotech & Health',
      climate: 'Clean Energy',
      finance: 'Venture Capital',
      bayarea: 'San Francisco Hub',
      london: 'London Hub',
      batch2018: "Class of '18"
    };
    tags.push({ key: 'preset', label: 'Filter', value: presetLabels[filterState.preset] || filterState.preset });
  }

  tags.forEach(tag => {
    const chip = document.createElement('span');
    chip.className = 'active-filter-tag';
    chip.innerHTML = `
      <span class="tag-label">${escapeHTML(tag.label)}:</span>
      <span>${escapeHTML(tag.value)}</span>
      <button type="button" class="tag-remove-btn" aria-label="Remove filter ${escapeHTML(tag.label)}">&times;</button>
    `;

    chip.querySelector('.tag-remove-btn').addEventListener('click', () => {
      if (tag.key === 'search') {
        filterState.search = '';
        const searchInput = document.getElementById('search-name');
        if (searchInput) searchInput.value = '';
        toggleClearSearchBtn(false);
      } else {
        filterState[tag.key] = '';
        const sel = document.getElementById(`filter-${tag.key}`);
        if (sel) sel.value = '';
      }
      currentPage = 1;
      applyFilters();
    });

    container.appendChild(chip);
  });
}

/**
 * Render Editorial Alumni Card Grid (Compact Framing)
 */
function renderAlumniGrid(alumniList = null) {
  const grid = document.getElementById('directory-grid');
  if (!grid) return;

  grid.innerHTML = '';

  const listToRender = alumniList !== null ? alumniList : filteredAlumni;

  if (filteredAlumni.length === 0) {
    grid.innerHTML = `
      <div class="directory-empty-state">
        <div class="empty-state-crest">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
        <h3 class="directory-empty-title">No Alumni Records Match Your Criteria</h3>
        <p class="directory-empty-desc">
          We couldn't find any profiles matching your current search or filter combinations. Try clearing some filters.
        </p>
        <button type="button" class="btn btn-outline btn-sm" id="empty-reset-btn">
          Reset All Filters &rarr;
        </button>
      </div>
    `;
    const emptyResetBtn = document.getElementById('empty-reset-btn');
    if (emptyResetBtn) emptyResetBtn.addEventListener('click', resetAllFilters);
    return;
  }

  listToRender.forEach(alumnus => {
    const card = document.createElement('article');
    card.className = 'alumni-card';
    card.setAttribute('data-uid', alumnus.uid);

    const roleText = alumnus.jobTitle && alumnus.company 
      ? `${alumnus.jobTitle} at ${alumnus.company}` 
      : (alumnus.jobTitle || alumnus.company || 'Alumni Member');

    const disciplineTag = alumnus.industry 
      ? escapeHTML(alumnus.industry.split('&')[0].trim())
      : 'Graduate';

    const locationText = [alumnus.city, alumnus.country].filter(Boolean).join(', ') || 'Global';

    card.innerHTML = `
      <div class="alumni-card-photo-wrapper">
        <img src="${escapeHTML(alumnus.photoURL)}" alt="${escapeHTML(alumnus.name)}" class="alumni-card-photo" loading="lazy" />
      </div>
      <div class="alumni-card-body">
        <h3 class="alumni-name">${escapeHTML(alumnus.name)}</h3>
        <div class="alumni-role">${escapeHTML(roleText)}</div>
        <div class="alumni-card-meta-row">
          <span class="alumni-meta-item">${disciplineTag}</span>
          ${alumnus.gradYear ? `<span class="alumni-meta-divider">&bull;</span><span class="alumni-meta-item">Class of ${escapeHTML(String(alumnus.gradYear))}</span>` : ''}
          <span class="alumni-meta-divider">&bull;</span>
          <span class="alumni-location-tag">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            ${escapeHTML(locationText)}
          </span>
        </div>
        <div class="alumni-card-footer-cue">
          <span>View Dossier</span>
          <span>&rarr;</span>
        </div>
      </div>
    `;

    card.addEventListener('click', () => openAlumniModal(alumnus.uid));
    grid.appendChild(card);
  });
}

/**
 * Render Dense Executive Directory Table
 */
function renderAlumniTable(alumniList = null) {
  const tbody = document.getElementById('directory-table-body');
  if (!tbody) return;

  tbody.innerHTML = '';

  const listToRender = alumniList !== null ? alumniList : filteredAlumni;

  if (filteredAlumni.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; padding: var(--space-12) var(--space-4);">
          <div style="font-weight: var(--font-bold); color: var(--color-primary); margin-bottom: var(--space-2);">No matching alumni records found</div>
          <button type="button" class="btn btn-outline btn-sm" onclick="document.getElementById('clear-filters-btn').click();">Reset Filters</button>
        </td>
      </tr>
    `;
    return;
  }

  listToRender.forEach(a => {
    const tr = document.createElement('tr');
    tr.style.cursor = 'pointer';

    tr.innerHTML = `
      <td>
        <div class="dense-graduate-cell">
          <div class="dense-avatar-wrap">
            <img src="${escapeHTML(a.photoURL)}" alt="${escapeHTML(a.name)}" class="dense-avatar" loading="lazy" />
          </div>
          <div>
            <div class="dense-name">${escapeHTML(a.name)}</div>
          </div>
        </div>
      </td>
      <td>
        <div style="font-weight: 600; color: var(--color-primary);">${escapeHTML(a.jobTitle || 'Alumni Member')}</div>
        <div style="font-size: var(--text-xs); color: var(--color-text-muted);">${escapeHTML(a.company || '')}</div>
      </td>
      <td>${escapeHTML(a.degree || 'Degree Record')}</td>
      <td>Class of '${String(a.gradYear).slice(-2)}</td>
      <td>${escapeHTML([a.city, a.country].filter(Boolean).join(', ') || 'Global')}</td>
      <td>${escapeHTML(a.industry ? a.industry.split('&')[0].trim() : 'General')}</td>
      <td>
        <a href="profile.html?id=${a.uid}" class="btn btn-outline btn-sm" onclick="event.stopPropagation();">
          Dossier &rarr;
        </a>
      </td>
    `;

    tr.addEventListener('click', () => openAlumniModal(a.uid));
    tbody.appendChild(tr);
  });
}

/**
 * Render dynamic pagination controls
 */
function renderPagination(totalPages) {
  const paginationNav = document.getElementById('directory-pagination');
  const numbersContainer = document.getElementById('pagination-numbers');
  const prevBtn = document.getElementById('pagination-prev');
  const nextBtn = document.getElementById('pagination-next');

  if (!paginationNav || !numbersContainer || !prevBtn || !nextBtn) return;

  if (totalPages <= 1) {
    paginationNav.style.display = 'none';
    return;
  }

  paginationNav.style.display = 'flex';
  numbersContainer.innerHTML = '';

  prevBtn.disabled = (currentPage === 1);
  nextBtn.disabled = (currentPage === totalPages);

  for (let i = 1; i <= totalPages; i++) {
    if (totalPages > 7) {
      if (i !== 1 && i !== totalPages && Math.abs(i - currentPage) > 1) {
        if (i === 2 && currentPage > 3) {
          const dots = document.createElement('span');
          dots.className = 'pagination-ellipsis';
          dots.textContent = '…';
          numbersContainer.appendChild(dots);
        } else if (i === totalPages - 1 && currentPage < totalPages - 2) {
          const dots = document.createElement('span');
          dots.className = 'pagination-ellipsis';
          dots.textContent = '…';
          numbersContainer.appendChild(dots);
        }
        continue;
      }
    }

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `pagination-number-btn ${i === currentPage ? 'active' : ''}`;
    btn.textContent = String(i);
    btn.setAttribute('aria-label', `Page ${i}`);
    if (i === currentPage) {
      btn.setAttribute('aria-current', 'page');
    }
    btn.addEventListener('click', () => goToPage(i));
    numbersContainer.appendChild(btn);
  }
}

function goToPage(page) {
  currentPage = page;
  applyFilters();
  const mainEl = document.getElementById('directory-main');
  if (mainEl) {
    const headerOffset = 90;
    const topPos = mainEl.getBoundingClientRect().top + window.pageYOffset - headerOffset;
    window.scrollTo({ top: Math.max(0, topPos), behavior: 'smooth' });
  }
}

function bindPaginationEvents() {
  const prevBtn = document.getElementById('pagination-prev');
  const nextBtn = document.getElementById('pagination-next');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentPage > 1) {
        goToPage(currentPage - 1);
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const totalPages = Math.ceil(filteredAlumni.length / itemsPerPage);
      if (currentPage < totalPages) {
        goToPage(currentPage + 1);
      }
    });
  }
}

/**
 * Open Alumni Quick Detail Dossier Modal
 */
window.openAlumniModal = function(uid) {
  const alumnus = allAlumni.find(a => a.uid === uid);
  if (!alumnus) return;

  const body = document.getElementById('alumni-modal-content-body');
  if (!body) return;

  const roleText = alumnus.jobTitle && alumnus.company 
    ? `${alumnus.jobTitle} at <strong>${alumnus.company}</strong>` 
    : (alumnus.jobTitle || alumnus.company || 'Alumni Member');

  const loc = [alumnus.city, alumnus.country].filter(Boolean).join(', ') || 'Global';

  body.innerHTML = `
    <div class="dossier-hero-banner">
      <img src="${escapeHTML(alumnus.photoURL)}" alt="${escapeHTML(alumnus.name)}" class="dossier-hero-photo" />
    </div>

    <div class="dossier-body">
      <h2 class="dossier-name">${escapeHTML(alumnus.name)}</h2>
      <div class="dossier-role-title">${roleText}</div>
      
      ${alumnus.bio ? `
        <div class="dossier-bio-quote">
          &ldquo;${escapeHTML(alumnus.bio)}&rdquo;
        </div>
      ` : ''}

      <div class="dossier-credentials-grid">
        <div class="dossier-cred-cell">
          <span class="dossier-cred-label">Degree &amp; Program</span>
          <span class="dossier-cred-val">${escapeHTML(alumnus.degree || 'Not specified')}</span>
        </div>
        <div class="dossier-cred-cell">
          <span class="dossier-cred-label">Academic Batch</span>
          <span class="dossier-cred-val">Class of ${escapeHTML(String(alumnus.gradYear))}</span>
        </div>
        <div class="dossier-cred-cell">
          <span class="dossier-cred-label">Current Base</span>
          <span class="dossier-cred-val">${escapeHTML(loc)}</span>
        </div>
        <div class="dossier-cred-cell">
          <span class="dossier-cred-label">Industry Domain</span>
          <span class="dossier-cred-val">${escapeHTML(alumnus.industry || 'Not specified')}</span>
        </div>
      </div>

      <div class="dossier-actions-strip">
        <a href="profile.html?id=${alumnus.uid}" class="btn btn-primary btn-sm">
          Open Full Editorial Profile &rarr;
        </a>
        ${alumnus.linkedin ? `
          <a href="${escapeHTML(alumnus.linkedin)}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm dossier-linkedin-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
            </svg>
            LinkedIn Dossier
          </a>
        ` : ''}
      </div>
    </div>
  `;

  const modal = document.getElementById('alumni-detail-modal');
  if (modal) {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
};

/**
 * Initialize Modal dismiss bindings (close button, backdrop, Escape key)
 */
function initDetailModal() {
  const modal = document.getElementById('alumni-detail-modal');
  const closeBtn = document.getElementById('close-alumni-modal');
  const topCloseBtn = document.getElementById('modal-close-top-btn');

  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (topCloseBtn) topCloseBtn.addEventListener('click', closeModal);

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
