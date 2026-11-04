/**
 * Birthday Storybook - Dotted Cursor Trail Animation (Desktop Only)
 * Recreates the vibrant rose-pink dotted ribbon trail that gracefully
 * tapers and fades along the cursor path.
 */

(function () {
  'use strict';

  // Configuration tuned to match the uploaded reference image
  const CONFIG = {
    colorRGB: '255, 84, 149',     // Vibrant rose/magenta from reference image
    dotSpacing: 15,               // Distance in pixels between dots along the path
    baseRadius: 5.5,              // Initial radius of new dots at cursor head
    hoverRadius: 7.2,             // Slightly enlarged radius when hovering interactive elements
    initialAlpha: 0.95,           // Starting opacity of newest dots
    lifeTimeMs: 900,              // Duration before dot completely fades and shrinks away
    maxDots: 350,                 // Safety cap for performance
    clickBurstCount: 7            // Number of micro-dots spawned on desktop click
  };

  let canvas = null;
  let ctx = null;
  let dots = [];
  let animFrameId = null;
  let isRunning = false;
  let lastPos = null;
  let isHoveringInteractive = false;
  let isDesktopActive = false;

  /**
   * Determine if device is true desktop (mouse pointer + viewport >= 768px + no reduced motion)
   */
  function isDesktopEnvironment() {
    const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const isWideEnough = window.innerWidth >= 768;
    const motionOk = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return isWideEnough && hasFinePointer && motionOk;
  }

  /**
   * Adjust canvas resolution for retina displays
   */
  function resizeCanvas() {
    if (!canvas || !ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;

    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
  }

  /**
   * Spawn a new dot at a specific point
   */
  function spawnDot(x, y, customRadius = null, customLife = null, velX = 0, velY = 0) {
    if (dots.length >= CONFIG.maxDots) {
      dots.shift();
    }

    const radius = customRadius !== null
      ? customRadius
      : (isHoveringInteractive ? CONFIG.hoverRadius : CONFIG.baseRadius);

    dots.push({
      x: x,
      y: y,
      vx: velX,
      vy: velY,
      born: performance.now(),
      life: customLife || CONFIG.lifeTimeMs,
      initialRadius: radius,
      initialAlpha: CONFIG.initialAlpha
    });

    startAnimationLoop();
  }

  /**
   * Handle mouse movements: interpolates dots at regular spacing along the path
   */
  function onMouseMove(e) {
    if (!isDesktopActive) return;

    const curX = e.clientX;
    const curY = e.clientY;

    if (!lastPos) {
      lastPos = { x: curX, y: curY };
      spawnDot(curX, curY);
      return;
    }

    const dx = curX - lastPos.x;
    const dy = curY - lastPos.y;
    const dist = Math.hypot(dx, dy);

    if (dist >= CONFIG.dotSpacing) {
      const steps = Math.floor(dist / CONFIG.dotSpacing);
      for (let i = 1; i <= steps; i++) {
        const t = i / steps;
        const px = lastPos.x + dx * t;
        const py = lastPos.y + dy * t;
        spawnDot(px, py);
      }
      lastPos = { x: curX, y: curY };
    }
  }

  /**
   * Check if cursor is over interactive elements to adjust dot size
   */
  function onMouseOver(e) {
    if (!isDesktopActive) return;
    const target = e.target;
    if (target && target.closest('button, a, input, select, textarea, [role="button"], .interactive-seal, .candle-unit, .polaroid-item, .postcard-card, .bookmark-tail, .sticker-tray-toggle-btn')) {
      isHoveringInteractive = true;
    } else {
      isHoveringInteractive = false;
    }
  }

  /**
   * Subtle click burst: emits a cluster of micro dots on mouse click
   */
  function onMouseClick(e) {
    if (!isDesktopActive) return;
    const count = CONFIG.clickBurstCount;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const speed = 0.8 + Math.random() * 0.9;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      spawnDot(e.clientX, e.clientY, 4.0, 500, vx, vy);
    }
  }

  function onMouseLeave() {
    lastPos = null;
  }

  /**
   * Main render loop
   */
  function render(now) {
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    let activeCount = 0;

    for (let i = dots.length - 1; i >= 0; i--) {
      const dot = dots[i];
      const age = now - dot.born;

      if (age >= dot.life) {
        dots.splice(i, 1);
        continue;
      }

      activeCount++;
      const progress = age / dot.life; // 0 to 1

      // Taper radius: largest when fresh, smoothly shrinks down to ~0.5px
      const radius = Math.max(0.4, dot.initialRadius * (1 - Math.pow(progress, 0.72)));

      // Taper opacity: highest when fresh, fades to 0
      const alpha = Math.max(0, dot.initialAlpha * (1 - progress));

      // Apply subtle burst velocity if present
      if (dot.vx || dot.vy) {
        dot.x += dot.vx;
        dot.y += dot.vy;
        dot.vx *= 0.96;
        dot.vy *= 0.96;
      }

      // Draw crisp filled circle
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${CONFIG.colorRGB}, ${alpha.toFixed(3)})`;
      ctx.fill();
    }

    if (activeCount > 0 && isDesktopActive) {
      animFrameId = requestAnimationFrame(render);
    } else {
      isRunning = false;
      animFrameId = null;
    }
  }

  function startAnimationLoop() {
    if (!isRunning && isDesktopActive) {
      isRunning = true;
      animFrameId = requestAnimationFrame(render);
    }
  }

  /**
   * Sync active state on window resize or media query change
   */
  function evaluateEnvironment() {
    const shouldBeActive = isDesktopEnvironment();

    if (shouldBeActive && !isDesktopActive) {
      isDesktopActive = true;
      if (canvas) {
        canvas.style.display = 'block';
        resizeCanvas();
      }
      attachEvents();
    } else if (!shouldBeActive && isDesktopActive) {
      isDesktopActive = false;
      dots = [];
      lastPos = null;
      if (ctx) {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      }
      if (canvas) {
        canvas.style.display = 'none';
      }
      detachEvents();
      if (animFrameId) {
        cancelAnimationFrame(animFrameId);
        animFrameId = null;
      }
      isRunning = false;
    }
  }

  function attachEvents() {
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseover', onMouseOver, { passive: true });
    window.addEventListener('mousedown', onMouseClick, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave, { passive: true });
  }

  function detachEvents() {
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseover', onMouseOver);
    window.removeEventListener('mousedown', onMouseClick);
    document.removeEventListener('mouseleave', onMouseLeave);
  }

  /**
   * Initialize module
   */
  function init() {
    canvas = document.getElementById('cursor-trail-canvas');

    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'cursor-trail-canvas';
      canvas.setAttribute('aria-hidden', 'true');
      document.body.appendChild(canvas);
    }

    ctx = canvas.getContext('2d');

    window.addEventListener('resize', () => {
      evaluateEnvironment();
      if (isDesktopActive) {
        resizeCanvas();
      }
    }, { passive: true });

    // Suppress if touch interaction is detected
    window.addEventListener('touchstart', () => {
      if (isDesktopActive) {
        dots = [];
        lastPos = null;
      }
    }, { passive: true });

    evaluateEnvironment();
    console.log("✨ Dotted Cursor Trail initialized. Desktop active:", isDesktopActive);
  }

  window.CursorTrail = {
    init: init,
    isDesktopActive: () => isDesktopActive
  };

  // Auto-init if DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

