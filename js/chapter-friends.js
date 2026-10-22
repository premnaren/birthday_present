/**
 * Birthday Storybook - Chapter 2: Friends Corkboard Controller
 * 3D flippable Polaroids, draggable corkboard layout, and memory jar reveals
 */

const ChapterFriends = (() => {
  let friendsData = null;

  const MEMORY_JAR_NOTES = [
    "Remember that time you tried teaching everyone that impossible dance choreo at midnight? Classic Lucky! 💃😂",
    "The legendary 45-minute debate over whether chocolate truffle or red velvet reigns supreme! 🍰✨",
    "That spontaneous watercolor afternoon where more paint ended up on your elbows than the sketchbook! 🎨💖",
    "The emergency late-night chai run when everyone was exhausted but couldn't stop laughing! ☕🌙"
  ];

  let memoryIdx = 0;

  function init() {
    if (window.ContentStore) {
      friendsData = window.ContentStore.getChapter('friends');
    }
    renderChapter();
  }

  function renderChapter() {
    const container = document.getElementById('chapter-2');
    if (!container || !friendsData) return;

    const entries = friendsData.entries || [];
    const emojis = ["📸", "🎨", "🍰", "✨"];
    const tilts = ["tilt-neg-2", "tilt-pos-3", "tilt-neg-1", "tilt-pos-2"];
    const tapes = ["washi-tape-pink", "washi-tape-sage", "washi-tape-butter", "washi-tape-lavender"];

    container.innerHTML = `
      <div class="chapter-content-wrapper">
        <div class="washi-tape washi-tape-sage tape-center"></div>

        <div class="chapter-header">
          <span class="diary-ribbon-header">Chapter 2 ✦ The Crew</span>
          <h2 class="h2">${friendsData.heading || "The Friends Corkboard"}</h2>
          <p class="chapter-intro-note">${friendsData.intro || "Tap any Polaroid to flip it and read the note on the back!"}</p>
        </div>

        <!-- Corkboard Canvas -->
        <div class="corkboard-canvas" id="friends-corkboard">
          ${entries.map((entry, idx) => `
            <div class="polaroid-3d-card ${tilts[idx % tilts.length]}" data-index="${idx}" id="polaroid-${idx}">
              <div class="washi-tape ${tapes[idx % tapes.length]} tape-center" style="width: 60px; height: 18px;"></div>
              
              <div class="polaroid-inner">
                <!-- Front Side: Photo & Caption -->
                <div class="polaroid-face polaroid-front">
                  <div class="polaroid-photo" style="background-color: ${entry.placeholderColor || '#FCE4E8'}">
                    <span>${emojis[idx % emojis.length]}</span>
                  </div>
                  <div class="polaroid-caption">${entry.caption || entry.from}</div>
                  <div class="flip-hint">Tap to flip ↺</div>
                </div>

                <!-- Back Side: Handwritten Message -->
                <div class="polaroid-face polaroid-back">
                  <div class="polaroid-back-from">From: ${entry.from}</div>
                  <div class="polaroid-back-msg">"${entry.message}"</div>
                  <div class="flip-hint" style="margin-top: auto;">↺ Flip back</div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Memory Jar Widget -->
        <div class="memory-jar-container">
          <button class="memory-jar-btn" id="memory-jar-btn" title="Draw a sweet memory">
            <span style="font-size: 1.3rem;">🫙</span> Draw a Memory Note
          </button>
        </div>

        <div class="memory-note-popup" id="memory-popup">
          <div class="washi-tape washi-tape-pink tape-center" style="width: 50px; height: 16px;"></div>
          <p class="font-handwriting" style="font-size: 1.35rem; color: var(--color-ink);" id="memory-note-text"></p>
          <button style="margin-top: 10px; background: none; border: none; font-family: 'Gaegu', cursive; font-size: 1.05rem; color: var(--color-rose-deep); cursor: pointer; text-decoration: underline;" id="btn-close-memory">
            Put back in jar ✕
          </button>
        </div>

        <!-- Chapter Advance Button -->
        <div class="chapter-advance-row">
          <button class="btn-chapter-advance" id="btn-to-family">
            Turn to The Family Album <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    `;

    bindInteractions();
  }

  function bindInteractions() {
    // 1. Polaroid Flip on Tap
    const cards = document.querySelectorAll('.polaroid-3d-card');
    cards.forEach(card => {
      card.addEventListener('click', (e) => {
        // Prevent click if currently dragging
        if (card.dataset.isDragging === 'true') return;

        if (window.AudioEngine) {
          window.AudioEngine.playPaperRustle();
        }

        card.classList.toggle('is-flipped');
      });
    });

    // 2. Enable GSAP Draggable on pointer devices
    if (typeof Draggable !== 'undefined' && window.matchMedia('(pointer: fine)').matches) {
      Draggable.create('.polaroid-3d-card', {
        bounds: '#friends-corkboard',
        edgeResistance: 0.65,
        type: 'x,y',
        onDragStart: function() {
          this.target.dataset.isDragging = 'true';
          this.target.style.zIndex = 50;
        },
        onDragEnd: function() {
          setTimeout(() => {
            this.target.dataset.isDragging = 'false';
            this.target.style.zIndex = '';
          }, 50);
        }
      });
    }

    // 3. Memory Jar
    const jarBtn = document.getElementById('memory-jar-btn');
    const popup = document.getElementById('memory-popup');
    const noteText = document.getElementById('memory-note-text');
    const closeBtn = document.getElementById('btn-close-memory');

    if (jarBtn && popup && noteText) {
      jarBtn.addEventListener('click', () => {
        if (window.AudioEngine) window.AudioEngine.playStickerPop();
        noteText.textContent = MEMORY_JAR_NOTES[memoryIdx % MEMORY_JAR_NOTES.length];
        memoryIdx++;
        popup.classList.add('active');
      });
    }

    if (closeBtn && popup) {
      closeBtn.addEventListener('click', () => {
        popup.classList.remove('active');
      });
    }

    // 4. Advance to Family Chapter
    const btnToFamily = document.getElementById('btn-to-family');
    if (btnToFamily) {
      btnToFamily.addEventListener('click', () => {
        if (window.BookStage) {
          window.BookStage.unlockChapter(3);
          window.BookStage.goToChapter(3, 'forward');
        }
      });
    }
  }

  return {
    init
  };
})();

if (typeof window !== 'undefined') {
  window.ChapterFriends = ChapterFriends;
}
