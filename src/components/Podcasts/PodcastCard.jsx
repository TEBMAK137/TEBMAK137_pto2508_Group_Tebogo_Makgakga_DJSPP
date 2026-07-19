/**
 * PodcastCard Component – Displays a single podcast preview card.
 *
 * Features:
 * - Clickable card linking to show detail page
 * - Lazy-loaded cover image
 * - Genre tags
 * - Season count badge
 * - Relative update date
 *
 * @component
 * @param {Object} props
 * @param {Object} props.podcast - Podcast data object
 * @returns {JSX.Element}
 */
import React from "react";
import { Link } from "react-router-dom";
import { formatRelativeDate } from "../../utils/formatDate";
import styles from "./PodcastCard.module.css";

export default function PodcastCard({ podcast }) {
  return (
    <Link to={`/show/${podcast.id}`} className={styles.cardLink}>
      <article className={styles.card}>
        <img
          src={podcast.image}
          alt={`${podcast.title} cover`}
          className={styles.image}
          loading="lazy"
        />
        <div className={styles.content}>
          <h3 className={styles.title}>{podcast.title}</h3>
          <div className={styles.meta}>
            <span className={styles.badge}>
              {podcast.seasons} Season{podcast.seasons !== 1 ? "s" : ""}
            </span>
          </div>
          <div className={styles.genres}>
            {podcast.genreNames.map((genre) => (
              <span key={genre} className={styles.genreTag}>
                {genre}
              </span>
            ))}
          </div>
          <p className={styles.updated}>
            Updated {formatRelativeDate(podcast.updated)}
          </p>
        </div>
      </article>
    </Link>
  );
}
