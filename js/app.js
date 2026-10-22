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

  // 8. Initialize Siblings (Chapter 4)
  if (window.ChapterSiblings) {
    window.ChapterSiblings.init();
  }

  // 9. Initialize Cousins (Chapter 5)
  if (window.ChapterCousins) {
    window.ChapterCousins.init();
  }

  // 10. Initialize Finale (Chapter 6)
  if (window.ChapterFinale) {
    window.ChapterFinale.init();
  }
});
