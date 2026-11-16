/**
 * APPLE GLASS THEME LAYOUT (Frosted Glassmorphism & Bento Grid)
 * Spec:
 * - Nav: Floating centered glass pill/dock with blurred glass, section icons with labels on hover.
 * - Hero: Centered huge light-weight headline, short subline, two pill buttons, soft aurora background blob.
 * - About + Skills: BENTO GRID of mixed-size glass tiles (1x1, 2x1, 2x2) with big numerals and icons; skills shown as tiles grouped by tier, no bars.
 * - Projects: Large rounded cards (28px radius) with mockup hero area, expanding into smooth modal sheet.
 * - Experience: Minimalist frosted glass milestone cards.
 * - Type: System SF-like stack (-apple-system, SF Pro Display, Inter), tight tracking, large contrast. Light and Dark mode.
 */

(function () {
  'use strict';

  window.THEME_LAYOUTS = window.THEME_LAYOUTS || {};

  window.THEME_LAYOUTS['apple'] = {
    id: 'apple',
    name: 'Apple Glass',
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', Inter, sans-serif",
    patterns: {
      nav: 'Floating centered glass dock pill with section icons and floating labels',
      hero: 'Centered minimalist hero with static aurora gradient blob and twin pill CTAs',
      about: 'Bento Grid 1x1, 2x1, 2x2 tiles with large numerals and glass depth',
      skills: 'Bento Grid glass tiles grouped by tier with interactive filter pills',
      projects: 'Edge-to-edge rounded cards (28px radius) with hero mockup viewports',
      experience: 'Frosted glass floating milestone cards with translucent timeline pills',
      contact: 'Floating translucent glass capsule card with blurred backdrop',
      footer: 'Centered glass pill copyright dock'
    },

    render: function (data) {
      const p = data.profile;
      const projects = data.projects;
      const skills = data.skills;

      return `
        <!-- APPLE AURORA STATIC AMBIENT LAYER -->
        <div class="apple-aurora-bg" aria-hidden="true">
          <div class="aurora-blob blob-1"></div>
          <div class="aurora-blob blob-2"></div>
        </div>

        <!-- APPLE FLOATING DOCK NAV -->
        <nav id="navbar" class="apple-dock-nav" aria-label="Apple Glass Dock Navigation">
          <div class="apple-dock-pill">
            <a href="#hero" class="dock-item" data-tooltip="Overview" aria-label="Overview">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
              <span class="dock-label">Overview</span>
            </a>
            <a href="#about" class="dock-item" data-tooltip="Bento About" aria-label="Bento About">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
              <span class="dock-label">About</span>
            </a>
            <a href="#skills" class="dock-item" data-tooltip="Skills Bento" aria-label="Skills Bento">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              <span class="dock-label">Skills</span>
            </a>
            <a href="#projects" class="dock-item" data-tooltip="Projects" aria-label="Projects">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>
              <span class="dock-label">Work</span>
            </a>
            <a href="#experience" class="dock-item" data-tooltip="Timeline" aria-label="Timeline">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span class="dock-label">Timeline</span>
            </a>
            <a href="#contact" class="dock-item" data-tooltip="Contact" aria-label="Contact">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              <span class="dock-label">Connect</span>
            </a>
            <div class="dock-separator"></div>
            <div id="theme-menu-slot" class="dock-theme-slot"></div>
          </div>
        </nav>

        <main id="main-content" class="apple-main">
          <!-- APPLE HERO (Centered, Lightweight, Aurora) -->
          <section id="hero" class="apple-hero">
            <div class="apple-hero-container">
              <div class="apple-eyebrow reveal">
                <span class="apple-badge-glass">Designed for Performance & Systems Concurrency</span>
              </div>
              <h1 class="apple-hero-title reveal">
                <span class="apple-hero-name">${p.name}</span>
              </h1>
              <p class="apple-hero-subline reveal">
                ${p.role} • 3rd Year Computer Science at VCET Puttur (VTU).
              </p>
              <p class="apple-hero-lede reveal">
                Architecting resilient backend systems, distributed microservices, and 20.0 TPS game servers with deterministic precision.
              </p>
              <div class="apple-hero-actions reveal">
                <a href="#projects" class="apple-pill-btn apple-pill-primary">Explore Selected Works</a>
                <a href="#contact" class="apple-pill-btn apple-pill-secondary">Initiate Contact</a>
                <a href="/resume" target="_blank" class="apple-pill-btn apple-pill-glass">Curriculum Vitae ↗</a>
              </div>
            </div>
          </section>

          <!-- APPLE BENTO GRID (About + Stats + Highlights) -->
          <section id="about" class="apple-bento-section section-wrap">
            <div class="apple-section-header reveal">
              <span class="apple-kicker">Architecture & Philosophy</span>
              <h2 class="apple-heading">A Bento Overview of Engineering Foundations</h2>
            </div>

            <div class="apple-bento-grid reveal">
              <!-- Tile 1: 2x2 Philosophy -->
              <div class="bento-tile tile-2x2 glass-card">
                <div class="bento-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                </div>
                <h3 class="bento-title">High-Concurrency Architecture</h3>
                <p class="bento-body">
                  Specializing in server-side systems where concurrency, memory efficiency, and state consistency cannot be compromised.
                  From real-time Bukkit paper schedulers to automated Firestore push notification engines, my code is architected to perform under load.
                </p>
                <div class="bento-tag-row">
                  <span class="apple-mini-chip">Java 17</span>
                  <span class="apple-mini-chip">Node.js</span>
                  <span class="apple-mini-chip">Paper 1.21.x</span>
                  <span class="apple-mini-chip">MongoDB</span>
                </div>
              </div>

              <!-- Tile 2: 1x1 Numerals TPS -->
              <div class="bento-tile tile-1x1 glass-card stat-tile">
                <span class="bento-big-num">20.0</span>
                <span class="bento-num-label">TPS Stability</span>
                <span class="bento-sublabel">MGU.One Infrastructure</span>
              </div>

              <!-- Tile 3: 1x1 Numerals CGPA -->
              <div class="bento-tile tile-1x1 glass-card stat-tile">
                <span class="bento-big-num">7.4</span>
                <span class="bento-num-label">Academic CGPA</span>
                <span class="bento-sublabel">VCET / VTU Computer Science</span>
              </div>

              <!-- Tile 4: 2x1 Internship Highlights -->
              <div class="bento-tile tile-2x1 glass-card">
                <span class="apple-subbadge">Akanksha Charitable Trust</span>
                <h3 class="bento-title">Codex Learning Platform Backend</h3>
                <p class="bento-body">
                  Engineered JWT security verification and built an in-process Firebase Cloud Messaging (FCM) scheduler for automated daily streaks.
                </p>
              </div>

              <!-- Tile 5: 1x1 Education -->
              <div class="bento-tile tile-1x1 glass-card">
                <span class="bento-kicker">Education</span>
                <h4 class="bento-title-sm">B.E. Computer Science</h4>
                <p class="bento-micro">VCET Puttur • Expected 2028</p>
              </div>

              <!-- Tile 6: 1x1 Location -->
              <div class="bento-tile tile-1x1 glass-card">
                <span class="bento-kicker">Base Location</span>
                <h4 class="bento-title-sm">Karnataka, India</h4>
                <p class="bento-micro">Global Remote Ready</p>
              </div>
            </div>
          </section>

          <!-- APPLE SKILLS BENTO -->
          <section id="skills" class="apple-skills-section section-wrap">
            <div class="apple-section-header reveal">
              <span class="apple-kicker">Toolkit & Capabilities</span>
              <h2 class="apple-heading">Glass Modular Competency Matrix</h2>
            </div>

            <div class="apple-skills-bento reveal">
              ${skills.tiers.map((tier, idx) => `
                <div class="apple-skill-glass-card ${idx === 0 ? 'primary-tier' : ''}">
                  <div class="apple-skill-header">
                    <span class="apple-tier-badge">${tier.badge}</span>
                    <h3 class="apple-skill-tier-name">${tier.name}</h3>
                    <p class="apple-skill-tier-desc">${tier.description}</p>
                  </div>
                  <div class="apple-skill-pills">
                    ${tier.skills.map(s => `
                      <div class="apple-skill-pill">
                        <span class="apple-skill-dot"></span>
                        <span class="apple-pill-name">${s.name}</span>
                        <span class="apple-pill-cat">${s.category}</span>
                      </div>
                    `).join('')}
                  </div>
                </div>
              `).join('')}
            </div>
          </section>

          <!-- APPLE PROJECTS (Large Rounded Cards + Modal Sheet) -->
          <section id="projects" class="apple-projects-section section-wrap">
            <div class="apple-section-header reveal">
              <span class="apple-kicker">Selected Engineering</span>
              <h2 class="apple-heading">Crafted Software & Systems</h2>
            </div>

            <div class="apple-projects-deck reveal">
              ${projects.map(proj => `
                <div class="apple-project-card glass-card" data-project-id="${proj.id}">
                  <div class="apple-card-visual">
                    <div class="apple-mockup-frame">
                      <span class="apple-window-dot dot-red"></span>
                      <span class="apple-window-dot dot-yellow"></span>
                      <span class="apple-window-dot dot-green"></span>
                      <span class="apple-mockup-tag">${proj.category}</span>
                    </div>
                    <div class="apple-mockup-hero">
                      <h4 class="mockup-hero-title">${proj.title}</h4>
                      <p class="mockup-hero-sub">${proj.subtitle}</p>
                    </div>
                  </div>
                  <div class="apple-card-content">
                    <div class="apple-card-meta">
                      <span class="apple-status-tag">${proj.status}</span>
                      <span class="apple-timeline-tag">${proj.timeline || 'Engineered by Jnanesh'}</span>
                    </div>
                    <h3 class="apple-card-title">${proj.title}</h3>
                    <p class="apple-card-desc">${proj.overview}</p>
                    <div class="apple-tech-stack">
                      ${proj.techStack.map(t => `<span class="apple-tech-badge">${t}</span>`).join('')}
                    </div>
                    <div class="apple-card-actions">
                      <button class="apple-action-btn primary project-modal-trigger" data-project-id="${proj.id}">
                        View Architecture Sheet
                      </button>
                      ${proj.github ? `<a href="${proj.github}" target="_blank" class="apple-action-btn secondary">Source Code ↗</a>` : ''}
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </section>

          <!-- APPLE EXPERIENCE (Minimalist Glass Timeline) -->
          <section id="experience" class="apple-timeline-section section-wrap">
            <div class="apple-section-header reveal">
              <span class="apple-kicker">Professional Progression</span>
              <h2 class="apple-heading">Career & Leadership Journey</h2>
            </div>

            <div class="apple-glass-timeline reveal">
              ${p.experience.map(exp => `
                <div class="apple-timeline-card glass-card">
                  <div class="apple-timeline-badge-row">
                    <span class="apple-year-pill">${exp.period}</span>
                    <span class="apple-role-tag">${exp.type}</span>
                  </div>
                  <h3 class="apple-exp-role">${exp.role}</h3>
                  <h4 class="apple-exp-org">${exp.organization}</h4>
                  <ul class="apple-exp-points">
                    ${exp.highlights.map(h => `<li>${h}</li>`).join('')}
                  </ul>
                </div>
              `).join('')}
            </div>
          </section>

          <!-- APPLE CONTACT (Translucent Glass Sheet) -->
          <section id="contact" class="apple-contact-section section-wrap">
            <div class="apple-section-header reveal">
              <span class="apple-kicker">Direct Connection</span>
              <h2 class="apple-heading">Initiate Direct Dialogue</h2>
            </div>

            <div class="apple-contact-glass glass-card reveal">
              <div class="apple-contact-grid">
                <div class="apple-contact-sidebar">
                  <h3>Direct Channel</h3>
                  <p>Inquiries regarding backend internships, software engineering roles, or high-concurrency systems design.</p>
                  <div class="apple-contact-pills">
                    <div class="apple-contact-pill-item">
                      <span class="pill-label">Email:</span>
                      <a href="mailto:${p.contact.email}" class="pill-value">${p.contact.email}</a>
                    </div>
                    <div class="apple-contact-pill-item">
                      <span class="pill-label">GitHub:</span>
                      <a href="${p.contact.github}" target="_blank" class="pill-value">github.com/Jnanesh321</a>
                    </div>
                    <div class="apple-contact-pill-item">
                      <span class="pill-label">Location:</span>
                      <span class="pill-value">${p.contact.location}</span>
                    </div>
                  </div>
                </div>

                <div class="apple-contact-form-wrap">
                  <form id="contact-form" class="apple-glass-form">
                    <div class="apple-input-group">
                      <label for="contact-name">Full Name</label>
                      <input type="text" id="contact-name" name="name" class="apple-input" placeholder="Your name" required />
                    </div>
                    <div class="apple-input-group">
                      <label for="contact-email">Email Address</label>
                      <input type="email" id="contact-email" name="email" class="apple-input" placeholder="name@company.com" required />
                    </div>
                    <div class="apple-input-group">
                      <label for="contact-message">Message</label>
                      <textarea id="contact-message" name="message" class="apple-input apple-textarea" rows="4" placeholder="Discussing engineering opportunities..." required></textarea>
                    </div>
                    <button type="submit" class="apple-submit-btn">Transmit Message</button>
                    <div id="contact-status-msg" class="contact-status"></div>
                  </form>
                </div>
              </div>
            </div>
          </section>
        </main>

        <!-- APPLE FOOTER DOCK -->
        <footer id="main-footer" class="apple-footer">
          <div class="apple-footer-pill">
            <span>© 2026 ${p.name}</span>
            <span class="footer-divider">•</span>
            <span>Crafted with Apple Glass Design Language</span>
            <span class="footer-divider">•</span>
            <a href="#hero">Back to Top ↑</a>
          </div>
        </footer>
      `;
    },

    init: function (container, data) {
      // Optional Apple dock active scrollspy
      const dockItems = container.querySelectorAll('.apple-dock-pill .dock-item');
      const sections = container.querySelectorAll('section[id]');

      function onScroll() {
        let currentId = 'hero';
        const scrollPos = window.scrollY + 200;
        sections.forEach(s => {
          if (s.offsetTop <= scrollPos) {
            currentId = s.id;
          }
        });
        dockItems.forEach(item => {
          const href = item.getAttribute('href');
          item.classList.toggle('active', href === `#${currentId}`);
        });
      }

      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
      container._cleanup = () => window.removeEventListener('scroll', onScroll);
    }
  };
})();
