/**
 * Home Page – Main landing page with podcast discovery.
 *
 * Features:
 * - Recommended carousel at top
 * - Search bar
 * - Sort dropdown
 * - Genre filter buttons
 * - Responsive podcast grid
 * - Pagination
 *
 * @component
 * @returns {JSX.Element}
 */
import React from "react";
import { usePodcast } from "../context/PodcastContext";
import Header from "../components/UI/Header";
import SearchBar from "../components/Filters/SearchBar";
import SortSelect from "../components/Filters/SortSelect";
import GenreFilter from "../components/Filters/GenreFilter";
import PodcastGrid from "../components/Podcasts/PodcastGrid";
import RecommendedCarousel from "../components/Podcasts/RecommendedCarousel";
import Pagination from "../components/UI/Pagination";
import Loading from "../components/UI/Loading";
import Error from "../components/UI/Error";
import styles from "./Home.module.css";

export default function Home() {
  const {
    podcasts,
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
    allPodcasts,
  } = usePodcast();

  // Show loading spinner while fetching
  if (loading) return <Loading message="Loading podcasts..." />;

  // Show error message if fetch failed
  if (error && podcasts.length === 0) {
    return <Error message={error} onRetry={() => window.location.reload()} />;
  }

  return (
    <div className={styles.container}>
      <Header />

      {/* Recommended carousel - shows top podcasts */}
      <RecommendedCarousel podcasts={allPodcasts} />

      {/* Search and sort controls */}
      <div className={styles.controls}>
        <SearchBar value={searchTerm} onChange={setSearchTerm} />
        <SortSelect value={sortBy} onChange={setSortBy} />
      </div>

      {/* Genre filter buttons */}
      <GenreFilter
        selectedGenres={selectedGenres}
        onChange={setSelectedGenres}
      />

      {/* Podcast grid */}
      <PodcastGrid podcasts={podcasts} />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
