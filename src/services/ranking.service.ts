/**
 * Service de Rankings
 * Consome endpoints de ranking público do backend (FASE F)
 */

import { apiClient } from "./api";

// ============================================================================
// Types - Atualizados para FASE F
// ============================================================================

export interface RankingItemDto {
  id: string;
  name: string;
  averageRating: number;
  totalRatings: number;
  description?: string | null;
  image?: string | null;
}

// ============================================================================
// Service - Endpoints da FASE F
// ============================================================================

export const rankingService = {
  /**
   * Obtém ranking dos melhores quiosques
   * Endpoint: GET /api/rankings/kiosks
   */
  getTopKiosks: async (limit: number = 10): Promise<RankingItemDto[]> => {
    return apiClient.get<RankingItemDto[]>("/rankings/kiosks", { limit });
  },

  /**
   * Obtém ranking dos melhores produtos
   * Endpoint: GET /api/rankings/products
   */
  getTopProducts: async (limit: number = 10): Promise<RankingItemDto[]> => {
    return apiClient.get<RankingItemDto[]>("/rankings/products", { limit });
  },

  /**
   * Obtém ranking dos melhores funcionários
   * Endpoint: GET /api/rankings/staff
   */
  getTopStaff: async (limit: number = 10): Promise<RankingItemDto[]> => {
    return apiClient.get<RankingItemDto[]>("/rankings/staff", { limit });
  },

  /**
   * Obtém todos os rankings de uma vez
   */
  getAll: async (
    limit: number = 10
  ): Promise<{
    kiosks: RankingItemDto[];
    products: RankingItemDto[];
    staff: RankingItemDto[];
  }> => {
    const [kiosks, products, staff] = await Promise.all([
      rankingService.getTopKiosks(limit),
      rankingService.getTopProducts(limit),
      rankingService.getTopStaff(limit),
    ]);

    return { kiosks, products, staff };
  },
};

export default rankingService;
