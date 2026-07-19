/** PodcastDetail – can be used as a modal or inline detail view. */
import React from "react";
import styles from "./PodcastDetail.module.css";

export default function PodcastDetail({ podcast }) {
  return (
    <div className={styles.detail}>
      <h2>{podcast?.title}</h2>
      <p>{podcast?.description}</p>
    </div>
  );
}
