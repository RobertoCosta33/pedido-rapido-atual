/**
 * Service de Itens de Menu (Cardápio)
 * Consome endpoints de pratos e bebidas do backend
 */

import { apiClient } from './api';

// ============================================================================
// Types
// ============================================================================

export interface MenuItemDto {
  id: string;
  kioskId: string;
  kioskName: string;
  name: string;
  description: string;
  price: number;
  image: string | null;
  category: 'Dish' | 'Drink' | 'Appetizer' | 'Dessert';
  isAvailable: boolean;
  preparationTime: number;
  averageRating: number;
  totalRatings: number;
  createdAt: string;
}

export interface CreateMenuItemDto {
  kioskId: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  category: 'Dish' | 'Drink' | 'Appetizer' | 'Dessert';
  preparationTime: number;
}

export interface UpdateMenuItemDto {
  name?: string;
  description?: string;
  price?: number;
  image?: string;
  category?: 'Dish' | 'Drink' | 'Appetizer' | 'Dessert';
  isAvailable?: boolean;
  preparationTime?: number;
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

// ============================================================================
// Service
// ============================================================================

export const menuItemsService = {
  /**
   * Lista todos os itens de menu
   */
  getAll: async (): Promise<MenuItemDto[]> => {
    return apiClient.get<MenuItemDto[]>('/menuitems');
  },

  /**
   * Lista itens de menu de um quiosque
   */
  getByKiosk: async (kioskId: string): Promise<MenuItemDto[]> => {
    return apiClient.get<MenuItemDto[]>(`/menuitems/kiosk/${kioskId}`);
  },

  /**
   * Obtém item por ID
   */
  getById: async (id: string): Promise<MenuItemDto> => {
    return apiClient.get<MenuItemDto>(`/menuitems/${id}`);
  },

  /**
   * Cria novo item de menu
   */
  create: async (data: CreateMenuItemDto): Promise<MenuItemDto> => {
    return apiClient.post<MenuItemDto>('/menuitems', data);
  },

  /**
   * Atualiza item de menu
   */
  update: async (id: string, data: UpdateMenuItemDto): Promise<MenuItemDto> => {
    return apiClient.put<MenuItemDto>(`/menuitems/${id}`, data);
  },

  /**
   * Remove item de menu
   */
  delete: async (id: string): Promise<void> => {
    return apiClient.delete(`/menuitems/${id}`);
  },

  /**
   * Obtém ranking dos pratos mais bem avaliados
   */
  getTopDishes: async (limit: number = 10): Promise<MenuItemRankingDto[]> => {
    return apiClient.get<MenuItemRankingDto[]>('/menuitems/ranking/dishes', { limit });
  },

  /**
   * Obtém ranking das bebidas mais bem avaliadas
   */
  getTopDrinks: async (limit: number = 10): Promise<MenuItemRankingDto[]> => {
    return apiClient.get<MenuItemRankingDto[]>('/menuitems/ranking/drinks', { limit });
  },
};

export default menuItemsService;

