/**
 * Birthday Storybook - Ambient Audio & Tactile SFX Engine
 * Soft lofi music-box procedural synthesis + paper tactile sound effects
 * Muted by default with user consent toggle
 */

const AudioEngine = (() => {
  let audioCtx = null;
  let isMuted = true;
  let isMusicPlaying = false;
  let musicTimer = null;
  let masterGain = null;

  // Lofi / Music-box chords (pentatonic peaceful frequencies in Hz)
  const musicBoxNotes = [
    261.63, // C4
    293.66, // D4
    329.63, // E4
    392.00, // G4
    440.00, // A4
    523.25, // C5
    587.33, // D5
    659.25  // E5
  ];

  // Soft melodies sequence
  const melodies = [
    [0, 2, 4, 2],
    [3, 4, 5, 4],
    [2, 0, 1, 0],
    [4, 2, 0, 2]
  ];
  let melodyIdx = 0;
  let noteIdx = 0;

  function initContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return null;
      audioCtx = new AudioContextClass();
      masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(0.6, audioCtx.currentTime);
      masterGain.connect(audioCtx.destination);
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  /**
   * Synthesize a single gentle music-box note
   */
  function playMusicBoxNote(freq, timeOffset = 0, duration = 1.6) {
    if (isMuted || !audioCtx) return;

    try {
      const now = audioCtx.currentTime + timeOffset;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      // Sine wave with soft harmonic
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      // Music-box bell envelope (instant soft attack, exponential fade)
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.12, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start(now);
      osc.stop(now + duration + 0.1);
    } catch (e) {
      console.warn("Audio note failed", e);
    }
  }

  /**
   * Loop peaceful music-box arpeggio
   */
  function startMusicLoop() {
    if (musicTimer) clearInterval(musicTimer);
    isMusicPlaying = true;

    function step() {
      if (isMuted) return;
      const currentMelody = melodies[melodyIdx % melodies.length];
      const noteOffset = currentMelody[noteIdx % currentMelody.length];
      const freq = musicBoxNotes[noteOffset];

      playMusicBoxNote(freq, 0, 1.8);
      // Optional soft bass root on first beat
      if (noteIdx % currentMelody.length === 0) {
        playMusicBoxNote(freq / 2, 0, 2.4);
      }

      noteIdx++;
      if (noteIdx % currentMelody.length === 0) {
        melodyIdx++;
      }
    }

    step();
    musicTimer = setInterval(step, 850);
  }

  function stopMusicLoop() {
    isMusicPlaying = false;
    if (musicTimer) {
      clearInterval(musicTimer);
      musicTimer = null;
    }
  }

  /**
   * Tactile SFX: Paper rustle
   */
  function playPaperRustle() {
    if (isMuted) return;
    initContext();
    if (!audioCtx) return;

    try {
      const bufferSize = audioCtx.sampleRate * 0.18;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, audioCtx.currentTime);
      filter.Q.setValueAtTime(1.2, audioCtx.currentTime);

      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.01, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.07, audioCtx.currentTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.18);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);

      noise.start();
    } catch (e) {
      // Audio error silently handled
    }
  }

  /**
   * Tactile SFX: Page turn swoosh
   */
  function playPageTurn() {
    if (isMuted) return;
    initContext();
    if (!audioCtx) return;

    try {
      const now = audioCtx.currentTime;
      const bufferSize = audioCtx.sampleRate * 0.35;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, now);
      filter.frequency.exponentialRampToValueAtTime(2200, now + 0.15);
      filter.frequency.exponentialRampToValueAtTime(300, now + 0.35);

      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.08, now + 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);

      noise.start(now);
    } catch (e) {}
  }

  /**
   * Tactile SFX: Brittle wax seal crack & shatter
   */
  function playWaxCrack() {
    if (isMuted) return;
    initContext();
    if (!audioCtx) return;

    try {
      const now = audioCtx.currentTime;

      // 1. Sharp high-frequency mechanical snap
      const osc = audioCtx.createOscillator();
      const oscGain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1250, now);
      osc.frequency.exponentialRampToValueAtTime(260, now + 0.05);

      oscGain.gain.setValueAtTime(0.18, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      osc.connect(oscGain);
      oscGain.connect(masterGain);
      osc.start(now);
      osc.stop(now + 0.07);

      // 2. High-passed brittle noise burst
      const bufferSize = Math.floor(audioCtx.sampleRate * 0.045);
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;
      const hp = audioCtx.createBiquadFilter();
      hp.type = 'highpass';
      hp.frequency.setValueAtTime(2200, now);

      const noiseGain = audioCtx.createGain();
      noiseGain.gain.setValueAtTime(0.12, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

      noise.connect(hp);
      hp.connect(noiseGain);
      noiseGain.connect(masterGain);
      noise.start(now);
    } catch (e) {}
  }

  /**
   * Tactile SFX: Heavy rubber stamp thud on wooden desk
   */
  function playStampThud() {
    if (isMuted) return;
    initContext();
    if (!audioCtx) return;

    try {
      const now = audioCtx.currentTime;

      // 1. Resonant low-frequency impact
      const osc = audioCtx.createOscillator();
      const oscGain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(145, now);
      osc.frequency.exponentialRampToValueAtTime(42, now + 0.12);

      oscGain.gain.setValueAtTime(0.22, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
      osc.connect(oscGain);
      oscGain.connect(masterGain);
      osc.start(now);
      osc.stop(now + 0.15);

      // 2. Muffled desk surface friction
      const bufferSize = Math.floor(audioCtx.sampleRate * 0.06);
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;
      const lp = audioCtx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.setValueAtTime(320, now);

      const noiseGain = audioCtx.createGain();
      noiseGain.gain.setValueAtTime(0.14, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      noise.connect(lp);
      lp.connect(noiseGain);
      noiseGain.connect(masterGain);
      noise.start(now);
    } catch (e) {}
  }

  /**
   * Tactile SFX: Soft sticker placement on paper
   */
  function playStickerDrop() {
    if (isMuted) return;
    initContext();
    if (!audioCtx) return;

    try {
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(560, now);
      osc.frequency.exponentialRampToValueAtTime(740, now + 0.04);
      osc.frequency.exponentialRampToValueAtTime(480, now + 0.07);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(now);
      osc.stop(now + 0.08);
    } catch (e) {}
  }

  /**
   * Tactile SFX: Sticker pop
   */
  function playStickerPop() {
    if (isMuted) return;
    initContext();
    if (!audioCtx) return;

    try {
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch (e) {}
  }

  /**
   * Tactile SFX: Candle blow out
   */
  function playCandleBlow() {
    if (isMuted) return;
    initContext();
    if (!audioCtx) return;

    try {
      const now = audioCtx.currentTime;
      const bufferSize = audioCtx.sampleRate * 0.45;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, now);
      filter.frequency.exponentialRampToValueAtTime(250, now + 0.4);

      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.exponentialRampToValueAtTime(0.12, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);

      noise.start(now);
    } catch (e) {}
  }

  /**
   * Toggle audio mute state
   */
  function toggleAudio() {
    initContext();
    isMuted = !isMuted;

    if (!isMuted) {
      startMusicLoop();
      playStickerPop();
    } else {
      stopMusicLoop();
    }

    updateUI();
    return !isMuted;
  }

  function updateUI() {
    const btn = document.getElementById('audio-toggle-btn');
    if (!btn) return;

    if (isMuted) {
      btn.classList.remove('playing');
      btn.classList.add('muted');
      btn.setAttribute('aria-label', 'Sound is muted. Tap to enable gentle background music.');
      btn.title = "Music: Off (Tap to turn on)";
    } else {
      btn.classList.remove('muted');
      btn.classList.add('playing');
      btn.setAttribute('aria-label', 'Sound is playing. Tap to mute.');
      btn.title = "Music: Playing (Tap to mute)";
    }
  }

  // Handle tab visibility change (Item 16)
  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        if (isMusicPlaying && !isMuted) {
          stopMusicLoop();
        }
      } else {
        if (!isMuted && !isMusicPlaying) {
          startMusicLoop();
        }
      }
    });
  }

  return {
    init: () => {
      updateUI();
    },
    toggleAudio,
    getIsMuted: () => isMuted,
    playPaperRustle,
    playPageTurn,
    playStickerPop,
    playWaxCrack,
    playStampThud,
    playStickerDrop,
    playCandleBlow
  };
})();

if (typeof window !== 'undefined') {
  window.AudioEngine = AudioEngine;
}
