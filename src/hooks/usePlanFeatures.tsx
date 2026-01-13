'use client';

/**
 * Hook para verificar funcionalidades disponíveis do plano
 * Usado para bloqueio de features por plano
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { licenseService, planService } from '@/services';

// Interface das features do plano
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
  rankingEnabled: boolean;
  employeesEnabled: boolean;
  highlightedInRanking: boolean;
}

// Interface dos limites do plano
export interface PlanLimits {
  products: number;
  ordersPerMonth: number;
  employees: number;
  categories: number;
  imagesPerProduct: number;
}

// Interface do resultado do hook
export interface UsePlanFeaturesResult {
  features: PlanFeatures | null;
  limits: PlanLimits | null;
  planName: string | null;
  planSlug: string | null;
  isPremium: boolean;
  isProfessional: boolean;
  isBasic: boolean;
  loading: boolean;
  error: string | null;
  hasFeature: (feature: keyof PlanFeatures) => boolean;
  checkLimit: (limit: keyof PlanLimits, currentValue: number) => boolean;
  refresh: () => Promise<void>;
}

// Features padrão (plano gratuito/sem plano)
const defaultFeatures: PlanFeatures = {
  stockManagement: false,
  recipeManagement: false,
  analytics: false,
  advancedAnalytics: false,
  employeeManagement: false,
  publicRanking: false,
  prioritySupport: false,
  customDomain: false,
  apiAccess: false,
  whatsappIntegration: false,
  multipleMenus: false,
  promotions: false,
  loyaltyProgram: false,
  tableManagement: false,
  kitchenDisplay: false,
  exportReports: false,
  rankingEnabled: false,
  employeesEnabled: false,
  highlightedInRanking: false,
};

// Limites padrão (plano gratuito/sem plano)
const defaultLimits: PlanLimits = {
  products: 10,
  ordersPerMonth: 50,
  employees: 0,
  categories: 3,
  imagesPerProduct: 1,
};

/**
 * Hook para gerenciar features e limites do plano do quiosque atual
 */
export const usePlanFeatures = (kioskId?: string): UsePlanFeaturesResult => {
  const { user } = useAuth();
  const [features, setFeatures] = useState<PlanFeatures | null>(null);
  const [limits, setLimits] = useState<PlanLimits | null>(null);
  const [planName, setPlanName] = useState<string | null>(null);
  const [planSlug, setPlanSlug] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Carrega dados do plano
   */
  const loadPlanData = useCallback(async () => {
    // Determina o kioskId a usar
    const targetKioskId = kioskId || user?.kioskId;
    
    if (!targetKioskId) {
      setFeatures(defaultFeatures);
      setLimits(defaultLimits);
      setPlanName(null);
      setPlanSlug(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Busca licença do quiosque
      const license = await licenseService.getByKiosk(targetKioskId);

      if (!license || license.status !== 'active') {
        // Licença inativa ou expirada - usa defaults
        setFeatures(defaultFeatures);
        setLimits(defaultLimits);
        setPlanName('Sem Plano');
        setPlanSlug(null);
        return;
      }

      // Busca detalhes do plano
      const plan = await planService.getById(license.planId);

      if (plan) {
        // Mescla features do plano com as novas flags
        const planFeatures: PlanFeatures = {
          stockManagement: plan.features.stockManagement ?? false,
          recipeManagement: plan.features.recipeManagement ?? false,
          analytics: plan.features.analytics ?? false,
          advancedAnalytics: plan.features.advancedAnalytics ?? false,
          employeeManagement: plan.features.employeeManagement ?? false,
          publicRanking: plan.features.publicRanking ?? false,
          prioritySupport: plan.features.prioritySupport ?? false,
          customDomain: plan.features.customDomain ?? false,
          apiAccess: plan.features.apiAccess ?? false,
          whatsappIntegration: plan.features.whatsappIntegration ?? false,
          multipleMenus: plan.features.multipleMenus ?? false,
          promotions: plan.features.promotions ?? false,
          loyaltyProgram: plan.features.loyaltyProgram ?? false,
          tableManagement: plan.features.tableManagement ?? false,
          kitchenDisplay: plan.features.kitchenDisplay ?? false,
          exportReports: plan.features.exportReports ?? false,
          rankingEnabled: plan.features.rankingEnabled ?? plan.features.publicRanking ?? false,
          employeesEnabled: plan.features.employeesEnabled ?? plan.features.employeeManagement ?? false,
          highlightedInRanking: plan.features.highlightedInRanking ?? false,
        };

        const planLimits: PlanLimits = {
          products: plan.limits.products ?? defaultLimits.products,
          ordersPerMonth: plan.limits.ordersPerMonth ?? defaultLimits.ordersPerMonth,
          employees: plan.limits.employees ?? defaultLimits.employees,
          categories: plan.limits.categories ?? defaultLimits.categories,
          imagesPerProduct: plan.limits.imagesPerProduct ?? defaultLimits.imagesPerProduct,
        };

        setFeatures(planFeatures);
        setLimits(planLimits);
        setPlanName(plan.name);
        setPlanSlug(plan.slug);
      } else {
        // Usa features da licença se plano não encontrado
        setFeatures({
          ...defaultFeatures,
          ...license.features,
          rankingEnabled: license.features.publicRanking ?? false,
          employeesEnabled: license.features.employeeManagement ?? false,
          highlightedInRanking: false,
        } as PlanFeatures);
        setLimits({
          ...defaultLimits,
          ...license.limits,
        } as PlanLimits);
        setPlanName(license.plan);
        setPlanSlug(license.plan);
      }
    } catch (err) {
      console.error('Erro ao carregar dados do plano:', err);
      setError('Não foi possível carregar os dados do plano');
      setFeatures(defaultFeatures);
      setLimits(defaultLimits);
    } finally {
      setLoading(false);
    }
  }, [kioskId, user?.kioskId]);

  useEffect(() => {
    loadPlanData();
  }, [loadPlanData]);

  /**
   * Verifica se uma feature está disponível
   */
  const hasFeature = useCallback((feature: keyof PlanFeatures): boolean => {
    if (!features) return false;
    return features[feature] === true;
  }, [features]);

  /**
   * Verifica se está dentro do limite
   * -1 significa ilimitado
   */
  const checkLimit = useCallback((limit: keyof PlanLimits, currentValue: number): boolean => {
    if (!limits) return false;
    const maxValue = limits[limit];
    return maxValue === -1 || currentValue < maxValue;
  }, [limits]);

  // Helpers para verificar tipo de plano
  const isPremium = planSlug === 'premium';
  const isProfessional = planSlug === 'professional';
  const isBasic = planSlug === 'basic';

  return {
    features,
    limits,
    planName,
    planSlug,
    isPremium,
    isProfessional,
    isBasic,
    loading,
    error,
    hasFeature,
    checkLimit,
    refresh: loadPlanData,
  };
};

export default usePlanFeatures;

