/**
 * Error Component – Displays error message with retry option.
 *
 * @component
 * @param {Object} props
 * @param {string} props.message - Error message to display
 * @param {Function} props.onRetry - Handler for retry button click
 * @returns {JSX.Element}
 */
import React from "react";
import styles from "./Error.module.css";

export default function Error({ message, onRetry }) {
  return (
    <div className={styles.container}>
      <p className={styles.title}>Something went wrong</p>
      <p className={styles.message}>{message}</p>
      {onRetry && (
        <button onClick={onRetry} className={styles.button}>
          Try again
        </button>
      )}
    </div>
  );
}
