/**
 * Serviço de planos
 * Gerencia planos de assinatura do sistema
 */

import { api } from './api';
import { simulateDelay } from './mock.service';
import plansData from '@/mock/plans.json';

export interface PlanPricing {
  monthly: number;
  semiannual: number;
  annual: number;
  monthlyDiscount: {
    semiannual: number;
    annual: number;
  };
}

export interface PlanLimits {
  products: number;
  ordersPerMonth: number;
  employees: number;
  categories: number;
  imagesPerProduct: number;
}

export interface PlanFeatures {
  stockManagement: boolean;
  recipeManagement: boolean;
  analytics: boolean;
  advancedAnalytics: boolean;
  employeeManagement: boolean;
  publicRanking: boolean;
  prioritySupport: boolean;
  customDomain: boolean;
  apiAccess: boolean;
  whatsappIntegration: boolean;
  multipleMenus: boolean;
  promotions: boolean;
  loyaltyProgram: boolean;
  tableManagement: boolean;
  kitchenDisplay: boolean;
  exportReports: boolean;
}

export interface Plan {
  id: string;
  name: string;
  slug: string;
  description: string;
  badge: string | null;
  pricing: PlanPricing;
  limits: PlanLimits;
  features: PlanFeatures;
  order: number;
  isActive: boolean;
  isPopular: boolean;
}

// Estado mutável para simular operações
const plans: Plan[] = [...(plansData as Plan[])];

export const planService = {
  /**
   * Lista todos os planos ativos
   */
  getAll: async (): Promise<Plan[]> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      return plans.filter((p) => p.isActive).sort((a, b) => a.order - b.order);
    }
    
    const response = await api.get<Plan[]>('/plans');
    return response.data;
  },

  /**
   * Obtém plano por ID
   */
  getById: async (id: string): Promise<Plan> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      const plan = plans.find((p) => p.id === id);
      if (!plan) throw new Error('Plano não encontrado');
      return plan;
    }
    
    const response = await api.get<Plan>(`/plans/${id}`);
    return response.data;
  },

  /**
   * Obtém plano por slug
   */
  getBySlug: async (slug: string): Promise<Plan> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      const plan = plans.find((p) => p.slug === slug);
      if (!plan) throw new Error('Plano não encontrado');
      return plan;
    }
    
    const response = await api.get<Plan>(`/plans/slug/${slug}`);
    return response.data;
  },

  /**
   * Calcula preço do plano por ciclo de cobrança
   */
  calculatePrice: (plan: Plan, billingCycle: 'monthly' | 'semiannual' | 'annual'): number => {
    switch (billingCycle) {
      case 'monthly':
        return plan.pricing.monthly;
      case 'semiannual':
        return plan.pricing.semiannual;
      case 'annual':
        return plan.pricing.annual;
      default:
        return plan.pricing.monthly;
    }
  },

  /**
   * Calcula economia por ciclo de cobrança
   */
  calculateSavings: (plan: Plan, billingCycle: 'monthly' | 'semiannual' | 'annual'): number => {
    const monthlyTotal = plan.pricing.monthly * (billingCycle === 'annual' ? 12 : billingCycle === 'semiannual' ? 6 : 1);
    const actualPrice = planService.calculatePrice(plan, billingCycle);
    return monthlyTotal - actualPrice;
  },

  /**
   * Verifica se feature está disponível no plano
   */
  hasFeature: (plan: Plan, feature: keyof PlanFeatures): boolean => {
    return plan.features[feature] === true;
  },

  /**
   * Verifica se plano tem limite suficiente
   */
  checkLimit: (plan: Plan, limitType: keyof PlanLimits, currentValue: number): boolean => {
    const limit = plan.limits[limitType];
    if (limit === -1) return true; // Ilimitado
    return currentValue < limit;
  },

  /**
   * Compara dois planos
   */
  comparePlans: async (): Promise<{
    features: Array<{
      name: string;
      key: keyof PlanFeatures;
      basic: boolean;
      professional: boolean;
      premium: boolean;
    }>;
    limits: Array<{
      name: string;
      key: keyof PlanLimits;
      basic: string;
      professional: string;
      premium: string;
    }>;
  }> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();

      const basic = plans.find((p) => p.slug === 'basic')!;
      const professional = plans.find((p) => p.slug === 'professional')!;
      const premium = plans.find((p) => p.slug === 'premium')!;

      const featureLabels: Record<keyof PlanFeatures, string> = {
        stockManagement: 'Controle de Estoque',
        recipeManagement: 'Gestão de Receitas',
        analytics: 'Analytics Básico',
        advancedAnalytics: 'Analytics Avançado',
        employeeManagement: 'Gestão de Funcionários',
        publicRanking: 'Ranking Público',
        prioritySupport: 'Suporte Prioritário',
        customDomain: 'Domínio Personalizado',
        apiAccess: 'Acesso à API',
        whatsappIntegration: 'Integração WhatsApp',
        multipleMenus: 'Múltiplos Cardápios',
        promotions: 'Sistema de Promoções',
        loyaltyProgram: 'Programa de Fidelidade',
        tableManagement: 'Gestão de Mesas',
        kitchenDisplay: 'Painel da Cozinha',
        exportReports: 'Exportar Relatórios',
      };

      const limitLabels: Record<keyof PlanLimits, string> = {
        products: 'Produtos',
        ordersPerMonth: 'Pedidos/Mês',
        employees: 'Funcionários',
        categories: 'Categorias',
        imagesPerProduct: 'Imagens por Produto',
      };

      const formatLimit = (value: number): string => {
        if (value === -1) return 'Ilimitado';
        if (value === 0) return '—';
        return String(value);
      };

      const features = (Object.keys(featureLabels) as Array<keyof PlanFeatures>).map((key) => ({
        name: featureLabels[key],
        key,
        basic: basic.features[key],
        professional: professional.features[key],
        premium: premium.features[key],
      }));

      const limits = (Object.keys(limitLabels) as Array<keyof PlanLimits>).map((key) => ({
        name: limitLabels[key],
        key,
        basic: formatLimit(basic.limits[key]),
        professional: formatLimit(professional.limits[key]),
        premium: formatLimit(premium.limits[key]),
      }));

      return { features, limits };
    }

    const response = await api.get<{
      features: Array<{
        name: string;
        key: keyof PlanFeatures;
        basic: boolean;
        professional: boolean;
        premium: boolean;
      }>;
      limits: Array<{
        name: string;
        key: keyof PlanLimits;
        basic: string;
        professional: string;
        premium: string;
      }>;
    }>('/plans/compare');
    return response.data;
  },
};

export default planService;

