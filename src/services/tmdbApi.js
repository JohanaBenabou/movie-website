const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
console.log('TMDB API KEY:', API_KEY);

if (!API_KEY) {
    console.warn('⚠️ REACT_APP_TMDB_API_KEY is not defined');
}

export const fetchMoviesApi = async ({ filter, page = 1, query = '' }) => {
    let url = '';

    if (query && query.length >= 2) {
        url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
            query
        )}&page=${page}`;
    } else {
        switch (filter) {
            case 'airing':
                url = `${BASE_URL}/tv/airing_today?api_key=${API_KEY}&page=${page}`;
                break;

            case 'popular':
            default:
                url = `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`;
                break;
        }
    }

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('Failed to fetch movies');
    }

    return response.json();
};

export const fetchMovieDetailsApi = async (id, mediaType = 'movie') => {
    const url = `${BASE_URL}/${mediaType}/${id}?api_key=${API_KEY}&append_to_response=credits,videos`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('Failed to fetch movie details');
    }

    return response.json();
};
