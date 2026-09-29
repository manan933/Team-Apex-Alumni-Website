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
   FEATURED STORIES ARCHIVE (FOR HERO & FEATURED BANNER)
========================================================= */

const featuredEditorialArchive = [
  {
    id: "lead-editorial",
    title: "GIET University Conferred with National Education Excellence Award",
    category: "Achievement",
    excerpt: "University leadership formally recognized by Hon'ble Union Minister Shri Ramdas Athawale for pioneering higher education, pedagogy, and academic innovation.",
    body: "In a landmark recognition of academic distinction, GIET University was honored with the National Education Excellence Award, presented personally by the Hon'ble Union Minister of State, Government of India, Shri Ramdas Athawale. The commendation celebrates the university's continuous leadership in engineering pedagogy, world-class laboratory infrastructure, and its track record of nurturing globally competitive graduates.",
    authorName: "GIET Editorial Board",
    authorUid: "usr-editorial",
    authorRole: "University Media Directorate",
    image: "images/news/education-excellence-award.png"
  },
  {
    id: "story-101",
    title: "From Campus Hackathon to Series-A: The Smart IoT & Clean Campus Venture",
    category: "Achievement",
    excerpt: "How a team of GIET engineering students engineered an intelligent Smart Bin telemetry system and route optimization engine for sustainable urban campuses.",
    body: "What began as an intensive sprint during the GIET Campus Innovation Hackathon transformed into an enterprise-grade IoT deployment. The student team engineered a network of smart sensor-enabled waste bins integrated with automated route optimization algorithms to streamline campus waste management in real-time. The project received top commendations from faculty mentors and industry jury members, opening pathways for commercial pilot trials across regional municipal clusters.",
    authorName: "Student Innovation Team",
    authorUid: "usr-101",
    authorRole: "IoT & Smart Systems Cohort (Class of '25)",
    image: "images/news/smart-bin-hackathon.jpg"
  },
  {
    id: "story-103",
    title: "GIET University Welcomes 2025 Graduating Batch to 3rd Annual Convocation",
    category: "Campus",
    excerpt: "Graduating engineers, researchers, and alumni gather at Gunupur campus for the convocation ceremony on 16 October 2026.",
    body: "GIET University warmly welcomes the graduating cohort to its 3rd Annual Convocation ceremony scheduled for 16 October 2026 at the Gunupur campus. The ceremony will celebrate the academic triumphs of undergraduate and postgraduate scholars across all engineering disciplines, with degrees conferred by university chancellors and global alumni guest speakers. Registration for graduating students closes on 30 September 2026.",
    authorName: "Office of Academic Affairs",
    authorUid: "admin",
    authorRole: "Convocation Secretariat",
    image: "images/news/annual-convocation-2026.jpg"
  },
  {
    id: "essay-isro-space",
    title: "Pioneering the Cosmos: From Gunupur Laboratories to Space Launch Technologies",
    category: "Research",
    excerpt: "GIET engineering faculty and student researchers showcase space exploration milestones, scale rocket telemetry, and ISRO Chandrayaan-3 mission modules at the university technological pavilion.",
    body: "In a remarkable showcase of aerospace enthusiasm and applied physics, GIET University hosted a landmark Space Science & Rocketry Exposition celebrating India's historic achievements with ISRO. Featuring intricately engineered scale replicas of the Polar Satellite Launch Vehicle (PSLV), Small Satellite Launch Vehicle (SSLV), and Chandrayaan-3 lunar trajectory modules, the pavilion served as an interactive masterclass for undergraduate researchers. Faculty members and visiting space scientists led symposium sessions on advanced propulsion dynamics, orbital mechanics, and satellite telemetry, inspiring student engineers to target research frontiers in aerospace and telecommunications.",
    authorName: "Aerospace & Applied Physics Research Circle",
    authorUid: "usr-space-research",
    authorRole: "School of Engineering & Space Sciences",
    image: "images/news/giet-isro-space-exhibition.png"
  },
  {
    id: "essay-van-mahotsav",
    title: "Van Mahotsav 2026: Nurturing a Greener Campus for Future Generations",
    category: "Campus",
    excerpt: "University leadership, student volunteers, and regional forestry dignitaries unite under 'Plant a Tree, Protect the Future', planting over 500 saplings across Gunupur green corridors.",
    body: "GIET University Gunupur commemorated Van Mahotsav 2026 with a mass tree plantation drive under the theme 'Plant a Tree, Protect the Future'. Joined by regional forest conservators, police dignitaries, NSS volunteers, and undergraduate cohorts, the initiative saw the plantation of over 500 indigenous fruit-bearing and shade trees across the sprawling green campus. The drive reflects GIET's enduring commitment to environmental sustainability, climate resilience, and eco-conscious campus stewardship.",
    authorName: "Green Campus Initiative & NSS Directorate",
    authorUid: "usr-green-campus",
    authorRole: "Environmental Sustainability Committee",
    image: "images/news/giet-van-mahotsav-plantation.png"
  },
  {
    id: "essay-yoga-day",
    title: "Harmony of Mind & Body: International Yoga Day 2026 at Gunupur",
    category: "Events",
    excerpt: "Under the global theme 'Yoga for One Earth, One Health', hundreds of students, faculty, and alumni gather on campus to embrace mindfulness, endurance, and balanced living.",
    body: "As the morning sun crested the scenic Gunupur hills, hundreds of students, faculty deans, and alumni gathered at the GIET University Basketball Arena to celebrate International Yoga Day 2026. Aligned with the global charter 'Yoga for One Earth, One Health', the mass practice was guided by certified yoga masters conducting asanas, pranayama, and guided meditation. The event reaffirmed GIET's holistic philosophy that academic and technical brilliance thrive best when anchored in physical wellness and mental clarity.",
    authorName: "GIET Wellness & Athletics Council",
    authorUid: "usr-wellness",
    authorRole: "Directorate of Student Wellbeing",
    image: "images/news/giet-international-yoga-day.png"
  }
];

/* =========================================================
   AUTHENTIC EDITORIAL STORIES (LATEST FROM GIET - 100% REAL IMAGES)
========================================================= */

const defaultEditorialStories = [
  {
    id: "story-giet-tejas",
    title: 'GIET University Hosts DPIIT & Startup Odisha "TEJAS" Entrepreneurial Summit',
    category: "Startups",
    excerpt: "Transforming entrepreneurial journeys across Rayagada district in collaboration with AIC-GIETU Foundation, STPI, IIT Bhubaneswar, and PhonePe.",
    body: "In a landmark entrepreneurial milestone for southern Odisha, GIET University Gunupur hosted the high-impact TEJAS summit (Transforming Entrepreneurial Journeys Across States & Districts) organized under DPIIT (#startupindia) and Startup Odisha. Convening startup founders, angel investors, regional innovators, and ecosystem leaders from STPI, IIT Bhubaneswar, and PhonePe, the summit positioned GIET University's AIC-GIETU Foundation incubator at the forefront of grassroots venture creation and student entrepreneurship across Rayagada district.",
    authorName: "AIC-GIETU Incubation Center",
    authorUid: "usr-tejas",
    authorRole: "Directorate of Innovation & Entrepreneurship",
    image: "images/news/giet-tejas-startup-odisha.png"
  },
  {
    id: "story-giet-learnathon",
    title: "GIET University Concludes National Hackathon LEARNATHON 5.0",
    category: "Achievement",
    excerpt: "Student innovators sprint across four intensive days under 'Learn · Build · Hack' to develop AI, cloud, and IoT solutions.",
    body: "The grand finale of LEARNATHON 5.0 was celebrated at GIET University Gunupur following a rigorous four-day innovation hackathon. Organized in collaboration with the Incubatee Innovation Foundation and Quality Thought Future Skill Foundation, student teams pitched industry-vetted prototypes across artificial intelligence, healthcare tech, and smart mobility. Distinguished enterprise architects and alumni tech mentors praised the high standard of technical execution from participating cohorts.",
    authorName: "Student Innovation Council",
    authorUid: "usr-learnathon",
    authorRole: "GIET Learnathon Core Committee",
    image: "images/news/giet-learnathon-hackathon.png"
  },
  {
    id: "story-giet-pharmacist",
    title: "School of Pharmacy Observes World Pharmacist Day 2026: Mission Swastha Bharat",
    category: "Research",
    excerpt: "Faculty and researchers lead symposium on 'Empowering Pharmacists for Healthier Futures' and combating Antimicrobial Resistance (AMR) with FIP.",
    body: "In association with the International Pharmaceutical Federation (FIP), the School of Pharmacy at GIET University Gunupur commemorated World Pharmacist Day 2026. The symposium centered on the critical mission 'Swastha Bharat: Combating Antimicrobial Resistance (AMR)' and celebrated the indispensable role of pharmaceutical scientists in advancing clinical trials, novel drug formulations, and public health education.",
    authorName: "School of Pharmacy Faculty Board",
    authorUid: "usr-pharmacist",
    authorRole: "Department of Pharmaceutical Sciences",
    image: "images/news/giet-world-pharmacist-day.png"
  },
  {
    id: "story-giet-nss",
    title: "GIET NSS Bureau Spearheads Mega Blood Donation Camp on NSS Day",
    category: "Campus",
    excerpt: "Over 300 units of blood collected as students, faculty, and alumni unite under 'Share Life, Donate Blood' at the campus MBA Auditorium.",
    body: "Marking NSS Day on 24 September 2026, the National Service Scheme (NSS) unit of GIET University organized an extensive Mega Blood Donation Camp at the campus MBA Auditorium. Carrying the noble banner 'Share Life, Donate Blood', the camp witnessed enthusiastic participation from undergraduate scholars, university leadership, and alumni donors, demonstrating GIET's steadfast commitment to civic duty and regional humanitarian care.",
    authorName: "Office of Student Affairs & NSS",
    authorUid: "usr-nss",
    authorRole: "GIET NSS Volunteer Brigade",
    image: "images/news/giet-nss-blood-donation-camp.png"
  },
  {
    id: "story-giet-sports",
    title: "GIET University Celebrates National Sports Day to Champion Athletic Discipline",
    category: "Events",
    excerpt: "Honoring the legacy of Major Dhyan Chand with intra-university sports tournaments and wellness initiatives under 'Sports Build Character'.",
    body: "GIET University Gunupur commemorated National Sports Day with high energy across its outdoor stadiums and sports complexes, echoing the vision that 'Sports build character, discipline, and a healthier tomorrow.' Faculty deans and athletic directors inaugurated tournaments in basketball, cricket, badminton, and track events, paying tribute to hockey legend Major Dhyan Chand while reaffirming the university's dedication to holistic student wellness.",
    authorName: "GIET Sports Council",
    authorUid: "usr-sports",
    authorRole: "Directorate of Physical Education & Athletics",
    image: "images/news/giet-national-sports-day.png"
  }
];

/* =========================================================
   DEMO PLACEMENT DATA
========================================================= */

const placementData = [
  {
    name: "Mr. Pramod Kumar Bag",
    department: "Alumni Leadership",
    branch: "Manager (Process Safety Coordinator)",
    year: "Batch: 2015–2019",
    company: "ArcelorMittal Nippon Steel India",
    package: "Executive Role",
    image: "images/news/pramod-kumar-bag-placement.png"
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
const STORIES_PER_PAGE = 4;
let currentStoriesPage = 1;

function findStoryById(id) {
  return (
    allStories.find(s => String(s.id) === String(id)) ||
    featuredEditorialArchive.find(s => String(s.id) === String(id)) ||
    null
  );
}

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

  const paginationNav = document.getElementById("news-pagination");

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
    if (paginationNav) {
      paginationNav.innerHTML = "";
      paginationNav.style.display = "none";
    }
    return;
  }

  // Calculate pagination boundaries (4 stories max per page)
  const totalPages = Math.ceil(filtered.length / STORIES_PER_PAGE) || 1;
  if (currentStoriesPage > totalPages) {
    currentStoriesPage = totalPages;
  }
  if (currentStoriesPage < 1) {
    currentStoriesPage = 1;
  }

  const startIndex = (currentStoriesPage - 1) * STORIES_PER_PAGE;
  const paginatedStories = filtered.slice(startIndex, startIndex + STORIES_PER_PAGE);

  grid.innerHTML = paginatedStories.map(story => {
    const id = story.id || story.createdAt || Math.random().toString();
    const isSaved = getSavedStories().includes(String(id));
    const image =
      story.image ||
      story.imageUrl ||
      "images/news/giet-tejas-startup-odisha.png";

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

  renderNewsPagination(filtered.length, totalPages);

  // Attach card click handlers for full reader modal
  grid.querySelectorAll(".news-card").forEach(card => {
    card.addEventListener("click", event => {
      if (event.target.closest(".save-story")) {
        return;
      }
      const story = findStoryById(card.dataset.storyId);
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
   PAGINATION CONTROLS RENDERER (MAX 4 STORIES PER PAGE)
========================================================= */

function renderNewsPagination(totalCount, totalPages) {
  const paginationNav = document.getElementById("news-pagination");
  if (!paginationNav) return;

  if (totalPages <= 1) {
    paginationNav.innerHTML = "";
    paginationNav.style.display = "none";
    return;
  }

  paginationNav.style.display = "flex";

  let pagesHtml = "";

  // Previous Button
  pagesHtml += `
    <button 
      class="pagination-btn pagination-prev" 
      ${currentStoriesPage === 1 ? "disabled" : ""} 
      data-page="${currentStoriesPage - 1}"
      aria-label="Previous page of stories"
    >
      ← Prev
    </button>
  `;

  // Numbered Page Buttons
  for (let i = 1; i <= totalPages; i++) {
    pagesHtml += `
      <button 
        class="pagination-btn pagination-num ${i === currentStoriesPage ? "active" : ""}" 
        data-page="${i}"
        aria-label="Go to page ${i}"
        ${i === currentStoriesPage ? 'aria-current="page"' : ""}
      >
        ${i}
      </button>
    `;
  }

  // Next Button
  pagesHtml += `
    <button 
      class="pagination-btn pagination-next" 
      ${currentStoriesPage === totalPages ? "disabled" : ""} 
      data-page="${currentStoriesPage + 1}"
      aria-label="Next page of stories"
    >
      Next →
    </button>
  `;

  // Info Summary
  pagesHtml += `
    <span class="pagination-info">
      Page ${currentStoriesPage} of ${totalPages} (${totalCount} stories)
    </span>
  `;

  paginationNav.innerHTML = pagesHtml;

  // Add click listeners to pagination buttons
  paginationNav.querySelectorAll(".pagination-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const page = parseInt(btn.dataset.page, 10);
      if (!isNaN(page) && page >= 1 && page <= totalPages && page !== currentStoriesPage) {
        currentStoriesPage = page;
        renderStories();

        const section = document.getElementById("latest-giet");
        if (section) {
          const navOffset = 90;
          const elementPosition = section.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({
            top: elementPosition - navOffset,
            behavior: "smooth"
          });
        }
      }
    });
  });
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
            src="${escapeHtml(story.authorAvatar || "giet-logo.webp")}"
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
      currentStoriesPage = 1;

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
      currentStoriesPage = 1;
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
      const story = findStoryById("lead-editorial") || allStories[0];
      if (story) {
        openReader(story);
      }
    });
  });

  document.querySelectorAll(".featured-small.story-jump").forEach(card => {
    card.addEventListener("click", () => {
      const storyId = card.dataset.storyId;
      if (storyId) {
        const story = findStoryById(storyId);
        if (story) {
          openReader(story);
          return;
        }
      }
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
      const storyId = button.dataset.storyId;
      if (storyId) {
        const story = findStoryById(storyId);
        if (story) {
          openReader(story);
          return;
        }
      }
      const target = button.dataset.scrollTarget;
      if (target) {
        scrollToId(target);
      }
    });
  });

  document.querySelectorAll(".image-story-card").forEach(card => {
    card.addEventListener("click", event => {
      if (event.target.closest(".story-action")) return;
      const storyId = card.dataset.storyId;
      if (storyId) {
        const story = findStoryById(storyId);
        if (story) {
          openReader(story);
        }
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
        currentStoriesPage = 1;
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
      image: image || "images/news/giet-tejas-startup-odisha.png",
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
        currentStoriesPage = 1;
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