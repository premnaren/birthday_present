# DECISIONS.md — Architecture Decision Records

> **Purpose**: Log significant technical decisions and their rationale.

---

## Decisions

## [DECISION-001] Tech Stack: Vanilla HTML5, CSS3, JavaScript & GSAP

**Date**: 2026-10-22  
**Status**: Accepted

### Context
We need to build a handcrafted digital scrapbook website that feels like an authentic personal storybook. It must run smoothly on mobile devices and avoid feeling like a generic software application or cookie-cutter template.

### Decision
Use Vanilla HTML5, Modern CSS, ES6+ JavaScript, and GreenSock Animation Platform (GSAP + Draggable plugin).

### Rationale
- Zero build step / zero bundler overhead; fast iteration and direct file serving.
- Total freedom to craft custom DOM layouts, asymmetric rotations, physics-like drag and drop, and layered SVG masks.
- GSAP provides rock-solid 60fps animations, timeline sequencing for storybook page transitions, and touch-ready dragging across mobile browsers.

### Consequences
- Component reuse is handled through semantic DOM rendering and JS templates/data mapping rather than React JSX.
- Keeps initial bundle well below the 3MB threshold.

### Alternatives Considered
- React (Vite) + Framer Motion: Adds build tool complexity and heavier JavaScript payload for what is primarily a handcrafted visual presentation.

---

## [DECISION-002] Decoupled Content Architecture via JSON

**Date**: 2026-10-22  
**Status**: Accepted

### Context
The website needs to be built with realistic placeholder content (Kritika's hobbies: dancing, painting, cakes, blankets; placeholder photos for friends/family/cousins), which Prem will later replace with actual messages, photos, and voice notes gathered from friends and family.

### Decision
Store all content (names, birthday, accepted aliases, chapter copy, messages, image paths) in `data/content.json`.

### Rationale
- Allows Prem to update messages and photo paths without risking accidental breaking changes to CSS, layout, or animation scripts.
- Makes the code cleanly separated from personal data.

### Consequences
- Data is loaded asynchronously at launch (`fetch('data/content.json')`). Must handle clean initial loading state.

---

## [DECISION-003] Full Chapter Scope (Chapters 0 through 5 + Finale)

**Date**: 2026-10-22  
**Status**: Accepted

### Context
The PRD suggested either a phased v1 (Gate + Ch 1 + Friends + Finale) or the full build.

### Decision
Proceed with the full build of all chapters: Ch 0 (Entry Gate), Ch 1 (Let Me Guess), Ch 2 (Friends), Ch 3 (Family), Ch 4 (Siblings), Ch 5 (Cousins), and Final Chapter (Make a Wish cake).

### Rationale
- Building the complete chapter architecture from the beginning ensures consistent navigation, ribbon tabs, and styling across all groups.

---

## [DECISION-004] Background Audio & Paper Sound Effects

**Date**: 2026-10-22  
**Status**: Accepted

### Context
Sound enriches the tactile storybook experience, but the recipient is recovering from illness and unexpected loud audio would be jarring.

### Decision
Include soft lofi/music-box background music and tactile paper rustling sound effects, but strictly muted by default with an obvious, cute hand-drawn speaker toggle.

---

*Last updated: 2026-10-22*
