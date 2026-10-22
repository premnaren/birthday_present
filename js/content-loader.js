/**
 * Birthday Storybook - Content Loader
 * Asynchronously loads and caches storybook content with offline/file:// fallback
 */

const ContentStore = (() => {
  let cachedData = null;

  // Fallback data in case the site is opened directly via file:/// protocol without HTTP server
  const fallbackData = {
    recipient: {
      displayName: "Kritika",
      nickname: "Lucky",
      acceptedNames: ["kritika", "lucky", "kriti", "kittu"],
      birthday: { day: 16, month: 10 },
      interests: ["dancing", "painting", "cakes", "tea", "blankets"]
    },
    siteMeta: {
      title: "A Storybook for Kritika 📖✨",
      subtitle: "A little bundle of love for the birthday girl"
    },
    guesses: [
      { id: 1, text: "You are currently bundled up in your coziest blanket, sipping something warm.", tag: "Cozy Vibe" },
      { id: 2, text: "Your hands or sketchbook have some stray paint streaks from a sudden burst of creativity.", tag: "Artist Soul" },
      { id: 3, text: "You have mentally scheduled at least three different cake tastings this week.", tag: "Sweet Tooth" },
      { id: 4, text: "A song came on recently and you couldn't help doing a private dance routine in your room.", tag: "Dancer Mode" },
      { id: 5, text: "You were wondering if everyone forgot your belated celebration... (Never in a million years!).", tag: "Surprise!" }
    ],
    chapters: []
  };

  /**
   * Loads content from data/content.json with safety fallbacks
   */
  async function loadContent() {
    if (cachedData) return cachedData;

    try {
      const response = await fetch('data/content.json');
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      cachedData = await response.json();
      return cachedData;
    } catch (err) {
      console.warn("Could not fetch data/content.json (likely file:// protocol), using built-in fallback data.", err);
      cachedData = fallbackData;
      return cachedData;
    }
  }

  /**
   * Validates the Chapter 0 entry gate input
   * @param {string} inputName - Name entered by user
   * @param {number|string} inputDay - Day entered (1-31)
   * @param {number|string} inputMonth - Month entered (1-12)
   * @returns {{ success: boolean, reason?: string, hint?: string }}
   */
  function validateGate(inputName, inputDay, inputMonth) {
    if (!cachedData) return { success: false, reason: "Store not initialized" };

    const cleanName = (inputName || "").trim().toLowerCase();
    const day = parseInt(inputDay, 10);
    const month = parseInt(inputMonth, 10);

    const isNameMatch = cachedData.recipient.acceptedNames.some(alias => cleanName === alias.toLowerCase());
    const isDateMatch = (day === cachedData.recipient.birthday.day && month === cachedData.recipient.birthday.month);

    if (isNameMatch && isDateMatch) {
      return { success: true };
    }

    if (!isNameMatch && isDateMatch) {
      return {
        success: false,
        reason: "name_mismatch",
        hint: "Hmm, that name doesn't ring a bell... are you the birthday girl or her twin?"
      };
    }

    if (isNameMatch && !isDateMatch) {
      return {
        success: false,
        reason: "date_mismatch",
        hint: "That's definitely you, but check the birthday again! (Psst... it's in October 😉)"
      };
    }

    return {
      success: false,
      reason: "both_mismatch",
      hint: "Hmm, that secret code doesn't quite fit this diary. Try again!"
    };
  }

  function getRecipient() {
    return cachedData ? cachedData.recipient : fallbackData.recipient;
  }

  function getGuesses() {
    return cachedData ? cachedData.guesses : fallbackData.guesses;
  }

  function getChapter(id) {
    if (!cachedData || !cachedData.chapters) return null;
    return cachedData.chapters.find(ch => ch.id === id);
  }

  function getAllChapters() {
    return cachedData ? cachedData.chapters : [];
  }

  return {
    loadContent,
    validateGate,
    getRecipient,
    getGuesses,
    getChapter,
    getAllChapters
  };
})();

// Global window exposure
if (typeof window !== 'undefined') {
  window.ContentStore = ContentStore;
}
