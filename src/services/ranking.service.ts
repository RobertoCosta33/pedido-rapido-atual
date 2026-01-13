/**
 * Service de Rankings
 * Consome endpoints de ranking público do backend
 */

import { apiClient } from './api';

// ============================================================================
// Types
// ============================================================================

export interface KioskRankingDto {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  city: string;
  state: string;
  averageRating: number;
  totalRatings: number;
  isPremium: boolean;
  position: number;
}

export interface MenuItemRankingDto {
  id: string;
  name: string;
  category: string;
  kioskName: string;
  price: number;
  image: string | null;
  averageRating: number;
  totalRatings: number;
  position: number;
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

export interface FullRankingDto {
  kiosks: KioskRankingDto[];
  dishes: MenuItemRankingDto[];
  drinks: MenuItemRankingDto[];
  employees: EmployeeRankingDto[];
}

// ============================================================================
// Service
// ============================================================================

export const rankingService = {
  /**
   * Obtém ranking completo (todos os tipos)
   */
  getAll: async (limit: number = 10): Promise<FullRankingDto> => {
    return apiClient.get<FullRankingDto>('/ranking', { limit });
  },

  /**
   * Obtém ranking dos melhores quiosques
   */
  getTopKiosks: async (limit: number = 10): Promise<KioskRankingDto[]> => {
    return apiClient.get<KioskRankingDto[]>('/ranking/kiosks', { limit });
  },

  /**
   * Obtém ranking dos melhores pratos
   */
  getTopDishes: async (limit: number = 10): Promise<MenuItemRankingDto[]> => {
    return apiClient.get<MenuItemRankingDto[]>('/ranking/dishes', { limit });
  },

  /**
   * Obtém ranking das melhores bebidas
   */
  getTopDrinks: async (limit: number = 10): Promise<MenuItemRankingDto[]> => {
    return apiClient.get<MenuItemRankingDto[]>('/ranking/drinks', { limit });
  },

  /**
   * Obtém ranking dos melhores funcionários
   */
  getTopEmployees: async (limit: number = 10): Promise<EmployeeRankingDto[]> => {
    return apiClient.get<EmployeeRankingDto[]>('/ranking/employees', { limit });
  },
};

export default rankingService;

