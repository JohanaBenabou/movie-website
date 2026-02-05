import { all } from 'redux-saga/effects';
import moviesSaga from '../store/movies/saga';

export default function* rootSaga() {
  yield all([moviesSaga()]);
}
