/**
 * Formats an ISO date string into a human-readable relative date.
 * Shows "Today", "X days ago", "X weeks ago", "X months ago" for recent dates,
 * and a full formatted date for older entries.
 *
 * @param {string} isoDate - ISO 8601 date string (e.g., "2022-11-03T07:00:00.000Z")
 * @returns {string} Human-readable relative date
 */
export function formatRelativeDate(isoDate) {
  const date = new Date(isoDate);

  // Validate the date
  if (isNaN(date.getTime())) {
    return "Unknown date";
  }

  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  // If more than a year old, show full date
  if (diffDays > 365) {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  // Relative formatting for recent dates
  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "1 day ago";
  if (diffDays < 7) return `${diffDays} days ago`;

  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks === 1) return "1 week ago";
  if (diffWeeks < 5) return `${diffWeeks} weeks ago`;

  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths === 1) return "1 month ago";
  if (diffMonths < 12) return `${diffMonths} months ago`;

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
