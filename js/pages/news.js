/**
 * ============================================================
 * GIET UNIVERSITY — NEWS & STORIES
 * ============================================================
 *
 * Responsibilities:
 * - Recent events/news single-card carousel
 * - Approved alumni stories
 * - Category filters
 * - Saved stories
 * - Long-form reader
 * - Story submission
 * - Live word count
 * - Reading time
 * - Image preview
 *
 * Only this page's JS is modified.
 * ============================================================
 */

import { getSubmissions, createSubmission } from '../storage-service.js';
import { getCurrentUser, onAuthStateChange } from '../auth.js';
import { showToast } from '../nav.js';


/* ============================================================
   STATE
============================================================ */

let approvedStories = [];

let activeCategory = 'All';

let currentUser = null;

let currentRecentIndex = 0;

let showingSavedStories = false;


/* ============================================================
   SAVED STORIES
============================================================ */

const SAVED_KEY = 'alumni_saved_stories';


/* ============================================================
   FALLBACK IMAGE
============================================================ */

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=85';


/* ============================================================
   RECENT EVENTS & NEWS DATA
===============================================================
   These are sample/demo entries.

   Change:
   - title
   - description
   - image
   - date
   - location
   - href

   when your actual GIET events/news are available.
============================================================ */

const recentItems = [

  {
    type: 'EVENT',
    title: 'GIET Alumni Innovation Summit',
    description:
      'A day of ideas, networking and innovation bringing together GIET alumni, students, faculty and industry leaders.',
    date: 'Aug 15, 2026',
    location: 'GIET University Campus',
    image:
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=85',
    href: 'events.html'
  },

  {
    type: 'NEWS',
    title: 'GIET University Expands Alumni Industry Network',
    description:
      'New alumni-industry initiatives are creating more opportunities for mentorship, internships and professional collaboration.',
    date: 'Aug 10, 2026',
    location: 'GIET University',
    image:
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85',
    href: 'news.html'
  },

  {
    type: 'EVENT',
    title: 'GIET Alumni Meet & Networking Evening',
    description:
      'Reconnect with classmates, meet fellow graduates and celebrate the growing GIET alumni community.',
    date: 'Aug 05, 2026',
    location: 'GIET University',
    image:
      'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=85',
    href: 'events.html'
  },

  {
    type: 'NEWS',
    title: 'GIET Alumni Make Their Mark in Technology',
    description:
      'A look at graduates working across software engineering, artificial intelligence, startups and emerging technologies.',
    date: 'Jul 28, 2026',
    location: 'Alumni Network',
    image:
      'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=85',
    href: 'news.html'
  },

  {
    type: 'EVENT',
    title: 'Annual Student Project Showcase',
    description:
      'Students present innovative projects and prototypes while alumni mentors share industry feedback and guidance.',
    date: 'Jul 20, 2026',
    location: 'GIET Innovation Centre',
    image:
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=85',
    href: 'events.html'
  },

  {
    type: 'NEWS',
    title: 'GIET Alumni Entrepreneurship Stories',
    description:
      'Discover the journeys of graduates who transformed classroom ideas into businesses, products and new ventures.',
    date: 'Jul 12, 2026',
    location: 'GIET Alumni Gazette',
    image:
      'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=85',
    href: 'news.html'
  },

  {
    type: 'EVENT',
    title: 'Alumni Career & Mentorship Day',
    description:
      'Alumni professionals return to GIET to guide students on careers, skills, interviews and industry expectations.',
    date: 'Jul 05, 2026',
    location: 'GIET University',
    image:
      'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1200&q=85',
    href: 'events.html'
  },

  {
    type: 'NEWS',
    title: 'GIET Community Celebrates Alumni Achievements',
    description:
      'From academic milestones to professional achievements, explore the latest accomplishments from the GIET family.',
    date: 'Jun 28, 2026',
    location: 'GIET University Alumni',
    image:
      'https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=1200&q=85',
    href: 'news.html'
  }

];


/* ============================================================
   TRENDING DATA
============================================================ */

const trendingItems = [

  {
    title: 'GIET Alumni Building the Next Generation of AI',
    meta: '2 days ago · Breakthroughs',
    image:
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=300&q=80'
  },

  {
    title: 'Students Take Innovation Beyond the Classroom',
    meta: '3 days ago · Campus Milestones',
    image:
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=300&q=80'
  },

  {
    title: 'From GIET Classroom to Global Careers',
    meta: '4 days ago · Stories & Essays',
    image:
      'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=300&q=80'
  },

  {
    title: 'Research, Innovation and the GIET Community',
    meta: '5 days ago · Breakthroughs',
    image:
      'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=300&q=80'
  },

  {
    title: 'GIET Alumni Turning Ideas Into Startups',
    meta: '6 days ago · Breakthroughs',
    image:
      'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=300&q=80'
  },

  {
    title: 'Alumni Mentors Give Back to GIET Students',
    meta: '1 week ago · Stories & Essays',
    image:
      'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=300&q=80'
  }

];


/* ============================================================
   DOM READY
============================================================ */

document.addEventListener('DOMContentLoaded', async () => {

  /*
   * Existing authentication contract.
   */
  onAuthStateChange((user) => {

    currentUser = user;

    updateSubmitButtonState();

  });


  /*
   * Load approved stories.
   */
  try {

    approvedStories = await getSubmissions('approved');

  } catch (error) {

    console.error('Unable to load approved stories:', error);

    approvedStories = [];

  }


  /*
   * Initialize page.
   */

  initCategoryFilters();

  renderStories();

  initRecentCarousel();

  initReaderModal();

  initSubmissionModal();

  initSavedStories();

  renderTrendingItems();


  /*
   * Open submission modal when URL contains:
   *
   * news.html#submit
   */

  if (window.location.hash === '#submit') {

    setTimeout(() => {

      handleOpenSubmitModal();

    }, 300);

  }

});


/* ============================================================
   RECENT CAROUSEL
============================================================ */

function initRecentCarousel() {

  renderRecentCarousel();


  const previousButton =
    document.getElementById('recent-prev');

  const nextButton =
    document.getElementById('recent-next');


  previousButton?.addEventListener(
    'click',
    () => {

      currentRecentIndex--;

      if (currentRecentIndex < 0) {

        currentRecentIndex =
          recentItems.length - 1;

      }

      renderRecentCarousel();

    }
  );


  nextButton?.addEventListener(
    'click',
    () => {

      currentRecentIndex++;

      if (
        currentRecentIndex >=
        recentItems.length
      ) {

        currentRecentIndex = 0;

      }

      renderRecentCarousel();

    }
  );


  /*
   * Keyboard navigation.
   */

  document.addEventListener('keydown', (event) => {

    if (
      event.key === 'ArrowLeft' &&
      !isTypingElement(event.target)
    ) {

      currentRecentIndex--;

      if (currentRecentIndex < 0) {

        currentRecentIndex =
          recentItems.length - 1;

      }

      renderRecentCarousel();

    }


    if (
      event.key === 'ArrowRight' &&
      !isTypingElement(event.target)
    ) {

      currentRecentIndex++;

      if (
        currentRecentIndex >=
        recentItems.length
      ) {

        currentRecentIndex = 0;

      }

      renderRecentCarousel();

    }

  });


  /*
   * Touch swipe.
   */

  let touchStartX = 0;

  const carousel =
    document.querySelector('.recent-carousel');


  carousel?.addEventListener(
    'touchstart',
    (event) => {

      touchStartX =
        event.changedTouches[0].screenX;

    },
    { passive: true }
  );


  carousel?.addEventListener(
    'touchend',
    (event) => {

      const touchEndX =
        event.changedTouches[0].screenX;

      const distance =
        touchEndX - touchStartX;


      if (Math.abs(distance) < 45) {

        return;

      }


      if (distance < 0) {

        currentRecentIndex++;

        if (
          currentRecentIndex >=
          recentItems.length
        ) {

          currentRecentIndex = 0;

        }

      } else {

        currentRecentIndex--;

        if (currentRecentIndex < 0) {

          currentRecentIndex =
            recentItems.length - 1;

        }

      }


      renderRecentCarousel();

    },
    { passive: true }
  );


  /*
   * Automatic rotation every 7 seconds.
   */

  let autoRotate =
    setInterval(() => {

      currentRecentIndex++;

      if (
        currentRecentIndex >=
        recentItems.length
      ) {

        currentRecentIndex = 0;

      }

      renderRecentCarousel();

    }, 7000);


  /*
   * Stop autoplay while mouse is over carousel.
   */

  carousel?.addEventListener(
    'mouseenter',
    () => {

      clearInterval(autoRotate);

    }
  );


  carousel?.addEventListener(
    'mouseleave',
    () => {

      autoRotate =
        setInterval(() => {

          currentRecentIndex++;

          if (
            currentRecentIndex >=
            recentItems.length
          ) {

            currentRecentIndex = 0;

          }

          renderRecentCarousel();

        }, 7000);

    }
  );

}


/* ============================================================
   RENDER ONE RECENT CARD
============================================================ */

function renderRecentCarousel() {

  const card =
    document.getElementById(
      'recent-carousel-card'
    );

  const dots =
    document.getElementById(
      'recent-carousel-dots'
    );

  const counter =
    document.getElementById(
      'carousel-counter'
    );


  if (!card) return;


  const item =
    recentItems[currentRecentIndex];


  /*
   * ONLY ONE CARD IS RENDERED HERE.
   */

  card.innerHTML = `

    <div class="recent-card-image">

      <img
        src="${escapeAttribute(item.image)}"
        alt="${escapeAttribute(item.title)}"
      />

      <span class="recent-card-label">
        ${escapeHTML(item.type)}
      </span>

    </div>


    <div class="recent-card-content">

      <span class="eyebrow">
        ${escapeHTML(item.type)}
      </span>

      <h3>
        ${escapeHTML(item.title)}
      </h3>

      <p>
        ${escapeHTML(item.description)}
      </p>


      <div class="recent-card-meta">

        <span>
          📅
          ${escapeHTML(item.date)}
        </span>

        <span>
          📍
          ${escapeHTML(item.location)}
        </span>

      </div>

    </div>

  `;


  /*
   * Clicking card redirects to Events or News page.
   */

  card.onclick = () => {

    window.location.href = item.href;

  };


  /*
   * Update counter.
   */

  if (counter) {

    counter.textContent =
      `${String(currentRecentIndex + 1).padStart(2, '0')} / ${String(recentItems.length).padStart(2, '0')}`;

  }


  /*
   * Pagination dots.
   */

  if (dots) {

    dots.innerHTML =
      recentItems
        .map(
          (_, index) => `
            <button
              class="carousel-dot ${
                index === currentRecentIndex
                  ? 'active'
                  : ''
              }"
              aria-label="Show item ${index + 1}"
              data-index="${index}"
            ></button>
          `
        )
        .join('');


    dots
      .querySelectorAll('.carousel-dot')
      .forEach((dot) => {

        dot.addEventListener(
          'click',
          (event) => {

            event.stopPropagation();

            currentRecentIndex =
              Number(
                dot.dataset.index
              );

            renderRecentCarousel();

          }
        );

      });

  }

}


/* ============================================================
   CATEGORY FILTERS
============================================================ */

function initCategoryFilters() {

  const container =
    document.getElementById(
      'news-category-filters'
    );


  if (!container) return;


  const categories = [

    {
      value: 'All',
      label: 'All'
    },

    {
      value: 'Story',
      label: 'Stories & Essays'
    },

    {
      value: 'Achievement',
      label: 'Breakthroughs'
    },

    {
      value: 'News',
      label: 'Campus Milestones'
    }

  ];


  container.innerHTML =
    categories
      .map(
        (category) => `

          <button
            type="button"
            class="category-pill ${
              category.value === activeCategory
                ? 'active'
                : ''
            }"
            data-cat="${category.value}"
          >
            ${category.label}
          </button>

        `
      )
      .join('');


  container
    .querySelectorAll('.category-pill')
    .forEach((button) => {

      button.addEventListener(
        'click',
        () => {

          showingSavedStories = false;

          activeCategory =
            button.dataset.cat;

          container
            .querySelectorAll('.category-pill')
            .forEach((item) => {

              item.classList.remove('active');

            });


          button.classList.add('active');

          renderStories();

        }
      );

    });

}


/* ============================================================
   RENDER STORIES
============================================================ */

function renderStories() {

  const grid =
    document.getElementById(
      'news-grid'
    );


  if (!grid) return;


  let list =
    activeCategory === 'All'
      ? [...approvedStories]
      : approvedStories.filter(
          (story) =>
            story.category === activeCategory
        );


  /*
   * Saved Stories filter.
   */

  if (showingSavedStories) {

    const saved =
      getSavedStoryIds();

    list =
      list.filter(
        (story) =>
          saved.includes(story.id)
      );

  }


  /*
   * No stories.
   */

  if (!list.length) {

    grid.innerHTML = `

      <div class="news-empty-state">

        <h3>
          ${
            showingSavedStories
              ? 'No Saved Stories Yet'
              : 'More Stories Coming Soon'
          }
        </h3>

        <p>
          ${
            showingSavedStories
              ? 'Save stories you want to read later.'
              : 'The GIET University alumni editorial team will publish new stories here.'
          }
        </p>

      </div>

    `;

    return;

  }


  /*
   * Add featured/trending/quote panels
   * around actual approved stories.
   */

  const storyCards =
    list.map(
      (story, index) =>
        renderStoryCard(
          story,
          index === 0
        )
    )
    .join('');


  grid.innerHTML = `

    ${storyCards}

    ${renderTrendingPanel()}

    ${renderQuotePanel()}

  `;


  /*
   * Card events.
   */

  grid
    .querySelectorAll('.news-card')
    .forEach((card) => {

      card.addEventListener(
        'click',
        (event) => {

          /*
           * Don't open reader if bookmark
           * button was clicked.
           */

          if (
            event.target.closest(
              '.story-save-button'
            )
          ) {

            return;

          }


          openReaderModal(
            card.dataset.id
          );

        }
      );

    });


  /*
   * Save buttons.
   */

  grid
    .querySelectorAll('.story-save-button')
    .forEach((button) => {

      button.addEventListener(
        'click',
        (event) => {

          event.stopPropagation();

          toggleSavedStory(
            button.dataset.id
          );

        }
      );

    });

}


/* ============================================================
   STORY CARD
============================================================ */

function renderStoryCard(
  story,
  featured = false
) {

  const image =
    story.imageURL ||
    DEFAULT_IMAGE;


  const saved =
    getSavedStoryIds().includes(
      story.id
    );


  const body =
    story.body || '';


  const excerpt =
    story.excerpt ||
    `${body.slice(0, 150)}${body.length > 150 ? '...' : ''}`;


  return `

    <article
      class="news-card ${
        featured ? 'featured' : ''
      }"
      data-id="${escapeAttribute(story.id)}"
    >

      <div class="news-cover-wrap">

        <img
          src="${escapeAttribute(image)}"
          alt="${escapeAttribute(story.title)}"
          class="news-cover-img"
          loading="lazy"
        />

        <span class="news-category-badge">
          ${escapeHTML(
            getCategoryLabel(
              story.category
            )
          )}
        </span>

      </div>


      <div class="news-card-body">

        <div class="news-date">
          ${formatDate(story.createdAt)}
        </div>


        <h3 class="news-title">
          ${escapeHTML(story.title)}
        </h3>


        <p class="news-excerpt">
          ${escapeHTML(excerpt)}
        </p>


        <div class="news-author">

          <span>
            By
          </span>

          <span class="author-name">
            ${escapeHTML(
              story.authorName ||
              'GIET Alumni'
            )}
          </span>


          <button
            type="button"
            class="story-save-button"
            data-id="${escapeAttribute(story.id)}"
            aria-label="Save story"
            title="Save story"
            style="margin-left:auto;border:0;background:none;font-size:18px;cursor:pointer;"
          >
            ${saved ? '🔖' : '♡'}
          </button>

        </div>

      </div>

    </article>

  `;

}


/* ============================================================
   TRENDING PANEL
============================================================ */

function renderTrendingPanel() {

  return `

    <aside class="trending-panel">

      <div class="trending-heading">

        <h3>
          TRENDING INSIGHTS
        </h3>

      </div>


      ${trendingItems
        .slice(0, 5)
        .map(
          (item, index) => `

            <div class="trending-item">

              <div class="trending-number">
                ${index + 1}
              </div>

              <img
                src="${escapeAttribute(item.image)}"
                alt=""
                loading="lazy"
              />

              <div>

                <h4>
                  ${escapeHTML(item.title)}
                </h4>

                <p>
                  ${escapeHTML(item.meta)}
                </p>

              </div>

            </div>

          `
        )
        .join('')}


      <a
        href="news.html"
        class="trending-footer"
      >
        View all stories →
      </a>

    </aside>

  `;

}


/* ============================================================
   QUOTE PANEL
============================================================ */

function renderQuotePanel() {

  return `

    <aside class="quote-panel">

      <div class="quote-mark">
        “
      </div>

      <blockquote>
        GIET gave me more than a degree.
        It gave me people, experiences and
        memories that continue to shape my journey.
      </blockquote>

      <div class="quote-author">
        GIET Alumni Community
      </div>

      <div class="quote-role">
        Alumni Voices · GIET University
      </div>

    </aside>

  `;

}


/* ============================================================
   READER MODAL
============================================================ */

function initReaderModal() {

  const modal =
    document.getElementById(
      'reader-modal'
    );


  const closeButton =
    document.getElementById(
      'close-reader-modal'
    );


  closeButton?.addEventListener(
    'click',
    () => {

      closeReaderModal();

    }
  );


  modal?.addEventListener(
    'click',
    (event) => {

      if (
        event.target === modal
      ) {

        closeReaderModal();

      }

    }
  );


  document.addEventListener(
    'keydown',
    (event) => {

      if (
        event.key === 'Escape' &&
        modal?.classList.contains(
          'open'
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

function openReaderModal(id) {

  const story =
    approvedStories.find(
      (item) =>
        String(item.id) === String(id)
    );


  if (!story) return;


  const modal =
    document.getElementById(
      'reader-modal'
    );


  const body =
    document.getElementById(
      'reader-modal-body'
    );


  if (!modal || !body) return;


  const image =
    story.imageURL ||
    DEFAULT_IMAGE;


  const readingTime =
    calculateReadingTime(
      story.body || ''
    );


  body.innerHTML = `

    <img
      src="${escapeAttribute(image)}"
      alt="${escapeAttribute(story.title)}"
      class="story-reader-cover"
    />


    <div class="story-reader-content">


      <div class="reader-meta">

        <span class="reader-pill">
          ${escapeHTML(
            getCategoryLabel(
              story.category
            )
          )}
        </span>

        <span class="reader-pill">
          ${readingTime} min read
        </span>

        <span class="reader-pill">
          GIET Gazette
        </span>

      </div>


      <div
        style="
          color:#8993a0;
          font-size:12px;
          margin-bottom:10px;
        "
      >
        ${formatDate(story.createdAt)}
      </div>


      <h2>
        ${escapeHTML(story.title)}
      </h2>


      <div
        style="
          margin:15px 0 30px;
          color:#788597;
          font-size:13px;
        "
      >

        Published by

        <a
          href="profile.html?id=${encodeURIComponent(
            story.authorUid || ''
          )}"
          style="
            color:#0b192c;
            font-weight:700;
          "
        >
          ${escapeHTML(
            story.authorName ||
            'GIET Alumni'
          )}
        </a>

      </div>


      <div class="story-reader-body">

        ${escapeHTML(
          story.body ||
          'This story does not contain additional content yet.'
        )}

      </div>


      <div class="pull-quote">

        “The GIET alumni community grows stronger
        when every graduate shares a story.”

      </div>


      <div class="author-callout">

        <img
          class="author-avatar"
          src="${escapeAttribute(
            story.authorPhotoURL ||
            DEFAULT_IMAGE
          )}"
          alt=""
        />

        <div>

          <strong>
            ${escapeHTML(
              story.authorName ||
              'GIET Alumni'
            )}
          </strong>

          <span>
            GIET University Alumni
          </span>

          <a
            href="profile.html?id=${encodeURIComponent(
              story.authorUid || ''
            )}"
            style="
              display:inline-block;
              margin-top:7px;
              color:#a67c13;
              font-size:12px;
              font-weight:700;
            "
          >
            View Fellow Profile →
          </a>

        </div>

      </div>

    </div>

  `;


  modal.classList.add('open');

  modal.setAttribute(
    'aria-hidden',
    'false'
  );

}


/* ============================================================
   CLOSE READER
============================================================ */

function closeReaderModal() {

  const modal =
    document.getElementById(
      'reader-modal'
    );


  modal?.classList.remove(
    'open'
  );


  modal?.setAttribute(
    'aria-hidden',
    'true'
  );

}


/* ============================================================
   SUBMISSION MODAL
============================================================ */

function initSubmissionModal() {

  const trigger =
    document.getElementById(
      'share-story-btn'
    );


  const modal =
    document.getElementById(
      'submit-story-modal'
    );


  const closeButton =
    document.getElementById(
      'close-submit-modal'
    );


  const cancelButton =
    document.getElementById(
      'cancel-submit-modal'
    );


  const form =
    document.getElementById(
      'story-submission-form'
    );


  trigger?.addEventListener(
    'click',
    handleOpenSubmitModal
  );


  closeButton?.addEventListener(
    'click',
    () => {

      modal?.classList.remove(
        'open'
      );

    }
  );


  cancelButton?.addEventListener(
    'click',
    () => {

      modal?.classList.remove(
        'open'
      );

    }
  );


  modal?.addEventListener(
    'click',
    (event) => {

      if (
        event.target === modal
      ) {

        modal.classList.remove(
          'open'
        );

      }

    }
  );


  /*
   * Live title count.
   */

  const titleInput =
    document.getElementById(
      'story-title'
    );


  titleInput?.addEventListener(
    'input',
    () => {

      const count =
        countWords(
          titleInput.value
        );


      const counter =
        document.getElementById(
          'title-word-count'
        );


      if (counter) {

        counter.textContent =
          `${count} words`;

      }

    }
  );


  /*
   * Live body count.
   */

  const bodyInput =
    document.getElementById(
      'story-body'
    );


  bodyInput?.addEventListener(
    'input',
    () => {

      updateBodyReadingStats();

    }
  );


  /*
   * Image preview.
   */

  const imageInput =
    document.getElementById(
      'story-image'
    );


  imageInput?.addEventListener(
    'input',
    updateImagePreview
  );


  /*
   * Submit.
   */

  form?.addEventListener(
    'submit',
    async (event) => {

      event.preventDefault();


      if (!currentUser) {

        handleOpenSubmitModal();

        return;

      }


      const title =
        titleInput.value.trim();


      const category =
        document.getElementById(
          'story-category'
        ).value;


      const excerpt =
        document.getElementById(
          'story-excerpt'
        ).value.trim();


      const body =
        bodyInput.value.trim();


      const imageURL =
        imageInput.value.trim() ||
        DEFAULT_IMAGE;


      if (!title || !body) {

        showToast(
          'Please complete the required fields.',
          'danger'
        );

        return;

      }


      const submitButton =
        form.querySelector(
          'button[type="submit"]'
        );


      try {

        submitButton.disabled = true;

        submitButton.textContent =
          'Submitting...';


        await createSubmission({

          authorUid:
            currentUser.uid,

          authorName:
            currentUser.name ||
            'GIET Alumni',

          title,

          category,

          excerpt,

          body,

          imageURL,

          status: 'pending'

        });


        form.reset();

        updateBodyReadingStats();

        updateImagePreview();


        modal.classList.remove(
          'open'
        );


        showToast(
          'Your story was submitted for editorial review.',
          'success'
        );


      } catch (error) {

        console.error(error);


        showToast(
          'Submission failed: ' +
          error.message,
          'danger'
        );


      } finally {

        submitButton.disabled = false;

        submitButton.textContent =
          'Submit for Review';

      }

    }
  );

}


/* ============================================================
   OPEN SUBMISSION
============================================================ */

function handleOpenSubmitModal() {

  const modal =
    document.getElementById(
      'submit-story-modal'
    );


  if (!currentUser) {

    showToast(
      'Please log in to submit a GIET alumni story.',
      'info'
    );


    setTimeout(() => {

      window.location.href =
        'login.html';

    }, 1000);


    return;

  }


  modal?.classList.add(
    'open'
  );

  modal?.setAttribute(
    'aria-hidden',
    'false'
  );

}


/* ============================================================
   AUTH BUTTON
============================================================ */

function updateSubmitButtonState() {

  const button =
    document.getElementById(
      'share-story-btn'
    );


  if (!button) return;


  button.textContent =
    currentUser
      ? 'Share Your Story +'
      : 'Log In to Share Your Story';

}


/* ============================================================
   SAVED STORIES
============================================================ */

function initSavedStories() {

  const button =
    document.getElementById(
      'saved-stories-btn'
    );


  button?.addEventListener(
    'click',
    () => {

      showingSavedStories =
        !showingSavedStories;


      button.textContent =
        showingSavedStories
          ? '← Show All Stories'
          : '♡ My Saved Stories';


      renderStories();

    }
  );

}


function getSavedStoryIds() {

  try {

    return JSON.parse(
      localStorage.getItem(
        SAVED_KEY
      ) || '[]'
    );

  } catch {

    return [];

  }

}


function toggleSavedStory(id) {

  let saved =
    getSavedStoryIds();


  if (saved.includes(id)) {

    saved =
      saved.filter(
        (item) =>
          item !== id
      );


    showToast(
      'Story removed from saved stories.',
      'info'
    );

  } else {

    saved.push(id);


    showToast(
      'Story saved for later.',
      'success'
    );

  }


  localStorage.setItem(
    SAVED_KEY,
    JSON.stringify(saved)
  );


  renderStories();

}


/* ============================================================
   TRENDING PANEL
============================================================ */

function renderTrendingItems() {

  /*
   * Trending is rendered inside
   * renderStories().
   *
   * This function exists to keep the
   * page initialization readable.
   */

}


/* ============================================================
   CATEGORY LABEL
============================================================ */

function getCategoryLabel(category) {

  const labels = {

    News: 'Campus Milestones',

    Story: 'Stories & Essays',

    Achievement: 'Breakthroughs'

  };


  return (
    labels[category] ||
    category ||
    'GIET News'
  );

}


/* ============================================================
   WORD COUNT
============================================================ */

function countWords(text) {

  return text
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .length;

}


/* ============================================================
   READING TIME
============================================================ */

function calculateReadingTime(text) {

  const words =
    countWords(text);


  return Math.max(
    1,
    Math.ceil(
      words / 200
    )
  );

}


/* ============================================================
   UPDATE BODY STATS
============================================================ */

function updateBodyReadingStats() {

  const body =
    document.getElementById(
      'story-body'
    );


  if (!body) return;


  const words =
    countWords(
      body.value
    );


  const wordCounter =
    document.getElementById(
      'body-word-count'
    );


  const readingTime =
    document.getElementById(
      'body-reading-time'
    );


  if (wordCounter) {

    wordCounter.textContent =
      `${words} words`;

  }


  if (readingTime) {

    readingTime.textContent =
      `${Math.max(
        0,
        Math.ceil(words / 200)
      )} min read`;

  }

}


/* ============================================================
   IMAGE PREVIEW
============================================================ */

function updateImagePreview() {

  const input =
    document.getElementById(
      'story-image'
    );


  const preview =
    document.getElementById(
      'story-image-preview'
    );


  if (!input || !preview) return;


  const url =
    input.value.trim();


  if (!url) {

    preview.innerHTML = '';

    preview.classList.remove(
      'visible'
    );

    return;

  }


  preview.innerHTML = `

    <img
      src="${escapeAttribute(url)}"
      alt="Story image preview"
      onerror="this.parentElement.innerHTML='<p style=&quot;padding:15px;color:#9a6b00;font-size:12px;&quot;>Unable to preview this image URL.</p>'"
    />

  `;


  preview.classList.add(
    'visible'
  );

}


/* ============================================================
   DATE
============================================================ */

function formatDate(
  isoString
) {

  if (!isoString) {

    return 'Recently';

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

    return 'Recently';

  }


  return date.toLocaleDateString(
    'en-US',
    {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }
  );

}


/* ============================================================
   ESCAPE HTML
============================================================ */

function escapeHTML(
  value
) {

  if (
    value === null ||
    value === undefined
  ) {

    return '';

  }


  const div =
    document.createElement(
      'div'
    );


  div.textContent =
    String(value);


  return div.innerHTML;

}


/* ============================================================
   ESCAPE ATTRIBUTE
============================================================ */

function escapeAttribute(
  value
) {

  return escapeHTML(
    value
  ).replace(
    /"/g,
    '&quot;'
  );

}


/* ============================================================
   CHECK TYPING ELEMENT
============================================================ */

function isTypingElement(
  element
) {

  if (!element) return false;


  const tag =
    element.tagName;


  return (
    tag === 'INPUT' ||
    tag === 'TEXTAREA' ||
    tag === 'SELECT'
  );

}