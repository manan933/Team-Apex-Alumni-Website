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
  drawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => toggle(false));
  });
}

/**
 * Highlight active page nav link
 */
function initActiveNavLink() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/**
 * Dynamic Auth UI in Header
 */
function initAuthUI() {
  const container = document.getElementById('nav-auth-container');
  const mobileContainer = document.getElementById('mobile-auth-container');

  onAuthStateChange((user) => {
    if (container) {
      if (user) {
        const initials = user.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'AL';
        const avatarMarkup = user.photoURL 
          ? `<img src="${user.photoURL}" alt="${user.name}" class="user-avatar-img" />`
          : `<div class="user-avatar-img">${initials}</div>`;

        container.innerHTML = `
          <div class="user-dropdown">
            <button class="user-avatar-btn" id="user-menu-btn" aria-label="User Account Menu" aria-haspopup="true">
              ${avatarMarkup}
              <span class="user-name-short">${escapeHTML(user.name || 'My Account')}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </button>
            <div class="dropdown-menu" id="user-dropdown-menu">
              <div class="dropdown-header">
                <div class="dropdown-header-name">${escapeHTML(user.name || 'Alum')}</div>
                <div class="dropdown-header-email">${escapeHTML(user.email || '')}</div>
              </div>
              <a href="profile.html" class="dropdown-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                My Profile
              </a>
              <a href="news.html#submit" class="dropdown-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                Submit a Story
              </a>
              ${user.isAdmin ? `
              <a href="admin.html" class="dropdown-item" style="color: var(--color-accent-hover); font-weight: 600;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                Admin Portal
              </a>
              ` : ''}
              <div class="dropdown-divider"></div>
              <button class="dropdown-item" id="logout-nav-btn" style="color: var(--color-danger);">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                Log Out
              </button>
            </div>
          </div>
        `;

        const menuBtn = container.querySelector('#user-menu-btn');
        const menu = container.querySelector('#user-dropdown-menu');
        const logoutBtn = container.querySelector('#logout-nav-btn');

        menuBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          menu.classList.toggle('show');
        });

        document.addEventListener('click', () => {
          menu.classList.remove('show');
        });

        logoutBtn.addEventListener('click', async () => {
          await logout();
          showToast('You have signed out.', 'info');
          if (window.location.pathname.includes('profile.html') || window.location.pathname.includes('admin.html')) {
            window.location.href = 'index.html';
          }
        });
      } else {
        container.innerHTML = `
          <a href="login.html" class="btn btn-outline btn-sm">Alumni Login</a>
        `;
      }
    }

    if (mobileContainer) {
      if (user) {
        mobileContainer.innerHTML = `
          <div style="padding: var(--space-4) 0; border-top: 1px solid var(--color-border-subtle); margin-top: var(--space-4);">
            <div style="font-weight: bold; color: var(--color-primary); margin-bottom: var(--space-2);">${escapeHTML(user.name || 'Alum')}</div>
            <a href="profile.html" class="mobile-nav-link" style="font-size: var(--text-base);">My Profile</a>
            <a href="news.html#submit" class="mobile-nav-link" style="font-size: var(--text-base);">Submit a Story</a>
            ${user.isAdmin ? `<a href="admin.html" class="mobile-nav-link" style="font-size: var(--text-base); color: var(--color-accent-hover);">Admin Portal</a>` : ''}
            <button id="mobile-logout-btn" class="btn btn-outline btn-block btn-sm" style="margin-top: var(--space-4); color: var(--color-danger); border-color: var(--color-danger);">Log Out</button>
          </div>
        `;
        mobileContainer.querySelector('#mobile-logout-btn')?.addEventListener('click', async () => {
          await logout();
          window.location.reload();
        });
      } else {
        mobileContainer.innerHTML = `
          <div style="display: flex; flex-direction: column; gap: var(--space-2); margin-top: var(--space-6);">
            <a href="login.html" class="btn btn-primary btn-block">Alumni Login</a>
            <a href="signup.html" class="btn btn-outline btn-block">Join Network</a>
          </div>
        `;
      }
    }
  });
}

/**
 * Newsletter subscription footer handler
 */
function initNewsletter() {
  const form = document.querySelector('.newsletter-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = form.querySelector('.newsletter-input');
    const email = input.value.trim();
    if (!email) return;

    try {
      await subscribeNewsletter(email);
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
  toast.innerHTML = `
    <span>${escapeHTML(message)}</span>
  `;

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
