/**
 * Serviço de licenças
 * Gerencia licenças dos quiosques
 */

import { api } from './api';
import { mockDataService, simulateDelay, MockLicense } from './mock.service';

export interface LicenseFeatures {
  stockManagement: boolean;
  recipeManagement: boolean;
  analytics: boolean;
  advancedAnalytics: boolean;
  employeeManagement: boolean;
  publicRanking: boolean;
  prioritySupport: boolean;
  customDomain: boolean;
  apiAccess: boolean;
}

export interface LicenseLimits {
  products: number;
  ordersPerMonth: number;
  employees: number;
}

export interface License {
  id: string;
  kioskId: string;
  kioskName: string;
  planId: string;
  plan: 'basic' | 'professional' | 'premium';
  status: 'active' | 'expiring_soon' | 'expired' | 'suspended';
  startDate: Date;
  expiryDate: Date;
  billingCycle: 'monthly' | 'semiannual' | 'annual';
  price: number;
  totalPaid: number;
  autoRenew: boolean;
  features: LicenseFeatures;
  limits: LicenseLimits;
  paymentHistory: Array<{
    id: string;
    date: Date;
    amount: number;
    status: 'paid' | 'pending' | 'failed';
    method: string;
    invoice?: string;
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
  planId: mock.planId,
  plan: mock.plan as License['plan'],
  status: mock.status as License['status'],
  startDate: new Date(mock.startDate),
  expiryDate: new Date(mock.expiryDate),
  billingCycle: mock.billingCycle as License['billingCycle'],
  price: mock.price,
  totalPaid: mock.totalPaid,
  autoRenew: mock.autoRenew,
  features: mock.features as LicenseFeatures,
  limits: mock.limits as LicenseLimits,
  paymentHistory: mock.paymentHistory.map((p) => ({
    id: p.id,
    date: new Date(p.date),
    amount: p.amount,
    status: p.status as 'paid' | 'pending' | 'failed',
    method: p.method,
    invoice: p.invoice,
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
    return response;
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
    return response;
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
    return response;
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
    return response;
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
    return response;
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
    return response;
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
    return response;
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
      
      const planFeatures: Record<string, LicenseFeatures> = {
        basic: {
          stockManagement: true,
          recipeManagement: false,
          analytics: false,
          advancedAnalytics: false,
          employeeManagement: false,
          publicRanking: false,
          prioritySupport: false,
          customDomain: false,
          apiAccess: false,
        },
        professional: {
          stockManagement: true,
          recipeManagement: true,
          analytics: true,
          advancedAnalytics: false,
          employeeManagement: true,
          publicRanking: true,
          prioritySupport: false,
          customDomain: false,
          apiAccess: false,
        },
        premium: {
          stockManagement: true,
          recipeManagement: true,
          analytics: true,
          advancedAnalytics: true,
          employeeManagement: true,
          publicRanking: true,
          prioritySupport: true,
          customDomain: true,
          apiAccess: true,
        },
      };

      const planLimits: Record<string, LicenseLimits> = {
        basic: { products: 50, ordersPerMonth: 500, employees: 0 },
        professional: { products: -1, ordersPerMonth: -1, employees: 5 },
        premium: { products: -1, ordersPerMonth: -1, employees: -1 },
      };
      
      const updated: MockLicense = {
        ...license,
        planId: `plan_${newPlan}`,
        plan: newPlan,
        price: planPrices[newPlan],
        features: planFeatures[newPlan],
        limits: planLimits[newPlan],
        updatedAt: new Date().toISOString(),
      };
      
      mockDataService.updateLicense(id, updated);
      return toLicense(updated);
    }
    
    const response = await api.patch<License>(`/licenses/${id}/plan`, { plan: newPlan });
    return response;
  },

};

/**
 * Verifica se feature está disponível na licença
 */
export const hasLicenseFeature = async (kioskId: string, feature: keyof LicenseFeatures): Promise<boolean> => {
  const license = await licenseService.getByKiosk(kioskId);
  if (!license) return false;
  return license.features[feature] === true;
};

/**
 * Verifica se limite foi atingido
 */
export const checkLicenseLimit = async (kioskId: string, limitType: keyof LicenseLimits, currentValue: number): Promise<boolean> => {
  const license = await licenseService.getByKiosk(kioskId);
  if (!license) return false;
  const limit = license.limits[limitType];
  if (limit === -1) return true; // Ilimitado
  return currentValue < limit;
};

export default licenseService;

