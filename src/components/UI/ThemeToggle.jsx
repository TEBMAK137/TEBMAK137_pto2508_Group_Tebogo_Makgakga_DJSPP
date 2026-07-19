/**
 * ThemeToggle Component – Switches between light and dark mode.
 *
 * - Reads current theme from PodcastContext
 * - Persists selection to localStorage via PodcastProvider
 * - Updates the entire app UI via CSS custom properties
 *
 * @component
 * @returns {JSX.Element}
 */
import React from "react";
import { usePodcast } from "../../context/PodcastContext";
import styles from "./ThemeToggle.module.css";

export default function ThemeToggle() {
  const { theme, setTheme } = usePodcast();

  /**
   * Toggles between 'light' and 'dark' themes.
   */
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className={styles.toggle}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
}
