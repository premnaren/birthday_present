/**
 * Birthday Storybook - Hero Experience & Diary Portal Controller
 * Closed journal on desk, 3D cover opening, press-and-hold wax seal, and calendar picker
 */

const HeroPortal = (() => {
  let isHoldActive = false;
  let holdTimer = null;
  let holdProgress = 0;
  let holdInterval = null;
  const HOLD_DURATION_MS = 950;

  let selectedDay = 16;
  let selectedMonth = 10; // Default October

  // Safe storage helper with in-memory fallback (Item 12)
  const safeStorage = {
    _mem: {},
    get(key) {
      try {
        if (typeof sessionStorage !== 'undefined') {
          return sessionStorage.getItem(key);
        }
      } catch (e) {}
      return this._mem[key] || null;
    },
    set(key, val) {
      try {
        if (typeof sessionStorage !== 'undefined') {
          sessionStorage.setItem(key, val);
        }
      } catch (e) {}
      this._mem[key] = String(val);
    }
  };

  function init() {
    renderClosedJournalCover();
    bindRibbonAndCover();
  }

  function renderClosedJournalCover() {
    const chapter0 = document.getElementById('chapter-0');
    if (!chapter0) return;

    // Check if previously passed gate in this session
    const isGatePassed = safeStorage.get('storybook_gate_passed') === 'true';

    chapter0.innerHTML = `
      <div class="hero-desk-stage" id="hero-stage">
        
        <!-- Closed Journal (Hero Initial State) -->
        <div class="diary-book-closed ${isGatePassed ? 'is-opening' : ''}" id="diary-closed-book" role="button" aria-label="A closed leather diary. Tap to unhook ribbon and open." tabindex="0">
          <div class="diary-closed-spine"></div>
          
          <div class="diary-cover-gold-foil">
            <span class="diary-embossed-subtitle">Confidential • Belated Edition</span>
            <h1 class="diary-embossed-title">A Secret Storybook</h1>
            <p class="diary-embossed-for">Handcrafted for Kritika ("Lucky")</p>
          </div>

          <!-- Elastic Ribbon Band holding the book closed -->
          <div class="elastic-ribbon-band" id="elastic-ribbon" title="Tap ribbon to open diary">
            <div class="ribbon-tag-charm">
              <svg class="charm-icon" viewBox="0 0 24 24" style="width: 14px; height: 14px; vertical-align: -1px; margin-right: 4px;" aria-hidden="true">
                <use href="#doodle-wax-star"/>
              </svg>Pull to Open
            </div>
          </div>
        </div>

        <!-- Inside Cover: Entry Gate Form & Calendar -->
        <div class="diary-cover-card" id="diary-inner-gate" style="${isGatePassed ? 'display: block;' : 'display: none;'}">
          <div class="washi-tape washi-tape-pink tape-corner-tr" style="width: 75px; height: 22px;"></div>

          <!-- Imperfection: Small folded corner (Item 5) -->
          <div class="folded-corner-mark" aria-hidden="true"></div>

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
              <label class="input-label" id="cal-label">When's your birthday? (Tap your date below)</label>
              <div class="calendar-picker-wrapper">
                <div class="calendar-card" role="region" aria-labelledby="cal-label">
                  <div class="washi-tape washi-tape-sage tape-corner-tl" style="width: 55px; height: 16px;"></div>
                  
                  <div class="calendar-header">
                    <span class="calendar-month-title">OCTOBER</span>
                    <span class="font-caption">Libra Season</span>
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
                    <span class="cal-day-cell empty" aria-hidden="true"></span>
                    <span class="cal-day-cell empty" aria-hidden="true"></span>
                    <span class="cal-day-cell empty" aria-hidden="true"></span>
                    <span class="cal-day-cell empty" aria-hidden="true"></span>

                    <!-- Days 1 to 31 -->
                    ${generateCalendarCells()}
                  </div>
                </div>
              </div>

              <!-- Accessible fallback select for screen readers and non-pointer users (Item 9) -->
              <div style="margin-top: 6px;">
                <label for="cal-day-select" class="sr-only">Or choose birth date from list:</label>
                <select id="cal-day-select" class="calendar-sr-select" aria-label="Select October birth date">
                  ${[...Array(31)].map((_, i) => `<option value="${i+1}" ${i+1 === 16 ? 'selected' : ''}>October ${i+1}</option>`).join('')}
                </select>
              </div>

              <input type="hidden" id="selected-day-input" value="16" />
              <input type="hidden" id="selected-month-input" value="10" />
            </div>

            <!-- Wax Seal Button & Non-hold Fallback (Item 9) -->
            <div class="wax-seal-wrapper">
              <button type="button" id="hold-wax-seal" class="hold-seal-btn" title="Press and hold wax seal to break & open diary" aria-label="Press and hold wax seal to break & open diary">
                <svg class="hold-seal-svg-ring" viewBox="0 0 100 100" aria-hidden="true">
                  <circle class="hold-progress-bg" cx="50" cy="50" r="45" />
                  <circle class="hold-progress-bar" id="seal-progress-bar" cx="50" cy="50" r="45" />
                </svg>
                
                <div class="seal-inner-emblem">
                  <svg class="seal-star-svg" viewBox="0 0 24 24" aria-hidden="true"><use href="#doodle-wax-star"/></svg>
                  <span class="seal-word">OPEN</span>
                </div>
              </button>
              <span class="seal-hold-hint" id="seal-instruction">Press and hold seal to unlock</span>

              <!-- Non-hold Fallback Button (Item 9) -->
              <button type="button" class="btn-seal-fallback" id="btn-seal-fallback" aria-label="Open storybook directly without holding">
                Open Storybook
              </button>
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
      const isSelected = day === 16;
      cells += `
        <button 
          type="button" 
          class="cal-day-cell ${isSelected ? 'selected' : ''}" 
          data-day="${day}" 
          aria-label="October ${day}"
          tabindex="0"
        >
          ${day}
          ${isSelected ? '<svg class="pen-circle-svg" viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="16"/></svg>' : ''}
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

      // Check prefers-reduced-motion (Item 13)
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // 1. Unhook elastic ribbon
      ribbon.classList.add('unhooked');

      if (reducedMotion) {
        closedBook.style.display = 'none';
        if (innerGate) {
          innerGate.style.display = 'block';
          innerGate.style.opacity = '1';
        }
        return;
      }

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
    closedBook.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openDiaryCover();
      }
    });
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

      nameInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          validateAndCrack();
        }
      });
    }
  }

  function bindCalendarEvents() {
    const dayCells = document.querySelectorAll('.cal-day-cell:not(.empty)');
    const hiddenDayInput = document.getElementById('selected-day-input');
    const daySelect = document.getElementById('cal-day-select');

    dayCells.forEach(cell => {
      cell.addEventListener('click', () => {
        dayCells.forEach(c => c.classList.remove('selected'));
        cell.classList.add('selected');
        selectedDay = parseInt(cell.dataset.day, 10);
        if (hiddenDayInput) hiddenDayInput.value = selectedDay;
        if (daySelect) daySelect.value = String(selectedDay);

        if (window.AudioEngine) {
          window.AudioEngine.playStickerDrop();
        }
      });
    });

    // Synchronize select dropdown
    if (daySelect) {
      daySelect.addEventListener('change', () => {
        const val = parseInt(daySelect.value, 10);
        selectedDay = val;
        if (hiddenDayInput) hiddenDayInput.value = val;
        dayCells.forEach(cell => {
          if (parseInt(cell.dataset.day, 10) === val) {
            cell.classList.add('selected');
          } else {
            cell.classList.remove('selected');
          }
        });
      });
    }

    // Default select 16
    selectedDay = 16;
  }

  function validateAndCrack() {
    const nameInput = document.getElementById('gate-name');
    const name = nameInput ? nameInput.value.trim().toLowerCase() : '';
    const day = selectedDay || 16;
    const accepted = ['kritika', 'lucky', 'kriti', 'kittu'];
    const nameMatches = accepted.some(alias => name.includes(alias));

    if (!nameMatches || day !== 16) {
      if (!nameMatches) {
        showHint("Try typing 'Kritika' or her nickname 'Lucky'!");
      } else {
        showHint("Check the calendar date! (Hint: October 16th!)");
      }
      return;
    }

    crackWaxSealAndUnlock();
  }

  function bindHoldSealEvents() {
    const sealBtn = document.getElementById('hold-wax-seal');
    const fallbackBtn = document.getElementById('btn-seal-fallback');
    const progressBar = document.getElementById('seal-progress-bar');
    const hintText = document.getElementById('seal-instruction');

    if (!sealBtn || !progressBar) return;

    const circumference = 2 * Math.PI * 45; // ~283
    let isUnlocking = false;

    // Suppress mobile contextmenu and selection so long-press never gets hijacked
    const sealWrapper = sealBtn.closest('.wax-seal-wrapper') || sealBtn.parentElement;
    
    function suppressCallout(e) {
      if (e.cancelable) e.preventDefault();
      e.stopPropagation();
      return false;
    }

    if (sealWrapper) {
      sealWrapper.addEventListener('contextmenu', suppressCallout);
      sealWrapper.addEventListener('selectstart', suppressCallout);
    }

    function setProgress(percent) {
      const offset = circumference - (percent / 100) * circumference;
      progressBar.style.strokeDashoffset = offset;
    }

    // Reset initially
    progressBar.style.strokeDasharray = `${circumference} ${circumference}`;
    setProgress(0);

    function startHold(e) {
      if (isUnlocking) return;
      isHoldActive = true;
      holdProgress = 0;
      sealBtn.classList.add('holding');

      if (hintText) hintText.textContent = "Hold steady... unlocking";

      const startTime = performance.now();

      clearInterval(holdInterval);
      holdInterval = setInterval(() => {
        if (!isHoldActive) return;

        const elapsed = performance.now() - startTime;
        holdProgress = Math.min(100, (elapsed / HOLD_DURATION_MS) * 100);
        setProgress(holdProgress);

        if (holdProgress >= 100) {
          clearInterval(holdInterval);
          isHoldActive = false;
          isUnlocking = true;
          sealBtn.classList.remove('holding');
          validateAndCrack();
        }
      }, 16);
    }

    function cancelHold(e) {
      if (isUnlocking) return;
      if (!isHoldActive) return;

      isHoldActive = false;
      clearInterval(holdInterval);
      sealBtn.classList.remove('holding');

      if (hintText) hintText.textContent = "Press and hold seal to unlock";

      // Animate progress drain
      if (typeof gsap !== 'undefined') {
        gsap.to({ p: holdProgress }, {
          p: 0,
          duration: 0.25,
          onUpdate: function () {
            setProgress(this.targets()[0].p);
          }
        });
      } else {
        setProgress(0);
      }
    }

    // Pointer events for desktop and mobile
    sealBtn.addEventListener('pointerdown', (e) => {
      if (e.button !== undefined && e.button !== 0) return;
      startHold(e);
    });

    window.addEventListener('pointerup', cancelHold);
    window.addEventListener('pointercancel', cancelHold);

    // Fallback button click (Item 9)
    if (fallbackBtn) {
      fallbackBtn.addEventListener('click', (e) => {
        e.preventDefault();
        validateAndCrack();
      });
    }

    // Keyboard support: Enter / Space triggers unlock directly
    sealBtn.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        validateAndCrack();
      }
    });
  }

  function crackWaxSealAndUnlock() {
    const sealBtn = document.getElementById('hold-wax-seal');
    const hintText = document.getElementById('seal-instruction');

    // Distinct brittle wax crack SFX (Item 11)
    if (window.AudioEngine) {
      window.AudioEngine.playWaxCrack();
      setTimeout(() => window.AudioEngine.playPageTurn(), 400);
    }

    // Haptic vibration where supported
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try { navigator.vibrate(35); } catch(e){}
    }

    if (hintText) hintText.textContent = "Seal broken! Welcome, Lucky";

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Create 4 animated wax shards (Item 13: skip if reduced motion)
    if (sealBtn && typeof gsap !== 'undefined' && !reducedMotion) {
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
    } else if (sealBtn) {
      sealBtn.style.opacity = '0.4';
    }

    safeStorage.set('storybook_gate_passed', 'true');

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
      window.AudioEngine.playStickerDrop();
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
