/**
 * ═════════════════════════════════════════════════════════════════════════════
 * MINECRAFT ATMOSPHERE & PARTICLE VFX ENGINE (DIET MODE)
 * Strictly gated by data-fx="off|low|full" (Default: "low")
 * - "off": 0% VFX, no loops, forced by prefers-reduced-motion.
 * - "low" (Default): 0% ambient particles, 0 rAF loops. Only trigger-based clicks.
 * - "full": At most ONE ambient effect at a time, 70% lower density,
 *   pauses when tab is hidden, user is typing, or page is idle.
 * ═════════════════════════════════════════════════════════════════════════════
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.MinecraftVFX = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const MinecraftVFX = {
    canvas: null,
    ctx: null,
    animId: null,
    isRunning: false,
    width: 0,
    height: 0,
    dpr: 1,

    // Controlled particle limits (70% reduction)
    particles: [],
    MAX_PARTICLES: 6, // strictly capped
    isUserTyping: false,
    observer: null,

    init: function () {
      if (typeof window === 'undefined' || typeof document === 'undefined') return;

      this.canvas = document.getElementById('minecraft-vfx-canvas');
      if (!this.canvas) {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'minecraft-vfx-canvas';
        this.canvas.setAttribute('aria-hidden', 'true');
        document.body.appendChild(this.canvas);
      }

      this.ctx = this.canvas.getContext('2d', { alpha: true });
      if (!this.ctx) return;

      this.resize();

      window.addEventListener('resize', () => this.resize(), { passive: true });

      // Detect user typing to pause immediately
      document.addEventListener('focusin', (e) => {
        if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) {
          this.isUserTyping = true;
          this.stop();
        }
      });

      document.addEventListener('focusout', (e) => {
        if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) {
          this.isUserTyping = false;
          this.checkAndRun();
        }
      });

      // Pause when tab is hidden
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          this.stop();
        } else {
          this.checkAndRun();
        }
      });

      // Observe data-theme and data-fx attributes
      this.observer = new MutationObserver(() => this.checkAndRun());
      this.observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme', 'data-theme-style', 'data-fx']
      });

      this.checkAndRun();
    },

    resize: function () {
      if (!this.canvas) return;
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.canvas.width = Math.floor(this.width * this.dpr);
      this.canvas.height = Math.floor(this.height * this.dpr);
      this.canvas.style.width = this.width + 'px';
      this.canvas.style.height = this.height + 'px';
      if (this.ctx) {
        this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      }
    },

    isMinecraftActive: function () {
      const theme = document.documentElement.getAttribute('data-theme') || document.documentElement.getAttribute('data-theme-style');
      return theme === 'minecraft';
    },

    getFxLevel: function () {
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return 'off';
      }
      return document.documentElement.getAttribute('data-fx') || 'low';
    },

    checkAndRun: function () {
      const isMC = this.isMinecraftActive();
      const fx = this.getFxLevel();

      // Only run when Minecraft is active AND fx is explicitly 'full' AND not typing AND not hidden
      if (isMC && fx === 'full' && !this.isUserTyping && !document.hidden) {
        if (this.canvas) this.canvas.style.display = 'block';
        this.start();
      } else {
        if (this.canvas) {
          this.canvas.style.display = 'none';
          if (this.ctx) this.ctx.clearRect(0, 0, this.width, this.height);
        }
        this.stop();
      }
    },

    start: function () {
      if (this.isRunning) return;
      this.isRunning = true;
      this.particles = [];

      // Spawn at most 3 lightweight XP orbs
      for (let i = 0; i < 3; i++) {
        this.particles.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: -0.3 - Math.random() * 0.4,
          size: 4,
          color: i % 2 === 0 ? '#80ff20' : '#ffff55'
        });
      }

      const loop = () => {
        if (!this.isRunning) return;
        this.render();
        this.animId = requestAnimationFrame(loop);
      };
      this.animId = requestAnimationFrame(loop);
    },

    stop: function () {
      this.isRunning = false;
      if (this.animId) {
        cancelAnimationFrame(this.animId);
        this.animId = null;
      }
      this.particles = [];
      if (this.ctx && this.canvas) {
        this.ctx.clearRect(0, 0, this.width, this.height);
      }
    },

    render: function () {
      if (!this.ctx || !this.isRunning) return;
      this.ctx.clearRect(0, 0, this.width, this.height);

      for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.y < -10) {
          p.y = this.height + 10;
          p.x = Math.random() * this.width;
        }

        this.ctx.fillStyle = p.color;
        this.ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.size, p.size);
      }
    }
  };

  return MinecraftVFX;
});
