/**
 * ══════════════════════════════════════════════════════════════════
 * THEME REGISTRY & FX CONTROLLER (theme-registry.js)
 * Manages theme registration, lazy-loading stylesheets, keyboard-accessible
 * UI switcher, URL query param (?theme=x), and persistent state.
 * Includes data-fx="off|low|full" controller (Default: "low").
 * ══════════════════════════════════════════════════════════════════
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'jnanesh-active-theme';
  const FX_STORAGE_KEY = 'jnanesh-fx-level';
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
      badge: '8-Bit Retro (Diet Mode)',
      description: 'Minecraft-flavored aesthetic: Press Start 2P headings, static beveled cards, thin scroll XP bar, and single CTA block break.',
      swatch: {
        bg: '#0d120d',
        surface: '#151d15',
        accent: '#2cf5d6',
        border: '#3f8e3f'
      },
      cssPath: '/css/themes/minecraft.css'
    }
  ];

  function loadThemeStylesheet(theme) {
    if (!theme.cssPath) return Promise.resolve();
    if (loadedStylesheets.has(theme.id)) return Promise.resolve();

    return new Promise((resolve) => {
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
        resolve();
      };
      document.head.appendChild(link);
    });
  }

  const ThemeRegistry = {
    themes: THEMES,

    getTheme: function (id) {
      return THEMES.find(t => t.id === id) || THEMES[0];
    },

    getCurrentThemeId: function () {
      return document.documentElement.getAttribute('data-theme') || 'obsidian';
    },

    getFxLevel: function () {
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return 'off';
      }
      try {
        return localStorage.getItem(FX_STORAGE_KEY) || 'low';
      } catch (e) {
        return 'low';
      }
    },

    setFxLevel: function (level) {
      const valid = ['off', 'low', 'full'];
      const targetLevel = valid.includes(level) ? level : 'low';
      document.documentElement.setAttribute('data-fx', targetLevel);
      try {
        localStorage.setItem(FX_STORAGE_KEY, targetLevel);
      } catch (e) {}

      // Update button UI
      document.querySelectorAll('.fx-toggle-btn').forEach(b => {
        const isActive = b.getAttribute('data-fx-target') === targetLevel;
        b.classList.toggle('active', isActive);
        b.setAttribute('aria-checked', isActive ? 'true' : 'false');
      });

      window.dispatchEvent(new CustomEvent('fxLevelChanged', { detail: { level: targetLevel } }));
      return targetLevel;
    },

    applyTheme: async function (themeId, options = {}) {
      const { persist = true, announce = true } = options;
      const theme = this.getTheme(themeId);
      const root = document.documentElement;
      const prevThemeId = root.getAttribute('data-theme');

      if (theme.cssPath) {
        await loadThemeStylesheet(theme);
      }

      root.setAttribute('data-theme', theme.id);
      root.setAttribute('data-theme-style', theme.id === 'obsidian' ? 'default' : theme.id);

      if (persist) {
        try {
          localStorage.setItem(STORAGE_KEY, theme.id);
        } catch (e) {}
      }

      try {
        const url = new URL(window.location.href);
        if (theme.id === 'obsidian') {
          url.searchParams.delete('theme');
        } else {
          url.searchParams.set('theme', theme.id);
        }
        window.history.replaceState({}, '', url.toString());
      } catch (e) {}

      this.updateSwitcherUI(theme.id);

      window.dispatchEvent(new CustomEvent('themeChanged', {
        detail: { themeId: theme.id, theme, prevThemeId }
      }));

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
      // 1. Initialize FX Level (Default: "low")
      const currentFx = this.getFxLevel();
      this.setFxLevel(currentFx);

      // 2. Initialize Theme
      let initialTheme = 'obsidian';
      try {
        const params = new URLSearchParams(window.location.search);
        const urlTheme = params.get('theme');
        if (urlTheme && THEMES.some(t => t.id === urlTheme)) {
          initialTheme = urlTheme;
        } else {
          const saved = localStorage.getItem(STORAGE_KEY);
          if (saved && THEMES.some(t => t.id === saved)) {
            initialTheme = saved;
          }
        }
      } catch (e) {}

      this.applyTheme(initialTheme, { persist: false, announce: false });
      this.bindEvents();
    },

    bindEvents: function () {
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
        if (dropdown.classList.contains('open')) closeDropdown();
        else openDropdown();
      });

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

      // FX level toggle buttons
      dropdown.querySelectorAll('.fx-toggle-btn').forEach(b => {
        b.addEventListener('click', (e) => {
          e.stopPropagation();
          const targetFx = b.getAttribute('data-fx-target');
          if (targetFx) {
            this.setFxLevel(targetFx);
          }
        });
      });

      // Keyboard navigation
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
        } else if (e.key === 'Escape') {
          e.preventDefault();
          closeDropdown();
          toggleBtn.focus();
        }
      });

      document.addEventListener('click', (e) => {
        if (!toggleBtn.contains(e.target) && !dropdown.contains(e.target)) {
          closeDropdown();
        }
      });
    }
  };

  window.ThemeRegistry = ThemeRegistry;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ThemeRegistry.init());
  } else {
    ThemeRegistry.init();
  }
})();
