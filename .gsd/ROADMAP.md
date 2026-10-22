# ROADMAP.md

> **Current Phase**: Not started
> **Milestone**: v1.0 — Kritika's Birthday Storybook

## Must-Haves (from SPEC)
- [ ] Scrapbook handmade look: paper grain, wobbly angles (-6° to +6°), washi tape, torn edges, Polaroids, doodles
- [ ] Interactive Entry Gate with "Kritika" / "Lucky" + 16th October validation and wax seal animation
- [ ] "Let Me Guess..." interactive opener incorporating cakes, dancing, painting, and tea/blankets
- [ ] Dedicated chapters for Friends (Polaroids), Family (Vintage album), Siblings (Playful banter), and Cousins (Postcards)
- [ ] Make a Wish finale with interactive candle lighting/blowout, confetti, and Prem's closing note
- [ ] Responsive mobile-first design (tested on 360px–430px) and tablet/desktop spreads
- [ ] Background music & paper SFX toggle (muted by default)
- [ ] Modular content via `data/content.json`

---

## Phases

### Phase 1: Foundation, Tactile Design System & Content Architecture
**Status**: ✅ Complete
**Objective**: Build the application skeleton, establish the scrapbooking visual tokens (cream/blush palette, fonts, SVG paper/tape/sticker generators), create the `data/content.json` store with customizable placeholders, build the audio engine, and implement the core page turn / navigation stage.  
**Requirements**: REQ-01, REQ-02, REQ-03, REQ-04, REQ-05

### Phase 2: The Portal — Entry Gate & "Let Me Guess..." Prologue
**Status**: ✅ Complete  
**Objective**: Implement Chapter 0 (diary cover gate with handwritten input lines, case-insensitive nickname acceptance, playful hint animations, and wax seal unlock) and Chapter 1 ("Let Me Guess..." interactive guess cards for Kritika's traits with cute reactions and celebratory transition).  
**Requirements**: REQ-06, REQ-07

### Phase 3: The Scrapbook Chapters — Friends, Family, Siblings & Cousins
**Status**: ✅ Complete  
**Objective**: Build the 4 core memory chapters: Chapter 2 (Friends Polaroid corkboard with drag-and-drop & flip-to-read messages), Chapter 3 (Family album with photo corners and pressed flowers), Chapter 4 (Siblings zine with sticker collage and banter), and Chapter 5 (Cousins summer postcards with unfolding envelopes).  
**Requirements**: REQ-08, REQ-09, REQ-10, REQ-11

### Phase 4: Make a Wish Finale, Audio Polishing & Launch Readiness
**Status**: ⬜ Not Started  
**Objective**: Build the final birthday cake ceremony (interactive candles, blowout gesture/tap, soft confetti, Prem's closing note), integrate audio tracks and paper sound effects, perform responsive QA across mobile/tablet/desktop, configure `noindex` and OpenGraph preview cards, and finalize documentation.  
**Requirements**: REQ-12, REQ-13, REQ-14
