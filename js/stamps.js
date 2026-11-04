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

  const safeStorage = {
    _mem: {},
    get(key) {
      try {
        if (typeof sessionStorage !== 'undefined') {
          return sessionStorage.getItem(key);
        }
      } catch(e){}
      return this._mem[key] || null;
    },
    set(key, val) {
      try {
        if (typeof sessionStorage !== 'undefined') {
          sessionStorage.setItem(key, val);
        }
      } catch(e){}
      this._mem[key] = String(val);
    }
  };

  function init() {
    renderBookmarkModal();
  }

  function awardStamp(chapterIndex) {
    let earned = getEarnedStamps();
    if (!earned.includes(chapterIndex)) {
      earned.push(chapterIndex);
      safeStorage.set(STORAGE_KEY, JSON.stringify(earned));

      // Play rubber stamp impact thud (Item 11)
      if (window.AudioEngine) {
        window.AudioEngine.playStampThud();
      }

      updateModalUI();
    }
  }

  function getEarnedStamps() {
    const saved = safeStorage.get(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch(e){}
    }
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
        <h3 class="stamp-booklet-title">Lucky's Storybook Passport</h3>
        <p class="font-caption" style="color: var(--color-ink-muted);">Rubber stamps collected as you turn the pages</p>

        <div class="stamp-booklet-grid" id="passport-grid">
          ${STAMPS.map(s => {
            const isEarned = earned.includes(s.index);
            return `
            <div class="passport-page-stamp ${isEarned ? 'stamped' : 'locked-stamp'}" id="stamp-slot-${s.index}">
              <svg class="doodle-icon" style="width: 28px; height: 28px; color: ${isEarned ? 'var(--color-rose-deep)' : 'var(--color-ink-muted)'};" aria-hidden="true">
                <use href="#${isEarned ? s.doodle : 'doodle-wax-star'}"/>
              </svg>
              <span class="stamp-label">${isEarned ? s.title : 'Chapter ' + s.index}</span>
            </div>
            `;
          }).join('')}
        </div>

        <button type="button" id="btn-close-stamps" class="btn-chapter-advance" style="font-size: 1.15rem; padding: 6px 18px; margin-top: 8px;" aria-label="Close passport booklet">
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
        if (window.AudioEngine) window.AudioEngine.playStickerDrop();
        updateModalUI();
        modal.classList.add('active');
      });
    }

    // Global Esc key closes passport modal (Item 14)
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        modal.classList.remove('active');
      }
    });
  }

  function updateModalUI() {
    const earned = getEarnedStamps();
    STAMPS.forEach(s => {
      const slot = document.getElementById(`stamp-slot-${s.index}`);
      if (slot) {
        const isEarned = earned.includes(s.index);
        if (isEarned) {
          slot.classList.add('stamped');
          slot.classList.remove('locked-stamp');
          const label = slot.querySelector('.stamp-label');
          if (label) label.textContent = s.title;
          const icon = slot.querySelector('.doodle-icon use');
          if (icon) icon.setAttribute('href', `#${s.doodle}`);
        } else {
          slot.classList.remove('stamped');
          slot.classList.add('locked-stamp');
          const label = slot.querySelector('.stamp-label');
          if (label) label.textContent = 'Chapter ' + s.index;
          const icon = slot.querySelector('.doodle-icon use');
          if (icon) icon.setAttribute('href', '#doodle-wax-star');
        }
      }
    });
  }

  return {
    init,
    awardStamp,
    openPassport: () => {
      const modal = document.getElementById('stamp-modal-container');
      if (modal) {
        updateModalUI();
        modal.classList.add('active');
      }
    }
  };
})();

if (typeof window !== 'undefined') {
  window.PassportStamps = PassportStamps;
}
