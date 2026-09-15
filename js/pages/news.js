/**
 * ============================================================
 * GIET UNIVERSITY ALUMNI GAZETTE
 * NEWS PAGE
 *
 * Pure Vanilla JavaScript ES Modules
 * ============================================================
 */

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


/* ============================================================
   GLOBAL STATE
   ============================================================ */

let approvedStories = [];

let activeCategory = "All";

let currentUser = null;

let showingSavedStories = false;


/* ============================================================
   CONSTANTS
   ============================================================ */

const SAVED_KEY =
  "alumni_saved_stories";


const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=85";


const CATEGORY_LABELS = {

  All:
    "All",

  Story:
    "Stories & Essays",

  Achievement:
    "Breakthroughs",

  News:
    "Campus Milestones"

};


/* ============================================================
   PAGE START
   ============================================================ */

document.addEventListener(
  "DOMContentLoaded",
  async () => {

    /*
     * Existing authentication contract
     */
    onAuthStateChange(
      (user) => {

        currentUser = user;

        updateSubmitButtonState();

      }
    );


    /*
     * Load approved stories
     */
    try {

      approvedStories =
        await getSubmissions(
          "approved"
        );

    } catch (error) {

      console.error(
        "Unable to load stories:",
        error
      );

      approvedStories = [];

      showToast(
        "Unable to load the latest stories.",
        "danger"
      );

    }


    initCategoryFilters();

    renderStories();

    initReaderModal();

    initSubmissionModal();

    initSavedStories();

    initNewsSlider();

    initDonorPopup();

    initNewsletter();

    /*
     * Footer / direct submission hash
     */
    if (
      window.location.hash ===
      "#submit"
    ) {

      handleOpenSubmitModal();

    }

  }
);


/* ============================================================
   CATEGORY FILTERS
   ============================================================ */

function initCategoryFilters() {

  const container =
    document.getElementById(
      "news-category-filters"
    );

  if (!container) return;


  const categories = [
    "All",
    "Story",
    "Achievement",
    "News"
  ];


  container.innerHTML =
    categories
      .map(
        (category) => {

          return `
            <button
              type="button"
              class="category-pill ${
                category === activeCategory
                  ? "active"
                  : ""
              }"
              data-cat="${category}"
            >
              ${escapeHTML(
                CATEGORY_LABELS[
                  category
                ]
              )}
            </button>
          `;

        }
      )
      .join("");


  container
    .querySelectorAll(
      ".category-pill"
    )
    .forEach(
      (pill) => {

        pill.addEventListener(
          "click",
          () => {

            showingSavedStories =
              false;

            const savedButton =
              document.getElementById(
                "saved-stories-btn"
              );

            savedButton?.classList.remove(
              "active"
            );


            container
              .querySelectorAll(
                ".category-pill"
              )
              .forEach(
                (item) => {

                  item.classList.remove(
                    "active"
                  );

                }
              );


            pill.classList.add(
              "active"
            );


            activeCategory =
              pill.getAttribute(
                "data-cat"
              );


            renderStories();

          }
        );

      }
    );

}


/* ============================================================
   RENDER STORIES
   ============================================================ */

function renderStories() {

  const grid =
    document.getElementById(
      "news-grid"
    );

  if (!grid) return;


  let list =
    [...approvedStories];


  /*
   * Category filter
   */
  if (
    activeCategory !==
    "All"
  ) {

    list =
      list.filter(
        (story) =>
          story.category ===
          activeCategory
      );

  }


  /*
   * Saved stories filter
   */
  if (showingSavedStories) {

    const savedIds =
      getSavedStories();

    list =
      list.filter(
        (story) =>
          savedIds.includes(
            story.id
          )
      );

  }


  /*
   * Empty state
   */
  if (!list.length) {

    grid.innerHTML = `

      <div
        class="empty-state"
        style="grid-column: 1 / -1;"
      >

        <div class="empty-icon">
          📰
        </div>

        <h3 class="empty-title">

          ${
            showingSavedStories
              ? "No Saved Stories Yet"
              : "No Stories in This Category"
          }

        </h3>

        <p class="empty-text">

          ${
            showingSavedStories
              ? "Open a story and tap the bookmark icon to save it here."
              : "Check back soon or submit your own GIET alumni story."
          }

        </p>

      </div>

    `;

    return;

  }


  grid.innerHTML =
    list
      .map(
        (story) =>
          createStoryCard(
            story
          )
      )
      .join("");


  /*
   * Card events
   */

  grid
    .querySelectorAll(
      ".news-card"
    )
    .forEach(
      (card) => {

        card.addEventListener(
          "click",
          () => {

            const id =
              card.getAttribute(
                "data-id"
              );

            openReaderModal(id);

          }
        );

      }
    );


  /*
   * Save buttons
   */

  grid
    .querySelectorAll(
      ".news-save-btn"
    )
    .forEach(
      (button) => {

        button.addEventListener(
          "click",
          (event) => {

            event.stopPropagation();

            const id =
              button.getAttribute(
                "data-id"
              );

            toggleSavedStory(id);

          }
        );

      }
    );

}


/* ============================================================
   CREATE STORY CARD
   ============================================================ */

function createStoryCard(
  story
) {

  const saved =
    isStorySaved(
      story.id
    );


  const image =
    story.imageURL ||
    DEFAULT_IMAGE;


  const title =
    escapeHTML(
      story.title ||
      "Untitled Story"
    );


  const excerpt =
    escapeHTML(
      story.excerpt ||
      getExcerpt(
        story.body || ""
      )
    );


  const author =
    escapeHTML(
      story.authorName ||
      "GIET Alumni"
    );


  const date =
    formatDate(
      story.createdAt
    );


  const category =
    CATEGORY_LABELS[
      story.category
    ] ||
    story.category ||
    "Story";


  return `

    <article
      class="news-card"
      data-id="${escapeAttribute(
        story.id
      )}"
    >

      <div class="news-cover-wrap">

        <img
          src="${escapeAttribute(
            image
          )}"
          alt="${escapeAttribute(
            title
          )}"
          class="news-cover-img"
          loading="lazy"
        />


        <span class="news-category-badge">
          ${escapeHTML(
            category
          )}
        </span>


        <button
          type="button"
          class="news-save-btn ${
            saved
              ? "saved"
              : ""
          }"
          data-id="${escapeAttribute(
            story.id
          )}"
          aria-label="${
            saved
              ? "Remove saved story"
              : "Save story"
          }"
        >
          ${
            saved
              ? "♥"
              : "♡"
          }
        </button>

      </div>


      <div class="news-card-body">

        <div class="news-card-date">
          ${escapeHTML(
            date
          )}
        </div>


        <h3 class="news-title">
          ${title}
        </h3>


        <p class="news-excerpt">
          ${excerpt}
        </p>


        <div class="news-author">

          <span>
            By
          </span>

          <span class="author-name">
            ${author}
          </span>

        </div>

      </div>

    </article>

  `;

}


/* ============================================================
   READER MODAL
   ============================================================ */

function initReaderModal() {

  const modal =
    document.getElementById(
      "reader-modal"
    );

  const closeButton =
    document.getElementById(
      "close-reader-modal"
    );


  closeButton?.addEventListener(
    "click",
    () => {

      closeReaderModal();

    }
  );


  modal?.addEventListener(
    "click",
    (event) => {

      if (
        event.target ===
        modal
      ) {

        closeReaderModal();

      }

    }
  );


  document.addEventListener(
    "keydown",
    (event) => {

      if (
        event.key ===
        "Escape" &&
        modal?.classList.contains(
          "open"
        )
      ) {

        closeReaderModal();

      }

    }
  );

}


/* ============================================================
   OPEN READER
   ============================================================ */

function openReaderModal(
  id
) {

  const story =
    approvedStories.find(
      (item) =>
        String(item.id) ===
        String(id)
    );


  if (!story) return;


  const modal =
    document.getElementById(
      "reader-modal"
    );

  const body =
    document.getElementById(
      "reader-modal-body"
    );


  if (
    !modal ||
    !body
  ) {
    return;
  }


  const image =
    story.imageURL ||
    DEFAULT_IMAGE;


  const title =
    escapeHTML(
      story.title ||
      "Untitled Story"
    );


  const authorName =
    escapeHTML(
      story.authorName ||
      "GIET Alumni"
    );


  const category =
    CATEGORY_LABELS[
      story.category
    ] ||
    story.category ||
    "Story";


  const articleBody =
    formatArticleBody(
      story.body ||
      story.excerpt ||
      ""
    );


  const minutes =
    calculateReadingTime(
      story.body ||
      ""
    );


  const authorPhoto =
    story.authorPhotoURL ||
    story.authorImage ||
    story.avatarURL ||
    DEFAULT_IMAGE;


  const gradYear =
    story.gradYear ||
    story.graduationYear ||
    "";


  const company =
    story.company ||
    "";


  const jobTitle =
    story.jobTitle ||
    story.titleAtCompany ||
    "";


  const authorUid =
    story.authorUid ||
    "";


  const profileLink =
    authorUid
      ? `profile.html?id=${encodeURIComponent(
          authorUid
        )}`
      : "directory.html";


  body.innerHTML = `

    <img
      src="${escapeAttribute(
        image
      )}"
      alt="${escapeAttribute(
        title
      )}"
      class="story-reader-cover"
    />


    <div class="story-reader-content">


      <div class="reader-meta">

        <span class="reader-category">
          ${escapeHTML(
            category
          )}
        </span>

        <span class="issue-badge">
          GIET GAZETTE · VOL. 02
        </span>

        <span class="reading-pill">
          ${minutes} min read
        </span>

        <span class="reader-date">
          ${escapeHTML(
            formatDate(
              story.createdAt
            )
          )}
        </span>

      </div>


      <h2 class="reader-title">
        ${title}
      </h2>


      <div class="reader-byline">

        Published by

        ${
          authorUid
            ? `
              <a
                href="${profileLink}"
              >
                ${authorName}
              </a>
            `
            : `
              <strong>
                ${authorName}
              </strong>
            `
        }

      </div>


      <div class="story-reader-body">

        ${articleBody}

      </div>


      <blockquote class="pull-quote">

        “The GIET community continues to grow
        through the people, ideas and work of
        its alumni.”

      </blockquote>


      <div class="reader-share">

        <span class="reader-share-label">
          Share
        </span>


        <button
          type="button"
          class="share-btn"
          data-share="copy"
        >
          Copy Link
        </button>


        <button
          type="button"
          class="share-btn"
          data-share="linkedin"
        >
          LinkedIn
        </button>


        <button
          type="button"
          class="share-btn"
          data-share="native"
        >
          Share
        </button>

      </div>


      <div class="author-callout">

        <img
          src="${escapeAttribute(
            authorPhoto
          )}"
          alt="${escapeAttribute(
            authorName
          )}"
        />


        <div class="author-callout-content">

          <div class="author-callout-label">
            About the Author
          </div>


          <h3 class="author-callout-name">
            ${authorName}
          </h3>


          <div class="author-callout-meta">

            ${
              gradYear
                ? `Class of ${escapeHTML(
                    String(
                      gradYear
                    )
                  )}`
                : "GIET Alumni"
            }

            ${
              company
                ? ` · ${escapeHTML(
                    company
                  )}`
                : ""
            }

            ${
              jobTitle
                ? ` · ${escapeHTML(
                    jobTitle
                  )}`
                : ""
            }

          </div>

        </div>


        <a
          href="${profileLink}"
          class="author-profile-link"
        >
          View Fellow Profile →
        </a>

      </div>


    </div>

  `;


  /*
   * Share buttons
   */

  body
    .querySelectorAll(
      "[data-share]"
    )
    .forEach(
      (button) => {

        button.addEventListener(
          "click",
          () => {

            handleShare(
              button.dataset.share,
              story
            );

          }
        );

      }
    );


  modal.classList.add(
    "open"
  );

  modal.setAttribute(
    "aria-hidden",
    "false"
  );

}


/* ============================================================
   CLOSE READER
   ============================================================ */

function closeReaderModal() {

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

}


/* ============================================================
   ARTICLE BODY
   ============================================================ */

function formatArticleBody(
  text
) {

  const clean =
    String(text || "")
      .trim();


  if (!clean) {

    return `
      <p>
        This story does not have a published narrative yet.
      </p>
    `;

  }


  const paragraphs =
    clean
      .split(
        /\n\s*\n|\r\n\s*\r\n/
      )
      .map(
        (paragraph) =>
          paragraph.trim()
      )
      .filter(Boolean);


  return paragraphs
    .map(
      (paragraph) => `

        <p>
          ${escapeHTML(
            paragraph
          ).replace(
            /\n/g,
            "<br>"
          )}
        </p>

      `
    )
    .join("");

}


/* ============================================================
   SUBMISSION MODAL
   ============================================================ */

function initSubmissionModal() {

  const trigger =
    document.getElementById(
      "share-story-btn"
    );

  const modal =
    document.getElementById(
      "submit-story-modal"
    );

  const closeButton =
    document.getElementById(
      "close-submit-modal"
    );

  const cancelButton =
    document.getElementById(
      "cancel-submit-story"
    );

  const form =
    document.getElementById(
      "story-submission-form"
    );


  trigger?.addEventListener(
    "click",
    handleOpenSubmitModal
  );


  closeButton?.addEventListener(
    "click",
    closeSubmitModal
  );


  cancelButton?.addEventListener(
    "click",
    closeSubmitModal
  );


  modal?.addEventListener(
    "click",
    (event) => {

      if (
        event.target ===
        modal
      ) {

        closeSubmitModal();

      }

    }
  );


  document.addEventListener(
    "keydown",
    (event) => {

      if (
        event.key ===
        "Escape" &&
        modal?.classList.contains(
          "open"
        )
      ) {

        closeSubmitModal();

      }

    }
  );


  /*
   * Live word count
   */

  const bodyInput =
    document.getElementById(
      "story-body"
    );


  bodyInput?.addEventListener(
    "input",
    updateSubmissionStats
  );


  /*
   * Title count
   */

  const titleInput =
    document.getElementById(
      "story-title"
    );


  titleInput?.addEventListener(
    "input",
    () => {

      updateCharacterCount(
        titleInput,
        "title-count",
        150
      );

    }
  );


  /*
   * Excerpt count
   */

  const excerptInput =
    document.getElementById(
      "story-excerpt"
    );


  excerptInput?.addEventListener(
    "input",
    () => {

      updateCharacterCount(
        excerptInput,
        "excerpt-count",
        250
      );

    }
  );


  /*
   * Image preview
   */

  const imageInput =
    document.getElementById(
      "story-image"
    );


  imageInput?.addEventListener(
    "input",
    updateImagePreview
  );


  /*
   * Form submission
   */

  form?.addEventListener(
    "submit",
    submitStory
  );

}


/* ============================================================
   OPEN SUBMISSION MODAL
   ============================================================ */

function handleOpenSubmitModal() {

  /*
   * Use existing auth contract
   */
  const user =
    getCurrentUser();


  if (!user) {

    showToast(
      "Please log in to submit a story to the GIET alumni editorial feed.",
      "info"
    );


    setTimeout(
      () => {

        window.location.href =
          "login.html";

      },
      900
    );


    return;

  }


  currentUser =
    user;


  const modal =
    document.getElementById(
      "submit-story-modal"
    );


  modal?.classList.add(
    "open"
  );


  modal?.setAttribute(
    "aria-hidden",
    "false"
  );

}


/* ============================================================
   CLOSE SUBMISSION MODAL
   ============================================================ */

function closeSubmitModal() {

  const modal =
    document.getElementById(
      "submit-story-modal"
    );


  modal?.classList.remove(
    "open"
  );


  modal?.setAttribute(
    "aria-hidden",
    "true"
  );

}


/* ============================================================
   SUBMIT STORY
   ============================================================ */

async function submitStory(
  event
) {

  event.preventDefault();


  /*
   * Always check current user again
   */
  const user =
    getCurrentUser();


  if (!user) {

    showToast(
      "Please log in before submitting a story.",
      "info"
    );

    return;

  }


  const form =
    event.currentTarget;


  const title =
    document
      .getElementById(
        "story-title"
      )
      .value
      .trim();


  const category =
    document
      .getElementById(
        "story-category"
      )
      .value;


  const excerpt =
    document
      .getElementById(
        "story-excerpt"
      )
      .value
      .trim();


  const body =
    document
      .getElementById(
        "story-body"
      )
      .value
      .trim();


  const imageURL =
    document
      .getElementById(
        "story-image"
      )
      .value
      .trim() ||
    DEFAULT_IMAGE;


  const submitButton =
    form.querySelector(
      'button[type="submit"]'
    );


  if (
    !title ||
    !body
  ) {

    showToast(
      "Please fill in the required story fields.",
      "danger"
    );

    return;

  }


  const wordCount =
    countWords(
      body
    );


  if (
    wordCount < 30
  ) {

    showToast(
      "Please write at least 30 words in your story.",
      "danger"
    );

    return;

  }


  try {

    submitButton.disabled =
      true;

    submitButton.textContent =
      "Submitting...";


    await createSubmission({

      authorUid:
        user.uid,

      authorName:
        user.name ||
        "GIET Alumni",

      gradYear:
        user.gradYear ||
        "",

      company:
        user.company ||
        "",

      jobTitle:
        user.jobTitle ||
        "",

      title,

      category,

      excerpt,

      body,

      imageURL,

      status:
        "pending"

    });


    form.reset();


    updateSubmissionStats();


    updateCharacterCount(
      document.getElementById(
        "story-title"
      ),
      "title-count",
      150
    );


    updateCharacterCount(
      document.getElementById(
        "story-excerpt"
      ),
      "excerpt-count",
      250
    );


    updateImagePreview();


    closeSubmitModal();


    showToast(
      "Your story has been submitted and is now waiting for editorial moderation.",
      "success"
    );


  } catch (error) {

    console.error(
      "Story submission error:",
      error
    );


    showToast(
      "Submission error: " +
      (
        error.message ||
        "Please try again."
      ),
      "danger"
    );


  } finally {

    submitButton.disabled =
      false;

    submitButton.textContent =
      "Submit for Review";

  }

}


/* ============================================================
   SUBMISSION COUNTERS
   ============================================================ */

function updateSubmissionStats() {

  const body =
    document.getElementById(
      "story-body"
    );


  if (!body) return;


  const words =
    countWords(
      body.value
    );


  const count =
    document.getElementById(
      "word-count"
    );


  const readingTime =
    document.getElementById(
      "reading-time"
    );


  if (count) {

    count.textContent =
      words;

  }


  if (readingTime) {

    const minutes =
      Math.max(
        1,
        Math.ceil(
          words / 200
        )
      );


    readingTime.textContent =
      words
        ? `${minutes} min`
        : "0 min";

  }

}


/* ============================================================
   CHARACTER COUNT
   ============================================================ */

function updateCharacterCount(
  input,
  outputId,
  max
) {

  if (!input) return;


  const output =
    document.getElementById(
      outputId
    );


  if (!output) return;


  output.textContent =
    `${input.value.length} / ${max}`;

}


/* ============================================================
   IMAGE PREVIEW
   ============================================================ */

function updateImagePreview() {

  const input =
    document.getElementById(
      "story-image"
    );


  const preview =
    document.getElementById(
      "story-image-preview"
    );


  if (
    !input ||
    !preview
  ) {
    return;
  }


  const url =
    input.value.trim();


  if (!url) {

    preview.classList.remove(
      "has-image"
    );

    preview.innerHTML =
      "<span>Image preview will appear here</span>";

    return;

  }


  preview.classList.add(
    "has-image"
  );


  preview.innerHTML = `

    <img
      src="${escapeAttribute(
        url
      )}"
      alt="Featured image preview"
      onerror="this.parentElement.classList.remove('has-image'); this.parentElement.innerHTML='<span>Unable to load this image URL</span>';"
    />

  `;

}


/* ============================================================
   SAVED STORIES
   ============================================================ */

function initSavedStories() {

  const button =
    document.getElementById(
      "saved-stories-btn"
    );


  button?.addEventListener(
    "click",
    () => {

      showingSavedStories =
        !showingSavedStories;


      button.classList.toggle(
        "active",
        showingSavedStories
      );


      renderStories();

    }
  );

}


/* ============================================================
   LOCAL STORAGE
   ============================================================ */

function getSavedStories() {

  try {

    const raw =
      localStorage.getItem(
        SAVED_KEY
      );


    if (!raw) return [];


    const parsed =
      JSON.parse(
        raw
      );


    return Array.isArray(
      parsed
    )
      ? parsed
      : [];

  } catch {

    return [];

  }

}


/* ============================================================
   SAVE / UNSAVE
   ============================================================ */

function toggleSavedStory(
  id
) {

  const saved =
    getSavedStories();


  const index =
    saved.indexOf(
      id
    );


  if (
    index >= 0
  ) {

    saved.splice(
      index,
      1
    );


    showToast(
      "Story removed from saved stories.",
      "info"
    );

  } else {

    saved.push(
      id
    );


    showToast(
      "Story saved.",
      "success"
    );

  }


  localStorage.setItem(
    SAVED_KEY,
    JSON.stringify(
      saved
    )
  );


  renderStories();

}


/* ============================================================
   CHECK SAVED
   ============================================================ */

function isStorySaved(
  id
) {

  return getSavedStories()
    .includes(
      id
    );

}


/* ============================================================
   RECENT EVENTS & NEWS SLIDER
   ============================================================ */

function initNewsSlider() {

  const track =
    document.getElementById(
      "news-slider-track"
    );


  const previous =
    document.getElementById(
      "news-slider-prev"
    );


  const next =
    document.getElementById(
      "news-slider-next"
    );


  const dots =
    document.querySelectorAll(
      "#news-slider-dots button"
    );


  if (!track) return;


  const slides =
    track.querySelectorAll(
      ".recent-news-slide"
    );


  if (!slides.length) return;


  let currentSlide =
    0;


  let autoSlide;


  let isAnimating =
    false;


  /*
   * Move slider
   */

  function moveTo(
    index
  ) {

    if (
      isAnimating
    ) {
      return;
    }


    const total =
      slides.length;


    currentSlide =
      (
        index +
        total
      ) % total;


    isAnimating =
      true;


    /*
     * Fade out
     */

    track.classList.add(
      "is-changing"
    );


    setTimeout(
      () => {

        track.style.transform =
          `translateX(-${
            currentSlide * 100
          }%)`;


        updateDots();


        setTimeout(
          () => {

            track.classList.remove(
              "is-changing"
            );

            isAnimating =
              false;

          },
          180
        );

      },
      150
    );

  }


  /*
   * Update dots
   */

  function updateDots() {

    dots.forEach(
      (dot, index) => {

        dot.classList.toggle(
          "active",
          index ===
            currentSlide
        );

      }
    );

  }


  /*
   * Next
   */

  next?.addEventListener(
    "click",
    () => {

      moveTo(
        currentSlide + 1
      );

      restartAutoSlide();

    }
  );


  /*
   * Previous
   */

  previous?.addEventListener(
    "click",
    () => {

      moveTo(
        currentSlide - 1
      );

      restartAutoSlide();

    }
  );


  /*
   * Dots
   */

  dots.forEach(
    (dot) => {

      dot.addEventListener(
        "click",
        () => {

          const index =
            Number(
              dot.dataset.slide
            );


          moveTo(
            index
          );


          restartAutoSlide();

        }
      );

    }
  );


  /*
   * Automatic sliding
   *
   * Every 5 seconds
   */

  function startAutoSlide() {

    autoSlide =
      setInterval(
        () => {

          moveTo(
            currentSlide + 1
          );

        },
        5000
      );

  }


  function restartAutoSlide() {

    clearInterval(
      autoSlide
    );

    startAutoSlide();

  }


  /*
   * Pause while hovering
   */

  const slider =
    document.querySelector(
      ".news-slider"
    );


  slider?.addEventListener(
    "mouseenter",
    () => {

      clearInterval(
        autoSlide
      );

    }
  );


  slider?.addEventListener(
    "mouseleave",
    () => {

      restartAutoSlide();

    }
  );


  /*
   * Touch / swipe
   */

  let touchStartX =
    0;


  let touchEndX =
    0;


  slider?.addEventListener(
    "touchstart",
    (event) => {

      touchStartX =
        event.changedTouches[0].screenX;

    },
    {
      passive: true
    }
  );


  slider?.addEventListener(
    "touchend",
    (event) => {

      touchEndX =
        event.changedTouches[0].screenX;


      const difference =
        touchStartX -
        touchEndX;


      if (
        Math.abs(
          difference
        ) < 40
      ) {
        return;
      }


      if (
        difference > 0
      ) {

        moveTo(
          currentSlide + 1
        );

      } else {

        moveTo(
          currentSlide - 1
        );

      }


      restartAutoSlide();

    },
    {
      passive: true
    }
  );


  /*
   * Start
   */

  moveTo(
    0
  );


  startAutoSlide();

}


/* ============================================================
   RECENT DONOR POPUP
   ============================================================ */

function initDonorPopup() {

  const popup =
    document.getElementById(
      "recent-donor-popup"
    );


  const close =
    document.getElementById(
      "donor-close"
    );


  if (!popup) return;


  /*
   * DEMO DATA
   *
   * Replace these with university-approved
   * donor information before production.
   */

  const donors = [

    {
      name:
        "Rahul Sharma",

      year:
        "Class of 2018",

      amount:
        "₹50,000",

      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80"
    },


    {
      name:
        "Ananya Das",

      year:
        "Class of 2016",

      amount:
        "₹25,000",

      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80"
    },


    {
      name:
        "GIET Alumni Association",

      year:
        "Alumni Community",

      amount:
        "₹1,00,000",

      image:
        "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=300&q=80"
    }

  ];


  let donorIndex =
    0;


  let donorTimer;


  function showDonor(
    index
  ) {

    const donor =
      donors[index];


    if (!donor) return;


    const name =
      document.getElementById(
        "donor-name"
      );


    const year =
      document.getElementById(
        "donor-year"
      );


    const amount =
      document.getElementById(
        "donor-amount"
      );


    const image =
      document.getElementById(
        "donor-image"
      );


    if (name) {

      name.textContent =
        donor.name;

    }


    if (year) {

      year.textContent =
        donor.year;

    }


    if (amount) {

      amount.textContent =
        donor.amount;

    }


    if (image) {

      image.src =
        donor.image;

    }


    popup.classList.remove(
      "hide"
    );


    requestAnimationFrame(
      () => {

        popup.classList.add(
          "show"
        );

      }
    );

  }


  function startDonorRotation() {

    clearInterval(
      donorTimer
    );


    donorTimer =
      setInterval(
        () => {

          popup.classList.remove(
            "show"
          );


          setTimeout(
            () => {

              donorIndex =
                (
                  donorIndex +
                  1
                ) %
                donors.length;


              showDonor(
                donorIndex
              );

            },
            500
          );

        },
        8500
      );

  }


  /*
   * First popup
   */

  setTimeout(
    () => {

      showDonor(
        donorIndex
      );

      startDonorRotation();

    },
    1800
  );


  /*
   * Close
   */

  close?.addEventListener(
    "click",
    () => {

      popup.classList.remove(
        "show"
      );

      popup.classList.add(
        "hide"
      );


      clearInterval(
        donorTimer
      );

    }
  );

}


/* ============================================================
   NEWSLETTER
   ============================================================ */

function initNewsletter() {

  const forms =
    document.querySelectorAll(
      ".newsletter-form"
    );


  forms.forEach(
    (form) => {

      form.addEventListener(
        "submit",
        (event) => {

          event.preventDefault();


          const input =
            form.querySelector(
              "input[type='email']"
            );


          const email =
            input?.value.trim();


          if (!email) {

            return;

          }


          showToast(
            "Thank you. You have been added to the GIET alumni newsletter.",
            "success"
          );


          form.reset();

        }
      );

    }
  );

}


/* ============================================================
   SHARE ARTICLE
   ============================================================ */

async function handleShare(
  type,
  story
) {

  const shareURL =
    window.location.href;


  if (
    type ===
    "copy"
  ) {

    try {

      await navigator.clipboard.writeText(
        shareURL
      );


      showToast(
        "Article link copied.",
        "success"
      );

    } catch {

      showToast(
        "Unable to copy the link.",
        "danger"
      );

    }

    return;

  }


  if (
    type ===
    "linkedin"
  ) {

    const url =
      "https://www.linkedin.com/sharing/share-offsite/?url=" +
      encodeURIComponent(
        shareURL
      );


    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );

    return;

  }


  if (
    type ===
    "native"
  ) {

    if (
      navigator.share
    ) {

      try {

        await navigator.share({

          title:
            story.title ||
            "GIET University Alumni Gazette",

          text:
            story.excerpt ||
            "",

          url:
            shareURL

        });

      } catch {

        /*
         * User cancelled share.
         */

      }

    } else {

      try {

        await navigator.clipboard.writeText(
          shareURL
        );


        showToast(
          "Article link copied.",
          "success"
        );

      } catch {

        showToast(
          "Sharing is not supported on this browser.",
          "info"
        );

      }

    }

  }

}


/* ============================================================
   SUBMIT BUTTON STATE
   ============================================================ */

function updateSubmitButtonState() {

  const button =
    document.getElementById(
      "share-story-btn"
    );


  if (!button) return;


  if (currentUser) {

    button.textContent =
      "Share Your Story +";

  } else {

    button.textContent =
      "Log In to Share Your Story";

  }

}


/* ============================================================
   HELPERS
   ============================================================ */

function countWords(
  text
) {

  const clean =
    String(
      text || ""
    ).trim();


  if (!clean) {

    return 0;

  }


  return clean
    .split(
      /\s+/
    )
    .filter(Boolean)
    .length;

}


function calculateReadingTime(
  text
) {

  const words =
    countWords(
      text
    );


  return Math.max(
    1,
    Math.ceil(
      words / 200
    )
  );

}


function getExcerpt(
  body
) {

  const clean =
    String(
      body || ""
    )
      .replace(
        /\s+/g,
        " "
      )
      .trim();


  if (
    clean.length <=
    145
  ) {

    return clean;

  }


  return (
    clean.slice(
      0,
      145
    ) +
    "..."
  );

}


function formatDate(
  isoString
) {

  if (!isoString) {

    return "";

  }


  const date =
    new Date(
      isoString
    );


  if (
    Number.isNaN(
      date.getTime()
    )
  ) {

    return "";

  }


  return date.toLocaleDateString(
    "en-US",
    {
      month:
        "short",

      day:
        "numeric",

      year:
        "numeric"
    }
  );

}


function escapeHTML(
  value
) {

  if (
    value ===
    null ||
    value ===
    undefined
  ) {

    return "";

  }


  const div =
    document.createElement(
      "div"
    );


  div.textContent =
    String(
      value
    );


  return div.innerHTML;

}


function escapeAttribute(
  value
) {

  return escapeHTML(
    value
  )
    .replace(
      /"/g,
      "&quot;"
    )
    .replace(
      /'/g,
      "&#39;"
    );

}