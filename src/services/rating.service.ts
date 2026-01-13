/**
 * Service de Avaliações
 * Consome endpoints de ratings da FASE F
 */

import { apiClient } from "./api";

// ============================================================================
// Types - FASE F
// ============================================================================

export interface CreateRatingDto {
  targetType: "Kiosk" | "Product" | "Staff";
  targetId: string;
  score: number; // 1-5
  comment?: string;
}

export interface RatingDto {
  id: string;
  userId: string;
  userName: string;
  targetType: "Kiosk" | "Product" | "Staff";
  targetId: string;
  score: number;
  comment?: string | null;
  createdAt: string;
}

export interface RatingStatsDto {
  averageRating: number;
  totalRatings: number;
  distribution: Record<string, number>; // Estrela -> Quantidade
  recentRatings: RatingDto[];
}

// ============================================================================
// Service
// ============================================================================

export const ratingService = {
  /**
   * Cria uma nova avaliação (requer autenticação)
   * Endpoint: POST /api/ratings
   */
  create: async (data: CreateRatingDto): Promise<RatingDto> => {
    return apiClient.post<RatingDto>("/ratings", data);
  },

  /**
   * Obtém avaliações por alvo
   * Endpoint: GET /api/ratings/target
   */
  getByTarget: async (
    targetType: string,
    targetId: string
  ): Promise<RatingDto[]> => {
    return apiClient.get<RatingDto[]>("/ratings/target", {
      targetType,
      targetId,
    });
  },

  /**
   * Obtém uma avaliação por ID
   * Endpoint: GET /api/ratings/{id}
   */
  getById: async (id: string): Promise<RatingDto> => {
    return apiClient.get<RatingDto>(`/ratings/${id}`);
  },

  /**
   * Obtém estatísticas de avaliações
   * Endpoint: GET /api/ratings/stats
   */
  getStats: async (
    targetType: string,
    targetId: string
  ): Promise<RatingStatsDto> => {
    return apiClient.get<RatingStatsDto>("/ratings/stats", {
      targetType,
      targetId,
    });
  },

  /**
   * Obtém média e contagem de avaliações
   * Endpoint: GET /api/ratings/average
   */
  getAverage: async (
    targetType: string,
    targetId: string
  ): Promise<{ average: number; count: number }> => {
    return apiClient.get<{ average: number; count: number }>(
      "/ratings/average",
      { targetType, targetId }
    );
  },
};

export default ratingService;

// Rating type labels for export
export const RATING_TYPE_LABELS = {
  kiosk: "Quiosque",
  product: "Produto",
  staff: "Funcionário",
} as const;
