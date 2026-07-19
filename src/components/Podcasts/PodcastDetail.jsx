/**
 * PodcastDetail Component – Displays detailed information for a single podcast.
 * Used as a modal or inline detail view.
 *
 * @component
 * @param {Object} props
 * @param {Object} props.podcast - Podcast data object
 * @returns {JSX.Element}
 */
import React from "react";
import { formatRelativeDate } from "../../utils/formatDate";
import styles from "./PodcastDetail.module.css";

export default function PodcastDetail({ podcast }) {
  if (!podcast) return null;

  return (
    <div className={styles.container}>
      <img
        src={podcast.image}
        alt={`${podcast.title} cover`}
        className={styles.image}
      />
      <div className={styles.info}>
        <h2 className={styles.title}>{podcast.title}</h2>
        <p className={styles.description}>{podcast.description}</p>
        <div className={styles.meta}>
          <span className={styles.badge}>
            {podcast.seasons} Season{podcast.seasons !== 1 ? "s" : ""}
          </span>
          <span className={styles.updated}>
            Updated {formatRelativeDate(podcast.updated)}
          </span>
        </div>
        <div className={styles.genres}>
          {podcast.genreNames.map((genre) => (
            <span key={genre} className={styles.genreTag}>
              {genre}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
