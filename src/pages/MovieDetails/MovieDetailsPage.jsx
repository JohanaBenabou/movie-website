import './MovieDetailsPage.css';
import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchMovieDetailsApi } from '../../services/tmdbApi';

const POSTER = 'https://image.tmdb.org/t/p/w500';
const BACKDROP = 'https://image.tmdb.org/t/p/w1280';

const ACTIONS = {
  BACK: 0,
  FAVORITE: 1,
};

const MovieDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [focusedAction, setFocusedAction] = useState(ACTIONS.FAVORITE);

  useEffect(() => {
    window.scrollTo(0, 0);

    fetchMovieDetailsApi(id, 'movie').then((data) => {
      setMovie(data);

      const favs = JSON.parse(localStorage.getItem('favorites')) || [];
      setIsFavorite(favs.some((m) => m.id === data.id));
    });
  }, [id]);

  const toggleFavorite = useCallback(() => {
    if (!movie) return;

    const stored = JSON.parse(localStorage.getItem('favorites')) || [];
    const updated = isFavorite
      ? stored.filter((m) => m.id !== movie.id)
      : [...stored, movie];

    localStorage.setItem('favorites', JSON.stringify(updated));
    setIsFavorite(!isFavorite);
  }, [movie, isFavorite]);

  const goBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        goBack();
        return;
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        if (focusedAction === ACTIONS.FAVORITE) {
          toggleFavorite();
        } else if (focusedAction === ACTIONS.BACK) {
          goBack();
        }
        return;
      }

      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        setFocusedAction((current) =>
          current === ACTIONS.BACK ? ACTIONS.FAVORITE : ACTIONS.BACK
        );
      }

      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        setFocusedAction((current) =>
          current === ACTIONS.FAVORITE ? ACTIONS.BACK : ACTIONS.FAVORITE
        );
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [focusedAction, isFavorite, movie, toggleFavorite, goBack]);

  if (!movie) return <div className="details-page" />;

  return (
    <div className="details-page">
      <div
        className="details-backdrop"
        style={{
          backgroundImage: movie.backdrop_path
            ? `url(${BACKDROP}${movie.backdrop_path})`
            : 'none',
        }}
      />

      <button
        className={`back-button ${focusedAction === ACTIONS.BACK ? 'focused' : ''}`}
        onClick={goBack}
      >
        ← Back
      </button>

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
            className={`favorite-button ${isFavorite ? 'active' : ''} ${focusedAction === ACTIONS.FAVORITE ? 'focused' : ''
              }`}
            onClick={toggleFavorite}
          >
            {isFavorite ? '★ Remove from favorites' : '☆ Add to favorites'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailsPage;