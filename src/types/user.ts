/**
 * Tipos relacionados a usuários e autenticação
 * Sistema de controle de acesso baseado em roles (RBAC)
 */

export type UserRole = 'super_admin' | 'admin' | 'customer';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  kioskId?: string;
  kioskName?: string;
}

export interface SuperAdmin extends User {
  role: 'super_admin';
}

export interface KioskAdmin extends User {
  role: 'admin';
  kioskId: string;
  permissions: KioskPermission[];
}

export interface Customer extends User {
  role: 'customer';
  favoriteKiosks: string[];
  orderHistory: string[];
}

export type KioskPermission = 
  | 'manage_products'
  | 'manage_menu'
  | 'manage_stock'
  | 'manage_recipes'
  | 'view_reports'
  | 'manage_orders';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  newPassword: string;
}

