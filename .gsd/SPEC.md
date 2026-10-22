# SPEC.md — Project Specification

> **Status**: `FINALIZED`
> **Project**: Birthday Storybook Website for Kritika ("Lucky")
> **Author**: Prem
> **Date**: October 2026

## Vision
A handcrafted, tactile digital storybook and scrapbook website gifted to Kritika ("Lucky") for her belated birthday (16th October) after she was unwell to celebrate. Far from an off-the-shelf template or AI-generated look, it feels like an authentic personal diary made by hand: torn paper, Polaroid frames, washi tape, hand-drawn doodles, pressed flowers, and chapters gathered from friends, family, siblings, and cousins, concluding with a candle-lighting wish ceremony.

## Goals
1. **Handmade Tactile Aesthetic**: Distinct scrapbook look blending Polaroids, torn paper edges, washi tape strips, stickers, and hand-lettered/typewriter typography with asymmetric, wobbly placements (-6° to +6° rotation).
2. **Personalized Entry Gate (Chapter 0)**: A charming diary cover requiring her name ("Kritika" or "Lucky") and birthday (16th October) to unlock, featuring gentle playful hints if wrong and a wax-seal open animation.
3. **Engaging Chapter Flow (Full Scope)**:
   - **Ch. 0: Entry Gate**: Sealed diary cover with handwritten inputs.
   - **Ch. 1: "Let Me Guess…"**: Interactive cards probing her favorite things (dancing, painting, cakes, cozy blankets) leading to the big celebration reveal.
   - **Ch. 2: Friends**: Corkboard / Polaroid wall with draggable photos and tap-to-flip handwritten message backs.
   - **Ch. 3: Family**: Vintage photo album with photo corners and pressed botanical elements.
   - **Ch. 4: Siblings**: Playful, chaotic sticker-and-banter scrapbook page with sibling jokes.
   - **Ch. 5: Cousins**: Summer postcard envelopes that unfold into warm notes.
   - **Final Chapter: Make a Wish**: Hand-drawn birthday cake with tap-to-blow candles, soft paper confetti, and Prem's closing note.
4. **Interactive & Responsive (Mobile-First)**: Tactile GSAP interactions tailored for smartphone screens (360px–430px) as well as desktop/tablet spreads.
5. **Atmospheric Audio**: Soft lofi/music-box background track with subtle paper-rustle and tap sound effects, muted by default with an aesthetic toggle.
6. **Data-Driven Architecture**: Decoupled content structure (`data/content.json`) allowing easy swapping of placeholder photos and messages with real family and friend contributions.

## Non-Goals (Out of Scope)
- No user authentication, accounts, databases, or backend server requirements.
- No heavy 3D or WebGL game engines.
- No public discovery or search indexing (unlisted private gift with `noindex` and `robots.txt`).
- No complex CMS; content updates are done directly via `content.json`.

## Users
- **Primary**: Kritika ("Lucky"), browsing comfortably on her smartphone while recovering. Interactions must be low-stress, warm, and delightful with zero harsh error states.
- **Secondary**: Friends and family viewing the site on tablets or laptops.

## Constraints
- **Stack**: Vanilla HTML5, Modern CSS, JavaScript (ES6+), GSAP (including Draggable) for smooth 60fps animations.
- **Performance**: Under 3MB initial payload; lazy loading of media assets; transform/opacity-only transitions.
- **Accessibility**: Support for `prefers-reduced-motion`, high contrast text against paper backdrops (WCAG AA), screen-reader labels for interactive elements.

## Success Criteria
- [ ] Gate accepts "Kritika", "kritika", "Lucky", "lucky" and "16th October" with delightful feedback animations.
- [ ] All 7 chapters function seamlessly with intuitive navigation (bookmark ribbon and back/forward controls).
- [ ] Tactile interactions (card flips, Polaroid dragging, envelope opening, candle blowing) respond cleanly on touch and pointer devices.
- [ ] Anti-template rules strictly respected (no generic gradient cards, no corporate UI patterns, asymmetric scrapbook composition).
- [ ] Audio toggle functions reliably across iOS Safari and Android Chrome.
- [ ] Content can be customized entirely through `data/content.json`.
