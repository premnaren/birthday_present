/**
 * Birthday Storybook - Chapter 5: Friends Corkboard & Memory Jar Controller
 * 8 enlarged Polaroids, center-focus lightbox flip, realistic glass memory jar with animated hand reach
 */

const ChapterFriends = (() => {
  let friendsData = null;
  let memoryIndex = 0;
  let isHandAnimating = false;

  const DEFAULT_MEMORIES = [
    "Remember that time you tried teaching everyone that impossible dance choreo at midnight? Classic Lucky! 💃😂",
    "The legendary 45-minute debate over whether chocolate truffle or red velvet reigns supreme! 🍰✨",
    "That spontaneous watercolor afternoon where more paint ended up on your elbows than the sketchbook! 🎨💖",
    "The emergency 2 AM chai run when everyone was exhausted but couldn't stop laughing! ☕🌙",
    "When you convinced everyone that wearing cozy fuzzy socks outside was 'high fashion'! 🧦✨"
  ];

  function init() {
    if (window.ContentStore) {
      friendsData = window.ContentStore.getChapter('friends');
    }
    renderChapter();
  }

  function renderChapter() {
    const container = document.getElementById('chapter-5');
    if (!container) return;

    const entries = friendsData?.entries || [];
    const memories = friendsData?.memoryJarNotes || DEFAULT_MEMORIES;

    const tapes = ["washi-tape-pink", "washi-tape-sage", "washi-tape-butter", "washi-tape-lavender"];
    const tilts = ["tilt-neg-2", "tilt-pos-2", "tilt-neg-1", "tilt-pos-3", "tilt-neg-2", "tilt-pos-1", "tilt-neg-1", "tilt-pos-2"];

    container.innerHTML = `
      <div class="chapter-content-wrapper">
        <div class="washi-tape washi-tape-sage tape-center"></div>

        <div class="chapter-header">
          <span class="diary-ribbon-header">Chapter 5 ✦ The Besties Corkboard</span>
          <h2 class="h2">${friendsData?.heading || "The Friends Corkboard"}</h2>
          <p class="chapter-intro-note">${friendsData?.intro || "Tap any photo to zoom in and read their note! (And don't miss the Memory Jar 🫙)"}</p>
        </div>

        <!-- 8 Friends Polaroids on Corkboard -->
        <div class="friends-corkboard-canvas" id="friends-corkboard">
          ${entries.map((entry, idx) => `
            <div class="friend-polaroid-card ${tilts[idx % tilts.length]}" data-index="${idx}" id="friend-card-${idx}" title="Tap to zoom in on ${entry.from}'s note">
              <div class="washi-tape ${tapes[idx % tapes.length]} tape-center" style="width: 65px; height: 18px;"></div>
              
              <div class="friend-photo-frame" style="background-color: ${entry.placeholderColor || '#FCE4E8'}">
                <span class="friend-avatar-art">${entry.avatar || '📸'}</span>
              </div>
              
              <div class="friend-caption-block">
                <span class="friend-from-name font-handwriting">${entry.from}</span>
                <span class="friend-moment font-caption">"${entry.caption || entry.tag}"</span>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Centered Lightbox Modal for Focused & Enlarged Photocard with 3D Flip -->
        <div class="lightbox-modal-overlay" id="friend-lightbox" aria-hidden="true">
          <div class="lightbox-content-wrap">
            <div class="lightbox-polaroid-card" id="lightbox-card">
              <div class="lightbox-card-inner" id="lightbox-card-inner">
                <!-- Front Side: Big Photo & Caption -->
                <div class="lightbox-face lightbox-front">
                  <div class="washi-tape washi-tape-pink tape-center" style="width: 80px; height: 22px;"></div>
                  <div class="lightbox-photo-large" id="lightbox-photo-bg">
                    <span id="lightbox-avatar-large" style="font-size: 4.5rem;">📸</span>
                  </div>
                  <div class="lightbox-front-meta">
                    <h3 class="lightbox-name" id="lightbox-name">Ananya</h3>
                    <p class="lightbox-caption" id="lightbox-caption">"Late night giggles"</p>
                    <span class="lightbox-tag-badge" id="lightbox-tag">Bestie since day one</span>
                  </div>
                  <div class="lightbox-flip-prompt">Tap card to read note ↺</div>
                </div>

                <!-- Back Side: Handwritten Message -->
                <div class="lightbox-face lightbox-back">
                  <div class="washi-tape washi-tape-butter tape-center" style="width: 80px; height: 22px;"></div>
                  <div class="lightbox-back-header">
                    <span class="font-handwriting" style="font-size: 1.4rem; color: var(--color-rose-deep);" id="lightbox-back-sender">From: Ananya</span>
                    <span style="font-size: 1.3rem;">💌</span>
                  </div>
                  <div class="lightbox-back-message" id="lightbox-back-msg">
                    "Happy belated birthday Lucky! Missing our endless tea sessions and spontaneous dance breaks."
                  </div>
                  <div class="lightbox-flip-prompt" style="margin-top: auto;">Tap card to flip back ↺</div>
                </div>
              </div>
            </div>

            <div class="lightbox-controls">
              <button class="btn-close-lightbox" id="btn-close-lightbox">
                Close Photo ✕
              </button>
            </div>
          </div>
        </div>

        <!-- Realistic Glass Memory Jar Section -->
        <div class="memory-jar-section">
          <div class="jar-header-ribbon">
            <span class="font-handwriting" style="font-size: 1.35rem; color: var(--color-ink);">Lucky's Memory Jar</span>
            <span class="font-caption" style="color: var(--color-ink-muted);">Tap the jar to draw a paper note!</span>
          </div>

          <!-- Illustrated Glass Jar Stage with Reaching Hand -->
          <div class="glass-jar-stage" id="glass-jar-trigger" title="Tap the jar to draw a memory!">
            
            <!-- Animated Hand (Reaches into jar on click) -->
            <div class="animated-reaching-hand" id="animated-hand" aria-hidden="true">
              <!-- Illustrated SVG Hand reaching down -->
              <svg viewBox="0 0 100 160" class="hand-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
                <!-- Arm / Sleeve -->
                <path d="M35 0 L65 0 L68 70 L32 70 Z" fill="#F4C2C7" stroke="#3A2F32" stroke-width="2.5" />
                <!-- Wrist cuff -->
                <ellipse cx="50" cy="70" rx="18" ry="6" fill="#FFFDF8" stroke="#3A2F32" stroke-width="2" />
                <!-- Hand Palm & Fingers reaching down -->
                <path d="M36 73 C36 85, 34 100, 38 115 C40 122, 48 126, 48 135 C48 142, 45 152, 47 155 C49 158, 55 156, 56 148 C58 140, 60 134, 62 125 C64 116, 66 95, 64 73 Z" fill="#FFE2D1" stroke="#3A2F32" stroke-width="2.5" />
                <!-- Folded Paper Note held by hand -->
                <rect x="42" y="140" width="16" height="22" rx="2" fill="#FFF9D2" stroke="#D98A9B" stroke-width="1.8" transform="rotate(8 45 145)" id="hand-held-note" />
              </svg>
            </div>

            <!-- The Glass Mason Jar -->
            <div class="mason-jar-body">
              <!-- Jar Mouth & Cork / Rim -->
              <div class="jar-cork-rim">
                <div class="cork-lid"></div>
                <div class="jar-glass-lip"></div>
                <div class="jar-neck-twine">
                  <div class="twine-string"></div>
                  <div class="twine-tag font-handwriting">Memories ✨</div>
                </div>
              </div>

              <!-- Glass Vessel -->
              <div class="jar-glass-chamber">
                <!-- Glossy Glass Highlights -->
                <div class="glass-shine-left"></div>
                <div class="glass-shine-right"></div>

                <!-- Paper Slips Sitting Inside the Jar -->
                <div class="jar-paper-slips">
                  <div class="paper-slip slip-1"></div>
                  <div class="paper-slip slip-2"></div>
                  <div class="paper-slip slip-3"></div>
                  <div class="paper-slip slip-4"></div>
                  <div class="paper-slip slip-5"></div>
                  <div class="paper-slip slip-6"></div>
                </div>
              </div>

              <!-- Glass Base Reflection -->
              <div class="jar-base-shadow"></div>
            </div>

            <div class="jar-tap-callout">
              <span class="tap-finger">👆</span> Tap the jar to pick a note!
            </div>
          </div>

          <!-- Unfolded Memory Note Modal -->
          <div class="unfolded-memory-modal" id="unfolded-memory-modal" aria-hidden="true">
            <div class="unfolded-paper-note" id="unfolded-note-card">
              <div class="washi-tape washi-tape-lavender tape-center" style="width: 70px; height: 18px;"></div>
              
              <div class="memory-note-header">
                <span class="font-typewriter" style="font-size: 0.85rem; color: var(--color-ink-muted);">FROM THE MEMORY JAR 🫙</span>
                <span style="font-size: 1.2rem;">✨</span>
              </div>

              <div class="memory-note-content font-handwriting" id="memory-note-display">
                "Remember that time you tried teaching everyone that impossible dance choreo at midnight? Classic Lucky! 💃😂"
              </div>

              <div class="memory-note-footer">
                <button class="btn-fold-back" id="btn-fold-back">
                  Fold back into jar ✕
                </button>
                <button class="btn-next-memory" id="btn-next-memory">
                  Draw another note 🫙
                </button>
              </div>
            </div>
          </div>

        </div>

        <!-- Advance Button to Grand Finale (Chapter 6: Wish) -->
        <div class="chapter-advance-row" style="margin-top: 36px;">
          <button class="btn-chapter-advance" id="btn-to-finale" style="background: linear-gradient(135deg, #C8483F, #D98A9B);">
            Head to the Finale: Make a Wish! 🎂 <span aria-hidden="true">→</span>
          </button>
        </div>

      </div>
    `;

    bindInteractions(entries, memories);
  }

  function bindInteractions(entries, memories) {
    // 1. Center-focus Lightbox for Photocards
    const lightbox = document.getElementById('friend-lightbox');
    const lightboxCard = document.getElementById('lightbox-card');
    const lightboxInner = document.getElementById('lightbox-card-inner');
    const bgLarge = document.getElementById('lightbox-photo-bg');
    const avatarLarge = document.getElementById('lightbox-avatar-large');
    const nameEl = document.getElementById('lightbox-name');
    const captionEl = document.getElementById('lightbox-caption');
    const tagEl = document.getElementById('lightbox-tag');
    const backSenderEl = document.getElementById('lightbox-back-sender');
    const backMsgEl = document.getElementById('lightbox-back-msg');
    const closeLightboxBtn = document.getElementById('btn-close-lightbox');

    function openLightbox(idx) {
      const entry = entries[idx];
      if (!entry || !lightbox) return;

      if (window.AudioEngine) window.AudioEngine.playPaperRustle();

      if (lightboxInner) lightboxInner.classList.remove('is-flipped');
      if (bgLarge) bgLarge.style.backgroundColor = entry.placeholderColor || '#FCE4E8';
      if (avatarLarge) avatarLarge.textContent = entry.avatar || '📸';
      if (nameEl) nameEl.textContent = entry.from;
      if (captionEl) captionEl.textContent = `"${entry.caption || entry.from}"`;
      if (tagEl) tagEl.textContent = entry.tag || "Bestie";
      if (backSenderEl) backSenderEl.textContent = `From: ${entry.from}`;
      if (backMsgEl) backMsgEl.textContent = `"${entry.message}"`;

      lightbox.classList.add('active');
      lightbox.setAttribute('aria-hidden', 'false');

      if (typeof gsap !== 'undefined' && lightboxCard) {
        gsap.fromTo(lightboxCard,
          { scale: 0.6, y: 50, opacity: 0 },
          { scale: 1, y: 0, opacity: 1, duration: 0.45, ease: "back.out(1.4)" }
        );
      }
    }

    function closeLightbox() {
      if (!lightbox) return;
      if (window.AudioEngine) window.AudioEngine.playPaperRustle();

      if (typeof gsap !== 'undefined' && lightboxCard) {
        gsap.to(lightboxCard, {
          scale: 0.7,
          opacity: 0,
          duration: 0.25,
          ease: "power2.in",
          onComplete: () => {
            lightbox.classList.remove('active');
            lightbox.setAttribute('aria-hidden', 'true');
          }
        });
        return;
      }

      lightbox.classList.remove('active');
      lightbox.setAttribute('aria-hidden', 'true');
    }

    // Attach click events on corkboard photocard items
    const cards = document.querySelectorAll('.friend-polaroid-card');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        const idx = parseInt(card.dataset.index, 10);
        openLightbox(idx);
      });
    });

    // Tap to flip inside lightbox
    if (lightboxCard) {
      lightboxCard.addEventListener('click', (e) => {
        if (e.target.closest('#btn-close-lightbox')) return;
        if (lightboxInner) {
          if (window.AudioEngine) window.AudioEngine.playPaperRustle();
          lightboxInner.classList.toggle('is-flipped');
        }
      });
    }

    if (closeLightboxBtn) {
      closeLightboxBtn.addEventListener('click', closeLightbox);
    }

    if (lightbox) {
      lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
          closeLightbox();
        }
      });
    }

    // 2. Glass Jar & Hand Animation
    const jarTrigger = document.getElementById('glass-jar-trigger');
    const hand = document.getElementById('animated-hand');
    const memoryModal = document.getElementById('unfolded-memory-modal');
    const memoryDisplay = document.getElementById('memory-note-display');
    const noteCard = document.getElementById('unfolded-note-card');
    const foldBackBtn = document.getElementById('btn-fold-back');
    const nextMemoryBtn = document.getElementById('btn-next-memory');

    function triggerHandAndDrawNote() {
      if (isHandAnimating) return;
      isHandAnimating = true;

      if (window.AudioEngine) {
        window.AudioEngine.playStickerPop();
      }

      // Hand reaching animation
      if (hand) {
        hand.classList.remove('hand-reach-active');
        void hand.offsetWidth; // reflow
        hand.classList.add('hand-reach-active');
      }

      // After hand reaches down and pulls up (approx 650ms), reveal the unfolded note!
      setTimeout(() => {
        if (window.AudioEngine) {
          window.AudioEngine.playPaperRustle();
        }

        const note = memories[memoryIndex % memories.length];
        memoryIndex++;

        if (memoryDisplay) {
          memoryDisplay.textContent = `"${note}"`;
        }

        if (memoryModal) {
          memoryModal.classList.add('active');
          memoryModal.setAttribute('aria-hidden', 'false');

          if (typeof gsap !== 'undefined' && noteCard) {
            gsap.fromTo(noteCard,
              { scale: 0.4, y: 60, rotation: -6, opacity: 0 },
              { scale: 1, y: 0, rotation: 0, opacity: 1, duration: 0.5, ease: "back.out(1.5)" }
            );
          }
        }

        setTimeout(() => {
          if (hand) hand.classList.remove('hand-reach-active');
          isHandAnimating = false;
        }, 300);

      }, 650);
    }

    function closeMemoryNote() {
      if (!memoryModal) return;
      if (window.AudioEngine) window.AudioEngine.playPaperRustle();

      if (typeof gsap !== 'undefined' && noteCard) {
        gsap.to(noteCard, {
          scale: 0.5,
          y: 40,
          opacity: 0,
          duration: 0.25,
          ease: "power2.in",
          onComplete: () => {
            memoryModal.classList.remove('active');
            memoryModal.setAttribute('aria-hidden', 'true');
          }
        });
        return;
      }

      memoryModal.classList.remove('active');
      memoryModal.setAttribute('aria-hidden', 'true');
    }

    if (jarTrigger) {
      jarTrigger.addEventListener('click', triggerHandAndDrawNote);
    }

    if (foldBackBtn) {
      foldBackBtn.addEventListener('click', closeMemoryNote);
    }

    if (nextMemoryBtn) {
      nextMemoryBtn.addEventListener('click', () => {
        closeMemoryNote();
        setTimeout(triggerHandAndDrawNote, 300);
      });
    }

    if (memoryModal) {
      memoryModal.addEventListener('click', (e) => {
        if (e.target === memoryModal) {
          closeMemoryNote();
        }
      });
    }

    // 3. Advance to Grand Finale (Chapter 6)
    const btnToFinale = document.getElementById('btn-to-finale');
    if (btnToFinale) {
      btnToFinale.addEventListener('click', () => {
        if (window.BookStage) {
          window.BookStage.unlockChapter(6);
          window.BookStage.goToChapter(6, 'forward');
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
