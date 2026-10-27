/**
 * ══════════════════════════════════════════════════════════════
 * MINECRAFT TACTILE & INTERACTIVE EXPERIENCE MODULE
 * Fully scoped to html[data-theme-style="minecraft"]
 * Zero external audio files — Pure Web Audio API 8-Bit Synthesizer
 * ══════════════════════════════════════════════════════════════
 */

(function () {
  'use strict';

  // ══════════════════════════════════════════════════════════════
  // 1. PURE WEB AUDIO API 8-BIT SYNTHESIZER (MinecraftAudio)
  // ══════════════════════════════════════════════════════════════
  const MinecraftAudio = (function () {
    let audioCtx = null;
    let masterGain = null;
    let isMuted = localStorage.getItem('mc-audio-muted') === 'true';

    function initContext() {
      if (!audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
          audioCtx = new AudioContextClass();
          masterGain = audioCtx.createGain();
          masterGain.gain.setValueAtTime(isMuted ? 0 : 0.22, audioCtx.currentTime);
          masterGain.connect(audioCtx.destination);
        }
      }
      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume().catch(() => {});
      }
    }

    // Helper: Create brief white noise buffer
    function createNoiseBuffer(durationSec) {
      if (!audioCtx) return null;
      const bufferSize = audioCtx.sampleRate * durationSec;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      return buffer;
    }

    return {
      init: initContext,

      isMuted: function () {
        return isMuted;
      },

      setMuted: function (muted) {
        isMuted = !!muted;
        localStorage.setItem('mc-audio-muted', isMuted ? 'true' : 'false');
        if (masterGain && audioCtx) {
          masterGain.gain.setValueAtTime(isMuted ? 0 : 0.22, audioCtx.currentTime);
        }
        return isMuted;
      },

      toggleMute: function () {
        return this.setMuted(!isMuted);
      },

      // Crisp wooden block click / menu tick
      playClick: function () {
        if (isMuted) return;
        initContext();
        if (!audioCtx) return;

        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(280, now);
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.035);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

        osc.connect(gain);
        gain.connect(masterGain);

        osc.start(now);
        osc.stop(now + 0.04);
      },

      // Iconic Minecraft Level-Up Ascending Arpeggio
      playLevelUp: function () {
        if (isMuted) return;
        initContext();
        if (!audioCtx) return;

        const now = audioCtx.currentTime;
        // Notes: C5, E5, G5, C6, E6, G6, C7
        const frequencies = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98, 2093.00];
        const step = 0.055;

        frequencies.forEach((freq, idx) => {
          const t = now + idx * step;
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();

          osc.type = idx === frequencies.length - 1 ? 'square' : 'triangle';
          osc.frequency.setValueAtTime(freq, t);

          gain.gain.setValueAtTime(0.26, t);
          const duration = idx === frequencies.length - 1 ? 0.45 : 0.09;
          gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

          osc.connect(gain);
          gain.connect(masterGain);

          osc.start(t);
          osc.stop(t + duration + 0.01);
        });

        // High shimmer sustained resonance chord
        const chordOsc = audioCtx.createOscillator();
        const chordGain = audioCtx.createGain();
        chordOsc.type = 'sine';
        chordOsc.frequency.setValueAtTime(2093.00, now + frequencies.length * step);

        chordGain.gain.setValueAtTime(0.18, now + frequencies.length * step);
        chordGain.gain.exponentialRampToValueAtTime(0.001, now + frequencies.length * step + 0.5);

        chordOsc.connect(chordGain);
        chordGain.connect(masterGain);
        chordOsc.start(now + frequencies.length * step);
        chordOsc.stop(now + frequencies.length * step + 0.52);
      },

      // XP Orb Pickup Pop / High-Pitched Chirp
      playXpOrb: function () {
        if (isMuted) return;
        initContext();
        if (!audioCtx) return;

        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(950, now);
        osc.frequency.exponentialRampToValueAtTime(1850, now + 0.065);

        gain.gain.setValueAtTime(0.24, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.065);

        osc.connect(gain);
        gain.connect(masterGain);

        osc.start(now);
        osc.stop(now + 0.07);
      },

      // Sword Swing / Sweep Whoosh
      playSwordSwing: function () {
        if (isMuted) return;
        initContext();
        if (!audioCtx) return;

        const now = audioCtx.currentTime;
        const buffer = createNoiseBuffer(0.12);
        if (buffer) {
          const noise = audioCtx.createBufferSource();
          noise.buffer = buffer;

          const filter = audioCtx.createBiquadFilter();
          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(1600, now);
          filter.frequency.exponentialRampToValueAtTime(260, now + 0.12);
          filter.Q.setValueAtTime(2.5, now);

          const noiseGain = audioCtx.createGain();
          noiseGain.gain.setValueAtTime(0.35, now);
          noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

          noise.connect(filter);
          filter.connect(noiseGain);
          noiseGain.connect(masterGain);

          noise.start(now);
          noise.stop(now + 0.13);
        }

        // Low whoosh undertone
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.11);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);

        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now);
        osc.stop(now + 0.12);
      },

      // Block Break / Stone Crunch Pop
      playBlockBreak: function () {
        if (isMuted) return;
        initContext();
        if (!audioCtx) return;

        const now = audioCtx.currentTime;
        const buffer = createNoiseBuffer(0.075);
        if (buffer) {
          const noise = audioCtx.createBufferSource();
          noise.buffer = buffer;

          const filter = audioCtx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(650, now);
          filter.frequency.exponentialRampToValueAtTime(140, now + 0.075);

          const noiseGain = audioCtx.createGain();
          noiseGain.gain.setValueAtTime(0.32, now);
          noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.075);

          noise.connect(filter);
          filter.connect(noiseGain);
          noiseGain.connect(masterGain);

          noise.start(now);
          noise.stop(now + 0.08);
        }

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(45, now + 0.075);

        gain.gain.setValueAtTime(0.22, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.075);

        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now);
        osc.stop(now + 0.08);
      },

      // Ender Pearl Teleport Warp
      playTeleport: function () {
        if (isMuted) return;
        initContext();
        if (!audioCtx) return;

        const now = audioCtx.currentTime;
        const osc1 = audioCtx.createOscillator();
        const osc2 = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc1.type = 'sine';
        osc2.type = 'triangle';
        osc1.frequency.setValueAtTime(820, now);
        osc1.frequency.exponentialRampToValueAtTime(160, now + 0.28);
        osc2.frequency.setValueAtTime(840, now);
        osc2.frequency.exponentialRampToValueAtTime(140, now + 0.28);

        gain.gain.setValueAtTime(0.28, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(masterGain);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.29);
        osc2.stop(now + 0.29);
      },

      // Bow Arrow Twang Release
      playBow: function () {
        if (isMuted) return;
        initContext();
        if (!audioCtx) return;

        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(680, now + 0.04);
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.12);

        gain.gain.setValueAtTime(0.26, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now);
        osc.stop(now + 0.13);
      }
    };
  })();

  // Expose MinecraftAudio to window for modular external triggers
  window.MinecraftAudio = MinecraftAudio;

  // ══════════════════════════════════════════════════════════════
  // 2. HOTBAR ITEMS DEFINITIONS & LORE
  // ══════════════════════════════════════════════════════════════
  const HOTBAR_ITEMS = [
    {
      id: 1,
      name: 'Diamond Sword',
      rarity: 'mc-rarity-cyan',
      icon: '/assets/themes/minecraft/diamond-sword.svg',
      enchanted: true,
      lore: '+7 Attack Damage\nSharpness V · Sweeping Edge III\n[Click / Key 1]: Slash sword!'
    },
    {
      id: 2,
      name: 'Diamond Pickaxe',
      rarity: 'mc-rarity-cyan',
      icon: '/assets/themes/minecraft/pickaxe.svg',
      enchanted: true,
      lore: 'Efficiency V · Fortune III\nBreaks through roadblocks & tech barriers\n[Click / Key 2]: Mine block!'
    },
    {
      id: 3,
      name: 'Redstone Dust',
      rarity: 'mc-rarity-red',
      icon: '/assets/themes/minecraft/redstone.svg',
      enchanted: false,
      lore: 'Power Level 15\nTransmits high-speed engineering logic\n[Click / Key 3]: Pulse redstone!'
    },
    {
      id: 4,
      name: 'Enchanted Golden Apple',
      rarity: 'mc-rarity-gold',
      icon: '/assets/themes/minecraft/golden-apple.svg',
      enchanted: true,
      lore: 'Absorption IV · Regeneration II\nRestores full developer vitality\n[Click / Key 4]: Consume buff!'
    },
    {
      id: 5,
      name: 'Enchanted Book (MGU Specs)',
      rarity: 'mc-rarity-magenta',
      icon: '/assets/themes/minecraft/enchanted-book.svg',
      enchanted: true,
      lore: 'Mending · Fortune III\nCurse of Binding (To Code Quality)\n[Click / Key 5]: Open MGU Architecture Modal!'
    },
    {
      id: 6,
      name: 'Redstone / Daylight Torch',
      rarity: 'mc-rarity-yellow',
      icon: '/assets/themes/minecraft/pixel-torch.svg',
      enchanted: false,
      lore: 'Light Level 14\nStrikes illumination across darkness\n[Click / Key 6]: Strike torch (Toggle Light/Dark)!'
    },
    {
      id: 7,
      name: 'Ender Pearl',
      rarity: 'mc-rarity-cyan',
      icon: '/assets/themes/minecraft/ender-pearl.svg',
      enchanted: false,
      lore: 'Teleportation Artifact\n[Click / Key 7]: Throw pearl & teleport to top!'
    },
    {
      id: 8,
      name: 'Emerald',
      rarity: 'mc-rarity-green',
      icon: '/assets/themes/minecraft/emerald.svg',
      enchanted: false,
      lore: 'Currency of Master Engineers\nVillager Trade: 1 Emerald = Zero Technical Debt\n[Click / Key 8]: Inspect Technical Skills!'
    },
    {
      id: 9,
      name: 'Power V Bow',
      rarity: 'mc-rarity-white',
      icon: '/assets/themes/minecraft/bow.svg',
      enchanted: true,
      lore: 'Power V · Infinity I · Flame\nShoots precision-targeted solutions\n[Click / Key 9]: Draw & shoot bow!'
    }
  ];

  // ══════════════════════════════════════════════════════════════
  // 3. DOM INJECTION & HUD SETUP
  // ══════════════════════════════════════════════════════════════
  let hudContainer = null;
  let xpLevelEl = null;
  let xpFillEl = null;
  let tooltipEl = null;
  let tooltipTitleEl = null;
  let tooltipLoreEl = null;
  let debrisContainer = null;
  let screenFlashEl = null;
  let audioBtn = null;
  let toggleBtn = null;
  let slots = [];
  let activeSlotIndex = 0;
  let tooltipTimeout = null;

  // Track milestones
  let lastLevel = 0;
  let reachedMilestones = { 10: false, 20: false, 30: false };

  function isMinecraftActive() {
    return document.documentElement.getAttribute('data-theme-style') === 'minecraft';
  }

  function createHUD() {
    if (document.getElementById('mc-hud-container')) return;

    // Fullscreen screen flash vignette
    screenFlashEl = document.createElement('div');
    screenFlashEl.className = 'mc-screen-flash';
    document.body.appendChild(screenFlashEl);

    // Particle debris container
    debrisContainer = document.createElement('div');
    debrisContainer.className = 'mc-debris-container';
    document.body.appendChild(debrisContainer);

    // Main HUD Container
    hudContainer = document.createElement('div');
    hudContainer.id = 'mc-hud-container';
    hudContainer.className = 'mc-hud-container';
    hudContainer.setAttribute('role', 'region');
    hudContainer.setAttribute('aria-label', 'Minecraft Interactive HUD');

    // Tooltip
    tooltipEl = document.createElement('div');
    tooltipEl.id = 'mc-tooltip';
    tooltipEl.className = 'mc-tooltip';
    tooltipTitleEl = document.createElement('div');
    tooltipTitleEl.id = 'mc-tooltip-title';
    tooltipTitleEl.className = 'mc-tooltip-title';
    tooltipLoreEl = document.createElement('div');
    tooltipLoreEl.id = 'mc-tooltip-lore';
    tooltipLoreEl.className = 'mc-tooltip-lore';
    tooltipEl.appendChild(tooltipTitleEl);
    tooltipEl.appendChild(tooltipLoreEl);
    hudContainer.appendChild(tooltipEl);

    // XP Row
    const xpRow = document.createElement('div');
    xpRow.className = 'mc-xp-row';

    xpLevelEl = document.createElement('div');
    xpLevelEl.id = 'mc-xp-level';
    xpLevelEl.className = 'mc-xp-level';
    xpLevelEl.textContent = '0';
    xpLevelEl.title = 'Minecraft XP Level (Scroll page to level up!)';

    const xpOuter = document.createElement('div');
    xpOuter.className = 'mc-xp-bar-outer';
    xpOuter.title = 'XP Bar: Fills dynamically with page scroll';
    xpFillEl = document.createElement('div');
    xpFillEl.className = 'mc-xp-bar-inner';
    xpOuter.appendChild(xpFillEl);

    xpRow.appendChild(xpLevelEl);
    xpRow.appendChild(xpOuter);
    hudContainer.appendChild(xpRow);

    // Hotbar Wrap
    const hotbarWrap = document.createElement('div');
    hotbarWrap.className = 'mc-hotbar-wrap';

    const hotbar = document.createElement('div');
    hotbar.className = 'mc-hotbar';
    hotbar.setAttribute('role', 'toolbar');
    hotbar.setAttribute('aria-label', '9-Slot Item Hotbar');

    // Generate 9 slots
    HOTBAR_ITEMS.forEach((item, idx) => {
      const slot = document.createElement('div');
      slot.className = `mc-slot ${idx === 0 ? 'active' : ''} ${item.enchanted ? 'mc-glint' : ''}`;
      slot.dataset.index = idx;
      slot.setAttribute('tabindex', '0');
      slot.setAttribute('role', 'button');
      slot.setAttribute('aria-label', `${item.name} (Key ${item.id})`);

      const num = document.createElement('span');
      num.className = 'mc-slot-num';
      num.textContent = item.id;

      const img = document.createElement('img');
      img.className = 'mc-slot-img';
      img.src = item.icon;
      img.alt = item.name;

      slot.appendChild(num);
      slot.appendChild(img);
      hotbar.appendChild(slot);
      slots.push(slot);

      // Slot Click
      slot.addEventListener('click', (e) => {
        e.stopPropagation();
        selectSlot(idx, true);
        triggerSlotAction(idx);
      });

      // Hover Tooltip
      slot.addEventListener('mouseenter', () => {
        showTooltip(item);
      });
      slot.addEventListener('mouseleave', () => {
        hideTooltip();
      });
    });

    hotbarWrap.appendChild(hotbar);

    // HUD Utility Controls
    const hudControls = document.createElement('div');
    hudControls.className = 'mc-hud-controls';

    audioBtn = document.createElement('button');
    audioBtn.id = 'mc-audio-btn';
    audioBtn.className = 'mc-hud-btn';
    audioBtn.setAttribute('aria-label', 'Toggle 8-Bit Audio');
    audioBtn.title = 'Toggle 8-Bit Sound FX';
    audioBtn.innerHTML = `<span class="mc-btn-icon">${MinecraftAudio.isMuted() ? '🔇' : '🔊'}</span>`;
    audioBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const muted = MinecraftAudio.toggleMute();
      audioBtn.innerHTML = `<span class="mc-btn-icon">${muted ? '🔇' : '🔊'}</span>`;
      if (!muted) MinecraftAudio.playClick();
    });

    toggleBtn = document.createElement('button');
    toggleBtn.id = 'mc-toggle-btn';
    toggleBtn.className = 'mc-hud-btn';
    toggleBtn.setAttribute('aria-label', 'Minimize / Expand Hotbar');
    toggleBtn.title = 'Minimize / Expand Hotbar';
    toggleBtn.innerHTML = `<span class="mc-btn-icon">⛏️</span>`;
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      hudContainer.classList.toggle('collapsed');
      MinecraftAudio.playClick();
    });

    hudControls.appendChild(audioBtn);
    hudControls.appendChild(toggleBtn);
    hotbarWrap.appendChild(hudControls);

    hudContainer.appendChild(hotbarWrap);
    document.body.appendChild(hudContainer);

    // Update XP on load
    updateScrollProgress();
  }

  // ══════════════════════════════════════════════════════════════
  // 4. XP BAR & LEVEL UP MILESTONE LOGIC
  // ══════════════════════════════════════════════════════════════
  function updateScrollProgress() {
    if (!isMinecraftActive()) return;

    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? Math.min(Math.max(scrollTop / docHeight, 0), 1) : 0;

    const targetLevel = Math.min(Math.floor(scrollPercent * 30), 30);
    const progressWidth = (scrollPercent * 100).toFixed(1);

    if (xpFillEl) {
      xpFillEl.style.width = `${progressWidth}%`;
    }

    if (xpLevelEl && targetLevel !== lastLevel) {
      xpLevelEl.textContent = targetLevel;

      // When level increments upward
      if (targetLevel > lastLevel) {
        MinecraftAudio.playXpOrb();

        // Check milestones: Level 10, 20, 30
        [10, 20, 30].forEach((milestone) => {
          if (targetLevel >= milestone && !reachedMilestones[milestone]) {
            reachedMilestones[milestone] = true;
            celebrateLevelUp(milestone);
          }
        });
      } else if (targetLevel < lastLevel) {
        // Reset milestones if scrolling back up past them
        [10, 20, 30].forEach((milestone) => {
          if (targetLevel < milestone) {
            reachedMilestones[milestone] = false;
          }
        });
      }

      lastLevel = targetLevel;
    }
  }

  // Milestone Level Up Celebration
  function celebrateLevelUp(lvl) {
    MinecraftAudio.playLevelUp();

    // Pulse Level Element
    if (xpLevelEl) {
      xpLevelEl.classList.remove('pulse');
      void xpLevelEl.offsetWidth; // trigger reflow
      xpLevelEl.classList.add('pulse');
    }

    // Green screen vignette flash
    if (screenFlashEl) {
      screenFlashEl.className = 'mc-screen-flash flash-green';
      setTimeout(() => {
        if (screenFlashEl) screenFlashEl.className = 'mc-screen-flash';
      }, 500);
    }

    // Spawn 22 pixelated XP orbs
    const rect = xpLevelEl ? xpLevelEl.getBoundingClientRect() : { left: window.innerWidth / 2, top: window.innerHeight - 60 };
    spawnXpOrbs(rect.left + 10, rect.top + 5, 22);
  }

  // Spawn Particle XP Orbs
  function spawnXpOrbs(originX, originY, count) {
    if (!debrisContainer) return;

    const colors = ['#80ff20', '#55ff55', '#bbf73c', '#ffff55', '#ffffff'];

    for (let i = 0; i < count; i++) {
      const orb = document.createElement('div');
      orb.className = 'mc-particle-orb';

      const angle = (Math.PI * 2 * i) / count + (Math.random() * 0.4 - 0.2);
      const distance = 40 + Math.random() * 80;
      const dx = Math.cos(angle) * distance;
      const dy = Math.sin(angle) * distance - (30 + Math.random() * 30); // upward bias

      orb.style.left = `${originX}px`;
      orb.style.top = `${originY}px`;
      orb.style.color = colors[Math.floor(Math.random() * colors.length)];
      orb.style.backgroundColor = orb.style.color;
      orb.style.setProperty('--dx', `${dx.toFixed(1)}px`);
      orb.style.setProperty('--dy', `${dy.toFixed(1)}px`);

      debrisContainer.appendChild(orb);

      setTimeout(() => {
        if (orb.parentNode) orb.parentNode.removeChild(orb);
      }, 900);
    }
  }

  // ══════════════════════════════════════════════════════════════
  // 5. HOTBAR SELECTION, TOOLTIPS & ITEM INTERACTIONS
  // ══════════════════════════════════════════════════════════════
  function selectSlot(index, playSound = true) {
    if (index < 0 || index >= slots.length) return;
    activeSlotIndex = index;

    slots.forEach((s, idx) => {
      s.classList.toggle('active', idx === index);
    });

    const item = HOTBAR_ITEMS[index];
    if (playSound) {
      MinecraftAudio.playClick();
    }
    showTooltip(item, true);
  }

  function showTooltip(item, autoDismiss = false) {
    if (!tooltipEl || !tooltipTitleEl || !tooltipLoreEl) return;

    tooltipTitleEl.className = `mc-tooltip-title ${item.rarity}`;
    tooltipTitleEl.textContent = item.name;
    tooltipLoreEl.textContent = item.lore;

    tooltipEl.classList.add('show');

    clearTimeout(tooltipTimeout);
    if (autoDismiss) {
      tooltipTimeout = setTimeout(() => {
        hideTooltip();
      }, 3400);
    }
  }

  function hideTooltip() {
    if (tooltipEl) {
      tooltipEl.classList.remove('show');
    }
  }

  // Trigger custom interactive actions for each item
  function triggerSlotAction(index) {
    const item = HOTBAR_ITEMS[index];
    if (!item) return;

    switch (item.id) {
      case 1: // Diamond Sword: Slash sweep
        MinecraftAudio.playSwordSwing();
        triggerSwordSlash();
        break;

      case 2: // Diamond Pickaxe: Mine block
        MinecraftAudio.playBlockBreak();
        spawnBlockDebris(window.innerWidth / 2, window.innerHeight - 40, ['#757575', '#866043', '#2cf5d6']);
        break;

      case 3: // Redstone Dust: Redstone sparks
        MinecraftAudio.playClick();
        spawnBlockDebris(window.innerWidth / 2, window.innerHeight - 40, ['#ef4444', '#dc2626', '#f87171', '#b91c1c']);
        break;

      case 4: // Golden Apple: Buff chime & golden sparkles
        MinecraftAudio.playXpOrb();
        spawnBlockDebris(window.innerWidth / 2, window.innerHeight - 40, ['#facc15', '#fef08a', '#d97706', '#ffffff']);
        break;

      case 5: // Enchanted Book: Open MGU project modal
        MinecraftAudio.playLevelUp();
        if (typeof window.openProjectModal === 'function') {
          window.openProjectModal('mgu');
        } else {
          const el = document.getElementById('projects');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
        break;

      case 6: // Torch: Toggle Daylight / Dark mode
        MinecraftAudio.playClick();
        const torch = document.getElementById('torch-btn');
        if (torch) {
          torch.click();
        }
        break;

      case 7: // Ender Pearl: Teleport to top
        MinecraftAudio.playTeleport();
        if (screenFlashEl) {
          screenFlashEl.className = 'mc-screen-flash flash-purple';
          setTimeout(() => {
            if (screenFlashEl) screenFlashEl.className = 'mc-screen-flash';
          }, 500);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
        break;

      case 8: // Emerald: Scroll to technical skills
        MinecraftAudio.playXpOrb();
        const skillsSec = document.getElementById('skills');
        if (skillsSec) {
          skillsSec.scrollIntoView({ behavior: 'smooth' });
        }
        break;

      case 9: // Bow: Arrow shot
        MinecraftAudio.playBow();
        triggerArrowShot();
        break;
    }
  }

  // Sword Slash Effect
  function triggerSwordSlash() {
    const slash = document.createElement('div');
    slash.className = 'mc-slash-fx';
    document.body.appendChild(slash);
    setTimeout(() => {
      if (slash.parentNode) slash.parentNode.removeChild(slash);
    }, 250);
  }

  // Arrow Shot Effect
  function triggerArrowShot() {
    if (!debrisContainer) return;
    const arrow = document.createElement('div');
    arrow.style.position = 'fixed';
    arrow.style.bottom = '80px';
    arrow.style.left = '50%';
    arrow.style.width = '3px';
    arrow.style.height = '24px';
    arrow.style.backgroundColor = '#e2e8f0';
    arrow.style.borderTop = '3px solid #713f12';
    arrow.style.boxShadow = '0 0 6px #ffffff';
    arrow.style.transform = 'translateX(-50%)';
    arrow.style.transition = 'transform 0.4s cubic-bezier(0.1, 0.9, 0.2, 1), opacity 0.4s ease';
    arrow.style.zIndex = '9999';

    debrisContainer.appendChild(arrow);

    requestAnimationFrame(() => {
      arrow.style.transform = 'translateX(-50%) translateY(-75vh)';
      arrow.style.opacity = '0';
    });

    setTimeout(() => {
      if (arrow.parentNode) arrow.parentNode.removeChild(arrow);
    }, 450);
  }

  // ══════════════════════════════════════════════════════════════
  // 6. BLOCK HIT / MINING CRACKS SPRING & DEBRIS
  // ══════════════════════════════════════════════════════════════
  // Crisp SVG data-uri for mining fracture lines
  const CRACK_SVG = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" shape-rendering="crispEdges"><path d="M4 8h4v2h-4zM8 10h4v2H8zM12 12h2v4h-2zM14 16h6v2h-6zM20 14h2v2h-2zM22 12h4v2h-4zM10 18h2v4h-2zM12 22h4v2h-4zM6 24h6v2H6zM18 20h4v2h-4zM22 22h4v2h-4z" fill="%23000000" opacity="0.85"/></svg>';

  function triggerBlockHit(targetEl, clickX, clickY) {
    if (!isMinecraftActive()) return;

    // 1. Play tactile block click / crunch sound
    MinecraftAudio.playClick();

    // 2. Spring Bounce animation on the element
    if (targetEl && targetEl.classList) {
      targetEl.classList.remove('mc-punch');
      void targetEl.offsetWidth; // trigger reflow
      targetEl.classList.add('mc-punch');
    }

    // 3. Ephemeral Micro-Crack Overlay at Click Point
    if (clickX !== undefined && clickY !== undefined) {
      const crack = document.createElement('div');
      crack.className = 'mc-crack-overlay';
      crack.style.left = `${clickX}px`;
      crack.style.top = `${clickY}px`;
      crack.style.backgroundImage = `url('${CRACK_SVG}')`;
      document.body.appendChild(crack);

      setTimeout(() => {
        if (crack.parentNode) crack.parentNode.removeChild(crack);
      }, 230);

      // 4. Spawn 5 small pixel block debris cubes
      spawnBlockDebris(clickX, clickY, ['#3f8e3f', '#866043', '#573d26', '#2cf5d6', '#757575']);
    }
  }

  // Spawn Block Debris
  function spawnBlockDebris(originX, originY, colorPalette) {
    if (!debrisContainer) return;

    const count = 5 + Math.floor(Math.random() * 3);
    for (let i = 0; i < count; i++) {
      const cube = document.createElement('div');
      cube.className = 'mc-particle-debris';

      const angle = Math.random() * Math.PI * 2;
      const speed = 25 + Math.random() * 45;
      const dx = Math.cos(angle) * speed;
      const dy = Math.sin(angle) * speed + (20 + Math.random() * 20); // gravity fall

      cube.style.left = `${originX}px`;
      cube.style.top = `${originY}px`;
      cube.style.backgroundColor = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      cube.style.setProperty('--dx', `${dx.toFixed(1)}px`);
      cube.style.setProperty('--dy', `${dy.toFixed(1)}px`);

      debrisContainer.appendChild(cube);

      setTimeout(() => {
        if (cube.parentNode) cube.parentNode.removeChild(cube);
      }, 480);
    }
  }

  // ══════════════════════════════════════════════════════════════
  // 7. KEYBOARD CONTROLS (1-9 KEYS) & GLOBAL CLICK LISTENER
  // ══════════════════════════════════════════════════════════════
  function handleKeyDown(e) {
    if (!isMinecraftActive()) return;

    // Do not intercept if user is typing in form inputs, terminal, or textareas
    const activeEl = document.activeElement;
    if (activeEl && (
      activeEl.tagName === 'INPUT' ||
      activeEl.tagName === 'TEXTAREA' ||
      activeEl.isContentEditable ||
      activeEl.closest('#terminal')
    )) {
      return;
    }

    const key = parseInt(e.key, 10);
    if (!isNaN(key) && key >= 1 && key <= 9) {
      e.preventDefault();
      const slotIndex = key - 1;
      selectSlot(slotIndex, true);
      triggerSlotAction(slotIndex);
    }
  }

  // Mouse Wheel over Hotbar cycles items
  function handleWheelOnHotbar(e) {
    if (!isMinecraftActive()) return;
    e.preventDefault();
    if (e.deltaY > 0) {
      activeSlotIndex = (activeSlotIndex + 1) % HOTBAR_ITEMS.length;
    } else {
      activeSlotIndex = (activeSlotIndex - 1 + HOTBAR_ITEMS.length) % HOTBAR_ITEMS.length;
    }
    selectSlot(activeSlotIndex, true);
  }

  // Global Click Listener for Minecraft Tactile Block Hit Effect
  function handleGlobalClick(e) {
    if (!isMinecraftActive()) return;

    // Resume AudioContext on first user interaction
    MinecraftAudio.init();

    // Check if target is a button, card, link, pill, or interactive element
    const interactiveTarget = e.target.closest(
      'button, .btn, .project-card, .universe-pill, .tech-pill, .mc-slot, .stat-card, .torch-btn, .theme-reset-btn'
    );

    if (interactiveTarget) {
      triggerBlockHit(interactiveTarget, e.clientX, e.clientY);
    }
  }

  // ══════════════════════════════════════════════════════════════
  // 8. THEME MUTATION OBSERVER & INITIALIZATION
  // ══════════════════════════════════════════════════════════════
  function onThemeChange() {
    if (isMinecraftActive()) {
      createHUD();
      updateScrollProgress();
    } else {
      hideTooltip();
    }
  }

  function initMinecraftExperience() {
    createHUD();

    // Scroll listener for dynamic XP bar fill
    window.addEventListener('scroll', updateScrollProgress, { passive: true });

    // Keyboard 1-9 hotkeys
    window.addEventListener('keydown', handleKeyDown);

    // Global tactile click listener
    document.addEventListener('pointerdown', handleGlobalClick);

    // Mouse wheel over hotbar
    const hotbar = document.getElementById('mc-hotbar');
    if (hotbar) {
      hotbar.addEventListener('wheel', handleWheelOnHotbar, { passive: false });
    }

    // Observe data-theme-style on <html>
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === 'attributes' && m.attributeName === 'data-theme-style') {
          onThemeChange();
        }
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme-style']
    });

    // Run initial check
    onThemeChange();
  }

  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMinecraftExperience);
  } else {
    initMinecraftExperience();
  }
})();
