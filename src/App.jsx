import { BrowserRouter, Routes, Route } from 'react-router-dom';

import MovieListPage from './pages/MovieList/MovieListPage';
import MovieDetailsPage from './pages/MovieDetails/MovieDetailsPage';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<MovieListPage />} />
        <Route path="/movie/:id" element={<MovieDetailsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
