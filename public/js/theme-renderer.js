/**
 * THEME RENDERER ENGINE (theme-renderer.js)
 * Coordinates structural template swapping across themes:
 * - Obsidian (Default)
 * - Apple Glass
 * - AWS Cloud Console
 * - Netflix Cinematic
 * - Minecraft AIBridge
 * Ensures DOM structure, navigation, hero, skills, and projects transform genuinely.
 */

(function () {
  'use strict';

  window.ThemeRenderer = {
    activeThemeId: 'obsidian',

    ensureLayoutScript: function (themeId) {
      if (window.THEME_LAYOUTS && window.THEME_LAYOUTS[themeId]) {
        return Promise.resolve(window.THEME_LAYOUTS[themeId]);
      }
      const scriptId = `theme-layout-script-${themeId}`;
      if (document.getElementById(scriptId)) {
        return new Promise(resolve => {
          const check = setInterval(() => {
            if (window.THEME_LAYOUTS && window.THEME_LAYOUTS[themeId]) {
              clearInterval(check);
              resolve(window.THEME_LAYOUTS[themeId]);
            }
          }, 20);
        });
      }

      return new Promise((resolve) => {
        const script = document.createElement('script');
        script.id = scriptId;
        script.src = `/themes/${themeId}/layout.js`;
        script.onload = () => {
          resolve(window.THEME_LAYOUTS[themeId]);
        };
        script.onerror = (err) => {
          console.warn(`[ThemeRenderer] Layout script failed for ${themeId}, falling back to obsidian`, err);
          resolve(window.THEME_LAYOUTS['obsidian']);
        };
        document.head.appendChild(script);
      });
    },

    render: async function (themeId) {
      if (!window.PORTFOLIO_DATA) {
        try {
          const res = await fetch('/api/portfolio-data');
          window.PORTFOLIO_DATA = await res.json();
        } catch (e) {
          console.error('[ThemeRenderer] Failed to load portfolio data:', e);
        }
      }

      const layout = await this.ensureLayoutScript(themeId);
      if (!layout) {
        console.warn(`[ThemeRenderer] No layout definition for ${themeId}`);
        return;
      }

      const mount = document.getElementById('app-mount');
      if (!mount) {
        console.warn('[ThemeRenderer] No #app-mount container found');
        return;
      }

      // Cleanup prior theme listeners
      if (mount._cleanup) {
        try { mount._cleanup(); } catch (e) {}
      }

      // Render new theme HTML structure
      mount.innerHTML = layout.render(window.PORTFOLIO_DATA);
      this.activeThemeId = themeId;

      // Inject accessible theme switcher dropdown
      this.injectThemeSwitcher();

      // Re-bind controls & handlers
      this.bindProjectModals();
      this.bindContactForm();
      this.bindScrollReveal();

      // Theme-specific init
      if (typeof layout.init === 'function') {
        try {
          layout.init(mount, window.PORTFOLIO_DATA);
        } catch (e) {
          console.error(`[ThemeRenderer] Error initializing ${themeId}:`, e);
        }
      }

      window.dispatchEvent(new CustomEvent('themeLayoutMounted', { detail: { themeId, layout } }));
    },

    injectThemeSwitcher: function () {
      const slot = document.getElementById('theme-menu-slot');
      if (!slot) return;

      const currentTheme = window.ThemeRegistry ? window.ThemeRegistry.getCurrentThemeId() : this.activeThemeId;
      const currentFx = window.ThemeRegistry ? window.ThemeRegistry.getFxLevel() : 'low';
      const activeObj = window.ThemeRegistry ? window.ThemeRegistry.getTheme(currentTheme) : null;
      const activeLabel = activeObj ? activeObj.label : currentTheme;

      slot.innerHTML = `
        <div class="theme-switcher-wrap">
          <button id="theme-menu-toggle" class="theme-menu-toggle" aria-haspopup="true" aria-expanded="false" aria-label="Select visual theme">
            <span class="theme-icon">🎨</span>
            <span id="theme-menu-current-label">${activeLabel}</span>
            <span class="theme-chevron">▼</span>
          </button>
          <div id="theme-menu-dropdown" class="theme-menu-dropdown" role="menu" aria-label="Visual Theme Picker">
            <button role="menuitem" class="theme-menu-item ${currentTheme === 'obsidian' ? 'active' : ''}" data-theme-target="obsidian">
              <span class="theme-swatch" style="background:#090d13;border:1px solid #38bdf8;"></span>
              <span class="theme-item-text">
                <strong>Obsidian Dark</strong>
                <small>Default • Core Identity</small>
              </span>
            </button>
            <button role="menuitem" class="theme-menu-item ${currentTheme === 'apple' ? 'active' : ''}" data-theme-target="apple">
              <span class="theme-swatch" style="background:#1c1c1e;border:1px solid rgba(255,255,255,0.3);"></span>
              <span class="theme-item-text">
                <strong>Apple Glass</strong>
                <small>Frosted Glass • SF Bento</small>
              </span>
            </button>
            <button role="menuitem" class="theme-menu-item ${currentTheme === 'aws' ? 'active' : ''}" data-theme-target="aws">
              <span class="theme-swatch" style="background:#232f3e;border:1px solid #ff9900;"></span>
              <span class="theme-item-text">
                <strong>AWS Cloud Console</strong>
                <small>Squid Navy • CloudShell</small>
              </span>
            </button>
            <button role="menuitem" class="theme-menu-item ${currentTheme === 'netflix' ? 'active' : ''}" data-theme-target="netflix">
              <span class="theme-swatch" style="background:#141414;border:1px solid #e50914;"></span>
              <span class="theme-item-text">
                <strong>Netflix Cinematic</strong>
                <small>N-Red • Billboard Hero</small>
              </span>
            </button>
            <button role="menuitem" class="theme-menu-item ${currentTheme === 'minecraft' ? 'active' : ''}" data-theme-target="minecraft">
              <span class="theme-swatch" style="background:#0d120d;border:1px solid #3f8e3f;"></span>
              <span class="theme-item-text">
                <strong>Minecraft AIBridge</strong>
                <small>8-Bit Retro • Inventory UI</small>
              </span>
            </button>

            <!-- FX Level Controller -->
            <div class="fx-switcher-section" style="border-top:1px solid rgba(255,255,255,0.1);margin-top:6px;padding-top:6px;">
              <div style="font-size:0.7rem;color:#888;padding:2px 8px;text-transform:uppercase;">FX Motion Level</div>
              <div style="display:flex;gap:4px;padding:4px 6px;">
                <button class="fx-toggle-btn ${currentFx === 'off' ? 'active' : ''}" data-fx-target="off" style="flex:1;font-size:0.75rem;padding:3px;border-radius:4px;border:1px solid #444;background:${currentFx === 'off' ? '#38bdf8' : '#222'};color:${currentFx === 'off' ? '#000' : '#fff'};">Off</button>
                <button class="fx-toggle-btn ${currentFx === 'low' ? 'active' : ''}" data-fx-target="low" style="flex:1;font-size:0.75rem;padding:3px;border-radius:4px;border:1px solid #444;background:${currentFx === 'low' ? '#38bdf8' : '#222'};color:${currentFx === 'low' ? '#000' : '#fff'};">Low</button>
                <button class="fx-toggle-btn ${currentFx === 'full' ? 'active' : ''}" data-fx-target="full" style="flex:1;font-size:0.75rem;padding:3px;border-radius:4px;border:1px solid #444;background:${currentFx === 'full' ? '#38bdf8' : '#222'};color:${currentFx === 'full' ? '#000' : '#fff'};">Full</button>
              </div>
            </div>
          </div>
        </div>
      `;

      if (window.ThemeRegistry && typeof window.ThemeRegistry.bindEvents === 'function') {
        window.ThemeRegistry.bindEvents();
      }
    },

    bindProjectModals: function () {
      document.querySelectorAll('.project-modal-trigger').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const id = btn.getAttribute('data-project-id');
          if (id && typeof window.openProjectModal === 'function') {
            window.openProjectModal(id);
          }
        });
      });
    },

    bindContactForm: function () {
      const form = document.getElementById('contact-form');
      if (!form) return;
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const statusEl = document.getElementById('contact-status-msg');
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.disabled = true;
        if (statusEl) {
          statusEl.textContent = 'Transmitting message to Jnanesh...';
          statusEl.style.color = '#38bdf8';
        }

        const formData = new FormData(form);
        const payload = {
          name: formData.get('name'),
          email: formData.get('email'),
          message: formData.get('message')
        };

        try {
          const res = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          const data = await res.json();
          if (res.ok) {
            if (statusEl) {
              statusEl.textContent = '✔ Message transmitted successfully!';
              statusEl.style.color = '#10b981';
            }
            form.reset();
          } else {
            if (statusEl) {
              statusEl.textContent = `Error: ${data.message || 'Failed to send'}`;
              statusEl.style.color = '#ef4444';
            }
          }
        } catch (err) {
          if (statusEl) {
            statusEl.textContent = 'Network error transmitting message.';
            statusEl.style.color = '#ef4444';
          }
        } finally {
          if (submitBtn) submitBtn.disabled = false;
        }
      });
    },

    bindScrollReveal: function () {
      if (!('IntersectionObserver' in window)) {
        document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
        return;
      }
      const observer = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
          }
        });
      }, { threshold: 0.08 });

      document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    }
  };
})();
