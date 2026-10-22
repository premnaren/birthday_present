# 📖 Kritika's Birthday Storybook ("Lucky") ✨

A handcrafted, interactive digital scrapbook and storybook website created for **Kritika ("Lucky")** celebrating her belated birthday (16th October).

Built with Vanilla HTML5, Modern CSS, ES6+ JavaScript, and GSAP. Designed with a physical, tactile scrapbook aesthetic—featuring washi tape, 3D flippable Polaroids, torn paper notebook lines, pressed botanical elements, an interactive cake with candles, and ambient procedural music.

---

## 🌸 Experience Overview

1. **Chapter 0: The Sealed Diary Cover (Gate)**
   - Ruled notebook handwritten input lines ("What's your name?", "When's your birthday?").
   - Case-insensitive acceptance for `"Kritika"`, `"Lucky"`, `"kittu"`, `"kriti"` and **October 16th**.
   - Friendly feedback note with card wobble and a hint after 3 attempts.
   - 3D wax seal button ("OPEN ✦") that cracks and unlocks Chapter 1.
2. **Chapter 1: "Let Me Guess…"**
   - 5 interactive guessing cards tailored to Kritika (tea & blankets, painting streaks, cake cravings, solo dance sessions).
   - "Yes! Spot on 🙈" and "Nope! 😂" response buttons with animated rubber stamps.
   - Celebratory pastel paper confetti shower revealing the storybook dedication.
3. **Chapter 2: Friends Corkboard**
   - 3D flippable Polaroids taped at asymmetric wobbly angles (-4° to +4°).
   - Tap to flip and read handwritten notes from Ananya, Rohan, Meera.
   - Draggable on desktop/pointer screens without obstructing mobile swipe.
   - "Memory Jar" button to draw random inside jokes and memories.
4. **Chapter 3: Family Vintage Album**
   - Heirloom album spread with antique photo corners holding keepsakes.
   - Pressed botanical illustrations (dried lavender and wildflower accents).
   - Heartfelt blessings from Mom & Dad and Dadi in elegant serif and script typography.
5. **Chapter 4: Sibling Shenanigans Zine**
   - Parody "WANTED POSTER" for birthday cake theft and hallway dance sessions.
   - Peelable washi tape confession with realistic paper tear sound effect.
6. **Chapter 5: Cousin Postcards**
   - Vintage airmail postcard with postage stamps, cancellation marks, and warm letter.
7. **Chapter 6: Make a Wish! (The Finale)**
   - Handcrafted layered birthday cake with 3 flickering candles.
   - Tap individual candles or press "Blow Out All Candles" to extinguish them with smoke puff animation and blowout SFX.
   - Soft paper confetti burst revealing Prem's personal letter card.
   - "Replay from Cover ↺" button.
8. **Ambient Audio & SFX Engine**
   - Soothing procedural music-box melody synthesized via Web Audio API (zero external MP3 download required).
   - Tactile paper rustling, page turns, sticker pops, and candle blowout sound effects.
   - Muted by default with an aesthetic paper sticker toggle in the top-right corner.

---

## 🛠️ How to Customize Messages & Photos

All text, names, aliases, and messages are completely separated into [`data/content.json`](file:///c:/Users/premn/birthday_present/data/content.json).

You can easily edit this single file to add real messages and photos gathered from friends and family:

```json
{
  "recipient": {
    "displayName": "Kritika",
    "nickname": "Lucky",
    "acceptedNames": ["kritika", "lucky", "kittu"],
    "birthday": { "day": 16, "month": 10 }
  },
  "chapters": [
    {
      "id": "friends",
      "entries": [
        {
          "from": "Friend Name",
          "caption": "Photo Caption",
          "photo": "assets/photos/friend.jpg",
          "message": "Their personal birthday message here..."
        }
      ]
    }
  ]
}
```

---

## 🚀 Running Locally

You can preview the site immediately using any local static web server:

**Option A (Python):**
```bash
python -m http.server 3000
```
Then open `http://localhost:3000` in your browser.

**Option B (Node / npx):**
```bash
npx serve .
```

*Developer Preview Tip:* Add `?preview=all` to the URL (e.g. `http://localhost:3000?preview=all`) to immediately unlock all chapters for testing.

---

## 🌐 Deploying to the Web

Because this is a static site with no backend dependencies, it can be deployed for free in seconds:

1. **Vercel**: Run `npx vercel` or import the GitHub repository in the Vercel dashboard.
2. **Netlify**: Drag and drop the `birthday_present` folder directly onto [app.netlify.com/drop](https://app.netlify.com/drop).
3. **GitHub Pages**: Push to GitHub and enable Pages in repository settings.

### Privacy Safeguards
- [`robots.txt`](file:///c:/Users/premn/birthday_present/robots.txt) disallows all search engine crawlers (`Disallow: /`).
- `<meta name="robots" content="noindex, nofollow">` prevents public indexing.
- Custom OpenGraph preview card is configured for private sharing via WhatsApp / iMessage.
