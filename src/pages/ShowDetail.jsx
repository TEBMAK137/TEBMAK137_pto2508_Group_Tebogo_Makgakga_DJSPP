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
 * @component
 * @returns {JSX.Element}
 */
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchShowById, GENRE_MAP } from "../api/fetchPata";
import { formatRelativeDate } from "../utils/formatDate";
import { PLACEHOLDER_AUDIO } from "../utils/constants";
import { usePodcast } from "../context/PodcastContext";
import Header from "../components/UI/Header";
import Loading from "../components/UI/Loading";
import Error from "../components/UI/Error";
import styles from "./ShowDetail.module.css";

export default function ShowDetail() {
  // Get the dynamic :id from the URL
  const { id } = useParams();

  // Local state for the show data
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Global state from PodcastContext
  const { toggleFavourite, favourites, setCurrentEpisode, setIsPlaying } =
    usePodcast();

  /**
   * Fetch show data when component mounts or ID changes.
   * Uses mounted flag to prevent state updates on unmounted component.
   */
  useEffect(() => {
    let mounted = true;

    async function loadShow() {
      try {
        setLoading(true);
        setError(null);

        console.log(`📡 Fetching show with ID: ${id}`);
        const data = await fetchShowById(id);
        console.log(`✅ Show data received:`, data);

        if (mounted) {
          setShow(data);
        }
      } catch (err) {
        console.error(`❌ Failed to fetch show:`, err);
        if (mounted) {
          setError(err.message || "Failed to load show details.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadShow();

    // Cleanup: prevent state updates on unmounted component
    return () => {
      mounted = false;
    };
  }, [id]);

  /**
   * Play an episode in the global audio player.
   * @param {Object} episode - Episode object from API
   * @param {string} seasonTitle - Title of the season
   */
  const playEpisode = (episode, seasonTitle) => {
    const episodeData = {
      id: `ep-${id}-${episode.episode}`,
      title: episode.title || "Untitled Episode",
      showTitle: show.title,
      seasonTitle: seasonTitle || "Unknown Season",
      // Use the API's file URL or fallback to placeholder
      file: episode.file || PLACEHOLDER_AUDIO,
      description: episode.description || "",
    };

    console.log(`🔊 Playing episode:`, episodeData);

    setCurrentEpisode(episodeData);
    setIsPlaying(true);
  };

  /**
   * Check if an episode is favourited.
   * @param {string} episodeId - Unique episode identifier
   * @returns {boolean}
   */
  const isFavourite = (episodeId) => {
    return favourites.some((fav) => fav.id === episodeId);
  };

  // Loading state
  if (loading) {
    return <Loading message="Loading show details..." />;
  }

  // Error state
  if (error) {
    return (
      <Error
        message={`Failed to load show: ${error}`}
        onRetry={() => window.location.reload()}
      />
    );
  }

  // Not found state
  if (!show) {
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
  }

  // Map genre IDs to names (handle both number arrays and string arrays)
  const genreNames = show.genres
    ? show.genres.map((g) => GENRE_MAP[g] || g)
    : [];

  return (
    <div className={styles.container}>
      <Header />

      {/* Back button */}
      <Link to="/" className={styles.backLink}>
        ← Back to all shows
      </Link>

      {/* Hero section with cover image and show info */}
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
              ⭐ {show.seasons} Season{show.seasons !== 1 ? "s" : ""}
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

      {/* Seasons and Episodes section */}
      <div className={styles.seasons}>
        <h2>📅 Seasons & Episodes</h2>

        {show.seasons && show.seasons.length > 0 ? (
          <div className={styles.seasonList}>
            {show.seasons.map((season, idx) => {
              const seasonTitle = season.title || `Season ${idx + 1}`;
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
                              {/* Play button */}
                              <button
                                onClick={() => playEpisode(ep, seasonTitle)}
                                className={styles.playBtn}
                                aria-label={`Play ${ep.title}`}
                                title="Play episode"
                              >
                                ▶️
                              </button>

                              {/* Favourite button */}
                              <button
                                onClick={() =>
                                  toggleFavourite({
                                    id: epId,
                                    title: ep.title || `Episode ${ep.episode}`,
                                    showTitle: show.title,
                                    seasonTitle: seasonTitle,
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
