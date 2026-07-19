/**
 * PodcastGrid Component – Responsive grid layout for podcast cards.
 *
 * @component
 * @param {Object} props
 * @param {Array} props.podcasts - Array of podcast objects to display
 * @returns {JSX.Element}
 */
import React from "react";
import PodcastCard from "./PodcastCard";
import styles from "./PodcastGrid.module.css";

export default function PodcastGrid({ podcasts }) {
  if (!podcasts.length) {
    return (
      <div className={styles.empty}>
        <p>No podcasts match your criteria.</p>
        <p>Try adjusting your search or filters.</p>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {podcasts.map((podcast) => (
        <PodcastCard key={podcast.id} podcast={podcast} />
      ))}
    </div>
  );
}
