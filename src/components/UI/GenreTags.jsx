/** Display genre tags for a podcast. */
import React from 'react';
import styles from './GenreTags.module.css';

export default function GenreTags({ genres }) {
  return (
    <div className={styles.container}>
      {genres.map(genre => (
        <span key={genre} className={styles.tag}>{genre}</span>
      ))}
    </div>
  );
}
