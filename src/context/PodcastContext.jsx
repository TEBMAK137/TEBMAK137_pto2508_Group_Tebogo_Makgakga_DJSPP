/**
 * Global state provider – podcasts, filters, pagination, theme, audio, favourites.
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

const PodcastContext = createContext(null);

export function PodcastProvider({ children }) {
  // ---- Podcasts & UI state ----
  const [allPodcasts, setAllPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState(SORT_OPTIONS.NEWEST);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  // ---- Theme ----
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light",
  );
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // ---- Favourites ----
  const [favourites, setFavourites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("favourites")) || [];
    } catch {
      return [];
    }
  });
  useEffect(() => {
    localStorage.setItem("favourites", JSON.stringify(favourites));
  }, [favourites]);

  const toggleFavourite = (episode) => {
    setFavourites((prev) => {
      const exists = prev.some((f) => f.id === episode.id);
      if (exists) return prev.filter((f) => f.id !== episode.id);
      return [...prev, { ...episode, dateAdded: new Date().toISOString() }];
    });
  };

  // ---- Audio Player ----
  const [currentEpisode, setCurrentEpisode] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  // ---- Fetch data ----
  useEffect(() => {
    fetchPodcasts(setAllPodcasts, setError, setLoading);
  }, []);

  // Reset page on filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortBy, selectedGenres]);

  // ---- Filter, search, sort ----
  const processed = useMemo(() => {
    let result = [...allPodcasts];
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter((p) => p.title.toLowerCase().includes(term));
    }
    if (selectedGenres.length) {
      result = result.filter((p) =>
        p.genreNames.some((g) => selectedGenres.includes(g)),
      );
    }
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

  const totalPages = Math.ceil(processed.length / ITEMS_PER_PAGE);
  const paginated = processed.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const value = {
    podcasts: paginated,
    allPodcasts,
    totalPages,
    currentPage,
    setCurrentPage,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    selectedGenres,
    setSelectedGenres,
    theme,
    setTheme,
    favourites,
    toggleFavourite,
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

export function usePodcast() {
  const ctx = useContext(PodcastContext);
  if (!ctx) throw new Error("usePodcast must be used within PodcastProvider");
  return ctx;
}
