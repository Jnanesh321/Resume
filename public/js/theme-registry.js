/**
 * ══════════════════════════════════════════════════════════════════
 * THEME REGISTRY & ENGINE (theme-registry.js)
 * Manages theme registration, lazy-loading stylesheets, keyboard-accessible
 * UI switcher, URL query param (?theme=x), and persistent state.
 * Default theme: "obsidian" (zero extra network load).
 * ══════════════════════════════════════════════════════════════════
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'jnanesh-active-theme';
  const loadedStylesheets = new Map();

  const THEMES = [
    {
      id: 'obsidian',
      label: 'Obsidian Dark',
      category: 'Default',
      badge: 'Core Identity',
      description: 'Sophisticated deep navy-slate palette with cyan electric accents, Syne typography, and tactile engineering cards.',
      swatch: {
        bg: '#090d13',
        surface: '#0f1722',
        accent: '#38bdf8',
        border: 'rgba(255,255,255,0.1)'
      },
      cssPath: null // Inlined in tokens.css + base styles
    },
    {
      id: 'apple',
      label: 'Apple Glass',
      category: 'Design Systems',
      badge: 'Frosted Glassmorphism',
      description: 'Translucent layered glassmorphism, 24px soft radii, system-ui typography, subtle specular inner highlights, and bento card structures.',
      swatch: {
        bg: '#000000',
        surface: 'rgba(35, 35, 42, 0.65)',
        accent: '#2997ff',
        border: 'rgba(255,255,255,0.15)'
      },
      cssPath: '/css/themes/apple.css'
    },
    {
      id: 'aws',
      label: 'AWS Cloud Console',
      category: 'Infrastructure',
      badge: 'Systems Console',
      description: 'Squid-ink navy navigation, Amazon orange telemetry highlights, CloudShell command dock, resource table cards, and ap-south-1 status chips.',
      swatch: {
        bg: '#0f172a',
        surface: '#1b2a4a',
        accent: '#ff9900',
        border: '#2a3b5c'
      },
      cssPath: '/css/themes/aws.css'
    },
    {
      id: 'netflix',
      label: 'Netflix Cinematic',
      category: 'Entertainment',
      badge: 'Cinematic Scrim',
      description: 'Cinematic pitch-dark canvas, N-Red accents, billboard hero featuring play & more info actions, and horizontal preview carousels.',
      swatch: {
        bg: '#141414',
        surface: '#1f1f1f',
        accent: '#e50914',
        border: '#333333'
      },
      cssPath: '/css/themes/netflix.css'
    },
    {
      id: 'minecraft',
      label: 'Minecraft AIBridge',
      category: 'Easter Egg',
      badge: '8-Bit Retro Overhaul',
      description: 'Secret gamer mode: 8-bit Press Start 2P typography, 3D pixel bevels, XP progress bar, item hotbar, and Web Audio retro synthesizer.',
      swatch: {
        bg: '#0d120d',
        surface: '#151d15',
        accent: '#2cf5d6',
        border: '#3f8e3f'
      },
      cssPath: '/css/themes/minecraft.css'
    }
  ];

  /**
   * Dynamically loads a theme stylesheet with caching and error handling
   */
  function loadThemeStylesheet(theme) {
    if (!theme.cssPath) return Promise.resolve();
    if (loadedStylesheets.has(theme.id)) return Promise.resolve();

    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = theme.cssPath;
      link.id = `theme-css-${theme.id}`;
      link.onload = () => {
        loadedStylesheets.set(theme.id, link);
        resolve();
      };
      link.onerror = () => {
        console.warn(`[ThemeRegistry] Failed to load stylesheet for ${theme.id}: ${theme.cssPath}`);
        resolve(); // Degrade gracefully to base tokens
      };
      document.head.appendChild(link);
    });
  }

  /**
   * Theme Registry Public API
   */
  const ThemeRegistry = {
    themes: THEMES,

    getTheme: function (id) {
      return THEMES.find(t => t.id === id) || THEMES[0];
    },

    getCurrentThemeId: function () {
      return document.documentElement.getAttribute('data-theme') || 'obsidian';
    },

    applyTheme: async function (themeId, options = {}) {
      const { persist = true, announce = true } = options;
      const theme = this.getTheme(themeId);
      const root = document.documentElement;
      const prevThemeId = root.getAttribute('data-theme');

      // Lazy load stylesheet if necessary
      if (theme.cssPath) {
        await loadThemeStylesheet(theme);
      }

      // Set attribute on root HTML
      root.setAttribute('data-theme', theme.id);
      // Retain compatibility with legacy selectors
      root.setAttribute('data-theme-style', theme.id === 'obsidian' ? 'default' : theme.id);

      // Persist in localStorage
      if (persist) {
        try {
          localStorage.setItem(STORAGE_KEY, theme.id);
        } catch (e) {
          console.warn('[ThemeRegistry] localStorage write blocked', e);
        }
      }

      // Update URL query param cleanly without reload
      try {
        const url = new URL(window.location.href);
        if (theme.id === 'obsidian') {
          url.searchParams.delete('theme');
        } else {
          url.searchParams.set('theme', theme.id);
        }
        window.history.replaceState({}, '', url.toString());
      } catch (e) {}

      // Update UI Dropdown / Menu state
      this.updateSwitcherUI(theme.id);

      // Dispatch event for components that have reactive behavior
      window.dispatchEvent(new CustomEvent('themeChanged', {
        detail: { themeId: theme.id, theme, prevThemeId }
      }));

      // Announce toast if requested
      if (announce && options.userInitiated) {
        this.showToast(theme);
      }

      return theme;
    },

    updateSwitcherUI: function (activeId) {
      const labelEl = document.getElementById('theme-menu-current-label');
      if (labelEl) {
        const activeTheme = this.getTheme(activeId);
        labelEl.textContent = activeTheme.label;
      }

      document.querySelectorAll('.theme-menu-item').forEach(btn => {
        const id = btn.getAttribute('data-theme-target');
        const isActive = id === activeId;
        btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
        btn.classList.toggle('active', isActive);
      });
    },

    showToast: function (theme) {
      const toast = document.getElementById('theme-toast');
      const nameEl = document.getElementById('toast-theme-name');
      if (!toast || !nameEl) return;

      nameEl.textContent = `${theme.label} Active — ${theme.badge}`;
      toast.classList.add('show');
      clearTimeout(window._toastTimeout);
      window._toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
      }, 3500);
    },

    init: function () {
      // 1. Check URL param ?theme=xyz
      let initialTheme = 'obsidian';
      try {
        const params = new URLSearchParams(window.location.search);
        const urlTheme = params.get('theme');
        if (urlTheme && THEMES.some(t => t.id === urlTheme)) {
          initialTheme = urlTheme;
        } else {
          // 2. Check localStorage
          const saved = localStorage.getItem(STORAGE_KEY);
          if (saved && THEMES.some(t => t.id === saved)) {
            initialTheme = saved;
          }
        }
      } catch (e) {}

      this.applyTheme(initialTheme, { persist: false, announce: false });
      this.bindSwitcherEvents();
    },

    bindSwitcherEvents: function () {
      const toggleBtn = document.getElementById('theme-menu-toggle');
      const dropdown = document.getElementById('theme-menu-dropdown');
      if (!toggleBtn || !dropdown) return;

      const openDropdown = () => {
        dropdown.classList.add('open');
        toggleBtn.setAttribute('aria-expanded', 'true');
        const activeItem = dropdown.querySelector('.theme-menu-item.active') || dropdown.querySelector('.theme-menu-item');
        if (activeItem) activeItem.focus();
      };

      const closeDropdown = () => {
        dropdown.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
      };

      toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = dropdown.classList.contains('open');
        if (isOpen) closeDropdown();
        else openDropdown();
      });

      // Item selection
      dropdown.querySelectorAll('.theme-menu-item').forEach(item => {
        item.addEventListener('click', (e) => {
          e.stopPropagation();
          const target = item.getAttribute('data-theme-target');
          if (target) {
            this.applyTheme(target, { userInitiated: true });
            closeDropdown();
            toggleBtn.focus();
          }
        });
      });

      // Keyboard navigation (ArrowUp, ArrowDown, Home, End, Escape)
      dropdown.addEventListener('keydown', (e) => {
        const items = Array.from(dropdown.querySelectorAll('.theme-menu-item:not([disabled])'));
        const currentIndex = items.indexOf(document.activeElement);

        if (e.key === 'ArrowDown') {
          e.preventDefault();
          const nextIndex = (currentIndex + 1) % items.length;
          items[nextIndex].focus();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          const prevIndex = (currentIndex - 1 + items.length) % items.length;
          items[prevIndex].focus();
        } else if (e.key === 'Home') {
          e.preventDefault();
          items[0].focus();
        } else if (e.key === 'End') {
          e.preventDefault();
          items[items.length - 1].focus();
        } else if (e.key === 'Escape') {
          e.preventDefault();
          closeDropdown();
          toggleBtn.focus();
        }
      });

      // Close on outside click
      document.addEventListener('click', (e) => {
        if (!toggleBtn.contains(e.target) && !dropdown.contains(e.target)) {
          closeDropdown();
        }
      });
    }
  };

  // Expose globally
  window.ThemeRegistry = ThemeRegistry;

  // Run on DOMContentLoaded or immediately
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ThemeRegistry.init());
  } else {
    ThemeRegistry.init();
  }
})();
