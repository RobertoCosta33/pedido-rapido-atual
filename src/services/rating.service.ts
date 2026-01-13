/**
 * Serviço de avaliações
 * Gerencia avaliações de produtos, funcionários, quiosques e atendimento
 */

import { api } from './api';
import { mockDataService, simulateDelay, MockRating } from './mock.service';

export type RatingType = 'product' | 'employee' | 'kiosk' | 'service';

export interface Rating {
  id: string;
  type: RatingType;
  targetId: string;
  targetName: string;
  kioskId: string;
  kioskName: string;
  orderId: string;
  customerId: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface CreateRatingData {
  type: RatingType;
  targetId: string;
  targetName: string;
  kioskId: string;
  kioskName: string;
  orderId: string;
  customerId: string;
  customerName: string;
  rating: number;
  comment?: string;
}

export interface RatedItem {
  id: string;
  name: string;
  kioskId?: string;
  kioskName?: string;
  average: number;
  count: number;
}

export interface KioskRanking {
  id: string;
  name: string;
  slug: string;
  average: number;
  count: number;
  isPremium: boolean;
  city?: string;
  state?: string;
  logo?: string;
}

// Labels para tipos de avaliação
export const RATING_TYPE_LABELS: Record<RatingType, string> = {
  product: 'Produto',
  employee: 'Funcionário',
  kiosk: 'Quiosque',
  service: 'Atendimento',
};

/**
 * Converte MockRating para Rating
 */
const toRating = (mock: MockRating): Rating => ({
  id: mock.id,
  type: mock.type,
  targetId: mock.targetId,
  targetName: mock.targetName,
  kioskId: mock.kioskId,
  kioskName: mock.kioskName,
  orderId: mock.orderId,
  customerId: mock.customerId,
  customerName: mock.customerName,
  rating: mock.rating,
  comment: mock.comment,
  createdAt: new Date(mock.createdAt),
});

export const ratingService = {
  /**
   * Lista todas as avaliações
   */
  getAll: async (): Promise<Rating[]> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      return mockDataService.getRatings().map(toRating);
    }
    
    const response = await api.get<Rating[]>('/ratings');
    return response.data;
  },

  /**
   * Lista avaliações de um quiosque
   */
  getByKiosk: async (kioskId: string): Promise<Rating[]> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      return mockDataService.getRatingsByKiosk(kioskId).map(toRating);
    }
    
    const response = await api.get<Rating[]>(`/kiosks/${kioskId}/ratings`);
    return response.data;
  },

  /**
   * Lista avaliações de um alvo específico
   */
  getByTarget: async (type: RatingType, targetId: string): Promise<Rating[]> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      return mockDataService.getRatingsByTarget(type, targetId).map(toRating);
    }
    
    const response = await api.get<Rating[]>(`/ratings?type=${type}&targetId=${targetId}`);
    return response.data;
  },

  /**
   * Lista avaliações de um pedido
   */
  getByOrder: async (orderId: string): Promise<Rating[]> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      return mockDataService.getRatingsByOrder(orderId).map(toRating);
    }
    
    const response = await api.get<Rating[]>(`/orders/${orderId}/ratings`);
    return response.data;
  },

  /**
   * Lista avaliações por entidade (type e entityId)
   */
  getByEntity: async (entityType: RatingType, entityId: string): Promise<Rating[]> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      return mockDataService.getRatingsByTarget(entityType, entityId).map(toRating);
    }
    
    const response = await api.get<Rating[]>(`/ratings?type=${entityType}&entityId=${entityId}`);
    return response.data;
  },

  /**
   * Cria nova avaliação
   */
  create: async (data: CreateRatingData): Promise<Rating> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      
      const newRating: MockRating = {
        id: `rat_${Date.now()}`,
        type: data.type,
        targetId: data.targetId,
        targetName: data.targetName,
        kioskId: data.kioskId,
        kioskName: data.kioskName,
        orderId: data.orderId,
        customerId: data.customerId,
        customerName: data.customerName,
        rating: data.rating,
        comment: data.comment || '',
        createdAt: new Date().toISOString(),
      };
      
      mockDataService.addRating(newRating);
      return toRating(newRating);
    }
    
    const response = await api.post<Rating>('/ratings', data);
    return response.data;
  },

  /**
   * Obtém média de avaliação de um alvo
   */
  getAverageRating: async (type: RatingType, targetId: string): Promise<number> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      return mockDataService.getAverageRating(type, targetId);
    }
    
    const response = await api.get<{ average: number }>(`/ratings/average?type=${type}&targetId=${targetId}`);
    return response.data.average;
  },

  /**
   * Obtém produtos mais bem avaliados (ranking)
   */
  getTopProducts: async (limit: number = 10): Promise<RatedItem[]> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      const topProducts = mockDataService.getTopRatedProducts(limit);
      return topProducts.map((p) => ({
        id: p.id,
        name: p.name,
        kioskId: p.kioskId,
        kioskName: p.kioskName,
        average: Math.round(p.average * 10) / 10,
        count: p.count,
      }));
    }
    
    const response = await api.get<RatedItem[]>(`/ratings/top-products?limit=${limit}`);
    return response.data;
  },

  /**
   * Obtém bebidas mais bem avaliadas
   * (Filtra produtos que são bebidas por nome ou categoria)
   */
  getTopDrinks: async (limit: number = 10): Promise<RatedItem[]> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      
      const drinkKeywords = ['caipirinha', 'cerveja', 'suco', 'água', 'refrigerante', 'mojito', 'drink', 'chopp', 'vinho', 'espumante'];
      const topProducts = mockDataService.getTopRatedProducts(50);
      
      const drinks = topProducts.filter((p) => 
        drinkKeywords.some((keyword) => p.name.toLowerCase().includes(keyword))
      ).slice(0, limit);
      
      return drinks.map((d) => ({
        id: d.id,
        name: d.name,
        kioskId: d.kioskId,
        kioskName: d.kioskName,
        average: Math.round(d.average * 10) / 10,
        count: d.count,
      }));
    }
    
    const response = await api.get<RatedItem[]>(`/ratings/top-drinks?limit=${limit}`);
    return response.data;
  },

  /**
   * Obtém funcionários mais bem avaliados
   */
  getTopEmployees: async (limit: number = 10): Promise<RatedItem[]> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      
      const employees = mockDataService.getTopEmployees(limit);
      return employees.map((e) => ({
        id: e.id,
        name: e.name,
        kioskId: e.kioskId,
        average: e.rating,
        count: e.totalRatings,
      }));
    }
    
    const response = await api.get<RatedItem[]>(`/ratings/top-employees?limit=${limit}`);
    return response.data;
  },

  /**
   * Obtém quiosques mais bem avaliados (ranking público)
   */
  getTopKiosks: async (limit: number = 10): Promise<KioskRanking[]> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      
      const topKiosks = mockDataService.getTopRatedKiosks(limit);
      const licenses = mockDataService.getLicenses();
      const kiosks = mockDataService.getKiosks();
      
      return topKiosks.map((k) => {
        const kiosk = kiosks.find((kq) => kq.id === k.id);
        const license = licenses.find((l) => l.kioskId === k.id);
        const isPremium = license?.plan === 'premium';
        
        return {
          id: k.id,
          name: k.name,
          slug: kiosk?.slug || '',
          average: Math.round(k.average * 10) / 10,
          count: k.count,
          isPremium,
          city: kiosk?.address?.city,
          state: kiosk?.address?.state,
          logo: kiosk?.logo,
        };
      });
    }
    
    const response = await api.get<KioskRanking[]>(`/ratings/top-kiosks?limit=${limit}`);
    return response.data;
  },

  /**
   * Obtém estatísticas de avaliações de um quiosque
   */
  getKioskStats: async (kioskId: string): Promise<{
    averageRating: number;
    totalRatings: number;
    ratingsByType: Record<RatingType, { average: number; count: number }>;
    distribution: Record<number, number>;
    recentRatings: Rating[];
  }> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      
      const ratings = mockDataService.getRatingsByKiosk(kioskId);
      
      const totalRatings = ratings.length;
      const averageRating = totalRatings > 0
        ? ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings
        : 0;
      
      const ratingsByType = (['product', 'employee', 'kiosk', 'service'] as RatingType[]).reduce((acc, type) => {
        const typeRatings = ratings.filter((r) => r.type === type);
        acc[type] = {
          average: typeRatings.length > 0
            ? typeRatings.reduce((sum, r) => sum + r.rating, 0) / typeRatings.length
            : 0,
          count: typeRatings.length,
        };
        return acc;
      }, {} as Record<RatingType, { average: number; count: number }>);
      
      const distribution = [1, 2, 3, 4, 5].reduce((acc, star) => {
        acc[star] = ratings.filter((r) => r.rating === star).length;
        return acc;
      }, {} as Record<number, number>);
      
      const recentRatings = ratings
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5)
        .map(toRating);
      
      return {
        averageRating: Math.round(averageRating * 10) / 10,
        totalRatings,
        ratingsByType,
        distribution,
        recentRatings,
      };
    }
    
    const response = await api.get<{
      averageRating: number;
      totalRatings: number;
      ratingsByType: Record<RatingType, { average: number; count: number }>;
      distribution: Record<number, number>;
      recentRatings: Rating[];
    }>(`/kiosks/${kioskId}/ratings/stats`);
    return response.data;
  },

  /**
   * Verifica se cliente pode avaliar um pedido
   */
  canRateOrder: async (orderId: string): Promise<boolean> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      
      const order = mockDataService.getOrderById(orderId);
      if (!order) return false;
      
      // Só pode avaliar pedidos entregues
      if (order.status !== 'delivered') return false;
      
      // Verifica se já avaliou
      const existingRatings = mockDataService.getRatingsByOrder(orderId);
      return existingRatings.length === 0;
    }
    
    const response = await api.get<{ canRate: boolean }>(`/orders/${orderId}/can-rate`);
    return response.data.canRate;
  },

  /**
   * Obtém label do tipo de avaliação
   */
  getTypeLabel: (type: RatingType): string => {
    return RATING_TYPE_LABELS[type] || type;
  },
};

export default ratingService;

