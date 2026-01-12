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
  UserRole,
} from '@/types';
import { mockDataService, simulateDelay, MockUser } from './mock.service';

interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

/**
 * Converte MockUser para User
 */
const toUser = (mockUser: MockUser): User => ({
  id: mockUser.id,
  email: mockUser.email,
  name: mockUser.name,
  role: mockUser.role as UserRole,
  avatar: mockUser.avatar,
  phone: mockUser.phone,
  createdAt: new Date(mockUser.createdAt),
  updatedAt: new Date(mockUser.updatedAt),
  isActive: mockUser.isActive,
});

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
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay(500);
      
      // Busca usuário no mock pelo email
      const mockUser = mockDataService.getUserByEmail(credentials.email);
      
      if (!mockUser || mockUser.password !== credentials.password) {
        throw new Error('Email ou senha inválidos');
      }
      
      if (!mockUser.isActive) {
        throw new Error('Usuário inativo. Entre em contato com o suporte.');
      }
      
      return {
        user: toUser(mockUser),
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
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay(500);
      
      const existingUser = mockDataService.getUserByEmail(data.email);
      if (existingUser) {
        throw new Error('Email já cadastrado');
      }
      
      const newUser: MockUser = {
        id: `usr_${String(mockDataService.getUsers().length + 1).padStart(3, '0')}`,
        email: data.email,
        password: data.password,
        name: data.name,
        role: 'customer',
        phone: data.phone,
        isActive: true,
        favoriteKiosks: [],
        orderHistory: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      mockDataService.addUser(newUser);
      
      return {
        user: toUser(newUser),
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
      
      const user = mockDataService.getUserByEmail(data.email);
      if (!user) {
        // Não revela se o email existe ou não por segurança
        return;
      }
      
      console.log(`[MOCK] Link de recuperação enviado para ${data.email}`);
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
      console.log(`[MOCK] Senha alterada com token ${data.token}`);
      return;
    }
    
    await api.post('/auth/password-reset/confirm', data);
  },

  /**
   * Obtém perfil do usuário atual
   */
  getProfile: async (userId: string): Promise<User> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      const user = mockDataService.getUserById(userId);
      if (!user) throw new Error('Usuário não encontrado');
      return toUser(user);
    }
    
    const response = await api.get<User>('/auth/profile');
    return response.data;
  },

  /**
   * Atualiza perfil do usuário
   */
  updateProfile: async (userId: string, data: Partial<User>): Promise<User> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      
      const updated = mockDataService.updateUser(userId, {
        name: data.name,
        phone: data.phone,
        avatar: data.avatar,
        updatedAt: new Date().toISOString(),
      });
      
      if (!updated) throw new Error('Usuário não encontrado');
      return toUser(updated);
    }
    
    const response = await api.patch<User>('/auth/profile', data);
    return response.data;
  },

  /**
   * Altera senha do usuário
   */
  changePassword: async (
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      
      const user = mockDataService.getUserById(userId);
      if (!user) throw new Error('Usuário não encontrado');
      
      if (user.password !== currentPassword) {
        throw new Error('Senha atual incorreta');
      }
      
      mockDataService.updateUser(userId, {
        password: newPassword,
        updatedAt: new Date().toISOString(),
      });
      
      return;
    }
    
    await api.post('/auth/change-password', { currentPassword, newPassword });
  },

  /**
   * Verifica se email está disponível
   */
  checkEmailAvailability: async (email: string): Promise<boolean> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay(200);
      const user = mockDataService.getUserByEmail(email);
      return !user;
    }
    
    const response = await api.get<{ available: boolean }>(`/auth/check-email?email=${email}`);
    return response.data.available;
  },
};

export default authService;
