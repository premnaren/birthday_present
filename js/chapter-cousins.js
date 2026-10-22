/**
 * Birthday Storybook - Chapter 5: Cousins Summer Postcards Controller
 * Vintage airmail styling, postal cancellation marks, and interactive unfolding envelope
 */

const ChapterCousins = (() => {
  let cousinsData = null;

  function init() {
    if (window.ContentStore) {
      cousinsData = window.ContentStore.getChapter('cousins');
    }
    renderChapter();
  }

  function renderChapter() {
    const container = document.getElementById('chapter-5');
    if (!container) return;

    const entry = (cousinsData?.entries && cousinsData.entries[0]) || {
      from: "The Cousin Crew",
      caption: "Next reunion loading...",
      message: "Dear Lucky, holidays are never quite as energetic without your dance routines and laughs. Rest up and get well soon!"
    };

    container.innerHTML = `
      <div class="chapter-content-wrapper">
        <div class="washi-tape washi-tape-pink tape-center"></div>

        <div class="chapter-header">
          <span class="diary-ribbon-header">Chapter 5 ✦ Airmail from the Tribe</span>
          <h2 class="h2">${cousinsData?.heading || "Cousin Postcards"}</h2>
          <p class="chapter-intro-note">${cousinsData?.intro || "Summer letters from across the miles."}</p>
        </div>

        <div class="cousins-postcard-spread">
          <div class="postcard-card airmail-border tilt-pos-1" id="postcard-main">
            
            <div class="postcard-header">
              <div>
                <span class="font-heading" style="font-size: 1.1rem; color: var(--color-ink-light);">AIR MAIL / PAR AVION</span>
                <p class="font-caption" style="color: var(--color-ink-muted);">Special Delivery for Oct 16th</p>
              </div>

              <!-- Stamp & Postmark -->
              <div style="position: relative;">
                <div class="postal-mark">OCT<br>16</div>
                <div class="postage-stamp">
                  <span>🏖️</span>
                </div>
              </div>
            </div>

            <!-- Recipient Line -->
            <div style="background: rgba(251, 243, 228, 0.7); padding: 8px 12px; border-radius: 4px; border-left: 3px solid var(--color-rose); margin-bottom: 12px;">
              <span class="font-typewriter" style="font-size: 0.85rem; color: var(--color-ink-muted);">TO:</span>
              <p class="font-handwriting" style="font-size: 1.35rem; color: var(--color-ink);">Kritika ("Lucky"), The Cousin Crew VIP</p>
            </div>

            <!-- Letter Body -->
            <div class="postcard-letter-body" id="postcard-letter">
              "${entry.message}"
            </div>

            <div style="margin-top: 18px; text-align: right; border-top: 1px dashed rgba(74, 59, 63, 0.15); padding-top: 8px;">
              <span class="font-handwriting" style="font-size: 1.4rem; color: var(--color-rose-deep);">- Love always, ${entry.from} 💌</span>
            </div>
          </div>
        </div>

        <!-- Advance to Grand Finale -->
        <div class="chapter-advance-row">
          <button class="btn-chapter-advance" id="btn-to-finale" style="background: linear-gradient(135deg, #C8483F, #D98A9B);">
            Head to the Finale: Make a Wish! 🎂 <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    `;

    bindInteractions();
  }

  function bindInteractions() {
    const postcard = document.getElementById('postcard-main');
    if (postcard) {
      postcard.addEventListener('click', () => {
        if (window.AudioEngine) {
          window.AudioEngine.playPaperRustle();
        }
        postcard.classList.toggle('tilt-pos-1');
        postcard.classList.toggle('tilt-neg-1');
      });
    }

    const btnToFinale = document.getElementById('btn-to-finale');
    if (btnToFinale) {
      btnToFinale.addEventListener('click', () => {
        if (window.BookStage) {
          window.BookStage.unlockChapter(6);
          window.BookStage.goToChapter(6, 'forward');
        }
      });
    }
  }

  return {
    init
  };
})();

if (typeof window !== 'undefined') {
  window.ChapterCousins = ChapterCousins;
}
