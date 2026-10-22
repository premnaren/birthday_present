/**
 * Birthday Storybook - Chapter Passport Stamps System
 * Awards tactile rubber passport stamps as Kritika unlocks each chapter
 */

const PassportStamps = (() => {
  const STAMPS = [
    { index: 0, title: "Cover Seal", doodle: "doodle-wax-star" },
    { index: 1, title: "Guesses", doodle: "doodle-sparkle" },
    { index: 2, title: "Parents", doodle: "doodle-heart" },
    { index: 3, title: "The OG Opp", doodle: "doodle-burst" },
    { index: 4, title: "Cousins", doodle: "doodle-plane" },
    { index: 5, title: "Friends", doodle: "doodle-camera" },
    { index: 6, title: "Make a Wish", doodle: "doodle-strawberry" }
  ];

  const STORAGE_KEY = 'storybook_passport_stamps';

  function init() {
    renderBookmarkModal();
  }

  function awardStamp(chapterIndex) {
    let earned = getEarnedStamps();
    if (!earned.includes(chapterIndex)) {
      earned.push(chapterIndex);
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(earned));
      } catch(e){}

      // Play rubber stamp sound
      if (window.AudioEngine) {
        window.AudioEngine.playStickerPop();
      }

      updateModalUI();
    }
  }

  function getEarnedStamps() {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch(e){}
    // By default, cover stamp 0 is earned
    return [0];
  }

  function renderBookmarkModal() {
    if (document.getElementById('stamp-modal-container')) return;

    const modal = document.createElement('div');
    modal.id = 'stamp-modal-container';
    modal.className = 'stamp-collection-modal';

    const earned = getEarnedStamps();

    modal.innerHTML = `
      <div class="stamp-passport-booklet">
        <div class="washi-tape washi-tape-pink tape-corner-tr" style="width: 60px; height: 18px;"></div>
        <h3 class="stamp-booklet-title">Lucky's Storybook Passport ✦</h3>
        <p class="font-caption" style="color: var(--color-ink-muted);">Rubber stamps collected as you turn the pages</p>

        <div class="stamp-booklet-grid" id="passport-grid">
          ${STAMPS.map(s => `
            <div class="passport-page-stamp ${earned.includes(s.index) ? 'stamped' : ''}" id="stamp-slot-${s.index}">
              <svg class="doodle-icon" style="width: 28px; height: 28px; color: ${earned.includes(s.index) ? 'var(--color-rose-deep)' : 'var(--color-ink-muted)'};">
                <use href="#${s.doodle}"/>
              </svg>
              <span class="stamp-label">${s.title}</span>
            </div>
          `).join('')}
        </div>

        <button type="button" id="btn-close-stamps" class="btn-chapter-advance" style="font-size: 1.15rem; padding: 6px 18px; margin-top: 8px;">
          Close Passport ✕
        </button>
      </div>
    `;

    document.body.appendChild(modal);

    const closeBtn = document.getElementById('btn-close-stamps');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
      });
    }

    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });

    // Wire bookmark ribbon click to open passport booklet
    const bookmarkTail = document.getElementById('bookmark-tail');
    if (bookmarkTail) {
      bookmarkTail.addEventListener('click', () => {
        if (window.AudioEngine) window.AudioEngine.playStickerPop();
        updateModalUI();
        modal.classList.add('active');
      });
    }
  }

  function updateModalUI() {
    const earned = getEarnedStamps();
    STAMPS.forEach(s => {
      const slot = document.getElementById(`stamp-slot-${s.index}`);
      if (slot) {
        if (earned.includes(s.index)) {
          slot.classList.add('stamped');
        } else {
          slot.classList.remove('stamped');
        }
      }
    });
  }

  return {
    init,
    awardStamp,
    getEarnedStamps
  };
})();

if (typeof window !== 'undefined') {
  window.PassportStamps = PassportStamps;
}
