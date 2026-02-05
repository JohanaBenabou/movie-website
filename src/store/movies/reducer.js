import {
    FETCH_MOVIES,
    FETCH_MOVIES_SUCCESS,
    FETCH_MOVIES_ERROR,
} from './actions';

const initialState = {
    items: [],
    loading: false,
    error: null,
    totalPages: 1,
};

export default function moviesReducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_MOVIES:
            return {
                ...state,
                loading: true,
                error: null,
            };

        case FETCH_MOVIES_SUCCESS:
            return {
                ...state,
                loading: false,
                items: action.payload.results || [],
                totalPages: action.payload.total_pages || 1,
            };

        case FETCH_MOVIES_ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        default:
            return state;
    }
}
