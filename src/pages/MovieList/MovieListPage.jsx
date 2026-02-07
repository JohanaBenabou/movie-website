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

const ZONES = {
  SEARCH: 0,
  FILTERS: 1,
  CAROUSEL: 2,
  GRID: 3,
  PAGINATION: 4,
};

const FILTERS = ['popular', 'airing', 'favorites'];

const MovieListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const moviesFromStore = useSelector(selectMovies);
  const movies = useMemo(() => moviesFromStore || [], [moviesFromStore]);
  const loading = useSelector(selectMoviesLoading);
  const error = useSelector(selectMoviesError);
  const totalPages = useSelector(selectTotalPages);

  const [filter, setFilter] = useState('popular');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [zone, setZone] = useState(ZONES.GRID);
  const [filterIndex, setFilterIndex] = useState(0);
  const selectedPageRef = useRef(1);
  const paginationPositionRef = useRef('page');
  const [, forceUpdate] = useState(0);

  const searchRef = useRef(null);
  const filtersRef = useRef(null);
  const carouselRef = useRef(null);
  const carouselControlRef = useRef(null);
  const gridRef = useRef(null);
  const paginationRef = useRef(null);

  const favoriteMovies = useMemo(() => {
    return JSON.parse(localStorage.getItem('favorites')) || [];
  }, []);

  const navigableMovies =
    filter === 'favorites' ? favoriteMovies : movies;

  const getColumnsCount = () => {
    if (window.innerWidth < 480) return 1;
    if (window.innerWidth < 768) return 2;
    if (window.innerWidth < 1024) return 3;
    return 4;
  };

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search.length >= 2 ? search : '');
      setPage(1);
    }, 500);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    if (filter === 'favorites') return;

    console.log('Fetching movies for page:', page);
    dispatch(
      fetchMovies({
        filter,
        page,
        query: debouncedSearch,
      })
    );
  }, [dispatch, filter, page, debouncedSearch]);

  useEffect(() => {
    if (zone === ZONES.GRID) {
      const card = document.querySelector('.movie-card.focused');
      if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [focusedIndex, zone]);

  useEffect(() => {
    const onKey = (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter'].includes(e.key)) {
        e.preventDefault();
      }

      const cols = getColumnsCount();

      if (zone === ZONES.SEARCH) {
        if (e.key === 'ArrowDown') {
          if (!debouncedSearch) {
            setZone(ZONES.FILTERS);
            filtersRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          } else if (navigableMovies.length > 0) {
            setZone(ZONES.GRID);
            setFocusedIndex(0);
            gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
        if (e.key === 'Escape') {
          searchRef.current?.blur();
        }
        return;
      }

      if (zone === ZONES.FILTERS) {
        if (e.key === 'ArrowRight') {
          const newIndex = Math.min(filterIndex + 1, FILTERS.length - 1);
          setFilterIndex(newIndex);
          applyFilter(FILTERS[newIndex]);
        }
        if (e.key === 'ArrowLeft') {
          const newIndex = Math.max(filterIndex - 1, 0);
          setFilterIndex(newIndex);
          applyFilter(FILTERS[newIndex]);
        }
        if (e.key === 'ArrowDown') {
          if (filter !== 'favorites' && movies.length > 0 && !debouncedSearch) {
            setZone(ZONES.CAROUSEL);
            carouselRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          } else if (navigableMovies.length > 0) {
            setZone(ZONES.GRID);
            setFocusedIndex(0);
            gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
        if (e.key === 'ArrowUp') {
          setZone(ZONES.SEARCH);
          searchRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          searchRef.current?.focus();
        }
        if (e.key === 'Enter') {
          applyFilter(FILTERS[filterIndex]);
        }
        return;
      }

      if (zone === ZONES.CAROUSEL) {
        if (e.key === 'ArrowRight') {
          carouselControlRef.current?.goToNext();
        }
        if (e.key === 'ArrowLeft') {
          carouselControlRef.current?.goToPrevious();
        }
        if (e.key === 'Enter') {
          const currentMovie = carouselControlRef.current?.getCurrentMovie();
          if (currentMovie) {
            navigate(`/movie/${currentMovie.id}`);
          }
        }
        if (e.key === 'ArrowDown') {
          if (navigableMovies.length > 0) {
            setZone(ZONES.GRID);
            setFocusedIndex(0);
            gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
        if (e.key === 'ArrowUp') {
          setZone(ZONES.FILTERS);
          filtersRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }

      if (zone === ZONES.GRID) {
        if (e.key === 'ArrowRight') {
          setFocusedIndex((i) => Math.min(i + 1, navigableMovies.length - 1));
        }
        if (e.key === 'ArrowLeft') {
          setFocusedIndex((i) => Math.max(i - 1, 0));
        }
        if (e.key === 'ArrowDown') {
          const newIndex = focusedIndex + cols;
          if (newIndex < navigableMovies.length) {
            setFocusedIndex(newIndex);
          } else if (!loading && !debouncedSearch && filter !== 'favorites' && totalPages > 1) {
            setZone(ZONES.PAGINATION);
            selectedPageRef.current = page;
            paginationPositionRef.current = 'page';
            forceUpdate(n => n + 1);
            paginationRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
        if (e.key === 'ArrowUp') {
          if (focusedIndex >= cols) {
            setFocusedIndex((i) => Math.max(i - cols, 0));
          } else {
            if (!debouncedSearch) {
              if (filter !== 'favorites' && movies.length > 0) {
                setZone(ZONES.CAROUSEL);
                carouselRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              } else {
                setZone(ZONES.FILTERS);
                filtersRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            } else {
              setZone(ZONES.SEARCH);
              searchRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              searchRef.current?.focus();
            }
          }
        }
        if (e.key === 'Enter') {
          navigate(`/movie/${navigableMovies[focusedIndex].id}`);
        }
        return;
      }

      if (zone === ZONES.PAGINATION) {
        if (e.key === 'ArrowLeft') {
          if (paginationPositionRef.current === 'next') {
            paginationPositionRef.current = 'page';
            selectedPageRef.current = totalPages;
          } else if (paginationPositionRef.current === 'page') {
            const maxVisible = 5;
            let startPage = Math.max(1, page - Math.floor(maxVisible / 2));

            if (selectedPageRef.current > startPage) {
              selectedPageRef.current = selectedPageRef.current - 1;
            } else if (startPage > 1 && selectedPageRef.current > 1) {
              selectedPageRef.current = 1;
            } else {
              paginationPositionRef.current = 'prev';
            }
          }
          forceUpdate(n => n + 1);
        }
        if (e.key === 'ArrowRight') {
          if (paginationPositionRef.current === 'prev') {
            paginationPositionRef.current = 'page';
            const maxVisible = 5;
            let startPage = Math.max(1, page - Math.floor(maxVisible / 2));
            selectedPageRef.current = startPage;
          } else if (paginationPositionRef.current === 'page') {
            const maxVisible = 5;
            let startPage = Math.max(1, page - Math.floor(maxVisible / 2));
            let endPage = Math.min(totalPages, startPage + maxVisible - 1);

            if (selectedPageRef.current < endPage) {
              selectedPageRef.current = selectedPageRef.current + 1;
            } else if (endPage < totalPages && selectedPageRef.current < totalPages) {
              selectedPageRef.current = totalPages;
            } else {
              paginationPositionRef.current = 'next';
            }
          }
          forceUpdate(n => n + 1);
        }
        if (e.key === 'ArrowUp') {
          setZone(ZONES.GRID);
          const lastRowStart = Math.floor((navigableMovies.length - 1) / getColumnsCount()) * getColumnsCount();
          setFocusedIndex(Math.min(lastRowStart, navigableMovies.length - 1));
        }
        if (e.key === 'Enter') {
          console.log('Enter pressed - Position:', paginationPositionRef.current, 'Selected page:', selectedPageRef.current);

          if (paginationPositionRef.current === 'prev' && page > 1) {
            setPage(page - 1);
            selectedPageRef.current = page - 1;
          } else if (paginationPositionRef.current === 'next' && page < totalPages) {
            setPage(page + 1);
            selectedPageRef.current = page + 1;
          } else if (paginationPositionRef.current === 'page') {
            setPage(selectedPageRef.current);
          }

          setFocusedIndex(0);
          setTimeout(() => {
            setZone(ZONES.GRID);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 300);
        }
        return;
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [zone, focusedIndex, filterIndex, navigableMovies, navigate, filter, movies, page, totalPages, loading, debouncedSearch]);

  const applyFilter = (value) => {
    setFilter(value);
    setPage(1);
    selectedPageRef.current = 1;
    setSearch('');
    setFocusedIndex(0);
    setFilterIndex(FILTERS.indexOf(value));
  };

  return (
    <div className="movie-page">
      <header className="page-header">
        <h1>Explore Movies</h1>
        <p className="subtitle">Discover what's popular right now</p>

        <input
          ref={searchRef}
          className={`search-input ${zone === ZONES.SEARCH ? 'keyboard-focused' : ''}`}
          placeholder="Search movies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setZone(ZONES.SEARCH)}
        />

        <div className="filters" ref={filtersRef}>
          {!debouncedSearch && FILTERS.map((f, idx) => (
            <FilterButton
              key={f}
              label={f === 'popular' ? 'Popular' : f === 'airing' ? 'Airing Today' : 'My Favorites'}
              active={filter === f}
              focused={zone === ZONES.FILTERS && filterIndex === idx}
              onClick={() => applyFilter(f)}
            />
          ))}
        </div>
      </header>

      {loading && <p className="state-text">Loading…</p>}
      {error && <p className="state-text error">{error}</p>}

      {filter !== 'favorites' && movies.length > 0 && !debouncedSearch && (
        <div
          ref={carouselRef}
          className={`hero-carousel-wrapper ${zone === ZONES.CAROUSEL ? 'carousel-focused' : ''}`}
        >
          <HeroCarousel movies={movies} filter={filter} ref={carouselControlRef} />
        </div>
      )}

      <section className="movies-section" ref={gridRef}>
        <div className="movies-grid">
          {navigableMovies.map((movie, index) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              focused={zone === ZONES.GRID && index === focusedIndex}
              onClick={() => navigate(`/movie/${movie.id}`)}
            />
          ))}
        </div>
      </section>

      {!loading &&
        !debouncedSearch &&
        filter !== 'favorites' &&
        totalPages > 1 && (
          <div ref={paginationRef}>
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
              focused={zone === ZONES.PAGINATION}
              selectedPage={selectedPageRef.current}
              position={paginationPositionRef.current}
            />
          </div>
        )}
    </div>
  );
};

export default MovieListPage;