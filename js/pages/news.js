import {
  getSubmissions,
  createSubmission
} from "../storage-service.js";

import {
  getCurrentUser,
  onAuthStateChange
} from "../auth.js";

import {
  showToast
} from "../nav.js";


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
   SAVED STORIES
========================================================= */

const SAVED_KEY = "alumni_saved_stories";

function getSavedStories() {

  try {
    return JSON.parse(
      localStorage.getItem(SAVED_KEY) || "[]"
    );

  } catch {
    return [];
  }

}


function setSavedStories(ids) {

  localStorage.setItem(
    SAVED_KEY,
    JSON.stringify(ids)
  );

}


/* =========================================================
   HELPERS
========================================================= */

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

  return Math.max(
    1,
    Math.ceil(words / 220)
  );

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
   STORY RENDERING
========================================================= */

let allStories = [];
let activeCategory = "all";
let searchTerm = "";


function normalizeCategory(category) {

  const value = String(category || "")
    .toLowerCase();

  if (value.includes("achievement")) {
    return "Achievement";
  }

  if (value.includes("story")) {
    return "Story";
  }

  if (value.includes("news")) {
    return "News";
  }

  return category || "News";

}


function categoryMatches(story, category) {

  if (category === "all") {
    return true;
  }

  if (category === "Saved") {

    const saved = getSavedStories();

    return saved.includes(
      story.id
    );

  }

  const normalized = normalizeCategory(
    story.category
  );

  const categoryMap = {

    Achievement: [
      "Achievement",
      "Awards",
      "Startups",
      "Research",
      "Career"
    ],

    Career: [
      "Career",
      "Achievement"
    ],

    Campus: [
      "Campus",
      "News"
    ],

    Events: [
      "Events",
      "News"
    ],

    Startups: [
      "Startups",
      "Achievement"
    ],

    Awards: [
      "Awards",
      "Achievement"
    ],

    Research: [
      "Research",
      "Achievement"
    ],

    Announcements: [
      "Announcements",
      "News"
    ]

  };

  if (!categoryMap[category]) {
    return normalized === category;
  }

  return categoryMap[category].includes(
    normalized
  );

}


function matchesSearch(story) {

  if (!searchTerm) {
    return true;
  }

  const content = [

    story.title,
    story.excerpt,
    story.body,
    story.category,
    story.authorName,
    story.authorUid

  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return content.includes(
    searchTerm.toLowerCase()
  );

}


function renderStories() {

  const grid = document.getElementById(
    "news-grid"
  );

  if (!grid) return;

  const filtered = allStories.filter(
    story =>
      categoryMatches(
        story,
        activeCategory
      ) &&
      matchesSearch(story)
  );


  if (!filtered.length) {

    grid.innerHTML = `

      <div class="news-empty">

        <h3>
          No stories found
        </h3>

        <p>
          Try another category or search term.
        </p>

      </div>

    `;

    return;
  }


  grid.innerHTML = filtered.map(
    story => {

      const id = story.id || story.createdAt;

      const saved = getSavedStories()
        .includes(id);

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
              class="save-story"
              data-save-id="${escapeHtml(id)}"
            >
              ${saved ? "♥ Saved" : "♡ Save Story"}
            </button>

          </div>

        </article>

      `;

    }
  ).join("");


  grid.querySelectorAll(
    ".news-card"
  ).forEach(card => {

    card.addEventListener(
      "click",
      event => {

        if (
          event.target.closest(
            ".save-story"
          )
        ) {
          return;
        }

        const story = allStories.find(
          item =>
            String(item.id) ===
            String(card.dataset.storyId)
        );

        if (story) {
          openReader(story);
        }

      }
    );

  });


  grid.querySelectorAll(
    ".save-story"
  ).forEach(button => {

    button.addEventListener(
      "click",
      event => {

        event.stopPropagation();

        const id =
          button.dataset.saveId;

        const saved =
          getSavedStories();

        const index =
          saved.indexOf(id);

        if (index >= 0) {

          saved.splice(
            index,
            1
          );

        } else {

          saved.push(id);

        }

        setSavedStories(saved);

        renderStories();

        showToast?.(
          index >= 0
            ? "Story removed from saved stories."
            : "Story saved."
        );

      }
    );

  });

}


/* =========================================================
   LOAD STORIES
========================================================= */

async function loadStories() {

  try {

    const result =
      await getSubmissions("approved");

    allStories = Array.isArray(result)
      ? result
      : [];

    renderStories();

  } catch (error) {

    console.error(
      "Unable to load stories:",
      error
    );

    allStories = [];

    renderStories();

  }

}


/* =========================================================
   READER
========================================================= */

function openReader(story) {

  const modal =
    document.getElementById(
      "reader-modal"
    );

  const body =
    document.getElementById(
      "reader-modal-body"
    );

  if (!modal || !body) return;


  const image =
    story.image ||
    story.imageUrl ||
    "";


  const authorName =
    story.authorName ||
    "GIET Alumni Community";


  const authorUid =
    story.authorUid;


  const profileLink =
    authorUid
      ? `
        <a href="profile.html?id=${encodeURIComponent(authorUid)}">
          View Fellow Profile →
        </a>
      `
      : "";


  body.innerHTML = `

    <article class="reader-content">

      <div class="reader-meta">
        ALUMNI GAZETTE ·
        ${escapeHtml(story.category || "STORY")}
        ·
        ${readingTime(story.body || "")} MIN READ
      </div>


      <h1>
        ${escapeHtml(
          story.title || "Alumni Story"
        )}
      </h1>


      ${
        image
          ? `
            <img
              class="reader-image"
              src="${escapeHtml(image)}"
              alt="${escapeHtml(story.title || "")}"
            >
          `
          : ""
      }


      <div class="reader-body">

        <p>
          ${escapeHtml(
            story.excerpt || ""
          )}
        </p>


        <blockquote class="reader-pullquote">

          Stories, ideas and experiences
          that continue to shape the GIET community.

        </blockquote>


        <p>
          ${escapeHtml(
            story.body ||
            "This story is part of the GIET Alumni Gazette."
          )}
        </p>

      </div>


      <div class="reader-author">

        <strong>
          ${escapeHtml(authorName)}
        </strong>

        <p>
          GIET Alumni Community
        </p>

        ${profileLink}

      </div>

    </article>

  `;


  modal.classList.add("open");
  modal.setAttribute(
    "aria-hidden",
    "false"
  );

  document.body.style.overflow = "hidden";

}


function closeReader() {

  const modal =
    document.getElementById(
      "reader-modal"
    );

  if (!modal) return;

  modal.classList.remove("open");

  modal.setAttribute(
    "aria-hidden",
    "true"
  );

  document.body.style.overflow = "";

}


/* =========================================================
   CATEGORY FILTERS
========================================================= */

function setupFilters() {

  document
    .querySelectorAll(
      ".filter-btn"
    )
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          document
            .querySelectorAll(
              ".filter-btn"
            )
            .forEach(
              item =>
                item.classList.remove(
                  "active"
                )
            );

          button.classList.add(
            "active"
          );


          activeCategory =
            button.dataset.category ||
            "all";


          if (
            activeCategory ===
            "Achievement"
          ) {

            scrollToId(
              "breakthroughs"
            );

          } else if (
            activeCategory ===
            "Career"
          ) {

            scrollToId(
              "where-now"
            );

          } else if (
            activeCategory ===
            "Campus"
          ) {

            scrollToId(
              "campus-milestones"
            );

          } else if (
            activeCategory ===
            "Events"
          ) {

            scrollToId(
              "latest-giet"
            );

          } else if (
            activeCategory ===
            "Startups"
          ) {

            scrollToId(
              "breakthroughs"
            );

          } else if (
            activeCategory ===
            "Awards"
          ) {

            scrollToId(
              "breakthroughs"
            );

          } else if (
            activeCategory ===
            "Research"
          ) {

            scrollToId(
              "breakthroughs"
            );

          } else if (
            activeCategory ===
            "Announcements"
          ) {

            scrollToId(
              "latest-giet"
            );

          } else if (
            activeCategory ===
            "Saved"
          ) {

            scrollToId(
              "latest-giet"
            );

          } else if (
            activeCategory ===
            "Story"
          ) {

            scrollToId(
              "stories-essays"
            );

          } else {

            scrollToId(
              "latest-giet"
            );

          }


          renderStories();

        }
      );

    });

}


/* =========================================================
   SEARCH
========================================================= */

function setupSearch() {

  const input =
    document.getElementById(
      "news-search-input"
    );

  if (!input) return;

  input.addEventListener(
    "input",
    event => {

      searchTerm =
        event.target.value.trim();

      renderStories();

    }
  );

}


/* =========================================================
   HERO
========================================================= */

function setupHero() {

  document
    .getElementById(
      "hero-explore-btn"
    )
    ?.addEventListener(
      "click",
      () => {
        scrollToId(
          "featured-stories"
        );
      }
    );

}


/* =========================================================
   FEATURED STORY JUMPS
========================================================= */

function setupFeaturedStories() {

  document
    .querySelectorAll(
      ".story-jump"
    )
    .forEach(card => {

      card.addEventListener(
        "click",
        () => {

          const target =
            card.dataset.featureTarget;

          if (target) {
            scrollToId(target);
          }

        }
      );

    });

}


/* =========================================================
   STORY ACTION BUTTONS
========================================================= */

function setupStoryActions() {

  document
    .querySelectorAll(
      ".story-action"
    )
    .forEach(button => {

      button.addEventListener(
        "click",
        event => {

          event.stopPropagation();

          const target =
            button.dataset.scrollTarget;

          if (target) {
            scrollToId(target);
          }

        }
      );

    });

}


/* =========================================================
   PLACEMENT DIRECTORY
========================================================= */

function renderPlacements() {

  const grid =
    document.getElementById(
      "placement-grid"
    );

  if (!grid) return;


  grid.innerHTML =
    placementData.map(
      student => `

        <article class="placement-card">

          <div class="placement-card-image">

            <img
              src="${student.image}"
              alt="${escapeHtml(student.name)}"
              loading="lazy"
            >

          </div>


          <div class="placement-card-content">

            <small>
              ${escapeHtml(student.department)}
            </small>

            <h3>
              ${escapeHtml(student.name)}
            </h3>

            <p>
              🎓 ${escapeHtml(student.branch)}
            </p>

            <p>
              📅 ${escapeHtml(student.year)}
            </p>

            <p>
              🏢 ${escapeHtml(student.company)}
            </p>

            <span class="package-badge">
              ${escapeHtml(student.package)}
            </span>

          </div>

        </article>

      `
    ).join("");

}


function openPlacements() {

  document.body.classList.add(
    "placements-open"
  );

  renderPlacements();

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

  history.pushState(
    { placements: true },
    "",
    "#placements"
  );

}


function closePlacements() {

  document.body.classList.remove(
    "placements-open"
  );

  if (
    location.hash ===
    "#placements"
  ) {

    history.pushState(
      "",
      document.title,
      window.location.pathname +
      window.location.search
    );

  }

}


/* =========================================================
   GALLERY
========================================================= */

function setupGallery() {

  const modal =
    document.getElementById(
      "gallery-modal"
    );

  const image =
    document.getElementById(
      "gallery-modal-image"
    );

  document
    .querySelectorAll(
      ".gallery-item"
    )
    .forEach(item => {

      item.addEventListener(
        "click",
        () => {

          if (!modal || !image) return;

          image.src =
            item.dataset.galleryImage;

          modal.classList.add(
            "open"
          );

          document.body.style.overflow =
            "hidden";

        }
      );

    });


  document
    .getElementById(
      "close-gallery-modal"
    )
    ?.addEventListener(
      "click",
      closeGallery
    );


  modal?.addEventListener(
    "click",
    event => {

      if (
        event.target === modal
      ) {
        closeGallery();
      }

    }
  );

}


function closeGallery() {

  const modal =
    document.getElementById(
      "gallery-modal"
    );

  modal?.classList.remove(
    "open"
  );

  document.body.style.overflow =
    "";

}


/* =========================================================
   VIDEO
========================================================= */

function setupVideo() {

  const modal =
    document.getElementById(
      "video-modal"
    );


  const openVideo = () => {

    modal?.classList.add(
      "open"
    );

    document.body.style.overflow =
      "hidden";

  };


  document
    .getElementById(
      "watch-video-btn"
    )
    ?.addEventListener(
      "click",
      openVideo
    );


  document
    .getElementById(
      "watch-video-text"
    )
    ?.addEventListener(
      "click",
      openVideo
    );


  document
    .getElementById(
      "close-video-modal"
    )
    ?.addEventListener(
      "click",
      () => {

        modal?.classList.remove(
          "open"
        );

        document.body.style.overflow =
          "";

      }
    );

}


/* =========================================================
   GAZETTE
========================================================= */

function setupGazette() {

  const modal =
    document.getElementById(
      "gazette-modal"
    );


  document
    .getElementById(
      "read-gazette-btn"
    )
    ?.addEventListener(
      "click",
      () => {

        modal?.classList.add(
          "open"
        );

        document.body.style.overflow =
          "hidden";

      }
    );


  document
    .getElementById(
      "close-gazette-modal"
    )
    ?.addEventListener(
      "click",
      () => {

        modal?.classList.remove(
          "open"
        );

        document.body.style.overflow =
          "";

      }
    );

}


/* =========================================================
   SPOTLIGHT
========================================================= */

function setupSpotlight() {

  document
    .querySelector(
      ".spotlight-button"
    )
    ?.addEventListener(
      "click",
      () => {

        showToast?.(
          "Fellow profile opening soon."
        );

      }
    );

}


/* =========================================================
   MILESTONE ICONS
========================================================= */

function setupMilestones() {

  document
    .querySelectorAll(
      ".milestone-icons button"
    )
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          const title =
            button
              .querySelector(
                "strong"
              )
              ?.textContent
              ?.trim();

          if (title) {

            showToast?.(
              `${title} updates will appear here.`
            );

          }

        }
      );

    });

}


/* =========================================================
   DONATION
========================================================= */

function setupDonation() {

  document
    .getElementById(
      "donate-btn"
    )
    ?.addEventListener(
      "click",
      () => {

        showToast?.(
          "Donation section connected. Add your official donation URL here."
        );

      }
    );

}


/* =========================================================
   SUBMISSION MODAL
========================================================= */

function setupSubmission() {

  const modal =
    document.getElementById(
      "submit-story-modal"
    );


  const openButton =
    document.getElementById(
      "share-story-btn"
    );


  const closeButton =
    document.getElementById(
      "close-submit-modal"
    );


  openButton?.addEventListener(
    "click",
    () => {

      const user =
        getCurrentUser();

      if (!user) {

        showToast?.(
          "Please sign in to share your story."
        );

        return;
      }

      modal?.classList.add(
        "open"
      );

      document.body.style.overflow =
        "hidden";

    }
  );


  closeButton?.addEventListener(
    "click",
    closeSubmission
  );


  modal?.addEventListener(
    "click",
    event => {

      if (
        event.target === modal
      ) {
        closeSubmission();
      }

    }
  );


  setupSubmissionMeta();

  setupImagePreview();

  setupSubmissionForm();

}


function closeSubmission() {

  const modal =
    document.getElementById(
      "submit-story-modal"
    );

  modal?.classList.remove(
    "open"
  );

  document.body.style.overflow =
    "";

}


/* =========================================================
   SUBMISSION WORD COUNT
========================================================= */

function setupSubmissionMeta() {

  const body =
    document.getElementById(
      "story-body"
    );

  const count =
    document.getElementById(
      "story-word-count"
    );

  const time =
    document.getElementById(
      "story-reading-time"
    );


  function update() {

    const words =
      body.value
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .length;


    count.textContent =
      `${words} words`;

    time.textContent =
      `${Math.max(
        1,
        Math.ceil(words / 220)
      )} min read`;

  }


  body?.addEventListener(
    "input",
    update
  );

  update();

}


/* =========================================================
   IMAGE PREVIEW
========================================================= */

function setupImagePreview() {

  const input =
    document.getElementById(
      "story-image"
    );

  const preview =
    document.getElementById(
      "story-image-preview"
    );


  input?.addEventListener(
    "input",
    () => {

      const url =
        input.value.trim();

      if (!url) {

        preview.innerHTML =
          "";

        return;

      }


      preview.innerHTML = `

        <img
          src="${escapeHtml(url)}"
          alt="Story preview"
          onerror="this.parentElement.innerHTML='<p>Unable to load image preview.</p>'"
        >

      `;

    }
  );

}


/* =========================================================
   SUBMISSION FORM
========================================================= */

function setupSubmissionForm() {

  const form =
    document.getElementById(
      "story-submission-form"
    );


  form?.addEventListener(
    "submit",
    async event => {

      event.preventDefault();


      const user =
        getCurrentUser();


      if (!user) {

        showToast?.(
          "Please sign in first."
        );

        return;

      }


      const title =
        document.getElementById(
          "story-title"
        ).value.trim();


      const category =
        document.getElementById(
          "story-category"
        ).value;


      const excerpt =
        document.getElementById(
          "story-excerpt"
        ).value.trim();


      const image =
        document.getElementById(
          "story-image"
        ).value.trim();


      const body =
        document.getElementById(
          "story-body"
        ).value.trim();


      if (
        !title ||
        !category ||
        !body
      ) {

        showToast?.(
          "Please complete all required fields."
        );

        return;

      }


      try {

        await createSubmission({

          title,
          category,
          excerpt,
          image,
          body,
          status: "pending",

          authorUid:
            user.uid ||
            user.id,

          authorName:
            user.displayName ||
            user.name ||
            "GIET Alumni"

        });


        showToast?.(
          "Story submitted for moderation."
        );


        form.reset();


        document.getElementById(
          "story-image-preview"
        ).innerHTML = "";


        closeSubmission();


        setTimeout(
          () => {

            showToast?.(
              "Your story is now waiting in the moderation queue."
            );

          },
          500
        );


      } catch (error) {

        console.error(
          error
        );

        showToast?.(
          "Unable to submit story. Please try again."
        );

      }

    }
  );

}


/* =========================================================
   MODAL BACKDROP + ESCAPE
========================================================= */

function setupModalEvents() {

  document
    .querySelectorAll(
      ".modal-overlay"
    )
    .forEach(modal => {

      modal.addEventListener(
        "click",
        event => {

          if (
            event.target !== modal
          ) {
            return;
          }

          modal.classList.remove(
            "open"
          );

          document.body.style.overflow =
            "";

        }
      );

    });


  document.addEventListener(
    "keydown",
    event => {

      if (
        event.key !==
        "Escape"
      ) {
        return;
      }

      closeReader();

      closeGallery();

      closePlacements();

      document
        .querySelectorAll(
          ".modal-overlay.open"
        )
        .forEach(
          modal =>
            modal.classList.remove(
              "open"
            )
        );

      document.body.style.overflow =
        "";

    }
  );

}


/* =========================================================
   AUTH STATE
========================================================= */

function setupAuthListener() {

  try {

    onAuthStateChange(
      () => {

        loadStories();

      }
    );

  } catch (error) {

    console.warn(
      "Auth listener unavailable:",
      error
    );

  }

}


/* =========================================================
   INITIALIZATION
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    setupFilters();

    setupSearch();

    setupHero();

    setupFeaturedStories();

    setupStoryActions();

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


    document
      .getElementById(
        "open-placement-directory"
      )
      ?.addEventListener(
        "click",
        openPlacements
      );


    document
      .getElementById(
        "close-placement-directory"
      )
      ?.addEventListener(
        "click",
        closePlacements
      );


    document
      .getElementById(
        "close-reader-modal"
      )
      ?.addEventListener(
        "click",
        closeReader
      );


    loadStories();

  }
);


/* =========================================================
   BROWSER BACK BUTTON
========================================================= */

window.addEventListener(
  "popstate",
  () => {

    if (
      location.hash !==
      "#placements"
    ) {

      document.body.classList.remove(
        "placements-open"
      );

    }

  }
);