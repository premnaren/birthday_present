/**
 * Birthday Storybook - Chapter 6: Make a Wish Finale Controller
 * Interactive birthday cake, candle blowout with smoke puffs, soft confetti, and closing letter
 */

const ChapterFinale = (() => {
  let finaleData = null;
  let litCandlesCount = 3;
  let isWishCompleted = false;

  function init() {
    if (window.ContentStore) {
      finaleData = window.ContentStore.getChapter('finale');
    }
    litCandlesCount = 3;
    isWishCompleted = false;
    renderChapter();
  }

  function renderChapter() {
    const container = document.getElementById('chapter-6');
    if (!container) return;

    const letter = finaleData?.closingLetter || {
      from: "Prem",
      title: "A Note from Prem",
      message: "Hey Kritika,\n\nWe know being unwell on your birthday wasn't in the plan, but birthdays don't expire—and neither does how much everyone loves and cherishes you.\n\nTake all the time you need to recover, drink all the warm tea, and let this little scrapbook remind you of all the love and smiles waiting for you on the other side.\n\nHappy Belated Birthday, Lucky! 🎂✨"
    };

    container.innerHTML = `
      <div class="finale-content-wrapper">
        <div class="washi-tape washi-tape-pink tape-center"></div>

        <div class="chapter-header">
          <span class="diary-ribbon-header">The Finale ✦ Make a Wish</span>
          <h2 class="h2">${finaleData?.heading || "Make a Wish, Lucky! 🎂"}</h2>
          <p class="chapter-intro-note" id="candle-status-prompt">
            Tap each candle to blow it out, or blow them all together! ✨
          </p>
        </div>

        <!-- Handcrafted Cake Stage -->
        <div class="cake-stage-container">
          <div class="cake-wrapper">
            <!-- 3 Candles -->
            <div class="candles-row" id="candles-row">
              <div class="candle-unit" data-candle="1" title="Tap to blow out candle">
                <div class="candle-flame"></div>
                <div class="smoke-puff"></div>
                <div class="candle-wick"></div>
                <div class="candle-wax"></div>
              </div>
              <div class="candle-unit" data-candle="2" title="Tap to blow out candle">
                <div class="candle-flame"></div>
                <div class="smoke-puff"></div>
                <div class="candle-wick"></div>
                <div class="candle-wax"></div>
              </div>
              <div class="candle-unit" data-candle="3" title="Tap to blow out candle">
                <div class="candle-flame"></div>
                <div class="smoke-puff"></div>
                <div class="candle-wick"></div>
                <div class="candle-wax"></div>
              </div>
            </div>

            <!-- Cake Sponge Layers -->
            <div class="cake-layer-top">
              <div class="frosting-drips"></div>
            </div>
            <div class="cake-layer-bottom"></div>
            <div class="cake-plate"></div>
          </div>

          <button class="btn-blow-all" id="btn-blow-all">
            Blow Out All Candles 🕯️✨
          </button>
        </div>

        <!-- Prem's Closing Letter (Revealed after candles are blown out) -->
        <div class="closing-letter-card" id="closing-letter">
          <div class="washi-tape washi-tape-butter tape-center" style="width: 70px; height: 18px;"></div>
          <h3 class="closing-letter-title">${letter.title || "A Note from Prem"}</h3>
          
          <div class="closing-letter-text">
            ${letter.message}
          </div>

          <div class="closing-signoff">
            <span class="font-handwriting" style="font-size: 1.45rem; color: var(--color-rose-deep);">
              Always rooting for you 💖 - ${letter.from}
            </span>
            <button class="btn-replay-storybook" id="btn-replay">
              Replay from Cover ↺
            </button>
          </div>
        </div>

      </div>
    `;

    bindInteractions();
  }

  function bindInteractions() {
    const candles = document.querySelectorAll('.candle-unit');
    const btnBlowAll = document.getElementById('btn-blow-all');

    candles.forEach(c => {
      c.addEventListener('click', () => {
        if (!c.classList.contains('blown-out')) {
          extinguishCandle(c);
        }
      });
    });

    if (btnBlowAll) {
      btnBlowAll.addEventListener('click', () => {
        candles.forEach((c, i) => {
          if (!c.classList.contains('blown-out')) {
            setTimeout(() => extinguishCandle(c), i * 140);
          }
        });
      });
    }

    const btnReplay = document.getElementById('btn-replay');
    if (btnReplay) {
      btnReplay.addEventListener('click', () => {
        if (window.BookStage) {
          window.BookStage.goToChapter(0, 'backward');
        }
      });
    }
  }

  function extinguishCandle(candleEl) {
    if (candleEl.classList.contains('blown-out')) return;

    candleEl.classList.add('blown-out');
    litCandlesCount--;

    if (window.AudioEngine) {
      window.AudioEngine.playCandleBlow();
    }

    const prompt = document.getElementById('candle-status-prompt');
    if (prompt) {
      if (litCandlesCount === 2) prompt.textContent = "Two more to go! Make a wish ✨";
      if (litCandlesCount === 1) prompt.textContent = "Last candle! Dream big 💖";
      if (litCandlesCount === 0) prompt.textContent = "✨ All wishes sent to the universe! ✨";
    }

    if (litCandlesCount <= 0 && !isWishCompleted) {
      isWishCompleted = true;
      triggerWishCelebration();
    }
  }

  function triggerWishCelebration() {
    const btnBlowAll = document.getElementById('btn-blow-all');
    const letterCard = document.getElementById('closing-letter');

    if (btnBlowAll) {
      btnBlowAll.style.display = 'none';
    }

    setTimeout(() => {
      if (window.AudioEngine) {
        window.AudioEngine.playStickerPop();
      }

      if (window.LetMeGuess && window.LetMeGuess.fireSoftPaperConfetti) {
        window.LetMeGuess.fireSoftPaperConfetti();
      }

      if (letterCard) {
        letterCard.style.display = 'block';

        if (typeof gsap !== 'undefined') {
          gsap.fromTo(letterCard, 
            { y: 30, opacity: 0, scale: 0.95 },
            { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.4)" }
          );
        }
      }
    }, 600);
  }

  return {
    init,
    extinguishCandle
  };
})();

if (typeof window !== 'undefined') {
  window.ChapterFinale = ChapterFinale;
}
