// /** Formats an ISO date: relative for recent, full for older. */
// export function formatRelativeDate(isoDate) {
//   const date = new Date(isoDate);
//   if (isNaN(date.getTime())) return "Unknown date";

//   const now = new Date();
//   const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

//   if (diffDays > 365) {
//     return date.toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     });
//   }

//   if (diffDays <= 0) return "Today";
//   if (diffDays === 1) return "1 day ago";
//   if (diffDays < 7) return `${diffDays} days ago`;
//   const diffWeeks = Math.floor(diffDays / 7);
//   if (diffWeeks === 1) return "1 week ago";
//   if (diffWeeks < 5) return `${diffWeeks} weeks ago`;
//   const diffMonths = Math.floor(diffDays / 30);
//   if (diffMonths === 1) return "1 month ago";
//   if (diffMonths < 12) return `${diffMonths} months ago`;
//   return date.toLocaleDateString("en-US", {
//     year: "numeric",
//     month: "short",
//     day: "numeric",
//   });
// }
