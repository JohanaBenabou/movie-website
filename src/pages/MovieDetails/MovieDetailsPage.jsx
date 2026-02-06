import './MovieDetailsPage.css';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchMovieDetailsApi } from '../../services/tmdbApi';

const POSTER = 'https://image.tmdb.org/t/p/w500';
const BACKDROP = 'https://image.tmdb.org/t/p/w1280';

const MovieDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    fetchMovieDetailsApi(id, 'movie').then((data) => {
      setMovie(data);

      const favs = JSON.parse(localStorage.getItem('favorites')) || [];
      setIsFavorite(favs.some((m) => m.id === data.id));
    });
  }, [id]);

  if (!movie) return <div className="details-page" />;

  return (
    <div className="details-page">
      {/* BACKDROP */}
      <div
        className="details-backdrop"
        style={{
          backgroundImage: movie.backdrop_path
            ? `url(${BACKDROP}${movie.backdrop_path})`
            : 'none',
        }}
      />

      {/* BACK BUTTON */}
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Back
      </button>

      {/* CONTENT */}
      <div className="details-container">
        <div className="details-poster">
          <img
            src={movie.poster_path ? `${POSTER}${movie.poster_path}` : ''}
            alt={movie.title}
          />
        </div>

        <div className="details-info">
          <h1>{movie.title}</h1>

          <div className="details-meta">
            <span>📅 {movie.release_date}</span>
            <span>⭐ {movie.vote_average}</span>
          </div>

          <p className="overview">{movie.overview}</p>

          <button
            className={`favorite-button ${isFavorite ? 'active' : ''}`}
            onClick={() => {
              const stored = JSON.parse(localStorage.getItem('favorites')) || [];
              const updated = isFavorite
                ? stored.filter((m) => m.id !== movie.id)
                : [...stored, movie];

              localStorage.setItem('favorites', JSON.stringify(updated));
              setIsFavorite(!isFavorite);
            }}
          >
            {isFavorite ? '★ Remove from favorites' : '☆ Add to favorites'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailsPage;
