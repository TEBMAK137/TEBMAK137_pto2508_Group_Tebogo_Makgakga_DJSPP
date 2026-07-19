/**
 * Favourites Page – Displays all favourited episodes.
 *
 * Features:
 * - Groups favourites by show title
 * - Sorting options (newest, oldest, title)
 * - Remove button to unfavourite
 * - Shows date added
 * - Play button to play episode
 *
 * @component
 * @returns {JSX.Element}
 */
import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { usePodcast } from "../context/PodcastContext";
import Header from "../components/UI/Header";
import styles from "./Favourites.module.css";

export default function Favourites() {
  const { favourites, toggleFavourite, setCurrentEpisode, setIsPlaying } =
    usePodcast();
  const [sortBy, setSortBy] = useState("newest");

  /**
   * Sort favourites based on selected option.
   */
  const sortedFavourites = useMemo(() => {
    const list = [...favourites];
    switch (sortBy) {
      case "title-asc":
        return list.sort((a, b) => a.title.localeCompare(b.title));
      case "title-desc":
        return list.sort((a, b) => b.title.localeCompare(a.title));
      case "oldest":
        return list.sort(
          (a, b) => new Date(a.dateAdded) - new Date(b.dateAdded),
        );
      default: // 'newest'
        return list.sort(
          (a, b) => new Date(b.dateAdded) - new Date(a.dateAdded),
        );
    }
  }, [favourites, sortBy]);

  /**
   * Group favourites by show title.
   */
  const grouped = sortedFavourites.reduce((acc, fav) => {
    const key = fav.showTitle || "Unknown Show";
    if (!acc[key]) acc[key] = [];
    acc[key].push(fav);
    return acc;
  }, {});

  /**
   * Play a favourited episode.
   */
  const playFavourite = (ep) => {
    setCurrentEpisode({
      id: ep.id,
      title: ep.title,
      showTitle: ep.showTitle,
      seasonTitle: ep.seasonTitle,
      file: ep.file,
    });
    setIsPlaying(true);
  };

  return (
    <div className={styles.container}>
      <Header />

      <h2 className={styles.heading}>❤️ Your Favourites</h2>

      {/* Sorting controls */}
      <div className={styles.controls}>
        <label htmlFor="sortSelect">Sort by: </label>
        <select
          id="sortSelect"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className={styles.sortSelect}
        >
          <option value="newest">Newest added</option>
          <option value="oldest">Oldest added</option>
          <option value="title-asc">Title A–Z</option>
          <option value="title-desc">Title Z–A</option>
        </select>
      </div>

      {/* Empty state */}
      {favourites.length === 0 ? (
        <div className={styles.empty}>
          <p>No favourites yet. Go explore some episodes!</p>
          <Link to="/" className={styles.backLink}>
            Browse shows →
          </Link>
        </div>
      ) : (
        // Grouped list by show
        Object.entries(grouped).map(([showTitle, episodes]) => (
          <div key={showTitle} className={styles.group}>
            <h3>{showTitle}</h3>
            <ul className={styles.episodeList}>
              {episodes.map((ep) => (
                <li key={ep.id} className={styles.episodeItem}>
                  <div className={styles.episodeInfo}>
                    <span className={styles.episodeTitle}>{ep.title}</span>
                    {ep.seasonTitle && (
                      <span className={styles.season}>• {ep.seasonTitle}</span>
                    )}
                    <span className={styles.date}>
                      Added {new Date(ep.dateAdded).toLocaleDateString()}
                    </span>
                  </div>
                  <div className={styles.actions}>
                    <button
                      onClick={() => playFavourite(ep)}
                      className={styles.playBtn}
                      aria-label={`Play ${ep.title}`}
                      title="Play episode"
                    >
                      ▶️
                    </button>
                    <button
                      onClick={() => toggleFavourite(ep)}
                      className={styles.removeBtn}
                      aria-label="Remove from favourites"
                      title="Remove from favourites"
                    >
                      ❌
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}

      <Link to="/" className={styles.backLink}>
        ← Back to Home
      </Link>
    </div>
  );
}
