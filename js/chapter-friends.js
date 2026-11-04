/**
 * Birthday Storybook - Chapter 5: Friends Corkboard Controller
 * Corkboard grid of 8 bestie Polaroids, centered lightbox with 3D flip, and floating paper slip memory jar
 */

const ChapterFriends = (() => {
  let friendsData = null;
  let memoryIndex = 0;
  let isJarAnimating = false;

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
    const memories = friendsData?.memoryJarNotes || [
      "Remember that time you tried teaching everyone that impossible dance choreo at midnight? Classic Lucky!",
      "The legendary 45-minute debate over whether chocolate truffle or red velvet reigns supreme!",
      "That spontaneous watercolor afternoon where more paint ended up on your elbows than the sketchbook!",
      "The emergency 2 AM chai run when everyone was exhausted but couldn't stop laughing!",
      "When you convinced everyone that wearing cozy fuzzy socks outside was 'high fashion'!"
    ];

    const tilts = [
      "tilt-neg-1", "tilt-pos-2", "tilt-neg-2", "tilt-pos-1",
      "tilt-neg-2", "tilt-pos-1", "tilt-neg-1", "tilt-pos-2"
    ];

    container.innerHTML = `
      <div class="chapter-content-wrapper">
        <div class="washi-tape washi-tape-sage tape-corner-tr" style="width: 75px; height: 22px;"></div>

        <!-- Imperfection: Pushpin hole and tape residue on cork frame (Item 5) -->
        <div class="cork-imperfection-mark" aria-hidden="true"></div>

        <div class="chapter-header">
          <span class="diary-ribbon-header">Chapter 5 • The Besties Corkboard</span>
          <h2 class="h2" style="margin-top: 6px;">${friendsData?.heading || "The Friends Corkboard"}</h2>
          <p class="chapter-intro-note font-caption" style="color: var(--color-ink-muted);">${friendsData?.intro || "Tap any photo to zoom in and read their note! (And don't miss the Memory Jar below)"}</p>
        </div>

        <!-- Real Corkboard Frame with Red String Overlay -->
        <div class="corkboard-frame-container">
          <!-- Subtle Red String connecting besties across board -->
          <svg class="cork-red-string-overlay" viewBox="0 0 500 700" preserveAspectRatio="none" aria-hidden="true">
            <path d="M120 100 Q 250 180, 380 120" stroke="#C8483F" stroke-width="2.2" fill="none" opacity="0.65" stroke-dasharray="4 2" />
            <path d="M380 120 Q 300 320, 130 360" stroke="#C8483F" stroke-width="2.2" fill="none" opacity="0.65" stroke-dasharray="4 2" />
            <path d="M130 360 Q 250 420, 370 520" stroke="#C8483F" stroke-width="2.2" fill="none" opacity="0.65" stroke-dasharray="4 2" />
          </svg>

          <!-- 8 Friends Polaroids Mounted with Pushpins -->
          <div class="friends-corkboard-canvas" id="friends-corkboard">
            ${entries.map((entry, idx) => `
              <div 
                class="friend-polaroid-card ${tilts[idx % tilts.length]} ${idx === 0 ? 'polaroid-interactive-hint' : ''}" 
                data-index="${idx}" 
                id="friend-card-${idx}" 
                title="Tap to zoom in on ${entry.from}'s note"
                role="button"
                tabindex="0"
                aria-label="${entry.from}'s photo card. Tap to enlarge and read message."
              >
                <svg class="cork-pushpin" aria-hidden="true"><use href="#doodle-pushpin"/></svg>
                
                <div class="friend-photo-frame" style="background-color: ${entry.placeholderColor || '#FCE4E8'}">
                  <svg class="doodle-polaroid-art" style="width: 68px; height: 68px;" aria-hidden="true">
                    <use href="#doodle-${entry.doodle || 'camera'}"/>
                  </svg>
                </div>
                
                <div class="friend-caption-block">
                  <span class="friend-from-name">${entry.from}</span>
                  <span class="friend-moment">"${entry.caption || entry.tag}"</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Centered Lightbox Modal for Focused & Enlarged Photocard with 3D Flip -->
        <div class="lightbox-modal-overlay" id="friend-lightbox" aria-hidden="true">
          <div class="lightbox-content-wrap">
            <div class="lightbox-polaroid-card" id="lightbox-card" role="button" tabindex="0" aria-label="Double-sided photo card. Tap or press enter to flip.">
              <div class="lightbox-card-inner" id="lightbox-card-inner">
                <!-- Front Side: Big Photo & Caption -->
                <div class="lightbox-face lightbox-front">
                  <div class="washi-tape washi-tape-pink tape-corner-tr" style="width: 75px; height: 20px;"></div>
                  <div class="lightbox-photo-large" id="lightbox-photo-bg">
                    <svg class="doodle-polaroid-art" style="width: 110px; height: 110px;" aria-hidden="true">
                      <use id="lightbox-doodle-use" href="#doodle-camera"/>
                    </svg>
                  </div>
                  <div class="lightbox-front-meta">
                    <h3 class="lightbox-name" id="lightbox-name">Ananya</h3>
                    <p class="lightbox-caption" id="lightbox-caption">"Late night giggles"</p>
                    <span class="lightbox-tag-badge" id="lightbox-tag">Bestie since day one</span>
                  </div>
                  <div class="lightbox-flip-prompt">Tap card to read note</div>
                </div>

                <!-- Back Side: Handwritten Message -->
                <div class="lightbox-face lightbox-back">
                  <div class="washi-tape washi-tape-butter tape-corner-tl" style="width: 75px; height: 20px;"></div>
                  <div class="lightbox-back-header">
                    <span class="font-handwriting" style="font-size: 1.4rem; color: var(--color-rose-deep);" id="lightbox-back-sender">From: Ananya</span>
                    <svg class="doodle-heart-inline" style="width: 22px; height: 22px;" aria-hidden="true"><use href="#doodle-heart"/></svg>
                  </div>
                  <div class="lightbox-back-message" id="lightbox-back-msg">
                    "Happy belated birthday Lucky! Missing our endless tea sessions and spontaneous dance breaks."
                  </div>
                  <div class="lightbox-flip-prompt" style="margin-top: auto;">Tap card to flip back</div>
                </div>
              </div>
            </div>

            <div class="lightbox-controls">
              <button class="btn-close-lightbox" id="btn-close-lightbox" aria-label="Close enlarged photo">
                Close Photo ✕
              </button>
            </div>
          </div>
        </div>

        <!-- Realistic Glass Memory Jar Section -->
        <div class="memory-jar-section">
          <div class="jar-header-ribbon">
            <span class="font-handwriting" style="font-size: 1.4rem; color: var(--color-ink);">Lucky's Memory Jar</span>
            <span class="font-caption" style="color: var(--color-ink-muted);">Tap the jar to draw a handwritten memory note</span>
          </div>

          <!-- Glass Jar Stage with Floating Paper Slip (Item 7) -->
          <div class="glass-jar-stage" id="glass-jar-trigger" role="button" tabindex="0" aria-label="Glass memory jar. Tap to draw a handwritten note." title="Tap the jar to draw a memory!">
            
            <!-- Animated Paper Slip that floats up gracefully from the jar (Item 7) -->
            <div class="floating-memory-slip" id="floating-slip" aria-hidden="true">
              <div class="folded-slip-inner">
                <svg class="doodle-icon" style="width: 20px; height: 20px; color: var(--color-rose);"><use href="#doodle-sparkle"/></svg>
              </div>
            </div>

            <!-- The Glass Mason Jar -->
            <div class="mason-jar-body">
              <div class="jar-cork-rim">
                <div class="cork-lid"></div>
                <div class="jar-glass-lip"></div>
                <div class="jar-neck-twine">
                  <div class="twine-string"></div>
                  <div class="twine-tag font-handwriting">Memories</div>
                </div>
              </div>

              <!-- Glass Vessel -->
              <div class="jar-glass-chamber">
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

              <div class="jar-base-shadow"></div>
            </div>

            <div class="jar-tap-callout font-caption" style="color: var(--color-rose-deep); font-weight: 700;">
              Tap the jar to draw a note
            </div>
          </div>

          <!-- Unfolded Memory Note Modal -->
          <div class="unfolded-memory-modal" id="unfolded-memory-modal" aria-hidden="true">
            <div class="unfolded-paper-note" id="unfolded-note-card">
              <div class="washi-tape washi-tape-lavender tape-corner-tr" style="width: 65px; height: 18px;"></div>
              
              <div class="memory-note-header">
                <span class="font-typewriter" style="font-size: 0.85rem; color: var(--color-ink-muted); letter-spacing: 1px;">FROM THE MEMORY JAR</span>
                <svg class="doodle-icon" style="width: 18px; height: 18px; color: var(--color-rose);" aria-hidden="true"><use href="#doodle-sparkle"/></svg>
              </div>

              <div class="memory-note-content font-handwriting" id="memory-note-display">
                "Remember that time you tried teaching everyone that impossible dance choreo at midnight? Classic Lucky!"
              </div>

              <div class="memory-note-footer">
                <button class="btn-fold-back" id="btn-fold-back">
                  Fold back into jar ✕
                </button>
                <button class="btn-next-memory" id="btn-next-memory">
                  Draw another note
                </button>
              </div>
            </div>
          </div>

        </div>

        <!-- Advance Button to Grand Finale (Chapter 6: Wish) -->
        <div class="chapter-advance-row" style="margin-top: 36px;">
          <button class="btn-chapter-advance" id="btn-to-finale">
            Turn to Make a Wish <svg class="doodle-arrow"><use href="#doodle-arrow-sketch"/></svg>
          </button>
        </div>

      </div>
    `;

    bindInteractions(entries, memories);
  }

  function bindInteractions(entries, memories) {
    const cards = document.querySelectorAll('.friend-polaroid-card');
    const lightbox = document.getElementById('friend-lightbox');
    const lightboxCard = document.getElementById('lightbox-card');
    const lightboxCardInner = document.getElementById('lightbox-card-inner');
    const closeBtn = document.getElementById('btn-close-lightbox');

    const nameEl = document.getElementById('lightbox-name');
    const captionEl = document.getElementById('lightbox-caption');
    const tagEl = document.getElementById('lightbox-tag');
    const senderEl = document.getElementById('lightbox-back-sender');
    const msgEl = document.getElementById('lightbox-back-msg');
    const photoBg = document.getElementById('lightbox-photo-bg');
    const doodleUse = document.getElementById('lightbox-doodle-use');

    let isFlipped = false;

    // Dismiss attention hint on first interaction (Item 6)
    function dismissHint() {
      const hintCard = document.querySelector('.polaroid-interactive-hint');
      if (hintCard) hintCard.classList.remove('polaroid-interactive-hint');
    }

    // 1. Open Lightbox on Polaroid Click
    cards.forEach(card => {
      function handleCardOpen() {
        dismissHint();
        const index = parseInt(card.dataset.index, 10);
        const data = entries[index];
        if (!data) return;

        if (nameEl) nameEl.textContent = data.from;
        if (captionEl) captionEl.textContent = `"${data.caption || data.tag}"`;
        if (tagEl) tagEl.textContent = data.tag || "Precious Friend";
        if (senderEl) senderEl.textContent = `From: ${data.from}`;
        if (msgEl) msgEl.textContent = `"${data.message || 'Happy birthday Lucky!'}"`;
        if (photoBg) photoBg.style.backgroundColor = data.placeholderColor || '#FCE4E8';
        if (doodleUse) doodleUse.setAttribute('href', `#doodle-${data.doodle || 'camera'}`);

        isFlipped = false;
        if (lightboxCardInner) lightboxCardInner.classList.remove('is-flipped');

        if (lightbox) {
          lightbox.classList.add('active');
          lightbox.setAttribute('aria-hidden', 'false');
        }

        if (window.AudioEngine) window.AudioEngine.playPaperRustle();
      }

      card.addEventListener('click', handleCardOpen);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardOpen();
        }
      });
      card.addEventListener('mouseenter', dismissHint, { once: true });
    });

    // 2. 3D Card Flip inside Lightbox
    function flipCard() {
      isFlipped = !isFlipped;
      if (lightboxCardInner) {
        lightboxCardInner.classList.toggle('is-flipped', isFlipped);
      }
      if (window.AudioEngine) window.AudioEngine.playPageTurn();
    }

    if (lightboxCard) {
      lightboxCard.addEventListener('click', flipCard);
      lightboxCard.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          flipCard();
        }
      });
    }

    // 3. Close Lightbox
    function closeLightbox() {
      if (!lightbox) return;
      lightbox.classList.remove('active');
      lightbox.setAttribute('aria-hidden', 'true');
      if (lightboxCardInner) lightboxCardInner.classList.remove('is-flipped');
      isFlipped = false;
      if (window.AudioEngine) window.AudioEngine.playPaperRustle();
    }

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (lightbox) {
      lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
      });
    }

    // 4. Memory Jar: Floating Paper Slip Interaction (Item 7)
    const jarTrigger = document.getElementById('glass-jar-trigger');
    const floatingSlip = document.getElementById('floating-slip');
    const memoryModal = document.getElementById('unfolded-memory-modal');
    const noteCard = document.getElementById('unfolded-note-card');
    const memoryDisplay = document.getElementById('memory-note-display');
    const foldBackBtn = document.getElementById('btn-fold-back');
    const nextMemoryBtn = document.getElementById('btn-next-memory');

    function triggerJarAndDrawNote() {
      if (isJarAnimating) return;
      isJarAnimating = true;

      if (window.AudioEngine) {
        window.AudioEngine.playPaperRustle();
      }

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // Animate floating slip out of jar
      if (floatingSlip && !prefersReducedMotion && typeof gsap !== 'undefined') {
        gsap.fromTo(floatingSlip,
          { y: 0, scale: 0.6, rotation: -4, opacity: 0 },
          { 
            y: -75, 
            scale: 1.15, 
            rotation: 12, 
            opacity: 1, 
            duration: 0.55, 
            ease: "power2.out",
            onComplete: () => {
              openMemoryModal();
              gsap.to(floatingSlip, { opacity: 0, duration: 0.2 });
            }
          }
        );
      } else {
        openMemoryModal();
      }
    }

    function openMemoryModal() {
      const note = memories[memoryIndex % memories.length];
      memoryIndex++;

      if (memoryDisplay) {
        memoryDisplay.textContent = `"${note}"`;
      }

      if (memoryModal) {
        memoryModal.classList.add('active');
        memoryModal.setAttribute('aria-hidden', 'false');

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (typeof gsap !== 'undefined' && noteCard && !prefersReducedMotion) {
          gsap.fromTo(noteCard,
            { scale: 0.4, y: 50, rotation: -4, opacity: 0 },
            { scale: 1, y: 0, rotation: 0, opacity: 1, duration: 0.45, ease: "back.out(1.4)" }
          );
        }
      }

      isJarAnimating = false;
    }

    function closeMemoryNote() {
      if (!memoryModal) return;
      if (window.AudioEngine) window.AudioEngine.playPaperRustle();

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (typeof gsap !== 'undefined' && noteCard && !prefersReducedMotion) {
        gsap.to(noteCard, {
          scale: 0.5,
          y: 35,
          opacity: 0,
          duration: 0.2,
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
      jarTrigger.addEventListener('click', triggerJarAndDrawNote);
      jarTrigger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          triggerJarAndDrawNote();
        }
      });
    }

    if (foldBackBtn) foldBackBtn.addEventListener('click', closeMemoryNote);
    if (nextMemoryBtn) {
      nextMemoryBtn.addEventListener('click', () => {
        closeMemoryNote();
        setTimeout(triggerJarAndDrawNote, 250);
      });
    }

    if (memoryModal) {
      memoryModal.addEventListener('click', (e) => {
        if (e.target === memoryModal) closeMemoryNote();
      });
    }

    // Global Esc key closes open modals (Item 14)
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (lightbox && lightbox.classList.contains('active')) closeLightbox();
        if (memoryModal && memoryModal.classList.contains('active')) closeMemoryNote();
      }
    });

    // Advance to Grand Finale (Chapter 6)
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
