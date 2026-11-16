/**
 * NETFLIX CINEMATIC THEME LAYOUT (Billboard Hero & Horizontal Carousels)
 * Spec:
 * - Nav: Transparent-to-solid on scroll with bold "JNANE-FLIX" wordmark, profile avatar & switcher.
 * - Hero: Full-bleed "Billboard" with dark gradient scrim, giant bold title, "Play Demo" and "More Info" CTAs, maturity rating chip (TV-MA: Backend Heavy), 99% Match badge.
 * - Projects & Skills: Horizontal SCROLL-SNAPPING CAROUSELS with 16:9 / 2:3 cards and hover preview expansion.
 * - Profile Modal: "Who's watching?" profile picker (Recruiter / Systems Architect / Peer).
 * - Experience: "Seasons & Episodes" documentary list.
 * - Type: Bold grotesque display (Bebas Neue / Montserrat / Impact-like) with N-Red accents.
 */

(function () {
  'use strict';

  window.THEME_LAYOUTS = window.THEME_LAYOUTS || {};

  window.THEME_LAYOUTS['netflix'] = {
    id: 'netflix',
    name: 'Netflix Cinematic',
    fontFamily: "'Bebas Neue', 'Montserrat', 'Impact', 'Inter', sans-serif",
    patterns: {
      nav: 'Transparent-to-black scroll nav with crimson JNANE-FLIX wordmark and user avatar switcher',
      hero: 'Giant full-bleed Billboard hero with gradient scrim, TV-MA rating chip, and Play/Info CTAs',
      about: 'Production Story synopsis featurette with creator specifications and credits',
      skills: 'Horizontal scroll-snapping media carousel of skill categories with cover artwork cards',
      projects: 'Horizontal scroll-snapping poster carousels with left/right carousel arrows and hover expansion',
      experience: 'Seasons & Episodes documentary track with release years and episode breakdown',
      contact: 'Netflix Help Center & Direct Casting form with dark cinema styling',
      footer: 'Cinematic footer grid with streaming service inspired navigation'
    },

    render: function (data) {
      const p = data.profile;
      const projects = data.projects;
      const skills = data.skills;

      return `
        <!-- NETFLIX TOP NAV (Transparent to Black) -->
        <nav id="navbar" class="nflx-nav" aria-label="Netflix Cinematic Navigation">
          <div class="nflx-nav-left">
            <a href="#hero" class="nflx-wordmark">JNANE-FLIX</a>
            <ul class="nflx-nav-menu">
              <li><a href="#hero" class="active">Home</a></li>
              <li><a href="#projects">Series & Projects</a></li>
              <li><a href="#skills">Skills Toolkit</a></li>
              <li><a href="#about">About & Cast</a></li>
              <li><a href="#experience">Episodes (Timeline)</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
          <div class="nflx-nav-right">
            <div class="nflx-search-icon" title="Search catalog">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </div>
            <button class="nflx-profile-avatar" id="nflx-profile-btn" aria-label="Who is Watching Profile Switcher">
              <span class="nflx-avatar-box">Recruiter</span>
              <span class="nflx-caret">▼</span>
            </button>
            <div id="theme-menu-slot" class="nflx-theme-slot"></div>
          </div>
        </nav>

        <!-- WHO'S WATCHING MODAL -->
        <div class="nflx-modal-backdrop" id="nflx-profile-modal">
          <div class="nflx-profile-modal-content">
            <h2 class="nflx-profile-title">Who's Watching?</h2>
            <div class="nflx-profiles-row">
              <div class="nflx-profile-card active" data-profile="recruiter">
                <div class="nflx-profile-icon icon-recruiter">👔</div>
                <span class="nflx-profile-name">Tech Recruiter</span>
                <span class="nflx-profile-desc">Focus: SDE Hiring, TPS, Internships</span>
              </div>
              <div class="nflx-profile-card" data-profile="architect">
                <div class="nflx-profile-icon icon-architect">⚡</div>
                <span class="nflx-profile-name">Systems Architect</span>
                <span class="nflx-profile-desc">Focus: Concurrency, Paper API, Microservices</span>
              </div>
              <div class="nflx-profile-card" data-profile="student">
                <div class="nflx-profile-icon icon-student">🎓</div>
                <span class="nflx-profile-name">Student & Peer</span>
                <span class="nflx-profile-desc">Focus: VCET / VTU Projects & LeetCode</span>
              </div>
            </div>
            <button class="nflx-btn nflx-btn-ghost" id="nflx-close-profile-btn">Proceed to Stream</button>
          </div>
        </div>

        <main id="main-content" class="nflx-main">
          <!-- NETFLIX BILLBOARD HERO -->
          <section id="hero" class="nflx-billboard">
            <div class="nflx-billboard-bg" aria-hidden="true">
              <div class="nflx-billboard-scrim"></div>
            </div>

            <div class="nflx-billboard-content">
              <div class="nflx-badges-row">
                <span class="nflx-top10-badge"><span class="nflx-n">N</span> TOP 10 IN BACKEND SYSTEMS</span>
                <span class="nflx-match-pill">99% Match for SDE Roles</span>
              </div>
              <h1 class="nflx-title">${p.name}</h1>
              <div class="nflx-meta-row">
                <span class="nflx-maturity-chip">TV-MA: Backend Heavy</span>
                <span class="nflx-meta-stat">3 Seasons (3rd Year CS)</span>
                <span class="nflx-meta-stat">20.0 TPS Production</span>
                <span class="nflx-meta-stat">Ultra HD / 4K Systems</span>
              </div>
              <p class="nflx-synopsis">
                An engineering thriller set in VCET Puttur (VTU). Jnanesh tackles high-concurrency Minecraft server infrastructure,
                authors agricultural rental platforms, and builds automated cloud schedulers with deterministic precision.
              </p>
              <div class="nflx-billboard-actions">
                <button class="nflx-btn nflx-btn-play project-modal-trigger" data-project-id="obele">
                  <span class="nflx-play-icon">▶</span> Play Featured Demo
                </button>
                <a href="#projects" class="nflx-btn nflx-btn-info">
                  <span class="nflx-info-icon">ⓘ</span> Explore Entire Catalog
                </a>
                <a href="/resume" target="_blank" class="nflx-btn nflx-btn-dark">
                  Official Script (Resume) ↗
                </a>
              </div>
            </div>
          </section>

          <!-- NETFLIX CAROUSEL ROW 1: TRENDING PROJECTS -->
          <section id="projects" class="nflx-row-section section-wrap">
            <div class="nflx-row-header">
              <h2 class="nflx-row-title">🔥 Trending Now: Flagship Systems & Platforms</h2>
              <span class="nflx-explore-all">Explore All (${projects.length})</span>
            </div>
            <div class="nflx-carousel-wrapper">
              <button class="nflx-carousel-arrow left" aria-label="Previous items">‹</button>
              <div class="nflx-carousel-track" id="nflx-track-projects">
                ${projects.map(proj => `
                  <article class="nflx-card poster-card" data-project-id="${proj.id}">
                    <div class="nflx-card-poster">
                      <div class="nflx-poster-tag">${proj.category}</div>
                      <div class="nflx-poster-badge">${proj.status}</div>
                      <div class="nflx-poster-caption">
                        <h4>${proj.title}</h4>
                        <p>${proj.subtitle}</p>
                      </div>
                    </div>
                    <div class="nflx-card-hover-preview">
                      <div class="nflx-hover-actions">
                        <button class="nflx-mini-play project-modal-trigger" data-project-id="${proj.id}" title="Deep Dive">▶</button>
                        ${proj.github ? `<a href="${proj.github}" target="_blank" class="nflx-mini-icon" title="Source">🐙</a>` : ''}
                      </div>
                      <div class="nflx-hover-meta">
                        <span class="nflx-hover-match">98% Match</span>
                        <span class="nflx-hover-cat">${proj.category}</span>
                      </div>
                      <p class="nflx-hover-desc">${proj.overview.substring(0, 100)}...</p>
                      <div class="nflx-hover-tags">
                        ${proj.techStack.slice(0, 3).map(t => `<span class="nflx-tag-dot">• ${t}</span>`).join(' ')}
                      </div>
                    </div>
                  </article>
                `).join('')}
              </div>
              <button class="nflx-carousel-arrow right" aria-label="Next items">›</button>
            </div>
          </section>

          <!-- NETFLIX CAROUSEL ROW 2: SKILLS & TOOLKIT -->
          <section id="skills" class="nflx-row-section section-wrap">
            <div class="nflx-row-header">
              <h2 class="nflx-row-title">⚡ Continue Watching: Engineering Skills & Toolkit</h2>
              <span class="nflx-explore-all">Tiers Matrix</span>
            </div>
            <div class="nflx-carousel-wrapper">
              <button class="nflx-carousel-arrow left" aria-label="Previous skills">‹</button>
              <div class="nflx-carousel-track" id="nflx-track-skills">
                ${skills.tiers.map((tier, idx) => `
                  <div class="nflx-card skill-card tier-${tier.id}">
                    <div class="nflx-card-poster skill-poster">
                      <div class="nflx-tier-rank">#${idx + 1}</div>
                      <div class="nflx-tier-badge">${tier.badge}</div>
                      <h3 class="nflx-skill-tier-title">${tier.name}</h3>
                      <p class="nflx-skill-tier-desc">${tier.description}</p>
                    </div>
                    <div class="nflx-skill-pills-list">
                      ${tier.skills.map(s => `
                        <span class="nflx-skill-pill">
                          <strong class="skill-name">${s.name}</strong>
                          <small class="skill-cat">${s.category}</small>
                        </span>
                      `).join('')}
                    </div>
                  </div>
                `).join('')}
              </div>
              <button class="nflx-carousel-arrow right" aria-label="Next skills">›</button>
            </div>
          </section>

          <!-- NETFLIX ABOUT (Cast, Creators & Synopsis) -->
          <section id="about" class="nflx-about-section section-wrap">
            <div class="nflx-about-container">
              <div class="nflx-about-synopsis">
                <span class="nflx-sublabel">Behind The Scenes</span>
                <h2 class="nflx-section-heading">Creator & Systems Philosophy</h2>
                <p>
                  Jnanesh Sharma H. is a third-year Computer Science undergraduate at VCET Puttur, affiliated with Visvesvaraya Technological University (VTU).
                  Specializing in backend system reliability, high-concurrency game server runtimes, and automated cloud infrastructure.
                </p>
                <div class="nflx-stats-bar">
                  <div class="nflx-stat-box">
                    <span class="stat-num">20.0</span>
                    <span class="stat-lbl">Server TPS (MGU.One)</span>
                  </div>
                  <div class="stat-num-divider"></div>
                  <div class="nflx-stat-box">
                    <span class="stat-num">7.4</span>
                    <span class="stat-lbl">Academic CGPA (VTU)</span>
                  </div>
                  <div class="stat-num-divider"></div>
                  <div class="nflx-stat-box">
                    <span class="stat-num">2026</span>
                    <span class="stat-lbl">Codex Backend Intern</span>
                  </div>
                </div>
              </div>
              <div class="nflx-cast-credits">
                <h3>Cast & Production Info</h3>
                <ul class="nflx-credits-list">
                  <li><span class="credit-role">Lead Engineer:</span> <span class="credit-val">${p.name}</span></li>
                  <li><span class="credit-role">University:</span> <span class="credit-val">${p.education.institution}</span></li>
                  <li><span class="credit-role">Affiliation:</span> <span class="credit-val">${p.education.affiliation}</span></li>
                  <li><span class="credit-role">Degree Program:</span> <span class="credit-val">${p.education.degree}</span></li>
                  <li><span class="credit-role">Expected Graduation:</span> <span class="credit-val">${p.education.expectedGraduation}</span></li>
                  <li><span class="credit-role">Genres:</span> <span class="credit-val">Backend, Concurrency, Distributed Systems</span></li>
                </ul>
              </div>
            </div>
          </section>

          <!-- NETFLIX EXPERIENCE (Seasons & Episodes) -->
          <section id="experience" class="nflx-episodes-section section-wrap">
            <div class="nflx-row-header">
              <h2 class="nflx-row-title">📜 Seasons & Episodes (Career Progression)</h2>
            </div>
            <div class="nflx-episodes-list">
              ${p.experience.map((exp, idx) => `
                <div class="nflx-episode-card">
                  <div class="nflx-episode-num">${idx + 1}</div>
                  <div class="nflx-episode-body">
                    <div class="nflx-episode-header">
                      <h3 class="episode-title">${exp.role} — ${exp.organization}</h3>
                      <span class="episode-duration">${exp.period}</span>
                    </div>
                    <span class="episode-type-badge">${exp.type}</span>
                    <ul class="episode-highlights">
                      ${exp.highlights.map(h => `<li>${h}</li>`).join('')}
                    </ul>
                  </div>
                </div>
              `).join('')}
            </div>
          </section>

          <!-- NETFLIX CONTACT (Help Center & Direct Casting) -->
          <section id="contact" class="nflx-contact-section section-wrap">
            <div class="nflx-contact-box">
              <h2 class="nflx-contact-title">Jnane-Flix Help Center & Casting Inquiries</h2>
              <p class="nflx-contact-sub">Direct transmission for software engineering roles, technical internships, and collaboration.</p>
              <form id="contact-form" class="nflx-form">
                <div class="nflx-form-group">
                  <label for="contact-name">Your Full Name</label>
                  <input type="text" id="contact-name" name="name" class="nflx-input" placeholder="Recruiter or Engineering Lead" required />
                </div>
                <div class="nflx-form-group">
                  <label for="contact-email">Email Address</label>
                  <input type="email" id="contact-email" name="email" class="nflx-input" placeholder="recruiting@company.com" required />
                </div>
                <div class="nflx-form-group">
                  <label for="contact-message">Inquiry Details</label>
                  <textarea id="contact-message" name="message" class="nflx-input nflx-textarea" rows="4" placeholder="Discussing engineering opportunities..." required></textarea>
                </div>
                <button type="submit" class="nflx-btn nflx-btn-play nflx-btn-submit">Transmit Message</button>
                <div id="contact-status-msg" class="contact-status"></div>
              </form>
            </div>
          </section>
        </main>

        <!-- NETFLIX FOOTER -->
        <footer id="main-footer" class="nflx-footer">
          <div class="nflx-footer-wrap">
            <p class="nflx-footer-title">Questions? Contact Jnanesh Sharma H. directly.</p>
            <div class="nflx-footer-links">
              <a href="mailto:${p.contact.email}">Email Developer</a>
              <a href="${p.contact.github}" target="_blank">GitHub Repository</a>
              <a href="/resume">Official Resume</a>
              <a href="#hero">Back to Top ↑</a>
            </div>
            <p class="nflx-copy">© 2026 Jnane-Flix Inspired Architecture — All content derived strictly from verified facts.</p>
          </div>
        </footer>
      `;
    },

    init: function (container, data) {
      // Navbar scroll background change
      const nav = container.querySelector('#navbar');
      function onScroll() {
        if (window.scrollY > 50) {
          nav.classList.add('scrolled');
        } else {
          nav.classList.remove('scrolled');
        }
      }
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();

      // Profile modal toggle
      const profileBtn = container.querySelector('#nflx-profile-btn');
      const profileModal = container.querySelector('#nflx-profile-modal');
      const closeProfileBtn = container.querySelector('#nflx-close-profile-btn');
      if (profileBtn && profileModal) {
        profileBtn.addEventListener('click', () => {
          profileModal.classList.add('open');
        });
        if (closeProfileBtn) {
          closeProfileBtn.addEventListener('click', () => {
            profileModal.classList.remove('open');
          });
        }
        profileModal.querySelectorAll('.nflx-profile-card').forEach(card => {
          card.addEventListener('click', () => {
            profileModal.querySelectorAll('.nflx-profile-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            const role = card.getAttribute('data-profile');
            const avatarBox = container.querySelector('.nflx-avatar-box');
            if (avatarBox) avatarBox.textContent = card.querySelector('.nflx-profile-name').textContent.split(' ')[0];
            profileModal.classList.remove('open');
          });
        });
      }

      // Carousel arrows scrolling
      container.querySelectorAll('.nflx-carousel-wrapper').forEach(wrap => {
        const track = wrap.querySelector('.nflx-carousel-track');
        const prevBtn = wrap.querySelector('.nflx-carousel-arrow.left');
        const nextBtn = wrap.querySelector('.nflx-carousel-arrow.right');
        if (track && prevBtn && nextBtn) {
          prevBtn.addEventListener('click', () => {
            track.scrollBy({ left: -400, behavior: 'smooth' });
          });
          nextBtn.addEventListener('click', () => {
            track.scrollBy({ left: 400, behavior: 'smooth' });
          });
        }
      });

      container._cleanup = () => window.removeEventListener('scroll', onScroll);
    }
  };
})();
