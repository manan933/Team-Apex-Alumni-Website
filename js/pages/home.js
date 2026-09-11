/**
 * ==========================================================================
 * PAGE LOGIC: HOME (index.html)
 * Editorial front page: Stats counter, Spotlight, Mosaic, Stories, Videos
 * ==========================================================================
 */

import { getAlumni, getSubmissions, getVideos, getStats } from '../storage-service.js';

function escapeHTML(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = String(str);
  return div.innerHTML;
}

function formatDate(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

document.addEventListener('DOMContentLoaded', () => {
  Promise.all([
    initStatsCounter(),
    initSpotlightAlumni(),
    initAlumniMosaic(),
    initLatestStories(),
    initFeaturedVideos()
  ]).catch(err => console.error('Error initializing home page:', err));
});

/**
 * Animated stats counters when in view
 */
async function initStatsCounter() {
  try {
    const stats = await getStats();
    
    const runCounter = (id, target) => {
      const el = document.getElementById(id);
      if (!el || !target) return;
      
      let start = 0;
      const duration = 1600;
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

    const section = document.querySelector('.stats-bar');
    if (section && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          runCounter('stat-total-alumni', stats.totalAlumni || 28450);
          runCounter('stat-countries', stats.countriesRepresented || 52);
          runCounter('stat-chapters', stats.activeChapters || 38);
          runCounter('stat-years', stats.yearsOfExcellence || 45);
          observer.disconnect();
        }
      }, { threshold: 0.2 });
      observer.observe(section);
    } else {
      runCounter('stat-total-alumni', stats.totalAlumni || 28450);
      runCounter('stat-countries', stats.countriesRepresented || 52);
      runCounter('stat-chapters', stats.activeChapters || 38);
      runCounter('stat-years', stats.yearsOfExcellence || 45);
    }
  } catch (error) {
    console.error('Error loading stats:', error);
  }
}

/**
 * Featured Spotlight Alumni (editorial quote + portrait)
 */
async function initSpotlightAlumni() {
  const container = document.getElementById('spotlight-container');
  if (!container) return;

  try {
    const alumniList = await getAlumni();
    if (!alumniList || alumniList.length === 0) return;

    // Pick Elena Rostova or first verified alumni
    const featured = alumniList.find(a => a.uid === 'alumni-001') || alumniList[0];
    const quote = featured.bio || "Where lasting legacy shapes the next horizon.";

    container.innerHTML = `
      <div class="spotlight-card">
        <div class="spotlight-image-col">
          <span class="spotlight-badge-corner">Alumni Spotlight</span>
          <img src="${escapeHTML(featured.photoURL)}" alt="${escapeHTML(featured.name)}" class="spotlight-img" loading="lazy" />
        </div>
        <div class="spotlight-content-col">
          <blockquote class="spotlight-quote">
            "${escapeHTML(quote)}"
          </blockquote>
          <div class="spotlight-meta">
            <div class="spotlight-name">${escapeHTML(featured.name)}</div>
            <div class="spotlight-details">${escapeHTML(featured.jobTitle || '')} at <strong>${escapeHTML(featured.company || '')}</strong> &bull; Class of '${String(featured.gradYear).slice(-2)}</div>
          </div>
          <div style="margin-top: var(--space-6);">
            <a href="directory.html?search=${encodeURIComponent(featured.name)}" class="btn btn-outline-white btn-sm">
              View Directory Profile &rarr;
            </a>
          </div>
        </div>
      </div>
    `;
  } catch (error) {
    console.error('Error loading spotlight alumni:', error);
  }
}

/**
 * Alumni Mosaic Grid (6 varied graduates)
 */
async function initAlumniMosaic() {
  const container = document.getElementById('alumni-mosaic');
  if (!container) return;

  try {
    const alumniList = await getAlumni();
    if (!alumniList || alumniList.length === 0) return;

    // Pick 6 diverse alumni
    const selected = alumniList.slice(1, 7);
    
    let html = '';
    selected.forEach((alumni, index) => {
      const isFeatured = index === 0;
      const cardClass = isFeatured ? 'mosaic-card mosaic-card--featured' : 'mosaic-card';
      
      html += `
        <article class="${cardClass}" onclick="window.location.href='directory.html?search=${encodeURIComponent(alumni.name)}'" style="cursor: pointer;">
          <img src="${escapeHTML(alumni.photoURL)}" alt="${escapeHTML(alumni.name)}" class="mosaic-card-photo" loading="lazy" />
          <div class="mosaic-card-body">
            <h3 class="mosaic-card-name">${escapeHTML(alumni.name)}</h3>
            <div class="mosaic-card-role">${escapeHTML(alumni.jobTitle || '')}${alumni.company ? ' at ' + escapeHTML(alumni.company) : ''}</div>
            <div class="mosaic-card-meta">Class of '${String(alumni.gradYear).slice(-2)} &bull; ${escapeHTML(alumni.city || alumni.country || '')}</div>
          </div>
        </article>
      `;
    });

    container.innerHTML = html;
  } catch (error) {
    console.error('Error loading alumni mosaic:', error);
  }
}

/**
 * Latest Approved Stories (editorial lead + sidebar layout)
 */
async function initLatestStories() {
  const container = document.getElementById('home-stories-grid');
  if (!container) return;

  try {
    const stories = await getSubmissions('approved');
    if (!stories || stories.length === 0) {
      container.innerHTML = '<div class="empty-state"><p>No published stories yet.</p></div>';
      return;
    }

    const displayStories = stories.slice(0, 3);
    const lead = displayStories[0];
    const sidebars = displayStories.slice(1);

    let html = `
      <article class="story-lead" onclick="window.location.href='news.html'" style="cursor: pointer;">
        <img src="${escapeHTML(lead.imageURL || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80')}" alt="${escapeHTML(lead.title)}" loading="lazy" />
        <span class="badge badge-accent" style="margin-top: var(--space-4); display: inline-block;">${escapeHTML(lead.category || 'Gazette')}</span>
        <h3 style="margin-top: var(--space-2);"><a href="news.html" style="color:inherit; text-decoration:none;">${escapeHTML(lead.title)}</a></h3>
        <p>${escapeHTML(lead.excerpt || lead.body.slice(0, 140) + '...')}</p>
        <div style="font-size: var(--text-xs); color: var(--color-text-muted); margin-top: var(--space-3);">
          By <strong>${escapeHTML(lead.authorName || 'Alumni Contributor')}</strong> &bull; ${formatDate(lead.createdAt)}
        </div>
      </article>
    `;

    if (sidebars.length > 0) {
      html += `<div class="story-sidebar">`;
      sidebars.forEach(story => {
        html += `
          <article class="story-sidebar-item" onclick="window.location.href='news.html'" style="cursor: pointer;">
            <img src="${escapeHTML(story.imageURL || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=400&q=80')}" alt="${escapeHTML(story.title)}" loading="lazy" />
            <div class="story-sidebar-content">
              <span class="badge badge-subtle" style="font-size: 0.65rem; margin-bottom: 2px;">${escapeHTML(story.category || 'News')}</span>
              <h4><a href="news.html" style="color:inherit; text-decoration:none;">${escapeHTML(story.title)}</a></h4>
              <span style="font-size: var(--text-xs); color: var(--color-text-muted);">${formatDate(story.createdAt)}</span>
            </div>
          </article>
        `;
      });
      html += `</div>`;
    }

    container.innerHTML = html;
  } catch (error) {
    console.error('Error loading latest stories:', error);
  }
}

/**
 * Featured Videos (lead video + sidebars)
 */
async function initFeaturedVideos() {
  const container = document.getElementById('home-videos-grid');
  if (!container) return;

  try {
    const videos = await getVideos();
    if (!videos || videos.length === 0) return;

    const displayVideos = videos.slice(0, 3);
    const lead = displayVideos[0];
    const sidebars = displayVideos.slice(1);

    let html = `
      <div class="video-lead" onclick="window.location.href='videos.html'" style="cursor: pointer;">
        <div style="position: relative; overflow: hidden; border-radius: var(--radius-sm); aspect-ratio: 16/9; background: #000;">
          <img src="https://img.youtube.com/vi/${lead.youtubeId}/hqdefault.jpg" alt="${escapeHTML(lead.title)}" style="width: 100%; height: 100%; object-fit: cover;" loading="lazy" />
          <div style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(11,25,44,0.35);">
            <div style="width: 48px; height: 48px; border-radius: 50%; background: var(--color-accent); display: flex; align-items: center; justify-content: center; color: var(--color-primary);">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            </div>
          </div>
        </div>
        <h3 style="margin-top: var(--space-3);"><a href="videos.html" style="color:inherit; text-decoration:none;">${escapeHTML(lead.title)}</a></h3>
        <p style="font-size: var(--text-sm); color: var(--color-text-secondary); margin-top: var(--space-1);">${escapeHTML(lead.description || '')}</p>
      </div>
    `;

    if (sidebars.length > 0) {
      html += `<div class="video-sidebar">`;
      sidebars.forEach(video => {
        html += `
          <div class="video-sidebar-item" onclick="window.location.href='videos.html'" style="cursor: pointer;">
            <div style="position: relative; border-radius: var(--radius-xs); overflow: hidden; width: 120px; aspect-ratio: 16/9; flex-shrink: 0; background: #000;">
              <img src="https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg" alt="${escapeHTML(video.title)}" style="width: 100%; height: 100%; object-fit: cover;" loading="lazy" />
            </div>
            <div>
              <span class="badge badge-subtle" style="font-size: 0.65rem;">${escapeHTML(video.category || 'Feature')}</span>
              <h4 style="font-size: var(--text-sm); margin-top: 2px;"><a href="videos.html" style="color:inherit; text-decoration:none;">${escapeHTML(video.title)}</a></h4>
            </div>
          </div>
        `;
      });
      html += `</div>`;
    }

    container.innerHTML = html;
  } catch (error) {
    console.error('Error loading featured videos:', error);
  }
}
