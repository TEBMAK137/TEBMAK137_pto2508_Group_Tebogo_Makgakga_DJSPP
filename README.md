# DJS05 – React Podcast App with Routing, Detail Pages, and Context State

This project is a **React-based podcast explorer** that builds upon DJS04 by adding **multi-page routing**, **podcast detail views**, and further improving the use of shared context state and component organization.

## Key Features

- **Routing (React Router DOM)**  
  Uses `react-router-dom` for navigation between pages:
  - `/` – Home page with search, filters, sorting, and pagination
  - `/show/:id` – Detailed view of a selected podcast, including episode listing

- **Podcast Context (Global State)**  
  Provides shared state using `PodcastContext`:
  - Manages full podcast dataset, filters, search, sort, pagination
  - Makes data accessible across pages

- **Search**
  - Case-insensitive search by podcast title
  - Updates results dynamically

- **Sort Options**
  - Default
  - Newest
  - Oldest
  - Title A → Z
  - Title Z → A

- **Genre Filter**
  - Filters podcasts by genre
  - Genre data loaded from static source

- **Pagination**
  - Dynamic per-page item calculation based on screen size
  - Defaults to 10 per page on smaller screens

- **Detail View**
  - Fetches full podcast data when visiting `/show/:id`
  - Displays title, image, description, genre tags, and seasons

## Project Structure

```
DJSPP/
├── .gitignore
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── README.md
├── vite.config.js
└── src/
    ├── api/
    │   └── fetchPata.js          (podcast API + fallback)
    ├── components/
    │   ├── Filters/
    │   │   ├── GenreFilter.jsx
    │   │   ├── GenreFilter.module.css
    │   │   ├── SearchBar.jsx
    │   │   ├── SearchBar.module.css
    │   │   ├── SortSelect.jsx
    │   │   └── SortSelect.module.css
    │   ├── Podcasts/
    │   │   ├── PodcastCard.jsx
    │   │   ├── PodcastCard.module.css
    │   │   ├── PodcastGrid.jsx
    │   │   ├── PodcastGrid.module.css
    │   │   ├── RecommendedCarousel.jsx
    │   │   └── RecommendedCarousel.module.css
    │   ├── UI/
    │   │   ├── AudioPlayer.jsx
    │   │   ├── AudioPlayer.module.css
    │   │   ├── Error.jsx
    │   │   ├── Error.module.css
    │   │   ├── Header.jsx
    │   │   ├── Header.module.css
    │   │   ├── Loading.jsx
    │   │   ├── Loading.module.css
    │   │   ├── Pagination.jsx
    │   │   ├── Pagination.module.css
    │   │   └── ThemeToggle.jsx
    │   └── index.js              (exports all components)
    ├── context/
    │   └── PodcastContext.jsx    (global state: podcasts, filters, theme, player, favourites)
    ├── pages/
    │   ├── Favourites.jsx
    │   ├── Favourites.module.css
    │   ├── Home.jsx
    │   ├── Home.module.css
    │   ├── ShowDetail.jsx
    │   └── ShowDetail.module.css
    ├── utils/
    │   └── formatDate.js
    ├── App.jsx
    ├── App.module.css
    ├── data.js
    ├── index.css
    └── main.jsx
```

## How It Works

- On initial load, all podcast data is fetched once via `PodcastProvider`.
- Components like `SearchBar`, `GenreFilter`, and `SortSelect` update shared context state.
- Filtered and sorted results are paginated and displayed in `PodcastGrid`.
- When a podcast card is clicked, the app navigates to `/show/:id`, fetching full podcast details.

## How to Run

1. Clone the repo or download the project files.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:
   ```
    npm run dev
   ```
4. Visit http://localhost:5173 in your browser.
