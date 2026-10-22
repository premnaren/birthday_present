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

  // 5. Initialize Let Me Guess (Chapter 1)
  if (window.LetMeGuess) {
    window.LetMeGuess.init();
  }

  // 6. Initialize Friends (Chapter 2)
  if (window.ChapterFriends) {
    window.ChapterFriends.init();
  }

  // 7. Initialize Family (Chapter 3)
  if (window.ChapterFamily) {
    window.ChapterFamily.init();
  }

  // 8. Render Placeholder Shells for remaining chapters
  renderInitialChapterShells(content);
});

/**
 * Populates tactile placeholder layouts into chapter slides to verify stage rendering
 */
function renderInitialChapterShells(content) {
  if (!content) return;

  // Chapter 0 is managed by EntryGate.init()
  // Chapter 1 is managed by LetMeGuess.init()
  // Chapter 2 is managed by ChapterFriends.init()
  // Chapter 3 is managed by ChapterFamily.init()

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
