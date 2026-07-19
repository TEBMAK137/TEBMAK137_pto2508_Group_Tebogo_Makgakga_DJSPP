import React from "react";
import { GENRE_MAP } from "../../api/fetchPata";
import styles from "./GenreFilter.module.css";

export default function GenreFilter({ selectedGenres, onChange }) {
  const allGenres = Object.values(GENRE_MAP);

  const toggleGenre = (genre) => {
    if (selectedGenres.includes(genre)) {
      onChange(selectedGenres.filter((g) => g !== genre));
    } else {
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
            className={`${styles.button} ${selectedGenres.includes(genre) ? styles.active : ""}`}
          >
            {genre}
          </button>
        ))}
      </div>
    </div>
  );
}
