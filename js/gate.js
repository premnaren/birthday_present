/**
 * Birthday Storybook - Chapter 0: Entry Gate Controller
 * Sealed diary cover, handwritten input validation, and wax-seal unlock transition
 */

const EntryGate = (() => {
  let failedAttempts = 0;
  const GATE_SESSION_KEY = 'storybook_gate_passed';

  const MONTHS = [
    { value: 1, name: "January" },
    { value: 2, name: "February" },
    { value: 3, name: "March" },
    { value: 4, name: "April" },
    { value: 5, name: "May" },
    { value: 6, name: "June" },
    { value: 7, name: "July" },
    { value: 8, name: "August" },
    { value: 9, name: "September" },
    { value: 10, name: "October" },
    { value: 11, name: "November" },
    { value: 12, name: "December" }
  ];

  function init() {
    renderCover();
    bindEvents();

    // Check if previously unlocked in this session
    try {
      if (sessionStorage.getItem(GATE_SESSION_KEY) === 'true') {
        if (window.BookStage) {
          window.BookStage.unlockChapter(1);
        }
      }
    } catch(e){}
  }

  function renderCover() {
    const container = document.getElementById('chapter-0');
    if (!container) return;

    let dayOptions = '<option value="">Day</option>';
    for (let d = 1; d <= 31; d++) {
      dayOptions += `<option value="${d}">${d}</option>`;
    }

    let monthOptions = '<option value="">Month</option>';
    MONTHS.forEach(m => {
      monthOptions += `<option value="${m.value}">${m.name}</option>`;
    });

    container.innerHTML = `
      <div class="diary-cover-container">
        <!-- Top Washi Tape -->
        <div class="washi-tape washi-tape-pink tape-center"></div>

        <div class="diary-cover-card" id="diary-card">
          <span class="diary-ribbon-header">Private Storybook ✦ Belated Edition</span>
          <h1 class="diary-title">Before we begin…</h1>
          <p class="diary-subtitle">Tell us who this special book belongs to.</p>

          <form class="diary-form" id="diary-gate-form" onsubmit="return false;">
            <div class="input-group">
              <label for="gate-name" class="input-label">What's your name?</label>
              <input 
                type="text" 
                id="gate-name" 
                class="handwritten-input" 
                placeholder="Name or nickname..." 
                autocomplete="off" 
                required 
              />
            </div>

            <div class="input-group">
              <label class="input-label">When's your birthday?</label>
              <div class="date-selector-row">
                <select id="gate-day" class="date-tab-select" aria-label="Day" required>
                  ${dayOptions}
                </select>
                <select id="gate-month" class="date-tab-select" aria-label="Month" required>
                  ${monthOptions}
                </select>
              </div>
            </div>

            <div class="wax-seal-wrapper">
              <button type="submit" id="wax-seal-btn" class="wax-seal-btn" title="Break the seal & open diary">
                <div class="seal-ring">
                  <span class="seal-star">✦</span>
                  <span class="seal-text">OPEN</span>
                </div>
              </button>
              <span class="seal-caption font-handwriting">Press the wax seal to unlock</span>
            </div>

            <div class="feedback-sticky-note" id="gate-feedback">
              <div class="washi-tape washi-tape-yellow tape-top-right" style="width: 50px; height: 16px;"></div>
              <p id="feedback-text">Hmm, try again!</p>
              <p class="feedback-hint" id="feedback-hint"></p>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  function bindEvents() {
    const form = document.getElementById('diary-gate-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      handleUnlockAttempt();
    });
  }

  function handleUnlockAttempt() {
    const nameInput = document.getElementById('gate-name');
    const dayInput = document.getElementById('gate-day');
    const monthInput = document.getElementById('gate-month');
    const diaryCard = document.getElementById('diary-card');
    const feedbackBox = document.getElementById('gate-feedback');
    const feedbackText = document.getElementById('feedback-text');
    const feedbackHint = document.getElementById('feedback-hint');
    const sealBtn = document.getElementById('wax-seal-btn');

    if (!nameInput || !dayInput || !monthInput) return;

    const name = nameInput.value;
    const day = dayInput.value;
    const month = monthInput.value;

    const result = window.ContentStore.validateGate(name, day, month);

    if (result.success) {
      // Success celebration & unlock
      if (window.AudioEngine) {
        window.AudioEngine.playStickerPop();
      }

      try {
      sessionStorage.setItem(GATE_SESSION_KEY, 'true');
    } catch(e){}

      // GSAP Wax Seal Break Animation
      if (typeof gsap !== 'undefined') {
        gsap.timeline()
          .to(sealBtn, {
            scale: 1.35,
            rotation: 12,
            duration: 0.25,
            ease: "back.out(2)"
          })
          .to(sealBtn, {
            scale: 0,
            opacity: 0,
            duration: 0.35,
            ease: "power2.in"
          })
          .to(diaryCard, {
            scale: 1.03,
            rotation: -1,
            boxShadow: "0 20px 45px rgba(74, 59, 63, 0.25)",
            duration: 0.35,
            onComplete: () => {
              if (window.BookStage) {
                window.BookStage.unlockChapter(1);
                window.BookStage.goToChapter(1, 'forward');
              }
            }
          });
      } else {
        if (window.BookStage) {
          window.BookStage.unlockChapter(1);
          window.BookStage.goToChapter(1, 'forward');
        }
      }

    } else {
      // Failure with gentle, friendly feedback
      failedAttempts++;

      if (window.AudioEngine) {
        window.AudioEngine.playPaperRustle();
      }

      // Wobble card gently
      diaryCard.classList.remove('animate-wobble');
      void diaryCard.offsetWidth; // trigger reflow
      diaryCard.classList.add('animate-wobble');

      // Display warm message
      feedbackText.textContent = result.hint || "That doesn't quite sound like the birthday girl… try again?";
      
      if (failedAttempts >= 3) {
        feedbackHint.textContent = "Friendly Hint: Her nickname is Lucky, and her birthday is October 16th!";
      } else {
        feedbackHint.textContent = "";
      }

      feedbackBox.classList.add('visible');
    }
  }

  return {
    init
  };
})();

if (typeof window !== 'undefined') {
  window.EntryGate = EntryGate;
}
