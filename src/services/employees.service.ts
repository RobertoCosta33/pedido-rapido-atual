/**
 * Service de Funcionários
 * Consome endpoints de funcionários do backend
 */

import { apiClient } from './api';

// ============================================================================
// Types
// ============================================================================

export interface EmployeeDto {
  id: string;
  kioskId: string;
  kioskName: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  hireDate: string;
  photo: string | null;
  averageRating: number;
  totalRatings: number;
  isActive: boolean;
  createdAt: string;
}

export interface CreateEmployeeDto {
  kioskId: string;
  name: string;
  role: 'Waiter' | 'Bartender' | 'Cook' | 'Cashier' | 'Manager';
  phone: string;
  email: string;
  document: string;
  hireDate: string;
  salary: number;
  workSchedule?: string;
  photo?: string;
}

export interface UpdateEmployeeDto {
  name?: string;
  role?: 'Waiter' | 'Bartender' | 'Cook' | 'Cashier' | 'Manager';
  phone?: string;
  email?: string;
  salary?: number;
  workSchedule?: string;
  photo?: string;
  isActive?: boolean;
}

export interface EmployeeRankingDto {
  id: string;
  name: string;
  role: string;
  kioskName: string;
  photo: string | null;
  averageRating: number;
  totalRatings: number;
  position: number;
}

// ============================================================================
// Service
// ============================================================================

export const employeesService = {
  /**
   * Lista todos os funcionários
   */
  getAll: async (): Promise<EmployeeDto[]> => {
    return apiClient.get<EmployeeDto[]>('/employees');
  },

  /**
   * Lista funcionários de um quiosque
   */
  getByKiosk: async (kioskId: string): Promise<EmployeeDto[]> => {
    return apiClient.get<EmployeeDto[]>(`/employees/kiosk/${kioskId}`);
  },

  /**
   * Obtém funcionário por ID
   */
  getById: async (id: string): Promise<EmployeeDto> => {
    return apiClient.get<EmployeeDto>(`/employees/${id}`);
  },

  /**
   * Cria novo funcionário
   */
  create: async (data: CreateEmployeeDto): Promise<EmployeeDto> => {
    return apiClient.post<EmployeeDto>('/employees', data);
  },

  /**
   * Atualiza funcionário
   */
  update: async (id: string, data: UpdateEmployeeDto): Promise<EmployeeDto> => {
    return apiClient.put<EmployeeDto>(`/employees/${id}`, data);
  },

  /**
   * Remove funcionário
   */
  delete: async (id: string): Promise<void> => {
    return apiClient.delete(`/employees/${id}`);
  },

  /**
   * Obtém ranking dos funcionários mais bem avaliados
   */
  getRanking: async (limit: number = 10): Promise<EmployeeRankingDto[]> => {
    return apiClient.get<EmployeeRankingDto[]>('/employees/ranking', { limit });
  },
};

export default employeesService;

