/**
 * Loading Component – Spinner with message while data loads.
 *
 * @component
 * @param {Object} props
 * @param {string} [props.message="Loading..."] - Message to display
 * @returns {JSX.Element}
 */
import React from "react";
import styles from "./Loading.module.css";

export default function Loading({ message = "Loading..." }) {
  return (
    <div className={styles.container}>
      <div className={styles.spinner}></div>
      <p>{message}</p>
    </div>
  );
}
