/**
 * GenreFilter Component – Toggle buttons to filter podcasts by genre.
 *
 * Features:
 * - Multiple genres can be selected at once
 * - Visual active/inactive state
 * - Toggle behavior (click again to deselect)
 *
 * @component
 * @param {Object} props
 * @param {string[]} props.selectedGenres - Array of currently selected genre names
 * @param {Function} props.onChange - Handler when genres change
 * @returns {JSX.Element}
 */
import React from "react";
import { GENRE_MAP } from "../../api/fetchPata";
import styles from "./GenreFilter.module.css";

export default function GenreFilter({ selectedGenres, onChange }) {
  // Get all genre names from the map
  const allGenres = Object.values(GENRE_MAP);

  /**
   * Toggle a genre on/off.
   * @param {string} genre - The genre name to toggle
   */
  const toggleGenre = (genre) => {
    if (selectedGenres.includes(genre)) {
      // Remove if already selected
      onChange(selectedGenres.filter((g) => g !== genre));
    } else {
      // Add if not selected
      onChange([...selectedGenres, genre]);
    }
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.label}>Filter by genre</h3>
      <div className={styles.buttonGroup}>
        {allGenres.map((genre) => (
          <button
            key={genre}
            onClick={() => toggleGenre(genre)}
            className={`${styles.button} ${
              selectedGenres.includes(genre) ? styles.active : ""
            }`}
            aria-pressed={selectedGenres.includes(genre)}
          >
            {genre}
          </button>
        ))}
      </div>
    </div>
  );
}
