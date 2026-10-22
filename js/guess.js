/**
 * Birthday Storybook - Chapter 1: "Let Me Guess..." Controller
 * Interactive guessing cards, witty rubber stamp reactions, and celebration confetti
 */

const LetMeGuess = (() => {
  let guesses = [];
  let currentCardIndex = 0;
  let isReacting = false;

  const YES_STAMPS = ["KNEW IT!", "SPOT ON!", "CLASSIC LUCKY", "100% TRUE", "NO SURPRISE!"];
  const NOPE_STAMPS = ["DENIAL!", "REALLY?!", "WE HAVE PROOF", "SUREEE...", "BUSTED!"];

  const ENTRANCE_CONFIGS = [
    { fromX: -80, fromY: 0, fromRot: -8, targetRot: -2.5 },
    { fromX: 80, fromY: 0, fromRot: 8, targetRot: 3 },
    { fromX: -50, fromY: -60, fromRot: -6, targetRot: -1.5 },
    { fromX: 50, fromY: -60, fromRot: 6, targetRot: 2.8 },
    { fromX: 0, fromY: 60, fromRot: -5, targetRot: -3 }
  ];

  function init() {
    if (window.ContentStore) {
      guesses = window.ContentStore.getGuesses() || [];
    }
    currentCardIndex = 0;
    renderChapter();
  }

  function renderChapter() {
    const container = document.getElementById('chapter-1');
    if (!container) return;

    container.innerHTML = `
      <div class="guess-chapter-container">
        <div class="washi-tape washi-tape-butter tape-corner-tr" style="width: 75px; height: 20px;"></div>

        <div class="guess-header">
          <span class="diary-ribbon-header">Chapter 1 • The Deductions</span>
          <h2 class="h2" style="margin-top: 6px;">Let Me Guess…</h2>
          <p class="font-caption" style="color: var(--color-ink-muted);">We know you a little too well, Lucky.</p>
          <div class="guess-step-dots" id="guess-dots">
            ${guesses.map((_, i) => `<span class="step-dot ${i === 0 ? 'active' : ''}"></span>`).join('')}
          </div>
        </div>

        <div class="guess-card-stage" id="guess-card-stage">
          <!-- Active Card will be injected here -->
        </div>

        <!-- Big Reveal Card (Hidden until all cards finished) -->
        <div class="guess-reveal-card" id="guess-reveal">
          <div class="washi-tape washi-tape-pink tape-corner-tr" style="width: 75px; height: 20px;"></div>
          <span class="diary-ribbon-header" style="background: var(--color-butter-light); border-color: var(--color-rose);">Surprise!</span>
          <h2 class="reveal-title">Happy Belated Birthday, Lucky!</h2>
          <p class="reveal-message">
            We know being unwell on your birthday wasn't the plan, but you are so deeply loved and celebrated every single day.
            Your people put together their favourite memories and letters just for you!
          </p>
          <button class="btn-chapter-advance" id="btn-to-parents">
            Open Mom & Daddy's Letters <svg class="doodle-arrow"><use href="#doodle-arrow-sketch"/></svg>
          </button>
        </div>
      </div>
    `;

    renderActiveCard();
  }

  function renderActiveCard() {
    const stage = document.getElementById('guess-card-stage');
    const dotsContainer = document.getElementById('guess-dots');
    if (!stage || currentCardIndex >= guesses.length) return;

    const item = guesses[currentCardIndex];
    const config = ENTRANCE_CONFIGS[currentCardIndex % ENTRANCE_CONFIGS.length];

    // Update dots
    if (dotsContainer) {
      const dots = dotsContainer.querySelectorAll('.step-dot');
      dots.forEach((dot, idx) => {
        dot.className = 'step-dot';
        if (idx === currentCardIndex) dot.classList.add('active');
        if (idx < currentCardIndex) dot.classList.add('completed');
      });
    }

    const tapeColor = ['washi-tape-pink', 'washi-tape-sage', 'washi-tape-lavender', 'washi-tape-butter'][currentCardIndex % 4];

    stage.innerHTML = `
      <div class="guess-card" id="current-guess-card" style="transform: rotate(${config.targetRot}deg);">
        <div class="washi-tape ${tapeColor} tape-corner-tr" style="width: 65px; height: 18px;"></div>
        <span class="guess-tag">${item.tag || "Clue"}</span>
        <div class="guess-text">"${item.text}"</div>

        <!-- Hand-drawn scribbled pointer arrow -->
        <div class="action-pointer-arrow" style="display: flex; align-items: center; justify-content: center; gap: 4px; margin: 8px 0 4px; color: var(--color-ink-muted);">
          <span class="font-caption" style="font-size: 0.85rem;">Is this true?</span>
          <svg class="doodle-arrow" style="width: 22px; height: 14px;"><use href="#doodle-arrow-sketch"/></svg>
        </div>

        <div class="guess-actions">
          <button class="btn-guess-reaction btn-guess-yes" data-answer="yes">
            Yes, spot on!
          </button>
          <button class="btn-guess-reaction btn-guess-nope" data-answer="nope">
            Nope, false!
          </button>
        </div>

        <div class="reaction-stamp" id="card-stamp"></div>
      </div>
    `;

    const cardEl = document.getElementById('current-guess-card');

    // Dynamic Entrance Animation with GSAP
    if (typeof gsap !== 'undefined' && cardEl) {
      gsap.fromTo(cardEl,
        { x: config.fromX, y: config.fromY, rotation: config.fromRot, opacity: 0 },
        { x: 0, y: 0, rotation: config.targetRot, opacity: 1, duration: 0.45, ease: "back.out(1.4)" }
      );
    }

    // Bind reaction clicks
    const yesBtn = stage.querySelector('.btn-guess-yes');
    const nopeBtn = stage.querySelector('.btn-guess-nope');

    if (yesBtn) yesBtn.addEventListener('click', () => handleReaction('yes'));
    if (nopeBtn) nopeBtn.addEventListener('click', () => handleReaction('nope'));
  }

  function handleReaction(type) {
    if (isReacting) return;
    isReacting = true;

    const stampEl = document.getElementById('card-stamp');
    const cardEl = document.getElementById('current-guess-card');

    if (window.AudioEngine) {
      window.AudioEngine.playStickerPop();
    }

    // Pick random witty stamp without emoji
    const stampText = type === 'yes' 
      ? YES_STAMPS[Math.floor(Math.random() * YES_STAMPS.length)]
      : NOPE_STAMPS[Math.floor(Math.random() * NOPE_STAMPS.length)];

    if (stampEl) {
      stampEl.textContent = stampText;
      stampEl.classList.remove('stamped');
      void stampEl.offsetWidth; // reflow
      stampEl.classList.add('stamped');
    }

    // Advance to next card or reveal
    setTimeout(() => {
      currentCardIndex++;
      if (currentCardIndex < guesses.length) {
        if (typeof gsap !== 'undefined' && cardEl) {
          gsap.to(cardEl, {
            x: -80,
            opacity: 0,
            rotation: -8,
            duration: 0.35,
            ease: "power2.in",
            onComplete: () => {
              renderActiveCard();
              isReacting = false;
            }
          });
        } else {
          renderActiveCard();
          isReacting = false;
        }
      } else {
        showCelebrationReveal();
        isReacting = false;
      }
    }, 1100);
  }

  function showCelebrationReveal() {
    const stage = document.getElementById('guess-card-stage');
    const reveal = document.getElementById('guess-reveal');
    const dots = document.getElementById('guess-dots');

    if (stage) stage.style.display = 'none';
    if (dots) dots.style.display = 'none';

    if (reveal) {
      reveal.style.display = 'block';

      if (window.AudioEngine) {
        window.AudioEngine.playStickerPop();
      }

      fireSoftPaperConfetti();

      // Bind button to unlock and turn to Chapter 2 (Parents)
      const btnToParents = document.getElementById('btn-to-parents');
      if (btnToParents) {
        btnToParents.addEventListener('click', () => {
          if (window.BookStage) {
            window.BookStage.unlockChapter(2);
            window.BookStage.goToChapter(2, 'forward');
          }
        });
      }
    }
  }

  /**
   * Spawns gentle pastel paper confetti pieces
   */
  function fireSoftPaperConfetti() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let container = document.getElementById('confetti-box');
    if (!container) {
      container = document.createElement('div');
      container.id = 'confetti-box';
      container.className = 'confetti-container';
      document.body.appendChild(container);
    }
    container.innerHTML = '';

    const colors = ['#F4C2C7', '#B7C9A8', '#F7E3A1', '#CDB8E3', '#FFFDF8', '#D98A9B'];
    const pieceCount = 38;

    for (let i = 0; i < pieceCount; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.top = `-20px`;
      piece.style.transform = `rotate(${Math.random() * 360}deg)`;

      container.appendChild(piece);

      const duration = 2.2 + Math.random() * 1.8;
      const delay = Math.random() * 0.6;
      const xDrift = (Math.random() - 0.5) * 140;

      if (typeof gsap !== 'undefined') {
        gsap.to(piece, {
          y: window.innerHeight + 40,
          x: `+=${xDrift}`,
          rotation: `+=${Math.random() * 720 - 360}`,
          opacity: 0,
          duration: duration,
          delay: delay,
          ease: "power1.out",
          onComplete: () => piece.remove()
        });
      } else {
        setTimeout(() => piece.remove(), 3500);
      }
    }
  }

  return {
    init,
    fireSoftPaperConfetti
  };
})();

if (typeof window !== 'undefined') {
  window.LetMeGuess = LetMeGuess;
}
