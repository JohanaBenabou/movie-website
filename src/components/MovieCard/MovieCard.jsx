import '../MovieCard/MovieCard.css';

const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

const MovieCard = ({ movie, focused, onClick }) => {
  return (
    <div
      className={`movie-card ${focused ? 'focused' : ''}`}
      onClick={onClick}
    >
      <div className="movie-poster">
        {movie.poster_path && (
          <img
            src={`${IMAGE_BASE}${movie.poster_path}`}
            alt={movie.title}
          />
        )}
      </div>

      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
        <span className="movie-year">
          {movie.release_date?.slice(0, 4)}
        </span>
      </div>
    </div>
  );
};

export default MovieCard;
