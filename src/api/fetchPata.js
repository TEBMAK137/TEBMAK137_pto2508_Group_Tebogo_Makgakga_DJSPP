/**
 * API Module – Handles all data fetching and normalisation.
 *
 * Features:
 * - Fetches podcast preview list from the public API
 * - Fetches full show details by ID
 * - Includes fallback data when the API is unavailable
 * - Normalises data (adds genreNames, ensures consistent structure)
 *
 * @module fetchPata
 */
import { genres } from "../data.js";

const API_BASE = "https://podcast-api.netlify.app";

/**
 * Map genre IDs to human‑readable names.
 * @constant {Object<number, string>}
 */
export const GENRE_MAP = Object.fromEntries(genres.map((g) => [g.id, g.title]));

/**
 * Normalises a raw podcast object from the API.
 * Adds a `genreNames` array and ensures all fields are consistently formatted.
 *
 * @param {Object} raw - Raw podcast data from the API.
 * @param {string} raw.id - Unique identifier.
 * @param {string} raw.title - Podcast title.
 * @param {string} raw.description - Show description.
 * @param {number} raw.seasons - Number of seasons.
 * @param {string} raw.image - Cover image URL.
 * @param {string} raw.updated - ISO date string.
 * @param {number[]} raw.genres - Array of genre IDs.
 * @returns {Object} Normalised podcast object.
 */
function normalizePodcast(raw) {
  const genreIds = raw.genreIds ?? raw.genres ?? [];
  return {
    id: String(raw.id),
    title: raw.title || "Untitled Podcast",
    description: raw.description || "",
    seasons: raw.seasons || 0,
    image: raw.image || "",
    updated: raw.updated || new Date().toISOString(),
    genreIds,
    genreNames: genreIds.map((id) => GENRE_MAP[id] || "Unknown"),
  };
}

/**
 * Fallback dataset – used when the API is unreachable.
 * Includes 10 popular shows with all required fields.
 */
const FALLBACK_DATA = [
  {
    id: "10716",
    title: "Something Was Wrong",
    description:
      "An Iris Award‑winning true‑crime docuseries about discovery, trauma, and recovery.",
    seasons: 14,
    image:
      "https://content.production.cdn.art19.com/images/cc/e5/0a/08/cce50a08-d77d-490e-8c68-17725541b0ca/9dcebd4019d57b9551799479fa226e2a79026be5e2743c7aef19eac53532a29d66954da6e8dbdda8219b059a59c0abe6dba6049892b10dfb2f25ed90d6fe8d9a.jpeg",
    genres: [1, 2],
    updated: "2022-11-03T07:00:00.000Z",
  },
  {
    id: "5675",
    title: "This Is Actually Happening",
    description:
      "Extraordinary true stories of life‑changing events told by the people who lived them.",
    seasons: 12,
    image:
      "https://content.production.cdn.art19.com/images/5a/4f/d4/19/5a4fd419-11af-4270-b31c-2c7ed2f563a5/bc913bc926be23d04c9a4d29a829269a753be3d2612dad91f7e92ba4618fefc5c8802af29a1d32b3261eb03f83613e2535e3c574469b0cb510c32cd8d94cfaa1.png",
    genres: [2],
    updated: "2022-11-01T10:00:00.000Z",
  },
  {
    id: "5279",
    title: "American History Tellers",
    description:
      "The Cold War, Prohibition, the Gold Rush – how well do you know the stories that made America?",
    seasons: 51,
    image:
      "https://content.production.cdn.art19.com/images/a4/8f/53/79/a48f5379-a90e-4197-915c-c0645e0d9336/8d9e6ebc4d65a9575fa626318e426fcf8be7f98ea0c1b7b103de2b32def46ded57537627d80b36f55edf7c9a8ad639bd9816f68c79b56845203a0b5bc4a63a55.png",
    genres: [3],
    updated: "2022-11-02T07:01:00.000Z",
  },
  {
    id: "10539",
    title: "Scamfluencers",
    description:
      "Stories of the world’s most insidious Scamfluencers – unpacking deception and its victims.",
    seasons: 3,
    image:
      "https://content.production.cdn.art19.com/images/19/f4/f9/af/19f4f9af-4a18-44e1-a622-726f43feb79d/539a50f79529628dbde7aa116778056619b802bfa0247cb739db907085e0b595a5521efc78faa831ebddc235d69beb27e1e36fd51f825bc888f0c11cccbd9cd8.png",
    genres: [2],
    updated: "2022-10-24T07:01:00.000Z",
  },
  {
    id: "9177",
    title: "Killer Psyche",
    description:
      "Retired FBI agent Candice DeLong explores the minds of murderers and criminals.",
    seasons: 2,
    image:
      "https://content.production.cdn.art19.com/images/68/4e/03/af/684e03af-29c5-4a35-b84a-d929f114caee/4f60eec3fabd62251d0cdbd1af11b79c43fb1465dbc5ec3371328fbddadee597e9f115c31b079e20266648ee07a80a93c01cecdb81ab3545d872393997594ef3.png",
    genres: [3, 2],
    updated: "2022-11-01T07:03:00.000Z",
  },
  {
    id: "6807",
    title: "Even the Rich",
    description:
      "Behind‑the‑scenes stories of the greatest family dynasties in history.",
    seasons: 33,
    image:
      "https://content.production.cdn.art19.com/images/c3/55/d2/da/c355d2da-f845-47df-a4e6-22b70a5082bb/c290fe89d3a699dd5c316f5f4cfe2ca942183cef5d6ac4fc2d7d6df296690c9e7183f79422dcb0b37af7c7e7e59de0e36cddd3b01500bf066a470614c9a0af6d.png",
    genres: [4, 5, 3],
    updated: "2022-11-01T07:08:00.000Z",
  },
  {
    id: "8514",
    title: "Against The Odds",
    description:
      "Thrilling stories of survival – from a soccer team trapped in a cave to a hostage rescue.",
    seasons: 19,
    image:
      "https://content.production.cdn.art19.com/images/a3/77/2c/e4/a3772ce4-34f7-431d-bf80-968f555b7003/6c099d5ec76b40bb54e72a75c1dcbc44c5c13a764114fb5183fe7eecd201619fca37cf3dd029c2fc320fb1a3cfab716d94297cbe7bb32ead208b779579015683.png",
    genres: [3],
    updated: "2022-11-01T07:01:00.000Z",
  },
  {
    id: "10276",
    title: "This Podcast Will Kill You",
    description:
      "Ecologists and epidemiologists make infectious diseases acceptable dinner conversation.",
    seasons: 5,
    image:
      "https://content.production.cdn.art19.com/images/f5/16/e0/99/f516e099-4c64-4737-9fdb-55f4d45a4003/6d14be58e0a54d21128c239dd933e0f3c36ca00f85ea7294cbea91a2b214d2384361c2a765842eef66e8583b2c21302c8fd2b1eb4d32e3805481292d758f20aa.jpeg",
    genres: [1],
    updated: "2022-10-25T07:01:00.000Z",
  },
  {
    id: "8860",
    title: "British Scandal",
    description:
      "Stories of the murkier side of the British elite – from Phone Hacking to Profumo.",
    seasons: 19,
    image:
      "https://content.production.cdn.art19.com/images/be/95/68/28/be956828-0cc8-4d16-986f-b81142129bd3/bdc59126cd5707aee511313b8e246428364b62229f8243c4deab8f5721425478c9fcb4224cd0369f8001cde85dbe4c3106d31ed914e414a18208a29386e88317.png",
    genres: [2],
    updated: "2022-11-01T23:01:00.000Z",
  },
  {
    id: "5629",
    title: "Tides of History",
    description:
      "How our world got to be the way it is – history, from prehistory to the modern era.",
    seasons: 5,
    image:
      "https://content.production.cdn.art19.com/images/a4/b7/0e/b1/a4b70eb1-2ba8-4320-ba12-20939a9c0d13/486bc367f5acec6dbb5fdfb84d510a1ed304ba20c6e9c97da0448a62e6d4a1c5b91fb30198437f6d4db969db5f171aa63648545002fbaa81d9fcc422a2e05b9e.jpeg",
    genres: [3],
    updated: "2022-11-03T07:01:00.000Z",
  },
];

/**
 * Fetches all podcast previews.
 * Uses a fallback dataset if the API is unreachable.
 *
 * @async
 * @param {Function} setPodcasts - State setter for the podcasts array.
 * @param {Function} setError - State setter for error messages.
 * @param {Function} setLoading - State setter for loading state.
 * @returns {Promise<void>}
 */
export async function fetchPodcasts(setPodcasts, setError, setLoading) {
  try {
    console.log("📡 Fetching podcasts from API...");
    const response = await fetch(API_BASE);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`✅ Received ${data.length} podcasts from API`);

    const normalized = Array.isArray(data)
      ? data.map(normalizePodcast)
      : FALLBACK_DATA.map(normalizePodcast);

    setPodcasts(normalized);
    setError(null);
  } catch (error) {
    console.warn("⚠️ API failed, using fallback data:", error.message);
    setError("Using cached data (API unavailable)");
    setPodcasts(FALLBACK_DATA.map(normalizePodcast));
  } finally {
    setLoading(false);
  }
}

/**
 * Fetches full details of a single show by ID.
 *
 * @async
 * @param {string} id - The show's unique identifier.
 * @returns {Promise<Object>} Full show data (including seasons and episodes).
 * @throws {Error} If the request fails or the ID is invalid.
 */
export async function fetchShowById(id) {
  console.log(`📡 Fetching show details for ID: ${id}`);

  const response = await fetch(`${API_BASE}/id/${id}`);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: Failed to fetch show ${id}`);
  }

  const data = await response.json();
  console.log(`✅ Show details received for "${data.title}"`);

  return data;
}
