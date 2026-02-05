import { createStore, combineReducers, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import moviesReducer from './movies/reducer';
import rootSaga from '../store/rootSaga';

const sagaMiddleware = createSagaMiddleware();

const rootReducer = combineReducers({
    movies: moviesReducer,
});

export const store = createStore(
    rootReducer,
    applyMiddleware(sagaMiddleware)
);

sagaMiddleware.run(rootSaga);
