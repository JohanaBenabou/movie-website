import { call, put, takeLatest } from 'redux-saga/effects';
import { fetchMoviesApi } from '../../services/tmdbApi';

import {
    FETCH_MOVIES,
    FETCH_MOVIES_SUCCESS,
    FETCH_MOVIES_ERROR,
} from './actions';

function* fetchMoviesSaga(action) {
    const { filter, page, query } = action.payload;

    try {

        if (filter === 'favorites') {
            const favorites =
                JSON.parse(localStorage.getItem('favorites')) || [];

            yield put({
                type: FETCH_MOVIES_SUCCESS,
                payload: {
                    results: favorites,
                    total_pages: 1,
                },
            });

            return;
        }

        const data = yield call(fetchMoviesApi, {
            filter,
            page,
            query,
        });

        if (!data || !Array.isArray(data.results)) {
            throw new Error('Invalid data received from movie service');
        }

        yield put({
            type: FETCH_MOVIES_SUCCESS,
            payload: data,
        });
    } catch (error) {

        let message = 'Something went wrong while loading movies.';

        if (!navigator.onLine) {
            message = 'No internet connection. Please check your network.';
        } else if (error?.response?.status === 401) {
            message = 'Authentication error with the movie service.';
        } else if (error?.response?.status === 404) {
            message = 'Movies not found.';
        }

        yield put({
            type: FETCH_MOVIES_ERROR,
            payload: message,
        });
    }
}

export default function* moviesSaga() {
    yield takeLatest(FETCH_MOVIES, fetchMoviesSaga);
}
