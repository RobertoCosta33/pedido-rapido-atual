/**
 * Serviço de licenças
 * Gerencia licenças dos quiosques
 */

import { api } from './api';
import { mockDataService, simulateDelay, MockLicense } from './mock.service';

export interface License {
  id: string;
  kioskId: string;
  kioskName: string;
  plan: 'basic' | 'professional' | 'premium';
  status: 'active' | 'expiring_soon' | 'expired' | 'suspended';
  startDate: Date;
  expiryDate: Date;
  price: number;
  billingCycle: 'monthly' | 'yearly';
  features: string[];
  maxProducts: number;
  maxOrdersPerMonth: number;
  paymentHistory: Array<{
    id: string;
    date: Date;
    amount: number;
    status: 'paid' | 'pending' | 'failed';
    method: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Converte MockLicense para License
 */
const toLicense = (mock: MockLicense): License => ({
  id: mock.id,
  kioskId: mock.kioskId,
  kioskName: mock.kioskName,
  plan: mock.plan as License['plan'],
  status: mock.status as License['status'],
  startDate: new Date(mock.startDate),
  expiryDate: new Date(mock.expiryDate),
  price: mock.price,
  billingCycle: mock.billingCycle as License['billingCycle'],
  features: mock.features,
  maxProducts: mock.maxProducts,
  maxOrdersPerMonth: mock.maxOrdersPerMonth,
  paymentHistory: mock.paymentHistory.map((p) => ({
    ...p,
    date: new Date(p.date),
    status: p.status as 'paid' | 'pending' | 'failed',
  })),
  createdAt: new Date(mock.createdAt),
  updatedAt: new Date(mock.updatedAt),
});

export const licenseService = {
  /**
   * Lista todas as licenças
   */
  getAll: async (): Promise<License[]> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      return mockDataService.getLicenses().map(toLicense);
    }
    
    const response = await api.get<License[]>('/licenses');
    return response.data;
  },

  /**
   * Obtém licença por ID
   */
  getById: async (id: string): Promise<License> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      const license = mockDataService.getLicenseById(id);
      if (!license) throw new Error('Licença não encontrada');
      return toLicense(license);
    }
    
    const response = await api.get<License>(`/licenses/${id}`);
    return response.data;
  },

  /**
   * Obtém licença de um quiosque
   */
  getByKiosk: async (kioskId: string): Promise<License | null> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      const license = mockDataService.getLicenseByKiosk(kioskId);
      return license ? toLicense(license) : null;
    }
    
    const response = await api.get<License>(`/kiosks/${kioskId}/license`);
    return response.data;
  },

  /**
   * Lista licenças por status
   */
  getByStatus: async (status: License['status']): Promise<License[]> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      return mockDataService
        .getLicenses()
        .filter((l) => l.status === status)
        .map(toLicense);
    }
    
    const response = await api.get<License[]>(`/licenses?status=${status}`);
    return response.data;
  },

  /**
   * Lista licenças expirando em breve
   */
  getExpiringSoon: async (days: number = 30): Promise<License[]> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + days);
      
      return mockDataService
        .getLicenses()
        .filter((l) => {
          const expiryDate = new Date(l.expiryDate);
          return expiryDate <= futureDate && l.status !== 'expired';
        })
        .map(toLicense);
    }
    
    const response = await api.get<License[]>(`/licenses/expiring-soon?days=${days}`);
    return response.data;
  },

  /**
   * Obtém estatísticas de licenças
   */
  getStats: async (): Promise<{
    total: number;
    active: number;
    expiringSoon: number;
    expired: number;
    totalRevenue: number;
    byPlan: Record<string, number>;
  }> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      
      const licenses = mockDataService.getLicenses();
      
      const byPlan = licenses.reduce((acc, l) => {
        acc[l.plan] = (acc[l.plan] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const totalRevenue = licenses.reduce((sum, l) => {
        const paidPayments = l.paymentHistory.filter((p) => p.status === 'paid');
        return sum + paidPayments.reduce((s, p) => s + p.amount, 0);
      }, 0);
      
      return {
        total: licenses.length,
        active: licenses.filter((l) => l.status === 'active').length,
        expiringSoon: licenses.filter((l) => l.status === 'expiring_soon').length,
        expired: licenses.filter((l) => l.status === 'expired').length,
        totalRevenue,
        byPlan,
      };
    }
    
    const response = await api.get<{
      total: number;
      active: number;
      expiringSoon: number;
      expired: number;
      totalRevenue: number;
      byPlan: Record<string, number>;
    }>('/licenses/stats');
    return response.data;
  },

  /**
   * Renova licença
   */
  renew: async (
    id: string,
    months: number = 1
  ): Promise<License> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      
      const license = mockDataService.getLicenseById(id);
      if (!license) throw new Error('Licença não encontrada');
      
      const newExpiry = new Date(license.expiryDate);
      newExpiry.setMonth(newExpiry.getMonth() + months);
      
      // Simula renovação (em produção, atualizaria no banco)
      const updated: MockLicense = {
        ...license,
        expiryDate: newExpiry.toISOString(),
        status: 'active',
        updatedAt: new Date().toISOString(),
        paymentHistory: [
          ...license.paymentHistory,
          {
            id: `pay_${Date.now()}`,
            date: new Date().toISOString(),
            amount: license.price * months,
            status: 'paid',
            method: 'credit_card',
          },
        ],
      };
      
      return toLicense(updated);
    }
    
    const response = await api.post<License>(`/licenses/${id}/renew`, { months });
    return response.data;
  },

  /**
   * Altera plano da licença
   */
  changePlan: async (
    id: string,
    newPlan: License['plan']
  ): Promise<License> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      
      const license = mockDataService.getLicenseById(id);
      if (!license) throw new Error('Licença não encontrada');
      
      const planPrices = {
        basic: 99.90,
        professional: 199.90,
        premium: 299.90,
      };
      
      const planFeatures = {
        basic: ['stock_management', 'basic_analytics'],
        professional: ['unlimited_products', 'unlimited_orders', 'stock_management', 'recipe_management', 'analytics'],
        premium: ['unlimited_products', 'unlimited_orders', 'stock_management', 'recipe_management', 'analytics', 'priority_support', 'custom_domain'],
      };
      
      const updated: MockLicense = {
        ...license,
        plan: newPlan,
        price: planPrices[newPlan],
        features: planFeatures[newPlan],
        maxProducts: newPlan === 'basic' ? 50 : -1,
        maxOrdersPerMonth: newPlan === 'basic' ? 500 : -1,
        updatedAt: new Date().toISOString(),
      };
      
      return toLicense(updated);
    }
    
    const response = await api.patch<License>(`/licenses/${id}/plan`, { plan: newPlan });
    return response.data;
  },
};

export default licenseService;

