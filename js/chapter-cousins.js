/**
 * Birthday Storybook - Chapter 4: Cousins Air Mail Controller
 * Scattered vintage postcards, airmail envelopes of varied sizes, and interactive tap-to-unfold modal
 */

const ChapterCousins = (() => {
  let cousinsData = null;
  let activeCousinIndex = 0;

  function init() {
    if (window.ContentStore) {
      cousinsData = window.ContentStore.getChapter('cousins');
    }
    renderChapter();
  }

  function renderChapter() {
    const container = document.getElementById('chapter-4');
    if (!container) return;

    const entries = cousinsData?.entries || [
      {
        id: "cousin-aarav",
        name: "Aarav",
        doodle: "beach",
        tag: "Vacation Partner",
        caption: "Summer Goa Trip",
        stampColor: "#F4C2C7",
        placeholderColor: "#E8F4F8",
        letter: "Hey Lucky! Family reunions without you are just people sitting around awkwardly. Missing your chaos and dance energy. Get well soon, we have vacation plans to make! Happy belated birthday!"
      },
      {
        id: "cousin-simran",
        name: "Simran",
        doodle: "dance",
        tag: "Choreo Queen",
        caption: "Sangeet Practice",
        stampColor: "#CDB8E3",
        placeholderColor: "#FBE6D6",
        letter: "Happy Belated Birthday to my favorite dance buddy! Still waiting for you to teach me that routine. Wishing you radiant health and endless laughter this year. Love you tons!"
      },
      {
        id: "cousin-kabir",
        name: "Kabir",
        doodle: "pizza",
        tag: "Foodie Gang",
        caption: "Midnight Pizza Run",
        stampColor: "#F7E3A1",
        placeholderColor: "#FFF2D6",
        letter: "Lucky! Heard you missed the big birthday dinner because you were under the weather. That just means we owe you a double celebration. The next cake is on me! Get healthy fast."
      },
      {
        id: "cousin-diya",
        name: "Diya",
        doodle: "art",
        tag: "Art Connoisseur",
        caption: "Pottery Workshop",
        stampColor: "#B7C9A8",
        placeholderColor: "#E5EEF9",
        letter: "To the most creative soul in the family: sending you the biggest hugs across the miles! Never stop painting and shining your light. Happy belated birthday, Lucky beta!"
      }
    ];

    const tapes = ["washi-tape-pink", "washi-tape-lavender", "washi-tape-butter", "washi-tape-sage"];
    const scatterClasses = [
      "scatter-card-1",
      "scatter-card-2",
      "scatter-card-3",
      "scatter-card-4"
    ];

    container.innerHTML = `
      <div class="chapter-content-wrapper">
        <div class="washi-tape washi-tape-pink tape-corner-tr" style="width: 75px; height: 22px;"></div>

        <!-- Imperfection: Vintage paper clip impression away from text (Item 5) -->
        <div class="paper-clip-mark" aria-hidden="true"></div>

        <div class="chapter-header">
          <span class="diary-ribbon-header">Chapter 4 • Airmail from the Tribe</span>
          <h2 class="h2" style="margin-top: 6px;">Cousin Air Mail</h2>
          <p class="chapter-intro-note font-caption" style="color: var(--color-ink-muted);">Tap on any cousin's postcard to unfold their personal Air Mail letter.</p>
        </div>

        <!-- Scattered Postcards & Envelopes Layout (Organic, Not a Stiff 2x2 Grid) -->
        <div class="cousins-scatter-stage" id="cousins-scatter">
          ${entries.map((c, idx) => `
            <div class="cousin-postcard-item ${scatterClasses[idx % scatterClasses.length]}" data-index="${idx}" title="Tap to read ${c.name}'s Air Mail letter">
              <div class="washi-tape ${tapes[idx % tapes.length]} tape-corner-tr" style="width: 55px; height: 16px;"></div>
              
              <div class="cousin-postcard-top">
                <div class="postcard-stamp-mini" style="background-color: ${c.stampColor || '#F4C2C7'};">
                  <svg class="doodle-icon" style="width: 22px; height: 22px;"><use href="#doodle-${c.doodle || 'plane'}"/></svg>
                </div>
                <div class="postcard-postmark-mini">PAR AVION</div>
              </div>

              <!-- Hand-drawn Illustration / Snapshot Area -->
              <div class="cousin-photo-frame" style="background-color: ${c.placeholderColor || '#F5EBE1'};">
                <svg class="doodle-polaroid-art" style="width: 60px; height: 60px;"><use href="#doodle-${c.doodle || 'plane'}"/></svg>
              </div>

              <div class="cousin-card-info">
                <h3 class="cousin-name">${c.name}</h3>
                <span class="cousin-tag">${c.tag}</span>
                <span class="cousin-caption font-handwriting">"${c.caption}"</span>
              </div>

              <div class="cousin-airmail-badge">
                <svg class="doodle-icon" style="width: 16px; height: 16px; margin-right: 4px;"><use href="#doodle-plane"/></svg>
                <span>Open Letter</span>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Modal Overlay: Air Mail Letter -->
        <div class="airmail-modal-overlay" id="airmail-modal" aria-hidden="true">
          <div class="airmail-modal-card airmail-border" id="airmail-letter-content">
            <!-- Modal Header with Stamp and Postmark -->
            <div class="postcard-header">
              <div>
                <span class="font-heading" style="font-size: 1.15rem; color: var(--color-ink-light); letter-spacing: 1px;">AIR MAIL / PAR AVION</span>
                <p class="font-caption" style="color: var(--color-ink-muted);">Special Delivery • Priority Express</p>
              </div>

              <div style="position: relative;">
                <div class="postal-mark">OCT<br>16</div>
                <div class="postage-stamp" id="modal-stamp" style="background: var(--color-rose-light);">
                  <svg class="doodle-icon" id="modal-stamp-svg" style="width: 28px; height: 28px;"><use href="#doodle-plane"/></svg>
                </div>
              </div>
            </div>

            <!-- Recipient & Sender Banner -->
            <div class="airmail-banner">
              <div class="airmail-line">
                <span class="font-typewriter" style="font-size: 0.85rem; color: var(--color-ink-muted);">TO:</span>
                <span class="font-handwriting" style="font-size: 1.3rem; color: var(--color-ink); margin-left: 6px;">Kritika ("Lucky"), VIP Cousin Lounge</span>
              </div>
              <div class="airmail-line" style="margin-top: 4px;">
                <span class="font-typewriter" style="font-size: 0.85rem; color: var(--color-ink-muted);">FROM:</span>
                <span class="font-handwriting" style="font-size: 1.3rem; color: var(--color-rose-deep); margin-left: 6px;" id="modal-sender-name">Aarav (Vacation Partner)</span>
              </div>
            </div>

            <!-- Letter Body -->
            <div class="airmail-letter-sheet">
              <p class="postcard-letter-body" id="modal-letter-body">
                "Hey Lucky! Family reunions without you are just people sitting around awkwardly. Missing your chaos and dance energy. Get well soon, we have vacation plans to make! Happy belated birthday!"
              </p>
            </div>

            <div class="airmail-footer-row">
              <button class="btn-close-airmail" id="btn-close-airmail">
                Close Letter ✕
              </button>
              <span class="font-handwriting" style="font-size: 1.35rem; color: var(--color-rose-deep);" id="modal-signoff">
                - Love always, Aarav <svg class="doodle-heart-inline"><use href="#doodle-heart"/></svg>
              </span>
            </div>
          </div>
        </div>

        <!-- Advance Button to Chapter 5 (Friends) -->
        <div class="chapter-advance-row">
          <button class="btn-chapter-advance" id="btn-to-friends">
            Turn to The Friends Corkboard <svg class="doodle-arrow"><use href="#doodle-arrow-sketch"/></svg>
          </button>
        </div>
      </div>
    `;

    bindInteractions(entries);
  }

  function bindInteractions(entries) {
    const modal = document.getElementById('airmail-modal');
    const senderEl = document.getElementById('modal-sender-name');
    const letterEl = document.getElementById('modal-letter-body');
    const signoffEl = document.getElementById('modal-signoff');
    const stampEl = document.getElementById('modal-stamp');
    const stampSvgEl = document.getElementById('modal-stamp-svg');
    const closeBtn = document.getElementById('btn-close-airmail');

    function openModalForCousin(idx) {
      const cousin = entries[idx];
      if (!cousin || !modal) return;

      activeCousinIndex = idx;

      if (senderEl) senderEl.textContent = `${cousin.name} (${cousin.tag})`;
      if (letterEl) letterEl.textContent = `"${cousin.letter}"`;
      if (signoffEl) signoffEl.innerHTML = `- Love always, ${cousin.name} <svg class="doodle-heart-inline"><use href="#doodle-heart"/></svg>`;
      if (stampEl && cousin.stampColor) stampEl.style.background = cousin.stampColor;
      if (stampSvgEl) stampSvgEl.innerHTML = `<use href="#doodle-${cousin.doodle || 'plane'}"/>`;

      if (window.AudioEngine) {
        window.AudioEngine.playPaperRustle();
      }

      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');

      if (typeof gsap !== 'undefined') {
        const card = document.getElementById('airmail-letter-content');
        if (card) {
          gsap.fromTo(card,
            { scale: 0.8, y: 30, opacity: 0 },
            { scale: 1, y: 0, opacity: 1, duration: 0.4, ease: "back.out(1.5)" }
          );
        }
      }
    }

    function closeModal() {
      if (!modal) return;
      if (window.AudioEngine) {
        window.AudioEngine.playPaperRustle();
      }

      if (typeof gsap !== 'undefined') {
        const card = document.getElementById('airmail-letter-content');
        if (card) {
          gsap.to(card, {
            scale: 0.85,
            opacity: 0,
            duration: 0.25,
            ease: "power2.in",
            onComplete: () => {
              modal.classList.remove('active');
              modal.setAttribute('aria-hidden', 'true');
            }
          });
          return;
        }
      }

      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
    }

    // Attach click events on cousin cards
    const cards = document.querySelectorAll('.cousin-postcard-item');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        const idx = parseInt(card.dataset.index, 10);
        openModalForCousin(idx);
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', closeModal);
    }

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          closeModal();
        }
      });
    }

    // Advance button to Chapter 5 (Friends)
    const btnToFriends = document.getElementById('btn-to-friends');
    if (btnToFriends) {
      btnToFriends.addEventListener('click', () => {
        if (window.BookStage) {
          window.BookStage.unlockChapter(5);
          window.BookStage.goToChapter(5, 'forward');
        }
      });
    }
  }

  return {
    init
  };
})();

if (typeof window !== 'undefined') {
  window.ChapterCousins = ChapterCousins;
}
