/**
 * AWS CLOUD CONSOLE THEME LAYOUT (Management Dashboard & Resource Tables)
 * Spec:
 * - App shell: Fixed dark top bar (Search Ctrl+K, Region 'ap-south-1', Account menu, Theme Switcher).
 * - Left sidebar: Collapsible navigation with Console Home, Projects, Skills, Timeline, Contact, CloudFormation.
 * - Breadcrumb row: Console Home > ap-south-1 > Portfolio Services > Dashboard.
 * - Hero: "Console Home" dashboard with widget panels (Welcome summary, Recently visited projects, System health metrics).
 * - Skills: Sortable AWS Services table (Service Name, Category, Tier, Status, Filter search box).
 * - Projects: "Resources" table with detail tabs (Overview, Architecture, Metrics/Tags, Links) and key-value tables.
 * - Experience: CloudTrail Event History log table.
 * - CloudShell: Docked drawer at the bottom with interactive CLI.
 * - Type: Amazon Ember / monospace / Inter, dense console styling.
 */

(function () {
  'use strict';

  window.THEME_LAYOUTS = window.THEME_LAYOUTS || {};

  window.THEME_LAYOUTS['aws'] = {
    id: 'aws',
    name: 'AWS Cloud Console',
    fontFamily: "'Amazon Ember', 'Roboto Mono', 'SFMono-Regular', Consolas, 'Inter', monospace",
    patterns: {
      nav: 'Fixed dark top navigation bar with service search, region chip (ap-south-1), and account menu',
      hero: 'AWS Console Home dashboard with draggable-style operational widget panels',
      about: 'CloudFormation Architecture summary and systems specification card',
      skills: 'Dense sortable AWS Services Inventory table with instant keyword filter',
      projects: 'AWS EC2/ECS Resource Table with tabbed detail inspector (Overview/Architecture/Tags)',
      experience: 'CloudTrail Event History log table with timestamp and event names',
      contact: 'AWS Support Center Case Creation form with CLI command preview',
      footer: 'AWS Console global status bar with latency telemetry and CloudShell toggle'
    },

    render: function (data) {
      const p = data.profile;
      const projects = data.projects;
      const skills = data.skills;

      return `
        <!-- AWS TOP APP BAR -->
        <header id="navbar" class="aws-top-bar" aria-label="AWS Management Console Navigation">
          <div class="aws-top-left">
            <button class="aws-menu-toggle" id="aws-sidebar-toggle" aria-label="Toggle AWS Services Menu">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
            <div class="aws-console-brand">
              <span class="aws-brand-aws">aws</span>
              <span class="aws-brand-divider">|</span>
              <span class="aws-brand-title">Jnanesh Cloud Console</span>
            </div>
            <div class="aws-search-box">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input type="text" id="aws-global-search" placeholder="Search services, skills, or projects [Ctrl+K]" aria-label="Search AWS services" />
            </div>
          </div>

          <div class="aws-top-right">
            <div class="aws-top-chip region-chip">
              <span class="aws-region-dot"></span>
              <span class="aws-chip-label">ap-south-1 (Mumbai)</span>
            </div>
            <div class="aws-top-chip account-chip">
              <span class="aws-account-avatar">JD</span>
              <span class="aws-chip-label">jnanesh-admin @ 4829-1029</span>
            </div>
            <div id="theme-menu-slot" class="aws-theme-slot"></div>
          </div>
        </header>

        <!-- AWS CONSOLE APP WRAPPER -->
        <div class="aws-console-layout">
          <!-- COLLAPSIBLE LEFT SIDEBAR -->
          <aside class="aws-sidebar" id="aws-sidebar">
            <div class="aws-sidebar-header">
              <span class="aws-sidebar-title">Portfolio Services</span>
            </div>
            <nav class="aws-sidebar-nav">
              <a href="#hero" class="aws-nav-link active" data-section="hero">
                <span class="aws-nav-icon">🏠</span>
                <span class="aws-nav-text">Console Home</span>
              </a>
              <a href="#projects" class="aws-nav-link" data-section="projects">
                <span class="aws-nav-icon">⚡</span>
                <span class="aws-nav-text">Resources & Projects</span>
              </a>
              <a href="#skills" class="aws-nav-link" data-section="skills">
                <span class="aws-nav-icon">📊</span>
                <span class="aws-nav-text">Skills Inventory (IAM)</span>
              </a>
              <a href="#about" class="aws-nav-link" data-section="about">
                <span class="aws-nav-icon">📋</span>
                <span class="aws-nav-text">CloudFormation / Bio</span>
              </a>
              <a href="#experience" class="aws-nav-link" data-section="experience">
                <span class="aws-nav-icon">📜</span>
                <span class="aws-nav-text">CloudTrail Timeline</span>
              </a>
              <a href="#contact" class="aws-nav-link" data-section="contact">
                <span class="aws-nav-icon">💬</span>
                <span class="aws-nav-text">Support Center (Contact)</span>
              </a>
            </nav>
            <div class="aws-sidebar-footer">
              <span class="aws-env-badge">Production v2.4</span>
            </div>
          </aside>

          <!-- MAIN CONSOLE WORKSPACE -->
          <main id="main-content" class="aws-main-viewport">
            <!-- BREADCRUMBS ROW -->
            <div class="aws-breadcrumb-bar">
              <span class="crumb-link">AWS Management Console</span>
              <span class="crumb-sep">/</span>
              <span class="crumb-link">ap-south-1</span>
              <span class="crumb-sep">/</span>
              <span class="crumb-current">Jnanesh Sharma H. — Systems Dashboard</span>
            </div>

            <!-- AWS HERO: CONSOLE HOME DASHBOARD -->
            <section id="hero" class="aws-hero-dashboard">
              <div class="aws-dashboard-header">
                <div>
                  <h1 class="aws-dash-title">Console Home — ${p.name}</h1>
                  <p class="aws-dash-sub">Role: ${p.role} | Region: ap-south-1 | Degree: ${p.education.degree}</p>
                </div>
                <div class="aws-dash-actions">
                  <a href="#projects" class="aws-btn aws-btn-primary">Provision Projects</a>
                  <a href="#contact" class="aws-btn aws-btn-secondary">Open Support Case</a>
                </div>
              </div>

              <!-- DASHBOARD WIDGET GRID -->
              <div class="aws-widgets-grid">
                <!-- Widget 1: System Telemetry -->
                <div class="aws-widget-card">
                  <div class="aws-widget-header">
                    <h3>Service Health & Telemetry</h3>
                    <span class="aws-status-badge ok">All Services Operational</span>
                  </div>
                  <div class="aws-widget-body">
                    <div class="aws-telemetry-grid">
                      <div class="telemetry-item">
                        <span class="tel-label">MGU.One TPS</span>
                        <span class="tel-val ok">20.0 TPS</span>
                      </div>
                      <div class="telemetry-item">
                        <span class="tel-label">Academic CGPA</span>
                        <span class="tel-val ok">7.4 / 10.0</span>
                      </div>
                      <div class="telemetry-item">
                        <span class="tel-label">Internship Status</span>
                        <span class="tel-val ok">Completed (Akanksha)</span>
                      </div>
                      <div class="telemetry-item">
                        <span class="tel-label">Campus Degree</span>
                        <span class="tel-val">3rd Year (VCET/VTU)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Widget 2: Recently Visited Projects -->
                <div class="aws-widget-card">
                  <div class="aws-widget-header">
                    <h3>Recently Visited Resources</h3>
                    <a href="#projects" class="aws-card-link">View all (${projects.length})</a>
                  </div>
                  <div class="aws-widget-body">
                    <ul class="aws-recent-list">
                      ${projects.slice(0, 4).map(proj => `
                        <li class="aws-recent-row">
                          <span class="aws-res-icon">📦</span>
                          <span class="aws-res-name">${proj.title}</span>
                          <span class="aws-res-type">${proj.category}</span>
                          <span class="aws-res-status active">ACTIVE</span>
                        </li>
                      `).join('')}
                    </ul>
                  </div>
                </div>

                <!-- Widget 3: AWS CLI Quick Command -->
                <div class="aws-widget-card">
                  <div class="aws-widget-header">
                    <h3>AWS CloudShell Quick Launch</h3>
                    <span class="aws-tag-badge">Bash 5.2</span>
                  </div>
                  <div class="aws-widget-body">
                    <div class="aws-cli-snippet">
                      <p class="aws-cli-line">$ aws portfolio describe-engineer --engineer-id jnanesh-sharma</p>
                      <p class="aws-cli-output">{ "role": "Backend & Systems", "status": "Ready for SDE Hire" }</p>
                    </div>
                    <button class="aws-btn aws-btn-sm" onclick="document.getElementById('aws-cloudshell-dock').classList.toggle('expanded')">
                      Open CloudShell Terminal
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <!-- AWS ABOUT (CloudFormation Architecture Bio) -->
            <section id="about" class="aws-section">
              <div class="aws-section-bar">
                <h2>CloudFormation Specification / About Jnanesh</h2>
              </div>
              <div class="aws-spec-box">
                <div class="aws-spec-meta">
                  <div><strong>Stack Name:</strong> Jnanesh-Backend-Foundations</div>
                  <div><strong>Status:</strong> <span class="aws-status-badge ok">CREATE_COMPLETE</span></div>
                  <div><strong>Region:</strong> ap-south-1</div>
                </div>
                <div class="aws-key-val-table-wrap">
                  <table class="aws-key-val-table">
                    <tbody>
                      <tr>
                        <td>Engineer Identity</td>
                        <td><strong>${p.name}</strong> (${p.role})</td>
                      </tr>
                      <tr>
                        <td>Educational Background</td>
                        <td>${p.education.institution} (${p.education.affiliation}) — ${p.education.degree}</td>
                      </tr>
                      <tr>
                        <td>Academic Metrics</td>
                        <td>CGPA: <strong>${p.education.cgpa}</strong> | Status: ${p.education.status} | Graduation: ${p.education.expectedGraduation}</td>
                      </tr>
                      <tr>
                        <td>Core Architecture Principles</td>
                        <td>Deterministic concurrency, non-blocking I/O event loops, distributed schedulers, and zero-downtime server operations.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            <!-- AWS SKILLS (Sortable Services Table) -->
            <section id="skills" class="aws-section">
              <div class="aws-section-bar">
                <h2>IAM & Services Inventory (${skills.tiers.reduce((acc, t) => acc + t.skills.length, 0)} Active Services)</h2>
              </div>
              <div class="aws-table-toolbar">
                <div class="aws-filter-search">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                  <input type="text" id="aws-skills-filter-input" placeholder="Filter services by keyword..." aria-label="Filter AWS services" />
                </div>
                <div class="aws-toolbar-actions">
                  <span class="aws-badge-count" id="aws-skills-count">${skills.tiers.reduce((acc, t) => acc + t.skills.length, 0)} Services</span>
                </div>
              </div>

              <div class="aws-table-container">
                <table class="aws-data-table" id="aws-skills-table">
                  <thead>
                    <tr>
                      <th>Service Name</th>
                      <th>Category</th>
                      <th>Tier Level</th>
                      <th>Operational Status</th>
                      <th>ARN Identifier</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${skills.tiers.flatMap(tier => tier.skills.map(s => `
                      <tr class="aws-skill-row" data-name="${s.name.toLowerCase()}" data-cat="${s.category.toLowerCase()}">
                        <td><strong>${s.name}</strong></td>
                        <td><span class="aws-cat-tag">${s.category}</span></td>
                        <td><span class="aws-tier-pill tier-${tier.id}">${tier.name}</span></td>
                        <td><span class="aws-status-indicator ok">Operational</span></td>
                        <td><code>arn:aws:skill:ap-south-1:${tier.id}:${s.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}</code></td>
                      </tr>
                    `)).join('')}
                  </tbody>
                </table>
              </div>
            </section>

            <!-- AWS PROJECTS (Resource Table & Tabbed Inspector) -->
            <section id="projects" class="aws-section">
              <div class="aws-section-bar">
                <h2>EC2 & ECS Provisioned Resources (Projects)</h2>
              </div>

              <div class="aws-table-container">
                <table class="aws-data-table" id="aws-projects-table">
                  <thead>
                    <tr>
                      <th>Resource ID</th>
                      <th>Project Title</th>
                      <th>Service Category</th>
                      <th>Deployment State</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${projects.map((proj, idx) => `
                      <tr class="aws-project-row ${idx === 0 ? 'selected' : ''}" data-project-idx="${idx}">
                        <td><code>res-${proj.id}-prod</code></td>
                        <td><strong>${proj.title}</strong></td>
                        <td><span class="aws-cat-tag">${proj.category}</span></td>
                        <td><span class="aws-status-indicator ok">${proj.status}</span></td>
                        <td>
                          <button class="aws-btn aws-btn-sm project-modal-trigger" data-project-id="${proj.id}">
                            View Inspector
                          </button>
                        </td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>

              <!-- DETAIL INSPECTOR TABS -->
              <div class="aws-inspector-panel">
                <div class="aws-inspector-tabs">
                  <button class="inspector-tab active" data-tab="overview">Overview</button>
                  <button class="inspector-tab" data-tab="architecture">Architecture Highlights</button>
                  <button class="inspector-tab" data-tab="tags">Tags & Tech Stack</button>
                </div>
                <div class="aws-inspector-content" id="aws-inspector-body">
                  <div class="inspector-pane active" id="pane-overview">
                    <h4>${projects[0].title} — Overview</h4>
                    <p>${projects[0].overview}</p>
                    <div class="aws-param-grid">
                      <div><strong>Problem Statement:</strong> ${projects[0].problem}</div>
                      <div><strong>Implemented Solution:</strong> ${projects[0].solution}</div>
                    </div>
                  </div>
                  <div class="inspector-pane" id="pane-architecture" style="display:none;">
                    <h4>Architecture Highlights</h4>
                    <ul>
                      ${projects[0].highlights.map(h => `<li>${h}</li>`).join('')}
                    </ul>
                  </div>
                  <div class="inspector-pane" id="pane-tags" style="display:none;">
                    <h4>Resource Tags</h4>
                    <div class="aws-tag-pills">
                      ${projects[0].techStack.map(t => `<span class="aws-tag-item"><strong>Tech:</strong> ${t}</span>`).join('')}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- AWS EXPERIENCE (CloudTrail Events Table) -->
            <section id="experience" class="aws-section">
              <div class="aws-section-bar">
                <h2>CloudTrail Event History (Career Milestones)</h2>
              </div>
              <div class="aws-table-container">
                <table class="aws-data-table">
                  <thead>
                    <tr>
                      <th>Event Time</th>
                      <th>Event Name</th>
                      <th>Organization / Identity</th>
                      <th>Event Type</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${p.experience.map(exp => `
                      <tr>
                        <td><code>${exp.period}</code></td>
                        <td><strong>${exp.role}</strong></td>
                        <td>${exp.organization}</td>
                        <td><span class="aws-cat-tag">${exp.type}</span></td>
                        <td><span class="aws-status-indicator ok">SUCCESS</span></td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </section>

            <!-- AWS CONTACT (Support Center Case Creation) -->
            <section id="contact" class="aws-section">
              <div class="aws-section-bar">
                <h2>AWS Support Center — Create Technical Inquiry Case</h2>
              </div>
              <div class="aws-support-box">
                <form id="contact-form" class="aws-support-form">
                  <div class="aws-form-row">
                    <label for="contact-name">Requester Name</label>
                    <input type="text" id="contact-name" name="name" class="aws-input" placeholder="Engineering Lead" required />
                  </div>
                  <div class="aws-form-row">
                    <label for="contact-email">Corporate Email Address</label>
                    <input type="email" id="contact-email" name="email" class="aws-input" placeholder="recruiter@enterprise.com" required />
                  </div>
                  <div class="aws-form-row">
                    <label for="contact-message">Case Description</label>
                    <textarea id="contact-message" name="message" class="aws-input aws-textarea" rows="4" placeholder="Detailing backend opportunity or architectural challenge..." required></textarea>
                  </div>
                  <div class="aws-form-actions">
                    <button type="submit" class="aws-btn aws-btn-primary">Submit Support Case</button>
                    <a href="mailto:${p.contact.email}" class="aws-btn aws-btn-secondary">Direct Email</a>
                  </div>
                  <div id="contact-status-msg" class="contact-status"></div>
                </form>
              </div>
            </section>
          </main>
        </div>

        <!-- DOCKED CLOUDSHELL TERMINAL -->
        <div class="aws-cloudshell-dock" id="aws-cloudshell-dock">
          <div class="cloudshell-bar">
            <div class="cloudshell-title">
              <span class="cloudshell-terminal-icon">_></span>
              <span>AWS CloudShell — ap-south-1 (jnanesh-shell-v1)</span>
            </div>
            <div class="cloudshell-controls">
              <button class="cs-btn" id="cs-toggle-btn" aria-label="Toggle CloudShell">▲ Dock</button>
            </div>
          </div>
          <div class="cloudshell-body" id="aws-cloudshell-body">
            <div class="cs-line">Jnanesh CloudShell Environment initialized [Linux 6.1.x]. Type 'help' for commands.</div>
            <div class="cs-line prompt">$ jnanesh --summary</div>
            <div class="cs-line output">> Jnanesh Sharma H. | VCET Puttur (VTU) | 20.0 TPS Systems Concurrency | SDE Ready</div>
          </div>
        </div>

        <!-- AWS CONSOLE GLOBAL FOOTER -->
        <footer id="main-footer" class="aws-console-footer">
          <div class="aws-footer-left">
            <span>Region: ap-south-1</span>
            <span class="aws-foot-sep">|</span>
            <span>Latency: 18ms</span>
            <span class="aws-foot-sep">|</span>
            <span>Host: Node.js Express</span>
          </div>
          <div class="aws-footer-right">
            <span>© 2026 Amazon Web Services Inspired Console — Jnanesh Sharma H.</span>
          </div>
        </footer>
      `;
    },

    init: function (container, data) {
      // Sidebar toggle
      const sidebarToggle = container.querySelector('#aws-sidebar-toggle');
      const sidebar = container.querySelector('#aws-sidebar');
      if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', () => {
          sidebar.classList.toggle('collapsed');
        });
      }

      // Skills instant filter
      const filterInput = container.querySelector('#aws-skills-filter-input');
      const rows = container.querySelectorAll('.aws-skill-row');
      const countEl = container.querySelector('#aws-skills-count');
      if (filterInput && rows) {
        filterInput.addEventListener('input', (e) => {
          const q = e.target.value.toLowerCase().trim();
          let visible = 0;
          rows.forEach(r => {
            const name = r.getAttribute('data-name');
            const cat = r.getAttribute('data-cat');
            const match = !q || name.includes(q) || cat.includes(q);
            r.style.display = match ? '' : 'none';
            if (match) visible++;
          });
          if (countEl) countEl.textContent = `${visible} Services`;
        });
      }

      // Inspector tabs
      const tabs = container.querySelectorAll('.inspector-tab');
      const panes = container.querySelectorAll('.inspector-pane');
      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          tabs.forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          const target = tab.getAttribute('data-tab');
          panes.forEach(p => {
            p.style.display = p.id === `pane-${target}` ? 'block' : 'none';
          });
        });
      });

      // CloudShell toggle
      const csToggle = container.querySelector('#cs-toggle-btn');
      const csDock = container.querySelector('#aws-cloudshell-dock');
      if (csToggle && csDock) {
        csToggle.addEventListener('click', () => {
          csDock.classList.toggle('expanded');
          csToggle.textContent = csDock.classList.contains('expanded') ? '▼ Collapse' : '▲ Dock';
        });
      }
    }
  };
})();
