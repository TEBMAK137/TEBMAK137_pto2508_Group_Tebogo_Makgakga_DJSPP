/**
 * Header Component – Always visible at the top of every page.
 *
 * Contains:
 * - Logo (links to home)
 * - Navigation links (Home, Favourites)
 * - Theme toggle button (light/dark mode)
 *
 * @component
 * @returns {JSX.Element}
 */
import React from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <Link to="/" className={styles.logo}>
          PodcastHub
        </Link>
        <nav className={styles.nav}>
          <Link to="/">Home</Link>
          <Link to="/favourites">Favourites</Link>
        </nav>
      </div>
      <ThemeToggle />
    </header>
  );
}
