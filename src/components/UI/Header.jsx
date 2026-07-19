/** Header – logo, nav links, theme toggle. */
import React from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <Link to="/" className={styles.logo}>
          🎙️ PodcastHub
        </Link>
        <nav className={styles.nav}>
          <Link to="/">Home</Link>
          <Link to="/favourites">❤️ Favourites</Link>
        </nav>
      </div>
      <ThemeToggle />
    </header>
  );
}
