/**
 * Service de Planos
 * Consome endpoints de planos do backend
 */

import { apiClient } from './api';

// ============================================================================
// Types
// ============================================================================

export interface PlanDto {
  id: string;
  name: string;
  slug: string;
  description: string;
  monthlyPrice: number;
  semiannualPrice: number;
  annualPrice: number;
  maxProducts: number;
  maxOrdersPerMonth: number;
  maxEmployees: number;
  hasStockManagement: boolean;
  hasEmployeeManagement: boolean;
  hasPublicRanking: boolean;
  hasAnalytics: boolean;
  hasPrioritySupport: boolean;
  isHighlightedInRanking: boolean;
  isPopular: boolean;
  isActive: boolean;
}

// ============================================================================
// Service
// ============================================================================

export const plansService = {
  /**
   * Lista todos os planos
   */
  getAll: async (): Promise<PlanDto[]> => {
    return apiClient.get<PlanDto[]>('/plans');
  },

  /**
   * Lista planos ativos
   */
  getActive: async (): Promise<PlanDto[]> => {
    return apiClient.get<PlanDto[]>('/plans/active');
  },

  /**
   * Obtém plano por ID
   */
  getById: async (id: string): Promise<PlanDto> => {
    return apiClient.get<PlanDto>(`/plans/${id}`);
  },

  /**
   * Obtém plano por slug
   */
  getBySlug: async (slug: string): Promise<PlanDto> => {
    return apiClient.get<PlanDto>(`/plans/slug/${slug}`);
  },
};

export default plansService;

