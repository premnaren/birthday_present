/**
 * Birthday Storybook - Interactive Sticker Sheet & Draggable Tray
 * Allows Kritika to decorate pages with handcrafted die-cut stickers
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
  let placedStickers = [];

  function init() {
    renderTray();
    loadPersistedStickers();
  }

  function renderTray() {
    // Check if container already exists
    if (document.getElementById('sticker-tray-wrap')) return;

    const wrap = document.createElement('div');
    wrap.id = 'sticker-tray-wrap';
    wrap.className = 'sticker-tray-container';

    wrap.innerHTML = `
      <div class="sticker-tray-sheet" id="sticker-sheet">
        <div class="sticker-tray-header">
          <span class="sticker-tray-title">Sticker Sheet ✦</span>
          <button type="button" id="btn-close-stickers" style="background:none; border:none; font-family:'Gaegu',cursive; font-size:1.1rem; cursor:pointer; color:var(--color-ink-muted);">✕</button>
        </div>
        <p class="font-caption" style="margin-bottom: 10px; font-size: 0.85rem;">Tap any sticker to place on page!</p>
        <div class="sticker-grid" id="sticker-palette">
          ${STICKER_TYPES.map(s => `
            <button type="button" class="sticker-item" data-id="${s.id}" data-doodle="${s.doodleId}" title="Place ${s.name} sticker">
              <svg class="sticker-svg-icon" viewBox="0 0 40 40"><use href="#${s.doodleId}"/></svg>
            </button>
          `).join('')}
        </div>
      </div>

      <button type="button" class="sticker-tray-toggle-btn" id="btn-toggle-stickers" aria-label="Open Sticker Sheet to decorate page">
        <svg class="doodle-icon" style="width:20px;height:20px;"><use href="#doodle-sparkle"/></svg>
        <span>Stickers</span>
      </button>
    `;

    document.body.appendChild(wrap);

    const toggleBtn = document.getElementById('btn-toggle-stickers');
    const closeBtn = document.getElementById('btn-close-stickers');
    const sheet = document.getElementById('sticker-sheet');

    if (toggleBtn && sheet) {
      toggleBtn.addEventListener('click', () => {
        sheet.classList.toggle('active');
        if (window.AudioEngine) window.AudioEngine.playStickerPop();
      });
    }

    if (closeBtn && sheet) {
      closeBtn.addEventListener('click', () => {
        sheet.classList.remove('active');
      });
    }

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

    if (window.AudioEngine && !savedData) {
      window.AudioEngine.playStickerPop();
    }

    const stickerEl = document.createElement('div');
    stickerEl.className = 'placed-sticker';
    stickerEl.innerHTML = `<svg class="sticker-svg-icon" style="width:42px;height:42px;" viewBox="0 0 40 40"><use href="#${doodleId}"/></svg>`;

    // Position
    const posX = savedData ? savedData.x : (40 + Math.random() * 120);
    const posY = savedData ? savedData.y : (100 + Math.random() * 200);
    const rotation = savedData ? savedData.rotation : (Math.random() * 24 - 12);

    stickerEl.style.left = `${posX}px`;
    stickerEl.style.top = `${posY}px`;
    stickerEl.style.transform = `rotate(${rotation}deg)`;

    activeSlide.appendChild(stickerEl);

    // Make Draggable with GSAP
    if (typeof Draggable !== 'undefined') {
      Draggable.create(stickerEl, {
        bounds: activeSlide,
        edgeResistance: 0.65,
        type: 'x,y',
        onDragStart: function() {
          stickerEl.style.zIndex = 100;
        },
        onDragEnd: function() {
          stickerEl.style.zIndex = 15;
          saveStickers();
        }
      });
    }

    if (!savedData) {
      saveStickers();
    }
  }

  function saveStickers() {
    try {
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
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch(e) {}
  }

  function loadPersistedStickers() {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const list = JSON.parse(saved);
        list.forEach(item => {
          placeStickerOnActivePage(item.doodleId, item);
        });
      }
    } catch(e) {}
  }

  return {
    init,
    placeStickerOnActivePage
  };
})();

if (typeof window !== 'undefined') {
  window.StickerTray = StickerTray;
}
