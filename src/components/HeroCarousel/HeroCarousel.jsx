import './HeroCarousel.css';
import { useState, useEffect, useImperativeHandle, forwardRef } from 'react';

const HeroCarousel = forwardRef(({ movies, filter }, ref) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useImperativeHandle(ref, () => ({
    goToNext: () => {
      setCurrentIndex((prev) => (prev + 1) % Math.min(movies.length, 5));
    },
    goToPrevious: () => {
      setCurrentIndex((prev) =>
        prev === 0 ? Math.min(movies.length, 5) - 1 : prev - 1
      );
    },
    goToSlide: (index) => {
      setCurrentIndex(index);
    },
    getCurrentMovie: () => {
      const carouselMovies = movies.slice(0, 5);
      return carouselMovies[currentIndex];
    }
  }), [currentIndex, movies]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [filter]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % Math.min(movies.length, 5));
    }, 5000);

    return () => clearInterval(interval);
  }, [movies.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? Math.min(movies.length, 5) - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.min(movies.length, 5));
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const carouselMovies = movies.slice(0, 5);
  const currentMovie = carouselMovies[currentIndex];

  if (!currentMovie) return null;

  const getFilterTitle = () => {
    switch (filter) {
      case 'popular':
        return 'Popular';
      case 'airing':
        return 'Airing Now';
      default:
        return 'Featured';
    }
  };

  return (
    <div className="hero-carousel">
      <div className="carousel-header">
        <h2 className="carousel-category">{getFilterTitle()}</h2>
      </div>

      <div className="carousel-container">
        {carouselMovies.map((movie, index) => (
          <div
            key={movie.id}
            className={`carousel-slide ${index === currentIndex ? 'active' : ''}`}
            style={{
              backgroundImage: movie.backdrop_path
                ? `url(https://image.tmdb.org/t/p/w1280${movie.backdrop_path})`
                : 'none',
            }}
          >
            <div className="carousel-overlay">
              <h3 className="carousel-title">{movie.title || movie.name}</h3>
              <div className="carousel-rating">
                <span>⭐ {movie.vote_average?.toFixed(1)}</span>
                {movie.release_date && (
                  <span className="carousel-date">
                    📅 {movie.release_date.split('-')[0]}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
        <button
          className="carousel-nav prev"
          onClick={goToPrevious}
          aria-label="Previous slide"
        >
          ‹
        </button>
        <button
          className="carousel-nav next"
          onClick={goToNext}
          aria-label="Next slide"
        >
          ›
        </button>
        <div className="carousel-dots">
          {carouselMovies.map((_, index) => (
            <button
              key={index}
              className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
});

HeroCarousel.displayName = 'HeroCarousel';

export default HeroCarousel;