/**
 * GenreTags Component – Displays a list of genre tags.
 *
 * @component
 * @param {Object} props
 * @param {string[]} props.genres - Array of genre names
 * @returns {JSX.Element}
 */
import React from "react";
import styles from "./GenreTags.module.css";

export default function GenreTags({ genres }) {
  if (!genres || genres.length === 0) return null;

  return (
    <div className={styles.container}>
      {genres.map((genre) => (
        <span key={genre} className={styles.tag}>
          {genre}
        </span>
      ))}
    </div>
  );
}
