import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';

import MovieListPage from './pages/MovieList/MovieListPage';
import MovieDetailsPage from './pages/MovieDetails/MovieDetailsPage';
import ScrollToTop from './components/ScrollToTop';

function App() {
  /**
   * Disable TAB navigation completely
   * (exam requirement)
   */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <BrowserRouter>
      {/* Ensure page always starts at top on route change */}
      <ScrollToTop />

      <Routes>
        {/* Home / Movie list */}
        <Route path="/" element={<MovieListPage />} />

        {/* Movie details */}
        <Route path="/movie/:id" element={<MovieDetailsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
