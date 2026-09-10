/**
 * ==========================================================================
 * PAGE LOGIC: HOME (index.html)
 * Animated stats counters, spotlight alumni, latest stories, featured videos
 * ==========================================================================
 */

import { getAlumni, getSubmissions, getVideos, getStats } from '../storage-service.js';

document.addEventListener('DOMContentLoaded', async () => {
  await Promise.all([
    initStatsCounter(),
    initSpotlightAlumni(),
    initLatestStories(),
    initFeaturedVideos()
  ]);
});

/**
 * Animate stats counters when in view
 */
async function initStatsCounter() {
  const stats = await getStats();
  const elTotal = document.getElementById('stat-total-alumni');
  const elCountries = document.getElementById('stat-countries');
  const elChapters = document.getElementById('stat-chapters');
  const elYears = document.getElementById('stat-years');

  const animateCount = (el, target, duration = 1600) => {
    if (!el) return;
    let start = 0;
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = target / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        el.textContent = target.toLocaleString();
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(start).toLocaleString();
      }
    }, stepTime);
  };

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      if (elTotal) animateCount(elTotal, stats.totalAlumni);
      if (elCountries) animateCount(elCountries, stats.countriesRepresented);
      if (elChapters) animateCount(elChapters, stats.activeChapters);
      if (elYears) animateCount(elYears, stats.yearsOfExcellence);
      observer.disconnect();
    }
  }, { threshold: 0.2 });

  const section = document.querySelector('.stats-strip');
  if (section) observer.observe(section);
}

/**
 * Populate random or designated spotlight alumni card
 */
async function initSpotlightAlumni() {
  const spotlightContainer = document.getElementById('spotlight-container');
  if (!spotlightContainer) return;

  const alumni = await getAlumni();
  if (!alumni.length) return;

  // Pick Elena or first verified alum
  const featured = alumni.find(a => a.uid === 'alumni-001') || alumni[0];

  spotlightContainer.innerHTML = `
    <div class="spotlight-card">
      <div class="spotlight-image-col">
        <img src="${featured.photoURL}" alt="${escapeHTML(featured.name)}" class="spotlight-img" loading="lazy" />
        <span class="badge badge-accent spotlight-badge-corner">Alumni Spotlight</span>
      </div>
      <div class="spotlight-content-col">
        <blockquote class="spotlight-quote">
          "${escapeHTML(featured.bio)}"
        </blockquote>
        <div class="spotlight-meta">
          <div class="spotlight-name">${escapeHTML(featured.name)}</div>
          <div class="spotlight-details">${escapeHTML(featured.jobTitle)} at <strong>${escapeHTML(featured.company)}</strong> · Class of '${String(featured.gradYear).slice(-2)}</div>
        </div>
        <div style="margin-top: var(--space-6);">
          <a href="directory.html?search=${encodeURIComponent(featured.name)}" class="btn btn-outline-white btn-sm">
            View Directory Profile &rarr;
          </a>
        </div>
      </div>
    </div>
  `;
}

/**
 * Populate latest approved stories
 */
async function initLatestStories() {
  const container = document.getElementById('home-stories-grid');
  if (!container) return;

  const stories = await getSubmissions('approved');
  const previewList = stories.slice(0, 3);

  if (!previewList.length) {
    container.innerHTML = `<div class="empty-state"><p>No published stories yet.</p></div>`;
    return;
  }

  container.innerHTML = previewList.map(item => `
    <article class="news-card" onclick="window.location.href='news.html'">
      <div class="news-cover-wrap">
        <img src="${item.imageURL || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80'}" alt="${escapeHTML(item.title)}" class="news-cover-img" loading="lazy" />
        <span class="news-category-badge">${escapeHTML(item.category)}</span>
      </div>
      <div class="news-card-body">
        <div class="news-date">${formatDate(item.createdAt)}</div>
        <h3 class="news-title">${escapeHTML(item.title)}</h3>
        <p class="news-excerpt">${escapeHTML(item.excerpt || item.body.slice(0, 120) + '...')}</p>
        <div class="news-author">
          <span>By</span> <span class="author-name">${escapeHTML(item.authorName)}</span>
        </div>
      </div>
    </article>
  `).join('');
}

/**
 * Populate featured videos
 */
async function initFeaturedVideos() {
  const container = document.getElementById('home-videos-grid');
  if (!container) return;

  const videos = await getVideos();
  const preview = videos.slice(0, 3);

  container.innerHTML = preview.map(v => `
    <div class="video-card" onclick="window.location.href='videos.html'">
      <div class="video-thumb-container">
        <img src="https://img.youtube.com/vi/${v.youtubeId}/hqdefault.jpg" alt="${escapeHTML(v.title)}" class="video-thumb-img" loading="lazy" />
        <div class="video-play-btn">
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
