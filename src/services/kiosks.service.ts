/**
 * Service de Quiosques
 * Consome endpoints reais do backend ASP.NET Core
 */

import { apiClient } from './api';

// ============================================================================
// Types - Tipagem dos dados vindos do backend
// ============================================================================

export interface KioskDto {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo: string;
  coverImage: string;
  city: string;
  state: string;
  phone: string;
  whatsApp: string;
  allowOnlineOrders: boolean;
  estimatedPrepTime: number;
  averageRating: number;
  totalRatings: number;
  isPremium: boolean;
  createdAt: string;
}

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

export interface CreateKioskDto {
  name: string;
  description: string;
  logo?: string;
  coverImage?: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  whatsApp?: string;
  email: string;
  instagram?: string;
  ownerId: string;
}

export interface UpdateKioskDto {
  name?: string;
  description?: string;
  logo?: string;
  coverImage?: string;
  phone?: string;
  whatsApp?: string;
  email?: string;
  instagram?: string;
  allowOnlineOrders?: boolean;
  estimatedPrepTime?: number;
}

// ============================================================================
// Service
// ============================================================================

export const kiosksService = {
  /**
   * Lista todos os quiosques
   */
  getAll: async (): Promise<KioskDto[]> => {
    return apiClient.get<KioskDto[]>('/kiosks');
  },

  /**
   * Lista quiosques ativos
   */
  getActive: async (): Promise<KioskDto[]> => {
    return apiClient.get<KioskDto[]>('/kiosks/active');
  },

  /**
   * Obtém quiosque por ID
   */
  getById: async (id: string): Promise<KioskDto> => {
    return apiClient.get<KioskDto>(`/kiosks/${id}`);
  },

  /**
   * Obtém quiosque por slug (URL amigável)
   */
  getBySlug: async (slug: string): Promise<KioskDto> => {
    return apiClient.get<KioskDto>(`/kiosks/slug/${slug}`);
  },

  /**
   * Cria novo quiosque
   */
  create: async (data: CreateKioskDto): Promise<KioskDto> => {
    return apiClient.post<KioskDto>('/kiosks', data);
  },

  /**
   * Atualiza quiosque
   */
  update: async (id: string, data: UpdateKioskDto): Promise<KioskDto> => {
    return apiClient.put<KioskDto>(`/kiosks/${id}`, data);
  },

  /**
   * Remove quiosque
   */
  delete: async (id: string): Promise<void> => {
    return apiClient.delete(`/kiosks/${id}`);
  },

  /**
   * Obtém ranking dos quiosques mais bem avaliados
   */
  getRanking: async (limit: number = 10): Promise<KioskRankingDto[]> => {
    return apiClient.get<KioskRankingDto[]>('/kiosks/ranking', { limit });
  },
};

export default kiosksService;

