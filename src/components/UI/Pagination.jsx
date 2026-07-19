import React from "react";
import styles from "./Pagination.module.css";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const maxVisible = 5;
  let visiblePages = pages;
  if (totalPages > maxVisible) {
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, start + maxVisible - 1);
    visiblePages = pages.slice(start - 1, end);
  }

  return (
    <div className={styles.container}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={styles.button}
      >
        Previous
      </button>
      {visiblePages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`${styles.button} ${page === currentPage ? styles.active : ""}`}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={styles.button}
      >
        Next
      </button>
    </div>
  );
}
