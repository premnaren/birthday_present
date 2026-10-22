/**
 * Birthday Storybook - Book Stage & Navigation Engine
 * Orchestrates chapter transitions, bookmark tabs, touch gestures, and unlock progression
 */

const BookStage = (() => {
  const CHAPTERS = [
    { id: "gate", index: 0, title: "Cover", label: "Cover Gate" },
    { id: "guess", index: 1, title: "Guesses", label: "Let Me Guess" },
    { id: "parents", index: 2, title: "Parents", label: "Mom & Daddy" },
    { id: "og_opp", index: 3, title: "OG Opp", label: "The OG Opp" },
    { id: "cousins", index: 4, title: "Cousins", label: "Cousin Air Mail" },
    { id: "friends", index: 5, title: "Friends", label: "Friends Corkboard" },
    { id: "finale", index: 6, title: "Make a Wish", label: "Make a Wish" }
  ];

  let currentIndex = 0;
  let maxUnlockedIndex = 0;
  let isAnimating = false;

  const STORAGE_KEY = 'storybook_unlocked_index';

  function init() {
    // Restore unlock progress from session storage (default 0)
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved !== null) {
      maxUnlockedIndex = parseInt(saved, 10);
    } else {
      maxUnlockedIndex = 0; // Starts at gate
    }

    renderTabs();
    bindEvents();
    updateNavControls();
  }

  function renderTabs() {
    const tabsContainer = document.getElementById('chapter-tabs');
    if (!tabsContainer) return;

    tabsContainer.innerHTML = '';

    CHAPTERS.forEach((ch, idx) => {
      const tab = document.createElement('button');
      tab.className = `chapter-tab ${idx === currentIndex ? 'active' : ''} ${idx > maxUnlockedIndex ? 'locked' : ''}`;
      tab.textContent = idx <= maxUnlockedIndex ? ch.title : '';
      tab.setAttribute('data-index', idx);
      tab.setAttribute('aria-label', idx <= maxUnlockedIndex ? ch.label : 'Locked Chapter');

      tab.addEventListener('click', () => {
        if (idx <= maxUnlockedIndex && idx !== currentIndex) {
          goToChapter(idx, idx > currentIndex ? 'forward' : 'backward');
        }
      });

      tabsContainer.appendChild(tab);
    });
  }

  function bindEvents() {
    // Navigation buttons
    const btnPrev = document.getElementById('btn-prev-page');
    const btnNext = document.getElementById('btn-next-page');

    if (btnPrev) {
      btnPrev.addEventListener('click', () => {
        if (currentIndex > 0) {
          goToChapter(currentIndex - 1, 'backward');
        }
      });
    }

    if (btnNext) {
      btnNext.addEventListener('click', () => {
        if (currentIndex < maxUnlockedIndex && currentIndex < CHAPTERS.length - 1) {
          goToChapter(currentIndex + 1, 'forward');
        }
      });
    }

    // Keyboard navigation
    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' && currentIndex < maxUnlockedIndex) {
        goToChapter(currentIndex + 1, 'forward');
      } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        goToChapter(currentIndex - 1, 'backward');
      }
    });

    // Touch Swipe Navigation for Mobile
    let touchStartX = 0;
    let touchStartY = 0;
    const viewport = document.getElementById('page-viewport');

    if (viewport) {
      viewport.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
      }, { passive: true });

      viewport.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].screenX;
        const touchEndY = e.changedTouches[0].screenY;
        const diffX = touchEndX - touchStartX;
        const diffY = touchEndY - touchStartY;

        // Ensure horizontal swipe dominates vertical scroll
        if (Math.abs(diffX) > 60 && Math.abs(diffX) > Math.abs(diffY)) {
          if (diffX < 0 && currentIndex < maxUnlockedIndex) {
            goToChapter(currentIndex + 1, 'forward');
          } else if (diffX > 0 && currentIndex > 0) {
            goToChapter(currentIndex - 1, 'backward');
          }
        }
      }, { passive: true });
    }

    // Bookmark tail interaction
    const tail = document.getElementById('bookmark-tail');
    if (tail) {
      tail.addEventListener('click', () => {
        if (window.AudioEngine) window.AudioEngine.playStickerPop();
        const tabs = document.getElementById('chapter-tabs');
        if (tabs) {
          tabs.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      });
    }
  }

  function goToChapter(targetIndex, direction = 'forward') {
    if (isAnimating || targetIndex === currentIndex) return;
    if (targetIndex < 0 || targetIndex >= CHAPTERS.length) return;
    if (targetIndex > maxUnlockedIndex) return;

    isAnimating = true;

    const currentSlide = document.getElementById(`chapter-${currentIndex}`);
    const nextSlide = document.getElementById(`chapter-${targetIndex}`);

    if (window.AudioEngine) {
      window.AudioEngine.playPageTurn();
    }

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || typeof gsap === 'undefined') {
      if (currentSlide) currentSlide.classList.remove('active-chapter');
      if (nextSlide) nextSlide.classList.add('active-chapter');
      currentIndex = targetIndex;
      updateNavControls();
      renderTabs();
      isAnimating = false;
      return;
    }

    // Tactile GSAP Page Transition
    const xOffsetOut = direction === 'forward' ? -50 : 50;
    const xOffsetIn = direction === 'forward' ? 50 : -50;
    const rotateOut = direction === 'forward' ? -2 : 2;
    const rotateIn = direction === 'forward' ? 2 : -2;

    const tl = gsap.timeline({
      onComplete: () => {
        if (currentSlide) {
          currentSlide.classList.remove('active-chapter');
          gsap.set(currentSlide, { clearProps: "all" });
        }
        if (nextSlide) {
          nextSlide.classList.add('active-chapter');
          gsap.set(nextSlide, { clearProps: "all" });
        }
        currentIndex = targetIndex;
        if (window.PassportStamps) {
          window.PassportStamps.awardStamp(targetIndex);
        }
        updateNavControls();
        renderTabs();
        isAnimating = false;
      }
    });

    if (currentSlide) {
      tl.to(currentSlide, {
        x: xOffsetOut,
        rotation: rotateOut,
        opacity: 0,
        duration: 0.35,
        ease: "power2.in"
      });
    }

    if (nextSlide) {
      nextSlide.classList.add('active-chapter');
      tl.fromTo(nextSlide, 
        { x: xOffsetIn, rotation: rotateIn, opacity: 0 },
        { x: 0, rotation: 0, opacity: 1, duration: 0.45, ease: "power2.out" },
        "-=0.1"
      );
    }
  }

  function unlockChapter(index) {
    if (index > maxUnlockedIndex && index < CHAPTERS.length) {
      maxUnlockedIndex = index;
      sessionStorage.setItem(STORAGE_KEY, maxUnlockedIndex);
      renderTabs();
      updateNavControls();
    }
  }

  function updateNavControls() {
    const btnPrev = document.getElementById('btn-prev-page');
    const btnNext = document.getElementById('btn-next-page');
    const counter = document.getElementById('page-counter');

    if (btnPrev) {
      btnPrev.disabled = (currentIndex === 0);
    }

    if (btnNext) {
      // Next is disabled if we are at the end OR if next chapter is locked
      btnNext.disabled = (currentIndex >= CHAPTERS.length - 1 || currentIndex >= maxUnlockedIndex);
    }

    if (counter) {
      const cur = CHAPTERS[currentIndex];
      if (currentIndex === 0) {
        counter.textContent = "Cover";
      } else {
        counter.textContent = `${cur.title} (${currentIndex}/${CHAPTERS.length - 1})`;
      }
    }
  }

  return {
    init,
    goToChapter,
    unlockChapter,
    getCurrentIndex: () => currentIndex,
    getMaxUnlockedIndex: () => maxUnlockedIndex,
    getChapters: () => CHAPTERS
  };
})();

if (typeof window !== 'undefined') {
  window.BookStage = BookStage;
}
