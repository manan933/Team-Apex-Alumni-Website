/**
 * ==========================================================================
 * PAGE LOGIC: NEWS & STORIES (news.html)
 * Feed of approved posts, full article reader, alumni submission modal flow
 * ==========================================================================
 */

import { getSubmissions, createSubmission } from '../storage-service.js';
import { getCurrentUser, onAuthStateChange } from '../auth.js';
import { showToast } from '../nav.js';

let approvedStories = [];
let activeCategory = 'All';
let currentUser = null;

document.addEventListener('DOMContentLoaded', async () => {
  onAuthStateChange((user) => {
    currentUser = user;
    updateSubmitButtonState();
  });

  approvedStories = await getSubmissions('approved');
  initCategoryFilters();
  renderStories();
  initReaderModal();
  initSubmissionModal();

  // Check if opened with #submit hash
  if (window.location.hash === '#submit') {
    handleOpenSubmitModal();
  }
});

function initCategoryFilters() {
  const container = document.getElementById('news-category-filters');
  if (!container) return;

  const categories = ['All', 'News', 'Story', 'Achievement'];

  container.innerHTML = categories.map(cat => `
    <button class="category-pill ${cat === activeCategory ? 'active' : ''}" data-cat="${cat}">
      ${cat}
    </button>
  `).join('');

  container.querySelectorAll('.category-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      container.querySelectorAll('.category-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeCategory = pill.getAttribute('data-cat');
      renderStories();
    });
  });
}

function renderStories() {
  const grid = document.getElementById('news-grid');
  if (!grid) return;

  const list = activeCategory === 'All'
    ? approvedStories
    : approvedStories.filter(s => s.category === activeCategory);

  if (!list.length) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div class="empty-icon">📰</div>
        <h3 class="empty-title">No Stories in This Category</h3>
        <p class="empty-text">Check back soon or submit your own alumni story today!</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = list.map(story => `
    <article class="news-card" data-id="${story.id}">
      <div class="news-cover-wrap">
        <img 
          src="${story.imageURL || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80'}" 
          alt="${escapeHTML(story.title)}" 
          class="news-cover-img" 
          loading="lazy" 
        />
        <span class="news-category-badge">${escapeHTML(story.category)}</span>
      </div>
      <div class="news-card-body">
        <div class="news-date">${formatDate(story.createdAt)}</div>
        <h3 class="news-title">${escapeHTML(story.title)}</h3>
        <p class="news-excerpt">${escapeHTML(story.excerpt || story.body.slice(0, 130) + '...')}</p>
        <div class="news-author">
          <span>By</span> <span class="author-name">${escapeHTML(story.authorName)}</span>
        </div>
      </div>
    </article>
  `).join('');

  grid.querySelectorAll('.news-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-id');
      openReaderModal(id);
    });
  });
}

/**
 * Story Reader Modal
 */
function initReaderModal() {
  const modal = document.getElementById('reader-modal');
  const closeBtn = document.getElementById('close-reader-modal');

  closeBtn?.addEventListener('click', () => modal.classList.remove('open'));
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('open');
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal?.classList.contains('open')) {
      modal.classList.remove('open');
    }
  });
}

function openReaderModal(id) {
  const story = approvedStories.find(s => s.id === id);
  if (!story) return;

  const modal = document.getElementById('reader-modal');
  const body = document.getElementById('reader-modal-body');
  if (!modal || !body) return;

  body.innerHTML = `
    ${story.imageURL ? `<img src="${story.imageURL}" alt="${escapeHTML(story.title)}" class="story-reader-cover" />` : ''}
    <div class="story-reader-content">
      <div style="display: flex; gap: var(--space-2); margin-bottom: var(--space-3); align-items: center;">
        <span class="badge badge-accent">${escapeHTML(story.category)}</span>
        <span style="font-size: var(--text-xs); color: var(--color-text-muted);">${formatDate(story.createdAt)}</span>
      </div>
      <h2 class="section-title" style="margin-bottom: var(--space-2);">${escapeHTML(story.title)}</h2>
      <div style="font-size: var(--text-sm); color: var(--color-text-muted); margin-bottom: var(--space-4);">
        Published by <strong>${escapeHTML(story.authorName)}</strong>
      </div>
      <div class="story-reader-body">
        ${escapeHTML(story.body)}
      </div>
    </div>
  `;

  modal.classList.add('open');
}

/**
 * Story Submission Modal (Alumni Only)
 */
function initSubmissionModal() {
  const triggerBtn = document.getElementById('share-story-btn');
  const modal = document.getElementById('submit-story-modal');
  const closeBtn = document.getElementById('close-submit-modal');
  const form = document.getElementById('story-submission-form');

  triggerBtn?.addEventListener('click', handleOpenSubmitModal);
  closeBtn?.addEventListener('click', () => modal.classList.remove('open'));
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('open');
  });

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    const title = document.getElementById('story-title').value.trim();
    const category = document.getElementById('story-category').value;
    const excerpt = document.getElementById('story-excerpt').value.trim();
    const body = document.getElementById('story-body').value.trim();
    const imageURL = document.getElementById('story-image').value.trim() || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80';
    const submitBtn = form.querySelector('button[type="submit"]');

    if (!title || !body) {
      showToast('Please fill out all required story fields.', 'danger');
      return;
    }

    try {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting for Review...';

      await createSubmission({
        authorUid: currentUser.uid,
        authorName: currentUser.name ? `${currentUser.name} ('${String(currentUser.gradYear || '').slice(-2)})` : 'Alum',
        title,
        category,
        excerpt,
        body,
        imageURL
      });

      form.reset();
      modal.classList.remove('open');
      showToast('Your story was submitted! An admin will review it shortly before publication.', 'success');
    } catch (err) {
      console.error(err);
      showToast('Submission error: ' + err.message, 'danger');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit Story for Moderation';
    }
  });
}

function handleOpenSubmitModal() {
  const modal = document.getElementById('submit-story-modal');
  if (!currentUser) {
    showToast('Please log in to submit a story to the alumni editorial feed.', 'info');
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 1200);
    return;
  }
  modal?.classList.add('open');
}

function updateSubmitButtonState() {
  const triggerBtn = document.getElementById('share-story-btn');
  if (!triggerBtn) return;
  if (currentUser) {
    triggerBtn.textContent = 'Share Your Story +';
  } else {
    triggerBtn.textContent = 'Log In to Share Your Story';
  }
}

function formatDate(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function escapeHTML(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
