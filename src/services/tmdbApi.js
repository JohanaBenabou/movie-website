import rateLimiter from './rateLimiter';

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const TIMEOUT_MS = 10000; 

if (!API_KEY) {
  console.warn('⚠️ REACT_APP_TMDB_API_KEY is not defined');
}

const fetchWithTimeout = async (url, timeout = TIMEOUT_MS) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timeout - La requête a pris trop de temps');
    }
    throw error;
  }
};

export const fetchMoviesApi = async ({
  filter = 'popular',
  page = 1,
  query = '',
}) => {
  return rateLimiter.execute(async () => {
    let url = '';

    if (query && query.length >= 2) {
      url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
        query
      )}&page=${page}`;
    } else {
      switch (filter) {
        case 'airing':
          url = `${BASE_URL}/movie/now_playing?api_key=${API_KEY}&page=${page}`;
          break;

        case 'popular':
        default:
          url = `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`;
          break;
      }
    }

    try {
      const response = await fetchWithTimeout(url);

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Erreur d\'authentification - Vérifiez votre clé API');
        } else if (response.status === 404) {
          throw new Error('Films non trouvés');
        } else if (response.status === 429) {
          throw new Error('Trop de requêtes - Veuillez patienter');
        }
        throw new Error(`Erreur API (${response.status})`);
      }

      return response.json();
    } catch (error) {
      console.error('fetchMoviesApi error:', error);
      throw error;
    }
  });
};

export const fetchMovieDetailsApi = async (id) => {
  return rateLimiter.execute(async () => {
    const url = `${BASE_URL}/movie/${id}?api_key=${API_KEY}`;

    try {
      const response = await fetchWithTimeout(url);

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Erreur d\'authentification - Vérifiez votre clé API');
        } else if (response.status === 404) {
          throw new Error('Film non trouvé');
        }
        throw new Error(`Erreur API (${response.status})`);
      }

      return response.json();
    } catch (error) {
      console.error('fetchMovieDetailsApi error:', error);
      throw error;
    }
  });
};

export const TMDB_IMAGE_1280 = 'https://image.tmdb.org/t/p/w1280';
export const TMDB_IMAGE_780 = 'https://image.tmdb.org/t/p/w780';
export const TMDB_IMAGE_500 = 'https://image.tmdb.org/t/p/w500';