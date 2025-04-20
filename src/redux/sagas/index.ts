import { all } from 'redux-saga/effects';
import { authSaga } from './authSaga';
import { userSaga } from './userSaga';

export function* rootSaga() {
  yield all([
    authSaga(),
    userSaga(),
    
  ]);
} 