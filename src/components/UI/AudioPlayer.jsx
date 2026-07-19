/**
 * AudioPlayer Component – Global fixed audio player at bottom of screen.
 *
 * Features:
 * - Play/Pause toggle
 * - Progress bar with seek functionality
 * - Displays current episode title, show, and season
 * - Persists across page navigation
 * - Handles audio loading errors gracefully
 * - Warns user on page reload during playback
 *
 * @component
 * @returns {JSX.Element}
 */
import React, { useRef, useEffect } from "react";
import { usePodcast } from "../../context/PodcastContext";
import { PLACEHOLDER_AUDIO } from "../../utils/constants";
import styles from "./AudioPlayer.module.css";

export default function AudioPlayer() {
  // Get global audio state from context
  const {
    currentEpisode,
    isPlaying,
    setIsPlaying,
    progress,
    setProgress,
    duration,
    setDuration,
  } = usePodcast();

  // Reference to the actual HTML <audio> element
  const audioRef = useRef(null);

  /**
   * Effect: Load new episode when currentEpisode changes.
   * Sets the audio source and attempts to play.
   */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentEpisode) return;

    console.log(`Loading audio for: ${currentEpisode.title}`);

    // Determine audio URL - use episode file or fallback
    const audioUrl =
      currentEpisode.file || currentEpisode.audioUrl || PLACEHOLDER_AUDIO;

    // Only set src if it's different (prevents unnecessary reloads)
    if (audio.src !== audioUrl) {
      audio.src = audioUrl;
      audio.load();
    }

    // Handle successful loading
    const handleCanPlay = () => {
      console.log("Audio loaded successfully");
      setDuration(audio.duration || 0);
      if (isPlaying) {
        audio.play().catch((err) => {
          console.warn("Auto-play blocked:", err);
          setIsPlaying(false);
        });
      }
    };

    // Handle errors
    const handleError = () => {
      console.error("Audio loading error, trying fallback...");
      if (audio.src !== PLACEHOLDER_AUDIO) {
        audio.src = PLACEHOLDER_AUDIO;
        audio.load();
      }
    };

    // Handle track ending
    const handleEnded = () => {
      console.log("Episode finished");
      setIsPlaying(false);
      setProgress(0);
    };

    audio.addEventListener("canplaythrough", handleCanPlay);
    audio.addEventListener("error", handleError);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("canplaythrough", handleCanPlay);
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentEpisode, isPlaying, setDuration, setIsPlaying, setProgress]);

  /**
   * Effect: Control playback (play/pause) when isPlaying changes.
   */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      console.log("Playing audio");
      audio.play().catch((err) => {
        console.warn("Play failed:", err);
        setIsPlaying(false);
      });
    } else {
      console.log("Pausing audio");
      audio.pause();
    }
  }, [isPlaying, setIsPlaying]);

  /**
   * Effect: Warn user before leaving page if audio is playing.
   */
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isPlaying) {
        e.preventDefault();
        e.returnValue =
          "Audio is currently playing. Are you sure you want to leave?";
        return e.returnValue;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isPlaying]);

  /**
   * Update progress state as audio plays.
   */
  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (audio) {
      setProgress(audio.currentTime);
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    }
  };

  /**
   * Handle user seeking via the progress slider.
   * @param {Event} e - Input event from range slider
   */
  const handleSeek = (e) => {
    const audio = audioRef.current;
    const newTime = parseFloat(e.target.value);
    if (audio && !isNaN(newTime)) {
      audio.currentTime = newTime;
      setProgress(newTime);
    }
  };

  // If no episode is selected, don't render the player
  if (!currentEpisode) {
    return null;
  }

  /**
   * Format seconds into MM:SS display.
   * @param {number} seconds - Time in seconds
   * @returns {string} Formatted time string
   */
  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds) || !isFinite(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div className={styles.player}>
      {/* Hidden audio element - the actual audio engine */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        preload="metadata"
      />

      {/* Episode info display */}
      <div className={styles.info}>
        <span className={styles.title}>{currentEpisode.title}</span>
        <span className={styles.showTitle}> – {currentEpisode.showTitle}</span>
        {currentEpisode.seasonTitle && (
          <span className={styles.seasonTitle}>
            {" "}
            • {currentEpisode.seasonTitle}
          </span>
        )}
      </div>

      {/* Playback controls */}
      <div className={styles.controls}>
        {/* Play/Pause button */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className={styles.playButton}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? "⏸️" : "▶️"}
        </button>

        {/* Progress slider */}
        <input
          type="range"
          min="0"
          max={duration || 100}
          value={progress || 0}
          onChange={handleSeek}
          className={styles.seek}
          aria-label="Seek through episode"
        />

        {/* Time display */}
        <span className={styles.time}>
          {formatTime(progress)} / {formatTime(duration)}
        </span>
      </div>
    </div>
  );
}
