/**
 * PodcastContext – Global state provider for the entire app.
 * Manages:
 * - Podcast data (fetched from API)
 * - Search, filter, sort, pagination
 * - Theme (light/dark)
 * - Favourites (localStorage)
 * - Audio player state
 *
 * @module PodcastContext
 */
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import { fetchPodcasts } from "../api/fetchPata";
import { SORT_OPTIONS, ITEMS_PER_PAGE } from "../utils/constants";

// --- Create the context ---
const PodcastContext = createContext(null);

/**
 * Provider component – wraps the app and provides all state.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element}
 */
export function PodcastProvider({ children }) {
  // --- Podcasts & UI state ---
  const [allPodcasts, setAllPodcasts] = useState([]); // Full unfiltered list
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState(SORT_OPTIONS.NEWEST);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  // --- Theme (stored in localStorage) ---
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  // Apply theme to the document and persist changes
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // --- Favourites (stored in localStorage) ---
  const [favourites, setFavourites] = useState(() => {
    try {
      const saved = localStorage.getItem("favourites");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Persist favourites whenever they change
  useEffect(() => {
    localStorage.setItem("favourites", JSON.stringify(favourites));
  }, [favourites]);

  /**
   * Toggle favourite status for an episode.
   * If already favourited, removes it; otherwise adds it.
   *
   * @param {Object} episode - Episode object to toggle.
   */
  const toggleFavourite = (episode) => {
    setFavourites((prev) => {
      const exists = prev.some((f) => f.id === episode.id);
      if (exists) {
        console.log(`🗑️ Removed from favourites: ${episode.title}`);
        return prev.filter((f) => f.id !== episode.id);
      } else {
        console.log(`❤️ Added to favourites: ${episode.title}`);
        return [...prev, { ...episode, dateAdded: new Date().toISOString() }];
      }
    });
  };

  // --- Audio Player state ---
  const [currentEpisode, setCurrentEpisode] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  // --- Fetch podcast data on mount ---
  useEffect(() => {
    fetchPodcasts(setAllPodcasts, setError, setLoading);
  }, []);

  // --- Reset to page 1 when filters change ---
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortBy, selectedGenres]);

  // --- Filter, search, sort pipeline ---
  const processed = useMemo(() => {
    let result = [...allPodcasts];

    // 1. Filter by search term (case‑insensitive)
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter((p) => p.title.toLowerCase().includes(term));
    }

    // 2. Filter by selected genres (any match)
    if (selectedGenres.length > 0) {
      result = result.filter((p) =>
        p.genreNames.some((g) => selectedGenres.includes(g)),
      );
    }

    // 3. Sort
    switch (sortBy) {
      case SORT_OPTIONS.NEWEST:
        result.sort((a, b) => new Date(b.updated) - new Date(a.updated));
        break;
      case SORT_OPTIONS.OLDEST:
        result.sort((a, b) => new Date(a.updated) - new Date(b.updated));
        break;
      case SORT_OPTIONS.TITLE_ASC:
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case SORT_OPTIONS.TITLE_DESC:
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        break;
    }
    return result;
  }, [allPodcasts, searchTerm, sortBy, selectedGenres]);

  // --- Pagination ---
  const totalPages = Math.ceil(processed.length / ITEMS_PER_PAGE);
  const paginated = processed.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  // --- Context value object ---
  const value = {
    // Podcast data
    podcasts: paginated,
    allPodcasts,
    totalPages,
    currentPage,
    setCurrentPage,
    loading,
    error,

    // Filters
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    selectedGenres,
    setSelectedGenres,

    // Theme
    theme,
    setTheme,

    // Favourites
    favourites,
    toggleFavourite,

    // Audio
    currentEpisode,
    setCurrentEpisode,
    isPlaying,
    setIsPlaying,
    progress,
    setProgress,
    duration,
    setDuration,
  };

  return (
    <PodcastContext.Provider value={value}>{children}</PodcastContext.Provider>
  );
}

/**
 * Custom hook to access the podcast context.
 *
 * @returns {Object} The podcast context value.
 * @throws {Error} If used outside of PodcastProvider.
 */
export function usePodcast() {
  const context = useContext(PodcastContext);
  if (!context) {
    throw new Error("usePodcast must be used within a PodcastProvider");
  }
  return context;
}
