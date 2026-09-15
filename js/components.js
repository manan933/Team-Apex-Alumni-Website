/**
 * ==========================================================================
 * GIET UNIVERSITY ALUMNI NETWORK — REUSABLE COMPONENT LOADER
 * File: js/components.js
 * 
 * Automatically loads components/header.html and components/footer.html
 * into any page and initializes navigation, mobile drawer, active tab,
 * and authentication state.
 * ==========================================================================
 */

import { onAuthStateChange, logout } from './auth.js';
import { subscribeNewsletter } from './storage-service.js';

/**
 * Load Header and Footer HTML components into the page
 */
export async function initSharedComponents() {
  const headerTarget = document.getElementById('site-header-container') 
    || document.getElementById('site-header')
    || document.querySelector('[data-component="header"]')
    || document.querySelector('giet-header');

  const footerTarget = document.getElementById('site-footer-container') 
    || document.getElementById('site-footer')
    || document.querySelector('[data-component="footer"]')
    || document.querySelector('giet-footer');

  const tasks = [];

  if (headerTarget) {
    tasks.push(
      fetch('components/header.html')
        .then(res => {
          if (!res.ok) throw new Error(`Failed to fetch header: ${res.status}`);
          return res.text();
        })
        .then(html => {
          headerTarget.outerHTML = html;
          setupHeaderInteractions();
        })
        .catch(err => console.error('Error loading header component:', err))
    );
  }

  if (footerTarget) {
    tasks.push(
      fetch('components/footer.html')
        .then(res => {
          if (!res.ok) throw new Error(`Failed to fetch footer: ${res.status}`);
          return res.text();
        })
        .then(html => {
          footerTarget.outerHTML = html;
          setupFooterInteractions();
        })
        .catch(err => console.error('Error loading footer component:', err))
    );
  }

  await Promise.all(tasks);
}

/**
 * Bind Header Interactions (Sticky scroll, Mobile drawer, Active link, Auth)
 */
function setupHeaderInteractions() {
  // 1. Sticky Header
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => {
      if (window.scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // 2. Mobile Drawer
  const toggleBtn = document.querySelector('.mobile-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  const backdrop = document.querySelector('.mobile-drawer-backdrop');

  if (toggleBtn && drawer && backdrop) {
    const toggle = (open) => {
      const shouldOpen = typeof open === 'boolean' ? open : !drawer.classList.contains('open');
      drawer.classList.toggle('open', shouldOpen);
      backdrop.classList.toggle('open', shouldOpen);
      toggleBtn.classList.toggle('is-active', shouldOpen);
      document.body.style.overflow = shouldOpen ? 'hidden' : '';
    };

    toggleBtn.addEventListener('click', () => toggle());
    backdrop.addEventListener('click', () => toggle(false));

    drawer.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => toggle(false));
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('open')) {
        toggle(false);
      }
    });
  }

  // 3. Highlight Current Active Navigation Link
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // 4. Dynamic Auth State in Header & Mobile Drawer
  setupAuthUI();
}

/**
 * Setup Auth Dropdown in Header
 */
function setupAuthUI() {
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
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="21" x2="9" y2="12"></line></svg>
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
        document.addEventListener('click', () => dropdown.classList.remove('show'));
      }

      if (logoutBtn) logoutBtn.addEventListener('click', () => logout());
      if (mobileLogoutBtn) mobileLogoutBtn.addEventListener('click', () => logout());

    } else {
      if (navAuthContainer) {
        navAuthContainer.innerHTML = `<a href="login.html" class="btn btn-outline btn-sm">Alumni Login</a>`;
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

/**
 * Bind Footer Newsletter Form
 */
function setupFooterInteractions() {
  const form = document.querySelector('.newsletter-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = form.querySelector('input[type="email"]');
    const button = form.querySelector('button[type="submit"]');
    const email = input ? input.value.trim() : '';

    if (!email) return;

    if (button) button.disabled = true;
    try {
      await subscribeNewsletter(email);
      if (window.showToast) {
        window.showToast('Thank you for subscribing to GIET Alumni news!', 'success');
      } else {
        alert('Thank you for subscribing to GIET Alumni news!');
      }
      form.reset();
    } catch (err) {
      console.error('Newsletter error:', err);
    } finally {
      if (button) button.disabled = false;
    }
  });
}

function escapeHTML(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Auto-run when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSharedComponents);
} else {
  initSharedComponents();
}
