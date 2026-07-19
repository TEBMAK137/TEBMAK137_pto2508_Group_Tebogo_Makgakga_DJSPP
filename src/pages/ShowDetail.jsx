/**
 * ShowDetail Page – Displays a single podcast show with seasons and episodes.
 *
 * Features:
 * - Fetches show data by ID from URL parameter
 * - Renders seasons and episodes
 * - Play button for each episode (triggers global audio player)
 * - Favourite button for each episode (saves to localStorage)
 * - Back navigation to home
 *
 *
 */

import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchShowById } from "../api/fetchPata";
import { formatRelativeDate } from "../utils/formatDate";
import { PLACEHOLDER_AUDIO } from "../utils/constants";
import { usePodcast } from "../context/PodcastContext";
import Header from "../components/UI/Header";
import Loading from "../components/UI/Loading";
import Error from "../components/UI/Error";
import styles from "./ShowDetail.module.css";

export default function ShowDetail() {
  const { id } = useParams();
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toggleFavourite, favourites, setCurrentEpisode, setIsPlaying } =
    usePodcast();

  useEffect(() => {
    let mounted = true;
    async function loadShow() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchShowById(id);
        if (mounted) setShow(data);
      } catch (err) {
        if (mounted) setError(err.message || "Failed to load show details.");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadShow();
    return () => {
      mounted = false;
    };
  }, [id]);

  const playEpisode = (episode, seasonTitle) => {
    const episodeData = {
      id: `ep-${id}-${episode.episode}`,
      title: episode.title || "Untitled Episode",
      showTitle: show.title,
      seasonTitle: seasonTitle || "Unknown Season",
      file: episode.file || PLACEHOLDER_AUDIO,
      description: episode.description || "",
    };
    setCurrentEpisode(episodeData);
    setIsPlaying(true);
  };

  const isFavourite = (episodeId) =>
    favourites.some((fav) => fav.id === episodeId);

  if (loading) return <Loading message="Loading show details..." />;
  if (error)
    return (
      <Error
        message={`Failed to load show: ${error}`}
        onRetry={() => window.location.reload()}
      />
    );
  if (!show)
    return (
      <div className={styles.container}>
        <Header />
        <div className={styles.error}>
          <p>⚠️ Show not found</p>
          <Link to="/" className={styles.backLink}>
            ← Back to Home
          </Link>
        </div>
      </div>
    );

  // Genres are already strings in the API response for show detail
  const genreNames = show.genres || [];

  return (
    <div className={styles.container}>
      <Header />
      <Link to="/" className={styles.backLink}>
        ← Back to all shows
      </Link>
      <div className={styles.hero}>
        <img
          src={show.image}
          alt={`${show.title} cover`}
          className={styles.cover}
          loading="lazy"
        />
        <div className={styles.info}>
          <h1>{show.title}</h1>
          <div className={styles.meta}>
            <span className={styles.badge}>
              ⭐ {show.seasons?.length || 0} Season
              {show.seasons?.length !== 1 ? "s" : ""}
            </span>
            <span className={styles.badge}>
              🕒 Updated {formatRelativeDate(show.updated)}
            </span>
          </div>
          <div className={styles.genres}>
            {genreNames.map((g) => (
              <span key={g} className={styles.genreTag}>
                {g}
              </span>
            ))}
          </div>
          <p className={styles.description}>{show.description}</p>
        </div>
      </div>
      <div className={styles.seasons}>
        <h2>📅 Seasons & Episodes</h2>
        {show.seasons && show.seasons.length > 0 ? (
          <div className={styles.seasonList}>
            {show.seasons.map((season, idx) => {
              const seasonTitle =
                season.title || `Season ${season.season || idx + 1}`;
              const episodes = season.episodes || [];
              return (
                <div key={season.season || idx} className={styles.seasonCard}>
                  <h3>{seasonTitle}</h3>
                  <p className={styles.episodeCount}>
                    {episodes.length} episode{episodes.length !== 1 ? "s" : ""}
                  </p>
                  {episodes.length > 0 ? (
                    <ul className={styles.episodeList}>
                      {episodes.map((ep) => {
                        const epId = `ep-${id}-${ep.episode}`;
                        const fav = isFavourite(epId);
                        return (
                          <li key={epId} className={styles.episodeItem}>
                            <div className={styles.episodeInfo}>
                              <span className={styles.episodeNumber}>
                                Ep {ep.episode}
                              </span>
                              <span className={styles.episodeTitle}>
                                {ep.title || `Episode ${ep.episode}`}
                              </span>
                            </div>
                            <div className={styles.episodeActions}>
                              <button
                                onClick={() => playEpisode(ep, seasonTitle)}
                                className={styles.playBtn}
                                aria-label={`Play ${ep.title}`}
                                title="Play episode"
                              >
                                ▶️
                              </button>
                              <button
                                onClick={() =>
                                  toggleFavourite({
                                    id: epId,
                                    title: ep.title || `Episode ${ep.episode}`,
                                    showTitle: show.title,
                                    seasonTitle,
                                    file: ep.file || PLACEHOLDER_AUDIO,
                                  })
                                }
                                className={styles.favBtn}
                                aria-label={
                                  fav
                                    ? "Remove from favourites"
                                    : "Add to favourites"
                                }
                                title={
                                  fav
                                    ? "Remove from favourites"
                                    : "Add to favourites"
                                }
                              >
                                {fav ? "❤️" : "🤍"}
                              </button>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className={styles.noEpisodes}>No episodes listed.</p>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p>No season details available.</p>
        )}
      </div>
    </div>
  );
}
