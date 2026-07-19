# 🎧 PodcastHub – DJS05 Final

A feature‑rich React podcast discovery app with global audio player, favourites, recommended carousel, and theme toggle.

## Features

- 🏠 Homepage – search, filter, sort, paginate
- 🎙️ Show Detail – seasons, episodes, play audio
- ❤️ Favourites – save episodes, group by show, sort
- 🎠 Recommended Carousel – swipeable on home
- 🔊 Global Audio Player – fixed footer, persists across pages
- 🌗 Theme Toggle – light/dark mode with localStorage
- 📱 Fully responsive

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
