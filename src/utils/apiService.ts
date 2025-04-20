'use client'
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_URL } from '../config';
import { ApiResponse, PaginatedResponse } from '../types/api.types';
import { User, Role, RoleCreatePayload, UserUpdateRequest, PasswordChangeRequest } from '../types/user';
import { LoginCredentials, LoginResponse } from '../types/auth.types';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Client-side only functions
const getStoredToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

const clearAuthData = () => {
  if (typeof window === 'undefined') return;
  localStorage.clear();
};

const redirectToLogin = () => {
  if (typeof window === 'undefined') return;
  window.location.href = '/login';
};

// Add token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getStoredToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        clearAuthData();
        redirectToLogin();
      }
    }
    return Promise.reject(error);
  }
);

export const apiService = {
  get: <T>(url: string, config?: AxiosRequestConfig): Promise<T> => 
    axiosInstance.get<T>(url, config).then(response => response.data),
  
  post: <T>(url: string, data?: Record<string, unknown>, config?: AxiosRequestConfig): Promise<T> => 
    axiosInstance.post<T>(url, data, config).then(response => response.data),
  
  put: <T>(url: string, data?: Record<string, unknown>, config?: AxiosRequestConfig): Promise<T> => 
    axiosInstance.put<T>(url, data, config).then(response => response.data),
  
  patch: <T>(url: string, data?: Record<string, unknown>, config?: AxiosRequestConfig): Promise<T> => 
    axiosInstance.patch<T>(url, data, config).then(response => response.data),
  
  delete: <T>(url: string, config?: AxiosRequestConfig): Promise<T> => 
    axiosInstance.delete<T>(url, config).then(response => response.data),

  // Auth endpoints
  login: (credentials: LoginCredentials): Promise<LoginResponse> => 
    axiosInstance.post<LoginResponse>('/api/auth/login', credentials).then(response => response.data),
  
  register: (userData: { name: string; email: string; password: string }): Promise<ApiResponse<User>> => 
    axiosInstance.post<ApiResponse<User>>('/api/auth/register', userData).then(response => response.data),
  
  refreshToken: (refreshToken: string): Promise<{ token: string; refreshToken: string; expiry: number }> => 
    axiosInstance.post<{ token: string; refreshToken: string; expiry: number }>('/api/auth/refresh-token', { refreshToken }).then(response => response.data),
  
  logout: (): Promise<void> => 
    axiosInstance.post<void>('/api/auth/logout').then(response => response.data),

  // User endpoints
  getProfile: (): Promise<User> => 
    axiosInstance.get<User>('/api/user/profile').then(response => response.data),
  
  updateProfile: (data: UserUpdateRequest): Promise<User> => 
    axiosInstance.put<User>('/api/user/profile', data).then(response => response.data),
  
  changePassword: (data: PasswordChangeRequest): Promise<{ message: string }> => 
    axiosInstance.put<{ message: string }>('/api/user/change-password', data).then(response => response.data),
  
  // Role endpoints
  getRoles: (): Promise<Role[]> => 
    axiosInstance.get<Role[]>('/roles').then(response => response.data),
  
  createRole: (data: RoleCreatePayload): Promise<Role> => 
    axiosInstance.post<Role>('/roles', data).then(response => response.data),
  
  updateRole: (id: string, data: Partial<Role>): Promise<Role> => 
    axiosInstance.put<Role>(`/roles/${id}`, data).then(response => response.data),
  
  deleteRole: (id: string): Promise<{ message: string }> => 
    axiosInstance.delete<{ message: string }>(`/roles/${id}`).then(response => response.data),

  getPaginated: async <T>(url: string, config?: AxiosRequestConfig): Promise<PaginatedResponse<T>> => {
    const response = await axiosInstance.request<PaginatedResponse<T>>({
      ...config,
      method: 'GET',
      url,
    });
    return response.data;
  },
};
