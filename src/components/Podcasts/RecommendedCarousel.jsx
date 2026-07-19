/** Horizontal scrolling carousel of top podcasts. */
import React from "react";
import { Link } from "react-router-dom";
import styles from "./RecommendedCarousel.module.css";

export default function RecommendedCarousel({ podcasts }) {
  const recommended = podcasts.slice(0, 10);
  if (recommended.length === 0) return null;

  return (
    <div className={styles.carouselContainer}>
      <h2 className={styles.heading}>🎠 Recommended Shows</h2>
      <div className={styles.carousel}>
        {recommended.map((podcast) => (
          <Link
            to={`/show/${podcast.id}`}
            key={podcast.id}
            className={styles.carouselItem}
          >
            <img
              src={podcast.image}
              alt={podcast.title}
              className={styles.carouselImage}
              loading="lazy"
            />
            <h4 className={styles.carouselTitle}>{podcast.title}</h4>
            <div className={styles.genreTags}>
              {podcast.genreNames.slice(0, 2).map((g) => (
                <span key={g} className={styles.genreTag}>
                  {g}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
