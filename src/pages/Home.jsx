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

  if (loading) return <Loading />;
  if (error)
    return <Error message={error} onRetry={() => window.location.reload()} />;

  return (
    <div className={styles.container}>
      <Header />
      <RecommendedCarousel podcasts={allPodcasts} />
      <div className={styles.controls}>
        <SearchBar value={searchTerm} onChange={setSearchTerm} />
        <SortSelect value={sortBy} onChange={setSortBy} />
      </div>
      <GenreFilter
        selectedGenres={selectedGenres}
        onChange={setSelectedGenres}
      />
      <PodcastGrid podcasts={podcasts} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
