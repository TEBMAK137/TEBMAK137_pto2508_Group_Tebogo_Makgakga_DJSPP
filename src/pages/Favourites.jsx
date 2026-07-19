/**
 * Favourites Page – Displays all favourited episodes.
 * Features:
 * - Groups favourites by show title
 * - Sorting options (newest, oldest, title)
 * - Remove button to unfavourite
 * - Shows date added
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
  // --- Get favourites and toggle function from context ---
  const { favourites, toggleFavourite } = usePodcast();
  const [sortBy, setSortBy] = useState("newest");

  /**
   * Sorts favourites based on the selected sort option.
   * Uses useMemo to avoid re‑sorting on every render.
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
   * Groups favourites by show title.
   * @type {Object<string, Array>}
   */
  const grouped = sortedFavourites.reduce((acc, fav) => {
    const key = fav.showTitle || "Unknown Show";
    if (!acc[key]) acc[key] = [];
    acc[key].push(fav);
    return acc;
  }, {});

  return (
    <div className={styles.container}>
      <Header />

      <h2>❤️ Your Favourites</h2>

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
        // Grouped list
        Object.entries(grouped).map(([showTitle, episodes]) => (
          <div key={showTitle} className={styles.group}>
            <h3>{showTitle}</h3>
            <ul>
              {episodes.map((ep) => (
                <li key={ep.id} className={styles.episodeItem}>
                  <span>
                    {ep.title}
                    {ep.seasonTitle && (
                      <span className={styles.season}> • {ep.seasonTitle}</span>
                    )}
                  </span>
                  <span className={styles.date}>
                    Added {new Date(ep.dateAdded).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => toggleFavourite(ep)}
                    className={styles.removeBtn}
                    aria-label="Remove from favourites"
                  >
                    ❌
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}
