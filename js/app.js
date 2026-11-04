/**
 * Birthday Storybook - Main Bootstrap
 * Connects ContentStore, AudioEngine, BookStage, HeroPortal, PassportStamps, StickerTray, and Chapters
 */

document.addEventListener('DOMContentLoaded', async () => {
  console.log("🌸 Initializing Handcrafted Birthday Storybook for Kritika ('Lucky')...");

  // 1. Initialize Audio Engine & UI Binding
  const audioBtn = document.getElementById('audio-toggle-btn');
  const audioLabel = document.getElementById('audio-status-text');

  if (audioBtn && window.AudioEngine) {
    audioBtn.addEventListener('click', () => {
      const isPlaying = window.AudioEngine.toggleAudio();
      if (audioLabel) {
        audioLabel.textContent = isPlaying ? "Sound: On" : "Sound: Off";
      }
    });
  }

  // 2. Load Content Store
  let content = null;
  if (window.ContentStore) {
    content = await window.ContentStore.loadContent();
    console.log("📖 Content loaded successfully for:", content?.recipient?.displayName);
  }

  // 3. Initialize Book Stage
  if (window.BookStage) {
    window.BookStage.init();

    // Debug flag: Gate ?preview=all strictly behind local-only development check
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('preview') === 'all') {
        window.BookStage.unlockChapter(6);
      }
    }
  }

  // 4. Initialize Interactive Hero Portal (Chapter 0)
  if (window.HeroPortal) {
    window.HeroPortal.init();
  } else if (window.EntryGate) {
    window.EntryGate.init();
  }

  // 5. Initialize Passport Stamps System
  if (window.PassportStamps) {
    window.PassportStamps.init();
  }

  // 6. Initialize Interactive Sticker Tray
  if (window.StickerTray) {
    window.StickerTray.init();
  }

  // 7. Initialize Let Me Guess (Chapter 1)
  if (window.LetMeGuess) {
    window.LetMeGuess.init();
  }

  // 8. Initialize Parents (Chapter 2)
  if (window.ChapterParents) {
    window.ChapterParents.init();
  }

  // 9. Initialize OG Opp (Chapter 3)
  if (window.ChapterOgOpp) {
    window.ChapterOgOpp.init();
  }

  // 10. Initialize Cousins (Chapter 4)
  if (window.ChapterCousins) {
    window.ChapterCousins.init();
  }

  // 11. Initialize Friends (Chapter 5)
  if (window.ChapterFriends) {
    window.ChapterFriends.init();
  }

  // 12. Initialize Finale (Chapter 6)
  if (window.ChapterFinale) {
    window.ChapterFinale.init();
  }

  // 13. Initialize Desktop Dotted Cursor Trail
  if (window.CursorTrail) {
    window.CursorTrail.init();
  }

  // 14. Global Keyboard Accessibility: Esc closes all open modals (Item 14)
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const activeModals = document.querySelectorAll(
        '.airmail-modal-overlay.active, .lightbox-modal-overlay.active, .unfolded-memory-modal.active, #stamp-modal-container.active, .sticker-tray-sheet.active'
      );
      activeModals.forEach(m => {
        m.classList.remove('active');
        m.setAttribute('aria-hidden', 'true');
      });
      document.body.classList.remove('sticker-decorate-mode');
    }
  });

  // 15. Pause Looping Animations when Tab is Hidden (Item 16)
  document.addEventListener('visibilitychange', () => {
    document.body.classList.toggle('tab-hidden-paused', document.hidden);
  });
});
