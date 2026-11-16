/**
 * OBSIDIAN THEME LAYOUT (Default Core Identity)
 * Pattern:
 * - Nav: Sticky top bar with brand mark, section anchor links, and theme menu.
 * - Hero: Left-aligned bold heading, typewriter roles, status pill, CTA buttons, and stats row.
 * - About: Two-column bio and engineering principles layout.
 * - Skills: Tiered cards (Core, Working knowledge, Exploring) with badge pills.
 * - Projects: Two-column interactive engineering card grid with problem/solution tags.
 * - Experience: Vertical timeline with cyan milestone connector.
 * - Contact: Split terminal card + message form.
 * - Footer: Minimalist copyright & top jump.
 * Typeface: Syne, Space Grotesk, Inter.
 */

(function () {
  'use strict';

  window.THEME_LAYOUTS = window.THEME_LAYOUTS || {};

  window.THEME_LAYOUTS['obsidian'] = {
    id: 'obsidian',
    name: 'Obsidian Dark',
    fontFamily: "'Syne', 'Space Grotesk', 'Inter', sans-serif",
    patterns: {
      nav: 'Sticky top bar with brand mark and theme pill',
      hero: 'Left-aligned bold headline with typewriter, status pill, and stats counter row',
      about: 'Dual-column bio with status card and tech highlights',
      skills: 'Tiered multi-column cards (Core, Working, Exploring) with badge pills',
      projects: '2-column interactive cards with tags and modal deep-dive trigger',
      experience: 'Vertical milestone timeline with cyan connector',
      contact: 'Split layout with interactive command terminal + message form',
      footer: 'Standard full-width bar with copyright and jump links'
    },

    render: function (data) {
      const p = data.profile;
      const projects = data.projects;
      const skills = data.skills;

      return `
        <!-- OBSIDIAN NAV -->
        <nav id="navbar" class="obsidian-nav" aria-label="Main Navigation">
          <a href="#hero" class="nav-logo" aria-label="Jnanesh Sharma H. Home">JN</a>
          <ul class="nav-links">
            <li><a href="#about">About</a></li>
            <li><a href="#skills">Skills</a></li>
            <li><a href="#projects">Projects</a></li>
            <li><a href="#experience">Timeline</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
          <div class="nav-actions">
            <span class="status-pill"><span class="status-dot"></span> Available for SDE Roles</span>
            <div id="theme-menu-slot"></div>
          </div>
        </nav>

        <main id="main-content">
          <!-- OBSIDIAN HERO -->
          <section id="hero" class="obsidian-hero">
            <div class="hero-grid-bg"></div>
            <div class="hero-content">
              <div class="hero-badge reveal">
                <span class="pulse-dot"></span>
                <span>${p.education.degree} • Semester 5</span>
              </div>
              <h1 class="hero-title reveal">
                <span class="hero-name">${p.name}</span>
                <span class="hero-sub">${p.role}</span>
              </h1>
              <div class="hero-role-ticker reveal">
                <span class="ticker-label">Specializing in:</span>
                <span class="ticker-text" id="obsidian-typewriter">High-concurrency systems & cloud backends</span>
              </div>
              <p class="hero-desc reveal">
                Computer Science undergraduate at VCET Puttur (VTU). Building high-concurrency game server
                infrastructure, agricultural rental platforms, and automated backend schedulers.
              </p>
              <div class="hero-cta reveal">
                <a href="#projects" class="btn btn-primary">Explore Projects</a>
                <a href="#contact" class="btn btn-ghost">Terminal & Contact</a>
                <a href="/resume" class="btn btn-outline" target="_blank">View Resume ↗</a>
              </div>
              <div class="hero-stats-row reveal">
                ${p.stats.map(s => `
                  <div class="hero-stat-card">
                    <span class="stat-value">${s.value}</span>
                    <span class="stat-label">${s.label}</span>
                    <span class="stat-context">${s.context}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          </section>

          <!-- OBSIDIAN ABOUT -->
          <section id="about" class="obsidian-about section-wrap">
            <div class="section-label reveal">About Jnanesh</div>
            <h2 class="section-heading reveal">Engineering Systems from the Ground Up</h2>
            <div class="about-grid reveal">
              <div class="about-card bio-card">
                <h3>Background & Philosophy</h3>
                <p>
                  I'm a 3rd-year CS student at Vivekananda College of Engineering and Technology (VCET),
                  affiliated with VTU. I specialize in backend architectures, distributed services, and
                  high-concurrency game runtime systems.
                </p>
                <p>
                  From designing custom Bukkit concurrency plugins on Paper 1.21.x maintaining 20.0 TPS
                  to implementing JWT auth pipelines and Firebase Cloud Messaging schedulers during my
                  internship at Akanksha Charitable Trust, I prioritize deterministic reliability and clean abstractions.
                </p>
              </div>
              <div class="about-card details-card">
                <h3>Academic & Systems Specs</h3>
                <ul class="about-specs-list">
                  <li><strong>Institution:</strong> ${p.education.institution}</li>
                  <li><strong>Affiliation:</strong> ${p.education.affiliation}</li>
                  <li><strong>Academic CGPA:</strong> ${p.education.cgpa}</li>
                  <li><strong>Current Status:</strong> ${p.education.status} (${p.education.expectedGraduation})</li>
                  <li><strong>Location:</strong> ${p.education.location}</li>
                </ul>
              </div>
            </div>
          </section>

          <!-- OBSIDIAN SKILLS -->
          <section id="skills" class="obsidian-skills section-wrap">
            <div class="section-label reveal">Toolkit & Competencies</div>
            <h2 class="section-heading reveal">Grouped Competency Framework</h2>
            <div class="skills-tiers-grid reveal">
              ${skills.tiers.map(tier => `
                <div class="skill-tier-card">
                  <div class="tier-header">
                    <span class="tier-badge">${tier.badge}</span>
                    <h3 class="tier-title">${tier.name}</h3>
                    <p class="tier-desc">${tier.description}</p>
                  </div>
                  <div class="tier-chips">
                    ${tier.skills.map(s => `
                      <span class="skill-chip">
                        <span class="skill-name">${s.name}</span>
                        <span class="skill-cat">${s.category}</span>
                      </span>
                    `).join('')}
                  </div>
                </div>
              `).join('')}
            </div>
          </section>

          <!-- OBSIDIAN PROJECTS -->
          <section id="projects" class="obsidian-projects section-wrap">
            <div class="section-label reveal">Selected Systems & Software</div>
            <h2 class="section-heading reveal">Production & Open-Source Projects</h2>
            <div class="projects-grid reveal">
              ${projects.map(proj => `
                <article class="project-card" data-project-id="${proj.id}">
                  <div class="project-card-header">
                    <span class="project-category">${proj.category}</span>
                    <span class="project-status">${proj.status}</span>
                  </div>
                  <h3 class="project-title">${proj.title}</h3>
                  <div class="project-subtitle">${proj.subtitle}</div>
                  <p class="project-overview">${proj.overview}</p>
                  <div class="project-stack">
                    ${proj.techStack.map(t => `<span class="tech-tag">${t}</span>`).join('')}
                  </div>
                  <div class="project-card-actions">
                    <button class="btn btn-sm btn-primary project-modal-trigger" data-project-id="${proj.id}">
                      Deep Dive & Details
                    </button>
                    ${proj.github ? `<a href="${proj.github}" target="_blank" class="btn btn-sm btn-ghost">GitHub ↗</a>` : ''}
                    ${proj.liveUrl ? `<a href="${proj.liveUrl}" target="_blank" class="btn btn-sm btn-outline">Live ↗</a>` : ''}
                  </div>
                </article>
              `).join('')}
            </div>
          </section>

          <!-- OBSIDIAN EXPERIENCE -->
          <section id="experience" class="obsidian-experience section-wrap">
            <div class="section-label reveal">Trajectory & Milestones</div>
            <h2 class="section-heading reveal">Engineering & Leadership Timeline</h2>
            <div class="timeline-container reveal">
              ${p.experience.map((exp, idx) => `
                <div class="timeline-item">
                  <div class="timeline-marker">
                    <span class="marker-dot"></span>
                    <span class="marker-line"></span>
                  </div>
                  <div class="timeline-content">
                    <div class="timeline-period">${exp.period}</div>
                    <h3 class="timeline-role">${exp.role}</h3>
                    <div class="timeline-org">${exp.organization}</div>
                    <span class="timeline-type">${exp.type}</span>
                    <ul class="timeline-highlights">
                      ${exp.highlights.map(h => `<li>${h}</li>`).join('')}
                    </ul>
                  </div>
                </div>
              `).join('')}
            </div>
          </section>

          <!-- OBSIDIAN CONTACT -->
          <section id="contact" class="obsidian-contact section-wrap">
            <div class="section-label reveal">Transmission & Contact</div>
            <h2 class="section-heading reveal">Connect with Jnanesh</h2>
            <div class="contact-split reveal">
              <div class="contact-terminal-card">
                <div class="terminal-bar">
                  <span class="term-dot red"></span>
                  <span class="term-dot yellow"></span>
                  <span class="term-dot green"></span>
                  <span class="term-title">jnanesh@portfolio:~</span>
                </div>
                <div class="terminal-body" id="obsidian-term-output">
                  <p class="term-line prompt">jnanesh --status</p>
                  <p class="term-line output">✔ Available for backend engineering internships and full-time SDE roles.</p>
                  <p class="term-line prompt">jnanesh --contact</p>
                  <p class="term-line output">✉ ${p.contact.email}</p>
                  <p class="term-line output">🐙 ${p.contact.github}</p>
                  <p class="term-line output">📍 ${p.contact.location}</p>
                </div>
              </div>
              <div class="contact-form-card">
                <form id="contact-form" class="obsidian-form">
                  <div class="form-group">
                    <label for="contact-name">Your Name</label>
                    <input type="text" id="contact-name" name="name" required placeholder="Jane Doe" />
                  </div>
                  <div class="form-group">
                    <label for="contact-email">Your Email</label>
                    <input type="email" id="contact-email" name="email" required placeholder="jane@example.com" />
                  </div>
                  <div class="form-group">
                    <label for="contact-message">Message</label>
                    <textarea id="contact-message" name="message" rows="4" required placeholder="Let's build reliable backend systems together..."></textarea>
                  </div>
                  <button type="submit" class="btn btn-primary btn-block">Transmit Message</button>
                  <div id="contact-status-msg" class="contact-status"></div>
                </form>
              </div>
            </div>
          </section>
        </main>

        <!-- OBSIDIAN FOOTER -->
        <footer id="main-footer" class="obsidian-footer">
          <div class="footer-wrap">
            <div class="footer-copy">© 2026 <span>${p.name}</span> • Engineered with Node.js & Express</div>
            <div class="footer-links">
              <a href="https://github.com/Jnanesh321" target="_blank">GitHub</a>
              <a href="/resume">Resume</a>
              <a href="mailto:${p.contact.email}">Email</a>
              <a href="#hero">Back to Top ↑</a>
            </div>
          </div>
        </footer>
      `;
    },

    init: function (container, data) {
      // Obsidian-specific typewriter or observer
      const typewriter = container.querySelector('#obsidian-typewriter');
      if (typewriter) {
        const phrases = [
          'High-concurrency systems & cloud backends',
          'Paper 1.21.x server runtime & Bukkit plugins',
          'Automated FCM notification schedulers & REST APIs',
          'Scalable MongoDB schemas & system design'
        ];
        let idx = 0;
        let charIdx = 0;
        let isDeleting = false;
        let timeoutId;

        function type() {
          const current = phrases[idx];
          if (isDeleting) {
            typewriter.textContent = current.substring(0, charIdx - 1);
            charIdx--;
          } else {
            typewriter.textContent = current.substring(0, charIdx + 1);
            charIdx++;
          }

          let speed = isDeleting ? 30 : 60;
          if (!isDeleting && charIdx === current.length) {
            speed = 2000;
            isDeleting = true;
          } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            idx = (idx + 1) % phrases.length;
            speed = 500;
          }
          timeoutId = setTimeout(type, speed);
        }
        type();
        container._cleanup = () => clearTimeout(timeoutId);
      }
    }
  };
})();
