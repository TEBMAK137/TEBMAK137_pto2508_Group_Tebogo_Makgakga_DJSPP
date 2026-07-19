/**
 * Search Bar Component – Real‑time podcast search by title.
 * - Case‑insensitive
 * - Filters results dynamically as user types
 *
 * @component
 * @param {Object} props
 * @param {string} props.value - Current search query
 * @param {Function} props.onChange - Handler for input changes
 * @returns {JSX.Element}
 */
import React from "react";
import styles from "./SearchBar.module.css";

export default function SearchBar({ value, onChange }) {
  return (
    <div className={styles.container}>
      <input
        type="text"
        placeholder="Search by title..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={styles.input}
      />
      {/* Magnifying glass icon */}
      <svg
        className={styles.icon}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>
  );
}
