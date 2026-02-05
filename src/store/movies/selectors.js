export const selectMoviesState = (state) => state.movies;

export const selectMovies = (state) =>
    state.movies.items || [];

export const selectMoviesLoading = (state) =>
    state.movies.loading;

export const selectMoviesError = (state) =>
    state.movies.error;

export const selectTotalPages = (state) =>
    state.movies.totalPages || 1;
