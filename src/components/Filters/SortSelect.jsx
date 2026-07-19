/**
 * SortSelect Component – Dropdown to sort podcasts.
 *
 * @component
 * @param {Object} props
 * @param {string} props.value - Currently selected sort option
 * @param {Function} props.onChange - Handler for sort changes
 * @returns {JSX.Element}
 */
import React from "react";
import { SORT_OPTIONS } from "../../utils/constants";
import styles from "./SortSelect.module.css";

export default function SortSelect({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={styles.select}
    >
      <option value={SORT_OPTIONS.NEWEST}>Newest first</option>
      <option value={SORT_OPTIONS.OLDEST}>Oldest first</option>
      <option value={SORT_OPTIONS.TITLE_ASC}>Title A–Z</option>
      <option value={SORT_OPTIONS.TITLE_DESC}>Title Z–A</option>
    </select>
  );
}
