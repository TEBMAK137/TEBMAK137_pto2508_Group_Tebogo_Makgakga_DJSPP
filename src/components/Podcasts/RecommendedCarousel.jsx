import React, { useRef } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "./RecommendedCarousel.module.css";

export default function RecommendedCarousel({ podcasts }) {
  const sliderRef = useRef(null);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 640, settings: { slidesToShow: 2 } },
      { breakpoint: 400, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className={styles.carouselContainer}>
      <h2>🎠 Recommended Shows</h2>
      <Slider ref={sliderRef} {...settings}>
        {podcasts.slice(0, 10).map((podcast) => (
          <div key={podcast.id} className={styles.carouselItem}>
            <Link to={`/show/${podcast.id}`}>
              <img
                src={podcast.image}
                alt={podcast.title}
                className={styles.carouselImage}
              />
              <h4>{podcast.title}</h4>
              <div className={styles.genreTags}>
                {podcast.genreNames.slice(0, 2).map((g) => (
                  <span key={g} className={styles.genreTag}>
                    {g}
                  </span>
                ))}
              </div>
            </Link>
          </div>
        ))}
      </Slider>
    </div>
  );
}
