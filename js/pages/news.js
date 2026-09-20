/* =========================================================
   GIET ALUMNI GAZETTE & NEWS LOGIC (PHASE 2 UPGRADE)
   World-Class Academic Journalism & Interactive Magazine Suite
========================================================= */

/* =========================================================
   INTEGRATION HOOKS (SAFE FOR BOTH file:// AND HTTP HOSTING)
========================================================= */

let getSubmissions = (typeof window !== "undefined" && window.getSubmissions) || null;
let createSubmission = (typeof window !== "undefined" && window.createSubmission) || null;
let getCurrentUser = (typeof window !== "undefined" && window.getCurrentUser) || null;
let onAuthStateChange = (typeof window !== "undefined" && window.onAuthStateChange) || null;
let showToast = (typeof window !== "undefined" && window.showToast) || null;

// Dynamically connect to services if hosted over HTTP/HTTPS
if (typeof window !== "undefined" && window.location && window.location.protocol.startsWith("http")) {
  import("../storage-service.js").then(module => {
    if (module) {
      if (typeof module.getSubmissions === "function") getSubmissions = module.getSubmissions;
      if (typeof module.createSubmission === "function") createSubmission = module.createSubmission;
      if (typeof loadStories === "function") loadStories();
    }
  }).catch(() => {});

  import("../auth.js").then(module => {
    if (module) {
      if (typeof module.getCurrentUser === "function") getCurrentUser = module.getCurrentUser;
      if (typeof module.onAuthStateChange === "function") {
        onAuthStateChange = module.onAuthStateChange;
        if (typeof setupAuthListener === "function") setupAuthListener();
      }
    }
  }).catch(() => {});

  import("../nav.js").then(module => {
    if (module && typeof module.showToast === "function") {
      showToast = module.showToast;
    }
  }).catch(() => {});
}


/* =========================================================
   FALLBACK INITIAL DEMO STORIES (ALWAYS POPULATED)
========================================================= */

const defaultEditorialStories = [
  {
    id: "lead-editorial",
    title: "From Campus Innovation Labs to Leading Multi-Million Dollar Global Programs",
    category: "Achievement",
    excerpt: "How five GIET engineering graduates built India's next-generation edge computing architecture, scaling from semester capstone projects into an internationally acclaimed venture.",
    body: "When we initially configured our first prototype in Lab 4 during our fifth semester, we faced dozens of hardware bottlenecks and compiler discrepancies. With constant mentorship from GIET faculty and our alumni mentors in Bengaluru, we iterated until the telemetry was sub-millimeter accurate. Today, our enterprise has scaled across three continents with over 45 full-time engineers, powering mission-critical infrastructure in smart cities, renewable micro-grids, and edge robotics.",
    authorName: "GIET Editorial Board",
    authorUid: "usr-editorial",
    authorRole: "Senior Tech Fellows",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1800&q=85"
  },
  {
    id: "story-101",
    title: "From Campus Hackathon to Series-A: The AgroGrid Robotics Journey",
    category: "Achievement",
    excerpt: "How four third-year roommates combined autonomous drones with micro-sensor grids to revolutionize crop yields across 800 rural districts.",
    body: "What began as a chaotic 36-hour weekend sprint during the 2023 GIET Innovation Hackathon soon turned into our life's calling. Armed with Arduino boards, open-source computer vision libraries, and invaluable guidance from our electronics professors, we created an autonomous low-power drone payload capable of detecting crop diseases with 94% accuracy. Fast forward three years, AgroGrid has deployed across 800 rural clusters, securing ₹8 Crore in institutional seed funding.",
    authorName: "Subhashree Ray",
    authorUid: "usr-101",
    authorRole: "Co-Founder & CEO, AgroGrid Robotics (Class of '22)",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "story-102",
    title: "Scaling Distributed Cloud Microservices at Microsoft",
    category: "Career",
    excerpt: "Reflections on navigating early-career software engineering, distributed systems, and the mental frameworks acquired during college.",
    body: "Stepping into Microsoft's Azure cloud infrastructure team was an exhilarating shift in scale. Operating across millions of concurrent queries per second demands exceptional technical discipline. The rigorous foundation in data structures, networking protocols, and distributed systems taught at GIET University gave me the exact resilience needed to build fault-tolerant cloud backends for enterprise customers worldwide.",
    authorName: "Aarav Das",
    authorUid: "usr-102",
    authorRole: "Software Development Engineer, Microsoft (Class of '23)",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "story-103",
    title: "10,000 Sq. Ft. High-Performance AI Compute Center Inaugurated",
    category: "Campus",
    excerpt: "University leadership and distinguished alumni formally open state-of-the-art AI cluster equipped with enterprise NVIDIA accelerators.",
    body: "GIET University has achieved yet another milestone in cutting-edge research infrastructure. Formally inaugurated in partnership with distinguished alumni leaders from Silicon Valley, the new 10,000 sq. ft. AI Compute Center houses dedicated enterprise GPU nodes, quantum computing simulators, and petabyte-scale research data arrays to support doctoral and undergraduate engineering breakthroughs.",
    authorName: "GIET Editorial Board",
    authorUid: "admin",
    authorRole: "University Gazette Staff",
    image: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "story-104",
    title: "Alumni Founded Clean-Tech Venture Secures Pre-Series A Funding",
    category: "Startups",
    excerpt: "Empowering rural agricultural micro-grids across Eastern India with modular solar inverters and battery intelligence.",
    body: "Founded by graduates of the Electrical and Mechanical engineering departments, Solaro Technologies has successfully raised ₹4.5 Crore in Pre-Series A capital. The startup's proprietary solid-state micro-inverter architecture has driven energy independence for more than 120 agricultural co-operatives in southern Odisha and eastern Andhra Pradesh.",
    authorName: "Priya Patnaik",
    authorUid: "usr-104",
    authorRole: "Co-Founder, Solaro Tech (Class of '20)",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1000&q=85"
  },
  {
    id: "story-105",
    title: "Team GIET Secures 1st Place at National Smart Mobility Hackathon",
    category: "Awards",
    excerpt: "Outperforming 240 collegiate teams nationwide with an intelligent telematics algorithm reducing battery degradation in commercial EVs.",
    body: "In a landmark achievement for student innovation, a team of four GIET undergraduates claimed first prize and a ₹5 Lakh cash commendation at the National Smart Mobility Hackathon in New Delhi. The team's machine learning model optimizes battery thermal management and charging cycles in real time.",
    authorName: "Ritwik Sahu",
    authorUid: "usr-105",
    authorRole: "Student Lead, Robotics Society (Class of '26)",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=85"
  },
  {
    id: "story-106",
    title: "Low-Power Edge Neural Network for Diagnostic Soil Analysis",
    category: "Research",
    excerpt: "Engineered by third-year ECE & AIML cohorts in collaboration with agricultural alumni mentors. Successfully tested across 12 farming cooperatives.",
    body: "Published in IEEE Access, this collaborative research paper presents an ultra-low-power TinyML architecture for instant soil nutrient estimation without cloud connectivity. Tested in high-salinity coastal terrains, the device delivers laboratory-grade soil chemistry telemetry within 90 seconds.",
    authorName: "Dr. K. R. Mohapatra & Fellows",
    authorUid: "usr-research",
    authorRole: "Research Director, Department of ECE",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=85"
  }
];

/* =========================================================
   DEMO PLACEMENT DATA
========================================================= */

const placementData = [
  {
    name: "Aarav Das",
    department: "CSE-AIML",
    branch: "Artificial Intelligence & Machine Learning",
    year: "2023–2027",
    company: "Microsoft",
    package: "₹13 LPA",
    image: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    name: "Ananya Mohanty",
    department: "CSE",
    branch: "Computer Science & Engineering",
    year: "2023–2027",
    company: "Deloitte",
    package: "₹12 LPA",
    image: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    name: "Ritwik Sahu",
    department: "CSE-AIML",
    branch: "Artificial Intelligence & Machine Learning",
    year: "2022–2026",
    company: "TCS",
    package: "₹10.5 LPA",
    image: "https://randomuser.me/api/portraits/men/45.jpg"
  },
  {
    name: "Sneha Patnaik",
    department: "IT",
    branch: "Information Technology",
    year: "2023–2027",
    company: "Accenture",
    package: "₹9 LPA",
    image: "https://randomuser.me/api/portraits/women/65.jpg"
  },
  {
    name: "Aditya Rout",
    department: "CSE",
    branch: "Computer Science & Engineering",
    year: "2022–2026",
    company: "Infosys",
    package: "₹8.5 LPA",
    image: "https://randomuser.me/api/portraits/men/67.jpg"
  },
  {
    name: "Priya Behera",
    department: "EE",
    branch: "Electrical Engineering",
    year: "2023–2027",
    company: "Wipro",
    package: "₹7.5 LPA",
    image: "https://randomuser.me/api/portraits/women/47.jpg"
  },
  {
    name: "Rahul Pradhan",
    department: "ECE",
    branch: "Electronics & Communication Engineering",
    year: "2022–2026",
    company: "Capgemini",
    package: "₹7.2 LPA",
    image: "https://randomuser.me/api/portraits/men/71.jpg"
  },
  {
    name: "Ishita Nayak",
    department: "CSE",
    branch: "Computer Science & Engineering",
    year: "2023–2027",
    company: "IBM",
    package: "₹6.8 LPA",
    image: "https://randomuser.me/api/portraits/women/49.jpg"
  }
];

/* =========================================================
   SAVED STORIES (LOCAL STORAGE)
========================================================= */

const SAVED_KEY = "alumni_saved_stories";

function getSavedStories() {
  try {
    return JSON.parse(localStorage.getItem(SAVED_KEY) || "[]");
  } catch {
    return [];
  }
}

function setSavedStories(ids) {
  localStorage.setItem(SAVED_KEY, JSON.stringify(ids));
}

/* =========================================================
   HELPERS & TOAST NOTIFICATION
========================================================= */

function notify(message) {
  if (typeof showToast === "function") {
    try {
      showToast(message);
      return;
    } catch {
      // Fallback below
    }
  }

  // Standalone toast fallback
  const existing = document.querySelector(".news-toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.className = "news-toast";
  toast.innerHTML = `<span>✨</span> <span>${escapeHtml(message)}</span>`;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = "opacity 0.4s ease, transform 0.4s ease";
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
    setTimeout(() => toast.remove(), 400);
  }, 3400);
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function readingTime(text = "") {
  const words = String(text)
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .length;
  return Math.max(1, Math.ceil(words / 220));
}

function scrollToId(id) {
  const element = document.getElementById(id);
  if (!element) return;
  element.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

/* =========================================================
   SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
========================================================= */

let scrollObserver = null;

function isElementInViewport(el) {
  const rect = el.getBoundingClientRect();
  return (
    rect.top < (window.innerHeight || document.documentElement.clientHeight) &&
    rect.bottom > 0
  );
}

function initScrollAnimations() {
  const targets = document.querySelectorAll(
    ".featured-main, .featured-small, .placement-spotlight-copy, .placement-highlight-card, " +
    ".news-card, .trending-panel, .image-story-card, .spotlight-image, .spotlight-content, " +
    ".milestone-card, .weekly-item, .gazette-cover, .video-news-card, .gallery-item, " +
    ".timeline-item, .milestone-icons button, .placement-card, .support-section > div"
  );

  if ("IntersectionObserver" in window) {
    if (!scrollObserver) {
      scrollObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add("revealed");
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.08,
          rootMargin: "0px 0px -20px 0px"
        }
      );
    }

    targets.forEach(el => {
      el.classList.add("js-scroll-reveal");
      el.classList.add("scroll-reveal");
      if (isElementInViewport(el)) {
        requestAnimationFrame(() => el.classList.add("revealed"));
      } else {
        scrollObserver.observe(el);
      }
    });
  } else {
    targets.forEach(el => el.classList.add("revealed"));
  }
}

/* =========================================================
   STORY RENDERING & FILTERING
========================================================= */

let allStories = [...defaultEditorialStories];
let activeCategory = "all";
let searchTerm = "";

function normalizeCategory(category) {
  const value = String(category || "").toLowerCase();
  if (value.includes("achievement")) return "Achievement";
  if (value.includes("career")) return "Career";
  if (value.includes("campus")) return "Campus";
  if (value.includes("startup")) return "Startups";
  if (value.includes("award")) return "Awards";
  if (value.includes("research")) return "Research";
  if (value.includes("event")) return "Events";
  if (value.includes("story") || value.includes("essay")) return "Story";
  return category || "News";
}

function categoryMatches(story, category) {
  if (category === "all") return true;

  if (category === "Saved") {
    const saved = getSavedStories();
    return saved.includes(String(story.id));
  }

  const normalized = normalizeCategory(story.category);

  const categoryMap = {
    Achievement: ["Achievement", "Awards", "Startups", "Research"],
    Career: ["Career", "Achievement"],
    Campus: ["Campus", "Announcements", "Events"],
    Events: ["Events", "Campus"],
    Startups: ["Startups", "Achievement"],
    Awards: ["Awards", "Achievement"],
    Research: ["Research", "Achievement"],
    Announcements: ["Announcements", "Campus"],
    Story: ["Story", "Achievement", "Career"]
  };

  if (!categoryMap[category]) {
    return normalized === category;
  }

  return categoryMap[category].includes(normalized);
}

function matchesSearch(story) {
  if (!searchTerm) return true;

  const content = [
    story.title,
    story.excerpt,
    story.body,
    story.category,
    story.authorName,
    story.authorRole
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return content.includes(searchTerm.toLowerCase());
}

function renderStories() {
  const grid = document.getElementById("news-grid");
  if (!grid) return;

  const filtered = allStories.filter(
    story => categoryMatches(story, activeCategory) && matchesSearch(story)
  );

  if (!filtered.length) {
    grid.innerHTML = `
      <div class="news-empty">
        <h3>No Stories Found</h3>
        <p>No published dispatches match "${escapeHtml(searchTerm || activeCategory)}". Try choosing another category or clearing your search.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(story => {
    const id = story.id || story.createdAt || Math.random().toString();
    const isSaved = getSavedStories().includes(String(id));
    const image =
      story.image ||
      story.imageUrl ||
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80";

    return `
      <article
        class="news-card"
        data-story-id="${escapeHtml(id)}"
      >
        <div class="news-card-image">
          <img
            src="${escapeHtml(image)}"
            alt="${escapeHtml(story.title || "Alumni story")}"
            loading="lazy"
          >
        </div>

        <div class="news-card-content">
          <small>
            ${escapeHtml(story.category || "NEWS")}
            ·
            ${readingTime(story.body || story.excerpt || "")} MIN READ
          </small>

          <h3>
            ${escapeHtml(story.title || "Untitled Story")}
          </h3>

          <p>
            ${escapeHtml(
              story.excerpt ||
              story.body ||
              "Read this alumni community story."
            )}
          </p>

          <button
            class="save-story ${isSaved ? "active" : ""}"
            data-save-id="${escapeHtml(id)}"
            aria-label="${isSaved ? "Remove from saved stories" : "Save story to reading list"}"
          >
            ${isSaved ? "♥ Saved" : "♡ Save Story"}
          </button>
        </div>
      </article>
    `;
  }).join("");

  // Attach card click handlers for full reader modal
  grid.querySelectorAll(".news-card").forEach(card => {
    card.addEventListener("click", event => {
      if (event.target.closest(".save-story")) {
        return;
      }
      const story = allStories.find(item => String(item.id) === String(card.dataset.storyId));
      if (story) {
        openReader(story);
      }
    });
  });

  // Attach bookmark handlers
  grid.querySelectorAll(".save-story").forEach(button => {
    button.addEventListener("click", event => {
      event.stopPropagation();
      const id = String(button.dataset.saveId);
      const saved = getSavedStories();
      const index = saved.indexOf(id);

      if (index >= 0) {
        saved.splice(index, 1);
        notify("Story removed from your saved reading list.");
      } else {
        saved.push(id);
        notify("Story saved to your personal reading list!");
      }

      setSavedStories(saved);
      renderStories();
    });
  });

  // Refresh scroll observer on newly injected cards
  if (scrollObserver) {
    grid.querySelectorAll(".news-card").forEach(el => {
      el.classList.add("js-scroll-reveal");
      el.classList.add("scroll-reveal");
      if (isElementInViewport(el)) {
        el.classList.add("revealed");
      } else {
        scrollObserver.observe(el);
      }
    });
  }
}

/* =========================================================
   LOAD STORIES (ASYNC MERGE)
========================================================= */

async function loadStories() {
  try {
    if (typeof getSubmissions === "function") {
      const result = await getSubmissions("approved");
      if (Array.isArray(result) && result.length > 0) {
        allStories = [...result, ...defaultEditorialStories];
      } else {
        allStories = [...defaultEditorialStories];
      }
    } else {
      allStories = [...defaultEditorialStories];
    }
  } catch (error) {
    console.warn("Using default editorial stories archive:", error);
    allStories = [...defaultEditorialStories];
  }

  renderStories();
}

/* =========================================================
   ACADEMIC LONG-FORM READER MODAL
========================================================= */

function openReader(story) {
  const modal = document.getElementById("reader-modal");
  const body = document.getElementById("reader-modal-body");
  if (!modal || !body) return;

  const image = story.image || story.imageUrl || "";
  const authorName = story.authorName || "GIET Alumni Contributor";
  const authorRole = story.authorRole || "Distinguished Alumni Fellow";
  const authorUid = story.authorUid || "";
  const category = story.category || "ALUMNI DISPATCH";
  const minutes = readingTime(story.body || story.excerpt || "");

  const profileLink = authorUid
    ? `<a href="profile.html?id=${encodeURIComponent(authorUid)}">View Fellow Profile →</a>`
    : `<a href="directory.html">View Alumni Directory →</a>`;

  body.innerHTML = `
    <article class="reader-content">
      <div class="reader-meta">
        ALUMNI GAZETTE · VOLUME 14, ISSUE 3 · ${escapeHtml(category.toUpperCase())} · ${minutes} MIN READ
      </div>

      <h1>
        ${escapeHtml(story.title || "Alumni Feature")}
      </h1>

      <div class="reader-actions">
        <button class="reader-share-btn" id="reader-copy-link-btn" type="button">
          🔗 Copy Article Link
        </button>
        <button class="reader-share-btn" id="reader-bookmark-btn" type="button">
          ${getSavedStories().includes(String(story.id)) ? "♥ In Reading List" : "♡ Save to Reading List"}
        </button>
      </div>

      ${
        image
          ? `<img class="reader-image" src="${escapeHtml(image)}" alt="${escapeHtml(story.title || "")}">`
          : ""
      }

      <div class="reader-body">
        <p>
          ${escapeHtml(story.excerpt || "A landmark milestone from our global alumni fraternity.")}
        </p>

        <blockquote class="reader-pullquote">
          “Every breakthrough engineered at GIET reflects an enduring commitment to collaborative problem solving and technical excellence.”
        </blockquote>

        <p>
          ${escapeHtml(
            story.body ||
            "This dispatch has been officially preserved in the GIET University Alumni Gazette Archives, representing technical innovation, entrepreneurship, and community leadership."
          )}
        </p>
      </div>

      <div class="reader-author">
        <div class="reader-author-header">
          <img
            class="reader-author-avatar"
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=180&q=80"
            alt="${escapeHtml(authorName)}"
          >
          <div>
            <strong>${escapeHtml(authorName)}</strong>
            <p>${escapeHtml(authorRole)}</p>
          </div>
        </div>
        ${profileLink}
      </div>
    </article>
  `;

  // Reader share button
  document.getElementById("reader-copy-link-btn")?.addEventListener("click", () => {
    const url = `${window.location.origin}${window.location.pathname}#${story.id}`;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url);
    }
    notify("Article link copied to clipboard!");
  });

  // Reader bookmark toggle
  document.getElementById("reader-bookmark-btn")?.addEventListener("click", () => {
    const id = String(story.id);
    const saved = getSavedStories();
    const index = saved.indexOf(id);

    if (index >= 0) {
      saved.splice(index, 1);
      notify("Story removed from saved stories.");
    } else {
      saved.push(id);
      notify("Story added to your saved reading list!");
    }

    setSavedStories(saved);
    renderStories();
    openReader(story);
  });

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeReader() {
  const modal = document.getElementById("reader-modal");
  if (!modal) return;
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

/* =========================================================
   CATEGORY FILTERS & SMOOTH NAVIGATION
========================================================= */

function setupFilters() {
  document.querySelectorAll(".filter-btn").forEach(button => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach(item => item.classList.remove("active"));
      button.classList.add("active");

      activeCategory = button.dataset.category || "all";

      renderStories();

      // Smooth scroll so the user sees the filtered feed in #latest-giet
      scrollToId("latest-giet");
    });
  });
}

/* =========================================================
   SEARCH TOOLBAR (WITH REAL-TIME DEBOUNCE)
========================================================= */

function setupSearch() {
  const input = document.getElementById("news-search-input");
  if (!input) return;

  let debounceTimer;
  input.addEventListener("input", event => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      searchTerm = event.target.value.trim();
      renderStories();
    }, 180);
  });
}

/* =========================================================
   HERO SCROLL BUTTON
========================================================= */

function setupHero() {
  document.getElementById("hero-explore-btn")?.addEventListener("click", () => {
    scrollToId("featured-stories");
  });
}

/* =========================================================
   FEATURED STORY INTERACTION
========================================================= */

function setupFeaturedStories() {
  document.querySelectorAll(".featured-main").forEach(card => {
    card.addEventListener("click", () => {
      const story = allStories.find(s => s.id === "lead-editorial") || allStories[0];
      if (story) {
        openReader(story);
      }
    });
  });

  document.querySelectorAll(".featured-small.story-jump").forEach(card => {
    card.addEventListener("click", () => {
      const target = card.dataset.featureTarget;
      if (target) {
        scrollToId(target);
      }
    });
  });
}

/* =========================================================
   STORY ACTION BUTTONS ("READ ESSAY", ETC.)
========================================================= */

function setupStoryActions() {
  document.querySelectorAll(".story-action").forEach(button => {
    button.addEventListener("click", event => {
      event.stopPropagation();
      const target = button.dataset.scrollTarget;
      if (target) {
        scrollToId(target);
      }
    });
  });
}

/* =========================================================
   TRENDING INSIGHTS LIST (ACTIVE FILTER JUMP)
========================================================= */

function setupTrendingPanel() {
  document.querySelectorAll(".trending-list li").forEach(item => {
    item.addEventListener("click", () => {
      const topic = item.dataset.searchTopic || item.querySelector("p")?.textContent?.slice(0, 20);
      const searchInput = document.getElementById("news-search-input");
      if (searchInput && topic) {
        searchInput.value = topic;
        searchTerm = topic;
        renderStories();
        scrollToId("latest-giet");
        notify(`Filtered stories matching: "${topic}"`);
      }
    });
  });
}

/* =========================================================
   PLACEMENT DIRECTORY
========================================================= */

function renderPlacements() {
  const grid = document.getElementById("placement-grid");
  if (!grid) return;

  grid.innerHTML = placementData.map(student => `
    <article class="placement-card">
      <div class="placement-card-image">
        <img
          src="${student.image}"
          alt="${escapeHtml(student.name)}"
          loading="lazy"
        >
      </div>
      <div class="placement-card-content">
        <small>${escapeHtml(student.department)}</small>
        <h3>${escapeHtml(student.name)}</h3>
        <p>🎓 ${escapeHtml(student.branch)}</p>
        <p>📅 ${escapeHtml(student.year)}</p>
        <p>🏢 ${escapeHtml(student.company)}</p>
        <span class="package-badge">
          ${escapeHtml(student.package)}
        </span>
      </div>
    </article>
  `).join("");
}

/* =========================================================
   GALLERY MODAL WITH CONTEXT BELOW IMAGE
========================================================= */

function setupGallery() {
  const modal = document.getElementById("gallery-modal");
  const image = document.getElementById("gallery-modal-image");
  const title = document.getElementById("gallery-modal-title");
  const desc = document.getElementById("gallery-modal-desc");
  const tag = document.getElementById("gallery-modal-tag");
  const date = document.getElementById("gallery-modal-date");

  document.querySelectorAll(".gallery-item").forEach(item => {
    item.addEventListener("click", () => {
      if (!modal || !image) return;

      image.src = item.dataset.galleryImage || "";
      if (title) title.textContent = item.dataset.galleryTitle || "Alumni Event Moment";
      if (desc) desc.textContent = item.dataset.galleryCaption || "A memorable chapter from the GIET University community archives.";
      if (tag) tag.textContent = item.dataset.galleryTag || "COMMUNITY";
      if (date) date.textContent = item.dataset.galleryDate || "GIET University Archives";

      modal.classList.add("open");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    });
  });

  document.getElementById("close-gallery-modal")?.addEventListener("click", closeGallery);
}

function closeGallery() {
  const modal = document.getElementById("gallery-modal");
  modal?.classList.remove("open");
  modal?.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

/* =========================================================
   VIDEO MODAL
========================================================= */

function setupVideo() {
  const modal = document.getElementById("video-modal");

  const openVideo = () => {
    modal?.classList.add("open");
    modal?.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  document.getElementById("watch-video-btn")?.addEventListener("click", openVideo);
  document.getElementById("watch-video-text")?.addEventListener("click", openVideo);

  document.getElementById("close-video-modal")?.addEventListener("click", () => {
    modal?.classList.remove("open");
    modal?.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  });
}

/* =========================================================
   DIGITAL GAZETTE MODAL
========================================================= */

function setupGazette() {
  const modal = document.getElementById("gazette-modal");

  document.getElementById("read-gazette-btn")?.addEventListener("click", () => {
    modal?.classList.add("open");
    modal?.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  });

  document.getElementById("close-gazette-modal")?.addEventListener("click", () => {
    modal?.classList.remove("open");
    modal?.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  });
}

/* =========================================================
   SPOTLIGHT & FELLOW PROFILE
========================================================= */

function setupSpotlight() {
  document.querySelector(".spotlight-button")?.addEventListener("click", () => {
    notify("Opening Anushka Palo's distinguished fellow profile...");
    setTimeout(() => {
      window.location.href = "profile.html?id=usr-anushka-palo";
    }, 600);
  });
}

/* =========================================================
   MILESTONE CATEGORY EXPLORER BUTTONS
========================================================= */

function setupMilestones() {
  document.querySelectorAll(".milestone-icons button").forEach(button => {
    button.addEventListener("click", () => {
      const milestoneTarget = button.dataset.milestone || button.querySelector("strong")?.textContent?.trim();

      const filterBtn = Array.from(document.querySelectorAll(".filter-btn")).find(
        btn => (btn.dataset.category || "").toLowerCase() === (milestoneTarget || "").toLowerCase()
      );

      if (filterBtn) {
        filterBtn.click();
      } else {
        notify(`Exploring ${milestoneTarget} alumni milestones...`);
        scrollToId("latest-giet");
      }
    });
  });
}

/* =========================================================
   DONATION & ENDOWMENT FUND
========================================================= */

function setupDonation() {
  document.getElementById("donate-btn")?.addEventListener("click", () => {
    notify("Connecting to the GIET Alumni Endowment Fund portal...");
    setTimeout(() => {
      window.location.href = "donate.html";
    }, 700);
  });
}

/* =========================================================
   SUBMISSION MODAL SUITE
========================================================= */

function setupSubmission() {
  const modal = document.getElementById("submit-story-modal");
  const openButton = document.getElementById("share-story-btn");
  const closeButton = document.getElementById("close-submit-modal");

  openButton?.addEventListener("click", () => {
    const user = typeof getCurrentUser === "function" ? getCurrentUser() : null;

    if (typeof getCurrentUser === "function" && !user) {
      notify("Contributing as Alumnus Guest. Sign in anytime to link your verified profile.");
    }

    modal?.classList.add("open");
    modal?.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  });

  closeButton?.addEventListener("click", closeSubmission);

  setupSubmissionMeta();
  setupImagePreview();
  setupSubmissionForm();
}

function closeSubmission() {
  const modal = document.getElementById("submit-story-modal");
  modal?.classList.remove("open");
  modal?.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function setupSubmissionMeta() {
  const body = document.getElementById("story-body");
  const count = document.getElementById("story-word-count");
  const time = document.getElementById("story-reading-time");

  function update() {
    if (!body || !count || !time) return;
    const words = body.value.trim().split(/\s+/).filter(Boolean).length;
    count.textContent = `${words} words`;
    time.textContent = `${Math.max(1, Math.ceil(words / 220))} min read`;
  }

  body?.addEventListener("input", update);
  update();
}

function setupImagePreview() {
  const input = document.getElementById("story-image");
  const preview = document.getElementById("story-image-preview");

  input?.addEventListener("input", () => {
    const url = input.value.trim();
    if (!url || !preview) {
      if (preview) preview.innerHTML = "";
      return;
    }

    preview.innerHTML = `
      <img
        src="${escapeHtml(url)}"
        alt="Story preview"
        onerror="this.parentElement.innerHTML='<p style=\\'color:#B91C1C;font-size:0.85rem;padding:6px;\\'>Unable to load image from this URL.</p>'"
      >
    `;
  });
}

function setupSubmissionForm() {
  const form = document.getElementById("story-submission-form");

  form?.addEventListener("submit", async event => {
    event.preventDefault();

    const user = typeof getCurrentUser === "function" ? getCurrentUser() : null;

    const title = document.getElementById("story-title")?.value.trim();
    const category = document.getElementById("story-category")?.value;
    const excerpt = document.getElementById("story-excerpt")?.value.trim();
    const image = document.getElementById("story-image")?.value.trim();
    const body = document.getElementById("story-body")?.value.trim();

    if (!title || !category || !body) {
      notify("Please fill in the title, category, and body.");
      return;
    }

    const storyData = {
      title,
      category,
      excerpt: excerpt || title,
      image: image || "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80",
      body,
      status: "pending",
      createdAt: new Date().toISOString(),
      authorUid: user?.uid || user?.id || "alumni-guest",
      authorName: user?.displayName || user?.name || "GIET Alumni Contributor",
      authorRole: "Alumni Contributor"
    };

    try {
      if (typeof createSubmission === "function") {
        await createSubmission(storyData);
      } else {
        allStories.unshift({ ...storyData, id: `story-${Date.now()}` });
        renderStories();
      }

      notify("Story successfully submitted for editorial moderation!");
      form.reset();

      const preview = document.getElementById("story-image-preview");
      if (preview) preview.innerHTML = "";

      closeSubmission();

      setTimeout(() => {
        notify("Your article has entered the University Gazette staff queue.");
      }, 700);
    } catch (error) {
      console.error("Submission failed:", error);
      notify("Unable to submit story at this time. Please try again.");
    }
  });
}

/* =========================================================
   DEFENSIVE CLEANUP OF STRAY NUMBER SPANS
========================================================= */

function purgeStrayNumbers() {
  document
    .querySelectorAll(
      ".section-heading > div > span:not(.heading-badge), .slide-number, .milestone-image > span:not(.milestone-badge)"
    )
    .forEach(el => {
      if (/^\s*\d+\s*$/.test(el.textContent)) {
        el.remove();
      }
    });
}

/* =========================================================
   MODAL OVERLAY CLICKS & ESCAPE KEY DISMISSAL
========================================================= */

function setupModalEvents() {
  document.querySelectorAll(".modal-overlay").forEach(modal => {
    modal.addEventListener("click", event => {
      if (event.target === modal) {
        modal.classList.remove("open");
        modal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
      }
    });
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      document.querySelectorAll(".modal-overlay.open").forEach(modal => {
        modal.classList.remove("open");
        modal.setAttribute("aria-hidden", "true");
      });
      document.body.style.overflow = "";
    }
  });
}

/* =========================================================
   AUTH STATE LISTENER
========================================================= */

function setupAuthListener() {
  try {
    if (typeof onAuthStateChange === "function") {
      onAuthStateChange(() => {
        loadStories();
      });
    }
  } catch (error) {
    console.warn("Auth listener unavailable:", error);
  }
}

/* =========================================================
   INITIALIZATION
========================================================= */

function init() {
  purgeStrayNumbers();
  setupFilters();
  setupSearch();
  setupHero();
  setupFeaturedStories();
  setupStoryActions();
  setupTrendingPanel();
  setupGallery();
  setupVideo();
  setupGazette();
  setupSpotlight();
  setupMilestones();
  setupDonation();
  setupSubmission();
  setupModalEvents();
  setupAuthListener();
  renderPlacements();
  loadStories();
  initScrollAnimations();

  document.getElementById("open-placement-directory")?.addEventListener("click", () => {
    scrollToId("placements");
  });

  document.getElementById("close-reader-modal")?.addEventListener("click", closeReader);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}