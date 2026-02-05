// src/components/FeaturedCarousel.jsx
import '../FeaturedCarousel/FeaturedCarousel.css';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const FeaturedCarousel = ({ movies, onSelect }) => {
  return (
    <div className="carousel">
      <div className="carousel-track">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="carousel-item"
            onClick={() => onSelect(movie)}
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onSelect(movie)}
          >
            <img
              src={`${IMAGE_BASE_URL}${movie.poster_path}`}
              alt={movie.title}
              draggable={false}
            />
            <div className="carousel-title">{movie.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedCarousel;
