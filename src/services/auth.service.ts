/**
 * Serviço de autenticação
 * Gerencia login, registro e validação de tokens
 */

import { api } from './api';
import {
  User,
  LoginCredentials,
  RegisterData,
  AuthTokens,
  PasswordResetRequest,
  PasswordResetConfirm,
} from '@/types';

interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

/**
 * Mock de usuários para desenvolvimento
 * Remover em produção e usar API real
 */
const mockUsers: Record<string, { user: User; password: string }> = {
  'super@pedidorapido.com': {
    user: {
      id: '1',
      email: 'super@pedidorapido.com',
      name: 'Super Admin',
      role: 'super_admin',
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
    },
    password: 'admin123',
  },
  'admin@quiosque.com': {
    user: {
      id: '2',
      email: 'admin@quiosque.com',
      name: 'Admin Quiosque',
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
    },
    password: 'admin123',
  },
  'cliente@email.com': {
    user: {
      id: '3',
      email: 'cliente@email.com',
      name: 'Cliente Teste',
      role: 'customer',
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
    },
    password: 'cliente123',
  },
};

/**
 * Simula delay de API
 */
const simulateDelay = (ms: number = 500): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Gera tokens mock
 */
const generateMockTokens = (): AuthTokens => ({
  accessToken: `mock-access-token-${Date.now()}`,
  refreshToken: `mock-refresh-token-${Date.now()}`,
  expiresIn: 3600,
});

export const authService = {
  /**
   * Realiza login do usuário
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    // Desenvolvimento: usar mock
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      
      const mockUser = mockUsers[credentials.email];
      
      if (!mockUser || mockUser.password !== credentials.password) {
        throw new Error('Email ou senha inválidos');
      }
      
      return {
        user: mockUser.user,
        tokens: generateMockTokens(),
      };
    }
    
    // Produção: usar API real
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  /**
   * Registra novo usuário
   */
  register: async (data: RegisterData): Promise<AuthResponse> => {
    // Desenvolvimento: criar mock
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      
      if (mockUsers[data.email]) {
        throw new Error('Email já cadastrado');
      }
      
      const newUser: User = {
        id: String(Object.keys(mockUsers).length + 1),
        email: data.email,
        name: data.name,
        role: 'customer',
        phone: data.phone,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
      };
      
      mockUsers[data.email] = {
        user: newUser,
        password: data.password,
      };
      
      return {
        user: newUser,
        tokens: generateMockTokens(),
      };
    }
    
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  /**
   * Valida token de acesso
   */
  validateToken: async (token: string): Promise<boolean> => {
    // Desenvolvimento: sempre válido
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay(100);
      return token.startsWith('mock-access-token');
    }
    
    try {
      await api.get('/auth/validate');
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Renova token de acesso
   */
  refreshToken: async (refreshToken: string): Promise<AuthTokens> => {
    // Desenvolvimento: gera novo token
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay(100);
      
      if (!refreshToken.startsWith('mock-refresh-token')) {
        throw new Error('Token inválido');
      }
      
      return generateMockTokens();
    }
    
    const response = await api.post<AuthTokens>('/auth/refresh', { refreshToken });
    return response.data;
  },

  /**
   * Solicita recuperação de senha
   */
  requestPasswordReset: async (data: PasswordResetRequest): Promise<void> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      return;
    }
    
    await api.post('/auth/password-reset/request', data);
  },

  /**
   * Confirma nova senha
   */
  confirmPasswordReset: async (data: PasswordResetConfirm): Promise<void> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      return;
    }
    
    await api.post('/auth/password-reset/confirm', data);
  },

  /**
   * Obtém perfil do usuário atual
   */
  getProfile: async (): Promise<User> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      // Retorna primeiro usuário como exemplo
      return mockUsers['super@pedidorapido.com'].user;
    }
    
    const response = await api.get<User>('/auth/profile');
    return response.data;
  },

  /**
   * Atualiza perfil do usuário
   */
  updateProfile: async (data: Partial<User>): Promise<User> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      return { ...mockUsers['super@pedidorapido.com'].user, ...data };
    }
    
    const response = await api.patch<User>('/auth/profile', data);
    return response.data;
  },

  /**
   * Altera senha do usuário
   */
  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      return;
    }
    
    await api.post('/auth/change-password', { currentPassword, newPassword });
  },
};

export default authService;

