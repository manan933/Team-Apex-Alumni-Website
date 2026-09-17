import { getSubmissions, createSubmission } from "../storage-service.js";
import { getCurrentUser, onAuthStateChange } from "../auth.js";
import { showToast } from "../nav.js";


/* =========================================================
   SETTINGS
========================================================= */

const SAVED_KEY = "alumni_saved_stories";

let allStories = [];
let currentCategory = "All";
let currentSlide = 0;


/* =========================================================
   DEMO PLACEMENT DATA
========================================================= */

const placementStudents = [

  {
    name: "Aarav Das",
    department: "Computer Science",
    branch: "CSE-AIML",
    year: "2023–2027",
    company: "Microsoft",
    package: "₹13 LPA",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=85"
  },

  {
    name: "Ananya Mohanty",
    department: "Computer Science",
    branch: "CSE",
    year: "2023–2027",
    company: "Deloitte",
    package: "₹12 LPA",
    image:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=800&q=85"
  },

  {
    name: "Ritwik Sahu",
    department: "Computer Science",
    branch: "CSE-AIML",
    year: "2022–2026",
    company: "TCS",
    package: "₹10.5 LPA",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=85"
  },

  {
    name: "Sneha Patnaik",
    department: "Information Technology",
    branch: "IT",
    year: "2023–2027",
    company: "Accenture",
    package: "₹9 LPA",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=85"
  },

  {
    name: "Aditya Rout",
    department: "Computer Science",
    branch: "CSE",
    year: "2022–2026",
    company: "Infosys",
    package: "₹8.5 LPA",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=85"
  },

  {
    name: "Priya Behera",
    department: "Electrical Engineering",
    branch: "EE",
    year: "2023–2027",
    company: "Wipro",
    package: "₹7.5 LPA",
    image:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=85"
  },

  {
    name: "Rahul Pradhan",
    department: "Electronics",
    branch: "ECE",
    year: "2022–2026",
    company: "Capgemini",
    package: "₹7.2 LPA",
    image:
      "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=800&q=85"
  },

  {
    name: "Ishita Nayak",
    department: "Computer Science",
    branch: "CSE",
    year: "2023–2027",
    company: "IBM",
    package: "₹6.8 LPA",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=85"
  }

];


/* =========================================================
   INIT
========================================================= */

function init() {

  setupFilters();

  setupSlider();

  setupInformationNavigation();

  setupPlacements();

  setupSubmissionModal();

  setupReaderModal();

  setupStorySubmission();

  setupAuth();

  setupDonation();

  loadStories();

}


if (document.readyState === "loading") {

  document.addEventListener(
    "DOMContentLoaded",
    init
  );

} else {

  init();

}


/* =========================================================
   LOAD STORIES
========================================================= */

async function loadStories() {

  const grid =
    document.getElementById("news-grid");

  if (!grid) return;

  grid.innerHTML = `
    <div class="empty-state">
      Loading the latest GIET stories...
    </div>
  `;

  try {

    const stories =
      await getSubmissions("approved");

    allStories =
      Array.isArray(stories)
        ? stories
        : [];

    renderStories();

    renderTrending();

  } catch (error) {

    console.error(
      "Unable to load stories:",
      error
    );

    grid.innerHTML = `
      <div class="empty-state">
        <h3>
          Stories are temporarily unavailable.
        </h3>

        <p>
          Please try again shortly.
        </p>
      </div>
    `;

  }

}


/* =========================================================
   FILTERS
========================================================= */

function setupFilters() {

  const container =
    document.getElementById(
      "news-category-filters"
    );

  if (!container) return;

  container.addEventListener(
    "click",
    (event) => {

      const button =
        event.target.closest(
          ".filter-btn"
        );

      if (!button) return;

      currentCategory =
        button.dataset.category;

      container
        .querySelectorAll(
          ".filter-btn"
        )
        .forEach((btn) => {

          btn.classList.remove(
            "active"
          );

        });

      button.classList.add(
        "active"
      );


      if (
        currentCategory ===
        "Story"
      ) {

        scrollToSection(
          "stories-essays"
        );

      }


      if (
        currentCategory ===
        "Achievement"
      ) {

        scrollToSection(
          "breakthroughs"
        );

      }


      if (
        currentCategory ===
        "News"
      ) {

        scrollToSection(
          "campus-milestones"
        );

      }


      renderStories();

    }
  );

}


/* =========================================================
   RENDER STORIES
========================================================= */

function renderStories() {

  const grid =
    document.getElementById(
      "news-grid"
    );

  if (!grid) return;

  let stories =
    [...allStories];


  if (
    currentCategory ===
    "Saved"
  ) {

    const saved =
      getSavedStories();

    stories =
      stories.filter(
        (story) =>
          saved.includes(
            getStoryId(story)
          )
      );

  }

  else if (
    currentCategory !==
    "All"
  ) {

    stories =
      stories.filter(
        (story) =>
          normalizeCategory(
            story.category
          ) === currentCategory
      );

  }


  if (!stories.length) {

    grid.innerHTML = `
      <div class="empty-state">

        <h3>
          No stories found.
        </h3>

        <p>
          ${
            currentCategory ===
            "Saved"

              ? "You have not saved any stories yet."

              : "New stories will appear here as they are approved."
          }
        </p>

      </div>
    `;

    return;

  }


  grid.innerHTML =
    stories
      .map(
        (story, index) =>
          createStoryCard(
            story,
            index
          )
      )
      .join("");


  attachStoryEvents();

}


/* =========================================================
   STORY CARD
========================================================= */

function createStoryCard(
  story,
  index
) {

  const id =
    getStoryId(story);

  const title =
    escapeHTML(
      story.title ||
      story.name ||
      "Untitled story"
    );

  const excerpt =
    escapeHTML(
      story.excerpt ||
      story.description ||
      "Read the latest story from the GIET community."
    );

  const category =
    normalizeCategory(
      story.category
    );

  const image =
    story.image ||
    story.imageUrl ||
    "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=85";

  const author =
    story.authorName ||
    story.author ||
    "GIET Alumni Community";

  const readingTime =
    calculateReadingTime(
      story.body ||
      story.content ||
      story.text ||
      ""
    );

  const saved =
    isStorySaved(id);


  if (index === 0) {

    return `

      <article
        class="news-card lead-story"
        data-story-id="${escapeAttribute(id)}"
      >

        <div>

          <img
            src="${escapeAttribute(image)}"
            alt="${title}"
            loading="lazy"
          >

        </div>


        <div class="lead-copy">

          <div class="card-meta">

            <span class="lead-badge">
              ${category}
            </span>

            <span>
              ${readingTime} min read
            </span>

          </div>


          <h3>

            <a
              href="#"
              class="story-open"
            >
              ${title}
            </a>

          </h3>


          <p>
            ${excerpt}
          </p>


          <div class="author-line">

            <span>
              ${escapeHTML(author)}
            </span>


            <button
              class="save-btn ${
                saved ? "saved" : ""
              }"
              type="button"
              data-save-id="${escapeAttribute(id)}"
              aria-label="Save story"
            >
              ${saved ? "★" : "☆"}
            </button>

          </div>

        </div>

      </article>

    `;

  }


  return `

    <article
      class="news-card"
      data-story-id="${escapeAttribute(id)}"
    >

      <img
        src="${escapeAttribute(image)}"
        alt="${title}"
        loading="lazy"
      >


      <div class="card-meta">

        <span>
          ${category}
        </span>

        <span>
          ${readingTime} min read
        </span>

      </div>


      <h3>

        <a
          href="#"
          class="story-open"
        >
          ${title}
        </a>

      </h3>


      <p>
        ${excerpt}
      </p>


      <div class="author-line">

        <span>
          ${escapeHTML(author)}
        </span>


        <button
          class="save-btn ${
            saved ? "saved" : ""
          }"
          type="button"
          data-save-id="${escapeAttribute(id)}"
          aria-label="Save story"
        >
          ${saved ? "★" : "☆"}
        </button>

      </div>

    </article>

  `;

}


/* =========================================================
   STORY EVENTS
========================================================= */

function attachStoryEvents() {

  const grid =
    document.getElementById(
      "news-grid"
    );

  if (!grid) return;


  grid
    .querySelectorAll(
      ".story-open"
    )
    .forEach((link) => {

      link.addEventListener(
        "click",
        (event) => {

          event.preventDefault();

          const card =
            link.closest(
              ".news-card"
            );

          if (!card) return;

          const story =
            allStories.find(
              (item) =>
                getStoryId(item) ===
                card.dataset.storyId
            );

          if (story) {

            openReader(story);

          }

        }
      );

    });


  grid
    .querySelectorAll(
      ".save-btn"
    )
    .forEach((button) => {

      button.addEventListener(
        "click",
        (event) => {

          event.preventDefault();

          event.stopPropagation();

          toggleSavedStory(
            button.dataset.saveId
          );

        }
      );

    });

}


/* =========================================================
   CATEGORY
========================================================= */

function normalizeCategory(
  category
) {

  const value =
    String(category || "")
      .toLowerCase();


  if (
    value.includes("story") ||
    value.includes("essay")
  ) {

    return "Story";

  }


  if (
    value.includes("achievement") ||
    value.includes("breakthrough")
  ) {

    return "Achievement";

  }


  return "News";

}


/* =========================================================
   STORY ID
========================================================= */

function getStoryId(
  story
) {

  return String(
    story.id ||
    story.uid ||
    story.submissionId ||
    `${story.title || "story"}-${story.createdAt || ""}`
  );

}


/* =========================================================
   SAVED STORIES
========================================================= */

function getSavedStories() {

  try {

    return JSON.parse(
      localStorage.getItem(
        SAVED_KEY
      ) || "[]"
    );

  } catch {

    return [];

  }

}


function saveStories(
  ids
) {

  localStorage.setItem(
    SAVED_KEY,
    JSON.stringify(ids)
  );

}


function isStorySaved(
  id
) {

  return getSavedStories()
    .includes(
      String(id)
    );

}


function toggleSavedStory(
  id
) {

  const storyId =
    String(id);

  let saved =
    getSavedStories();


  if (
    saved.includes(storyId)
  ) {

    saved =
      saved.filter(
        (item) =>
          item !== storyId
      );

    showToast?.(
      "Story removed from saved stories."
    );

  }

  else {

    saved.push(
      storyId
    );

    showToast?.(
      "Story saved."
    );

  }


  saveStories(saved);

  renderStories();

  renderTrending();

}


/* =========================================================
   TRENDING
========================================================= */

function renderTrending() {

  const list =
    document.getElementById(
      "trending-list"
    );

  if (!list) return;


  if (!allStories.length) {

    list.innerHTML = `
      <li>

        <b>01</b>

        <div>

          <a href="#stories-essays">
            New GIET stories will appear here.
          </a>

        </div>

      </li>
    `;

    return;

  }


  const trending =
    [...allStories]
      .sort(
        (a, b) => {

          const aDate =
            new Date(
              a.createdAt ||
              a.updatedAt ||
              0
            ).getTime();

          const bDate =
            new Date(
              b.createdAt ||
              b.updatedAt ||
              0
            ).getTime();

          return bDate - aDate;

        }
      )
      .slice(0, 5);


  list.innerHTML =
    trending
      .map(
        (story, index) => {

          const id =
            getStoryId(story);

          const title =
            escapeHTML(
              story.title ||
              "GIET story"
            );

          return `

            <li>

              <b>
                ${String(
                  index + 1
                ).padStart(
                  2,
                  "0"
                )}
              </b>


              <div>

                <a
                  href="#"
                  data-trending-id="${escapeAttribute(id)}"
                >
                  ${title}
                </a>


                <span class="trending-meta">
                  ${normalizeCategory(
                    story.category
                  )}
                </span>

              </div>

            </li>

          `;

        }
      )
      .join("");


  list
    .querySelectorAll(
      "[data-trending-id]"
    )
    .forEach((link) => {

      link.addEventListener(
        "click",
        (event) => {

          event.preventDefault();

          const story =
            allStories.find(
              (item) =>
                getStoryId(item) ===
                link.dataset.trendingId
            );

          if (story) {

            openReader(story);

          }

        }
      );

    });

}


/* =========================================================
   READER
========================================================= */

function setupReaderModal() {

  const close =
    document.getElementById(
      "close-reader-modal"
    );

  const modal =
    document.getElementById(
      "reader-modal"
    );


  close?.addEventListener(
    "click",
    closeReader
  );


  modal?.addEventListener(
    "click",
    (event) => {

      if (
        event.target === modal
      ) {

        closeReader();

      }

    }
  );


  document.addEventListener(
    "keydown",
    (event) => {

      if (
        event.key ===
        "Escape"
      ) {

        closeReader();

      }

    }
  );

}


function openReader(
  story
) {

  const modal =
    document.getElementById(
      "reader-modal"
    );

  const body =
    document.getElementById(
      "reader-modal-body"
    );

  if (!modal || !body)
    return;


  const title =
    escapeHTML(
      story.title ||
      "GIET Alumni Story"
    );

  const excerpt =
    escapeHTML(
      story.excerpt ||
      ""
    );

  const author =
    story.authorName ||
    story.author ||
    "GIET Alumni Community";

  const bodyText =
    story.body ||
    story.content ||
    story.text ||
    excerpt;

  const image =
    story.image ||
    story.imageUrl ||
    "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1600&q=85";

  const category =
    normalizeCategory(
      story.category
    );

  const readingTime =
    calculateReadingTime(
      bodyText
    );

  const authorImage =
    story.authorPhoto ||
    story.authorImage ||
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80";

  const authorUid =
    story.authorUid ||
    story.uid ||
    "";


  const profileLink =
    authorUid
      ? `profile.html?id=${encodeURIComponent(
          authorUid
        )}`
      : "#";


  body.innerHTML = `

    <div class="reader-content">

      <img
        class="reader-hero"
        src="${escapeAttribute(image)}"
        alt="${title}"
      >


      <div class="reader-inner">

        <div class="reader-kicker">

          <span class="lead-badge">
            ${category}
          </span>

          <span class="read-pill">
            ${readingTime} min read
          </span>

        </div>


        <h1>
          ${title}
        </h1>


        <p class="reader-deck">
          ${excerpt}
        </p>


        <div class="reader-byline">

          <img
            src="${escapeAttribute(authorImage)}"
            alt="${escapeAttribute(author)}"
          >


          <div>

            <strong>
              ${escapeHTML(author)}
            </strong>

            ${
              authorUid
                ? `
                  <br>

                  <a
                    href="${escapeAttribute(
                      profileLink
                    )}"
                  >
                    View Fellow Profile →
                  </a>
                `
                : ""
            }

          </div>

        </div>


        <div class="reader-body">

          ${formatArticleBody(
            bodyText
          )}

        </div>


        <div class="reader-share">

          <button
            class="share-btn"
            data-share="copy"
          >
            Copy link
          </button>

          <button
            class="share-btn"
            data-share="whatsapp"
          >
            WhatsApp
          </button>

          <button
            class="share-btn"
            data-share="linkedin"
          >
            LinkedIn
          </button>

          <button
            class="share-btn"
            data-share="native"
          >
            Share
          </button>

        </div>


        <div class="author-callout">

          <img
            src="${escapeAttribute(authorImage)}"
            alt="${escapeAttribute(author)}"
          >


          <div>

            <h3>
              ${escapeHTML(author)}
            </h3>

            <p>
              GIET Alumni Community
            </p>

            ${
              authorUid
                ? `
                  <a
                    href="${escapeAttribute(
                      profileLink
                    )}"
                  >
                    View Fellow Profile →
                  </a>
                `
                : ""
            }

          </div>

        </div>

      </div>

    </div>

  `;


  modal.classList.add(
    "open"
  );

  modal.setAttribute(
    "aria-hidden",
    "false"
  );

  document.body.style.overflow =
    "hidden";


  setupShareButtons(
    title
  );

}


function closeReader() {

  const modal =
    document.getElementById(
      "reader-modal"
    );

  if (!modal) return;

  modal.classList.remove(
    "open"
  );

  modal.setAttribute(
    "aria-hidden",
    "true"
  );

  document.body.style.overflow =
    "";

}


/* =========================================================
   ARTICLE BODY
========================================================= */

function formatArticleBody(
  text
) {

  if (!text) {

    return `
      <p class="dropcap">
        This story does not have
        additional content yet.
      </p>
    `;

  }


  const paragraphs =
    String(text)
      .split(/\n\s*\n/)
      .map(
        (p) =>
          p.trim()
      )
      .filter(Boolean);


  return paragraphs
    .map(
      (paragraph, index) => {

        const safe =
          escapeHTML(
            paragraph
          );


        if (
          index === 0
        ) {

          return `
            <p class="dropcap">
              ${safe}
            </p>
          `;

        }


        if (
          index === 2 &&
          paragraphs.length > 4
        ) {

          return `

            <blockquote class="pull-quote">
              “Every journey begins with
              a moment worth remembering.”
            </blockquote>

            <p>
              ${safe}
            </p>

          `;

        }


        return `
          <p>
            ${safe}
          </p>
        `;

      }
    )
    .join("");

}


/* =========================================================
   SHARE
========================================================= */

function setupShareButtons(
  title
) {

  document
    .querySelectorAll(
      "[data-share]"
    )
    .forEach((button) => {

      button.addEventListener(
        "click",
        async () => {

          const type =
            button.dataset.share;

          const url =
            window.location.href;


          if (
            type === "copy"
          ) {

            try {

              await navigator
                .clipboard
                .writeText(
                  url
                );

              showToast?.(
                "Story link copied."
              );

            } catch {

              showToast?.(
                "Unable to copy link."
              );

            }

            return;

          }


          if (
            type ===
            "whatsapp"
          ) {

            const shareUrl =
              `https://wa.me/?text=${encodeURIComponent(
                `${title} ${url}`
              )}`;

            window.open(
              shareUrl,
              "_blank",
              "noopener,noreferrer"
            );

            return;

          }


          if (
            type ===
            "linkedin"
          ) {

            const shareUrl =
              `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                url
              )}`;

            window.open(
              shareUrl,
              "_blank",
              "noopener,noreferrer"
            );

            return;

          }


          if (
            type ===
              "native" &&
            navigator.share
          ) {

            try {

              await navigator.share({
                title,
                url
              });

            } catch {

              // User closed share window.

            }

            return;

          }


          showToast?.(
            "Sharing is not available on this browser."
          );

        }
      );

    });

}


/* =========================================================
   SLIDER
========================================================= */

function setupSlider() {

  const slider =
    document.getElementById(
      "featured-slider"
    );

  const prev =
    document.getElementById(
      "slider-prev"
    );

  const next =
    document.getElementById(
      "slider-next"
    );

  const dots =
    document.getElementById(
      "slider-dots"
    );


  if (!slider) return;


  const slides =
    slider.querySelectorAll(
      ".slide-card"
    );


  if (!slides.length)
    return;


  if (dots) {

    slides.forEach(
      (_, index) => {

        const dot =
          document.createElement(
            "button"
          );

        dot.className =
          `slider-dot ${
            index === 0
              ? "active"
              : ""
          }`;

        dot.setAttribute(
          "aria-label",
          `Go to slide ${
            index + 1
          }`
        );


        dot.addEventListener(
          "click",
          () => {

            currentSlide =
              index;

            updateSlider();

          }
        );


        dots.appendChild(
          dot
        );

      }
    );

  }


  prev?.addEventListener(
    "click",
    () => {

      currentSlide =
        (
          currentSlide -
          1 +
          slides.length
        ) %
        slides.length;

      updateSlider();

    }
  );


  next?.addEventListener(
    "click",
    () => {

      currentSlide =
        (
          currentSlide +
          1
        ) %
        slides.length;

      updateSlider();

    }
  );


  function updateSlider() {

    slider.scrollTo({

      left:
        slider.clientWidth *
        currentSlide,

      behavior:
        "smooth"

    });


    dots
      ?.querySelectorAll(
        ".slider-dot"
      )
      .forEach(
        (dot, index) => {

          dot.classList.toggle(
            "active",
            index ===
              currentSlide
          );

        }
      );

  }


  let autoSlide =
    setInterval(
      () => {

        currentSlide =
          (
            currentSlide +
            1
          ) %
          slides.length;

        updateSlider();

      },
      6500
    );


  slider.addEventListener(
    "mouseenter",
    () => {

      clearInterval(
        autoSlide
      );

    }
  );


  slider.addEventListener(
    "mouseleave",
    () => {

      autoSlide =
        setInterval(
          () => {

            currentSlide =
              (
                currentSlide +
                1
              ) %
              slides.length;

            updateSlider();

          },
          6500
        );

    }
  );

}


/* =========================================================
   INFORMATION NAVIGATION
========================================================= */

function setupInformationNavigation() {

  document
    .querySelectorAll(
      "[data-scroll]"
    )
    .forEach((button) => {

      button.addEventListener(
        "click",
        () => {

          const target =
            button.dataset.scroll;

          scrollToSection(
            target
          );

        }
      );

    });


  document
    .querySelectorAll(
      ".info-card-button"
    )
    .forEach((button) => {

      button.addEventListener(
        "click",
        () => {

          showToast?.(
            "More GIET breakthrough stories will appear here."
          );

        }
      );

    });

}


/* =========================================================
   PLACEMENTS
========================================================= */

function setupPlacements() {

  const spotlight =
    document.getElementById(
      "placements-spotlight"
    );

  const page =
    document.getElementById(
      "placements"
    );

  const close =
    document.getElementById(
      "close-placements"
    );


  if (
    !spotlight ||
    !page
  ) {

    return;

  }


  renderPlacements();


  spotlight.addEventListener(
    "click",
    openPlacements
  );


  close?.addEventListener(
    "click",
    closePlacements
  );

}


function openPlacements() {

  const page =
    document.getElementById(
      "placements"
    );

  if (!page) return;


  page.hidden =
    false;


  page.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });


  history.replaceState(
    null,
    "",
    "#placements"
  );

}


function closePlacements() {

  const page =
    document.getElementById(
      "placements"
    );

  if (!page) return;


  page.hidden =
    true;


  history.replaceState(
    null,
    "",
    window.location.pathname +
    window.location.search
  );


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}


function renderPlacements() {

  const container =
    document.getElementById(
      "placement-students"
    );

  if (!container)
    return;


  container.innerHTML =
    placementStudents
      .map(
        (student) => `

          <article
            class="student-placement-card"
          >

            <img
              src="${escapeAttribute(
                student.image
              )}"
              alt="${escapeAttribute(
                student.name
              )}"
              loading="lazy"
            >


            <div class="student-info">

              <h3>
                ${escapeHTML(
                  student.name
                )}
              </h3>


              <p>
                ${escapeHTML(
                  student.department
                )}
              </p>


              <p>
                ${escapeHTML(
                  student.branch
                )}

                ·

                ${escapeHTML(
                  student.year
                )}
              </p>


              <div class="student-company">

                <div>

                  <span>
                    Company
                  </span>

                  <strong>
                    ${escapeHTML(
                      student.company
                    )}
                  </strong>

                </div>


                <div>

                  <span>
                    Package
                  </span>

                  <strong class="package">
                    ${escapeHTML(
                      student.package
                    )}
                  </strong>

                </div>

              </div>

            </div>

          </article>

        `
      )
      .join("");

}


/* =========================================================
   SUBMISSION MODAL
========================================================= */

function setupSubmissionModal() {

  const open =
    document.getElementById(
      "share-story-btn"
    );

  const modal =
    document.getElementById(
      "submit-story-modal"
    );

  const close =
    document.getElementById(
      "close-submit-modal"
    );


  if (
    !open ||
    !modal
  ) return;


  open.addEventListener(
    "click",
    () => {

      const user =
        getCurrentUser();


      if (!user) {

        showToast?.(
          "Please sign in before sharing your story."
        );

        return;

      }


      modal.classList.add(
        "open"
      );

      modal.setAttribute(
        "aria-hidden",
        "false"
      );

      document.body.style.overflow =
        "hidden";

    }
  );


  close?.addEventListener(
    "click",
    closeSubmissionModal
  );


  modal.addEventListener(
    "click",
    (event) => {

      if (
        event.target === modal
      ) {

        closeSubmissionModal();

      }

    }
  );

}


function closeSubmissionModal() {

  const modal =
    document.getElementById(
      "submit-story-modal"
    );

  if (!modal)
    return;


  modal.classList.remove(
    "open"
  );

  modal.setAttribute(
    "aria-hidden",
    "true"
  );

  document.body.style.overflow =
    "";

}


/* =========================================================
   STORY SUBMISSION
========================================================= */

function setupStorySubmission() {

  const form =
    document.getElementById(
      "story-submission-form"
    );

  if (!form) return;


  const body =
    document.getElementById(
      "story-body"
    );

  const wordCount =
    document.getElementById(
      "story-word-count"
    );

  const readingTime =
    document.getElementById(
      "story-reading-time"
    );

  const imageInput =
    document.getElementById(
      "story-image"
    );

  const imagePreview =
    document.getElementById(
      "story-image-preview"
    );


  body?.addEventListener(
    "input",
    () => {

      const words =
        countWords(
          body.value.trim()
        );

      const minutes =
        calculateReadingTime(
          body.value
        );


      if (wordCount) {

        wordCount.textContent =
          `${words} ${
            words === 1
              ? "word"
              : "words"
          }`;

      }


      if (readingTime) {

        readingTime.textContent =
          `${minutes} min read`;

      }

    }
  );


  imageInput?.addEventListener(
    "input",
    () => {

      const url =
        imageInput.value.trim();


      if (!url) {

        imagePreview.hidden =
          true;

        imagePreview.removeAttribute(
          "src"
        );

        return;

      }


      imagePreview.src =
        url;

      imagePreview.hidden =
        false;


      imagePreview.onerror =
        () => {

          imagePreview.hidden =
            true;

        };

    }
  );


  form.addEventListener(
    "submit",
    async (event) => {

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
        )?.value.trim();


      const category =
        document.getElementById(
          "story-category"
        )?.value;


      const excerpt =
        document.getElementById(
          "story-excerpt"
        )?.value.trim();


      const image =
        document.getElementById(
          "story-image"
        )?.value.trim();


      const storyBody =
        document.getElementById(
          "story-body"
        )?.value.trim();


      if (
        !title ||
        !category ||
        !excerpt ||
        !storyBody
      ) {

        showToast?.(
          "Please complete all required fields."
        );

        return;

      }


      const submitButton =
        form.querySelector(
          'button[type="submit"]'
        );


      if (submitButton) {

        submitButton.disabled =
          true;

        submitButton.textContent =
          "Submitting...";

      }


      try {

        await createSubmission({

          title,

          category,

          excerpt,

          image,

          body:
            storyBody,

          authorUid:
            user.uid ||
            user.id ||
            null,

          authorName:
            user.displayName ||
            user.name ||
            user.email ||
            "GIET Alumni"

        });


        form.reset();


        if (imagePreview) {

          imagePreview.hidden =
            true;

          imagePreview.removeAttribute(
            "src"
          );

        }


        if (wordCount) {

          wordCount.textContent =
            "0 words";

        }


        if (readingTime) {

          readingTime.textContent =
            "0 min read";

        }


        closeSubmissionModal();


        showToast?.(
          "Story submitted to the moderation queue."
        );


      } catch (error) {

        console.error(
          "Submission failed:",
          error
        );


        showToast?.(
          "Unable to submit your story. Please try again."
        );


      } finally {

        if (submitButton) {

          submitButton.disabled =
            false;

          submitButton.textContent =
            "Submit Story";

        }

      }

    }
  );

}


/* =========================================================
   AUTH
========================================================= */

function setupAuth() {

  try {

    onAuthStateChange(
      () => {}
    );

  } catch (error) {

    console.warn(
      "Auth listener unavailable:",
      error
    );

  }

}


/* =========================================================
   DONATION
========================================================= */

function setupDonation() {

  const button =
    document.querySelector(
      ".support-button"
    );

  if (!button)
    return;


  button.addEventListener(
    "click",
    () => {

      showToast?.(
        "Opening GIET support and donation page."
      );

    }
  );

}


/* =========================================================
   SCROLL
========================================================= */

function scrollToSection(
  id
) {

  const section =
    document.getElementById(
      id
    );

  if (!section)
    return;


  section.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });

}


/* =========================================================
   WORD COUNT
========================================================= */

function countWords(
  text
) {

  if (!text)
    return 0;


  return text
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .length;

}


/* =========================================================
   READING TIME
========================================================= */

function calculateReadingTime(
  text
) {

  const words =
    countWords(text);


  if (!words)
    return 0;


  return Math.max(
    1,
    Math.ceil(
      words / 200
    )
  );

}


/* =========================================================
   SECURITY
========================================================= */

function escapeHTML(
  value
) {

  return String(
    value ?? ""
  )
    .replaceAll(
      "&",
      "&amp;"
    )
    .replaceAll(
      "<",
      "&lt;"
    )
    .replaceAll(
      ">",
      "&gt;"
    )
    .replaceAll(
      '"',
      "&quot;"
    )
    .replaceAll(
      "'",
      "&#039;"
    );

}


function escapeAttribute(
  value
) {

  return escapeHTML(
    value
  );

}


/* =========================================================
   PLACEMENT HASH
========================================================= */

if (
  window.location.hash ===
  "#placements"
) {

  setTimeout(
    () => {

      const page =
        document.getElementById(
          "placements"
        );

      if (page) {

        page.hidden =
          false;

      }

    },
    300
  );

}


/* =========================================================
   STORAGE SYNC
========================================================= */

window.addEventListener(
  "storage",
  (event) => {

    if (
      event.key ===
      SAVED_KEY
    ) {

      renderStories();

      renderTrending();

    }

  }
);