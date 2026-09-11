/**
 * ==========================================================================
 * NAVIGATION & GLOBAL UI LOGIC
 * Sticky nav shrink, mobile drawer, dynamic auth state dropdown, toasts,
 * and Global Quick Search (⌘K Command Palette) across all pages
 * ==========================================================================
 */

import { onAuthStateChange, logout } from './auth.js';
import { subscribeNewsletter, getAlumni } from './storage-service.js';

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileDrawer();
  initActiveNavLink();
  initAuthUI();
  initNewsletter();
  initScrollReveals();
  initCommandPalette();
});

/**
 * Sticky header shrink on scroll
 */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/**
 * Mobile slide-in drawer
 */
function initMobileDrawer() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  const backdrop = document.querySelector('.mobile-drawer-backdrop');

  if (!toggleBtn || !drawer || !backdrop) return;

  const toggle = (open) => {
    const shouldOpen = typeof open === 'boolean' ? open : !drawer.classList.contains('open');
    drawer.classList.toggle('open', shouldOpen);
    backdrop.classList.toggle('open', shouldOpen);
    toggleBtn.classList.toggle('is-active', shouldOpen);
    document.body.style.overflow = shouldOpen ? 'hidden' : '';
  };

  toggleBtn.addEventListener('click', () => toggle());
  backdrop.addEventListener('click', () => toggle(false));

  // Close drawer on link click
  drawer.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => toggle(false));
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      toggle(false);
    }
  });
}

/**
 * Active Navigation Link State
 */
function initActiveNavLink() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/**
 * Render dynamic auth state in header & mobile drawer
 */
function initAuthUI() {
  const navAuthContainer = document.getElementById('nav-auth-container');
  const mobileAuthContainer = document.getElementById('mobile-auth-container');

  onAuthStateChange((user) => {
    if (user) {
      const initials = (user.name || user.email || 'A')
        .split(' ')
        .map(n => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

      if (navAuthContainer) {
        navAuthContainer.innerHTML = `
          <div class="user-dropdown">
            <button class="user-avatar-btn" id="user-menu-btn" aria-label="User account menu" aria-expanded="false">
              ${user.photoURL 
                ? `<img src="${user.photoURL}" alt="${escapeHTML(user.name)}" class="user-avatar-img" />`
                : `<div class="user-avatar-img">${initials}</div>`
              }
              <span class="user-name-short">${escapeHTML(user.name || user.email.split('@')[0])}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </button>

            <div class="dropdown-menu" id="user-dropdown-menu" role="menu">
              <div class="dropdown-header">
                <div class="dropdown-header-name">${escapeHTML(user.name || 'Alumni Member')}</div>
                <div class="dropdown-header-email">${escapeHTML(user.email)}</div>
              </div>
              <a href="profile.html" class="dropdown-item" role="menuitem">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                My Profile
              </a>
              <a href="news.html#submit" class="dropdown-item" role="menuitem">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                Submit Story
              </a>
              ${user.isAdmin ? `
                <a href="admin.html" class="dropdown-item" role="menuitem" style="color: var(--color-accent-hover); font-weight: var(--font-bold);">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                  Admin Console
                </a>
              ` : ''}
              <div class="dropdown-divider"></div>
              <button class="dropdown-item text-danger" id="logout-nav-btn" role="menuitem" style="color: var(--color-danger);">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                Sign Out
              </button>
            </div>
          </div>
        `;
      }

      if (mobileAuthContainer) {
        mobileAuthContainer.innerHTML = `
          <div style="margin-top: var(--space-8); padding-top: var(--space-6); border-top: 1px solid var(--color-border);">
            <div style="font-size: var(--text-sm); font-weight: var(--font-bold); color: var(--color-primary); margin-bottom: var(--space-2);">${escapeHTML(user.name || 'Alumni Member')}</div>
            <div style="display: flex; flex-direction: column; gap: var(--space-2);">
              <a href="profile.html" class="btn btn-outline btn-sm btn-block">My Profile</a>
              ${user.isAdmin ? `<a href="admin.html" class="btn btn-accent btn-sm btn-block">Admin Console</a>` : ''}
              <button id="mobile-logout-btn" class="btn btn-outline btn-sm btn-block" style="color: var(--color-danger); border-color: var(--color-danger);">Sign Out</button>
            </div>
          </div>
        `;
      }

      bindUserMenuEvents();

    } else {
      // Unauthenticated visitor state
      if (navAuthContainer) {
        navAuthContainer.innerHTML = `
          <a href="login.html" class="btn btn-outline btn-sm">Alumni Login</a>
        `;
      }

      if (mobileAuthContainer) {
        mobileAuthContainer.innerHTML = `
          <div style="margin-top: var(--space-8); padding-top: var(--space-6); border-top: 1px solid var(--color-border); display: flex; flex-direction: column; gap: var(--space-3);">
            <a href="login.html" class="btn btn-outline btn-block">Alumni Sign In</a>
            <a href="signup.html" class="btn btn-accent btn-block">Join Network</a>
          </div>
        `;
      }
    }
  });
}

function bindUserMenuEvents() {
  const menuBtn = document.getElementById('user-menu-btn');
  const dropdown = document.getElementById('user-dropdown-menu');
  const logoutBtn = document.getElementById('logout-nav-btn');
  const mobileLogoutBtn = document.getElementById('mobile-logout-btn');

  if (menuBtn && dropdown) {
    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isShown = dropdown.classList.contains('show');
      dropdown.classList.toggle('show', !isShown);
      menuBtn.setAttribute('aria-expanded', String(!isShown));
    });

    document.addEventListener('click', (e) => {
      if (!dropdown.contains(e.target) && !menuBtn.contains(e.target)) {
        dropdown.classList.remove('show');
        menuBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  const handleLogout = async () => {
    try {
      await logout();
      showToast('Signed out successfully', 'info');
      const protectedPages = ['profile.html', 'admin.html'];
      const currentPage = window.location.pathname.split('/').pop();
      if (protectedPages.includes(currentPage)) {
        window.location.href = 'index.html';
      }
    } catch (err) {
      showToast('Error signing out', 'danger');
    }
  };

  if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
  if (mobileLogoutBtn) mobileLogoutBtn.addEventListener('click', handleLogout);
}

/**
 * Newsletter Form in Footer
 */
function initNewsletter() {
  const form = document.querySelector('.newsletter-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = form.querySelector('.newsletter-input');
    if (!input || !input.value) return;

    try {
      await subscribeNewsletter(input.value.trim());
      input.value = '';
      showToast('Thank you for subscribing to alumni updates!', 'success');
    } catch (err) {
      showToast('Could not subscribe. Please try again.', 'danger');
    }
  });
}

/**
 * Scroll Reveal Animations via Intersection Observer
 */
function initScrollReveals() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  if (!('IntersectionObserver' in window)) {
    elements.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/**
 * ==========================================================================
 * GLOBAL ⌘K QUICK SEARCH & COMMAND PALETTE
 * Accessible from ANY page using ⌘K / Ctrl+K or clicking the search trigger
 * ==========================================================================
 */
function initCommandPalette() {
  // 1. Inject Search Trigger Button into Header if not already present
  const headerActions = document.querySelector('.header-actions');
  if (headerActions && !document.getElementById('cmd-palette-trigger')) {
    const searchBtn = document.createElement('button');
    searchBtn.id = 'cmd-palette-trigger';
    searchBtn.className = 'header-search-btn';
    searchBtn.setAttribute('aria-label', 'Open global search');
    searchBtn.innerHTML = `
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
      <span>Search</span>
      <span class="cmd-kbd">⌘K</span>
    `;
    headerActions.insertBefore(searchBtn, headerActions.firstChild);
  }

  // 2. Inject Command Palette Modal Backdrop into Body
  let paletteBackdrop = document.getElementById('cmd-palette-backdrop');
  if (!paletteBackdrop) {
    paletteBackdrop = document.createElement('div');
    paletteBackdrop.id = 'cmd-palette-backdrop';
    paletteBackdrop.className = 'cmd-palette-backdrop';
    paletteBackdrop.setAttribute('role', 'dialog');
    paletteBackdrop.setAttribute('aria-modal', 'true');
    paletteBackdrop.innerHTML = `
      <div class="cmd-palette-modal">
        <div class="cmd-palette-input-wrap">
          <svg class="cmd-palette-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input type="text" id="cmd-palette-input" class="cmd-palette-input" placeholder="Search alumni, batches, companies, stories, pages..." autocomplete="off" />
          <span class="cmd-kbd">ESC</span>
        </div>
        <div id="cmd-palette-results" class="cmd-palette-results">
          <!-- Dynamically populated results -->
        </div>
        <div class="cmd-footer">
          <span>Tip: Press <strong>ESC</strong> to dismiss, <strong>ENTER</strong> to select</span>
          <span>Apex Alumni Global Index</span>
        </div>
      </div>
    `;
    document.body.appendChild(paletteBackdrop);
  }

  // Ensure command palette trigger exists in the masthead header-actions
  

  const input = document.getElementById('cmd-palette-input');
  const resultsContainer = document.getElementById('cmd-palette-results');

  let allAlumniData = [];
  let isDataLoaded = false;

  const loadSearchData = async () => {
    if (!isDataLoaded) {
      allAlumniData = await getAlumni();
      isDataLoaded = true;
    }
  };

  const openPalette = async () => {
    paletteBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
    await loadSearchData();
    if (input) {
      input.value = '';
      input.focus();
      renderDefaultSearchResults();
    }
  };

  const closePalette = () => {
    paletteBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  };

  // Keyboard shortcut: ⌘K or Ctrl+K or /
  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (paletteBackdrop.classList.contains('open')) {
        closePalette();
      } else {
        openPalette();
      }
    } else if (e.key === 'Escape' && paletteBackdrop.classList.contains('open')) {
      closePalette();
    }
  });

  document.querySelectorAll('.cmd-palette-trigger, #cmd-palette-trigger, #cmd-search-btn').forEach(btn => {
    btn.addEventListener('click', openPalette);
  });

  paletteBackdrop.addEventListener('click', (e) => {
    if (e.target === paletteBackdrop) closePalette();
  });

  const renderDefaultSearchResults = () => {
    if (!resultsContainer) return;
    resultsContainer.innerHTML = `
      <div class="cmd-group-label">Quick Navigation</div>
      <a href="directory.html" class="cmd-item">
        <div class="cmd-item-left">
          <div class="cmd-item-avatar" style="display:flex;align-items:center;justify-content:center;background:var(--color-accent-light);color:var(--color-primary-dark);font-weight:bold;">Ω</div>
          <div>
            <div class="cmd-item-title">Alumni Directory</div>
            <div class="cmd-item-sub">Explore all 28,000+ verified graduates worldwide</div>
          </div>
        </div>
        <span class="badge badge-subtle">Directory</span>
      </a>
      <a href="news.html" class="cmd-item">
        <div class="cmd-item-left">
          <div class="cmd-item-avatar" style="display:flex;align-items:center;justify-content:center;background:var(--color-cream);color:var(--color-primary);">📰</div>
          <div>
            <div class="cmd-item-title">University Gazette &amp; Stories</div>
            <div class="cmd-item-sub">Read breakthroughs, research narratives &amp; milestones</div>
          </div>
        </div>
        <span class="badge badge-subtle">Gazette</span>
      </a>
      <div class="cmd-group-label" style="margin-top:var(--space-2);">Featured Alumni Profiles</div>
      ${allAlumniData.slice(0, 3).map(a => `
        <a href="profile.html?id=${a.uid}" class="cmd-item">
          <div class="cmd-item-left">
            <img src="${a.photoURL}" alt="${escapeHTML(a.name)}" class="cmd-item-avatar" />
            <div>
              <div class="cmd-item-title">${escapeHTML(a.name)}</div>
              <div class="cmd-item-sub">${escapeHTML(a.jobTitle)} at ${escapeHTML(a.company)} &bull; Class of '${String(a.gradYear).slice(-2)}</div>
            </div>
          </div>
          <span class="badge badge-accent">View Profile &rarr;</span>
        </a>
      `).join('')}
    `;
  };

  if (input) {
    input.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      if (!q) {
        renderDefaultSearchResults();
        return;
      }

      const matches = allAlumniData.filter(a => 
        (a.name && a.name.toLowerCase().includes(q)) ||
        (a.company && a.company.toLowerCase().includes(q)) ||
        (a.jobTitle && a.jobTitle.toLowerCase().includes(q)) ||
        (a.city && a.city.toLowerCase().includes(q)) ||
        (a.degree && a.degree.toLowerCase().includes(q)) ||
        (a.industry && a.industry.toLowerCase().includes(q))
      ).slice(0, 6);

      if (!matches.length) {
        resultsContainer.innerHTML = `
          <div style="padding: var(--space-8) var(--space-4); text-align: center; color: var(--color-text-muted);">
            <div style="font-size: var(--text-base); color: var(--color-primary); font-weight: var(--font-semibold); margin-bottom: 4px;">No alumni matching "${escapeHTML(q)}"</div>
            <p style="font-size: var(--text-xs); margin-bottom: var(--space-4);">Try searching by company (e.g. Google, SpaceX), industry, or graduation year.</p>
            <a href="directory.html?search=${encodeURIComponent(q)}" class="btn btn-outline btn-sm">Explore Directory with "${escapeHTML(q)}" &rarr;</a>
          </div>
        `;
        return;
      }

      resultsContainer.innerHTML = `
        <div class="cmd-group-label">Matching Alumni (${matches.length})</div>
        ${matches.map(a => `
          <a href="profile.html?id=${a.uid}" class="cmd-item">
            <div class="cmd-item-left">
              <img src="${a.photoURL}" alt="${escapeHTML(a.name)}" class="cmd-item-avatar" />
              <div>
                <div class="cmd-item-title">${escapeHTML(a.name)}</div>
                <div class="cmd-item-sub">${escapeHTML(a.jobTitle)} at <strong>${escapeHTML(a.company)}</strong> &bull; Class of '${String(a.gradYear).slice(-2)}</div>
              </div>
            </div>
            <span class="badge badge-accent">Profile &rarr;</span>
          </a>
        `).join('')}
        <div style="padding: var(--space-3); text-align: center; border-top: 1px solid var(--color-border-subtle);">
          <a href="directory.html?search=${encodeURIComponent(q)}" style="font-size: var(--text-xs); font-weight: var(--font-semibold); color: var(--color-primary-light);">
            See all search results in Directory &rarr;
          </a>
        </div>
      `;
    });
  }
}

/**
 * Global Toast Notifications
 */
export function showToast(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span>${escapeHTML(message)}</span>`;

  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function escapeHTML(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
