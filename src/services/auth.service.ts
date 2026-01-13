/**
 * Serviço de autenticação
 * Conecta com o backend real usando JWT
 */

import { apiClient } from './api';
import {
  User,
  LoginCredentials,
  RegisterData,
  AuthTokens,
  UserRole,
} from '@/types';

// ============================================================================
// Tipos da API de Autenticação
// ============================================================================

/**
 * Resposta do endpoint de login do backend
 */
interface LoginApiResponse {
  token: string;
  expiresAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    kioskId?: string;
    kioskName?: string;
  };
}

/**
 * Resposta padrão de autenticação para o frontend
 */
interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

/**
 * Dados do usuário autenticado
 */
interface UserApiResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  kioskId?: string;
  kioskName?: string;
}

// ============================================================================
// Helpers
// ============================================================================

/**
 * Converte role da API para o formato do frontend
 */
const convertRole = (apiRole: string): UserRole => {
  switch (apiRole.toLowerCase()) {
    case 'superadmin':
      return 'super_admin';
    case 'admin':
      return 'admin';
    case 'customer':
    default:
      return 'customer';
  }
};

/**
 * Converte resposta da API para User do frontend
 */
const toUser = (apiUser: UserApiResponse): User => ({
  id: apiUser.id,
  email: apiUser.email,
  name: apiUser.name,
  role: convertRole(apiUser.role),
  phone: '',
  createdAt: new Date(),
  updatedAt: new Date(),
  isActive: true,
  kioskId: apiUser.kioskId,
  kioskName: apiUser.kioskName,
});

/**
 * Calcula expiresIn em segundos a partir de expiresAt
 */
const calculateExpiresIn = (expiresAt: string): number => {
  const expiry = new Date(expiresAt).getTime();
  const now = Date.now();
  return Math.floor((expiry - now) / 1000);
};

// ============================================================================
// Serviço de Autenticação
// ============================================================================

export const authService = {
  /**
   * Realiza login do usuário via API real
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<LoginApiResponse>('/auth/login', {
      email: credentials.email,
      password: credentials.password,
    });

    return {
      user: toUser(response.user),
      tokens: {
        accessToken: response.token,
        refreshToken: '', // Backend não implementa refresh token ainda
        expiresIn: calculateExpiresIn(response.expiresAt),
      },
    };
  },

  /**
   * Registra novo usuário (não implementado no backend ainda)
   */
  register: async (data: RegisterData): Promise<AuthResponse> => {
    // Backend não implementa cadastro ainda
    // Quando implementar, será algo como:
    // const response = await apiClient.post<LoginApiResponse>('/auth/register', data);
    
    throw new Error('Cadastro de novos usuários ainda não está disponível');
  },

  /**
   * Valida token de acesso via API
   */
  validateToken: async (_token: string): Promise<boolean> => {
    try {
      await apiClient.get('/auth/validate');
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Renova token de acesso (não implementado no backend ainda)
   */
  refreshToken: async (_refreshToken: string): Promise<AuthTokens> => {
    // Backend não implementa refresh token ainda
    throw new Error('Refresh token não disponível');
  },

  /**
   * Obtém dados do usuário autenticado
   */
  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<UserApiResponse>('/auth/me');
    return toUser(response);
  },

  /**
   * Verifica se usuário está autenticado
   */
  isAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false;
    
    const tokens = localStorage.getItem('pedido-rapido-tokens');
    if (!tokens) return false;
    
    try {
      const parsed = JSON.parse(tokens);
      return !!parsed.accessToken;
    } catch {
      return false;
    }
  },

  /**
   * Obtém o token atual
   */
  getToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    
    const tokens = localStorage.getItem('pedido-rapido-tokens');
    if (!tokens) return null;
    
    try {
      const parsed = JSON.parse(tokens);
      return parsed.accessToken || null;
    } catch {
      return null;
    }
  },

  /**
   * Faz logout (limpa tokens locais)
   */
  logout: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('pedido-rapido-auth');
      localStorage.removeItem('pedido-rapido-tokens');
    }
  },
};

export default authService;
