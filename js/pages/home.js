/**
 * ==========================================================================
 * PAGE LOGIC: HOMEPAGE (index.html)
 * Features:
 * 1. 60fps Native Canvas Alumni Constellation & Living Network Visualizer
 * 2. Animated Stats Counters with IntersectionObserver
 * 3. Interactive Generations Timeline Explorer
 * 4. Alumni Spotlight & University Gazette Stories
 * 5. Featured Talks & Video highlights
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
  initCampusCarousel();
  initHeroCardLoop();
  Promise.all([

    initStatsCounter(),
    initAlumniConstellation(),
    initGenerationsTimeline(),
    initSpotlightAlumni(),
    initLatestStories(),
    initFeaturedVideos()
  ]).catch(err => console.error('Error initializing home page components:', err));
});

/**
 * ==========================================================================
 * 1. STATS COUNTERS
 * ==========================================================================
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
 * ==========================================================================
 * 2. 60FPS NATIVE CANVAS ALUMNI CONSTELLATION & LIVING NETWORK
 * ==========================================================================
 */
async function initAlumniConstellation() {
  const canvas = document.getElementById('network-canvas');
  const tooltip = document.getElementById('network-node-tooltip');
  const filterContainer = document.getElementById('constellation-filters');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationFrameId = null;
  let isCanvasVisible = true;
  let activeFilter = 'all';

  // Industry color mapping
  const categoryColors = {
    'Technology & Engineering': '#38BDF8',
    'Biotechnology & Healthcare': '#34D399',
    'Venture Capital & Finance': '#FBBF24',
    'Energy & Sustainability': '#F87171',
    'Law & Public Policy': '#A78BFA',
    'Architecture & Design': '#F472B6',
    'default': '#D4AF37'
  };

  const alumniList = await getAlumni();
  if (!alumniList || alumniList.length === 0) return;

  // Node physics simulation structures
  let nodes = [];
  let width = 0;
  let height = 0;
  let hoveredNode = null;
  let mouseX = -1000;
  let mouseY = -1000;

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = rect.width;
    height = rect.height;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    repositionNodes();
  };

  const repositionNodes = () => {
    nodes = alumniList.map((alumnus, idx) => {
      const angle = (idx / alumniList.length) * Math.PI * 2;
      const radius = Math.min(width, height) * 0.32 * (0.6 + Math.random() * 0.45);
      const cx = width / 2;
      const cy = height / 2;

      return {
        alumnus,
        x: cx + Math.cos(angle) * radius,
        y: cy + Math.sin(angle) * radius,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: alumnus.verified ? 9 : 7,
        color: categoryColors[alumnus.industry] || categoryColors.default,
        baseX: cx + Math.cos(angle) * radius,
        baseY: cy + Math.sin(angle) * radius
      };
    });
  };

  window.addEventListener('resize', resize);
  resize();

  // Mouse & Touch interactions
  const handlePointerMove = (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;

    let found = null;
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      if (activeFilter !== 'all' && !node.alumnus.industry.toLowerCase().includes(activeFilter.toLowerCase())) {
        continue;
      }

      const dx = mouseX - node.x;
      const dy = mouseY - node.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < node.radius + 12) {
        found = node;
        break;
      }
    }

    hoveredNode = found;

    if (hoveredNode && tooltip) {
      tooltip.style.display = 'block';
      tooltip.style.left = `${Math.min(mouseX + 16, width - 240)}px`;
      tooltip.style.top = `${Math.min(mouseY + 16, height - 120)}px`;

      const avatar = document.getElementById('tooltip-avatar');
      const name = document.getElementById('tooltip-name');
      const role = document.getElementById('tooltip-role');
      const meta = document.getElementById('tooltip-meta');
      const link = document.getElementById('tooltip-link');

      if (avatar) avatar.src = hoveredNode.alumnus.photoURL;
      if (name) name.textContent = hoveredNode.alumnus.name;
      if (role) role.textContent = `${hoveredNode.alumnus.jobTitle} at ${hoveredNode.alumnus.company}`;
      if (meta) meta.textContent = `Class of '${String(hoveredNode.alumnus.gradYear).slice(-2)} • ${hoveredNode.alumnus.city || hoveredNode.alumnus.country}`;
      if (link) link.href = `profile.html?id=${hoveredNode.alumnus.uid}`;
    } else if (tooltip) {
      tooltip.style.display = 'none';
    }
  };

  canvas.addEventListener('mousemove', handlePointerMove);
  canvas.addEventListener('mouseleave', () => {
    hoveredNode = null;
    if (tooltip) tooltip.style.display = 'none';
  });

  canvas.addEventListener('click', () => {
    if (hoveredNode) {
      window.location.href = `profile.html?id=${hoveredNode.alumnus.uid}`;
    }
  });

  // Filter pills
  if (filterContainer) {
    filterContainer.querySelectorAll('.constellation-pill').forEach(btn => {
      btn.addEventListener('click', (e) => {
        filterContainer.querySelectorAll('.constellation-pill').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        activeFilter = e.currentTarget.getAttribute('data-filter');
      });
    });
  }

  // Animation Loop (60fps)
  const render = () => {
    if (!isCanvasVisible) {
      animationFrameId = requestAnimationFrame(render);
      return;
    }

    ctx.clearRect(0, 0, width, height);

    // Filtered nodes
    const activeNodes = nodes.filter(n => {
      if (activeFilter === 'all') return true;
      return n.alumnus.industry.toLowerCase().includes(activeFilter.toLowerCase());
    });

    // Draw Constellation Connection Lines
    for (let i = 0; i < activeNodes.length; i++) {
      for (let j = i + 1; j < activeNodes.length; j++) {
        const a = activeNodes[i];
        const b = activeNodes[j];

        // Connect if same industry, or batch within 4 years
        const sameIndustry = a.alumnus.industry === b.alumnus.industry;
        const closeBatch = Math.abs(a.alumnus.gradYear - b.alumnus.gradYear) <= 3;

        if (sameIndustry || closeBatch) {
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 260) {
            const isHighlighted = hoveredNode && (hoveredNode === a || hoveredNode === b);
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);

            if (isHighlighted) {
              ctx.strokeStyle = 'rgba(212, 175, 55, 0.65)';
              ctx.lineWidth = 1.8;
            } else {
              const alpha = Math.max(0.04, 0.22 - (dist / 260) * 0.18);
              ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
              ctx.lineWidth = 0.75;
            }
            ctx.stroke();
          }
        }
      }
    }

    // Draw Nodes with Gentle Floating Movement
    activeNodes.forEach(node => {
      // Gentle drift
      node.x += node.vx;
      node.y += node.vy;

      // Soft boundary bounce
      if (node.x < 30 || node.x > width - 30) node.vx *= -1;
      if (node.y < 30 || node.y > height - 30) node.vy *= -1;

      const isHovered = hoveredNode === node;

      // Outer glow if hovered
      if (isHovered) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius + 8, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(212, 175, 55, 0.25)';
        ctx.fill();
      }

      // Outer ring
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius + (isHovered ? 3 : 1), 0, Math.PI * 2);
      ctx.strokeStyle = isHovered ? '#D4AF37' : 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Node Body
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fillStyle = node.color;
      ctx.fill();

      // Label on hover or for key featured nodes
      if (isHovered || node.alumnus.verified) {
        ctx.font = isHovered ? '600 11px Plus Jakarta Sans, sans-serif' : '400 9px Plus Jakarta Sans, sans-serif';
        ctx.fillStyle = isHovered ? '#FFFFFF' : 'rgba(255, 255, 255, 0.65)';
        ctx.textAlign = 'center';
        ctx.fillText(node.alumnus.name.split(' ')[0], node.x, node.y + node.radius + 14);
      }
    });

    animationFrameId = requestAnimationFrame(render);
  };

  // Pause when scrolled off screen
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      isCanvasVisible = entries[0].isIntersecting;
    }, { threshold: 0.05 });
    obs.observe(canvas);
  }

  render();
}

/**
 * ==========================================================================
 * 3. GENERATIONS OF EXCELLENCE TIMELINE
 * ==========================================================================
 */
function initGenerationsTimeline() {
  const panel = document.getElementById('timeline-content-panel');
  const tabs = document.querySelectorAll('.timeline-tab');
  if (!panel) return;

  const eraData = {
    frontier: [
      {
        year: "2021 – 2024",
        title: "Frontier AI & Orbital Exploration",
        desc: "Priya Sundaram ('21) engineers raptor propulsion systems at SpaceX, while recent computer science cohorts publish breakthroughs in multimodal generative foundation models.",
        alumni: "Featured: Priya Sundaram ('21) & Liam O'Connor ('23)"
      },
      {
        year: "2018 – 2020",
        title: "Robotics & Machine Learning Research",
        desc: "Aria Chen ('19) joins Google DeepMind as a Senior Research Scientist, developing adaptive robotic manipulation frameworks recognized across global IEEE conferences.",
        alumni: "Featured: Aria Chen ('19) & Zainab Al-Mansoor ('18)"
      },
      {
        year: "2016 – 2017",
        title: "Clean Energy Microgrids & Grid Resilience",
        desc: "Graduates establish sustainable mini-grids delivering carbon-negative electricity across 40 rural municipalities in East Africa and Southeast Asia.",
        alumni: "Featured: David Adebayo ('15) & Kenji Sato ('16)"
      }
    ],
    expansion: [
      {
        year: "2011 – 2015",
        title: "Biotech Revolution & Gene Synthesis",
        desc: "Dr. Elena Rostova ('12) pioneers targeted mRNA delivery mechanisms, named MIT Technology Review 35 Under 35 and founding clinical trials for neurodegenerative conditions.",
        alumni: "Featured: Dr. Elena Rostova ('12)"
      },
      {
        year: "2008 – 2010",
        title: "Global Capital & Climate Venture Endowments",
        desc: "Marcus Vance ('08) establishes the university's largest alumni-led seed incubator fund, backing over 45 collegiate spinout startups.",
        alumni: "Featured: Marcus Vance ('08)"
      },
      {
        year: "2005 – 2007",
        title: "Cloud Infrastructure & Scaled Networks",
        desc: "Alumni engineering teams architect early global distributed database architectures supporting millions of concurrent real-time transactions.",
        alumni: "Featured: Enterprise Systems Cohort ('06)"
      }
    ],
    foundation: [
      {
        year: "1995 – 2004",
        title: "The Internet Era & Telecommunications",
        desc: "Alumni found pioneering fiber-optic transport networks, cryptographic public standards, and university internet consortiums.",
        alumni: "Featured: Early Internet Pioneer Alumni"
      },
      {
        year: "1988 – 1994",
        title: "Constitutional Law & International Justice",
        desc: "Apex law and public policy graduates establish landmark international human rights protocols and environmental conservation accords.",
        alumni: "Featured: International Legal Fellows"
      },
      {
        year: "1980 – 1987",
        title: "Foundation Era & Campus Legacy",
        desc: "The inaugural university engineering cohorts build the foundational labs that continue to train thousands of scholars each year.",
        alumni: "Featured: Founding Apex Class of 1980"
      }
    ]
  };

  const renderEra = (era) => {
    const items = eraData[era] || eraData.frontier;
    panel.innerHTML = items.map(item => `
      <div class="timeline-card">
        <div class="timeline-card-year">${item.year}</div>
        <h3 class="timeline-card-title">${item.title}</h3>
        <p class="timeline-card-desc">${item.desc}</p>
        <div class="timeline-card-alumni">${item.alumni}</div>
      </div>
    `).join('');
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      tabs.forEach(t => t.classList.remove('active'));
      e.currentTarget.classList.add('active');
      const era = e.currentTarget.getAttribute('data-era');
      renderEra(era);
    });
  });

  renderEra('frontier');
}

/**
 * ==========================================================================
 * 4. DISTINGUISHED ALUMNI SPOTLIGHT
 * ==========================================================================
 */
async function initSpotlightAlumni() {
  const container = document.getElementById('spotlight-container');
  if (!container) return;

  try {
    const alumniList = await getAlumni();
    if (!alumniList || alumniList.length === 0) return;

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
          <div style="margin-top: var(--space-6); display:flex; gap:var(--space-3); flex-wrap:wrap;">
            <a href="profile.html?id=${featured.uid}" class="btn btn-accent btn-sm">
              View Full Editorial Profile &rarr;
            </a>
            <a href="directory.html?industry=${encodeURIComponent(featured.industry)}" class="btn btn-outline-white btn-sm">
              More in ${escapeHTML(featured.industry.split('&')[0].trim())}
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
 * ==========================================================================
 * 5. GAZETTE STORIES (2/3 Lead + 1/3 Sidebar)
 * ==========================================================================
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

    const displayStories = stories.slice(0, 4);
    const lead = displayStories[0];
    const sidebars = displayStories.slice(1);

    let html = `
      <article class="story-lead" onclick="window.location.href='news.html'" style="cursor: pointer;">
        <img src="${escapeHTML(lead.imageURL || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80')}" alt="${escapeHTML(lead.title)}" loading="lazy" />
        <div class="story-lead-body">
          <span class="badge badge-accent">${escapeHTML(lead.category || 'Gazette Feature')}</span>
          <h3 style="margin-top: var(--space-3); font-family: var(--font-heading); font-size: var(--text-2xl); color: var(--color-primary);">
            <a href="news.html" style="color:inherit; text-decoration:none;">${escapeHTML(lead.title)}</a>
          </h3>
          <p style="font-size: var(--text-sm); color: var(--color-text-secondary); line-height: var(--leading-relaxed); margin-top: var(--space-2);">
            ${escapeHTML(lead.excerpt || lead.body.slice(0, 160) + '...')}
          </p>
          <div style="font-size: var(--text-xs); color: var(--color-text-muted); margin-top: var(--space-4); border-top: 1px solid var(--color-border-subtle); padding-top: var(--space-3);">
            By <strong>${escapeHTML(lead.authorName || 'Alumni Contributor')}</strong> &bull; ${formatDate(lead.createdAt)}
          </div>
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
              <span class="badge badge-subtle" style="font-size: 0.65rem;">${escapeHTML(story.category || 'News')}</span>
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
 * ==========================================================================
 * 6. FEATURED TALKS & MULTIMEDIA
 * ==========================================================================
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
            <div style="width: 52px; height: 52px; border-radius: 50%; background: var(--color-accent); display: flex; align-items: center; justify-content: center; color: var(--color-primary);">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            </div>
          </div>
        </div>
        <h3 style="margin-top: var(--space-4); font-family: var(--font-heading); font-size: var(--text-xl);"><a href="videos.html" style="color:inherit; text-decoration:none;">${escapeHTML(lead.title)}</a></h3>
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
/**
 * Auto-Changing Campus Photo Carousel
 */
function initCampusCarousel() {
  const track = document.getElementById('campus-slides-track');
  if (!track) return;

  const slides = track.querySelectorAll('.panoramic-slide, .campus-slide');
  const dots = document.querySelectorAll('.panoramic-dot, .carousel-dot');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');

  if (slides.length <= 1) return;

  let current = 0;
  let timer = null;
  const interval = 3500; // Changes photo every 4.5 seconds

  const showSlide = (index) => {
    slides.forEach((s, i) => s.classList.toggle('active', i === index));
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
    current = index;
  };

  const nextSlide = () => {
    showSlide((current + 1) % slides.length);
  };

  const prevSlide = () => {
    showSlide((current - 1 + slides.length) % slides.length);
  };

  const startAuto = () => {
    stopAuto();
    timer = setInterval(nextSlide, interval);
  };

  const stopAuto = () => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  };

  if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); startAuto(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); startAuto(); });

  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      const idx = parseInt(e.currentTarget.getAttribute('data-index'), 10);
      showSlide(idx);
      startAuto();
    });
  });

  const heroSection = track.closest('.hero-panoramic-section') || track;
  heroSection.addEventListener('mouseenter', stopAuto);
  heroSection.addEventListener('mouseleave', startAuto);

  // Touch swipe support for mobile
  let touchStartX = 0;
  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    stopAuto();
  }, { passive: true });
  track.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].screenX;
    if (touchStartX - touchEndX > 50) {
      nextSlide();
    } else if (touchEndX - touchStartX > 50) {
      prevSlide();
    }
    startAuto();
  }, { passive: true });

  startAuto();
}
/**
 * Auto-Looping Spatial Alumni Cards Stack
 */
function initHeroCardLoop() {
  const container = document.querySelector('.hero-spatial-col');
  if (!container) return;

  const cards = container.querySelectorAll('.hero-alumni-card');
  if (cards.length < 2) return;

  let currentIndex = 0;
  let loopTimer = null;
  const interval = 3800; // Swaps every 3.8 seconds

  function updateCards() {
    cards.forEach((card, index) => {
      if (index === currentIndex) {
        card.classList.remove('is-back', 'hero-card-secondary');
        card.classList.add('is-front', 'hero-card-main');
      } else {
        card.classList.remove('is-front', 'hero-card-main');
        card.classList.add('is-back', 'hero-card-secondary');
      }
    });
  }

  function nextCard() {
    currentIndex = (currentIndex + 1) % cards.length;
    updateCards();
  }

  function startLoop() {
    stopLoop();
    loopTimer = setInterval(nextCard, interval);
  }

  function stopLoop() {
    if (loopTimer) {
      clearInterval(loopTimer);
      loopTimer = null;
    }
  }

  // Start the loop
  updateCards();
  startLoop();

  // Pause on hover so the user can easily click the profile link
  container.addEventListener('mouseenter', stopLoop);
  container.addEventListener('mouseleave', startLoop);

  // Clicking the back card immediately brings it to the front
  cards.forEach((card, idx) => {
    card.addEventListener('click', (e) => {
      if (idx !== currentIndex) {
        e.preventDefault();
        currentIndex = idx;
        updateCards();
        startLoop();
      }
    });
  });
}