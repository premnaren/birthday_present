/**
 * Birthday Storybook - Chapter 2: Parents (Mom & Daddy) Controller
 * Heirloom photo corners, pressed flora decorations, and heartfelt blessings
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

    const entries = parentsData?.entries || [
      {
        from: "Mom",
        relation: "Mother",
        avatar: "👩‍👧",
        caption: "My darling Lucky",
        message: "To my sweetest Kritika, watching you bring so much warmth, kindness, and art into our home is my greatest happiness. May God bless you with the strongest health, vibrant smiles, and peaceful days ahead. Eat well and rest up, my baby!"
      },
      {
        from: "Daddy",
        relation: "Father",
        avatar: "👨‍👧",
        caption: "Daddy's pride and joy",
        message: "My dearest Lucky, you will always be my little girl who danced around the living room and filled the house with joy. Keep dreaming high and painting your life in radiant colors. I am always in your corner. Happy belated birthday beta!"
      }
    ];

    container.innerHTML = `
      <div class="chapter-content-wrapper">
        <div class="washi-tape washi-tape-lavender tape-center"></div>

        <div class="chapter-header">
          <span class="diary-ribbon-header">Chapter 2 ✦ Home & Heart</span>
          <h2 class="h2">${parentsData?.heading || "Mom & Daddy"}</h2>
          <p class="chapter-intro-note">${parentsData?.intro || "Endless love, warmest blessings, and the pillars of your life."}</p>
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

                <div class="parents-card-top">
                  <div class="parents-portrait-badge" style="background: ${entry.placeholderColor || '#FDE8ED'};">
                    <span class="parents-avatar">${entry.avatar || '❤️'}</span>
                  </div>
                  <div class="parents-meta">
                    <span class="family-sender-tag">${entry.from}</span>
                    <span class="family-relation-label">(${entry.relation || "Parent"})</span>
                    <p class="parents-photo-caption">${entry.caption || "Always in our hearts"}</p>
                  </div>
                  <span class="parents-botanical">🌿</span>
                </div>

                <div class="family-message-container">
                  <p class="family-message-text">
                    "${entry.message}"
                  </p>
                </div>

                <div class="parents-signoff-row">
                  <span class="font-caption" style="color: var(--color-ink-muted);">With every blessing</span>
                  <span class="font-handwriting" style="font-size: 1.35rem; color: var(--color-rose-deep);">With endless love ❤️</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Advance Button to Chapter 3 (OG Opp) -->
        <div class="chapter-advance-row">
          <button class="btn-chapter-advance" id="btn-to-og-opp">
            Turn to The OG Opp 💥 <span aria-hidden="true">→</span>
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
