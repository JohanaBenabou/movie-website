import '../HeroCarousel/HeroCarousel.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TMDB_IMAGE_1280 } from '../../services/tmdbConfig';

const IMAGE_BASE = 'https://image.tmdb.org/t/p/w1280';
const MAX_ITEMS = 8;
const AUTO_DELAY = 5000;

const HeroCarousel = ({ movies = [] }) => {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);

  const safeMovies = movies.slice(0, MAX_ITEMS);
  const current = safeMovies[index];


  useEffect(() => {
    if (!safeMovies.length) return;
    const timer = setInterval(
      () => setIndex((i) => (i + 1) % safeMovies.length),
      AUTO_DELAY
    );
    return () => clearInterval(timer);
  }, [safeMovies.length]);

  useEffect(() => {
    if (!current) return;
    const onKey = (e) => {
      if (e.key === 'ArrowRight') setIndex(i => Math.min(i + 1, safeMovies.length - 1));
      if (e.key === 'ArrowLeft') setIndex(i => Math.max(i - 1, 0));
      if (e.key === 'Enter') navigate(`/movie/${current.id}`);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [current, navigate, safeMovies.length]);

  if (!current) return null;

  const image = current.backdrop_path || current.poster_path;
  if (!image) return null;

  const imagePath = current.backdrop_path || current.poster_path;
  if (!imagePath) return null;

  return (
    <section className="hero">
      <div
        className="hero-main"
        onClick={() => navigate(`/movie/${current.id}`)}
      >
        <img src={`${TMDB_IMAGE_1280}${imagePath}`}
          alt={current.title} />

        <div className="hero-overlay">
          <h2>{current.title}</h2>
          <p className="rating">⭐ {current.vote_average}</p>
          <p className="hint">← → Navigate · Enter open</p>
        </div>
      </div>

      <div className="hero-thumbnails">
        {safeMovies.map((m, i) => {
          const thumb = m.backdrop_path || m.poster_path;
          if (!thumb) return null;

          return (
            <img
              key={m.id}
              src={`${IMAGE_BASE}${thumb}`}
              alt={m.title}
              className={i === index ? 'active' : ''}
              onClick={() => setIndex(i)}
            />
          );
        })}
      </div>
    </section>
  );
};

export default HeroCarousel;
