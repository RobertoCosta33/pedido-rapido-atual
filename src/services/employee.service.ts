/**
 * Serviço de funcionários
 * Gerencia funcionários dos quiosques
 */

import { api } from './api';
import { mockDataService, simulateDelay, MockEmployee } from './mock.service';

export interface Employee {
  id: string;
  kioskId: string;
  name: string;
  role: string;
  photo: string;
  phone: string;
  email: string;
  document: string;
  hireDate: Date;
  salary: number;
  workSchedule: string;
  isActive: boolean;
  rating: number;
  totalRatings: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateEmployeeData {
  kioskId: string;
  name: string;
  role: string;
  photo?: string;
  phone: string;
  email: string;
  document: string;
  hireDate: string;
  salary: number;
  workSchedule: string;
}

export interface UpdateEmployeeData extends Partial<CreateEmployeeData> {
  isActive?: boolean;
}

// Labels para tipos de cargo
export const EMPLOYEE_ROLES: Record<string, string> = {
  manager: 'Gerente',
  waiter: 'Garçom/Garçonete',
  chef: 'Chef',
  cook: 'Cozinheiro(a)',
  bartender: 'Bartender',
  hostess: 'Hostess/Recepção',
  sommelier: 'Sommelier',
  cashier: 'Caixa',
  cleaner: 'Auxiliar de Limpeza',
  helper: 'Auxiliar de Cozinha',
};

/**
 * Converte MockEmployee para Employee
 */
const toEmployee = (mock: MockEmployee): Employee => ({
  id: mock.id,
  kioskId: mock.kioskId,
  name: mock.name,
  role: mock.role,
  photo: mock.photo,
  phone: mock.phone,
  email: mock.email,
  document: mock.document,
  hireDate: new Date(mock.hireDate),
  salary: mock.salary,
  workSchedule: mock.workSchedule,
  isActive: mock.isActive,
  rating: mock.rating,
  totalRatings: mock.totalRatings,
  createdAt: new Date(mock.createdAt),
  updatedAt: new Date(mock.updatedAt),
});

export const employeeService = {
  /**
   * Lista todos os funcionários
   */
  getAll: async (): Promise<Employee[]> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      return mockDataService.getEmployees().map(toEmployee);
    }
    
    const response = await api.get<Employee[]>('/employees');
    return response;
  },

  /**
   * Lista funcionários de um quiosque
   */
  getByKiosk: async (kioskId: string): Promise<Employee[]> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      return mockDataService.getEmployeesByKiosk(kioskId).map(toEmployee);
    }
    
    const response = await api.get<Employee[]>(`/kiosks/${kioskId}/employees`);
    return response;
  },

  /**
   * Obtém funcionário por ID
   */
  getById: async (id: string): Promise<Employee> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      const employee = mockDataService.getEmployeeById(id);
      if (!employee) throw new Error('Funcionário não encontrado');
      return toEmployee(employee);
    }
    
    const response = await api.get<Employee>(`/employees/${id}`);
    return response;
  },

  /**
   * Cria novo funcionário
   */
  create: async (data: CreateEmployeeData): Promise<Employee> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      
      const newEmployee: MockEmployee = {
        id: `emp_${Date.now()}`,
        kioskId: data.kioskId,
        name: data.name,
        role: data.role,
        photo: data.photo || `https://i.pravatar.cc/150?u=${Date.now()}`,
        phone: data.phone,
        email: data.email,
        document: data.document,
        hireDate: data.hireDate,
        salary: data.salary,
        workSchedule: data.workSchedule,
        isActive: true,
        rating: 0,
        totalRatings: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      mockDataService.addEmployee(newEmployee);
      return toEmployee(newEmployee);
    }
    
    const response = await api.post<Employee>('/employees', data);
    return response;
  },

  /**
   * Atualiza funcionário
   */
  update: async (id: string, data: UpdateEmployeeData): Promise<Employee> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      
      const updated = mockDataService.updateEmployee(id, {
        ...data,
        updatedAt: new Date().toISOString(),
      });
      
      if (!updated) throw new Error('Funcionário não encontrado');
      return toEmployee(updated);
    }
    
    const response = await api.patch<Employee>(`/employees/${id}`, data);
    return response;
  },

  /**
   * Remove funcionário
   */
  delete: async (id: string): Promise<void> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      const deleted = mockDataService.deleteEmployee(id);
      if (!deleted) throw new Error('Funcionário não encontrado');
      return;
    }
    
    await api.delete(`/employees/${id}`);
  },

  /**
   * Desativa funcionário
   */
  deactivate: async (id: string): Promise<Employee> => {
    return employeeService.update(id, { isActive: false });
  },

  /**
   * Ativa funcionário
   */
  activate: async (id: string): Promise<Employee> => {
    return employeeService.update(id, { isActive: true });
  },

  /**
   * Obtém funcionários mais bem avaliados
   */
  getTopRated: async (limit: number = 10): Promise<Employee[]> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      return mockDataService.getTopEmployees(limit).map(toEmployee);
    }
    
    const response = await api.get<Employee[]>(`/employees/top-rated?limit=${limit}`);
    return response;
  },

  /**
   * Obtém estatísticas de funcionários de um quiosque
   */
  getStats: async (kioskId: string): Promise<{
    total: number;
    active: number;
    inactive: number;
    averageRating: number;
    totalSalary: number;
    byRole: Record<string, number>;
  }> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      
      const employees = mockDataService.getEmployeesByKiosk(kioskId);
      
      const byRole = employees.reduce((acc, e) => {
        acc[e.role] = (acc[e.role] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const activeEmployees = employees.filter((e) => e.isActive);
      const avgRating = activeEmployees.length > 0
        ? activeEmployees.reduce((sum, e) => sum + e.rating, 0) / activeEmployees.length
        : 0;
      
      return {
        total: employees.length,
        active: activeEmployees.length,
        inactive: employees.filter((e) => !e.isActive).length,
        averageRating: Math.round(avgRating * 10) / 10,
        totalSalary: employees.filter((e) => e.isActive).reduce((sum, e) => sum + e.salary, 0),
        byRole,
      };
    }
    
    const response = await api.get<{
      total: number;
      active: number;
      inactive: number;
      averageRating: number;
      totalSalary: number;
      byRole: Record<string, number>;
    }>(`/kiosks/${kioskId}/employees/stats`);
    return response;
  },

  /**
   * Obtém label do cargo
   */
  getRoleLabel: (role: string): string => {
    return EMPLOYEE_ROLES[role] || role;
  },
};

export default employeeService;

