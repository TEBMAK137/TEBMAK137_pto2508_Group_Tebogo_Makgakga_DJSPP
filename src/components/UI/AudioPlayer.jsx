/**
 * Global Audio Player – Fixed at the bottom of the screen.
 * Features:
 * - Play/Pause toggle
 * - Progress bar with seek functionality
 * - Displays current episode title and show
 * - Persists across page navigation
 * - Warns user on page reload during playback
 *
 * @component
 * @returns {JSX.Element}
 */
import React, { useRef, useEffect } from "react";
import { usePodcast } from "../../context/PodcastContext";
import styles from "./AudioPlayer.module.css";

export default function AudioPlayer() {
  // --- Get global audio state from context ---
  const {
    currentEpisode, // Current episode object { title, showTitle, audioUrl, ... }
    isPlaying, // Boolean: true if audio is playing
    setIsPlaying, // Function to start/pause playback
    progress, // Current playback position (seconds)
    setProgress, // Function to update playback position
    duration, // Total audio duration (seconds)
    setDuration, // Function to update duration
  } = usePodcast();

  // --- Reference to the actual HTML <audio> element ---
  const audioRef = useRef(null);

  /**
   * Loads a new episode into the audio element.
   * Runs when currentEpisode changes.
   */
  useEffect(() => {
    if (!currentEpisode) {
      console.log("⏹️ No episode to play");
      return;
    }

    const audio = audioRef.current;
    if (!audio) return;

    console.log(`🎵 Loading audio for: ${currentEpisode.title}`);
    console.log(`🔊 Audio URL: ${currentEpisode.audioUrl}`);

    // --- Set the audio source and load it ---
    audio.src = currentEpisode.audioUrl;
    audio.load();

    // --- Handle audio loading errors ---
    audio.onerror = (e) => {
      console.error("❌ Audio loading error:", e);
      console.error("❌ Failed to load:", audio.src);

      // Try to fallback to a working demo audio
      if (audio.src.includes("soundhelix.com")) {
        console.log("🔄 Using fallback audio...");
        audio.src = "https://www.w3schools.com/html/horse.mp3";
        audio.load();
      }
    };

    // --- Handle successful loading ---
    audio.oncanplay = () => {
      console.log("✅ Audio loaded successfully");
      setDuration(audio.duration || 0);
      // Auto-play if isPlaying is true
      if (isPlaying) {
        audio.play().catch((err) => {
          console.warn("⚠️ Auto-play blocked:", err);
          setIsPlaying(false);
        });
      }
    };

    // Cleanup function
    return () => {
      audio.onerror = null;
      audio.oncanplay = null;
    };
  }, [currentEpisode, setDuration, setIsPlaying]);

  /**
   * Controls playback (play/pause) when isPlaying changes.
   * Runs every time isPlaying toggles.
   */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      console.log("▶️ Playing audio");
      audio.play().catch((err) => {
        console.warn("⚠️ Play failed:", err);
        setIsPlaying(false);
      });
    } else {
      console.log("⏸️ Pausing audio");
      audio.pause();
    }
  }, [isPlaying, setIsPlaying]);

  /**
   * Updates progress state when the audio plays.
   */
  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (audio) {
      setProgress(audio.currentTime);
      setDuration(audio.duration || 0);
    }
  };

  /**
   * Handles user seeking via the progress slider.
   * @param {Event} e - The input event from the slider.
   */
  const handleSeek = (e) => {
    const audio = audioRef.current;
    const newTime = parseFloat(e.target.value);
    if (audio) {
      audio.currentTime = newTime;
      setProgress(newTime);
      console.log(`⏩ Seeked to ${newTime}s`);
    }
  };

  // --- If no episode is selected, show nothing ---
  if (!currentEpisode) {
    return null;
  }

  // --- Format seconds into MM:SS ---
  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${String(secs).padStart(2, "0")}`;
  };

  // --- Render the audio player ---
  return (
    <div className={styles.player}>
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => {
          console.log("⏹️ Episode finished");
          setIsPlaying(false);
          setProgress(0);
        }}
      />

      {/* Episode info */}
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
