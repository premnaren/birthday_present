/**
 * Birthday Storybook - Hero Experience & Diary Portal Controller
 * Closed journal on desk, 3D cover opening, press-and-hold wax seal, and calendar picker
 */

const HeroPortal = (() => {
  let isHoldActive = false;
  let holdTimer = null;
  let holdProgress = 0;
  let holdInterval = null;
  const HOLD_DURATION_MS = 1200;

  let selectedDay = null;
  let selectedMonth = 10; // Default October

  function init() {
    renderClosedJournalCover();
    bindRibbonAndCover();
  }

  function renderClosedJournalCover() {
    const chapter0 = document.getElementById('chapter-0');
    if (!chapter0) return;

    // Check if previously passed gate in this session
    const isGatePassed = sessionStorage.getItem('storybook_gate_passed') === 'true';

    chapter0.innerHTML = `
      <div class="hero-desk-stage" id="hero-stage">
        
        <!-- Closed Journal (Hero Initial State) -->
        <div class="diary-book-closed ${isGatePassed ? 'is-opening' : ''}" id="diary-closed-book" role="button" aria-label="A closed leather diary. Tap to unhook ribbon and open.">
          <div class="diary-closed-spine"></div>
          
          <div class="diary-cover-gold-foil">
            <span class="diary-embossed-subtitle">Confidential • Belated Edition</span>
            <h1 class="diary-embossed-title">A Secret Storybook</h1>
            <p class="diary-embossed-for">Handcrafted for Kritika ("Lucky")</p>
          </div>

          <!-- Elastic Ribbon Band holding the book closed -->
          <div class="elastic-ribbon-band" id="elastic-ribbon" title="Tap ribbon to open diary">
            <div class="ribbon-tag-charm">Pull to Open ✦</div>
          </div>
        </div>

        <!-- Inside Cover: Entry Gate Form & Calendar -->
        <div class="diary-cover-card" id="diary-inner-gate" style="${isGatePassed ? 'display: block;' : 'display: none;'}">
          <div class="washi-tape washi-tape-pink tape-corner-tr" style="width: 75px; height: 22px;"></div>

          <div style="text-align: center; margin-bottom: 14px;">
            <span class="diary-ribbon-header">Private Storybook • Birthday Edition</span>
            <h2 class="diary-title" style="margin-top: 8px;">Before we begin…</h2>
            <p class="diary-subtitle font-caption">Tell us who this special book belongs to.</p>
          </div>

          <form class="diary-form" id="diary-gate-form" onsubmit="return false;">
            <div class="input-group">
              <label for="gate-name" class="input-label">What's your name or nickname?</label>
              <input 
                type="text" 
                id="gate-name" 
                class="handwritten-input" 
                placeholder="Name or nickname..." 
                autocomplete="off" 
                required 
              />
              <div class="welcome-ink-banner">
                <span class="welcome-ink-text" id="ink-preview"></span>
              </div>
            </div>

            <!-- Hand-drawn Interactive Calendar Birthday Picker -->
            <div class="input-group">
              <label class="input-label">When's your birthday? (Tap your date below)</label>
              <div class="calendar-picker-wrapper">
                <div class="calendar-card">
                  <div class="washi-tape washi-tape-sage tape-corner-tl" style="width: 55px; height: 16px;"></div>
                  
                  <div class="calendar-header">
                    <span class="calendar-month-title">OCTOBER</span>
                    <span class="font-caption">Libra Season ✦</span>
                  </div>

                  <div class="calendar-days-grid" id="cal-grid">
                    <span class="calendar-weekday">Su</span>
                    <span class="calendar-weekday">Mo</span>
                    <span class="calendar-weekday">Tu</span>
                    <span class="calendar-weekday">We</span>
                    <span class="calendar-weekday">Th</span>
                    <span class="calendar-weekday">Fr</span>
                    <span class="calendar-weekday">Sa</span>

                    <!-- Empty slots before Oct 1 (Oct 2026 starts on Thursday -> 4 empty slots) -->
                    <span class="cal-day-cell empty"></span>
                    <span class="cal-day-cell empty"></span>
                    <span class="cal-day-cell empty"></span>
                    <span class="cal-day-cell empty"></span>

                    <!-- Days 1 to 31 -->
                    ${generateCalendarCells()}
                  </div>
                </div>
              </div>

              <!-- Accessible hidden select for screen readers -->
              <input type="hidden" id="selected-day-input" value="16" />
              <input type="hidden" id="selected-month-input" value="10" />
            </div>

            <!-- Hold-to-Crack Wax Seal Button -->
            <div class="wax-seal-wrapper">
              <button type="button" id="hold-wax-seal" class="hold-seal-btn" title="Press and hold wax seal to break & open diary" aria-label="Press and hold wax seal to break & open diary">
                <svg class="hold-seal-svg-ring" viewBox="0 0 100 100">
                  <circle class="hold-progress-bg" cx="50" cy="50" r="45" />
                  <circle class="hold-progress-bar" id="seal-progress-bar" cx="50" cy="50" r="45" />
                </svg>
                
                <div class="seal-inner-emblem">
                  <svg class="seal-star-svg" viewBox="0 0 24 24"><use href="#doodle-wax-star"/></svg>
                  <span class="seal-word">OPEN</span>
                </div>
              </button>
              <span class="seal-hold-hint" id="seal-instruction">Press and hold seal to unlock ✦</span>
            </div>

            <!-- Playful Post-it Hint Note -->
            <div class="feedback-sticky-note" id="gate-feedback">
              <div class="washi-tape washi-tape-butter tape-corner-tr" style="width: 45px; height: 16px;"></div>
              <p id="feedback-text" style="font-weight: 700;">Hmm, try again!</p>
              <p class="feedback-hint" id="feedback-hint"></p>
            </div>
          </form>
        </div>

      </div>
    `;

    bindCalendarEvents();
    bindHoldSealEvents();
    bindNameTyping();
  }

  function generateCalendarCells() {
    let cells = '';
    for (let day = 1; day <= 31; day++) {
      const isSelected = (day === 16);
      cells += `
        <button type="button" class="cal-day-cell ${isSelected ? 'selected' : ''}" data-day="${day}" aria-label="October ${day}">
          <span>${day}</span>
          <svg class="pen-circle-svg" viewBox="0 0 50 50">
            <path d="M25 6 C36 5, 45 14, 45 25 C45 36, 36 45, 25 45 C14 45, 5 36, 6 25 C7 14, 16 5, 27 6" />
          </svg>
        </button>
      `;
    }
    return cells;
  }

  function bindRibbonAndCover() {
    const closedBook = document.getElementById('diary-closed-book');
    const ribbon = document.getElementById('elastic-ribbon');
    const innerGate = document.getElementById('diary-inner-gate');

    if (!closedBook || !ribbon) return;

    function openDiaryCover() {
      if (closedBook.classList.contains('is-opening')) return;

      if (window.AudioEngine) {
        window.AudioEngine.playPaperRustle();
      }

      // 1. Unhook elastic ribbon
      ribbon.classList.add('unhooked');

      // 2. Open cover in 3D
      setTimeout(() => {
        if (window.AudioEngine) {
          window.AudioEngine.playPageTurn();
        }
        closedBook.classList.add('is-opening');

        setTimeout(() => {
          closedBook.style.display = 'none';
          if (innerGate) {
            innerGate.style.display = 'block';
            if (typeof gsap !== 'undefined') {
              gsap.fromTo(innerGate, 
                { opacity: 0, scale: 0.95, y: 20 },
                { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: "back.out(1.2)" }
              );
            }
          }
        }, 850);
      }, 350);
    }

    ribbon.addEventListener('click', (e) => {
      e.stopPropagation();
      openDiaryCover();
    });

    closedBook.addEventListener('click', openDiaryCover);
  }

  function bindNameTyping() {
    const nameInput = document.getElementById('gate-name');
    const inkPreview = document.getElementById('ink-preview');

    if (nameInput && inkPreview) {
      nameInput.addEventListener('input', () => {
        const val = nameInput.value.trim();
        if (val.length > 0) {
          inkPreview.textContent = `For: ${nameInput.value}`;
          inkPreview.classList.add('visible');
        } else {
          inkPreview.classList.remove('visible');
        }
      });
    }
  }

  function bindCalendarEvents() {
    const dayCells = document.querySelectorAll('.cal-day-cell:not(.empty)');
    const hiddenDayInput = document.getElementById('selected-day-input');

    dayCells.forEach(cell => {
      cell.addEventListener('click', () => {
        dayCells.forEach(c => c.classList.remove('selected'));
        cell.classList.add('selected');
        selectedDay = parseInt(cell.dataset.day, 10);
        if (hiddenDayInput) hiddenDayInput.value = selectedDay;

        if (window.AudioEngine) {
          window.AudioEngine.playStickerPop();
        }
      });
    });

    // Default select 16
    selectedDay = 16;
  }

  function bindHoldSealEvents() {
    const sealBtn = document.getElementById('hold-wax-seal');
    const progressBar = document.getElementById('seal-progress-bar');
    const hintText = document.getElementById('seal-instruction');

    if (!sealBtn || !progressBar) return;

    const circumference = 2 * Math.PI * 45; // ~283

    function startHold() {
      // Validate inputs first
      const nameInput = document.getElementById('gate-name');
      const inputName = nameInput ? nameInput.value : '';
      const day = selectedDay || 16;
      const month = 10;

      if (window.ContentStore) {
        const validation = window.ContentStore.validateGate(inputName, day, month);
        if (!validation.success) {
          showHint(validation.hint);
          // Shake seal
          sealBtn.classList.add('seal-shake');
          setTimeout(() => sealBtn.classList.remove('seal-shake'), 450);
          return;
        }
      }

      isHoldActive = true;
      holdProgress = 0;
      if (hintText) hintText.textContent = "Hold steady... unlocking ✦";

      const startTime = performance.now();

      holdInterval = setInterval(() => {
        if (!isHoldActive) return;
        const elapsed = performance.now() - startTime;
        holdProgress = Math.min(elapsed / HOLD_DURATION_MS, 1);

        const offset = circumference * (1 - holdProgress);
        progressBar.style.strokeDashoffset = offset;

        if (holdProgress >= 1) {
          clearInterval(holdInterval);
          crackWaxSealAndUnlock();
        }
      }, 25);
    }

    function cancelHold() {
      if (!isHoldActive) return;
      isHoldActive = false;
      clearInterval(holdInterval);

      // Drain progress with gentle wobble
      progressBar.style.transition = 'stroke-dashoffset 0.3s ease';
      progressBar.style.strokeDashoffset = circumference;
      setTimeout(() => {
        progressBar.style.transition = 'stroke-dashoffset 0.1s linear';
      }, 300);

      if (hintText) hintText.textContent = "Press and hold seal to unlock ✦";
    }

    // Touch & pointer events
    sealBtn.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      startHold();
    });

    window.addEventListener('pointerup', cancelHold);
    window.addEventListener('pointercancel', cancelHold);

    // Keyboard support: Space / Enter
    sealBtn.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (!isHoldActive) startHold();
      }
    });

    sealBtn.addEventListener('keyup', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        cancelHold();
      }
    });
  }

  function crackWaxSealAndUnlock() {
    const sealBtn = document.getElementById('hold-wax-seal');
    const hintText = document.getElementById('seal-instruction');

    if (window.AudioEngine) {
      window.AudioEngine.playStickerPop();
      setTimeout(() => window.AudioEngine.playPageTurn(), 400);
    }

    // Haptic vibration where supported
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try { navigator.vibrate(35); } catch(e){}
    }

    if (hintText) hintText.textContent = "Seal broken! Welcome, Lucky ✦";

    // Create 4 animated wax shards
    if (sealBtn && typeof gsap !== 'undefined') {
      const rect = sealBtn.getBoundingClientRect();
      const parent = sealBtn.parentElement;

      for (let i = 0; i < 4; i++) {
        const shard = document.createElement('div');
        shard.className = 'seal-shard';
        shard.style.left = '42px';
        shard.style.top = '42px';
        parent.appendChild(shard);

        const angle = (i * 90) + (Math.random() * 20 - 10);
        const rad = angle * (Math.PI / 180);
        const distance = 40 + Math.random() * 25;

        gsap.to(shard, {
          x: Math.cos(rad) * distance,
          y: Math.sin(rad) * distance,
          rotation: Math.random() * 180 - 90,
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
          onComplete: () => shard.remove()
        });
      }

      gsap.to(sealBtn, { scale: 0.85, opacity: 0.4, duration: 0.3 });
    }

    sessionStorage.setItem('storybook_gate_passed', 'true');

    // Unlock Chapter 1 and advance
    setTimeout(() => {
      if (window.BookStage) {
        window.BookStage.unlockChapter(1);
        window.BookStage.goToChapter(1, 'forward');
      }
    }, 650);
  }

  function showHint(hintMessage) {
    const feedback = document.getElementById('gate-feedback');
    const feedbackHint = document.getElementById('feedback-hint');

    if (window.AudioEngine) {
      window.AudioEngine.playStickerPop();
    }

    if (feedback && feedbackHint) {
      feedbackHint.textContent = hintMessage || "Check the name and birthday code!";
      feedback.classList.remove('active');
      void feedback.offsetWidth; // reflow
      feedback.classList.add('active');
    }
  }

  return {
    init,
    openDiaryCover: () => {
      const closedBook = document.getElementById('diary-closed-book');
      if (closedBook) closedBook.click();
    }
  };
})();

if (typeof window !== 'undefined') {
  window.HeroPortal = HeroPortal;
}
