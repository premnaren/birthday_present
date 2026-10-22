/**
 * Birthday Storybook - Main Bootstrap
 * Connects ContentStore, AudioEngine, and BookStage
 */

document.addEventListener('DOMContentLoaded', async () => {
  console.log("🌸 Initializing Birthday Storybook for Kritika ('Lucky')...");

  // 1. Initialize Audio Engine & UI Binding
  const audioBtn = document.getElementById('audio-toggle-btn');
  const audioLabel = document.getElementById('audio-status-text');

  if (audioBtn && window.AudioEngine) {
    audioBtn.addEventListener('click', () => {
      const isPlaying = window.AudioEngine.toggleAudio();
      if (audioLabel) {
        audioLabel.textContent = isPlaying ? "Sound: Playing 🎵" : "Sound: Off";
      }
    });
  }

  // 2. Load Content Store
  let content = null;
  if (window.ContentStore) {
    content = await window.ContentStore.loadContent();
    console.log("📖 Content loaded successfully for:", content.recipient.displayName);
  }

  // 3. Initialize Book Stage
  if (window.BookStage) {
    window.BookStage.init();

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('preview') === 'all') {
      window.BookStage.unlockChapter(6);
    }
  }

  // 4. Initialize Entry Gate (Chapter 0)
  if (window.EntryGate) {
    window.EntryGate.init();
  }

  // 5. Render Placeholder Shells for remaining chapters
  renderInitialChapterShells(content);
});

/**
 * Populates tactile placeholder layouts into chapter slides to verify stage rendering
 */
function renderInitialChapterShells(content) {
  if (!content) return;

  // Chapter 0 is managed by EntryGate.init()

  // Chapter 1: Let Me Guess preview
  const ch1 = document.getElementById('chapter-1');
  if (ch1) {
    ch1.innerHTML = `
      <div style="max-width: 480px; margin: 0 auto;">
        <div class="washi-tape washi-tape-butter tape-center"></div>
        <h2 class="h2" style="text-align: center; margin-top: 15px;">Let Me Guess, Kritika...</h2>
        <p class="font-caption" style="text-align: center; color: var(--color-ink-muted); margin-bottom: 20px;">
          (Interactive guessing cards in Phase 2)
        </p>
        <div class="sticky-note sticky-note-pink tilt-pos-2" style="margin-bottom: 16px;">
          <p class="font-caption">🍰 "You've mentally scheduled at least 3 cake tastings this week."</p>
        </div>
        <div class="sticky-note sticky-note-sage tilt-neg-2">
          <p class="font-caption">🎨 "Your sketchbook has random fresh paint streaks."</p>
        </div>
      </div>
    `;
  }

  // Chapter 2: Friends Corkboard preview
  const ch2 = document.getElementById('chapter-2');
  if (ch2) {
    ch2.innerHTML = `
      <div style="max-width: 500px; margin: 0 auto; text-align: center;">
        <h2 class="h2">The Friends Corkboard</h2>
        <p class="font-caption" style="color: var(--color-ink-muted); margin-bottom: 18px;">
          Polaroids pinned with love from Ananya, Rohan, Meera & more
        </p>
        <div style="display: flex; gap: 14px; justify-content: center; flex-wrap: wrap;">
          <div class="polaroid-frame tilt-neg-3" style="width: 150px;">
            <div class="washi-tape washi-tape-lavender tape-center" style="width: 60px; height: 18px;"></div>
            <div class="polaroid-img-wrap" style="display: flex; align-items: center; justify-content: center; font-size: 2rem;">
              📸
            </div>
            <div class="polaroid-caption">Besties</div>
          </div>
          <div class="polaroid-frame tilt-pos-4" style="width: 150px;">
            <div class="washi-tape washi-tape-pink tape-center" style="width: 60px; height: 18px;"></div>
            <div class="polaroid-img-wrap" style="display: flex; align-items: center; justify-content: center; font-size: 2rem;">
              🎨
            </div>
            <div class="polaroid-caption">Art Buddy</div>
          </div>
        </div>
      </div>
    `;
  }

  // Chapter 6: Finale Cake preview
  const ch6 = document.getElementById('chapter-6');
  if (ch6) {
    ch6.innerHTML = `
      <div style="max-width: 440px; margin: 0 auto; text-align: center;">
        <h2 class="h2">Make a Wish, Lucky! 🎂</h2>
        <p class="font-caption" style="color: var(--color-ink-muted); margin-bottom: 24px;">
          Light and blow out your birthday candles
        </p>
        <div class="torn-card tilt-pos-1">
          <div style="font-size: 3.5rem; margin: 10px 0;">🎂🕯️🕯️🕯️</div>
          <p class="font-handwriting" style="font-size: 1.4rem; color: var(--color-rose-deep);">
            "Birthdays don't expire, and neither does love."
          </p>
        </div>
      </div>
    `;
  }
}
