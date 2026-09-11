/**
 * ==========================================================================
 * PAGE LOGIC: ALUMNI DIRECTORY (directory.html)
 * Discovery Engine: Multi-mode views (Cards / Table), preset exploration chips,
 * debounced multi-field search, URL state, modal quick-view
 * ==========================================================================
 */

import { getAlumni } from '../storage-service.js';

let allAlumni = [];
let filteredAlumni = [];
let currentViewMode = 'grid'; // 'grid' | 'table'

let filterState = {
  search: '',
  batch: '',
  company: '',
  industry: '',
  degree: '',
  preset: ''
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
    bindDiscoveryChips();
    bindViewModeSwitcher();
    initDetailModal();
    applyFilters();
  } catch (err) {
    console.error('Error loading alumni directory:', err);
  }
});

function checkURLParams() {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('search')) {
    filterState.search = urlParams.get('search').toLowerCase().trim();
    const searchInput = document.getElementById('search-name');
    if (searchInput) searchInput.value = urlParams.get('search');
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

      document.querySelectorAll('.discovery-chip').forEach(c => c.classList.remove('active'));
      filterState = { search: '', batch: '', company: '', industry: '', degree: '', preset: '' };
      applyFilters();
    });
  }
}

function bindDiscoveryChips() {
  const chips = document.querySelectorAll('.discovery-chip');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const isAlreadyActive = chip.classList.contains('active');
      chips.forEach(c => c.classList.remove('active'));

      if (isAlreadyActive) {
        filterState.preset = '';
      } else {
        chip.classList.add('active');
        filterState.preset = chip.getAttribute('data-chip');
      }

      applyFilters();
    });
  });
}

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
      renderAlumniGrid();
    });

    tableBtn.addEventListener('click', () => {
      currentViewMode = 'table';
      tableBtn.classList.add('active');
      gridBtn.classList.remove('active');
      gridContainer.style.display = 'none';
      tableContainer.style.display = 'block';
      renderAlumniTable();
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

    // Preset chip matching
    let matchesPreset = true;
    if (filterState.preset) {
      if (filterState.preset === 'notable') matchesPreset = a.verified === true;
      else if (filterState.preset === 'ai') matchesPreset = a.industry.includes('Technology') || (a.jobTitle && a.jobTitle.includes('AI'));
      else if (filterState.preset === 'biotech') matchesPreset = a.industry.includes('Biotechnology');
      else if (filterState.preset === 'climate') matchesPreset = a.industry.includes('Energy');
      else if (filterState.preset === 'finance') matchesPreset = a.industry.includes('Finance') || a.industry.includes('Capital');
      else if (filterState.preset === 'bayarea') matchesPreset = (a.city && a.city.includes('San Francisco')) || (a.city && a.city.includes('Palo Alto'));
      else if (filterState.preset === 'london') matchesPreset = (a.city && a.city.includes('London'));
      else if (filterState.preset === 'batch2018') matchesPreset = a.gradYear === 2018;
    }

    return matchesSearch && matchesBatch && matchesCompany && matchesIndustry && matchesDegree && matchesPreset;
  });

  if (currentViewMode === 'grid') {
    renderAlumniGrid();
  } else {
    renderAlumniTable();
  }

  renderResultsCounter();
}

function renderResultsCounter() {
  const countSpan = document.getElementById('results-count');
  if (countSpan) {
    countSpan.textContent = `Showing ${filteredAlumni.length} of ${allAlumni.length} alumni records`;
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
        <p class="empty-text">No profiles match your active filters. Try resetting your criteria or selecting an exploratory chip.</p>
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
      <div class="alumni-badge-verified" title="Verified Alumni Fellow">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>
    ` : '';

    const roleText = alumnus.jobTitle && alumnus.company 
      ? `${alumnus.jobTitle} at <strong>${alumnus.company}</strong>` 
      : (alumnus.jobTitle || alumnus.company || 'Alumni Member');

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
        <div class="alumni-role">${roleText}</div>
        <div class="alumni-meta-list">
          ${metaItems.join('')}
        </div>
      </div>
    `;

    card.addEventListener('click', () => openAlumniModal(alumnus.uid));
    grid.appendChild(card);
  });
}

function renderAlumniTable() {
  const tbody = document.getElementById('directory-table-body');
  if (!tbody) return;

  tbody.innerHTML = '';

  if (filteredAlumni.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; padding: var(--space-8);">
          No matching alumni records found.
        </td>
      </tr>
    `;
    return;
  }

  filteredAlumni.forEach(a => {
    const tr = document.createElement('tr');
    tr.style.cursor = 'pointer';
    tr.innerHTML = `
      <td>
        <div class="dense-graduate-cell">
          <img src="${a.photoURL}" alt="${escapeHTML(a.name)}" class="dense-avatar" />
          <div>
            <div class="dense-name">${escapeHTML(a.name)}</div>
            <div style="font-size: 0.6875rem; color: var(--color-text-muted);">${a.verified ? 'Verified Fellow' : 'Alumnus'}</div>
          </div>
        </div>
      </td>
      <td>
        <div style="font-weight: var(--font-medium); color: var(--color-primary);">${escapeHTML(a.jobTitle || 'Alumnus')}</div>
        <div style="font-size: var(--text-xs); color: var(--color-text-muted);">${escapeHTML(a.company || '')}</div>
      </td>
      <td>${escapeHTML(a.degree || 'Degree Record')}</td>
      <td>Class of '${String(a.gradYear).slice(-2)}</td>
      <td>${escapeHTML([a.city, a.country].filter(Boolean).join(', '))}</td>
      <td><span class="badge badge-subtle">${escapeHTML(a.industry.split('&')[0].trim())}</span></td>
      <td>
        <a href="profile.html?id=${a.uid}" class="btn btn-outline btn-sm" onclick="event.stopPropagation();">
          Profile &rarr;
        </a>
      </td>
    `;

    tr.addEventListener('click', () => openAlumniModal(a.uid));
    tbody.appendChild(tr);
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
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom: var(--space-2);">
        <h2 class="alumni-modal-name">${escapeHTML(alumnus.name)}</h2>
        <span class="badge badge-accent">${alumnus.verified ? 'Verified Fellow' : 'Alumni'}</span>
      </div>
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

      <div style="margin-top: var(--space-6); padding-top: var(--space-4); border-top: 1px solid var(--color-border-subtle); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:var(--space-3);">
        <a href="profile.html?id=${alumnus.uid}" class="btn btn-primary btn-sm">
          Open Full Editorial Profile &rarr;
        </a>
        ${alumnus.linkedin ? `
          <a href="${escapeHTML(alumnus.linkedin)}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm">
            LinkedIn Profile
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
