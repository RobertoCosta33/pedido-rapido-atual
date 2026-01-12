/**
 * Serviço de usuários
 * Gerencia CRUD de usuários do sistema
 */

import { api } from './api';
import { User, UserRole } from '@/types';
import { mockDataService, simulateDelay, MockUser } from './mock.service';

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

export const userService = {
  /**
   * Lista todos os usuários
   */
  getAll: async (): Promise<User[]> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      return mockDataService.getUsers().map(toUser);
    }
    
    const response = await api.get<User[]>('/users');
    return response.data;
  },

  /**
   * Lista usuários por role
   */
  getByRole: async (role: UserRole): Promise<User[]> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      return mockDataService.getUsersByRole(role).map(toUser);
    }
    
    const response = await api.get<User[]>(`/users?role=${role}`);
    return response.data;
  },

  /**
   * Obtém usuário por ID
   */
  getById: async (id: string): Promise<User> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      const user = mockDataService.getUserById(id);
      if (!user) throw new Error('Usuário não encontrado');
      return toUser(user);
    }
    
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },

  /**
   * Obtém usuário por email
   */
  getByEmail: async (email: string): Promise<User | null> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      const user = mockDataService.getUserByEmail(email);
      return user ? toUser(user) : null;
    }
    
    const response = await api.get<User>(`/users/email/${email}`);
    return response.data;
  },

  /**
   * Lista admins de quiosques
   */
  getKioskAdmins: async (): Promise<User[]> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      return mockDataService.getUsersByRole('admin').map(toUser);
    }
    
    const response = await api.get<User[]>('/users?role=admin');
    return response.data;
  },

  /**
   * Lista clientes
   */
  getCustomers: async (): Promise<User[]> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      return mockDataService.getUsersByRole('customer').map(toUser);
    }
    
    const response = await api.get<User[]>('/users?role=customer');
    return response.data;
  },

  /**
   * Cria novo usuário
   */
  create: async (data: {
    email: string;
    name: string;
    password: string;
    role: UserRole;
    phone?: string;
    kioskId?: string;
  }): Promise<User> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      
      const existing = mockDataService.getUserByEmail(data.email);
      if (existing) throw new Error('Email já cadastrado');
      
      const newUser: MockUser = {
        id: `usr_${String(mockDataService.getUsers().length + 1).padStart(3, '0')}`,
        email: data.email,
        password: data.password,
        name: data.name,
        role: data.role,
        phone: data.phone,
        kioskId: data.kioskId,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      mockDataService.addUser(newUser);
      return toUser(newUser);
    }
    
    const response = await api.post<User>('/users', data);
    return response.data;
  },

  /**
   * Atualiza usuário
   */
  update: async (id: string, data: Partial<User>): Promise<User> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      
      const updated = mockDataService.updateUser(id, {
        ...data,
        updatedAt: new Date().toISOString(),
      } as Partial<MockUser>);
      
      if (!updated) throw new Error('Usuário não encontrado');
      return toUser(updated);
    }
    
    const response = await api.put<User>(`/users/${id}`, data);
    return response.data;
  },

  /**
   * Ativa/Desativa usuário
   */
  toggleActive: async (id: string): Promise<User> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      
      const user = mockDataService.getUserById(id);
      if (!user) throw new Error('Usuário não encontrado');
      
      const updated = mockDataService.updateUser(id, {
        isActive: !user.isActive,
        updatedAt: new Date().toISOString(),
      });
      
      if (!updated) throw new Error('Erro ao atualizar usuário');
      return toUser(updated);
    }
    
    const response = await api.patch<User>(`/users/${id}/toggle-active`);
    return response.data;
  },

  /**
   * Remove usuário
   */
  delete: async (id: string): Promise<void> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      const deleted = mockDataService.deleteUser(id);
      if (!deleted) throw new Error('Usuário não encontrado');
      return;
    }
    
    await api.delete(`/users/${id}`);
  },

  /**
   * Estatísticas de usuários
   */
  getStats: async (): Promise<{
    total: number;
    superAdmins: number;
    admins: number;
    customers: number;
    activeUsers: number;
    inactiveUsers: number;
  }> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      
      const users = mockDataService.getUsers();
      return {
        total: users.length,
        superAdmins: users.filter((u) => u.role === 'super_admin').length,
        admins: users.filter((u) => u.role === 'admin').length,
        customers: users.filter((u) => u.role === 'customer').length,
        activeUsers: users.filter((u) => u.isActive).length,
        inactiveUsers: users.filter((u) => !u.isActive).length,
      };
    }
    
    const response = await api.get<{
      total: number;
      superAdmins: number;
      admins: number;
      customers: number;
      activeUsers: number;
      inactiveUsers: number;
    }>('/users/stats');
    return response.data;
  },
};

export default userService;

