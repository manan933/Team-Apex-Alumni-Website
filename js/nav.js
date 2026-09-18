<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title>Alumni News & Gazette | GIET University</title>

  <!-- High-End Editorial & Academic Typography -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,400..800;1,9..40,400..800&family=Newsreader:ital,opsz,wght@0,6..72,300..800;1,6..72,300..800&family=Plus+Jakarta+Sans:ital,wght@0,400..800;1,400..800&display=swap" rel="stylesheet">

  <link rel="stylesheet" href="css/tokens.css">
  <link rel="stylesheet" href="css/base.css">
  <link rel="stylesheet" href="css/components.css">
  <link rel="stylesheet" href="css/pages/news.css">
</head>

<body>

  <!-- =====================================================
       REUSABLE HEADER
  ====================================================== -->

  <div id="site-header-container"></div>


  <main>

    <!-- =====================================================
         HERO
    ====================================================== -->

    <section class="news-hero">

      <div class="hero-copy animate-enter">

        <div class="hero-label">
          ALUMNI STORIES · RESEARCH · GLOBAL ACHIEVEMENTS
        </div>

        <h1>
          Stories that <em>move us forward.</em>
        </h1>

        <p class="hero-intro">
          Discover the leaders, pioneers, technical breakthroughs, and shared memories
          shaping the 24,000+ strong GIET University global alumni network.
        </p>

        <div class="hero-actions">
          <button class="hero-scroll-btn" id="hero-explore-btn">
            Explore Stories ↓
          </button>
        </div>

        <!-- Institutional Highlights Strip -->
        <div class="hero-stats-strip">
          <div class="stat-pill">
            <strong>24,000+</strong>
            <span>Global Alumni</span>
          </div>
          <div class="stat-divider">·</div>
          <div class="stat-pill">
            <strong>42+</strong>
            <span>Countries Represented</span>
          </div>
          <div class="stat-divider">·</div>
          <div class="stat-pill">
            <strong>450+</strong>
            <span>Industry Partners</span>
          </div>
          <div class="stat-divider">·</div>
          <div class="stat-pill">
            <strong>₹13 LPA</strong>
            <span>Top Tier Placements</span>
          </div>
        </div>

      </div>

      <div class="hero-decoration" aria-hidden="true">
        <span>GIET</span>
        <span>ALUMNI</span>
        <span>GAZETTE</span>
      </div>

    </section>


    <!-- =====================================================
         SEARCH + FILTER TOOLBAR
    ====================================================== -->

    <section class="news-toolbar reveal-on-scroll">

      <div class="news-search">

        <span class="search-icon">⌕</span>

        <input
          type="search"
          id="news-search-input"
          placeholder="Search by name, company, breakthrough, or category..."
          aria-label="Search alumni news"
        >

      </div>


      <div class="filter-row" id="news-category-filters">

        <button class="filter-btn active" data-category="all">
          All Stories
        </button>

        <button class="filter-btn" data-category="Achievement">
          Alumni Achievements
        </button>

        <button class="filter-btn" data-category="Career">
          Career & Leadership
        </button>

        <button class="filter-btn" data-category="Campus">
          Campus Milestones
        </button>

        <button class="filter-btn" data-category="Events">
          Reunions & Events
        </button>

        <button class="filter-btn" data-category="Startups">
          Startups & Ventures
        </button>

        <button class="filter-btn" data-category="Awards">
          Honor & Awards
        </button>

        <button class="filter-btn" data-category="Research">
          Research & Tech
        </button>

        <button class="filter-btn" data-category="Announcements">
          Announcements
        </button>

        <button class="filter-btn" data-category="Saved">
          Saved Stories
        </button>

      </div>


      <button id="share-story-btn" class="share-story-btn">
        + Share Your Story
      </button>

    </section>


    <!-- =====================================================
         FEATURED STORIES
    ====================================================== -->

    <section class="news-section featured-section reveal-on-scroll" id="featured-stories">

      <div class="section-heading">

        <div>
          <h2>Featured Stories</h2>
        </div>

        <p>
          Curated investigative long-form journalism and alumni spotlights.
        </p>

      </div>


      <div class="featured-layout">

        <!-- LARGE FEATURE -->

        <article
          class="featured-main story-jump"
          data-feature-target="stories-essays"
        >

          <div class="featured-image">

            <img
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1800&q=85"
              alt="Students and alumni collaborate"
            >

            <div class="slide-overlay">

              <div class="slide-overlay-content">

                <span class="featured-tag">LEAD EDITORIAL COVER</span>

                <h3>
                  From Campus Innovation Labs to Leading Multi-Million Dollar Global Programs
                </h3>

                <p>
                  How five GIET engineering graduates built India's next-generation edge computing architecture, scaling from semester capstone projects into an internationally acclaimed venture.
                </p>

                <div class="featured-byline">
                  <span>By Editorial Board · 7 min read · Volume 14 Edition</span>
                </div>

                <strong>
                  Read Full Story →
                </strong>

              </div>

            </div>

          </div>

        </article>


        <!-- SMALL FEATURES -->

        <div class="featured-side">

          <article
            class="featured-small story-jump"
            data-feature-target="campus-milestones"
          >

            <img
              src="https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=1000&q=85"
              alt="University campus"
            >

            <div class="small-overlay">

              <div>
                <small>CAMPUS ADVANCEMENT</small>

                <h3>
                  State-of-the-Art Autonomous Systems & Robotics Research Center Inaugurated
                </h3>

                <p class="small-excerpt">
                  A ₹4.5 Crore collaborative research facility co-funded by distinguished alumni.
                </p>
              </div>

            </div>

          </article>


          <article
            class="featured-small story-jump"
            data-feature-target="breakthroughs"
          >

            <img
              src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1000&q=85"
              alt="Innovation and teamwork"
            >

            <div class="small-overlay">

              <div>
                <small>STARTUP MILESTONES</small>

                <h3>
                  Alumni Founded Clean-Tech Venture Secures Pre-Series A Funding
                </h3>

                <p class="small-excerpt">
                  Empowering rural agricultural micro-grids across Eastern India.
                </p>
              </div>

            </div>

          </article>

        </div>

      </div>

    </section>


    <!-- =====================================================
         RECENT PLACEMENTS
    ====================================================== -->

    <section class="placement-spotlight reveal-on-scroll">

      <div class="placement-spotlight-copy">

        <span class="eyebrow">CAREER ACCELERATION</span>

        <h2>
          Where our alumni are
          <em>going next.</em>
        </h2>

        <p>
          From tier-1 silicon engineering and cloud computing giants to prestigious management consultancies, GIET graduates continue setting industry benchmarks across the globe.
        </p>

        <!-- Placement Stats Overview -->
        <div class="placement-key-metrics">
          <div class="metric-item">
            <strong>₹13 LPA</strong>
            <span>Highest Package</span>
          </div>
          <div class="metric-item">
            <strong>280+</strong>
            <span>Offers Extended</span>
          </div>
          <div class="metric-item">
            <strong>40+</strong>
            <span>Fortune 500 Recruiters</span>
          </div>
        </div>

        <div class="recruiter-tags">
          <span>Microsoft</span>
          <span>Deloitte</span>
          <span>Amazon</span>
          <span>TCS</span>
          <span>Capgemini</span>
          <span>Infosys</span>
        </div>

        <button id="open-placement-directory">
          View Complete Placement Directory →
        </button>

      </div>


      <div class="placement-highlight-card">

        <div class="placement-highlight-image">

          <img
            src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=85"
            alt="Professional team"
          >

          <div class="placement-package">
            ₹13 LPA
          </div>

        </div>

        <div class="placement-highlight-content">

          <span>FEATURED PLACEMENT SPOTLIGHT</span>

          <h3>
            Aarav Das
          </h3>

          <p>
            B.Tech in CSE-AIML · Class of 2023–2027
          </p>

          <div class="role-designation">
            Software Development Engineer — Cloud Infrastructure
          </div>

          <strong>
            Microsoft Corporation
          </strong>

        </div>

      </div>

    </section>


    <!-- =====================================================
         LATEST FROM GIET
    ====================================================== -->

    <section class="news-section reveal-on-scroll" id="latest-giet">

      <div class="section-heading">

        <div>
          <h2>Latest from GIET</h2>
        </div>

        <p>
          Live submissions, verified peer articles, and department updates.
        </p>

      </div>


      <div class="latest-layout">

        <div id="news-grid" class="news-grid">

          <!-- Dynamic approved stories appear here -->

        </div>


        <aside class="trending-panel">

          <div class="trending-title">
            TRENDING INSIGHTS & DISCUSSIONS
          </div>

          <ol>

            <li>
              <div>
                <p>AI Infrastructure & Semiconductor Design Careers for 2027 Graduates</p>
                <small>68 comments · 4 min read</small>
              </div>
            </li>

            <li>
              <div>
                <p>Alumni Angel Network announces ₹1 Crore seed fund for student startups</p>
                <small>142 upvotes · Campus Notice</small>
              </div>
            </li>

            <li>
              <div>
                <p>GIET Global Chapter Meetups scheduled across Bangalore, London & Dallas</p>
                <small>Events · Register Now</small>
              </div>
            </li>

            <li>
              <div>
                <p>Industry Mentor Fellowship: Over 80 senior executive alumni open 1-on-1 slots</p>
                <small>Mentorship Program</small>
              </div>
            </li>

            <li>
              <div>
                <p>Department of Electrical Engineering receives National Accreditation honor</p>
                <small>Official Commendation</small>
              </div>
            </li>

          </ol>

        </aside>

      </div>

    </section>


    <!-- =====================================================
         STORIES & ESSAYS
    ====================================================== -->

    <section class="news-section image-story-section reveal-on-scroll" id="stories-essays">

      <div class="section-heading">

        <div>
          <h2>Stories & Essays</h2>
        </div>

        <p>
          First-person perspectives, career transitions, and nostalgic reflections.
        </p>

      </div>


      <div class="image-story-grid">

        <article class="image-story-card">

          <div class="image-story-image">

            <img
              src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=85"
              alt="Alumni working together"
            >

            <span class="card-badge">CAREER ESSAY</span>

          </div>

          <div class="image-story-content">

            <small>CAREER CHRONICLE · 06 MIN READ</small>

            <h3>
              From Classroom to Silicon Valley: Demystifying the First 1,000 Days
            </h3>

            <p>
              By Rashmi Ranjan Panda ('18), Senior Platform Architect. How mastering data structures in lab 3 laid the technical foundation for building high-concurrency distributed engines.
            </p>

            <button class="story-action" data-scroll-target="latest-giet">
              Read Essay →
            </button>

          </div>

        </article>


        <article class="image-story-card">

          <div class="image-story-image">

            <img
              src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=85"
              alt="Friends and alumni"
            >

            <span class="card-badge">CAMPUS NOSTALGIA</span>

          </div>

          <div class="image-story-content">

            <small>CAMPUS ESSAY · 04 MIN READ</small>

            <h3>
              The Late Nights at Gunupur: The Friendships that Built Companies
            </h3>

            <p>
              By Priya Patnaik ('20), Co-founder of AgroTech Labs. A candid reflection on late-night canteen brainstorms that turned into sustainable tech ventures.
            </p>

            <button class="story-action" data-scroll-target="latest-giet">
              Explore Story →
            </button>

          </div>

        </article>


        <article class="image-story-card">

          <div class="image-story-image">

            <img
              src="https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=1200&q=85"
              alt="University community"
            >

            <span class="card-badge">GLOBAL PERSPECTIVE</span>

          </div>

          <div class="image-story-content">

            <small>ALUMNI JOURNEY · 05 MIN READ</small>

            <h3>
              Across Three Continents: Carrying the GIET Spirit Worldwide
            </h3>

            <p>
              By Debasish Jena ('16), Lead Renewable Energy Consultant in Frankfurt. Navigating international research grants and global sustainability transitions.
            </p>

            <button class="story-action" data-scroll-target="alumni-spotlight">
              Meet Author →
            </button>

          </div>

        </article>

      </div>

    </section>


    <!-- =====================================================
         ALUMNI SPOTLIGHT
    ====================================================== -->

    <section class="spotlight-section reveal-on-scroll" id="alumni-spotlight">

      <div class="spotlight-image">

        <img
          src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=1200&q=85"
          alt="Alumni spotlight"
        >

      </div>

      <div class="spotlight-content">

        <span class="eyebrow">
          DISTINGUISHED FELLOW SPOTLIGHT
        </span>

        <h2>
          Anushka Palo
        </h2>

        <h3>
          National Program Lead, Wooble Technologies
        </h3>

        <p class="spotlight-role">
          B.Tech in Computer Science & Engineering · Former Data Science Club President
        </p>

        <blockquote>
          “Every hackathon project we debugged until sunrise at GIET was not just coursework; it became our real-world blueprint for leading cross-functional engineering teams across the country.”
        </blockquote>

        <div class="spotlight-achievements">
          <div>
            <strong>1,500+</strong>
            <span>Students Mentored</span>
          </div>
          <div>
            <strong>12+</strong>
            <span>National Hackathons Judged</span>
          </div>
          <div>
            <strong>Forbes 30 Under 30</strong>
            <span>Nominated Pioneer</span>
          </div>
        </div>

        <button class="spotlight-button">
          View Fellow Profile →
        </button>

      </div>

    </section>


    <!-- =====================================================
         BREAKTHROUGHS
    ====================================================== -->

    <section class="news-section image-story-section reveal-on-scroll" id="breakthroughs">

      <div class="section-heading">

        <div>
          <h2>Breakthroughs & Innovations</h2>
        </div>

        <p>
          Patents, published research papers, and disruptive student-led technologies.
        </p>

      </div>


      <div class="image-story-grid">

        <article class="image-story-card">

          <div class="image-story-image">

            <img
              src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=85"
              alt="Student technology project"
            >

            <span class="card-badge">AI & MACHINE LEARNING</span>

          </div>

          <div class="image-story-content">

            <small>PATENT APPLIED · COMPUTING</small>

            <h3>
              Low-Power Edge Neural Network for Diagnostic Soil Analysis
            </h3>

            <p>
              Engineered by third-year ECE & AIML cohorts in collaboration with agricultural alumni mentors. Successfully tested across 12 farming cooperatives.
            </p>

            <button class="story-action" data-scroll-target="latest-giet">
              Read Research Summary →
            </button>

          </div>

        </article>


        <article class="image-story-card">

          <div class="image-story-image">

            <img
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=85"
              alt="Competition team"
            >

            <span class="card-badge">NATIONAL HONORS</span>

          </div>

          <div class="image-story-content">

            <small>GRAND PRIX · TECH COMPETITIONS</small>

            <h3>
              Team GIET Secures 1st Place at National Smart Mobility Hackathon
            </h3>

            <p>
              Outperforming 240 collegiate teams nationwide with an intelligent telematics algorithm reducing battery degradation in commercial electric vehicles.
            </p>

            <button class="story-action" data-scroll-target="latest-giet">
              View Competition Details →
            </button>

          </div>

        </article>


        <article class="image-story-card">

          <div class="image-story-image">

            <img
              src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=85"
              alt="Research and innovation"
            >

            <span class="card-badge">SUSTAINABLE MATERIALS</span>

          </div>

          <div class="image-story-content">

            <small>PEER-REVIEWED PUBLICATION · IEEE</small>

            <h3>
              Composite Eco-Concretes: Sustainable Urban Infrastructure Paper
            </h3>

            <p>
              Published in the International Journal of Sustainable Engineering by Civil Engineering research fellows and industrial advisors.
            </p>

            <button class="story-action" data-scroll-target="latest-giet">
              View Citation & Abstract →
            </button>

          </div>

        </article>

      </div>

    </section>


    <!-- =====================================================
         CAMPUS MILESTONES
    ====================================================== -->

    <section class="news-section milestones-section reveal-on-scroll" id="campus-milestones">

      <div class="section-heading">

        <div>
          <h2>Campus Milestones</h2>
        </div>

        <p>
          Expanding academic horizons, world-class facilities, and institutional legacy.
        </p>

      </div>


      <div class="milestone-grid">

        <article class="milestone-card">

          <div class="milestone-image">

            <img
              src="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=85"
              alt="Academic campus"
            >

            <span class="milestone-badge">INFRASTRUCTURE</span>

          </div>

          <div class="milestone-content">

            <small>ACADEMIC EXCELLENCE</small>

            <h3>
              New 10,000 Sq. Ft. High-Performance Computing Cluster
            </h3>

            <p>
              Equipped with enterprise GPUs and dedicated quantum computing simulators to support interdisciplinary PhD and postgraduate data engineering labs.
            </p>

          </div>

        </article>


        <article class="milestone-card">

          <div class="milestone-image">

            <img
              src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=85"
              alt="Campus event"
            >

            <span class="milestone-badge">GLOBAL CONCLAVE</span>

          </div>

          <div class="milestone-content">

            <small>ALUMNI CONVENTION</small>

            <h3>
              Annual Global Alumni Homecoming: 2,400+ Delegates Convene
            </h3>

            <p>
              Distinguished graduates from 14 batches returned to campus for mentorship roundtables, career recruitment fair booths, and endowed scholarship ceremonies.
            </p>

          </div>

        </article>


        <article class="milestone-card">

          <div class="milestone-image">

            <img
              src="https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1200&q=85"
              alt="Graduation celebration"
            >

            <span class="milestone-badge">SCHOLARSHIPS</span>

          </div>

          <div class="milestone-content">

            <small>STUDENT WELFARE</small>

            <h3>
              Alumni Merit Endowment Crosses ₹2.2 Crore Corpus
            </h3>

            <p>
              Directly financing 100% full-ride tuition scholarships for underprivileged rural STEM candidates demonstrating exceptional engineering aptitude.
            </p>

          </div>

        </article>

      </div>

    </section>


    <!-- =====================================================
         THIS WEEK
    ====================================================== -->

    <section class="weekly-news-section reveal-on-scroll">

      <div class="section-heading">

        <div>
          <h2>This Week in Alumni News</h2>
        </div>

        <p>
          High-velocity community updates and quick announcements.
        </p>

      </div>


      <div class="weekly-grid">

        <div class="weekly-item">
          <span>🎓</span>
          <strong>14 Alumni</strong>
          <p>Promoted to Director / VP</p>
        </div>

        <div class="weekly-item">
          <span>🏆</span>
          <strong>3 Fellowships</strong>
          <p>Won in Global Competitions</p>
        </div>

        <div class="weekly-item">
          <span>🚀</span>
          <strong>2 Startups</strong>
          <p>Completed Seed Funding Rounds</p>
        </div>

        <div class="weekly-item">
          <span>💼</span>
          <strong>18 Roles</strong>
          <p>Posted Exclusively for GIET Alumni</p>
        </div>

        <div class="weekly-item">
          <span>🌍</span>
          <strong>Bangalore Meet</strong>
          <p>Attended by 320+ Tech Alumni</p>
        </div>

        <div class="weekly-item">
          <span>📚</span>
          <strong>5 Papers</strong>
          <p>Accepted into IEEE / Scopus</p>
        </div>

      </div>

    </section>


    <!-- =====================================================
         DIGITAL GAZETTE
    ====================================================== -->

    <section class="gazette-section reveal-on-scroll">

      <div class="gazette-cover">

        <div class="gazette-cover-top">
          OFFICIAL UNIVERSITY ARCHIVE · THE ALUMNI GAZETTE
        </div>

        <div class="gazette-cover-main">

          <span>SEPTEMBER 2026 EDITION · VOLUME 14, ISSUE 3</span>

          <h2>
            Stories that
            <em>move us forward.</em>
          </h2>

          <p>
            An 84-page comprehensive journal documenting high-impact research, alumni executive interviews, venture showcases, and archival retrospective photographs.
          </p>

        </div>

        <button id="read-gazette-btn">
          📖 Read Full Digital Edition
        </button>

      </div>

    </section>


    <!-- =====================================================
         NEWS + VIDEO
    ====================================================== -->

    <section class="news-section media-section reveal-on-scroll">

      <div class="section-heading">

        <div>
          <h2>News + Video</h2>
        </div>

        <p>
          Cinematic documentary shorts and campus festival recordings.
        </p>

      </div>


      <article class="video-news-card">

        <div class="video-thumbnail">

          <img
            src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1600&q=85"
            alt="Alumni event"
          >

          <button id="watch-video-btn" class="play-button" aria-label="Play video highlights">
            ▶
          </button>

        </div>


        <div class="video-news-copy">

          <span>DOCUMENTARY ARCHIVE</span>

          <h3>
            Alumni Conclave 2026: The Legacy of Innovation
          </h3>

          <p>
            Watch emotional reunions, keynote addresses from industry pioneers, and the unveiling of the new Innovation Quadrangle at GIET University.
          </p>

          <button id="watch-video-text">
            Watch Full 14-Minute Feature →
          </button>

        </div>

      </article>

    </section>


    <!-- =====================================================
         NEWS GALLERY (WITH CONTEXT POPUP)
    ====================================================== -->

    <section class="news-section gallery-section reveal-on-scroll">

      <div class="section-heading">

        <div>
          <h2>News Gallery</h2>
        </div>

        <p>
          Click any photograph to view full context, event details, and alumni memoirs.
        </p>

      </div>


      <div class="gallery-grid">

        <button
          class="gallery-item"
          data-gallery-image="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1800&q=90"
          data-gallery-title="Annual Alumni Homecoming Gala 2026"
          data-gallery-tag="CAMPUS REUNION"
          data-gallery-caption="Over 1,200 alumni gathered at the Central Amphitheatre celebrating three decades of engineering leadership, honoring founding professors, and establishing new career endowments."
          data-gallery-date="September 2026 · Main Amphitheatre, GIET Campus"
        >
          <img src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=900&q=85" alt="Alumni event">
          <div class="gallery-item-overlay">
            <span>View Story ↗</span>
          </div>
        </button>

        <button
          class="gallery-item"
          data-gallery-image="https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1800&q=90"
          data-gallery-title="Convocation & Silver Jubilee Ceremony"
          data-gallery-tag="CONVOCATION"
          data-gallery-caption="Commemorating 25 graduating batches of engineers, technologists, and researchers with medals of honor presented by state education dignitaries."
          data-gallery-date="August 2026 · University Convention Hall"
        >
          <img src="https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=900&q=85" alt="University event">
          <div class="gallery-item-overlay">
            <span>View Story ↗</span>
          </div>
        </button>

        <button
          class="gallery-item"
          data-gallery-image="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1800&q=90"
          data-gallery-title="Inter-Batch Technical Mentorship Workshop"
          data-gallery-tag="TECH WORKSHOP"
          data-gallery-caption="Senior software engineers and engineering managers guiding third-year students on system architecture, microservices, and modern artificial intelligence tooling."
          data-gallery-date="July 2026 · Center for Innovation & Research"
        >
          <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=85" alt="Students and alumni">
          <div class="gallery-item-overlay">
            <span>View Story ↗</span>
          </div>
        </button>

        <button
          class="gallery-item"
          data-gallery-image="https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1800&q=90"
          data-gallery-title="Bangalore Tech Chapter Alumni Dinner"
          data-gallery-tag="METRO CHAPTER"
          data-gallery-caption="The GIET Bangalore Alumni Chapter gathered over 300 engineering leads and startup founders for an evening of angel networking and cross-company collaboration."
          data-gallery-date="June 2026 · The Leela Palace, Bengaluru"
        >
          <img src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=900&q=85" alt="Community gathering">
          <div class="gallery-item-overlay">
            <span>View Story ↗</span>
          </div>
        </button>

      </div>

    </section>


    <!-- =====================================================
         ALUMNI TIMELINE
    ====================================================== -->

    <section class="timeline-section reveal-on-scroll">

      <div class="section-heading">

        <div>
          <h2>Alumni Timeline</h2>
        </div>

        <p>
          Chronological journal of community milestones, honors, and breakthroughs.
        </p>

      </div>


      <div class="timeline">

        <article class="timeline-item">

          <time>18 SEP</time>

          <div class="timeline-content">
            <span class="timeline-icon">🏆</span>
            <div>
              <h3>Alumni Team Honored with National Clean-Tech Innovation Award</h3>
              <p>Recognized by the Ministry of Science and Technology for scaling modular solar micro-inverters across 600 rural communities.</p>
            </div>
          </div>

        </article>


        <article class="timeline-item">

          <time>15 SEP</time>

          <div class="timeline-content">
            <span class="timeline-icon">💼</span>
            <div>
              <h3>Batch of '27 Graduate Aarav Das Appointed SDE at Microsoft</h3>
              <p>Joins the Azure Cognitive Services infrastructure engineering team headquartered in Hyderabad.</p>
            </div>
          </div>

        </article>


        <article class="timeline-item">

          <time>12 SEP</time>

          <div class="timeline-content">
            <span class="timeline-icon">🚀</span>
            <div>
              <h3>Alumni-Founded DeepTech Enterprise Unveils Autonomous Drone Suite</h3>
              <p>AeroGrid Systems announces general availability of its high-precision agricultural LiDAR scanning payloads.</p>
            </div>
          </div>

        </article>


        <article class="timeline-item">

          <time>08 SEP</time>

          <div class="timeline-content">
            <span class="timeline-icon">🤝</span>
            <div>
              <h3>South India Alumni Chapter Meet Held in Bengaluru</h3>
              <p>320 alumni across tech, aerospace, and finance shared industry roadmaps with upcoming graduates.</p>
            </div>
          </div>

        </article>


        <article class="timeline-item">

          <time>05 SEP</time>

          <div class="timeline-content">
            <span class="timeline-icon">🎓</span>
            <div>
              <h3>Executive Alumni Mentorship Cohort Launches</h3>
              <p>50 pre-final year students paired with VP and Principal Engineer alumni across FAANG and global firms.</p>
            </div>
          </div>

        </article>

      </div>

    </section>


    <!-- =====================================================
         ALUMNI MILESTONES
    ====================================================== -->

    <section class="milestone-icons-section reveal-on-scroll">

      <div class="section-heading">

        <div>
          <h2>Alumni Milestones</h2>
        </div>

        <p>
          Quick filter by career milestone type and community celebration.
        </p>

      </div>


      <div class="milestone-icons">

        <button>
          <span>🎓</span>
          <strong>Graduation</strong>
          <small>Class of 2026</small>
        </button>

        <button>
          <span>💼</span>
          <strong>New Role</strong>
          <small>Promotions & Moves</small>
        </button>

        <button>
          <span>🏆</span>
          <strong>Honors</strong>
          <small>National Awards</small>
        </button>

        <button>
          <span>🚀</span>
          <strong>Startups</strong>
          <small>Funded Ventures</small>
        </button>

        <button>
          <span>📚</span>
          <strong>Research</strong>
          <small>Peer Publications</small>
        </button>

        <button>
          <span>🌍</span>
          <strong>Global</strong>
          <small>International Roles</small>
        </button>

      </div>

    </section>


    <!-- =====================================================
         PLACEMENT DIRECTORY
    ====================================================== -->

    <section id="placements" class="placement-directory">

      <div class="section-heading">

        <div>
          <h2>Recent Placements Directory</h2>
        </div>

        <button id="close-placement-directory">
          ← Back to Newsroom
        </button>

      </div>


      <div id="placement-grid" class="placement-grid">
        <!-- JS inserts placement cards -->
      </div>

    </section>


    <!-- =====================================================
         DONATION / SUPPORT
    ====================================================== -->

    <section class="support-section reveal-on-scroll">

      <div>

        <span class="eyebrow">
          GIVE BACK TO YOUR ALMA MATER
        </span>

        <h2>
          Help the next generation
          <em>move forward.</em>
        </h2>

        <p>
          Your contributions endow student scholarships, upgrade experimental laboratories, sponsor national hackathon teams, and ensure no promising mind is held back by financial need.
        </p>

      </div>

      <button id="donate-btn">
        Support GIET Endowment Fund →
      </button>

    </section>

  </main>


  <!-- =====================================================
       READER MODAL
  ====================================================== -->

  <div
    id="reader-modal"
    class="modal-overlay"
    aria-hidden="true"
  >

    <div class="reader-modal">

      <button
        id="close-reader-modal"
        class="modal-close"
        aria-label="Close reader"
      >
        ×
      </button>

      <div id="reader-modal-body"></div>

    </div>

  </div>


  <!-- =====================================================
       GALLERY MODAL WITH CONTEXT BELOW IMAGE
  ====================================================== -->

  <div
    id="gallery-modal"
    class="modal-overlay"
    aria-hidden="true"
  >

    <div class="gallery-modal-card">

      <button id="close-gallery-modal" class="modal-close" aria-label="Close gallery preview">
        ×
      </button>

      <div class="gallery-modal-image-wrap">
        <img id="gallery-modal-image" src="" alt="Gallery preview">
      </div>

      <!-- Rich Context Written Below The Image -->
      <div class="gallery-modal-caption-wrap" id="gallery-modal-caption-wrap">
        <div class="gallery-caption-header">
          <span class="gallery-tag-pill" id="gallery-modal-tag">MOMENT</span>
          <span class="gallery-date-pill" id="gallery-modal-date">DATE</span>
        </div>
        <h3 id="gallery-modal-title">Event Title</h3>
        <p id="gallery-modal-desc">Detailed context and story behind this photograph will appear here.</p>
      </div>

    </div>

  </div>


  <!-- =====================================================
       VIDEO MODAL
  ====================================================== -->

  <div
    id="video-modal"
    class="modal-overlay"
    aria-hidden="true"
  >

    <div class="video-modal">

      <button id="close-video-modal" class="modal-close" aria-label="Close video player">
        ×
      </button>

      <div class="video-placeholder">

        <div>▶</div>

        <h3>
          Alumni Meet 2026 — Highlights
        </h3>

        <p>
          Official video broadcast stream connects here.
        </p>

      </div>

    </div>

  </div>


  <!-- =====================================================
       GAZETTE MODAL
  ====================================================== -->

  <div
    id="gazette-modal"
    class="modal-overlay"
    aria-hidden="true"
  >

    <div class="gazette-modal">

      <button id="close-gazette-modal" class="modal-close" aria-label="Close gazette view">
        ×
      </button>

      <div class="gazette-reader">

        <span>SEPTEMBER 2026 EDITION · VOLUME 14</span>

        <h2>
          The Alumni Gazette
        </h2>

        <div class="gazette-lines">

          <p>
            ✨ Lead Cover Feature: Edge AI Architecture for Smart Grids
          </p>

          <p>
            🏛️ Campus Infrastructure: The 10,000 Sq. Ft. HPC Center
          </p>

          <p>
            🚀 Venture Dispatch: 4 Alumni Startups Securing Angel Rounds
          </p>

          <p>
            🤝 Career Milestones: Microsoft, Deloitte & Amazon Cohorts
          </p>

          <p>
            📅 Upcoming Events: London & North American Chapter Reunions
          </p>

        </div>

      </div>

    </div>

  </div>


  <!-- =====================================================
       SUBMISSION MODAL
  ====================================================== -->

  <div
    id="submit-story-modal"
    class="modal-overlay"
    aria-hidden="true"
  >

    <div class="submit-modal">

      <button
        id="close-submit-modal"
        class="modal-close"
        aria-label="Close submission form"
      >
        ×
      </button>

      <div class="submit-header">

        <span class="eyebrow">
          ALUMNI NEWSROOM DESK
        </span>

        <h2>
          Share Your Story
        </h2>

        <p>
          Submit your career transition, breakthrough research, or student memory for review by the GIET alumni editorial board.
        </p>

      </div>


      <form id="story-submission-form">

        <label>
          Story Title

          <input
            id="story-title"
            type="text"
            required
            maxlength="150"
            placeholder="e.g., Scaling My First Cloud Architecture at Amazon"
          >

        </label>


        <label>
          Category

          <select id="story-category" required>

            <option value="">
              Select Category
            </option>

            <option value="News">
              News & Announcements
            </option>

            <option value="Story">
              Stories & Career Essays
            </option>

            <option value="Achievement">
              Awards & Breakthroughs
            </option>

          </select>

        </label>


        <label>
          Short Excerpt

          <textarea
            id="story-excerpt"
            rows="3"
            maxlength="300"
            placeholder="A compelling 2-sentence summary that grabs readers' attention..."
          ></textarea>

        </label>


        <label>
          Image URL (Optional)

          <input
            id="story-image"
            type="url"
            placeholder="https://images.unsplash.com/..."
          >

        </label>


        <div
          id="story-image-preview"
          class="story-image-preview"
        ></div>


        <label>
          Full Article Body

          <textarea
            id="story-body"
            rows="10"
            required
            placeholder="Share the full narrative, lessons learned, and advice for the GIET community..."
          ></textarea>

        </label>


        <div class="submission-meta">

          <span id="story-word-count">
            0 words
          </span>

          <span id="story-reading-time">
            0 min read
          </span>

        </div>


        <button
          type="submit"
          class="submit-story-button"
        >
          Submit for Editorial Moderation →
        </button>

      </form>

    </div>

  </div>


  <!-- =====================================================
       FOOTER
  ====================================================== -->

  <div id="site-footer-container"></div>


  <!-- =====================================================
       SCRIPTS
  ====================================================== -->

  <script type="module" src="js/components.js"></script>
  <script type="module" src="js/nav.js"></script>
  <script type="module" src="js/pages/news.js"></script>

</body>
</html>