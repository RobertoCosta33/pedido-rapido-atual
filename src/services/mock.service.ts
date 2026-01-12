/**
 * Serviço de acesso aos dados mock
 * Carrega e gerencia os dados dos arquivos JSON
 */

import usersData from '@/mock/users.json';
import kiosksData from '@/mock/kiosks.json';
import categoriesData from '@/mock/categories.json';
import licensesData from '@/mock/licenses.json';
import productsData from '@/mock/products.json';
import stockData from '@/mock/stock.json';
import recipesData from '@/mock/recipes.json';
import ordersData from '@/mock/orders.json';

// Tipos para os dados mock
export interface MockUser {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'super_admin' | 'admin' | 'customer';
  kioskId?: string;
  avatar?: string;
  phone?: string;
  permissions?: string[];
  favoriteKiosks?: string[];
  orderHistory?: string[];
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface MockKiosk {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo?: string;
  coverImage?: string;
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  contact: {
    phone: string;
    whatsapp?: string;
    email: string;
    instagram?: string;
    facebook?: string;
  };
  operatingHours: Array<{
    dayOfWeek: string;
    isOpen: boolean;
    openTime: string;
    closeTime: string;
  }>;
  isActive: boolean;
  isPublic: boolean;
  licenseExpiry: string;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  settings: {
    allowOnlineOrders: boolean;
    allowTableOrders: boolean;
    requirePaymentUpfront: boolean;
    estimatedPrepTime: number;
    maxOrdersPerHour: number;
    notificationEmail: string;
    theme: {
      primaryColor: string;
      secondaryColor: string;
    };
  };
}

export interface MockCategory {
  id: string;
  kioskId: string;
  name: string;
  order: number;
  isActive: boolean;
}

export interface MockProduct {
  id: string;
  kioskId: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  promotionalPrice?: number | null;
  images: string[];
  isAvailable: boolean;
  isHighlighted: boolean;
  preparationTime: number;
  recipeId?: string | null;
  allergens: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface MockIngredient {
  id: string;
  kioskId: string;
  name: string;
  description: string;
  unit: string;
  currentStock: number;
  minimumStock: number;
  maximumStock: number;
  costPerUnit: number;
  supplier: string;
  isActive: boolean;
  lastRestockDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface MockRecipe {
  id: string;
  kioskId: string;
  productId: string;
  name: string;
  description: string;
  yield: number;
  yieldUnit: string;
  preparationTime: number;
  instructions: string[];
  ingredients: Array<{
    ingredientId: string;
    ingredientName: string;
    quantity: number;
    unit: string;
    costPerPortion: number;
  }>;
  totalCost: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MockOrder {
  id: string;
  kioskId: string;
  customerId?: string | null;
  customerName: string;
  customerPhone: string;
  tableNumber?: string | null;
  status: string;
  items: Array<{
    id: string;
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    addons: unknown[];
    notes?: string | null;
  }>;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod?: string | null;
  paymentStatus: string;
  notes?: string | null;
  estimatedTime: number;
  createdAt: string;
  updatedAt: string;
  completedAt?: string | null;
}

export interface MockLicense {
  id: string;
  kioskId: string;
  kioskName: string;
  plan: string;
  status: string;
  startDate: string;
  expiryDate: string;
  price: number;
  billingCycle: string;
  features: string[];
  maxProducts: number;
  maxOrdersPerMonth: number;
  paymentHistory: Array<{
    id: string;
    date: string;
    amount: number;
    status: string;
    method: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

// Estado mutável para simular operações CRUD
let users: MockUser[] = [...(usersData as MockUser[])];
let kiosks: MockKiosk[] = [...(kiosksData as MockKiosk[])];
let categories: MockCategory[] = [...(categoriesData as MockCategory[])];
let products: MockProduct[] = [...(productsData as MockProduct[])];
let stock: MockIngredient[] = [...(stockData as MockIngredient[])];
let recipes: MockRecipe[] = [...(recipesData as MockRecipe[])];
let orders: MockOrder[] = [...(ordersData as MockOrder[])];
let licenses: MockLicense[] = [...(licensesData as MockLicense[])];

/**
 * Simula delay de rede
 */
export const simulateDelay = (ms: number = 300): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Serviço de dados mock
 */
export const mockDataService = {
  // Users
  getUsers: () => users,
  getUserById: (id: string) => users.find((u) => u.id === id),
  getUserByEmail: (email: string) => users.find((u) => u.email === email),
  getUsersByRole: (role: string) => users.filter((u) => u.role === role),
  addUser: (user: MockUser) => {
    users.push(user);
    return user;
  },
  updateUser: (id: string, data: Partial<MockUser>) => {
    const index = users.findIndex((u) => u.id === id);
    if (index !== -1) {
      users[index] = { ...users[index], ...data };
      return users[index];
    }
    return null;
  },
  deleteUser: (id: string) => {
    const index = users.findIndex((u) => u.id === id);
    if (index !== -1) {
      users.splice(index, 1);
      return true;
    }
    return false;
  },

  // Kiosks
  getKiosks: () => kiosks,
  getKioskById: (id: string) => kiosks.find((k) => k.id === id),
  getKioskBySlug: (slug: string) => kiosks.find((k) => k.slug === slug),
  addKiosk: (kiosk: MockKiosk) => {
    kiosks.push(kiosk);
    return kiosk;
  },
  updateKiosk: (id: string, data: Partial<MockKiosk>) => {
    const index = kiosks.findIndex((k) => k.id === id);
    if (index !== -1) {
      kiosks[index] = { ...kiosks[index], ...data };
      return kiosks[index];
    }
    return null;
  },

  // Categories
  getCategories: () => categories,
  getCategoriesByKiosk: (kioskId: string) => 
    categories.filter((c) => c.kioskId === kioskId),
  getCategoryById: (id: string) => categories.find((c) => c.id === id),

  // Products
  getProducts: () => products,
  getProductsByKiosk: (kioskId: string) => 
    products.filter((p) => p.kioskId === kioskId),
  getProductById: (id: string) => products.find((p) => p.id === id),
  getProductsByCategory: (categoryId: string) => 
    products.filter((p) => p.categoryId === categoryId),
  addProduct: (product: MockProduct) => {
    products.push(product);
    return product;
  },
  updateProduct: (id: string, data: Partial<MockProduct>) => {
    const index = products.findIndex((p) => p.id === id);
    if (index !== -1) {
      products[index] = { ...products[index], ...data };
      return products[index];
    }
    return null;
  },
  deleteProduct: (id: string) => {
    const index = products.findIndex((p) => p.id === id);
    if (index !== -1) {
      products.splice(index, 1);
      return true;
    }
    return false;
  },

  // Stock/Ingredients
  getStock: () => stock,
  getStockByKiosk: (kioskId: string) => 
    stock.filter((s) => s.kioskId === kioskId),
  getIngredientById: (id: string) => stock.find((s) => s.id === id),
  getLowStockItems: (kioskId: string) => 
    stock.filter((s) => s.kioskId === kioskId && s.currentStock <= s.minimumStock),
  updateStock: (id: string, data: Partial<MockIngredient>) => {
    const index = stock.findIndex((s) => s.id === id);
    if (index !== -1) {
      stock[index] = { ...stock[index], ...data };
      return stock[index];
    }
    return null;
  },
  deductStock: (id: string, quantity: number) => {
    const ingredient = stock.find((s) => s.id === id);
    if (ingredient && ingredient.currentStock >= quantity) {
      ingredient.currentStock -= quantity;
      return ingredient;
    }
    return null;
  },

  // Recipes
  getRecipes: () => recipes,
  getRecipesByKiosk: (kioskId: string) => 
    recipes.filter((r) => r.kioskId === kioskId),
  getRecipeById: (id: string) => recipes.find((r) => r.id === id),
  getRecipeByProductId: (productId: string) => 
    recipes.find((r) => r.productId === productId),

  // Orders
  getOrders: () => orders,
  getOrdersByKiosk: (kioskId: string) => 
    orders.filter((o) => o.kioskId === kioskId),
  getOrderById: (id: string) => orders.find((o) => o.id === id),
  getOrdersByCustomer: (customerId: string) => 
    orders.filter((o) => o.customerId === customerId),
  getOrdersByStatus: (kioskId: string, status: string) => 
    orders.filter((o) => o.kioskId === kioskId && o.status === status),
  addOrder: (order: MockOrder) => {
    orders.push(order);
    return order;
  },
  updateOrder: (id: string, data: Partial<MockOrder>) => {
    const index = orders.findIndex((o) => o.id === id);
    if (index !== -1) {
      orders[index] = { ...orders[index], ...data };
      return orders[index];
    }
    return null;
  },

  // Licenses
  getLicenses: () => licenses,
  getLicenseByKiosk: (kioskId: string) => 
    licenses.find((l) => l.kioskId === kioskId),
  getLicenseById: (id: string) => licenses.find((l) => l.id === id),

  // Statistics
  getStats: (kioskId?: string) => {
    const filteredOrders = kioskId 
      ? orders.filter((o) => o.kioskId === kioskId) 
      : orders;
    
    const totalRevenue = filteredOrders
      .filter((o) => o.status === 'delivered')
      .reduce((sum, o) => sum + o.total, 0);
    
    const ordersByStatus = filteredOrders.reduce((acc, o) => {
      acc[o.status] = (acc[o.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalOrders: filteredOrders.length,
      totalRevenue,
      averageTicket: filteredOrders.length > 0 ? totalRevenue / filteredOrders.filter((o) => o.status === 'delivered').length : 0,
      ordersByStatus,
      totalProducts: kioskId ? products.filter((p) => p.kioskId === kioskId).length : products.length,
      totalKiosks: kiosks.length,
      totalUsers: users.length,
      lowStockCount: kioskId 
        ? stock.filter((s) => s.kioskId === kioskId && s.currentStock <= s.minimumStock).length
        : stock.filter((s) => s.currentStock <= s.minimumStock).length,
    };
  },
};

export default mockDataService;

