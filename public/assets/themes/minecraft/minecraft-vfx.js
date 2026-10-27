/**
 * ═════════════════════════════════════════════════════════════════════════════
 * MINECRAFT ATMOSPHERE & PARTICLE VFX ENGINE
 * Authentic Minecraft Particles: XP Orbs, Redstone Dust, Enchantment Runes,
 * 2D Pixel Clouds (Day) / Twinkling Stars (Night), and Click Sparks / Hearts!
 * Scoped strictly to html[data-theme-style="minecraft"] with 0% CPU/GPU overhead
 * when inactive or when the browser tab is hidden.
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

  // Standard Galactic Alphabet runes used in Minecraft Enchanting Tables
  const SGA_GLYPHS = [
    'ᔑ', 'ʖ', 'ᓵ', '↸', 'ᒷ', '⎓', '⊣', '⍑', '╎', '⋮',
    'ꖌ', 'ꖎ', 'ᒲ', 'リ', '𝙹', '¡', 'ᑑ', '∷', 'ᓭ', 'ℸ',
    '⚍', '⍊', 'ᑾ', '·'
  ];

  // 6x7 8-bit Heart Bitmap
  const HEART_MAP = [
    [0, 1, 1, 0, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 0],
    [0, 0, 1, 1, 1, 0, 0],
    [0, 0, 0, 1, 0, 0, 0]
  ];

  // Block Debris color palettes (border, core)
  const BLOCK_PALETTES = [
    { border: '#0891b2', core: '#22d3ee', name: 'diamond' },
    { border: '#15803d', core: '#22c55e', name: 'grass' },
    { border: '#78350f', core: '#b45309', name: 'wood' },
    { border: '#991b1b', core: '#ef4444', name: 'redstone' },
    { border: '#b45309', core: '#fbbf24', name: 'gold' }
  ];

  const MinecraftVFX = {
    canvas: null,
    ctx: null,
    animId: null,
    isRunning: false,
    width: 0,
    height: 0,
    dpr: 1,

    // Particle buckets
    xpOrbs: [],
    redstoneDust: [],
    enchantingRunes: [],
    clouds: [],
    stars: [],
    sparks: [],

    // Limits for locked 60/120fps performance
    MAX_XP: 6,
    MAX_REDSTONE: 9,
    MAX_RUNES: 7,
    MAX_CLOUDS: 4,
    MAX_STARS: 15,
    MAX_SPARKS: 35,

    isLightMode: false,
    observer: null,
    resizeTimeout: null,

    /**
     * Initialize engine: sets up canvas, listeners, and starts if minecraft theme active
     */
    init: function () {
      if (typeof window === 'undefined' || typeof document === 'undefined') return;

      // Find or create canvas
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

      // Window resize handler (debounced)
      window.addEventListener('resize', () => {
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
          this.resize();
        }, 150);
      });

      // Tab visibility pause to save 100% battery/GPU
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          if (this.isRunning) {
            cancelAnimationFrame(this.animId);
            this.animId = null;
          }
        } else {
          if (this.isActiveTheme() && !this.isRunning) {
            this.start();
          }
        }
      });

      // Interactive Click Sparks (pointerdown for instant 0ms latency)
      window.addEventListener('pointerdown', (e) => {
        if (!this.isActiveTheme()) return;
        // Do not spawn on mobile pinch/zoom
        if (e.isPrimary === false) return;
        this.emitClickParticles(e.clientX, e.clientY);
      }, { passive: true });

      // Observe theme changes on <html>
      this.observer = new MutationObserver((mutations) => {
        for (const m of mutations) {
          if (m.type === 'attributes' && (m.attributeName === 'data-theme-style' || m.attributeName === 'data-theme')) {
            this.onThemeChange();
            break;
          }
        }
      });

      this.observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme-style', 'data-theme']
      });

      // Initial theme check
      this.onThemeChange();
    },

    /**
     * Check if Minecraft theme is active
     */
    isActiveTheme: function () {
      return document.documentElement.getAttribute('data-theme-style') === 'minecraft';
    },

    /**
     * Handle theme style or mode changes
     */
    onThemeChange: function () {
      const active = this.isActiveTheme();
      this.isLightMode = document.documentElement.getAttribute('data-theme') === 'light';

      if (active) {
        if (!this.isRunning) {
          this.start();
        }
      } else {
        if (this.isRunning) {
          this.stop();
        }
      }
    },

    /**
     * Canvas resize handler respecting device pixel ratio
     */
    resize: function () {
      if (!this.canvas) return;
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);

      this.canvas.width = Math.floor(this.width * this.dpr);
      this.canvas.height = Math.floor(this.height * this.dpr);

      if (this.ctx) {
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.scale(this.dpr, this.dpr);
        this.ctx.imageSmoothingEnabled = false;
      }
    },

    /**
     * Populate ambient particles
     */
    seedParticles: function () {
      this.xpOrbs = [];
      this.redstoneDust = [];
      this.enchantingRunes = [];
      this.clouds = [];
      this.stars = [];
      this.sparks = [];

      // XP Orbs
      for (let i = 0; i < this.MAX_XP; i++) {
        this.xpOrbs.push(this.createXPOrb(true));
      }

      // Redstone Dust
      for (let i = 0; i < this.MAX_REDSTONE; i++) {
        this.redstoneDust.push(this.createRedstone(true));
      }

      // Enchanting Runes
      for (let i = 0; i < this.MAX_RUNES; i++) {
        this.enchantingRunes.push(this.createRune(true));
      }

      // 2D Pixel Clouds (Day mode)
      for (let i = 0; i < this.MAX_CLOUDS; i++) {
        this.clouds.push(this.createCloud(true));
      }

      // Twinkling Stars (Night mode)
      for (let i = 0; i < this.MAX_STARS; i++) {
        this.stars.push(this.createStar());
      }
    },

    createXPOrb: function (randomY) {
      const baseX = Math.random() * this.width;
      return {
        baseX: baseX,
        x: baseX,
        y: randomY ? Math.random() * this.height : this.height + 25 + Math.random() * 50,
        vy: -0.45 - Math.random() * 0.45,
        wobbleSpeed: 0.03 + Math.random() * 0.03,
        wobbleAmp: 14 + Math.random() * 16,
        age: Math.floor(Math.random() * 200),
        scale: 1.8 + Math.random() * 0.6,
        pulsePhase: Math.random() * Math.PI * 2
      };
    },

    createRedstone: function (randomY) {
      return {
        x: Math.random() * this.width,
        y: randomY ? Math.random() * this.height : this.height + 15 + Math.random() * 30,
        vx: (Math.random() - 0.5) * 0.35,
        vy: -0.35 - Math.random() * 0.45,
        size: 1.8 + Math.random() * 0.8,
        life: 120 + Math.floor(Math.random() * 120),
        maxLife: 240,
        sparkleTimer: Math.floor(Math.random() * 45)
      };
    },

    createRune: function (randomY) {
      const colors = ['#c084fc', '#a855f7', '#22d3ee', '#38bdf8', '#e879f9'];
      return {
        glyph: SGA_GLYPHS[Math.floor(Math.random() * SGA_GLYPHS.length)],
        x: Math.random() * this.width,
        y: randomY ? Math.random() * this.height : this.height + 20 + Math.random() * 40,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -0.45 - Math.random() * 0.6,
        fontSize: Math.floor(11 + Math.random() * 4),
        color: colors[Math.floor(Math.random() * colors.length)],
        age: randomY ? Math.floor(Math.random() * 180) : 0,
        maxAge: 180 + Math.floor(Math.random() * 100),
        wobbleSpeed: 0.02 + Math.random() * 0.025,
        rotation: 0
      };
    },

    createCloud: function (randomX) {
      return {
        x: randomX ? Math.random() * this.width : -220,
        y: 15 + Math.random() * (Math.min(this.height * 0.28, 160)),
        w: 100 + Math.random() * 110,
        h: 24 + Math.random() * 16,
        vx: 0.2 + Math.random() * 0.22,
        alpha: 0.65 + Math.random() * 0.2
      };
    },

    createStar: function () {
      const colors = ['#ffffff', '#bae6fd', '#fef08a'];
      return {
        x: Math.random() * this.width,
        y: Math.random() * (this.height * 0.75),
        size: Math.random() > 0.35 ? 2 : 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        phase: Math.random() * Math.PI * 2,
        speed: 0.025 + Math.random() * 0.04
      };
    },

    /**
     * Start animation loop
     */
    start: function () {
      if (this.isRunning) return;
      this.isRunning = true;
      this.seedParticles();
      this.resize();

      if (this.canvas) {
        this.canvas.style.display = 'block';
      }

      const loop = () => {
        if (!this.isRunning) return;
        this.update();
        this.render();
        this.animId = requestAnimationFrame(loop);
      };

      this.animId = requestAnimationFrame(loop);
    },

    /**
     * Stop animation loop, release frames, and clear canvas
     */
    stop: function () {
      if (!this.isRunning) return;
      this.isRunning = false;

      if (this.animId) {
        cancelAnimationFrame(this.animId);
        this.animId = null;
      }

      if (this.ctx && this.canvas) {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.canvas.style.display = 'none';
      }

      this.sparks = [];
    },

    /**
     * Emit 5-8 pixel particles when clicking anywhere on the page
     */
    emitClickParticles: function (x, y) {
      if (!this.isRunning) return;
      const count = 5 + Math.floor(Math.random() * 4); // 5 to 8 particles

      // 25% chance to spawn an 8-bit Heart
      const hasHeart = Math.random() < 0.25;
      if (hasHeart) {
        this.sparks.push({
          type: 'heart',
          x: x,
          y: y,
          vx: (Math.random() - 0.5) * 1.6,
          vy: -2.2 - Math.random() * 1.0,
          gravity: -0.015, // floats upward
          size: 2,
          life: 50,
          maxLife: 50
        });
      }

      for (let i = 0; i < count; i++) {
        const rand = Math.random();
        if (rand < 0.45) {
          // Critical hit star (gold or diamond)
          const isGold = Math.random() > 0.5;
          this.sparks.push({
            type: 'crit',
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 7.5,
            vy: -Math.random() * 6 - 2,
            gravity: 0.24,
            drag: 0.96,
            size: 1.8 + Math.random() * 0.6,
            color: isGold ? '#facc15' : '#38bdf8',
            life: 38 + Math.floor(Math.random() * 12),
            maxLife: 50
          });
        } else if (rand < 0.8) {
          // Block debris chunk
          const palette = BLOCK_PALETTES[Math.floor(Math.random() * BLOCK_PALETTES.length)];
          this.sparks.push({
            type: 'block',
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 6.5,
            vy: -Math.random() * 5.5 - 1.5,
            gravity: 0.32,
            drag: 0.97,
            size: 3 + Math.floor(Math.random() * 2),
            rot: Math.random() * Math.PI,
            vRot: (Math.random() - 0.5) * 0.25,
            border: palette.border,
            color: palette.core,
            life: 42 + Math.floor(Math.random() * 14),
            maxLife: 56
          });
        } else {
          // Redstone spark
          this.sparks.push({
            type: 'redstone',
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 5,
            vy: -Math.random() * 4 - 1.5,
            gravity: 0.18,
            drag: 0.95,
            size: 2,
            color: '#ef4444',
            life: 32 + Math.floor(Math.random() * 10),
            maxLife: 42
          });
        }
      }

      // Throttle sparks pool to avoid performance degradation
      if (this.sparks.length > this.MAX_SPARKS) {
        this.sparks.splice(0, this.sparks.length - this.MAX_SPARKS);
      }
    },

    /**
     * Physics update loop
     */
    update: function () {
      // 1. XP Orbs
      for (let i = 0; i < this.xpOrbs.length; i++) {
        const o = this.xpOrbs[i];
        o.age++;
        o.x = o.baseX + Math.sin(o.age * o.wobbleSpeed + o.pulsePhase) * o.wobbleAmp;
        o.y += o.vy;
        if (o.y < -35) {
          this.xpOrbs[i] = this.createXPOrb(false);
        }
      }

      // 2. Redstone Dust
      for (let i = 0; i < this.redstoneDust.length; i++) {
        const r = this.redstoneDust[i];
        r.life--;
        r.sparkleTimer--;
        if (r.sparkleTimer <= 0) {
          r.sparkleTimer = 35 + Math.floor(Math.random() * 40);
        }
        r.x += r.vx + (Math.random() - 0.5) * 0.25;
        r.y += r.vy;
        if (r.life <= 0 || r.y < -15) {
          this.redstoneDust[i] = this.createRedstone(false);
        }
      }

      // 3. Enchanting Runes
      for (let i = 0; i < this.enchantingRunes.length; i++) {
        const e = this.enchantingRunes[i];
        e.age++;
        e.x += Math.sin(e.age * e.wobbleSpeed) * 0.6 + e.vx;
        e.y += e.vy;
        e.rotation = Math.sin(e.age * 0.04) * 0.12;
        if (e.age >= e.maxAge || e.y < -25) {
          this.enchantingRunes[i] = this.createRune(false);
        }
      }

      // 4. Atmosphere: Clouds or Stars
      if (this.isLightMode) {
        for (let i = 0; i < this.clouds.length; i++) {
          const c = this.clouds[i];
          c.x += c.vx;
          if (c.x > this.width + 250) {
            c.x = -250;
            c.y = 15 + Math.random() * (Math.min(this.height * 0.28, 160));
          }
        }
      } else {
        for (let i = 0; i < this.stars.length; i++) {
          const s = this.stars[i];
          s.phase += s.speed;
        }
      }

      // 5. Interactive Click Sparks
      for (let i = this.sparks.length - 1; i >= 0; i--) {
        const p = this.sparks[i];
        p.life--;
        if (p.life <= 0) {
          this.sparks.splice(i, 1);
          continue;
        }
        p.vx *= (p.drag || 1);
        p.vy *= (p.drag || 1);
        p.vy += p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        if (p.vRot) p.rot += p.vRot;
      }
    },

    /**
     * Canvas rendering loop
     */
    render: function () {
      const ctx = this.ctx;
      ctx.clearRect(0, 0, this.width, this.height);

      // ── Atmosphere Background Layer ──
      if (this.isLightMode) {
        // Draw 2D Pixel Clouds
        for (let i = 0; i < this.clouds.length; i++) {
          const c = this.clouds[i];
          this.drawPixelCloud(ctx, c.x, c.y, c.w, c.h, c.alpha);
        }
      } else {
        // Draw Twinkling Night Stars
        for (let i = 0; i < this.stars.length; i++) {
          const s = this.stars[i];
          const alpha = 0.22 + 0.68 * (0.5 + 0.5 * Math.sin(s.phase));
          const isCross = (alpha > 0.8 && s.size > 2);
          this.drawPixelStar(ctx, s.x, s.y, s.size, alpha, s.color, isCross);
        }
      }

      // ── Enchanting Table Glyphs ──
      for (let i = 0; i < this.enchantingRunes.length; i++) {
        const e = this.enchantingRunes[i];
        let alpha = 1;
        if (e.age < 30) {
          alpha = e.age / 30;
        } else if (e.age > e.maxAge - 45) {
          alpha = Math.max(0, (e.maxAge - e.age) / 45);
        }
        this.drawRune(ctx, e.x, e.y, e.glyph, e.color, alpha * 0.88, e.rotation, e.fontSize);
      }

      // ── Redstone Dust ──
      for (let i = 0; i < this.redstoneDust.length; i++) {
        const r = this.redstoneDust[i];
        const alpha = Math.min(1, r.life / 40);
        const isSparkle = r.sparkleTimer <= 2;
        this.drawRedstone(ctx, r.x, r.y, r.size, alpha, isSparkle);
      }

      // ── Floating XP Orbs ──
      for (let i = 0; i < this.xpOrbs.length; i++) {
        const o = this.xpOrbs[i];
        this.drawXPOrb(ctx, o.x, o.y, o.scale, o.age * 0.12 + o.pulsePhase);
      }

      // ── Interactive Click Sparks ──
      for (let i = 0; i < this.sparks.length; i++) {
        const p = this.sparks[i];
        const alpha = Math.max(0, p.life / p.maxLife);

        if (p.type === 'heart') {
          this.drawHeart(ctx, p.x, p.y, p.size, alpha);
        } else if (p.type === 'crit') {
          this.drawCritSpark(ctx, p.x, p.y, p.size, p.color, alpha);
        } else if (p.type === 'block') {
          this.drawBlockDebris(ctx, p.x, p.y, p.size, p.color, p.border, p.rot, alpha);
        } else if (p.type === 'redstone') {
          this.drawRedstone(ctx, p.x, p.y, p.size, alpha, false);
        }
      }
    },

    /**
     * Draw authentic Minecraft XP Orb (octagonal stepped pixel rings)
     */
    drawXPOrb: function (ctx, x, y, scale, pulse) {
      const s = scale;
      const rx = Math.round(x);
      const ry = Math.round(y);
      const isYellow = Math.sin(pulse) > 0;
      const midColor = isYellow ? '#facc15' : '#4ade80';

      ctx.save();
      ctx.translate(rx, ry);

      ctx.shadowColor = isYellow ? 'rgba(250, 204, 21, 0.45)' : 'rgba(74, 222, 128, 0.45)';
      ctx.shadowBlur = 6;

      // Outer border (dark green #14532d)
      ctx.fillStyle = '#14532d';
      ctx.fillRect(-2 * s, -4 * s, 4 * s, 8 * s);
      ctx.fillRect(-4 * s, -2 * s, 8 * s, 4 * s);
      ctx.fillRect(-3 * s, -3 * s, 6 * s, 6 * s);

      // Mid ring (alternating green/yellow)
      ctx.fillStyle = midColor;
      ctx.fillRect(-1.5 * s, -3 * s, 3 * s, 6 * s);
      ctx.fillRect(-3 * s, -1.5 * s, 6 * s, 3 * s);
      ctx.fillRect(-2 * s, -2 * s, 4 * s, 4 * s);

      // Inner radiant core (pure white)
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-1 * s, -1 * s, 2 * s, 2 * s);

      ctx.restore();
    },

    /**
     * Draw authentic Redstone Dust pixel cross
     */
    drawRedstone: function (ctx, x, y, size, alpha, isSparkle) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
      const s = size;
      const rx = Math.round(x);
      const ry = Math.round(y);

      ctx.shadowColor = 'rgba(239, 68, 68, 0.75)';
      ctx.shadowBlur = isSparkle ? 8 : 4;

      // Cross arms
      ctx.fillStyle = '#991b1b';
      ctx.fillRect(rx - s, ry - 2 * s, 2 * s, 4 * s);
      ctx.fillRect(rx - 2 * s, ry - s, 4 * s, 2 * s);

      // Core pixel
      ctx.fillStyle = isSparkle ? '#ffffff' : '#ef4444';
      ctx.fillRect(rx - s * 0.8, ry - s * 0.8, 1.6 * s, 1.6 * s);

      ctx.restore();
    },

    /**
     * Draw Enchanting Table Galactic Alphabet Rune
     */
    drawRune: function (ctx, x, y, glyph, color, alpha, rotation, size) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
      ctx.translate(Math.round(x), Math.round(y));
      if (rotation) ctx.rotate(rotation);

      ctx.font = `${size}px "Press Start 2P", monospace, sans-serif`;
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 6;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(glyph, 0, 0);

      ctx.restore();
    },

    /**
     * Draw 2D Pixel Cloud (stepped Minecraft daylight cloud)
     */
    drawPixelCloud: function (ctx, x, y, width, height, alpha) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
      const rx = Math.round(x);
      const ry = Math.round(y);
      const step = 8;
      const w = Math.round(width / step) * step;
      const h = Math.round(height / step) * step;

      // Top white puff
      ctx.fillStyle = 'rgba(255, 255, 255, 0.72)';
      ctx.fillRect(rx, ry, w, h - step);
      ctx.fillRect(rx + step * 2, ry - step, w - step * 4, step);
      ctx.fillRect(rx - step, ry + step, w + step * 2, h - step * 2);

      // Bottom cloud shadow band
      ctx.fillStyle = 'rgba(186, 205, 225, 0.65)';
      ctx.fillRect(rx - step, ry + h - step, w + step * 2, step);

      ctx.restore();
    },

    /**
     * Draw Twinkling Night Star
     */
    drawPixelStar: function (ctx, x, y, size, alpha, color, isCross) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
      const rx = Math.round(x);
      const ry = Math.round(y);

      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 4;

      if (isCross) {
        ctx.fillRect(rx, ry - size, size, size * 3);
        ctx.fillRect(rx - size, ry, size * 3, size);
      } else {
        ctx.fillRect(rx, ry, size, size);
      }

      ctx.restore();
    },

    /**
     * Draw Minecraft Critical Hit star
     */
    drawCritSpark: function (ctx, x, y, size, color, alpha) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
      const rx = Math.round(x);
      const ry = Math.round(y);
      const s = size;

      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 6;

      ctx.fillRect(rx - s, ry - s * 2, s * 2, s * 4);
      ctx.fillRect(rx - s * 2, ry - s, s * 4, s * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(rx - s * 0.5, ry - s * 0.5, s, s);

      ctx.restore();
    },

    /**
     * Draw 8-Bit Pixel Heart
     */
    drawHeart: function (ctx, x, y, size, alpha) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
      const rx = Math.round(x);
      const ry = Math.round(y);
      const s = size;

      ctx.fillStyle = '#ef4444';
      ctx.shadowColor = 'rgba(239, 68, 68, 0.75)';
      ctx.shadowBlur = 5;

      for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 7; c++) {
          if (HEART_MAP[r][c] === 1) {
            ctx.fillRect(rx + (c - 3) * s, ry + (r - 3) * s, s, s);
          }
        }
      }

      ctx.restore();
    },

    /**
     * Draw Block Debris chunk
     */
    drawBlockDebris: function (ctx, x, y, size, color, border, rotation, alpha) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
      ctx.translate(Math.round(x), Math.round(y));
      if (rotation) ctx.rotate(rotation);

      const s = size;
      ctx.fillStyle = border;
      ctx.fillRect(-s / 2, -s / 2, s, s);
      ctx.fillStyle = color;
      ctx.fillRect(-s / 2 + 1, -s / 2 + 1, s - 2, s - 2);

      ctx.restore();
    }
  };

  // Auto-init on DOMContentLoaded or immediately if DOM already loaded
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => MinecraftVFX.init());
    } else {
      MinecraftVFX.init();
    }
  }

  return MinecraftVFX;
});
