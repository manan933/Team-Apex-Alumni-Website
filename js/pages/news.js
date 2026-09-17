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
   CONFIG
========================================================= */

const SAVED_KEY = "alumni_saved_stories";

let allStories = [];
let currentCategory = "All";


/* =========================================================
   DEMO PLACEMENT DATA
========================================================= */

const placementStudents = [

  {
    name: "Aarav Das",
    department: "Engineering",
    branch: "CSE-AIML",
    year: "2023–2027",
    company: "Microsoft",
    package: "₹13 LPA",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=85"
  },

  {
    name: "Ananya Mohanty",
    department: "Engineering",
    branch: "CSE",
    year: "2023–2027",
    company: "Deloitte",
    package: "₹12 LPA",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=85"
  },

  {
    name: "Ritwik Sahu",
    department: "Engineering",
    branch: "CSE-AIML",
    year: "2022–2026",
    company: "TCS",
    package: "₹10.5 LPA",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=85"
  },

  {
    name: "Sneha Patnaik",
    department: "Engineering",
    branch: "IT",
    year: "2023–2027",
    company: "Accenture",
    package: "₹9 LPA",
    image:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=800&q=85"
  },

  {
    name: "Aditya Rout",
    department: "Engineering",
    branch: "CSE",
    year: "2022–2026",
    company: "Infosys",
    package: "₹8.5 LPA",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=85"
  },

  {
    name: "Priya Behera",
    department: "Engineering",
    branch: "EE",
    year: "2023–2027",
    company: "Wipro",
    package: "₹7.5 LPA",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=85"
  },

  {
    name: "Rahul Pradhan",
    department: "Engineering",
    branch: "ECE",
    year: "2022–2026",
    company: "Capgemini",
    package: "₹7.2 LPA",
    image:
      "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=800&q=85"
  },

  {
    name: "Ishita Nayak",
    department: "Engineering",
    branch: "CSE",
    year: "2023–2027",
    company: "IBM",
    package: "₹6.8 LPA",
    image:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=85"
  }

];


/* =========================================================
   DOM HELPERS
========================================================= */

const $ = (
  selector,
  parent = document
) => parent.querySelector(selector);


const $$ = (
  selector,
  parent = document
) => [...parent.querySelectorAll(selector)];


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value = "") {

  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}


/* =========================================================
   SAVED STORIES
========================================================= */

function getSavedStories() {

  try {

    return JSON.parse(
      localStorage.getItem(SAVED_KEY) || "[]"
    );

  } catch {

    return [];

  }

}


function setSavedStories(stories) {

  localStorage.setItem(
    SAVED_KEY,
    JSON.stringify(stories)
  );

}


function isSaved(id) {

  return getSavedStories().includes(id);

}


function toggleSaved(id) {

  const saved =
    getSavedStories();

  const index =
    saved.indexOf(id);


  if (index >= 0) {

    saved.splice(index, 1);

    showToast?.(
      "Story removed from saved stories."
    );

  } else {

    saved.push(id);

    showToast?.(
      "Story saved."
    );

  }


  setSavedStories(saved);

  renderStories(currentCategory);

}


/* =========================================================
   READING TIME
========================================================= */

function getReadingTime(text = "") {

  const words =
    text
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .length;


  return Math.max(
    1,
    Math.ceil(words / 200)
  );

}


/* =========================================================
   LOAD APPROVED STORIES
========================================================= */

async function loadStories() {

  try {

    allStories =
      await getSubmissions("approved");


    if (!Array.isArray(allStories)) {
      allStories = [];
    }


    renderStories("All");

    renderTrending();

  } catch (error) {

    console.error(
      "Could not load alumni stories:",
      error
    );

    allStories = [];

    renderStories("All");

    renderTrending();

  }

}


/* =========================================================
   FILTER STORIES
========================================================= */

function getFilteredStories(category) {

  if (category === "Saved") {

    const saved =
      getSavedStories();

    return allStories.filter(
      story =>
        saved.includes(story.id)
    );

  }


  if (category === "All") {

    return allStories;

  }


  return allStories.filter(
    story =>
      story.category === category
  );

}


/* =========================================================
   RENDER NEWS
========================================================= */

function renderStories(
  category = "All"
) {

  currentCategory =
    category;


  const grid =
    $("#news-grid");


  if (!grid) return;


  const stories =
    getFilteredStories(category);


  if (!stories.length) {

    grid.innerHTML = `

      <div class="empty-news-state">

        <h3>
          No stories here yet.
        </h3>

        <p>
          New stories and achievements will appear
          here after moderation.
        </p>

      </div>

    `;

    return;

  }


  grid.innerHTML =
    stories.map(
      (story, index) => {

        const id =
          story.id ||
          `story-${index}`;


        const title =
          escapeHTML(
            story.title ||
            "Untitled story"
          );


        const excerpt =
          escapeHTML(
            story.excerpt ||
            story.body ||
            ""
          );


        const categoryLabel =
          escapeHTML(
            story.category ||
            "Story"
          );


        const image =
          story.image ||
          "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=85";


        const saved =
          isSaved(id);


        return `

          <article
            class="news-card"
            data-story-id="${escapeHTML(id)}"
          >

            <img
              src="${escapeHTML(image)}"
              alt="${title}"
              loading="lazy"
            >


            <div class="news-card-body">

              <div class="news-card-category">
                ${categoryLabel}
              </div>


              <h3>
                ${title}
              </h3>


              <p>
                ${excerpt.slice(0, 200)}
                ${excerpt.length > 200 ? "…" : ""}
              </p>


              <div class="news-card-footer">

                <button
                  class="read-story-btn"
                  data-read-story="${escapeHTML(id)}"
                >
                  READ STORY →
                </button>


                <button
                  class="save-story-btn"
                  data-save-story="${escapeHTML(id)}"
                >
                  ${saved ? "★ SAVED" : "☆ SAVE"}
                </button>

              </div>

            </div>

          </article>

        `;

      }
    ).join("");


  bindStoryButtons();

}


/* =========================================================
   STORY BUTTONS
========================================================= */

function bindStoryButtons() {

  $$("[data-read-story]")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          openReader(
            button.dataset.readStory
          );

        }
      );

    });


  $$("[data-save-story]")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          toggleSaved(
            button.dataset.saveStory
          );

        }
      );

    });

}


/* =========================================================
   READER
========================================================= */

function openReader(id) {

  const story =
    allStories.find(
      item =>
        item.id === id
    );


  if (!story) return;


  const modal =
    $("#reader-modal");

  const body =
    $("#reader-modal-body");


  if (!modal || !body) return;


  const title =
    escapeHTML(
      story.title ||
      "Untitled story"
    );


  const category =
    escapeHTML(
      story.category ||
      "Story"
    );


  const author =
    escapeHTML(
      story.authorName ||
      story.author ||
      "GIET Alumni"
    );


  const storyBody =
    story.body ||
    story.content ||
    story.excerpt ||
    "";


  const readingTime =
    getReadingTime(
      storyBody
    );


  const authorImage =
    story.authorPhoto ||
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80";


  const paragraphs =
    escapeHTML(storyBody)
      .split(/\n+/)
      .filter(Boolean)
      .map(
        paragraph =>
          `<p>${paragraph}</p>`
      )
      .join("");


  body.innerHTML = `

    <div class="reader-meta">

      <span>
        ${category}
      </span>

      <span>
        ${readingTime} MIN READ
      </span>

      <span>
        GIET ALUMNI GAZETTE
      </span>

    </div>


    <h1>
      ${title}
    </h1>


    <div class="reader-body">

      ${paragraphs}

    </div>


    <div class="pull-quote">

      Stories, experiences and ideas
      that continue beyond the campus.

    </div>


    <div class="author-callout">

      <img
        src="${escapeHTML(authorImage)}"
        alt="${author}"
      >


      <div>

        <strong>
          ${author}
        </strong>

        <span>
          GIET Alumni Community
        </span>

      </div>

    </div>

  `;


  modal.classList.add("open");

  modal.setAttribute(
    "aria-hidden",
    "false"
  );

  document.body.style.overflow =
    "hidden";

}


/* =========================================================
   CLOSE READER
========================================================= */

function closeReader() {

  const modal =
    $("#reader-modal");


  if (!modal) return;


  modal.classList.remove("open");

  modal.setAttribute(
    "aria-hidden",
    "true"
  );

  document.body.style.overflow =
    "";

}


/* =========================================================
   TRENDING
========================================================= */

function renderTrending() {

  const list =
    $("#trending-list");


  if (!list) return;


  const stories =
    [...allStories]
      .sort(
        (a,b) =>
          new Date(
            b.createdAt || 0
          ) -
          new Date(
            a.createdAt || 0
          )
      )
      .slice(0,5);


  if (!stories.length) {

    list.innerHTML = `

      <li>

        <button type="button">
          New alumni stories arriving soon
        </button>

      </li>


      <li>

        <button type="button">
          Explore GIET achievements
        </button>

      </li>


      <li>

        <button type="button">
          Discover campus milestones
        </button>

      </li>

    `;

    return;

  }


  list.innerHTML =
    stories.map(
      story => `

        <li>

          <button
            type="button"
            data-trending-story="${escapeHTML(story.id)}"
          >
            ${escapeHTML(
              story.title ||
              "Untitled story"
            )}
          </button>

        </li>

      `
    ).join("");


  $$("[data-trending-story]")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          openReader(
            button.dataset.trendingStory
          );

        }
      );

    });

}


/* =========================================================
   FILTER BUTTONS
========================================================= */

function setupFilters() {

  const filters =
    $$("#news-category-filters .filter-btn");


  filters.forEach(button => {

    button.addEventListener(
      "click",
      () => {

        filters.forEach(
          item =>
            item.classList.remove(
              "active"
            )
        );


        button.classList.add(
          "active"
        );


        const category =
          button.dataset.category;


        renderStories(
          category
        );


        if (category === "Story") {

          scrollToSection(
            "stories-essays"
          );

        }

        else if (
          category === "Achievement"
        ) {

          scrollToSection(
            "breakthroughs"
          );

        }

        else if (
          category === "News"
        ) {

          scrollToSection(
            "campus-milestones"
          );

        }

        else if (
          category === "Saved"
        ) {

          scrollToSection(
            "news-grid"
          );

        }

      }
    );

  });

}


/* =========================================================
   SCROLL TO SECTION
========================================================= */

function scrollToSection(id) {

  const target =
    document.getElementById(id);


  if (!target) return;


  const offset =
    95;


  const top =
    target.getBoundingClientRect().top +
    window.scrollY -
    offset;


  window.scrollTo({

    top,

    behavior: "smooth"

  });

}


/* =========================================================
   HERO SCROLL
========================================================= */

function setupHeroScroll() {

  $$("[data-scroll-target]")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          scrollToSection(
            button.dataset.scrollTarget
          );

        }
      );

    });

}


/* =========================================================
   INFORMATION ACCORDION
========================================================= */

function setupInformationAccordion() {

  $$(".info-toggle")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          const item =
            button.closest(
              ".info-item"
            );


          if (!item) return;


          item.classList.toggle(
            "open"
          );

        }
      );

    });

}


/* =========================================================
   FEATURED SLIDER
========================================================= */

function setupSlider() {

  const slider =
    $("#featured-slider");

  const previous =
    $("#slider-prev");

  const next =
    $("#slider-next");

  const dots =
    $("#slider-dots");


  if (!slider) return;


  const slides =
    $$(".slide-card", slider);


  if (!slides.length) return;


  let current =
    0;


  function createDots() {

    if (!dots) return;


    dots.innerHTML =
      slides.map(
        (_, index) => `

          <button
            class="slider-dot ${
              index === 0
                ? "active"
                : ""
            }"
            data-slide="${index}"
            aria-label="Go to featured story ${index + 1}"
          ></button>

        `
      ).join("");


    $$(".slider-dot")
      .forEach(dot => {

        dot.addEventListener(
          "click",
          () => {

            current =
              Number(
                dot.dataset.slide
              );

            moveToSlide();

          }
        );

      });

  }


  function moveToSlide() {

    const slide =
      slides[current];


    if (!slide) return;


    slider.scrollTo({

      left:
        slide.offsetLeft,

      behavior:
        "smooth"

    });


    $$(".slider-dot")
      .forEach(
        (dot,index) => {

          dot.classList.toggle(
            "active",
            index === current
          );

        }
      );

  }


  previous?.addEventListener(
    "click",
    () => {

      current =
        current <= 0
          ? slides.length - 1
          : current - 1;

      moveToSlide();

    }
  );


  next?.addEventListener(
    "click",
    () => {

      current =
        current >=
        slides.length - 1
          ? 0
          : current + 1;

      moveToSlide();

    }
  );


  createDots();

}


/* =========================================================
   PLACEMENTS
========================================================= */

function renderPlacements() {

  const container =
    $("#placement-students");


  if (!container) return;


  container.innerHTML =
    placementStudents
      .map(
        student => `

          <article
            class="placement-student"
          >

            <img
              src="${student.image}"
              alt="${escapeHTML(student.name)}"
              loading="lazy"
            >


            <div
              class="placement-student-body"
            >

              <span>
                ${escapeHTML(student.branch)}
              </span>


              <h3>
                ${escapeHTML(student.name)}
              </h3>


              <p>
                Department:
                ${escapeHTML(student.department)}
              </p>


              <p>
                Branch:
                ${escapeHTML(student.branch)}
              </p>


              <p>
                Batch:
                ${escapeHTML(student.year)}
              </p>


              <p>
                Company:
                ${escapeHTML(student.company)}
              </p>


              <div
                class="placement-package"
              >
                ${escapeHTML(student.package)}
              </div>

            </div>

          </article>

        `
      )
      .join("");

}


/* =========================================================
   PLACEMENT OPEN / CLOSE
========================================================= */

function setupPlacements() {

  const openButton =
    $("#placements-spotlight");

  const closeButton =
    $("#close-placements");

  const placements =
    $("#placements");


  if (!openButton || !placements) {
    return;
  }


  openButton.addEventListener(
    "click",
    () => {

      placements.hidden =
        false;


      setTimeout(
        () => {

          placements.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });

        },
        50
      );

    }
  );


  closeButton?.addEventListener(
    "click",
    () => {

      placements.hidden =
        true;


      scrollToSection(
        "featured-slider"
      );

    }
  );

}


/* =========================================================
   SUBMISSION MODAL
========================================================= */

function setupSubmissionModal() {

  const openButton =
    $("#share-story-btn");

  const modal =
    $("#submit-story-modal");

  const closeButton =
    $("#close-submit-modal");

  const cancelButton =
    $("#cancel-submit-story");

  const form =
    $("#story-submission-form");


  if (!openButton || !modal) {
    return;
  }


  openButton.addEventListener(
    "click",
    () => {

      const user =
        getCurrentUser?.();


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


  function closeModal() {

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


  closeButton?.addEventListener(
    "click",
    closeModal
  );


  cancelButton?.addEventListener(
    "click",
    closeModal
  );


  modal.addEventListener(
    "click",
    event => {

      if (
        event.target === modal
      ) {

        closeModal();

      }

    }
  );


  form?.addEventListener(
    "submit",
    async event => {

      event.preventDefault();


      const user =
        getCurrentUser?.();


      if (!user) {

        showToast?.(
          "Please sign in first."
        );

        return;

      }


      const title =
        $("#story-title")
          ?.value
          .trim();


      const category =
        $("#story-category")
          ?.value;


      const excerpt =
        $("#story-excerpt")
          ?.value
          .trim();


      const image =
        $("#story-image")
          ?.value
          .trim();


      const body =
        $("#story-body")
          ?.value
          .trim();


      if (
        !title ||
        !category ||
        !excerpt ||
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

          authorUid:
            user.uid,

          authorName:
            user.displayName ||
            user.name ||
            "GIET Alumni"

        });


        showToast?.(
          "Story submitted for moderation."
        );


        form.reset();

        updateSubmissionStats();

        const preview =
          $("#story-image-preview");


        if (preview) {

          preview.hidden =
            true;

          preview.removeAttribute(
            "src"
          );

        }


        closeModal();

      }

      catch (error) {

        console.error(
          "Submission error:",
          error
        );

        showToast?.(
          "Could not submit your story. Please try again."
        );

      }

    }
  );

}


/* =========================================================
   WORD COUNT + READING TIME
========================================================= */

function updateSubmissionStats() {

  const textarea =
    $("#story-body");

  const count =
    $("#story-word-count");

  const time =
    $("#story-reading-time");


  if (!textarea) return;


  const text =
    textarea.value.trim();


  const words =
    text
      ? text
          .split(/\s+/)
          .filter(Boolean)
      : [];


  const wordCount =
    words.length;


  const readingTime =
    wordCount === 0
      ? 0
      : Math.ceil(
          wordCount / 200
        );


  if (count) {

    count.textContent =
      `${wordCount} words`;

  }


  if (time) {

    time.textContent =
      `${readingTime} min read`;

  }

}


/* =========================================================
   IMAGE PREVIEW
========================================================= */

function setupImagePreview() {

  const input =
    $("#story-image");

  const preview =
    $("#story-image-preview");


  if (!input || !preview) {
    return;
  }


  input.addEventListener(
    "input",
    () => {

      const url =
        input.value.trim();


      if (!url) {

        preview.hidden =
          true;

        preview.removeAttribute(
          "src"
        );

        return;

      }


      preview.src =
        url;

      preview.hidden =
        false;


      preview.onerror =
        () => {

          preview.hidden =
            true;

        };

    }
  );

}


/* =========================================================
   READER MODAL
========================================================= */

function setupReaderModal() {

  const closeButton =
    $("#close-reader-modal");

  const modal =
    $("#reader-modal");


  closeButton?.addEventListener(
    "click",
    closeReader
  );


  modal?.addEventListener(
    "click",
    event => {

      if (
        event.target === modal
      ) {

        closeReader();

      }

    }
  );

}


/* =========================================================
   KEYBOARD
========================================================= */

function setupKeyboard() {

  document.addEventListener(
    "keydown",
    event => {

      if (
        event.key !== "Escape"
      ) {
        return;
      }


      closeReader();


      const submitModal =
        $("#submit-story-modal");


      if (submitModal) {

        submitModal.classList.remove(
          "open"
        );

        submitModal.setAttribute(
          "aria-hidden",
          "true"
        );

      }


      document.body.style.overflow =
        "";

    }
  );

}


/* =========================================================
   AUTH
========================================================= */

function setupAuthListener() {

  try {

    onAuthStateChange?.(
      () => {

        /*
          Authentication UI is controlled
          by the shared navigation component.
        */

      }
    );

  }

  catch (error) {

    console.warn(
      "Auth listener unavailable:",
      error
    );

  }

}


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  async () => {

    setupFilters();

    setupHeroScroll();

    setupInformationAccordion();

    setupSlider();

    setupPlacements();

    renderPlacements();

    setupSubmissionModal();

    setupImagePreview();

    setupReaderModal();

    setupKeyboard();

    setupAuthListener();


    $("#story-body")
      ?.addEventListener(
        "input",
        updateSubmissionStats
      );


    await loadStories();

  }
);