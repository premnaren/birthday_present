/**
 * Birthday Storybook - Interactive Sticker Sheet & Draggable Tray
 * Allows Kritika to decorate pages with handcrafted die-cut stickers
 * Includes Decorate Mode to ensure stickers never block reading or clicks
 */

const StickerTray = (() => {
  const STICKER_TYPES = [
    { id: "heart", doodleId: "doodle-heart", name: "Heart" },
    { id: "sparkle", doodleId: "doodle-sparkle", name: "Sparkle" },
    { id: "leaf", doodleId: "doodle-leaf-sprig", name: "Leaf" },
    { id: "cake", doodleId: "doodle-cake-slice", name: "Cake" },
    { id: "tea", doodleId: "doodle-teacup", name: "Chai" },
    { id: "camera", doodleId: "doodle-camera", name: "Camera" },
    { id: "plane", doodleId: "doodle-plane", name: "Plane" },
    { id: "brush", doodleId: "doodle-paintbrush", name: "Brush" }
  ];

  const STORAGE_KEY = 'storybook_placed_stickers';

  const safeStorage = {
    _mem: {},
    get(key) {
      try {
        if (typeof sessionStorage !== 'undefined') return sessionStorage.getItem(key);
      } catch(e){}
      return this._mem[key] || null;
    },
    set(key, val) {
      try {
        if (typeof sessionStorage !== 'undefined') sessionStorage.setItem(key, val);
      } catch(e){}
      this._mem[key] = String(val);
    }
  };

  let isDecorateMode = false;

  function init() {
    renderTray();
    loadPersistedStickers();
  }

  function renderTray() {
    if (document.getElementById('sticker-tray-wrap')) return;

    const wrap = document.createElement('div');
    wrap.id = 'sticker-tray-wrap';
    wrap.className = 'sticker-tray-container';

    wrap.innerHTML = `
      <div class="sticker-tray-sheet" id="sticker-sheet">
        <div class="sticker-tray-header">
          <span class="sticker-tray-title">Sticker Sheet</span>
          <button type="button" id="btn-close-stickers" style="background:none; border:none; font-family:var(--font-handwriting); font-size:1.3rem; font-weight:700; cursor:pointer; color:var(--color-ink-muted);" aria-label="Close Sticker Sheet">✕</button>
        </div>
        <p class="font-caption" style="margin-bottom: 10px; font-size: 1rem; color: var(--color-ink-muted);">Tap to place stickers! (Decorate Mode active)</p>
        <div class="sticker-grid" id="sticker-palette">
          ${STICKER_TYPES.map(s => `
            <button type="button" class="sticker-item" data-id="${s.id}" data-doodle="${s.doodleId}" title="Place ${s.name} sticker" aria-label="Place ${s.name} sticker">
              <svg class="sticker-svg-icon" viewBox="0 0 40 40" aria-hidden="true"><use href="#${s.doodleId}"/></svg>
            </button>
          `).join('')}
        </div>
      </div>

      <button type="button" class="sticker-tray-toggle-btn" id="btn-toggle-stickers" aria-label="Open Sticker Sheet to decorate page">
        <svg class="doodle-icon" style="width:20px;height:20px;" aria-hidden="true"><use href="#doodle-sparkle"/></svg>
        <span>Stickers</span>
      </button>
    `;

    document.body.appendChild(wrap);

    const toggleBtn = document.getElementById('btn-toggle-stickers');
    const closeBtn = document.getElementById('btn-close-stickers');
    const sheet = document.getElementById('sticker-sheet');

    function setDecorateMode(active) {
      isDecorateMode = active;
      document.body.classList.toggle('sticker-decorate-mode', active);
      if (sheet) sheet.classList.toggle('active', active);
    }

    if (toggleBtn && sheet) {
      toggleBtn.addEventListener('click', () => {
        const nextState = !sheet.classList.contains('active');
        setDecorateMode(nextState);
        if (window.AudioEngine) window.AudioEngine.playStickerDrop();
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        setDecorateMode(false);
        if (window.AudioEngine) window.AudioEngine.playPaperRustle();
      });
    }

    // Esc closes sticker sheet
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isDecorateMode) {
        setDecorateMode(false);
      }
    });

    // Attach click events on sticker items
    const paletteItems = wrap.querySelectorAll('.sticker-item');
    paletteItems.forEach(item => {
      item.addEventListener('click', () => {
        const doodleId = item.dataset.doodle;
        placeStickerOnActivePage(doodleId);
      });
    });
  }

  function placeStickerOnActivePage(doodleId, savedData = null) {
    const activeSlide = document.querySelector('.chapter-slide.active-chapter') || document.getElementById('page-viewport');
    if (!activeSlide) return;

    // Tactile SFX for sticker drop (Item 11)
    if (window.AudioEngine && !savedData) {
      window.AudioEngine.playStickerDrop();
    }

    const stickerEl = document.createElement('div');
    stickerEl.className = 'placed-sticker';
    stickerEl.innerHTML = `<svg class="sticker-svg-icon" style="width:42px;height:42px;" viewBox="0 0 40 40" aria-hidden="true"><use href="#${doodleId}"/></svg>`;

    // Position
    const posX = savedData ? savedData.x : (40 + Math.random() * 120);
    const posY = savedData ? savedData.y : (100 + Math.random() * 200);
    const rotation = savedData ? savedData.rotation : (Math.random() * 24 - 12);

    stickerEl.style.left = `${posX}px`;
    stickerEl.style.top = `${posY}px`;
    stickerEl.style.transform = `rotate(${rotation}deg)`;

    activeSlide.appendChild(stickerEl);

    // Make Draggable with GSAP when decorate mode is on
    if (typeof Draggable !== 'undefined') {
      Draggable.create(stickerEl, {
        bounds: activeSlide,
        edgeResistance: 0.65,
        type: 'x,y',
        onDragStart: function() {
          stickerEl.style.zIndex = 30;
        },
        onDragEnd: function() {
          stickerEl.style.zIndex = 4;
          saveStickers();
        }
      });
    }

    if (!savedData) {
      saveStickers();
    }
  }

  function saveStickers() {
    const stickers = document.querySelectorAll('.placed-sticker');
    const data = [];
    stickers.forEach(s => {
      const useEl = s.querySelector('use');
      const doodleId = useEl ? useEl.getAttribute('href').replace('#', '') : 'doodle-heart';
      data.push({
        doodleId,
        x: parseInt(s.style.left, 10) || 50,
        y: parseInt(s.style.top, 10) || 100,
        rotation: 0
      });
    });
    safeStorage.set(STORAGE_KEY, JSON.stringify(data));
  }

  function loadPersistedStickers() {
    const saved = safeStorage.get(STORAGE_KEY);
    if (saved) {
      try {
        const list = JSON.parse(saved);
        list.forEach(item => {
          placeStickerOnActivePage(item.doodleId, item);
        });
      } catch(e) {}
    }
  }

  return {
    init,
    placeStickerOnActivePage
  };
})();

if (typeof window !== 'undefined') {
  window.StickerTray = StickerTray;
}
