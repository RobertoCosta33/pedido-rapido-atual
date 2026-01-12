/**
 * Serviço de pedidos
 * Gerencia CRUD e operações de pedidos
 */

import { api } from './api';
import { Order, OrderStatus, CreateOrderRequest, OrderSummary } from '@/types';
import { mockDataService, simulateDelay, MockOrder } from './mock.service';

/**
 * Converte MockOrder para Order
 */
const toOrder = (mock: MockOrder): Order => ({
  id: mock.id,
  kioskId: mock.kioskId,
  customerId: mock.customerId || undefined,
  customerName: mock.customerName,
  customerPhone: mock.customerPhone,
  tableNumber: mock.tableNumber || undefined,
  status: mock.status as OrderStatus,
  items: mock.items.map((item) => ({
    ...item,
    addons: [],
    notes: item.notes || undefined,
  })),
  subtotal: mock.subtotal,
  discount: mock.discount,
  tax: mock.tax,
  total: mock.total,
  paymentMethod: mock.paymentMethod as Order['paymentMethod'],
  paymentStatus: mock.paymentStatus as Order['paymentStatus'],
  notes: mock.notes || undefined,
  estimatedTime: mock.estimatedTime,
  createdAt: new Date(mock.createdAt),
  updatedAt: new Date(mock.updatedAt),
  completedAt: mock.completedAt ? new Date(mock.completedAt) : undefined,
});

export const orderService = {
  /**
   * Lista pedidos de um quiosque
   */
  getByKiosk: async (
    kioskId: string,
    params?: {
      status?: OrderStatus;
      startDate?: Date;
      endDate?: Date;
      limit?: number;
    }
  ): Promise<Order[]> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      
      let orders = mockDataService.getOrdersByKiosk(kioskId);
      
      if (params?.status) {
        orders = orders.filter((o) => o.status === params.status);
      }
      
      if (params?.startDate) {
        orders = orders.filter((o) => new Date(o.createdAt) >= params.startDate!);
      }
      
      if (params?.endDate) {
        orders = orders.filter((o) => new Date(o.createdAt) <= params.endDate!);
      }
      
      // Ordena por data de criação (mais recentes primeiro)
      orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      if (params?.limit) {
        orders = orders.slice(0, params.limit);
      }
      
      return orders.map(toOrder);
    }
    
    const response = await api.get<Order[]>(`/kiosks/${kioskId}/orders`, { params });
    return response.data;
  },

  /**
   * Obtém pedido por ID
   */
  getById: async (id: string): Promise<Order> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      const order = mockDataService.getOrderById(id);
      if (!order) throw new Error('Pedido não encontrado');
      return toOrder(order);
    }
    
    const response = await api.get<Order>(`/orders/${id}`);
    return response.data;
  },

  /**
   * Lista pedidos de um cliente
   */
  getByCustomer: async (customerId: string): Promise<Order[]> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      return mockDataService.getOrdersByCustomer(customerId).map(toOrder);
    }
    
    const response = await api.get<Order[]>(`/customers/${customerId}/orders`);
    return response.data;
  },

  /**
   * Lista pedidos pendentes (para cozinha)
   */
  getPending: async (kioskId: string): Promise<Order[]> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      
      const pendingStatuses = ['pending', 'confirmed', 'preparing'];
      const orders = mockDataService
        .getOrdersByKiosk(kioskId)
        .filter((o) => pendingStatuses.includes(o.status))
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      
      return orders.map(toOrder);
    }
    
    const response = await api.get<Order[]>(`/kiosks/${kioskId}/orders/pending`);
    return response.data;
  },

  /**
   * Cria novo pedido
   */
  create: async (data: CreateOrderRequest): Promise<Order> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      
      // Busca produtos para calcular preços
      const items = data.items.map((item, index) => {
        const product = mockDataService.getProductById(item.productId);
        const price = product?.price || 0;
        return {
          id: `item_${Date.now()}_${index}`,
          productId: item.productId,
          productName: product?.name || 'Produto',
          quantity: item.quantity,
          unitPrice: price,
          totalPrice: price * item.quantity,
          addons: [],
          notes: item.notes || null,
        };
      });
      
      const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
      
      const newOrder: MockOrder = {
        id: `ord_${String(mockDataService.getOrders().length + 1).padStart(3, '0')}`,
        kioskId: data.kioskId,
        customerId: null,
        customerName: data.customerName,
        customerPhone: data.customerPhone || '',
        tableNumber: data.tableNumber || null,
        status: 'pending',
        items,
        subtotal,
        discount: 0,
        tax: 0,
        total: subtotal,
        paymentMethod: null,
        paymentStatus: 'pending',
        notes: data.notes || null,
        estimatedTime: 15,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        completedAt: null,
      };
      
      // Debita estoque (se houver receitas associadas)
      for (const item of data.items) {
        const product = mockDataService.getProductById(item.productId);
        if (product?.recipeId) {
          const recipe = mockDataService.getRecipeById(product.recipeId);
          if (recipe) {
            for (const ing of recipe.ingredients) {
              const quantityNeeded = ing.quantity * item.quantity;
              mockDataService.deductStock(ing.ingredientId, quantityNeeded);
            }
          }
        }
      }
      
      mockDataService.addOrder(newOrder);
      return toOrder(newOrder);
    }
    
    const response = await api.post<Order>('/orders', data);
    return response.data;
  },

  /**
   * Atualiza status do pedido
   */
  updateStatus: async (id: string, status: OrderStatus, notes?: string): Promise<Order> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      
      const updateData: Partial<MockOrder> = {
        status,
        notes: notes || undefined,
        updatedAt: new Date().toISOString(),
      };
      
      if (status === 'delivered') {
        updateData.completedAt = new Date().toISOString();
        updateData.paymentStatus = 'paid';
      }
      
      if (status === 'cancelled') {
        updateData.paymentStatus = 'refunded';
      }
      
      const updated = mockDataService.updateOrder(id, updateData);
      if (!updated) throw new Error('Pedido não encontrado');
      return toOrder(updated);
    }
    
    const response = await api.patch<Order>(`/orders/${id}/status`, { status, notes });
    return response.data;
  },

  /**
   * Confirma pedido
   */
  confirm: async (id: string): Promise<Order> => {
    return orderService.updateStatus(id, 'confirmed');
  },

  /**
   * Marca pedido como preparando
   */
  startPreparing: async (id: string): Promise<Order> => {
    return orderService.updateStatus(id, 'preparing');
  },

  /**
   * Marca pedido como pronto
   */
  markReady: async (id: string): Promise<Order> => {
    return orderService.updateStatus(id, 'ready');
  },

  /**
   * Marca pedido como entregue
   */
  deliver: async (id: string): Promise<Order> => {
    return orderService.updateStatus(id, 'delivered');
  },

  /**
   * Cancela pedido
   */
  cancel: async (id: string, reason?: string): Promise<Order> => {
    return orderService.updateStatus(id, 'cancelled', reason);
  },

  /**
   * Obtém resumo de pedidos
   */
  getSummary: async (
    kioskId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<OrderSummary> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      
      let orders = mockDataService.getOrdersByKiosk(kioskId);
      
      if (startDate) {
        orders = orders.filter((o) => new Date(o.createdAt) >= startDate);
      }
      
      if (endDate) {
        orders = orders.filter((o) => new Date(o.createdAt) <= endDate);
      }
      
      const deliveredOrders = orders.filter((o) => o.status === 'delivered');
      const totalRevenue = deliveredOrders.reduce((sum, o) => sum + o.total, 0);
      
      // Conta pedidos por status
      const ordersByStatus = orders.reduce((acc, o) => {
        acc[o.status as OrderStatus] = (acc[o.status as OrderStatus] || 0) + 1;
        return acc;
      }, {} as Record<OrderStatus, number>);
      
      // Produtos mais vendidos
      const productCounts: Record<string, { name: string; quantity: number; revenue: number }> = {};
      for (const order of deliveredOrders) {
        for (const item of order.items) {
          if (!productCounts[item.productId]) {
            productCounts[item.productId] = {
              name: item.productName,
              quantity: 0,
              revenue: 0,
            };
          }
          productCounts[item.productId].quantity += item.quantity;
          productCounts[item.productId].revenue += item.totalPrice;
        }
      }
      
      const topProducts = Object.entries(productCounts)
        .map(([productId, data]) => ({
          productId,
          productName: data.name,
          quantity: data.quantity,
          revenue: data.revenue,
        }))
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 10);
      
      return {
        totalOrders: orders.length,
        totalRevenue,
        averageTicket: deliveredOrders.length > 0 ? totalRevenue / deliveredOrders.length : 0,
        ordersByStatus,
        topProducts,
      };
    }
    
    const response = await api.get<OrderSummary>(`/kiosks/${kioskId}/orders/summary`, {
      params: { startDate: startDate?.toISOString(), endDate: endDate?.toISOString() },
    });
    return response.data;
  },

  /**
   * Obtém pedidos do dia
   */
  getToday: async (kioskId: string): Promise<Order[]> => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return orderService.getByKiosk(kioskId, {
      startDate: today,
      endDate: tomorrow,
    });
  },
};

export default orderService;

