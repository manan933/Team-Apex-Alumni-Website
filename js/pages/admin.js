/**
 * ==========================================================================
 * PAGE LOGIC: ADMIN MODERATION DASHBOARD (admin.html)
 * Role gate check, tab navigation, moderation queue with approve/reject actions
 * ==========================================================================
 */

import { onAuthStateChange, login } from '../auth.js';
import { getSubmissions, updateSubmissionStatus } from '../storage-service.js';
import { showToast } from '../nav.js';

let pendingStories = [];

document.addEventListener('DOMContentLoaded', () => {
  onAuthStateChange(async (user) => {
    const authGateNotice = document.getElementById('admin-auth-gate');
    const adminDashboard = document.getElementById('admin-dashboard');

    if (!user || !user.isAdmin) {
      if (authGateNotice) authGateNotice.style.display = 'block';
      if (adminDashboard) adminDashboard.style.display = 'none';
      initDemoAdminSwitcher();
      return;
    }

    if (authGateNotice) authGateNotice.style.display = 'none';
    if (adminDashboard) adminDashboard.style.display = 'block';

    initAdminTabs();
    await loadPendingStories();
  });
});

/**
 * Provide a demo bypass button for reviewers testing the admin stub
 */
function initDemoAdminSwitcher() {
  const switchBtn = document.getElementById('demo-admin-login-btn');
  switchBtn?.addEventListener('click', async () => {
    await login('marcus.vance@apexcapital.co', 'password');
    window.location.reload();
  });
}

function initAdminTabs() {
  const navItems = document.querySelectorAll('.admin-nav-item');
  const panels = document.querySelectorAll('.admin-tab-panel');

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const target = item.getAttribute('data-tab');

      navItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      panels.forEach(p => {
        if (p.id === `panel-${target}`) {
          p.style.display = 'block';
        } else {
          p.style.display = 'none';
        }
      });
    });
  });
}

async function loadPendingStories() {
  const container = document.getElementById('admin-pending-stories-list');
  if (!container) return;

  pendingStories = await getSubmissions('pending');
  const countBadge = document.getElementById('pending-stories-count');
  if (countBadge) countBadge.textContent = pendingStories.length;

  if (!pendingStories.length) {
    container.innerHTML = `
      <div class="empty-state" style="padding: var(--space-8);">
        <div class="empty-icon">✓</div>
        <h4 class="empty-title">Queue is Empty</h4>
        <p class="empty-text">There are currently no alumni story submissions waiting for review.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = pendingStories.map(story => `
    <div class="moderation-card" data-id="${story.id}">
      <div class="moderation-card-header">
        <div>
          <span class="badge badge-warning">Pending Review</span>
          <span class="badge badge-subtle">${escapeHTML(story.category)}</span>
          <span style="font-size: var(--text-xs); color: var(--color-text-muted); margin-left: 8px;">
            Submitted by <strong>${escapeHTML(story.authorName)}</strong> on ${new Date(story.createdAt).toLocaleDateString()}
          </span>
        </div>
        <div class="moderation-actions">
          <button class="btn btn-outline btn-sm reject-story-btn" data-id="${story.id}" style="color: var(--color-danger); border-color: var(--color-danger);">
            Reject
          </button>
          <button class="btn btn-primary btn-sm approve-story-btn" data-id="${story.id}">
            Approve & Publish
          </button>
        </div>
      </div>
      <div>
        <h4 style="font-size: var(--text-lg); margin-bottom: 4px;">${escapeHTML(story.title)}</h4>
        <p style="font-size: var(--text-sm); color: var(--color-text-secondary); margin-bottom: 8px;">
          ${escapeHTML(story.body)}
        </p>
        ${story.imageURL ? `
          <div style="font-size: var(--text-xs); color: var(--color-text-muted);">
            Cover Image: <a href="${story.imageURL}" target="_blank" rel="noopener noreferrer" style="color: var(--color-accent-hover);">${story.imageURL}</a>
          </div>
        ` : ''}
      </div>
    </div>
  `).join('');

  // Wire actions
  container.querySelectorAll('.approve-story-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.getAttribute('data-id');
      await updateSubmissionStatus(id, 'approved');
      showToast('Story approved and published to the live public feed!', 'success');
      await loadPendingStories();
    });
  });

  container.querySelectorAll('.reject-story-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.getAttribute('data-id');
      await updateSubmissionStatus(id, 'rejected');
      showToast('Story submission rejected.', 'info');
      await loadPendingStories();
    });
  });
}

function escapeHTML(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
