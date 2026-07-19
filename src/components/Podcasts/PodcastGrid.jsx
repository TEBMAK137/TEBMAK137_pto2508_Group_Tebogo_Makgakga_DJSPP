import React from "react";
import PodcastCard from "./PodcastCard";
import styles from "./PodcastGrid.module.css";

export default function PodcastGrid({ podcasts }) {
  if (!podcasts.length) {
    return <div className={styles.empty}>No podcasts match your criteria.</div>;
  }
  return (
    <div className={styles.grid}>
      {podcasts.map((podcast) => (
        <PodcastCard key={podcast.id} podcast={podcast} />
      ))}
    </div>
  );
}
