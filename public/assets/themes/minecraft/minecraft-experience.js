/**
 * ═════════════════════════════════════════════════════════════════════════════
 * MINECRAFT TACTILE EXPERIENCE (DIET EDITION)
 * Budget:
 * - Scroll-based XP bar (thin line, 0 particles, 0 flashes)
 * - Hotbar as static nav element (collapsed by default on mobile)
 * - ONE signature moment: short block-break on primary CTA click only (<400ms)
 * - SFX: muted by default, 0 sound on hover/scroll, explicit click only
 * ═════════════════════════════════════════════════════════════════════════════
 */

(function () {
  'use strict';

  // ── 1. Muted-by-Default 8-Bit Web Audio Synthesizer ──
  const MinecraftAudio = (function () {
    let audioCtx = null;
    let isMuted = localStorage.getItem('mc-audio-muted') !== 'false'; // default MUTED

    function initCtx() {
      if (!audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
          audioCtx = new AudioContextClass();
        }
      }
      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume().catch(() => {});
      }
    }

    return {
      init: initCtx,
      isMuted: () => isMuted,
      toggleMute: function () {
        isMuted = !isMuted;
        localStorage.setItem('mc-audio-muted', isMuted ? 'true' : 'false');
        return isMuted;
      },
      playClick: function () {
        if (isMuted) return;
        initCtx();
        if (!audioCtx) return;
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.03);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.035);
      },
      playBlockBreak: function () {
        if (isMuted) return;
        initCtx();
        if (!audioCtx) return;
        const now = audioCtx.currentTime;
        const buf = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.06, audioCtx.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
        const noise = audioCtx.createBufferSource();
        noise.buffer = buf;
        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.06);
        noise.connect(gain);
        gain.connect(audioCtx.destination);
        noise.start(now);
      }
    };
  })();

  // ── 2. HUD Elements & State ──
  const HOTBAR_ITEMS = [
    { slot: 1, name: 'Diamond Sword', icon: '/assets/themes/minecraft/diamond-sword.svg', lore: 'Sharpness V\nSystems & Infrastructure' },
    { slot: 2, name: 'Diamond Pickaxe', icon: '/assets/themes/minecraft/pickaxe.svg', lore: 'Efficiency V\nCore Engineering' },
    { slot: 3, name: 'Redstone Dust', icon: '/assets/themes/minecraft/redstone.svg', lore: 'High-speed logic & APIs' },
    { slot: 4, name: 'Golden Apple', icon: '/assets/themes/minecraft/golden-apple.svg', lore: 'Absorption II\nResilient Backend Design' },
    { slot: 5, name: 'Enchanted Book', icon: '/assets/themes/minecraft/enchanted-book.svg', lore: 'Open MGU.One Architecture' },
    { slot: 6, name: 'Pixel Torch', icon: '/assets/themes/minecraft/pixel-torch.svg', lore: 'Toggle Light/Dark Mode' },
    { slot: 7, name: 'Ender Pearl', icon: '/assets/themes/minecraft/ender-pearl.svg', lore: 'Teleport to Top' },
    { slot: 8, name: 'Emerald', icon: '/assets/themes/minecraft/emerald.svg', lore: 'View Projects' },
    { slot: 9, name: 'Bow', icon: '/assets/themes/minecraft/bow.svg', lore: 'Direct Contact' }
  ];

  let selectedSlot = 1;
  let hudContainer = null;
  let xpBarInner = null;
  let xpLevelNum = null;
  let tooltipEl = null;

  function isMinecraftActive() {
    const t = document.documentElement.getAttribute('data-theme') || document.documentElement.getAttribute('data-theme-style');
    return t === 'minecraft';
  }

  function createHUD() {
    if (document.getElementById('mc-hud-container')) return;

    hudContainer = document.createElement('div');
    hudContainer.id = 'mc-hud-container';
    hudContainer.className = 'mc-hud-container';

    // Auto collapse on mobile
    if (window.innerWidth <= 600) {
      hudContainer.classList.add('collapsed');
    }

    // XP Row
    const xpRow = document.createElement('div');
    xpRow.className = 'mc-xp-row';

    xpLevelNum = document.createElement('div');
    xpLevelNum.className = 'mc-xp-level';
    xpLevelNum.textContent = '30';

    const xpOuter = document.createElement('div');
    xpOuter.className = 'mc-xp-bar-outer';
    xpOuter.title = 'Scroll Experience Progress';

    xpBarInner = document.createElement('div');
    xpBarInner.className = 'mc-xp-bar-inner';
    xpOuter.appendChild(xpBarInner);

    xpRow.appendChild(xpLevelNum);
    xpRow.appendChild(xpOuter);
    hudContainer.appendChild(xpRow);

    // Hotbar Row
    const hotbarWrap = document.createElement('div');
    hotbarWrap.className = 'mc-hotbar-wrap';

    const hotbar = document.createElement('div');
    hotbar.className = 'mc-hotbar';
    hotbar.setAttribute('role', 'toolbar');
    hotbar.setAttribute('aria-label', 'Minecraft Quick Navigation Hotbar');

    HOTBAR_ITEMS.forEach(item => {
      const slot = document.createElement('div');
      slot.className = `mc-slot ${item.slot === selectedSlot ? 'active' : ''}`;
      slot.setAttribute('data-slot', item.slot);
      slot.setAttribute('tabindex', '0');
      slot.setAttribute('role', 'button');
      slot.setAttribute('aria-label', item.name);

      const num = document.createElement('span');
      num.className = 'mc-slot-num';
      num.textContent = item.slot;

      const img = document.createElement('img');
      img.src = item.icon;
      img.alt = item.name;
      img.className = 'mc-slot-img';

      slot.appendChild(num);
      slot.appendChild(img);

      slot.addEventListener('click', (e) => {
        e.stopPropagation();
        selectSlot(item.slot);
        MinecraftAudio.playClick();
        triggerItemAction(item.slot);
      });

      slot.addEventListener('mouseenter', (e) => showTooltip(item, e));
      slot.addEventListener('mouseleave', hideTooltip);

      hotbar.appendChild(slot);
    });

    hotbarWrap.appendChild(hotbar);

    // Controls (Mute & Toggle)
    const controls = document.createElement('div');
    controls.className = 'mc-hud-controls';

    const muteBtn = document.createElement('button');
    muteBtn.type = 'button';
    muteBtn.className = 'mc-hud-btn';
    muteBtn.id = 'mc-audio-btn';
    muteBtn.setAttribute('aria-label', 'Toggle Minecraft Audio');
    muteBtn.innerHTML = MinecraftAudio.isMuted() ? '🔇' : '🔊';
    muteBtn.title = MinecraftAudio.isMuted() ? 'Sound: Muted (Click to enable)' : 'Sound: Enabled';
    muteBtn.addEventListener('click', () => {
      const isMuted = MinecraftAudio.toggleMute();
      muteBtn.innerHTML = isMuted ? '🔇' : '🔊';
      muteBtn.title = isMuted ? 'Sound: Muted (Click to enable)' : 'Sound: Enabled';
      if (!isMuted) MinecraftAudio.playClick();
    });

    const collapseBtn = document.createElement('button');
    collapseBtn.type = 'button';
    collapseBtn.className = 'mc-hud-btn';
    collapseBtn.setAttribute('aria-label', 'Collapse or Expand Hotbar');
    collapseBtn.innerHTML = '▤';
    collapseBtn.title = 'Toggle Hotbar Visibility';
    collapseBtn.addEventListener('click', () => {
      hudContainer.classList.toggle('collapsed');
      MinecraftAudio.playClick();
    });

    controls.appendChild(muteBtn);
    controls.appendChild(collapseBtn);
    hotbarWrap.appendChild(controls);
    hudContainer.appendChild(hotbarWrap);

    document.body.appendChild(hudContainer);

    // Tooltip
    tooltipEl = document.createElement('div');
    tooltipEl.id = 'mc-tooltip';
    tooltipEl.className = 'mc-tooltip';
    document.body.appendChild(tooltipEl);
  }

  function selectSlot(slotNum) {
    selectedSlot = slotNum;
    document.querySelectorAll('.mc-slot').forEach(s => {
      s.classList.toggle('active', parseInt(s.getAttribute('data-slot'), 10) === slotNum);
    });
  }

  function triggerItemAction(slotNum) {
    if (slotNum === 5) {
      if (typeof openProjectModal === 'function') openProjectModal('mgu');
    } else if (slotNum === 6) {
      const torch = document.getElementById('torch-btn');
      if (torch) torch.click();
    } else if (slotNum === 7) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (slotNum === 8) {
      const p = document.getElementById('projects');
      if (p) p.scrollIntoView({ behavior: 'smooth' });
    } else if (slotNum === 9) {
      const c = document.getElementById('contact');
      if (c) c.scrollIntoView({ behavior: 'smooth' });
    }
  }

  function showTooltip(item, e) {
    if (!tooltipEl) return;
    tooltipEl.innerHTML = `
      <div class="mc-tip-title">${item.name}</div>
      <div class="mc-tip-lore">${item.lore.replace(/\n/g, '<br>')}</div>
    `;
    const rect = e.currentTarget.getBoundingClientRect();
    tooltipEl.style.left = `${Math.round(rect.left + rect.width / 2)}px`;
    tooltipEl.style.bottom = `${Math.round(window.innerHeight - rect.top + 8)}px`;
    tooltipEl.classList.add('visible');
  }

  function hideTooltip() {
    if (tooltipEl) tooltipEl.classList.remove('visible');
  }

  // ── 3. Scroll-Based XP Bar (No Particles) ──
  function updateScrollXP() {
    if (!isMinecraftActive() || !xpBarInner) return;
    const h = document.documentElement;
    const b = document.body;
    const st = h.scrollTop || b.scrollTop;
    const sh = (h.scrollHeight || b.scrollHeight) - h.clientHeight;
    const pct = sh > 0 ? Math.min(Math.max(st / sh, 0), 1) : 0;

    xpBarInner.style.width = `${Math.round(pct * 100)}%`;
    if (xpLevelNum) {
      xpLevelNum.textContent = Math.round(pct * 30);
    }
  }

  // ── 4. ONE Signature Moment: Short Block-Break Effect on Primary CTA Only ──
  function triggerBlockBreak(targetEl) {
    if (!isMinecraftActive()) return;
    const fx = document.documentElement.getAttribute('data-fx') || 'low';
    if (fx === 'off') return;

    MinecraftAudio.playBlockBreak();

    const rect = targetEl.getBoundingClientRect();
    const crack = document.createElement('div');
    crack.className = 'mc-crack-overlay';
    crack.style.left = `${rect.left + rect.width / 2}px`;
    crack.style.top = `${rect.top + rect.height / 2}px`;
    document.body.appendChild(crack);

    setTimeout(() => {
      if (crack.parentNode) crack.parentNode.removeChild(crack);
    }, 350); // Under 400ms budget
  }

  // ── 5. Setup & Bindings ──
  function init() {
    createHUD();
    window.addEventListener('scroll', updateScrollXP, { passive: true });
    updateScrollXP();

    // Bind signature block-break to primary CTA only
    document.querySelectorAll('.btn-primary').forEach(btn => {
      btn.addEventListener('click', () => triggerBlockBreak(btn));
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.MinecraftExperience = {
    audio: MinecraftAudio,
    selectSlot,
    triggerBlockBreak
  };
})();
