export type RoleStatus = 'active' | 'inactive';

export interface Role {
  id: string;
  name: string;
  description: string;
  status: RoleStatus;
  permissions: Permission[];
}

export interface Permission {
  id: string;
  name: string;
  description: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  phoneNumber?: string;
  address?: string;
  profileImage?: string;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface User extends UserProfile {
  roles: Role[];
  permissions: Permission[];
  isActive: boolean;
  isEmailVerified: boolean;
  hasAnyRole: (roles: string[]) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  getRoleNames: () => string[];
  getPermissionNames: () => string[];
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
  phoneNumber?: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface UserUpdateRequest {
  name?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  profileImage?: string;
  currentPassword?: string;
  newPassword?: string;
}

export interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface RoleCreatePayload {
  name: string;
  description?: string;
  permissions: string[];
}

export interface RoleUpdatePayload {
  name?: string;
  description?: string;
  permissions?: string[];
}

export interface RoleCreatePayload {
  name: string;
  // any additional fields for creation
}