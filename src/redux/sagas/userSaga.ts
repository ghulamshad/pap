import { takeLatest, put, call } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { apiService } from '../../utils/apiService';
import {
  fetchUserRequest,
  fetchUserSuccess,
  fetchUserFailure,
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
} from '../slices/userSlice';
import { User, UserUpdateRequest } from '../../types/user';

// --- Fetch User ---
function* fetchUserSaga() {
  try {
    const user: User = yield call(apiService.getProfile);
    yield put(fetchUserSuccess(user));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch user data';
    yield put(fetchUserFailure(message));
  }
}

// --- Update User ---
function* updateUserSaga(action: PayloadAction<UserUpdateRequest>) {
  try {
    const updatedUser: User = yield call(apiService.updateProfile, action.payload);
    yield put(updateUserSuccess(updatedUser));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update user';
    yield put(updateUserFailure(message));
  }
}

// --- Watcher ---
export function* userSaga() {
  yield takeLatest(fetchUserRequest.type, fetchUserSaga);
  yield takeLatest(updateUserStart.type, updateUserSaga);
}
