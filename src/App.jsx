/**
 * App Component – Root component with routing and global audio player.
 *
 * Routes:
 * - / → Home page
 * - /show/:id → Show detail page
 * - /favourites → Favourites page
 *
 * Features:
 * - PodcastProvider wraps entire app for global state
 * - AudioPlayer is fixed at bottom and persists across routes
 *
 * @component
 * @returns {JSX.Element}
 */
import React from "react";
import { Routes, Route } from "react-router-dom";
import { PodcastProvider } from "./context/PodcastContext";
import Home from "./pages/Home";
import ShowDetail from "./pages/ShowDetail";
import Favourites from "./pages/Favourites";
import AudioPlayer from "./components/UI/AudioPlayer";
import styles from "./App.module.css";

export default function App() {
  return (
    <PodcastProvider>
      <div className={styles.app}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/show/:id" element={<ShowDetail />} />
          <Route path="/favourites" element={<Favourites />} />
        </Routes>
        <AudioPlayer />
      </div>
    </PodcastProvider>
  );
}
