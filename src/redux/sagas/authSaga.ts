import { takeLatest, put, call } from 'redux-saga/effects';
import { apiService } from '../../utils/apiService';
import {
  loginStart, loginSuccess, loginFailure, logout
} from '../slices/authSlice';
import { LoginResponse, LoginCredentials } from '../../types/auth.types';
import { User } from '../../types/user';
import { PayloadAction } from '@reduxjs/toolkit';

function* handleLogin(action: PayloadAction<LoginCredentials>) {
  if (!action.payload) {
    yield put(loginFailure('Login credentials are required'));
    return;
  }

  try {
    console.log('Login attempt with credentials:', { 
      email: action.payload.email,
      password: '********' // Don't log the actual password
    });
    
    console.log('Calling apiService.login...');
    const response: LoginResponse = yield call(
      apiService.login,
      action.payload
    );
    
    // console.log('API call completed');
    // console.log('Response type:', typeof response);
    // console.log('Response value:', response);
    
    if (!response) {
      console.error('Login response is undefined');
      yield put(loginFailure('Login failed: No response from server'));
      return;
    }
    
    // Log the entire response
    // console.log('Login Response:', response);
    // console.log('User Data:', response.user);
    // console.log('Token:', response.token);
    // console.log('Refresh Token:', response.refreshToken);
    // console.log('Expires In:', response.expiresIn);

    const authUser: User = {
      ...response.user,
      hasAnyRole: (roles: string[]) => response.user.roles.some(role => roles.includes(role.name)),
      hasAnyPermission: (permissions: string[]) => response.user.permissions.some(perm => permissions.includes(perm.name)),
      getRoleNames: () => response.user.roles.map(role => role.name),
      getPermissionNames: () => response.user.permissions.map(perm => perm.name),
      createdAt: response.user.createdAt ? new Date(response.user.createdAt) : new Date(),
      updatedAt: response.user.updatedAt ? new Date(response.user.updatedAt) : new Date(),
    };

    yield put(loginSuccess({
      user: authUser,
      token: response.token,
      refreshToken: response.refreshToken,
      expiry: response.expiresIn,
    }));

    // Save auth data to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', response.token);
      localStorage.setItem('refreshToken', response.refreshToken);
      localStorage.setItem('tokenExpiry', response.expiresIn.toString());
    }
  } catch (error) {
    console.error('Login error:', error);
    const message = error instanceof Error ? error.message : 'Login failed';
    yield put(loginFailure(message));
  }
}

function* handleLogout() {
  try {
    yield call(apiService.post, '/api/auth/logout');
  } catch (e) {
    console.warn(e,'Logout API failed, proceeding to clear local state.');
  }
  yield put(logout());
}

export function* authSaga() {
  yield takeLatest(loginStart.type, handleLogin);
  yield takeLatest(logout.type, handleLogout);
}
