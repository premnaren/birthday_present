/**
 * Birthday Storybook - Chapter 4: Siblings Banter Zine Controller
 * Parody wanted poster, playful sticker badges, and peel-to-reveal sibling confession
 */

const ChapterSiblings = (() => {
  let siblingsData = null;

  function init() {
    if (window.ContentStore) {
      siblingsData = window.ContentStore.getChapter('siblings');
    }
    renderChapter();
  }

  function renderChapter() {
    const container = document.getElementById('chapter-4');
    if (!container) return;

    container.innerHTML = `
      <div class="chapter-content-wrapper">
        <div class="washi-tape washi-tape-butter tape-center"></div>

        <div class="chapter-header">
          <span class="diary-ribbon-header">Chapter 4 ✦ Sibling Shenanigans</span>
          <h2 class="h2">${siblingsData?.heading || "Sibling Banter Zine"}</h2>
          <p class="chapter-intro-note">${siblingsData?.intro || "Things only siblings understand (and argue about)."}</p>
        </div>

        <div class="siblings-zine-spread">
          <!-- Parody Wanted Poster -->
          <div class="wanted-poster tilt-neg-2">
            <div class="washi-tape washi-tape-pink tape-center" style="width: 70px; height: 20px;"></div>
            <div class="wanted-title">WANTED!</div>
            <div class="wanted-subtitle">Alias: Kritika / Lucky</div>

            <div class="wanted-sketch">
              <span>👑🎨</span>
            </div>

            <div style="font-family: 'Courier Prime', monospace; font-size: 0.95rem; text-align: left; background: var(--color-paper-warm); padding: 10px; border-radius: 4px; margin-bottom: 12px;">
              <strong>SUSPECTED CRIMES:</strong>
              <ul style="padding-left: 18px; margin-top: 4px; line-height: 1.4;">
                <li>Stealing birthday cake frosting without remorse</li>
                <li>Doing solo dance routines in the hallway</li>
                <li>Leaving watercolor brushes in drinking cups</li>
              </ul>
            </div>

            <!-- Interactive Peelable Washi Tape Confession -->
            <div class="peelable-tape-wrapper" id="sibling-peel-tape" title="Tap to peel tape and reveal secret message">
              <div class="washi-tape washi-tape-sage tape-center" id="tape-strip" style="width: 80%; height: 24px; top: -10px;"></div>
              <span class="peelable-tape-label" id="peel-prompt">
                Tap tape to peel & read sibling confession 🤫
              </span>
              <div class="peelable-secret-text" id="secret-message">
                "Okay fine, I admit it! I took a giant bite of your birthday cake while you were resting. But you're still the greatest partner in crime. Happy birthday Lucky!"
              </div>
            </div>
          </div>
        </div>

        <!-- Advance Button -->
        <div class="chapter-advance-row">
          <button class="btn-chapter-advance" id="btn-to-cousins">
            Turn to The Cousin Postcards <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    `;

    bindInteractions();
  }

  function bindInteractions() {
    const peelWrapper = document.getElementById('sibling-peel-tape');
    const tapeStrip = document.getElementById('tape-strip');
    const peelPrompt = document.getElementById('peel-prompt');

    if (peelWrapper) {
      peelWrapper.addEventListener('click', () => {
        if (window.AudioEngine) {
          window.AudioEngine.playPaperRustle();
        }

        peelWrapper.classList.toggle('peeled');

        if (peelWrapper.classList.contains('peeled')) {
          if (tapeStrip) tapeStrip.style.transform = 'translateX(-50%) rotate(18deg) scaleY(0.7)';
          if (peelPrompt) peelPrompt.textContent = "Sibling confession revealed! 😂";
        } else {
          if (tapeStrip) tapeStrip.style.transform = 'translateX(-50%) rotate(-1.5deg)';
          if (peelPrompt) peelPrompt.textContent = "Tap tape to peel & read sibling confession 🤫";
        }
      });
    }

    const btnToCousins = document.getElementById('btn-to-cousins');
    if (btnToCousins) {
      btnToCousins.addEventListener('click', () => {
        if (window.BookStage) {
          window.BookStage.unlockChapter(5);
          window.BookStage.goToChapter(5, 'forward');
        }
      });
    }
  }

  return {
    init
  };
})();

if (typeof window !== 'undefined') {
  window.ChapterSiblings = ChapterSiblings;
}
