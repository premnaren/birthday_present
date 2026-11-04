/**
 * Birthday Storybook - Chapter 2: Parents (Mom & Daddy) Controller
 * Heirloom photo album spread, corner mounts, pressed botanicals, and heartfelt letters
 */

const ChapterParents = (() => {
  let parentsData = null;

  function init() {
    if (window.ContentStore) {
      parentsData = window.ContentStore.getChapter('parents');
    }
    renderChapter();
  }

  function renderChapter() {
    const container = document.getElementById('chapter-2');
    if (!container) return;

    const entries = parentsData?.entries || [];
    const momEntry = entries.find(e => e.id === 'mom') || entries[0] || {
      from: "Mom",
      caption: "My darling Lucky",
      message: "To my sweetest Kritika, watching you bring so much warmth, kindness, and art into our home is my greatest happiness. May God bless you with the strongest health, vibrant smiles, and peaceful days ahead. Eat well and rest up, my baby!"
    };

    const daddyEntry = entries.find(e => e.id === 'daddy') || entries[1] || {
      from: "Daddy",
      caption: "Daddy's pride and joy",
      message: "My dearest Lucky, you will always be my little girl who danced around the living room and filled the house with joy. Keep dreaming high and painting your life in radiant colors. I am always in your corner. Happy belated birthday beta!"
    };

    container.innerHTML = `
      <div class="chapter-content-wrapper">
        <div class="washi-tape washi-tape-lavender tape-corner-tr" style="width: 75px; height: 22px;"></div>

        <!-- Imperfection: Pressed botanical sprig watermark away from text (Item 5) -->
        <div class="pressed-flower-mark" aria-hidden="true"></div>

        <div class="chapter-header">
          <span class="diary-ribbon-header">Chapter 2 • Home & Heart</span>
          <h2 class="h2" style="margin-top: 6px;">Mom & Daddy</h2>
          <p class="chapter-intro-note font-caption" style="color: var(--color-ink-muted);">Endless love, warmest blessings, and the pillars of your life.</p>
        </div>

        <!-- Unified Heirloom Album Page Spread -->
        <div class="parents-album-page">
          <!-- Heirloom Family Portrait Mounting Box -->
          <div class="parents-heirloom-frame">
            <div class="photo-corner corner corner-tl"></div>
            <div class="photo-corner corner corner-tr"></div>
            <div class="photo-corner corner corner-bl"></div>
            <div class="photo-corner corner corner-br"></div>

            <div class="heirloom-portraits-row">
              <!-- Mom's Portrait Badge -->
              <div class="parent-portrait-unit">
                <div class="parent-portrait-circle" style="background: #FDE8ED;">
                  <svg class="doodle-portrait"><use href="#doodle-portrait-mom"/></svg>
                </div>
                <span class="parent-portrait-name">Mom</span>
                <span class="font-caption" style="font-size: 0.8rem;">Mother</span>
              </div>

              <!-- Center Pressed Botanical Sprig -->
              <div class="heirloom-center-decor">
                <svg class="doodle-icon" style="width: 32px; height: 32px; color: var(--color-sage);"><use href="#doodle-leaf-sprig"/></svg>
                <span class="font-handwriting" style="font-size: 1.15rem; color: var(--color-rose-deep);">Family Heritage</span>
              </div>

              <!-- Daddy's Portrait Badge -->
              <div class="parent-portrait-unit">
                <div class="parent-portrait-circle" style="background: #E8F0FE;">
                  <svg class="doodle-portrait"><use href="#doodle-portrait-daddy"/></svg>
                </div>
                <span class="parent-portrait-name">Daddy</span>
                <span class="font-caption" style="font-size: 0.8rem;">Father</span>
              </div>
            </div>
          </div>

          <!-- Staggered Handwritten Letter Sheets -->
          <div class="parents-letters-spread">
            <!-- Mom's Letter Sheet -->
            <div class="parent-letter-sheet tilt-neg-1" style="background: #FFF9FA; border-left: 3px solid var(--color-rose);">
              <div class="washi-tape washi-tape-pink tape-corner-tl" style="width: 50px; height: 16px;"></div>
              <div class="letter-sheet-header">
                <span class="family-sender-tag">From Mom</span>
                <span class="font-caption" style="color: var(--color-ink-muted);">${momEntry.caption || "My darling Lucky"}</span>
              </div>
              <p class="family-message-text">
                "${momEntry.message}"
              </p>
              <div class="letter-sheet-signoff">
                <span class="font-handwriting" style="font-size: 1.3rem; color: var(--color-rose-deep);">
                  With endless love <svg class="doodle-heart-inline"><use href="#doodle-heart"/></svg>
                </span>
              </div>
            </div>

            <!-- Daddy's Letter Sheet -->
            <div class="parent-letter-sheet tilt-pos-1" style="background: #FAF8F5; border-left: 3px solid #7EA4D9; margin-top: 14px;">
              <div class="washi-tape washi-tape-butter tape-corner-tr" style="width: 50px; height: 16px;"></div>
              <div class="letter-sheet-header">
                <span class="family-sender-tag" style="color: #4A6B9C;">From Daddy</span>
                <span class="font-caption" style="color: var(--color-ink-muted);">${daddyEntry.caption || "Daddy's pride and joy"}</span>
              </div>
              <p class="family-message-text">
                "${daddyEntry.message}"
              </p>
              <div class="letter-sheet-signoff">
                <span class="font-handwriting" style="font-size: 1.3rem; color: #4A6B9C;">
                  Always in your corner <svg class="doodle-heart-inline"><use href="#doodle-heart"/></svg>
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Advance Button to Chapter 3 (OG Opp) -->
        <div class="chapter-advance-row">
          <button class="btn-chapter-advance" id="btn-to-og-opp">
            Turn to The OG Opp <svg class="doodle-arrow"><use href="#doodle-arrow-sketch"/></svg>
          </button>
        </div>
      </div>
    `;

    bindInteractions();
  }

  function bindInteractions() {
    const btnToOgOpp = document.getElementById('btn-to-og-opp');
    if (btnToOgOpp) {
      btnToOgOpp.addEventListener('click', () => {
        if (window.BookStage) {
          window.BookStage.unlockChapter(3);
          window.BookStage.goToChapter(3, 'forward');
        }
      });
    }
  }

  return {
    init
  };
})();

if (typeof window !== 'undefined') {
  window.ChapterParents = ChapterParents;
}
