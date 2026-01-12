/**
 * Serviço de quiosques
 * Gerencia CRUD e operações de quiosques
 */

import { api } from './api';
import { Kiosk } from '@/types';
import { mockDataService, simulateDelay, MockKiosk, MockLicense } from './mock.service';

/**
 * Converte MockKiosk para Kiosk
 */
const toKiosk = (mock: MockKiosk): Kiosk => ({
  id: mock.id,
  name: mock.name,
  slug: mock.slug,
  description: mock.description,
  logo: mock.logo,
  coverImage: mock.coverImage,
  address: mock.address,
  contact: mock.contact,
  operatingHours: mock.operatingHours.map((h) => ({
    ...h,
    dayOfWeek: h.dayOfWeek as Kiosk['operatingHours'][0]['dayOfWeek'],
  })),
  isActive: mock.isActive,
  isPublic: mock.isPublic,
  licenseExpiry: new Date(mock.licenseExpiry),
  createdAt: new Date(mock.createdAt),
  updatedAt: new Date(mock.updatedAt),
  ownerId: mock.ownerId,
  settings: mock.settings,
});

export interface KioskWithLicense extends Kiosk {
  license?: MockLicense;
}

export const kioskService = {
  /**
   * Lista todos os quiosques
   */
  getAll: async (): Promise<Kiosk[]> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      return mockDataService.getKiosks().map(toKiosk);
    }
    
    const response = await api.get<Kiosk[]>('/kiosks');
    return response.data;
  },

  /**
   * Lista quiosques com informações de licença
   */
  getAllWithLicenses: async (): Promise<KioskWithLicense[]> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      return mockDataService.getKiosks().map((k) => ({
        ...toKiosk(k),
        license: mockDataService.getLicenseByKiosk(k.id),
      }));
    }
    
    const response = await api.get<KioskWithLicense[]>('/kiosks?include=license');
    return response.data;
  },

  /**
   * Obtém quiosque por ID
   */
  getById: async (id: string): Promise<Kiosk> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      const kiosk = mockDataService.getKioskById(id);
      if (!kiosk) throw new Error('Quiosque não encontrado');
      return toKiosk(kiosk);
    }
    
    const response = await api.get<Kiosk>(`/kiosks/${id}`);
    return response.data;
  },

  /**
   * Obtém quiosque por slug
   */
  getBySlug: async (slug: string): Promise<Kiosk> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      const kiosk = mockDataService.getKioskBySlug(slug);
      if (!kiosk) throw new Error('Quiosque não encontrado');
      return toKiosk(kiosk);
    }
    
    const response = await api.get<Kiosk>(`/kiosks/slug/${slug}`);
    return response.data;
  },

  /**
   * Cria novo quiosque
   */
  create: async (data: Partial<Kiosk>): Promise<Kiosk> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      
      const slug = data.name
        ?.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') || '';
      
      const existing = mockDataService.getKioskBySlug(slug);
      if (existing) throw new Error('Já existe um quiosque com esse nome');
      
      const newKiosk: MockKiosk = {
        id: `kiosk_${String(mockDataService.getKiosks().length + 1).padStart(3, '0')}`,
        name: data.name || '',
        slug,
        description: data.description || '',
        logo: data.logo,
        coverImage: data.coverImage,
        address: data.address || {
          street: '',
          number: '',
          neighborhood: '',
          city: '',
          state: '',
          zipCode: '',
          country: 'Brasil',
        },
        contact: data.contact || {
          phone: '',
          email: '',
        },
        operatingHours: data.operatingHours?.map((h) => ({
          ...h,
          dayOfWeek: h.dayOfWeek as string,
        })) || [],
        isActive: data.isActive ?? true,
        isPublic: data.isPublic ?? false,
        licenseExpiry: data.licenseExpiry?.toISOString() || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ownerId: data.ownerId || '',
        settings: data.settings || {
          allowOnlineOrders: true,
          allowTableOrders: true,
          requirePaymentUpfront: false,
          estimatedPrepTime: 15,
          maxOrdersPerHour: 50,
          notificationEmail: '',
          theme: {
            primaryColor: '#0077B6',
            secondaryColor: '#00B4D8',
          },
        },
      };
      
      mockDataService.addKiosk(newKiosk);
      return toKiosk(newKiosk);
    }
    
    const response = await api.post<Kiosk>('/kiosks', data);
    return response.data;
  },

  /**
   * Atualiza quiosque
   */
  update: async (id: string, data: Partial<Kiosk>): Promise<Kiosk> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      
      const updateData: Partial<MockKiosk> = {
        ...data,
        operatingHours: data.operatingHours?.map((h) => ({
          ...h,
          dayOfWeek: h.dayOfWeek as string,
        })),
        licenseExpiry: data.licenseExpiry?.toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      const updated = mockDataService.updateKiosk(id, updateData);
      if (!updated) throw new Error('Quiosque não encontrado');
      return toKiosk(updated);
    }
    
    const response = await api.put<Kiosk>(`/kiosks/${id}`, data);
    return response.data;
  },

  /**
   * Ativa/Desativa quiosque
   */
  toggleActive: async (id: string): Promise<Kiosk> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      
      const kiosk = mockDataService.getKioskById(id);
      if (!kiosk) throw new Error('Quiosque não encontrado');
      
      const updated = mockDataService.updateKiosk(id, {
        isActive: !kiosk.isActive,
        updatedAt: new Date().toISOString(),
      });
      
      if (!updated) throw new Error('Erro ao atualizar quiosque');
      return toKiosk(updated);
    }
    
    const response = await api.patch<Kiosk>(`/kiosks/${id}/toggle-active`);
    return response.data;
  },

  /**
   * Obtém estatísticas do quiosque
   */
  getStats: async (kioskId: string): Promise<{
    totalOrders: number;
    totalRevenue: number;
    averageTicket: number;
    totalProducts: number;
    lowStockCount: number;
    pendingOrders: number;
  }> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      
      const stats = mockDataService.getStats(kioskId);
      return {
        totalOrders: stats.totalOrders,
        totalRevenue: stats.totalRevenue,
        averageTicket: stats.averageTicket,
        totalProducts: stats.totalProducts,
        lowStockCount: stats.lowStockCount,
        pendingOrders: stats.ordersByStatus['pending'] || 0,
      };
    }
    
    const response = await api.get<{
      totalOrders: number;
      totalRevenue: number;
      averageTicket: number;
      totalProducts: number;
      lowStockCount: number;
      pendingOrders: number;
    }>(`/kiosks/${id}/stats`);
    return response.data;
  },

  /**
   * Lista quiosques públicos (para cardápio)
   */
  getPublicKiosks: async (): Promise<Kiosk[]> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      return mockDataService
        .getKiosks()
        .filter((k) => k.isPublic && k.isActive)
        .map(toKiosk);
    }
    
    const response = await api.get<Kiosk[]>('/kiosks/public');
    return response.data;
  },
};

export default kioskService;

