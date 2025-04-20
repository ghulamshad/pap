import { takeLatest, put, call } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { apiService } from '../../utils/apiService';
import {
  fetchRolesRequest,
  fetchRolesSuccess,
  fetchRolesFailure,
  createRoleRequest,
  createRoleSuccess,
  createRoleFailure,
  updateRoleRequest,
  updateRoleSuccess,
  updateRoleFailure,
  deleteRoleRequest,
  deleteRoleSuccess,
  deleteRoleFailure,
} from '../slices/roleSlice';
import { Role, RoleCreatePayload } from '@/types/user';

// --- Fetch All Roles ---
function* fetchRolesSaga() {
  try {
    const roles: Role[] = yield call(apiService.getRoles);
    yield put(fetchRolesSuccess(roles));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch roles';
    yield put(fetchRolesFailure(message));
  }
}

// --- Create Role ---
function* createRoleSaga(action: PayloadAction<RoleCreatePayload>) {
  try {
    const role: Role = yield call(apiService.createRole, action.payload);
    yield put(createRoleSuccess(role));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create role';
    yield put(createRoleFailure(message));
  }
}

// --- Update Role ---
function* updateRoleSaga(action: PayloadAction<{ id: string; data: Role }>) {
  try {
    const role: Role = yield call(apiService.updateRole, action.payload.id, action.payload.data);
    yield put(updateRoleSuccess(role));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update role';
    yield put(updateRoleFailure(message));
  }
}

// --- Delete Role ---
function* deleteRoleSaga(action: PayloadAction<string>) {
  try {
    yield call(apiService.deleteRole, action.payload);
    yield put(deleteRoleSuccess(action.payload));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete role';
    yield put(deleteRoleFailure(message));
  }
}

// --- Watcher Saga ---
export function* roleSaga() {
  yield takeLatest(fetchRolesRequest.type, fetchRolesSaga);
  yield takeLatest(createRoleRequest.type, createRoleSaga);
  yield takeLatest(updateRoleRequest.type, updateRoleSaga);
  yield takeLatest(deleteRoleRequest.type, deleteRoleSaga);
}
