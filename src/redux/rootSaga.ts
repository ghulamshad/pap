import { all, fork } from 'redux-saga/effects';
import { authSaga } from './sagas/authSaga';
import { userSaga } from './sagas/userSaga';

export function* rootSaga() {
  yield all([
    fork(authSaga),
    fork(userSaga),
  ]);
}
