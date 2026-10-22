/**
 * Birthday Storybook - Chapter 3: The OG Opp (Sister) Controller
 * Playful parody wanted poster, sister snapshots, and peel-to-reveal sister confession
 */

const ChapterOgOpp = (() => {
  let ogOppData = null;

  function init() {
    if (window.ContentStore) {
      ogOppData = window.ContentStore.getChapter('og_opp');
    }
    renderChapter();
  }

  function renderChapter() {
    const container = document.getElementById('chapter-3');
    if (!container) return;

    const crimes = ogOppData?.wantedCrimes || [
      "Unauthorized borrowing of hoodies and scrunchies",
      "Eating 75% of the birthday cake frosting without shame",
      "Hosting unprovoked midnight dance concerts in our shared space",
      "Painting masterworks while leaving brushes unwashed for days"
    ];

    const confession = ogOppData?.confession || 
      "Okay fine, I admit it! You might be annoying sometimes, but life would be so dreadfully boring without my favorite opponent. You're the best sister anyone could ask for. Happy birthday Lucky, stay weird! 💖";

    container.innerHTML = `
      <div class="chapter-content-wrapper">
        <div class="washi-tape washi-tape-butter tape-center"></div>

        <div class="chapter-header">
          <span class="diary-ribbon-header">Chapter 3 ✦ Sibling Shenanigans</span>
          <h2 class="h2">${ogOppData?.heading || "The OG Opp 💥"}</h2>
          <p class="chapter-intro-note">${ogOppData?.intro || "Your sister: lifelong roommate, clothes thief, and undisputed rival."}</p>
        </div>

        <div class="siblings-zine-spread">
          <!-- Parody Wanted Poster -->
          <div class="wanted-poster tilt-neg-2">
            <div class="washi-tape washi-tape-pink tape-center" style="width: 75px; height: 22px;"></div>
            
            <div class="case-file-badge">CASE FILE #1016-OPP</div>
            <div class="wanted-title">WANTED!</div>
            <div class="wanted-subtitle">Alias: Kritika / Lucky • Target: Sister's Peace of Mind</div>

            <!-- Sister & Lucky Snapshot -->
            <div class="sister-polaroid-frame">
              <div class="sister-photo-inner">
                <span class="sister-photo-art">👯‍♀️</span>
              </div>
              <div class="sister-photo-label font-handwriting">"Roommates by blood, rivals by choice"</div>
            </div>

            <!-- Crimes Dossier -->
            <div class="crimes-dossier">
              <div class="crimes-heading">
                <span>⚠️</span> SUSPECTED CRIMES & INFRACTIONS:
              </div>
              <ul class="crimes-list">
                ${crimes.map(c => `<li>${c}</li>`).join('')}
              </ul>
            </div>

            <!-- Interactive Peelable Washi Tape Confession -->
            <div class="peelable-tape-wrapper" id="sister-peel-tape" title="Tap to peel tape and read secret message">
              <div class="washi-tape washi-tape-sage tape-center" id="tape-strip" style="width: 82%; height: 26px; top: -12px;"></div>
              <span class="peelable-tape-label" id="peel-prompt">
                Tap tape to peel & read sister confession 🤫
              </span>
              <div class="peelable-secret-text" id="secret-message">
                "${confession}"
                <div class="verdict-stamp">VERDICT: BEST SISTER FOR LIFE 💖</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Advance Button to Chapter 4 (Cousins) -->
        <div class="chapter-advance-row">
          <button class="btn-chapter-advance" id="btn-to-cousins">
            Turn to Cousin Air Mail ✈️ <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    `;

    bindInteractions();
  }

  function bindInteractions() {
    const peelWrapper = document.getElementById('sister-peel-tape');
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
          if (peelPrompt) peelPrompt.textContent = "Sister confession revealed! 🤫💖";
        } else {
          if (tapeStrip) tapeStrip.style.transform = 'translateX(-50%) rotate(-1.5deg)';
          if (peelPrompt) peelPrompt.textContent = "Tap tape to peel & read sister confession 🤫";
        }
      });
    }

    const btnToCousins = document.getElementById('btn-to-cousins');
    if (btnToCousins) {
      btnToCousins.addEventListener('click', () => {
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
  window.ChapterOgOpp = ChapterOgOpp;
}
