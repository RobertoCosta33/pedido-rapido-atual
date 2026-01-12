/**
 * Tipos relacionados a pedidos
 */

export interface Order {
  id: string;
  kioskId: string;
  customerId?: string;
  customerName: string;
  customerPhone?: string;
  tableNumber?: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod?: PaymentMethod;
  paymentStatus: PaymentStatus;
  notes?: string;
  estimatedTime: number;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'delivered'
  | 'cancelled';

export type PaymentMethod = 
  | 'cash'
  | 'credit_card'
  | 'debit_card'
  | 'pix'
  | 'voucher';

export type PaymentStatus = 
  | 'pending'
  | 'paid'
  | 'failed'
  | 'refunded';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  addons: OrderItemAddon[];
  notes?: string;
}

export interface OrderItemAddon {
  addonId: string;
  addonName: string;
  optionId: string;
  optionName: string;
  price: number;
  quantity: number;
}

export interface OrderSummary {
  totalOrders: number;
  totalRevenue: number;
  averageTicket: number;
  ordersByStatus: Record<OrderStatus, number>;
  topProducts: {
    productId: string;
    productName: string;
    quantity: number;
    revenue: number;
  }[];
}

export interface CreateOrderRequest {
  kioskId: string;
  customerName: string;
  customerPhone?: string;
  tableNumber?: string;
  items: {
    productId: string;
    quantity: number;
    addons?: {
      addonId: string;
      optionId: string;
      quantity: number;
    }[];
    notes?: string;
  }[];
  notes?: string;
}

export interface UpdateOrderStatusRequest {
  orderId: string;
  status: OrderStatus;
  notes?: string;
}

