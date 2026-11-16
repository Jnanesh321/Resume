/**
 * MINECRAFT THEME LAYOUT (Inventory UI, Advancements Tree & Diet Mode)
 * Spec:
 * - Content readability first, Diet mode default (low FX, 0 idle animations, no particles/screenshake).
 * - Nav: Hotbar locked to bottom (desktop) or compact top bar with 9 hotbar slots.
 * - Hero: Minecraft title signboard with static splash text, player level 20 HUD, and signature CTA block-break (<400ms).
 * - Skills: Authentic 3x9 Inventory Grid with item slots, pixel icons, and hover Minecraft Tooltips!
 * - Projects: Advancements / Quests Tree with interconnected quest nodes and tier badges.
 * - Experience: Achievement & Trophy list with unlocked badges and XP rewards.
 * - Contact: Book & Quill / Signboard interface with quill submit button.
 * - Type: 'Press Start 2P' for headings ONLY; clean readable monospace/sans for body.
 */

(function () {
  'use strict';

  window.THEME_LAYOUTS = window.THEME_LAYOUTS || {};

  window.THEME_LAYOUTS['minecraft'] = {
    id: 'minecraft',
    name: 'Minecraft AIBridge',
    fontFamily: "'Press Start 2P', 'VT323', Consolas, 'Courier New', monospace",
    patterns: {
      nav: 'Authentic 9-slot Minecraft Hotbar docked at the bottom with keyboard 1-9 shortcuts',
      hero: 'Minecraft Title signboard with static golden splash text and Player Level 20 HUD',
      about: 'Stone/wood villager trading quest frame with academic and systems inventory lore',
      skills: 'Authentic 3x9 Inventory Grid of 27 slots with item icons and hovering pixel tooltip box',
      projects: 'Advancements & Quests Tree with interconnected progression nodes and reward scrolls',
      experience: 'Achievement & Trophy unlocking list with green XP rewards and achievement icons',
      contact: 'Book and Quill interface with parchment pages and ink quill submit button',
      footer: 'Bedrock bottom bar with world coordinate telemetry (X: 120, Y: 64, Z: -340)'
    },

    render: function (data) {
      const p = data.profile;
      const projects = data.projects;
      const skills = data.skills;

      // Map skills to Minecraft items for the 27-slot inventory
      const mcItemIcons = [
        { name: 'Diamond Sword', color: '#55ffff', rarity: 'Rare' },
        { name: 'Redstone Dust', color: '#ff5555', rarity: 'Common' },
        { name: 'Netherite Ingot', color: '#aa00aa', rarity: 'Epic' },
        { name: 'Command Block', color: '#ffaa00', rarity: 'Legendary' },
        { name: 'Ender Pearl', color: '#00aa00', rarity: 'Uncommon' },
        { name: 'Enchanted Book', color: '#ff55ff', rarity: 'Rare' },
        { name: 'Golden Apple', color: '#ffff55', rarity: 'Rare' },
        { name: 'Brewing Stand', color: '#ffaa00', rarity: 'Uncommon' },
        { name: 'Compass', color: '#ffffff', rarity: 'Common' }
      ];

      return `
        <!-- MINECRAFT XP SCROLL BAR (Single static bar, no particles) -->
        <div class="mc-xp-bar-wrap" id="mc-xp-scroll-bar" aria-hidden="true">
          <div class="mc-xp-bar-fill" id="mc-xp-fill"></div>
          <span class="mc-xp-level-badge">20</span>
        </div>

        <main id="main-content" class="mc-main-viewport">
          <!-- MINECRAFT HERO (Signboard Title & Player HUD) -->
          <section id="hero" class="mc-hero-section">
            <div class="mc-signboard-frame">
              <div class="mc-splash-text" id="mc-splash">§e20.0 TPS Backend Wizard!</div>
              <h1 class="mc-pixel-title">${p.name}</h1>
              <p class="mc-pixel-subtitle">§a[Level 20 Backend & Systems Engineer]</p>
              <p class="mc-readable-body">
                Computer Science undergraduate at VCET Puttur (VTU). Crafting custom Paper 1.21.x concurrency plugins,
                autonomous backend daemons, and deterministic distributed architectures.
              </p>

              <!-- PLAYER HUD (Hearts, Armor, Hunger) -->
              <div class="mc-player-hud" aria-label="Player Vital Stats">
                <div class="mc-hearts-row">
                  <span class="mc-hud-icon heart">❤❤❤❤❤❤❤❤❤❤</span>
                  <span class="mc-hud-label">Health: 20/20</span>
                </div>
                <div class="mc-armor-row">
                  <span class="mc-hud-icon shield">🛡🛡🛡🛡🛡</span>
                  <span class="mc-hud-label">CGPA: ${p.education.cgpa}</span>
                </div>
                <div class="mc-food-row">
                  <span class="mc-hud-icon drumstick">🍗🍗🍗🍗🍗</span>
                  <span class="mc-hud-label">TPS: 20.0</span>
                </div>
              </div>

              <div class="mc-hero-buttons">
                <button class="mc-btn mc-btn-primary" id="mc-signature-cta">
                  <span>ENTER REALM (PROJECTS)</span>
                </button>
                <a href="#skills" class="mc-btn mc-btn-secondary">
                  <span>OPEN INVENTORY (E)</span>
                </a>
                <a href="/resume" target="_blank" class="mc-btn mc-btn-secondary">
                  <span>RESUME SCROLL ↗</span>
                </a>
              </div>
            </div>
          </section>

          <!-- MINECRAFT ABOUT (Villager Trading / Quest Log) -->
          <section id="about" class="mc-about-section section-wrap">
            <div class="mc-gui-frame">
              <div class="mc-gui-header">
                <span class="mc-gui-title">§fVILLAGER TRADING & SYSTEMS LORE</span>
              </div>
              <div class="mc-gui-body mc-about-grid">
                <div class="mc-parchment-box">
                  <h3 class="mc-parchment-heading">§8Engineering Background</h3>
                  <p class="mc-readable-body">
                    I am a 3rd-year CS student at Vivekananda College of Engineering and Technology (VCET),
                    affiliated with VTU. I architect Paper 1.21.x server infrastructure, maintaining rock-solid 20.0 TPS
                    across multi-threaded game environments.
                  </p>
                  <p class="mc-readable-body">
                    During my internship at Akanksha Charitable Trust, I developed JWT authentication mechanisms
                    and an in-process Firebase Cloud Messaging (FCM) scheduler for automated daily streak triggers.
                  </p>
                </div>
                <div class="mc-parchment-box">
                  <h3 class="mc-parchment-heading">§8Player Statistics</h3>
                  <table class="mc-stats-table mc-readable-body">
                    <tbody>
                      <tr><td>§2Institution:</td><td>${p.education.institution}</td></tr>
                      <tr><td>§2Affiliation:</td><td>${p.education.affiliation}</td></tr>
                      <tr><td>§2Academic CGPA:</td><td><strong>${p.education.cgpa} / 10.0</strong></td></tr>
                      <tr><td>§2Degree Status:</td><td>${p.education.status}</td></tr>
                      <tr><td>§2Location:</td><td>${p.education.location}</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>

          <!-- MINECRAFT SKILLS (Authentic 3x9 Inventory Grid) -->
          <section id="skills" class="mc-skills-section section-wrap">
            <div class="mc-gui-frame">
              <div class="mc-gui-header">
                <span class="mc-gui-title">§fPLAYER INVENTORY (SKILLS & TOOLKIT)</span>
              </div>
              <p class="mc-inventory-hint mc-readable-body">
                Hover over inventory slots to inspect item lore, skill tier, and architectural classification.
              </p>

              <!-- 3x9 SLOTS GRID (27 Slots) -->
              <div class="mc-inventory-grid" id="mc-inventory-slots">
                ${skills.tiers.flatMap((tier, tIdx) => tier.skills.map((s, sIdx) => {
                  const iconObj = mcItemIcons[(tIdx * 4 + sIdx) % mcItemIcons.length];
                  return `
                    <div class="mc-slot" data-skill-name="${s.name}" data-cat="${s.category}" data-tier="${tier.name}" data-rarity="${iconObj.rarity}">
                      <div class="mc-item-icon" style="color: ${iconObj.color}">
                        ${iconObj.name === 'Diamond Sword' ? '⚔' : iconObj.name === 'Redstone Dust' ? '♦' : iconObj.name === 'Command Block' ? '⚙' : iconObj.name === 'Ender Pearl' ? '●' : '✦'}
                      </div>
                      <span class="mc-slot-stack">${(sIdx + 1) * 8}</span>
                    </div>
                  `;
                })).slice(0, 27).join('')}
              </div>

              <!-- HOVER TOOLTIP BOX (Rendered near mouse or active slot) -->
              <div class="mc-tooltip-box" id="mc-tooltip">
                <div class="mc-tooltip-title" id="mc-tt-title">Diamond Sword</div>
                <div class="mc-tooltip-cat" id="mc-tt-cat">Backend Concurrency</div>
                <div class="mc-tooltip-lore" id="mc-tt-tier">Tier: Core Competencies</div>
              </div>
            </div>
          </section>

          <!-- MINECRAFT PROJECTS (Advancements / Quests Tree) -->
          <section id="projects" class="mc-projects-section section-wrap">
            <div class="mc-gui-frame advancements-frame">
              <div class="mc-gui-header">
                <span class="mc-gui-title">§fADVANCEMENTS & COMPLETED QUESTS</span>
              </div>
              <div class="mc-advancements-tree">
                ${projects.map((proj, idx) => `
                  <div class="mc-advancement-node ${idx === 0 ? 'root-node' : ''}" data-project-id="${proj.id}">
                    <div class="mc-adv-frame">
                      <div class="mc-adv-icon">✦</div>
                    </div>
                    <div class="mc-adv-details">
                      <h4 class="mc-adv-title">§e${proj.title}</h4>
                      <span class="mc-adv-category">§7[${proj.category}]</span>
                      <p class="mc-readable-body">${proj.overview.substring(0, 110)}...</p>
                      <div class="mc-adv-actions">
                        <button class="mc-btn mc-btn-sm project-modal-trigger" data-project-id="${proj.id}">
                          Inspect Quest Scroll
                        </button>
                        ${proj.github ? `<a href="${proj.github}" target="_blank" class="mc-btn mc-btn-sm">Repository ↗</a>` : ''}
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </section>

          <!-- MINECRAFT EXPERIENCE (Achievement List) -->
          <section id="experience" class="mc-experience-section section-wrap">
            <div class="mc-gui-frame">
              <div class="mc-gui-header">
                <span class="mc-gui-title">§fACHIEVEMENTS UNLOCKED</span>
              </div>
              <div class="mc-achievements-list">
                ${p.experience.map(exp => `
                  <div class="mc-achievement-card">
                    <div class="mc-ach-icon">🏆</div>
                    <div class="mc-ach-info">
                      <div class="mc-ach-top">
                        <h4 class="mc-ach-title">§aChallenge Complete! §f${exp.role}</h4>
                        <span class="mc-ach-xp">§a+1500 XP</span>
                      </div>
                      <div class="mc-ach-org">§e${exp.organization} (§7${exp.period})</div>
                      <ul class="mc-ach-highlights mc-readable-body">
                        ${exp.highlights.map(h => `<li>${h}</li>`).join('')}
                      </ul>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </section>

          <!-- MINECRAFT CONTACT (Book & Quill) -->
          <section id="contact" class="mc-contact-section section-wrap">
            <div class="mc-gui-frame book-quill-frame">
              <div class="mc-gui-header">
                <span class="mc-gui-title">§fBOOK AND QUILL — TRANSMIT TRANSMISSION</span>
              </div>
              <div class="mc-book-container">
                <div class="mc-book-page left-page">
                  <h3 class="mc-book-heading">Player Signpost</h3>
                  <p class="mc-readable-body">
                    Leave a dispatch for Jnanesh Sharma H. Inquiries for backend engineering internships,
                    server optimization contracts, or system design collaboration.
                  </p>
                  <div class="mc-book-meta mc-readable-body">
                    <p>§2Email: §f${p.contact.email}</p>
                    <p>§2GitHub: §fgithub.com/Jnanesh321</p>
                    <p>§2Location: §f${p.contact.location}</p>
                  </div>
                </div>
                <div class="mc-book-page right-page">
                  <form id="contact-form" class="mc-book-form">
                    <div class="mc-form-field">
                      <label for="contact-name">Player Name:</label>
                      <input type="text" id="contact-name" name="name" class="mc-input mc-readable-body" placeholder="PlayerName" required />
                    </div>
                    <div class="mc-form-field">
                      <label for="contact-email">Signal Frequency (Email):</label>
                      <input type="email" id="contact-email" name="email" class="mc-input mc-readable-body" placeholder="player@domain.com" required />
                    </div>
                    <div class="mc-form-field">
                      <label for="contact-message">Parchment Message:</label>
                      <textarea id="contact-message" name="message" class="mc-input mc-readable-body" rows="4" placeholder="Write on parchment..." required></textarea>
                    </div>
                    <button type="submit" class="mc-btn mc-btn-primary mc-btn-sign">
                      <span>SIGN & SEND (ENTER)</span>
                    </button>
                    <div id="contact-status-msg" class="contact-status mc-readable-body"></div>
                  </form>
                </div>
              </div>
            </div>
          </section>
        </main>

        <!-- MINECRAFT FIXED HOTBAR (9 Slots Locked to Bottom) -->
        <nav id="navbar" class="mc-hotbar-nav" aria-label="Minecraft Hotbar Navigation">
          <div class="mc-hotbar-frame">
            <a href="#hero" class="mc-hotbar-slot active" data-slot="1" title="Slot 1: Overview">
              <span class="slot-num">1</span>
              <span class="slot-icon">⛺</span>
            </a>
            <a href="#about" class="mc-hotbar-slot" data-slot="2" title="Slot 2: Lore">
              <span class="slot-num">2</span>
              <span class="slot-icon">📜</span>
            </a>
            <a href="#skills" class="mc-hotbar-slot" data-slot="3" title="Slot 3: Inventory">
              <span class="slot-num">3</span>
              <span class="slot-icon">🗡</span>
            </a>
            <a href="#projects" class="mc-hotbar-slot" data-slot="4" title="Slot 4: Quests">
              <span class="slot-num">4</span>
              <span class="slot-icon">🏆</span>
            </a>
            <a href="#experience" class="mc-hotbar-slot" data-slot="5" title="Slot 5: Achievements">
              <span class="slot-num">5</span>
              <span class="slot-icon">⭐</span>
            </a>
            <a href="#contact" class="mc-hotbar-slot" data-slot="6" title="Slot 6: Book & Quill">
              <span class="slot-num">6</span>
              <span class="slot-icon">✒</span>
            </a>
            <div class="mc-hotbar-slot theme-slot" data-slot="7" title="Slot 7: Theme Switcher">
              <div id="theme-menu-slot"></div>
            </div>
          </div>
        </nav>

        <!-- BEDROCK FOOTER -->
        <footer id="main-footer" class="mc-footer">
          <div class="mc-footer-inner">
            <span>© 2026 Jnanesh Sharma H.</span>
            <span class="mc-coords">XYZ: 120.500 / 64.000 / -342.700 (Facing North)</span>
            <a href="#hero" class="mc-btn mc-btn-sm">TOP ↑</a>
          </div>
        </footer>
      `;
    },

    init: function (container, data) {
      // 1. Tooltip logic for 3x9 inventory slots
      const slots = container.querySelectorAll('.mc-slot');
      const tooltip = container.querySelector('#mc-tooltip');
      const ttTitle = container.querySelector('#mc-tt-title');
      const ttCat = container.querySelector('#mc-tt-cat');
      const ttTier = container.querySelector('#mc-tt-tier');

      if (tooltip && slots) {
        slots.forEach(slot => {
          slot.addEventListener('mouseenter', (e) => {
            const name = slot.getAttribute('data-skill-name');
            const cat = slot.getAttribute('data-cat');
            const tier = slot.getAttribute('data-tier');
            const rarity = slot.getAttribute('data-rarity');

            if (ttTitle) ttTitle.textContent = name;
            if (ttCat) ttCat.textContent = `Category: ${cat}`;
            if (ttTier) ttTier.textContent = `Tier: ${tier} (${rarity})`;

            tooltip.style.display = 'block';
            const rect = slot.getBoundingClientRect();
            tooltip.style.left = `${rect.left + window.scrollX - 20}px`;
            tooltip.style.top = `${rect.top + window.scrollY - 80}px`;
          });

          slot.addEventListener('mouseleave', () => {
            tooltip.style.display = 'none';
          });
        });
      }

      // 2. Scroll-based XP bar
      const xpFill = container.querySelector('#mc-xp-fill');
      function updateXp() {
        if (!xpFill) return;
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
        xpFill.style.width = `${Math.min(100, Math.max(0, progress))}%`;
      }
      window.addEventListener('scroll', updateXp, { passive: true });
      updateXp();

      // 3. Signature CTA block-break effect (<400ms)
      const ctaBtn = container.querySelector('#mc-signature-cta');
      if (ctaBtn) {
        ctaBtn.addEventListener('click', (e) => {
          ctaBtn.classList.add('block-breaking');
          setTimeout(() => {
            ctaBtn.classList.remove('block-breaking');
            const projSec = document.getElementById('projects');
            if (projSec) projSec.scrollIntoView({ behavior: 'smooth' });
          }, 350);
        });
      }

      // 4. Keyboard shortcuts 1-6 for hotbar
      function onKeyDown(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        const key = parseInt(e.key, 10);
        if (key >= 1 && key <= 6) {
          const slot = container.querySelector(`.mc-hotbar-slot[data-slot="${key}"]`);
          if (slot && slot.href) {
            window.location.hash = slot.getAttribute('href');
          }
        }
      }
      window.addEventListener('keydown', onKeyDown);

      container._cleanup = () => {
        window.removeEventListener('scroll', updateXp);
        window.removeEventListener('keydown', onKeyDown);
      };
    }
  };
})();
