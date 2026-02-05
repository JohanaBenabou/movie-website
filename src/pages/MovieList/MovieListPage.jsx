import '../MovieList/MovieListPage.css';

import { useEffect, useRef, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import HeroCarousel from '../../components/HeroCarousel/HeroCarousel';
import FilterButton from '../../components/FilterButton/FilterButton';
import MovieCard from '../../components/MovieCard/MovieCard';
import Pagination from '../../components/Pagination/Pagination';

import { fetchMovies } from '../../store/movies/actions';
import {
  selectMovies,
  selectMoviesLoading,
  selectMoviesError,
  selectTotalPages,
} from '../../store/movies/selectors';

const MovieListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const movies = useSelector(selectMovies) || [];
  const loading = useSelector(selectMoviesLoading);
  const error = useSelector(selectMoviesError);
  const totalPages = useSelector(selectTotalPages);

  const [filter, setFilter] = useState('popular');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(0);

  const requestTimestamps = useRef([]);
  const filterFocusTimer = useRef(null);

  /* ---------- FAVORITES ---------- */
  const favoriteMovies = useMemo(() => {
    return JSON.parse(localStorage.getItem('favorites')) || [];
  }, []);

  const navigableMovies =
    filter === 'favorites' ? favoriteMovies : movies;

  /* ---------- GRID COLUMNS ---------- */
  const getColumnsCount = () => {
    if (window.innerWidth < 480) return 1;
    if (window.innerWidth < 768) return 2;
    if (window.innerWidth < 1024) return 3;
    return 4;
  };

  /* ---------- SEARCH DEBOUNCE ---------- */
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search.length >= 2) {
        setDebouncedSearch(search);
        setPage(1);
      } else {
        setDebouncedSearch('');
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  /* ---------- RATE LIMIT ---------- */
  const canSendRequest = () => {
    const now = Date.now();
    requestTimestamps.current = requestTimestamps.current.filter(
      (t) => now - t < 10000
    );

    if (requestTimestamps.current.length >= 5) return false;

    requestTimestamps.current.push(now);
    return true;
  };

  /* ---------- FETCH MOVIES ---------- */
  useEffect(() => {
    if (filter === 'favorites') return;
    if (!canSendRequest()) return;

    dispatch(
      fetchMovies({
        filter,
        page,
        query: debouncedSearch,
      })
    );
  }, [dispatch, filter, page, debouncedSearch]);

  /* ---------- KEYBOARD NAVIGATION ---------- */
  useEffect(() => {
    if (!navigableMovies.length) return;

    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowRight':
          setFocusedIndex((i) =>
            Math.min(i + 1, navigableMovies.length - 1)
          );
          break;

        case 'ArrowLeft':
          setFocusedIndex((i) => Math.max(i - 1, 0));
          break;

        case 'ArrowDown':
          setFocusedIndex((i) =>
            Math.min(i + getColumnsCount(), navigableMovies.length - 1)
          );
          break;

        case 'ArrowUp':
          setFocusedIndex((i) =>
            Math.max(i - getColumnsCount(), 0)
          );
          break;

        case 'Enter':
          navigate(`/movie/${navigableMovies[focusedIndex].id}`);
          break;

        case 'Escape':
          setFocusedIndex(0);
          break;

        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedIndex, navigableMovies, navigate]);

  /* ---------- FILTERS ---------- */
  const applyFilter = (value) => {
    setFilter(value);
    setPage(1);
    setSearch('');
    setFocusedIndex(0);
  };

  const handleFilterFocus = (value) => {
    filterFocusTimer.current = setTimeout(() => {
      applyFilter(value);
    }, 2000);
  };

  const handleFilterBlur = () => {
    clearTimeout(filterFocusTimer.current);
  };

  return (
    <div className="movie-page">
      <header className="page-header">
        <h1>Explore Movies</h1>
        <p className="subtitle">Discover what’s popular right now</p>

        <input
          className="search-input"
          placeholder="Search movies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="filters">
          <FilterButton
            label="Popular"
            active={filter === 'popular'}
            onClick={() => applyFilter('popular')}
            onFocus={() => handleFilterFocus('popular')}
            onBlur={handleFilterBlur}
          />

          <FilterButton
            label="Airing Today"
            active={filter === 'airing'}
            onClick={() => applyFilter('airing')}
            onFocus={() => handleFilterFocus('airing')}
            onBlur={handleFilterBlur}
          />

          <FilterButton
            label="My Favorites"
            active={filter === 'favorites'}
            onClick={() => applyFilter('favorites')}
            onFocus={() => handleFilterFocus('favorites')}
            onBlur={handleFilterBlur}
          />
        </div>
      </header>

      {loading && <p className="state-text">Loading…</p>}
      {error && <p className="state-text error">{error}</p>}

      {filter !== 'favorites' && movies.length > 0 && (
        <HeroCarousel movies={movies} />
      )}

      <section className="movies-section">
        <div className="movies-grid">
          {navigableMovies.map((movie, index) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              focused={index === focusedIndex}
              onClick={() => navigate(`/movie/${movie.id}`)}
            />
          ))}
        </div>
      </section>

      {!loading &&
        !debouncedSearch &&
        filter !== 'favorites' &&
        totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}
    </div>
  );
};

export default MovieListPage;
