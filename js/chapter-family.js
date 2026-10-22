/**
 * Birthday Storybook - Chapter 3: Family Vintage Album Controller
 * Heirloom photo corners, pressed flora decorations, and heartfelt family letters
 */

const ChapterFamily = (() => {
  let familyData = null;

  function init() {
    if (window.ContentStore) {
      familyData = window.ContentStore.getChapter('family');
    }
    renderChapter();
  }

  function renderChapter() {
    const container = document.getElementById('chapter-3');
    if (!container || !familyData) return;

    const entries = familyData.entries || [];

    container.innerHTML = `
      <div class="chapter-content-wrapper">
        <div class="washi-tape washi-tape-lavender tape-center"></div>

        <div class="chapter-header">
          <span class="diary-ribbon-header">Chapter 3 ✦ Home & Heart</span>
          <h2 class="h2">${familyData.heading || "Family Album"}</h2>
          <p class="chapter-intro-note">${familyData.intro || "Treasured memories and blessings from home."}</p>
        </div>

        <div class="family-album-spread">
          ${entries.map((entry, idx) => `
            <div class="family-entry-card ${idx % 2 === 0 ? 'tilt-neg-1' : 'tilt-pos-1'}">
              <div class="photo-frame-vintage">
                <!-- Antique Photo Corners -->
                <div class="photo-corner corner corner-tl"></div>
                <div class="photo-corner corner corner-tr"></div>
                <div class="photo-corner corner corner-bl"></div>
                <div class="photo-corner corner corner-br"></div>

                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                  <div>
                    <span class="family-sender-tag">${entry.from}</span>
                    <span class="family-relation-label">(${entry.relation || "Family"})</span>
                  </div>
                  <span style="font-size: 1.4rem;">🌿</span>
                </div>

                <p class="family-message-text">
                  "${entry.message}"
                </p>

                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 12px; border-top: 1px dashed rgba(74, 59, 63, 0.15); padding-top: 8px;">
                  <span class="font-caption" style="color: var(--color-ink-muted);">${entry.caption || "Always in our hearts"}</span>
                  <span class="font-handwriting" style="font-size: 1.3rem; color: var(--color-rose-deep);">With endless love ❤️</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Advance Button -->
        <div class="chapter-advance-row">
          <button class="btn-chapter-advance" id="btn-to-siblings">
            Turn to Sibling Shenanigans <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    `;

    bindInteractions();
  }

  function bindInteractions() {
    const btnToSiblings = document.getElementById('btn-to-siblings');
    if (btnToSiblings) {
      btnToSiblings.addEventListener('click', () => {
        if (window.BookStage) {
          window.BookStage.unlockChapter(4);
          window.BookStage.goToChapter(4, 'forward');
        }
      });
    }
  }

  return {
    init
  };
})();

if (typeof window !== 'undefined') {
  window.ChapterFamily = ChapterFamily;
}
