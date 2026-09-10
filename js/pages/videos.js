/**
 * ==========================================================================
 * PAGE LOGIC: VIDEOS (videos.html)
 * YouTube embeds, category filtering, theater mode player modal
 * ==========================================================================
 */

import { getVideos } from '../storage-service.js';

let allVideos = [];
let activeCategory = 'All';

document.addEventListener('DOMContentLoaded', async () => {
  allVideos = await getVideos();
  initCategoryFilters();
  renderVideos();
  initTheaterModal();
});

function initCategoryFilters() {
  const container = document.getElementById('video-category-pills');
  if (!container) return;

  const categories = ['All', ...new Set(allVideos.map(v => v.category))];

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
      renderVideos();
    });
  });
}

function renderVideos() {
  const grid = document.getElementById('videos-grid');
  if (!grid) return;

  const list = activeCategory === 'All' 
    ? allVideos 
    : allVideos.filter(v => v.category === activeCategory);

  if (!list.length) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div class="empty-icon">🎬</div>
        <h3 class="empty-title">No Videos Found</h3>
        <p class="empty-text">No video recordings found in this category.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = list.map(v => `
    <div class="video-card" data-id="${v.id}">
      <div class="video-thumb-container" onclick="window.playTheaterVideo('${v.youtubeId}', '${encodeURIComponent(v.title)}', '${encodeURIComponent(v.description)}')">
        <img 
          src="https://img.youtube.com/vi/${v.youtubeId}/hqdefault.jpg" 
          alt="${escapeHTML(v.title)}" 
          class="video-thumb-img" 
          loading="lazy" 
        />
        <div class="video-play-btn" aria-label="Play video">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
        </div>
      </div>
      <div class="video-card-body">
        <div class="video-card-category">${escapeHTML(v.category)}</div>
        <h3 class="video-card-title">${escapeHTML(v.title)}</h3>
        <p class="video-card-desc">${escapeHTML(v.description)}</p>
      </div>
    </div>
  `).join('');
}

function initTheaterModal() {
  const modal = document.getElementById('theater-modal');
  const closeBtn = document.getElementById('close-theater-modal');

  const closeModal = () => {
    const iframe = document.getElementById('theater-iframe');
    if (iframe) iframe.src = ''; // Stop video playback
    modal?.classList.remove('open');
  };

  closeBtn?.addEventListener('click', closeModal);
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal?.classList.contains('open')) closeModal();
  });

  // Global window handler for card play click
  window.playTheaterVideo = (youtubeId, encodedTitle, encodedDesc) => {
    const iframe = document.getElementById('theater-iframe');
    const titleEl = document.getElementById('theater-video-title');
    const descEl = document.getElementById('theater-video-desc');

    if (iframe) {
      iframe.src = `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`;
    }
    if (titleEl) titleEl.textContent = decodeURIComponent(encodedTitle);
    if (descEl) descEl.textContent = decodeURIComponent(encodedDesc);

    modal?.classList.add('open');
  };
}

function escapeHTML(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
