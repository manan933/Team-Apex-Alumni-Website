/**
 * ==========================================================================
 * NAVIGATION & GLOBAL UI LOGIC
 * Sticky nav shrink, mobile drawer, dynamic auth state dropdown, toasts
 * ==========================================================================
 */

import { onAuthStateChange, logout } from './auth.js';
import { subscribeNewsletter } from './storage-service.js';

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileDrawer();
  initActiveNavLink();
  initAuthUI();
  initNewsletter();
  initScrollReveals();
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
  if (toggleBtn.dataset.navBound === 'true') return;
  toggleBtn.dataset.navBound = 'true';

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

// Global Toast Notifications
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

if (typeof window !== 'undefined') {
  window.showToast = showToast;
}

function escapeHTML(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
