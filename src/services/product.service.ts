/**
 * Serviço de produtos e cardápios
 * Gerencia CRUD de produtos, categorias e menus
 */

import { api } from './api';
import {
  Product,
  Category,
  Menu,
  Kiosk,
  PaginatedResponse,
  PaginationParams,
} from '@/types';

/**
 * Mock de dados para desenvolvimento
 */
const mockCategories: Category[] = [
  {
    id: '1',
    kioskId: '1',
    name: 'Lanches',
    description: 'Hambúrgueres, hot dogs e mais',
    order: 1,
    isActive: true,
  },
  {
    id: '2',
    kioskId: '1',
    name: 'Bebidas',
    description: 'Refrigerantes, sucos e água',
    order: 2,
    isActive: true,
  },
  {
    id: '3',
    kioskId: '1',
    name: 'Porções',
    description: 'Petiscos e acompanhamentos',
    order: 3,
    isActive: true,
  },
  {
    id: '4',
    kioskId: '1',
    name: 'Sobremesas',
    description: 'Doces e sorvetes',
    order: 4,
    isActive: true,
  },
];

const mockProducts: Product[] = [
  {
    id: '1',
    kioskId: '1',
    categoryId: '1',
    name: 'X-Burger Clássico',
    description: 'Pão brioche, hambúrguer 180g, queijo cheddar, alface, tomate e molho especial',
    price: 28.90,
    images: ['/images/products/x-burger.jpg'],
    isAvailable: true,
    isHighlighted: true,
    preparationTime: 15,
    allergens: ['gluten', 'lactose'],
    tags: ['mais vendido', 'carne'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    kioskId: '1',
    categoryId: '1',
    name: 'X-Bacon Supreme',
    description: 'Pão brioche, hambúrguer 180g, bacon crocante, queijo, cebola caramelizada',
    price: 34.90,
    images: ['/images/products/x-bacon.jpg'],
    isAvailable: true,
    isHighlighted: false,
    preparationTime: 18,
    allergens: ['gluten', 'lactose'],
    tags: ['bacon', 'carne'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    kioskId: '1',
    categoryId: '2',
    name: 'Refrigerante Lata',
    description: 'Coca-Cola, Guaraná ou Sprite 350ml',
    price: 6.90,
    images: ['/images/products/refri.jpg'],
    isAvailable: true,
    isHighlighted: false,
    preparationTime: 1,
    allergens: [],
    tags: ['bebida', 'gelado'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    kioskId: '1',
    categoryId: '3',
    name: 'Batata Frita',
    description: 'Porção de batata frita crocante com sal e temperos',
    price: 18.90,
    images: ['/images/products/batata.jpg'],
    isAvailable: true,
    isHighlighted: true,
    preparationTime: 10,
    allergens: ['gluten'],
    tags: ['porção', 'frito'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    kioskId: '1',
    categoryId: '4',
    name: 'Brownie com Sorvete',
    description: 'Brownie de chocolate com sorvete de creme e calda',
    price: 22.90,
    images: ['/images/products/brownie.jpg'],
    isAvailable: true,
    isHighlighted: false,
    preparationTime: 5,
    allergens: ['gluten', 'lactose', 'eggs'],
    tags: ['doce', 'chocolate'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const mockKiosks: Kiosk[] = [
  {
    id: '1',
    name: 'Quiosque Praia Central',
    slug: 'praia-central',
    description: 'O melhor quiosque da praia com lanches artesanais',
    address: {
      street: 'Av. Beira Mar',
      number: '100',
      neighborhood: 'Centro',
      city: 'Balneário Camboriú',
      state: 'SC',
      zipCode: '88330-000',
      country: 'Brasil',
    },
    contact: {
      phone: '(47) 99999-9999',
      whatsapp: '(47) 99999-9999',
      email: 'contato@praiacentral.com',
      instagram: '@praiacentral',
    },
    operatingHours: [
      { dayOfWeek: 'monday', isOpen: true, openTime: '10:00', closeTime: '22:00' },
      { dayOfWeek: 'tuesday', isOpen: true, openTime: '10:00', closeTime: '22:00' },
      { dayOfWeek: 'wednesday', isOpen: true, openTime: '10:00', closeTime: '22:00' },
      { dayOfWeek: 'thursday', isOpen: true, openTime: '10:00', closeTime: '22:00' },
      { dayOfWeek: 'friday', isOpen: true, openTime: '10:00', closeTime: '23:00' },
      { dayOfWeek: 'saturday', isOpen: true, openTime: '10:00', closeTime: '23:00' },
      { dayOfWeek: 'sunday', isOpen: true, openTime: '12:00', closeTime: '20:00' },
    ],
    isActive: true,
    isPublic: true,
    licenseExpiry: new Date('2025-12-31'),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ownerId: '2',
    settings: {
      allowOnlineOrders: true,
      allowTableOrders: true,
      requirePaymentUpfront: false,
      estimatedPrepTime: 15,
      maxOrdersPerHour: 50,
      notificationEmail: 'pedidos@praiacentral.com',
      theme: {
        primaryColor: '#FF6B35',
        secondaryColor: '#2ECC71',
      },
    },
  },
];

const simulateDelay = (ms: number = 300): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const productService = {
  /**
   * Lista todas as categorias de um quiosque
   */
  getCategories: async (kioskId: string): Promise<Category[]> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      return mockCategories.filter((c) => c.kioskId === kioskId);
    }
    
    const response = await api.get<Category[]>(`/kiosks/${kioskId}/categories`);
    return response;
  },

  /**
   * Cria uma nova categoria
   */
  createCategory: async (kioskId: string, data: Partial<Category>): Promise<Category> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      const newCategory: Category = {
        id: String(mockCategories.length + 1),
        kioskId,
        name: data.name || '',
        description: data.description,
        image: data.image,
        order: data.order || mockCategories.length + 1,
        isActive: data.isActive ?? true,
      };
      mockCategories.push(newCategory);
      return newCategory;
    }
    
    const response = await api.post<Category>(`/kiosks/${kioskId}/categories`, data);
    return response;
  },

  /**
   * Atualiza uma categoria
   */
  updateCategory: async (categoryId: string, data: Partial<Category>): Promise<Category> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      const index = mockCategories.findIndex((c) => c.id === categoryId);
      if (index !== -1) {
        mockCategories[index] = { ...mockCategories[index], ...data };
        return mockCategories[index];
      }
      throw new Error('Categoria não encontrada');
    }
    
    const response = await api.put<Category>(`/categories/${categoryId}`, data);
    return response;
  },

  /**
   * Remove uma categoria
   */
  deleteCategory: async (categoryId: string): Promise<void> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      const index = mockCategories.findIndex((c) => c.id === categoryId);
      if (index !== -1) {
        mockCategories.splice(index, 1);
      }
      return;
    }
    
    await api.delete(`/categories/${categoryId}`);
  },

  /**
   * Lista produtos de um quiosque com paginação
   */
  getProducts: async (
    kioskId: string,
    params?: PaginationParams & { categoryId?: string; search?: string }
  ): Promise<PaginatedResponse<Product>> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      let filtered = mockProducts.filter((p) => p.kioskId === kioskId);
      
      if (params?.categoryId) {
        filtered = filtered.filter((p) => p.categoryId === params.categoryId);
      }
      
      if (params?.search) {
        const searchLower = params.search.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.name.toLowerCase().includes(searchLower) ||
            p.description.toLowerCase().includes(searchLower)
        );
      }
      
      const page = params?.page || 1;
      const pageSize = params?.pageSize || 10;
      const start = (page - 1) * pageSize;
      const items = filtered.slice(start, start + pageSize);
      
      return {
        items,
        total: filtered.length,
        page,
        pageSize,
        totalPages: Math.ceil(filtered.length / pageSize),
        hasNext: start + pageSize < filtered.length,
        hasPrevious: page > 1,
      };
    }
    
    const response = await api.get<PaginatedResponse<Product>>(`/kiosks/${kioskId}/products`, params);
    return response;
  },

  /**
   * Obtém um produto por ID
   */
  getProduct: async (productId: string): Promise<Product> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      const product = mockProducts.find((p) => p.id === productId);
      if (!product) throw new Error('Produto não encontrado');
      return product;
    }
    
    const response = await api.get<Product>(`/products/${productId}`);
    return response;
  },

  /**
   * Cria um novo produto
   */
  createProduct: async (kioskId: string, data: Partial<Product>): Promise<Product> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      const newProduct: Product = {
        id: String(mockProducts.length + 1),
        kioskId,
        categoryId: data.categoryId || '',
        name: data.name || '',
        description: data.description || '',
        price: data.price || 0,
        images: data.images || [],
        isAvailable: data.isAvailable ?? true,
        isHighlighted: data.isHighlighted ?? false,
        preparationTime: data.preparationTime || 10,
        allergens: data.allergens || [],
        tags: data.tags || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockProducts.push(newProduct);
      return newProduct;
    }
    
    const response = await api.post<Product>(`/kiosks/${kioskId}/products`, data);
    return response;
  },

  /**
   * Atualiza um produto
   */
  updateProduct: async (productId: string, data: Partial<Product>): Promise<Product> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      const index = mockProducts.findIndex((p) => p.id === productId);
      if (index !== -1) {
        mockProducts[index] = { ...mockProducts[index], ...data, updatedAt: new Date().toISOString() };
        return mockProducts[index];
      }
      throw new Error('Produto não encontrado');
    }
    
    const response = await api.put<Product>(`/products/${productId}`, data);
    return response;
  },

  /**
   * Remove um produto
   */
  deleteProduct: async (productId: string): Promise<void> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      const index = mockProducts.findIndex((p) => p.id === productId);
      if (index !== -1) {
        mockProducts.splice(index, 1);
      }
      return;
    }
    
    await api.delete(`/products/${productId}`);
  },

  /**
   * Lista quiosques (para Super Admin)
   */
  getKiosks: async (): Promise<Kiosk[]> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      return mockKiosks;
    }
    
    const response = await api.get<Kiosk[]>('/kiosks');
    return response;
  },

  /**
   * Obtém um quiosque por ID ou slug
   */
  getKiosk: async (idOrSlug: string): Promise<Kiosk> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      const kiosk = mockKiosks.find((k) => k.id === idOrSlug || k.slug === idOrSlug);
      if (!kiosk) throw new Error('Quiosque não encontrado');
      return kiosk;
    }
    
    const response = await api.get<Kiosk>(`/kiosks/${idOrSlug}`);
    return response;
  },

  /**
   * Cria um novo quiosque
   */
  createKiosk: async (data: Partial<Kiosk>): Promise<Kiosk> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      const newKiosk: Kiosk = {
        ...mockKiosks[0],
        id: String(mockKiosks.length + 1),
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Kiosk;
      mockKiosks.push(newKiosk);
      return newKiosk;
    }
    
    const response = await api.post<Kiosk>('/kiosks', data);
    return response;
  },

  /**
   * Atualiza um quiosque
   */
  updateKiosk: async (kioskId: string, data: Partial<Kiosk>): Promise<Kiosk> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      const index = mockKiosks.findIndex((k) => k.id === kioskId);
      if (index !== -1) {
        mockKiosks[index] = { ...mockKiosks[index], ...data, updatedAt: new Date().toISOString() };
        return mockKiosks[index];
      }
      throw new Error('Quiosque não encontrado');
    }
    
    const response = await api.put<Kiosk>(`/kiosks/${kioskId}`, data);
    return response;
  },

  /**
   * Obtém menu ativo de um quiosque
   */
  getActiveMenu: async (kioskId: string): Promise<Menu | null> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      // Retorna mock de menu
      return {
        id: '1',
        kioskId,
        name: 'Menu Principal',
        isActive: true,
        categories: mockCategories.map((c, index) => ({
          categoryId: c.id,
          order: index + 1,
          products: mockProducts
            .filter((p) => p.categoryId === c.id)
            .map((p, pIndex) => ({
              productId: p.id,
              order: pIndex + 1,
              isAvailable: p.isAvailable,
            })),
        })),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
    
    const response = await api.get<Menu>(`/kiosks/${kioskId}/menu/active`);
    return response;
  },
};

export default productService;

