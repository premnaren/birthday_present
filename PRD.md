## Birthday Storybook Website: Product Requirements Document

Project: Interactive birthday gift website (belated birthday) Owner: Prem Recipient: [Her name], birthday on the 16th [month/year] Status: Draft v1

## 1. Overview

A personal, interactive birthday website gifted to a friend's cousin who was too sick to celebrate on her birthday. It is not a scrolling page of text and images. It is a handcrafted digital storybook / scrapbook that she explores, with chapters from the people who love her.

The emotional goal: when she opens it, she should feel seen, loved and surprised, as if a pile of notes, photos and doodles from her people has been laid out on a table just for her.

## 1.1 Why this exists

- She missed celebrating on the day. This is a "better late than never" gift that makes up for it.

- The previous birthday site Prem built worked well. This one should be a clear step up in craft and uniqueness.

## 1.2 Success criteria

- She smiles, laughs or gets emotional within the first minute.

- She explores every chapter instead of skimming.

- It does not look like a template or an AI-generated page. Someone who sees it should say "someone made this by hand for her."

- It works smoothly on her phone (most likely how she will open it).


## 2. Goals and Non-Goals

## Goals

- 1. A distinctive handmade look that blends scrapbook, Polaroid, collage and storybook styles.

- 2. A personalized entry gate that feels like a game, not a login.

- 3. Interactive, responsive experience: things react to taps, hover, drag and scroll.

- 4. Multiple chapters, one per group of people in her life.

- 5. Fast, smooth and mobile-first.

## Non-Goals

- No real authentication, accounts or backend security.

- No CMS or admin panel. Content is edited directly in files.

- No heavy 3D or game engines.

- Not a public website. It is a private gift shared by link.

## 3. Target User

Primary user: the birthday girl. Likely on a phone, possibly resting at home, so the experience should be relaxing, gentle and not overwhelming.

Secondary users: friends and family she shows it to, who might open it on a laptop or tablet.

## Design implications

- Short, warm, low-effort interactions.

- No time pressure, no scoring, no failure states that feel bad.

- Soft sounds are optional and off by default.


## 4. Design Vision

## 4.1 Concept

A scrapbook that opens like a storybook. Each chapter is a new spread or page, built from layered collage elements: Polaroids, torn paper, washi tape, stickers, pressed flowers, doodles and handwritten notes.

## 4.2 Style pillars

| Pillar | What it means in practice |
| --- | --- |
| Handmade | Hand-drawn doodles, wobbly lines, imperfect |
|   | borders, sketchy underlines, hand-lettered |
|   | headings |
| Polaroid scrapbook | Photos in Polaroid frames, slightly rotated, with |
|   | handwritten captions, taped or pinned to the page |
| Collage / mixed media Torn paper edges, paper textures, cut-out shapes, |   |
|   | overlapping layers, mixed fonts and materials |
| Interactive storybook Page turns, reveals, tap-to-open elements, chapter |   |
|   | progression |

## 4.3 How to avoid the "AI / template" look

This is the most important design constraint. Rules:

- No perfect grids, evenly spaced cards, or centered hero + three-feature-cards layouts.

- No purple-to-pink gradients, glassmorphism, glowing blobs or generic rounded cards with soft shadows.

- No stock emoji as decoration or generic icon sets (Font Awesome style).

- Yes to asymmetric layouts, overlapping elements, deliberate "mess", and inconsistent rotation angles (between -6° and +6°).

- Yes to real texture: paper grain, tape, stains, pencil marks, folded corners.

- Yes to custom doodles drawn by hand (scan or draw on a tablet, export as SVG/PNG).

- Copy should sound like real people talking, with inside jokes, nicknames and slightly imperfect grammar.


- Every chapter should have its own small "personality" while sharing the same material language.

## 4.4 Color palette (starting point, tune to her taste)

Girly and aesthetic, but warm and papery, not neon.

- Cream paper: #FBF3E4

- Blush pink: #F4C2C7

- Dusty rose: #D98A9B

- Soft lavender: #CDB8E3

- Butter yellow: #F7E3A1

- Sage green: #B7C9A8

- Ink (text): #4A3B3F (a warm brown-plum, never pure black)

- Accent red (for hand-drawn marks): #C8483F

Chapters can lean on different accent colors from this set.

## 4.5 Typography

- Headings: a hand-lettered or brush-style font (for example Caveat Brush, Permanent Marker alternatives, or a custom hand-drawn font made from Prem's own handwriting).

- Captions / notes: a natural handwriting font (for example Reenie Beanie, Nanum Pen Script, Gaegu).

- Body text (long messages): a soft serif or a typewriter font for contrast, so notes feel like different materials (for example Courier Prime, Lora).

- Mix at most 3 families. Vary size and rotation slightly. Use hand-drawn underlines and circles for emphasis.

- All fonts must have web-safe fallbacks.

## 4.6 Textures and assets

- Paper textures (cream, kraft, lined notebook, graph paper, tissue)

- Torn paper edges as SVG masks or PNGs

- Washi tape strips in several patterns and colors

- Polaroid frame (with a slightly worn look)

- Hand-drawn doodles: stars, hearts, flowers, sparkles, arrows, cake, balloons, little characters


- Stickers (die-cut look with a white border)

- Pressed flowers / botanical illustrations

- Optional: a subtle film-grain overlay

## 5. User Flow

```
Open link
↓
Chapter 0: Entry Gate (name + birthday)
↓ (correct)
Chapter 1: "Let Me Guess…"
↓
Chapter 2: Friends
Chapter 3: Family
Chapter 4: Siblings
Chapter 5: Cousins
Chapter 6+: Extra chapters (optional)
↓
Final Chapter: The Closing / Make a Wish
```

Navigation is linear by default (the story builds) but she can jump between chapters from a "table of contents" (see 6.9) once she has reached them.

## 6. Functional Requirements

## 6.1 Entry Gate (Chapter 0)

Purpose: a playful, personal doorway. It should feel like a question in a storybook, not a login or a security check.

## Content

- A cover that looks like a closed scrapbook or diary, with a hand-lettered line such as "Before we begin, tell us who you are…"

- Two fields styled as handwriting lines on paper:

- 1. "What's your name?"

- 2. "When's your birthday?" (day and month selectors styled like torn paper tabs, or a hand-drawn date picker)


- A button styled as a sticker or wax seal: "Open".

## Behavior

- Name check is case-insensitive, trims spaces, and accepts a list of accepted variations (nickname, full name, first name only).

- Birthday check accepts day + month (year optional).

- Success: the cover opens (page-flip or cover-lift animation) and transitions into Chapter 1.

- Failure: gentle, funny, hand-drawn response, never harsh. Examples: a doodle character scratching its head with "Hmm, that doesn't sound like the birthday girl… try again?" After 3 failed attempts, show a playful hint (e.g. "Hint: it's the 16th 😉").

- No "error" red alerts. Use a wobble animation and a handwritten note.

- Remember success in session storage so refresh does not force her to re-enter (optional: a "Replay intro" option).

Important note: this gate is a fun interaction, not security. The answers will exist in the front-end code. That is acceptable for this project. Do not put anything sensitive behind it.

## 6.2 Chapter 1: "Let Me Guess…"

The personalized opener right after the gate.

Concept: a short guessing sequence about her, as if the site "knows" her. Options (pick one or combine):

- A series of cards that flip to reveal guesses: "Let me guess: you're probably in bed with a blanket and way too many cups of tea right now."

- Each guess is revealed by tapping, then she can mark it "Yes" or "Nope" (cute reactions either way).

- Ends with a big reveal: "Happy Birthday, [Name]! We know it's late, but we weren't going to let you miss it."

## Requirements

- Uses her name from the gate (the text she typed, or the canonical version of her name).

- 4 to 7 guesses, each short.

- Includes confetti or a hand-drawn burst animation on the final reveal. Keep it gentle (she is unwell).


- A clear "Continue" prompt (a hand-drawn arrow or a "turn the page" corner).

## 6.3 Chapter: Friends

- Polaroid wall or corkboard with photos of friends pinned at different angles.

- Tap a Polaroid to flip or enlarge it and reveal that friend's message on the back.

- Messages shown as handwritten notes, sticky notes or torn-paper letters.

- Optional: draggable Polaroids she can rearrange (they remember their position during the session).

- Optional "memory jar": tap to pull out a random funny memory or inside joke.

## 6.4 Chapter: Family

- Style: a family album with photo corners, pressed flowers, slightly vintage feel.

- Each person gets a "page" with photo, name, relationship label (hand-lettered) and message.

- Page-turn interaction (swipe left/right on mobile, click corners on desktop).

## 6.5 Chapter: Siblings

- Style: playful, a little chaotic, doodles and sticker-heavy. Sibling banter energy.

- Content ideas: "things only siblings know", childhood photos, a fake "report card" or "wanted poster" parody.

## 6.6 Chapter: Cousins

- Style: summer-memory vibe, instant-camera snapshots, scribbled postcards.

- Content ideas: a "postcards from your cousins" interaction where she opens envelopes one by one.

## 6.7 Optional Extra Chapters

Pick based on what Prem can collect:

- Voice notes / short video wishes (embedded, tap to play).

- "Things we love about you": a list that reveals itself as she taps stickers.

- Gift / coupon page: scratch-off cards with small promises (e.g. "One free coffee date").

- Mini game: catch falling hearts, pop balloons, or a puzzle of a group photo (low- pressure, no losing).


## 6.8 Final Chapter: Make a Wish

- A hand-drawn cake with candles. She taps or blows (mic is optional, avoid requiring permissions) to light/blow out the candles.

- After the wish: soft confetti, a closing note from Prem, and a "Thank you for being you" message.

- A "Replay from the start" button and a "Save a favourite moment" option (optional).

## 6.9 Navigation and Progress

- A hand-drawn bookmark ribbon or a small tab strip showing chapters (locked ones appear greyed or "sealed with tape" until reached).

- Progress indicator styled as a hand-drawn dotted path or page numbers.

- Back button always available.

- Keyboard support on desktop (arrow keys to turn pages, Esc to close modals).

## 6.10 Audio (optional)

- A single soft instrumental track (lofi, acoustic or music-box).

- Off by default, with a small hand-drawn speaker icon to enable it.

- Tiny sound effects (paper rustle, page turn, sticker pop) only if audio is enabled.

- All audio must be properly licensed or royalty-free.

## 7. Interaction and Animation Spec

## 7.1 Principles

- Tactile: things feel like physical paper. Use slight rotations, shadows and overlaps.

- Gentle: ease-out curves, 300 to 700 ms durations. No sudden or harsh effects.

- Purposeful: every animation reveals something or guides her. No animation for its own sake.

- Imperfect: vary timing, rotation and offset a bit so nothing feels mechanical.


## 7.2 Interaction catalogue

| Interaction | Where | Behavior |
| --- | --- | --- |
| Cover open | Gate to Ch.1 | Scrapbook cover lifts or flips open |
| Page turn | Between chapters Curl or slide, with paper shadow |   |
| Polaroid flip | Friends | Tap flips to reveal the message on the back |
| Drag and drop | Friends, Siblings | Draggable photos and stickers with inertia |
| Envelope open | Cousins | Tap to unfold letter |
| Scratch-off | Extras | Pointer drag reveals hidden text |
| Tape peel | Various | Tap tape to peel and reveal a note beneath |
| Hover / press wiggle Stickers, buttons |   | Small wobble and scale change |
| Scroll reveal | Within longer pages Elements slide in as if placed by hand |   |
| Candle blow | Final | Tap each candle, or tap-and-hold to blow |
| Confetti burst | Reveals | Soft, paper-piece confetti (not neon) |

## 7.3 Accessibility of motion

- Respect prefers-reduced-motion : replace big animations with simple fades.

- No flashing or rapid strobing elements.

## 8. Content Requirements

Content is what makes this gift personal. This section is Prem's collection checklist.

## 8.1 What to collect

| Item | Details |
| --- | --- |
| Her details | Preferred name(s)/nicknames, birthday (day + |
|   | month), favourite colors, hobbies, favourite things |
|   | (to use in "Let Me Guess") |


| Item | Details |
| --- | --- |
| Photos | 3 to 8 per group, high resolution, a mix of recent |
|   | and old, ideally with permission |
| Messages | 2 to 6 sentences per person, in their own voice; ask |
|   | for nicknames and inside jokes |
| Names and relationship labels How each person should be shown |   |
| Extra media | Voice notes or short videos, if any |
| Prem's note | A personal closing message |

## 8.2 Content data structure (suggested)

Keep all content in a single data file (JSON) so the design is separate from the content.

```
{
"recipient": {
"acceptedNames": ["name", "nickname"],
"birthday": { "day": 16, "month": 0 },
"displayName": "Name"
},
"chapters": [
{
"id": "friends",
"title": "The Friends",
"theme": "corkboard",
"entries": [
{
"from": "Friend name",
"photo": "assets/friends/ananya.jpg",
"caption": "Handwritten caption",
"message": "Their message"
}
]
}
]
}
```


## 8.3 Content tone

- Warm, funny, personal. Written like real messages, not greeting-card text.

- Because she has been unwell: lots of comfort, care and "get well soon" energy mixed with celebration. Avoid anything that sounds like pressure to be energetic.

## 9. Technical Requirements

## 9.1 Recommended stack

Pick based on Prem's comfort. Two good options:

## Option A: Vanilla (recommended for a unique feel and small size)

- HTML + CSS + JavaScript

- GSAP (GreenSock) for animation and Draggable plugin for drag interactions

- Optional: Lottie for small hand-drawn animations

## Option B: Framework

- React (Vite) + Framer Motion, or Svelte + built-in transitions

- Good if there are many reusable components (Polaroid, Note, Tape, Sticker)

## 9.2 Suggested component structure

- Gate

- Book / PageStage (handles chapter transitions)

- Polaroid

- Note (sticky, torn paper, lined paper variants)

- Tape , Sticker , Doodle

- Envelope

- Candles / Cake

- Confetti

- NavRibbon

- AudioToggle

## 9.3 Responsive design

- Mobile-first. Primary target: phones 360 to 430 px wide.


- Breakpoints: ~600 px (large phone/small tablet), ~900 px (tablet), ~1200 px (desktop).

- On mobile: single-page spreads, swipe gestures, larger tap targets (at least 44 px).

- On desktop: two-page "open book" spread where it makes sense.

- Layouts must be re-composed per breakpoint, not just shrunk. Collage placement should be designed for each.

- Support portrait and landscape.

## 9.4 Performance

- Total first-load payload target: under 3 MB; lazy-load chapter assets.

- Images: compressed WebP/AVIF with JPEG fallback, sized for screen (use srcset ).

- Textures as small tiling images or CSS/SVG filters where possible.

- Aim for 60 fps animations; animate transform and opacity only.

- Preload the gate and first chapter; load the rest in the background.

- Test on a mid-range Android phone and a slower connection.

## 9.5 Browser support

- Latest Chrome, Safari (iOS and macOS), Firefox, Edge, Samsung Internet.

- Graceful fallback if a feature (e.g. a CSS filter or mask) isn't supported.

## 9.6 Accessibility

- Sufficient text contrast (aim for WCAG AA) even on textured backgrounds. Use a paper-colored backing behind text.

- Real text in HTML (not text baked into images) so it can be read and scaled.

- Alt text for photos (can be warm and descriptive).

- Full keyboard navigation and visible focus styles (hand-drawn focus ring).

- Respect reduced-motion settings.

## 9.7 Privacy and sharing

- Host as a static site (Netlify, Vercel or GitHub Pages) with an unlisted link.

- Add noindex meta tag and robots.txt to discourage search indexing.

- Get permission from people whose photos and messages are used.

- Don't expose anything sensitive (phone numbers, addresses) in the content file, since it is visible in front-end code.


- Custom link preview (Open Graph image and title) designed to look like the scrapbook cover, so it looks lovely when shared on WhatsApp.

## 10. Asset Production Plan

| Asset | Source | Notes |
| --- | --- | --- |
| Doodles, stickers, | Draw by hand (paper + scan, or | Export as transparent PNG or |
| hand-lettering | iPad/Procreate) | SVG; this is the biggest factor in |
|   |   | making the site feel unique |
| Paper, tape, torn- | Self-scanned or free libraries | Keep file sizes small |
| edge textures | (check licenses) |   |
| Fonts | Google Fonts or custom | Subset to reduce size |
|   | handwriting font |   |
| Photos | Collected from friends and | Crop, color-match lightly, apply a |
|   | family | subtle film tone |
| Music / SFX | Royalty-free libraries | Confirm license for personal use |

## 11. Milestones and Timeline (suggested)

| Phase | Deliverable | Estimate |
| --- | --- | --- |
| 1. Content | Messages, photos, details gathered 2 to 3 days (start immediately, it is |   |
| collection |   | the bottleneck) |
| 2. Design | Moodboard, palette, fonts, 1 page | 2 to 3 days |
|   | layout per chapter (sketch or |   |
|   | Figma), doodle set |   |
| 3. Build core | Gate, page/chapter system, | 2 days |
|   | navigation |   |
| 4. Build | All chapters with interactions | 3 to 4 days |
| chapters |   |   |


| Phase | Deliverable | Estimate |
| --- | --- | --- |
| 5. Polish | Animations, sound, responsive | 2 days |
|   | fixes, performance |   |
| 6. Test | Multiple phones, browsers, slow | 1 day |
|   | network, reduced motion |   |
| 7. Launch | Deploy, share link, optional | 1 day |
|   | personal delivery message |   |

Because it is already a belated gift, consider shipping a v1 with Gate, Let Me Guess, Friends and Final chapter first, then adding the remaining chapters if time allows.

## 12. Scope Priorities (MoSCoW)

## Must have

- Entry gate with name + birthday

- "Let Me Guess" chapter

- Friends and Family chapters

- Final "Make a Wish" chapter

- Mobile-first responsive layout

- Handmade collage visual language

## Should have

- Siblings and Cousins chapters

- Page-turn transitions

- Draggable Polaroids

- Chapter navigation ribbon

- Custom link preview image

## Could have

- Optional music and sound effects

- Voice notes / video wishes

- Scratch-off coupons

- Mini game


- Replay and favourites

## Won't have (this version)

- Accounts, backend, CMS

- Real security on the gate

## 13. Risks and Mitigations

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Late or missing messages/photos | Chapters feel | Send a collection form early |
| from friends | empty | with a deadline; design chapters |
|   |   | to look good with few entries |
| Heavy images/animations slow the | Poor first | Compress, lazy-load, test on a |
| site on her phone | impression | mid-range phone |
| Site ends up looking generic | Misses the main | Use hand-drawn assets, follow |
|   | goal | the "avoid" rules in 4.3, review |
|   |   | against the moodboard |
| Gate frustrates her (wrong spelling, | Bad first moment Accept many name variants; |   |
| etc.) |   | offer a gentle hint after 3 tries |
| Over-scoping | Not finished | Ship v1 first, add chapters after |
| Too much stimulation for someone | Overwhelming | Gentle motion, no autoplay |
| unwell |   | audio, easy pacing |

## 14. Definition of Done / QA Checklist

- Gate accepts all intended name variants and the correct birthday; wrong answers show friendly feedback

- All chapters load and every interaction works on iOS Safari and Android Chrome

- Layout is checked at 360, 390, 430, 768 and 1280 px widths

- No horizontal scrolling or overlapping text that is unreadable

- Text contrast is acceptable over all textures

- Reduced-motion mode works


- Audio is off by default and toggles correctly

- Photos have permission and are optimized

- Open Graph preview looks right when shared

Site is unlisted ( noindex ) and has no sensitive data

Typos in all messages are proofread (or intentionally kept if charming)

Final walkthrough from the gate to the end with no dead ends

## 15. Open Questions for Prem

- 1. What is her name (and nicknames) and the exact birthday (day and month)?

- 2. What are her hobbies, favourite colors, favourite foods or shows? (needed for "Let Me Guess" and the palette)

- 3. How many people and which groups will contribute (friends, family, siblings, cousins)?

- 4. Will she mostly open it on a phone? Which kind?

- 5. Do you want music, voice notes or video wishes?

- 6. Will you draw the doodles yourself, or should we source and customize assets?

- 7. What is the target date to deliver the gift?

- 8. Do you want a personal closing note from you, and should it be text, voice or both?

## 16. Appendix: Inspiration and Moodboard Keywords

Use these to search Pinterest, Behance or Are.na for your moodboard:

- "junk journal aesthetic"

- "scrapbook collage web design"

- "Polaroid wall corkboard"

- "washi tape stickers aesthetic"

- "hand-drawn website"

- "cottagecore pressed flowers"

- "vintage diary cover"

- "zine layout collage"

- "storybook page turn interaction"


Moodboard rule: collect 15 to 20 references, then circle the 5 elements you want to steal the feeling of (not copy). Those 5 become the design backbone.
