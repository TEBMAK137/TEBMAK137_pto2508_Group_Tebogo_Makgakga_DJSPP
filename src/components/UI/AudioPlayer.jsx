/** Global fixed audio player at bottom of screen. */
import React, { useRef, useEffect } from 'react';
import { usePodcast } from '../../context/PodcastContext';
import { PLACEHOLDER_AUDIO } from '../../utils/constants';
import styles from './AudioPlayer.module.css';

export default function AudioPlayer() {
  const { currentEpisode, isPlaying, setIsPlaying, progress, setProgress, duration, setDuration } = usePodcast();
  const audioRef = useRef(null);

  // Load new episode when currentEpisode changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentEpisode) return;

    const audioUrl = currentEpisode.file || PLACEHOLDER_AUDIO;
    if (audio.src !== audioUrl) {
      audio.src = audioUrl;
      audio.load();
    }

    const handleCanPlay = () => {
      setDuration(audio.duration || 0);
      if (isPlaying) {
        audio.play().catch(err => { console.warn('Auto-play blocked:', err); setIsPlaying(false); });
      }
    };

    const handleError = () => {
      if (audio.src !== PLACEHOLDER_AUDIO) {
        audio.src = PLACEHOLDER_AUDIO;
        audio.load();
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    audio.addEventListener('canplaythrough', handleCanPlay);
    audio.addEventListener('error', handleError);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('canplaythrough', handleCanPlay);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentEpisode, isPlaying, setDuration, setIsPlaying, setProgress]);

  // Play/pause when isPlaying changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.play().catch(err => { console.warn('Play failed:', err); setIsPlaying(false); });
    } else {
      audio.pause();
    }
  }, [isPlaying, setIsPlaying]);

  // Warn before leaving if playing
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isPlaying) {
        e.preventDefault();
        e.returnValue = 'Audio is playing. Leave?';
        return e.returnValue;
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isPlaying]);

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (audio) {
      setProgress(audio.currentTime);
      if (audio.duration && !isNaN(audio.duration)) setDuration(audio.duration);
    }
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    const newTime = parseFloat(e.target.value);
    if (audio && !isNaN(newTime)) {
      audio.currentTime = newTime;
      setProgress(newTime);
    }
  };

  if (!currentEpisode) return null;

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds) || !isFinite(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className={styles.player}>
      <audio ref={audioRef} onTimeUpdate={handleTimeUpdate} preload="metadata" />
      <div className={styles.info}>
        <span className={styles.title}>{currentEpisode.title}</span>
        <span className={styles.showTitle}> – {currentEpisode.showTitle}</span>
        {currentEpisode.seasonTitle && <span className={styles.seasonTitle}> • {currentEpisode.seasonTitle}</span>}
      </div>
      <div className={styles.controls}>
        <button onClick={() => setIsPlaying(!isPlaying)} className={styles.playButton} aria-label={isPlaying ? 'Pause' : 'Play'}>
          {isPlaying ? '⏸️' : '▶️'}
        </button>
        <input type="range" min="0" max={duration || 100} value={progress || 0} onChange={handleSeek} className={styles.seek} aria-label="Seek" />
        <span className={styles.time}>{formatTime(progress)} / {formatTime(duration)}</span>
      </div>
    </div>
  );
}
