/**
 * ShowDetail Page – Displays a single podcast show with seasons and episodes.
 * Features:
 * - Fetches show data by ID from the URL parameter
 * - Renders seasons and episodes
 * - Play button for each episode (triggers global audio player)
 * - Favourite button for each episode (saves to localStorage)
 *
 * @component
 * @returns {JSX.Element}
 */
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchShowById, GENRE_MAP } from "../api/fetchPata";
import { formatRelativeDate } from "../utils/formatDate";
import { usePodcast } from "../context/PodcastContext";
import Header from "../components/UI/Header";
import Loading from "../components/UI/Loading";
import Error from "../components/UI/Error";
import styles from "./ShowDetail.module.css";

export default function ShowDetail() {
  // --- Get the dynamic :id from the URL ---
  const { id } = useParams();

  // --- Local state for the show data ---
  const [show, setShow] = useState(null); // Full show data from API
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Global state from PodcastContext ---
  const {
    toggleFavourite, // Toggle favourite status
    favourites, // Array of favourited episodes
    setCurrentEpisode, // Set the episode to play
    setIsPlaying, // Start/pause playback
  } = usePodcast();

  /**
   * Fetches the show data when the component mounts or when the ID changes.
   * Uses an AbortController to prevent memory leaks.
   */
  useEffect(() => {
    let mounted = true; // Track if component is still mounted

    async function loadShow() {
      try {
        setLoading(true);
        setError(null);

        console.log(`📡 Fetching show with ID: ${id}`);
        const data = await fetchShowById(id); // API call
        console.log(`✅ Show data received:`, data);

        if (mounted) {
          setShow(data); // Store the fetched data
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

    // --- Cleanup: prevent state updates on unmounted component ---
    return () => {
      mounted = false;
    };
  }, [id]); // Re-run when the ID changes

  /**
   * Handles playing an episode.
   * Sets the episode data in global context and starts playback.
   *
   * @param {Object} episode - The episode object from the API.
   * @param {string} seasonTitle - Title of the season this episode belongs to.
   */
  const playEpisode = (episode, seasonTitle) => {
    // --- Build the episode object for the audio player ---
    const episodeData = {
      id: episode.id || `ep-${Date.now()}`, // Fallback ID if missing
      title: episode.title || "Untitled Episode",
      showTitle: show.title, // Show title (for display)
      seasonTitle: seasonTitle || "Unknown Season",
      // Use a placeholder audio URL if none is provided
      audioUrl:
        episode.audioUrl ||
        "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    };

    console.log(`🔊 Playing episode:`, episodeData);

    // --- Update global audio state ---
    setCurrentEpisode(episodeData);
    setIsPlaying(true);
  };

  /**
   * Checks if an episode is already favourited.
   * @param {string} episodeId - The unique ID of the episode.
   * @returns {boolean} True if the episode is in favourites.
   */
  const isFavourite = (episodeId) => {
    return favourites.some((fav) => fav.id === episodeId);
  };

  // --- Loading state ---
  if (loading) {
    return <Loading message="Loading show details..." />;
  }

  // --- Error state ---
  if (error) {
    return (
      <Error
        message={`Failed to load show: ${error}`}
        onRetry={() => window.location.reload()}
      />
    );
  }

  // --- Not found state ---
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

  // --- Map genre IDs to names ---
  const genreNames = show.genres
    ? show.genres.map((id) => GENRE_MAP[id] || "Unknown")
    : [];

  // --- Render the show details ---
  return (
    <div className={styles.container}>
      <Header />

      {/* Back button */}
      <Link to="/" className={styles.backLink}>
        ← Back to all shows
      </Link>

      {/* Hero section: image, title, meta, description */}
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
                <div key={season.id || idx} className={styles.seasonCard}>
                  <h3>{seasonTitle}</h3>
                  <p>
                    {episodes.length} episode{episodes.length !== 1 ? "s" : ""}
                  </p>

                  {episodes.length > 0 ? (
                    <ul className={styles.episodeList}>
                      {episodes.map((ep, i) => {
                        const epId = ep.id || `ep-${idx}-${i}`;
                        const fav = isFavourite(epId);

                        return (
                          <li key={epId} className={styles.episodeItem}>
                            <span className={styles.episodeTitle}>
                              {ep.title || `Episode ${i + 1}`}
                            </span>
                            <span className={styles.episodeDuration}>
                              {ep.duration || "—"}
                            </span>

                            {/* Play button */}
                            <button
                              onClick={() => playEpisode(ep, seasonTitle)}
                              className={styles.playBtn}
                              aria-label="Play episode"
                            >
                              ▶️
                            </button>

                            {/* Favourite button */}
                            <button
                              onClick={() =>
                                toggleFavourite({
                                  id: epId,
                                  title: ep.title || `Episode ${i + 1}`,
                                  showTitle: show.title,
                                  seasonTitle: seasonTitle,
                                  audioUrl:
                                    ep.audioUrl ||
                                    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
                                })
                              }
                              className={styles.favBtn}
                              aria-label={
                                fav
                                  ? "Remove from favourites"
                                  : "Add to favourites"
                              }
                            >
                              {fav ? "❤️" : "🤍"}
                            </button>
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
