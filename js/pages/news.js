/* =========================================================
   GIET UNIVERSITY ALUMNI GAZETTE
   NEWS PAGE JAVASCRIPT
   ========================================================= */


/* ================= IMPORTS ================= */

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
   CONSTANTS
   ========================================================= */

const SAVED_KEY =
  "alumni_saved_stories";


const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80";


/* =========================================================
   PLACEMENT DATA
   DEMO DATA
   Replace with approved real placement information.
   ========================================================= */

const students = [

  {
    name: "Aarav Das",

    department:
      "Computer Science & Engineering",

    branch:
      "CSE-AIML",

    year:
      "2023–2027",

    company:
      "Microsoft",

    package:
      "₹13 LPA",

    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&q=80"
  },


  {
    name: "Ananya Mohanty",

    department:
      "Computer Science & Engineering",

    branch:
      "CSE",

    year:
      "2023–2027",

    company:
      "Deloitte",

    package:
      "₹12 LPA",

    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=700&q=80"
  },


  {
    name: "Ritwik Sahu",

    department:
      "Computer Science & Engineering",

    branch:
      "CSE-AIML",

    year:
      "2022–2026",

    company:
      "TCS",

    package:
      "₹10.5 LPA",

    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=700&q=80"
  },


  {
    name: "Sneha Patnaik",

    department:
      "Information Technology",

    branch:
      "IT",

    year:
      "2023–2027",

    company:
      "Accenture",

    package:
      "₹9 LPA",

    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=80"
  },


  {
    name: "Aditya Rout",

    department:
      "Computer Science & Engineering",

    branch:
      "CSE",

    year:
      "2022–2026",

    company:
      "Infosys",

    package:
      "₹8.5 LPA",

    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&q=80"
  },


  {
    name: "Priya Behera",

    department:
      "Electrical Engineering",

    branch:
      "EE",

    year:
      "2023–2027",

    company:
      "Wipro",

    package:
      "₹7.5 LPA",

    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=700&q=80"
  },


  {
    name: "Rahul Pradhan",

    department:
      "Electronics & Communication Engineering",

    branch:
      "ECE",

    year:
      "2022–2026",

    company:
      "Capgemini",

    package:
      "₹7.2 LPA",

    image:
      "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=700&q=80"
  },


  {
    name: "Ishita Nayak",

    department:
      "Computer Science & Engineering",

    branch:
      "CSE",

    year:
      "2023–2027",

    company:
      "IBM",

    package:
      "₹6.8 LPA",

    image:
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=700&q=80"
  }

];


/* =========================================================
   HELPER FUNCTIONS
   ========================================================= */

const $ = (selector) =>
  document.querySelector(selector);


const $$ = (selector) =>
  [...document.querySelectorAll(selector)];


/* Saved stories */

const getSavedStories = () =>
  JSON.parse(
    localStorage.getItem(SAVED_KEY) || "[]"
  );


const setSavedStories = (stories) =>
  localStorage.setItem(
    SAVED_KEY,
    JSON.stringify(stories)
  );


/* Escape HTML */

const esc = (value) => {

  return String(value ?? "")
    .replace(
      /[&<>'"]/g,
      (character) => {

        const map = {

          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          "'": "&#39;",
          '"': "&quot;"

        };

        return map[character];

      }
    );

};


/* Category labels */

const categoryLabel = (category) => {

  const labels = {

    Story:
      "Stories & Essays",

    Achievement:
      "Breakthroughs",

    News:
      "Campus Milestones"

  };

  return labels[category] || category;

};


/* Reading time */

const readTime = (text) => {

  const words =
    String(text || "")
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .length;


  return Math.max(
    1,
    Math.ceil(words / 220)
  );

};


/* =========================================================
   NEWS STORIES
   ========================================================= */

let stories = [];


/* Load approved stories */

async function loadStories() {

  try {

    stories =
      await getSubmissions("approved") || [];

  }

  catch (error) {

    console.error(
      "Could not load stories:",
      error
    );

    stories = [];

  }


  renderStories("All");

}


/* Story ID */

function storyId(story, index) {

  return (
    story.id ||
    story.uid ||
    `${story.title || "story"}-${index}`
  );

}


/* Find story */

function findStory(id) {

  return stories.find(
    (story, index) =>
      storyId(story, index) === id
  );

}


/* =========================================================
   RENDER STORIES
   ========================================================= */

function renderStories(filter = "All") {

  let list;


  /* Saved */

  if (filter === "Saved") {

    const saved =
      getSavedStories();


    list =
      stories.filter(
        (story, index) =>
          saved.includes(
            storyId(story, index)
          )
      );

  }


  /* All */

  else if (filter === "All") {

    list = stories;

  }


  /* Category */

  else {

    list =
      stories.filter(
        (story) =>
          (story.category || "News") === filter
      );

  }


  const grid =
    $("#news-grid");


  const trending =
    $("#trending-list");


  /* Empty */

  if (!list.length) {

    grid.innerHTML = `

      <div class="empty-state">

        <h3>
          No stories here yet.
        </h3>

        <p>
          Be the first GIET alumnus to share one.
        </p>

      </div>

    `;


    trending.innerHTML = "";

    return;

  }


  /* News cards */

  grid.innerHTML =
    list
      .map(
        (story, index) => {

          const id =
            storyId(
              story,
              index
            );


          const isSaved =
            getSavedStories()
              .includes(id);


          return `

            <article class="news-card">

              <img
                src="${esc(
                  story.imageUrl ||
                  story.image ||
                  DEFAULT_IMAGE
                )}"
                alt=""
              />


              <div class="card-meta">

                <span>
                  ${esc(
                    categoryLabel(
                      story.category ||
                      "News"
                    )
                  )}
                </span>


                <button
                  class="save-btn"
                  data-save="${esc(id)}"
                  aria-label="Save story"
                  type="button"
                >
                  ${isSaved ? "♥" : "♡"}
                </button>

              </div>


              <h3>

                <a
                  href="#"
                  data-read="${esc(id)}"
                >
                  ${esc(
                    story.title ||
                    "GIET Alumni Story"
                  )}
                </a>

              </h3>


              <p>
                ${esc(
                  story.excerpt ||
                  "A story from the GIET University community."
                )}
              </p>


              <div class="card-meta">

                <span>
                  ${esc(
                    story.authorName ||
                    story.author ||
                    "GIET Community"
                  )}
                </span>


                <span>
                  ${readTime(
                    story.body ||
                    story.content
                  )}
                  min read
                </span>

              </div>

            </article>

          `;

        }
      )
      .join("");


  /* Trending */

  const trend =
    [...list].slice(0, 5);


  trending.innerHTML =
    trend
      .map(
        (story, index) => {

          return `

            <li>

              <b>
                ${String(
                  index + 1
                ).padStart(2, "0")}
              </b>


              <a
                href="#"
                data-read="${esc(
                  storyId(
                    story,
                    stories.indexOf(
                      story
                    )
                  )
                )}"
              >
                ${esc(
                  story.title ||
                  "GIET Alumni Story"
                )}
              </a>

            </li>

          `;

        }
      )
      .join("");

}


/* =========================================================
   STORY READER
   ========================================================= */

function openReader(story) {

  if (!story) {
    return;
  }


  const body =
    String(
      story.body ||
      story.content ||
      story.excerpt ||
      ""
    )
      .split(/\n+/)
      .filter(Boolean);


  const quote =
    body.length > 2

      ? body[
          Math.floor(
            body.length / 2
          )
        ].slice(0, 180)

      : "Stories from GIET continue to connect people, ideas and progress.";


  $("#reader-modal-body")
    .innerHTML = `

      <div class="reader-content">

        <img
          src="${esc(
            story.imageUrl ||
            story.image ||
            DEFAULT_IMAGE
          )}"
          alt=""
        />


        <div
          class="card-meta"
          style="margin-top:18px"
        >

          <span>
            ${esc(
              categoryLabel(
                story.category ||
                "News"
              )
            )}
          </span>


          <span>

            ${readTime(
              story.body ||
              story.content
            )}

            min read ·

            VOL. 04 · ISSUE 09

          </span>

        </div>


        <h1>
          ${esc(
            story.title ||
            "GIET Alumni Story"
          )}
        </h1>


        <p>

          <strong>
            By
            ${esc(
              story.authorName ||
              story.author ||
              "GIET Community"
            )}
          </strong>

        </p>


        ${body
          .map(
            (paragraph, index) => {

              if (index === 1) {

                return `

                  <blockquote
                    class="pull-quote"
                  >
                    “${esc(quote)}”
                  </blockquote>


                  <p class="dropcap">
                    ${esc(paragraph)}
                  </p>

                `;

              }


              return `

                <p
                  class="${
                    index === 0
                      ? "dropcap"
                      : ""
                  }"
                >
                  ${esc(paragraph)}
                </p>

              `;

            }
          )
          .join("")}


        <div class="author-callout">

          <img
            src="${esc(
              story.authorPhotoURL ||
              story.authorImage ||
              DEFAULT_IMAGE
            )}"
            alt=""
          />


          <div>

            <strong>
              ${esc(
                story.authorName ||
                story.author ||
                "GIET Community"
              )}
            </strong>


            <p>

              ${esc(
                story.authorTitle ||
                "GIET University Alumni"
              )}

              ·

              ${esc(
                story.authorCompany ||
                "Community Contributor"
              )}

            </p>


            <a
              href="profile.html?id=${encodeURIComponent(
                story.authorUid || ""
              )}"
            >
              View Fellow Profile →
            </a>

          </div>

        </div>

      </div>

    `;


  $("#reader-modal")
    .classList.add("open");


  $("#reader-modal")
    .setAttribute(
      "aria-hidden",
      "false"
    );

}


/* =========================================================
   SAVE STORY
   ========================================================= */

function toggleSave(id) {

  const current =
    getSavedStories();


  const alreadySaved =
    current.includes(id);


  const updated =
    alreadySaved

      ? current.filter(
          (item) =>
            item !== id
        )

      : [
          ...current,
          id
        ];


  setSavedStories(updated);


  const activeFilter =
    document.querySelector(
      ".filter-btn.active"
    )?.dataset.category ||
    "All";


  renderStories(
    activeFilter
  );


  if (showToast) {

    showToast(
      alreadySaved
        ? "Removed from saved stories"
        : "Saved to My Saved Stories"
    );

  }

}


/* =========================================================
   CAMPUS SLIDER
   ========================================================= */

function setupSlider() {

  const slider =
    $("#campus-slider");


  const cards =
    $$(".slide-card");


  const dots =
    $("#slider-dots");


  if (
    !slider ||
    !cards.length
  ) {
    return;
  }


  let index = 0;


  /* Create dots */

  cards.forEach(
    (_, cardIndex) => {

      const button =
        document.createElement(
          "button"
        );


      button.className =
        "slider-dot" +
        (
          cardIndex === 0
            ? " active"
            : ""
        );


      button.type =
        "button";


      button.setAttribute(
        "aria-label",
        `Go to slide ${cardIndex + 1}`
      );


      button.addEventListener(
        "click",
        () =>
          goToSlide(
            cardIndex
          )
      );


      dots.appendChild(
        button
      );

    }
  );


  /* Slide */

  function goToSlide(
    newIndex
  ) {

    index =
      (
        newIndex +
        cards.length
      ) %
      cards.length;


    slider.scrollTo({

      left:
        index *
        slider.clientWidth,

      behavior:
        "smooth"

    });


    $$(".slider-dot")
      .forEach(
        (dot, dotIndex) => {

          dot.classList.toggle(
            "active",
            dotIndex === index
          );

        }
      );

  }


  /* Buttons */

  $("#slide-next").onclick =
    () =>
      goToSlide(
        index + 1
      );


  $("#slide-prev").onclick =
    () =>
      goToSlide(
        index - 1
      );


  /* Automatic slider */

  let timer =
    setInterval(
      () =>
        goToSlide(
          index + 1
        ),
      5500
    );


  slider.addEventListener(
    "mouseenter",
    () =>
      clearInterval(timer)
  );


  slider.addEventListener(
    "mouseleave",
    () => {

      timer =
        setInterval(
          () =>
            goToSlide(
              index + 1
            ),
          5500
        );

    }
  );

}


/* =========================================================
   PLACEMENTS
   ========================================================= */

function renderPlacements() {

  const container =
    $("#placement-students");


  if (!container) {
    return;
  }


  /* Highest package first */

  const sortedStudents =
    [...students].sort(
      (a, b) => {

        const packageA =
          parseFloat(
            a.package.replace(
              /[^\d.]/g,
              ""
            )
          );


        const packageB =
          parseFloat(
            b.package.replace(
              /[^\d.]/g,
              ""
            )
          );


        return packageB - packageA;

      }
    );


  /* Render */

  container.innerHTML =
    sortedStudents
      .map(
        (student, index) => {

          const isHighest =
            index === 0;


          return `

            <article
              class="student-placement-card"
            >

              <img
                src="${esc(student.image)}"
                alt="${esc(student.name)}"
                loading="lazy"
              />


              <div class="student-info">

                <h3>
                  ${esc(
                    student.name
                  )}
                </h3>


                <p>

                  <strong>
                    Department:
                  </strong>

                  ${esc(
                    student.department
                  )}

                </p>


                <p>

                  <strong>
                    Branch:
                  </strong>

                  ${esc(
                    student.branch
                  )}

                </p>


                <p>

                  <strong>
                    Academic Year:
                  </strong>

                  ${esc(
                    student.year
                  )}

                </p>


                <div
                  class="student-company"
                >

                  <span>

                    Placed at

                    <br>

                    <strong>
                      ${esc(
                        student.company
                      )}
                    </strong>

                  </span>


                  <strong
                    class="${
                      isHighest
                        ? "package"
                        : ""
                    }"
                  >
                    ${esc(
                      student.package
                    )}
                  </strong>

                </div>

              </div>

            </article>

          `;

        }
      )
      .join("");

}


/* =========================================================
   OPEN PLACEMENTS
   ========================================================= */

function openPlacements() {

  history.pushState(
    { placements: true },
    "",
    `${location.pathname}#placements`
  );


  $("#gazette-main")
    .hidden = true;


  $("#placements-page")
    .hidden = false;


  renderPlacements();


  window.scrollTo({

    top: 0,

    behavior:
      "smooth"

  });

}


/* =========================================================
   CLOSE PLACEMENTS
   ========================================================= */

function closePlacements() {

  if (
    location.hash ===
    "#placements"
  ) {

    history.pushState(
      {},
      "",
      location.pathname
    );

  }


  $("#placements-page")
    .hidden = true;


  $("#gazette-main")
    .hidden = false;


  window.scrollTo({

    top: 0,

    behavior:
      "smooth"

  });

}


/* =========================================================
   HASH SYNC
   ========================================================= */

function syncHash() {

  if (
    location.hash ===
    "#placements"
  ) {

    renderPlacements();


    $("#gazette-main")
      .hidden = true;


    $("#placements-page")
      .hidden = false;

  }

  else {

    $("#placements-page")
      .hidden = true;


    $("#gazette-main")
      .hidden = false;

  }

}


/* =========================================================
   STORY SUBMISSION
   ========================================================= */

function setupSubmit() {

  const modal =
    $("#submit-story-modal");


  if (!modal) {
    return;
  }


  /* Open */

  const open = () => {

    const user =
      getCurrentUser?.();


    if (!user) {

      showToast?.(
        "Please sign in to submit a story."
      );


      window.location.href =
        "auth.html";


      return;

    }


    modal.classList.add(
      "open"
    );


    modal.setAttribute(
      "aria-hidden",
      "false"
    );

  };


  $("#share-story-btn")
    .onclick = open;


  /* Close */

  $$("[data-close-submit]")
    .forEach(
      (button) => {

        button.onclick =
          () => {

            modal.classList.remove(
              "open"
            );


            modal.setAttribute(
              "aria-hidden",
              "true"
            );

          };

      }
    );


  /* Title count */

  $("#story-title")
    .addEventListener(
      "input",
      (event) => {

        $("#title-count")
          .textContent =
          `${event.target.value.length}/120`;

      }
    );


  /* Body count */

  $("#story-body")
    .addEventListener(
      "input",
      (event) => {

        const text =
          event.target.value.trim();


        const words =
          text
            ? text
                .split(/\s+/)
                .length
            : 0;


        $("#body-count")
          .textContent =
          `${words} words`;


        $("#reading-time")
          .textContent =
          `${Math.max(
            1,
            Math.ceil(
              words / 220
            )
          )} min read`;

      }
    );


  /* Image preview */

  $("#story-image")
    .addEventListener(
      "input",
      (event) => {

        const image =
          $("#story-image-preview");


        if (
          event.target.value
        ) {

          image.src =
            event.target.value;


          image.hidden =
            false;

        }

        else {

          image.hidden =
            true;

        }

      }
    );


  /* Submit */

  $("#story-submission-form")
    .onsubmit =
    async (event) => {

      event.preventDefault();


      const user =
        getCurrentUser?.();


      if (!user) {

        showToast?.(
          "Please sign in first."
        );


        return;

      }


      const data = {

        title:
          $("#story-title").value,

        category:
          $("#story-category").value,

        excerpt:
          $("#story-excerpt").value,

        imageUrl:
          $("#story-image").value,

        body:
          $("#story-body").value,

        authorUid:
          user.uid,

        status:
          "pending"

      };


      try {

        await createSubmission(
          data
        );


        modal.classList.remove(
          "open"
        );


        modal.setAttribute(
          "aria-hidden",
          "true"
        );


        event.target.reset();


        $("#story-image-preview")
          .hidden = true;


        $("#title-count")
          .textContent =
          "0/120";


        $("#body-count")
          .textContent =
          "0 words";


        $("#reading-time")
          .textContent =
          "1 min read";


        showToast?.(
          "Story submitted. It is now waiting for moderation."
        );

      }

      catch (error) {

        console.error(
          error
        );


        showToast?.(
          "Could not submit the story. Please try again."
        );

      }

    };

}


/* =========================================================
   GLOBAL CLICK EVENTS
   ========================================================= */

document.addEventListener(
  "click",
  (event) => {

    /* Read story */

    const readButton =
      event.target.closest(
        "[data-read]"
      );


    if (readButton) {

      event.preventDefault();


      openReader(
        findStory(
          readButton.dataset.read
        )
      );

    }


    /* Save story */

    const saveButton =
      event.target.closest(
        "[data-save]"
      );


    if (saveButton) {

      event.preventDefault();


      toggleSave(
        saveButton.dataset.save
      );

    }

  }
);


/* =========================================================
   INITIALIZATION
   ========================================================= */


/* Reader close */

const readerClose =
  $("#close-reader-modal");


if (readerClose) {

  readerClose.onclick =
    () => {

      $("#reader-modal")
        .classList.remove(
          "open"
        );


      $("#reader-modal")
        .setAttribute(
          "aria-hidden",
          "true"
        );

    };

}


/* Placement spotlight */

const placementSpotlight =
  $("#placements-spotlight");


if (placementSpotlight) {

  placementSpotlight.onclick =
    openPlacements;

}


/* Placement back */

const placementBack =
  $("#placements-back");


if (placementBack) {

  placementBack.onclick =
    closePlacements;

}


/* Browser navigation */

window.addEventListener(
  "popstate",
  syncHash
);


window.addEventListener(
  "hashchange",
  syncHash
);


/* News filters */

$$(".filter-btn")
  .forEach(
    (button) => {

      button.addEventListener(
        "click",
        () => {

          $$(".filter-btn")
            .forEach(
              (item) =>
                item.classList.remove(
                  "active"
                )
            );


          button.classList.add(
            "active"
          );


          renderStories(
            button.dataset.category
          );

        }
      );

    }
  );


/* Start components */

setupSlider();

setupSubmit();

syncHash();

renderPlacements();

loadStories();


/*
  Header/Footer are now handled by:

  js/components.js

  The News page does not modify those shared components.
*/

onAuthStateChange?.(
  () => {}
);