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
import plansData from '@/mock/plans.json';
import employeesData from '@/mock/employees.json';
import ratingsData from '@/mock/ratings.json';

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
  planId: string;
  plan: string;
  status: string;
  startDate: string;
  expiryDate: string;
  billingCycle: string;
  price: number;
  totalPaid: number;
  autoRenew: boolean;
  features: {
    stockManagement: boolean;
    recipeManagement: boolean;
    analytics: boolean;
    advancedAnalytics: boolean;
    employeeManagement: boolean;
    publicRanking: boolean;
    prioritySupport: boolean;
    customDomain: boolean;
    apiAccess: boolean;
  };
  limits: {
    products: number;
    ordersPerMonth: number;
    employees: number;
  };
  paymentHistory: Array<{
    id: string;
    date: string;
    amount: number;
    status: string;
    method: string;
    invoice?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface MockPlan {
  id: string;
  name: string;
  slug: string;
  description: string;
  badge: string | null;
  pricing: {
    monthly: number;
    semiannual: number;
    annual: number;
    monthlyDiscount: {
      semiannual: number;
      annual: number;
    };
  };
  limits: {
    products: number;
    ordersPerMonth: number;
    employees: number;
    categories: number;
    imagesPerProduct: number;
  };
  features: {
    stockManagement: boolean;
    recipeManagement: boolean;
    analytics: boolean;
    advancedAnalytics: boolean;
    employeeManagement: boolean;
    publicRanking: boolean;
    prioritySupport: boolean;
    customDomain: boolean;
    apiAccess: boolean;
    whatsappIntegration: boolean;
    multipleMenus: boolean;
    promotions: boolean;
    loyaltyProgram: boolean;
    tableManagement: boolean;
    kitchenDisplay: boolean;
    exportReports: boolean;
  };
  order: number;
  isActive: boolean;
  isPopular: boolean;
}

export interface MockEmployee {
  id: string;
  kioskId: string;
  name: string;
  role: string;
  photo: string;
  phone: string;
  email: string;
  document: string;
  hireDate: string;
  salary: number;
  workSchedule: string;
  isActive: boolean;
  rating: number;
  totalRatings: number;
  createdAt: string;
  updatedAt: string;
}

export interface MockRating {
  id: string;
  type: 'product' | 'employee' | 'kiosk' | 'service';
  targetId: string;
  targetName: string;
  kioskId: string;
  kioskName: string;
  orderId: string;
  customerId: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
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
let plans: MockPlan[] = [...(plansData as MockPlan[])];
let employees: MockEmployee[] = [...(employeesData as MockEmployee[])];
let ratings: MockRating[] = [...(ratingsData as MockRating[])];

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
  updateLicense: (id: string, data: Partial<MockLicense>) => {
    const index = licenses.findIndex((l) => l.id === id);
    if (index !== -1) {
      licenses[index] = { ...licenses[index], ...data };
      return licenses[index];
    }
    return null;
  },

  // Plans
  getPlans: () => plans.filter((p) => p.isActive),
  getPlanById: (id: string) => plans.find((p) => p.id === id),
  getPlanBySlug: (slug: string) => plans.find((p) => p.slug === slug),

  // Employees
  getEmployees: () => employees,
  getEmployeesByKiosk: (kioskId: string) => 
    employees.filter((e) => e.kioskId === kioskId),
  getEmployeeById: (id: string) => employees.find((e) => e.id === id),
  addEmployee: (employee: MockEmployee) => {
    employees.push(employee);
    return employee;
  },
  updateEmployee: (id: string, data: Partial<MockEmployee>) => {
    const index = employees.findIndex((e) => e.id === id);
    if (index !== -1) {
      employees[index] = { ...employees[index], ...data };
      return employees[index];
    }
    return null;
  },
  deleteEmployee: (id: string) => {
    const index = employees.findIndex((e) => e.id === id);
    if (index !== -1) {
      employees.splice(index, 1);
      return true;
    }
    return false;
  },
  getTopEmployees: (limit: number = 10) => {
    return [...employees]
      .filter((e) => e.isActive && e.totalRatings >= 10)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  },

  // Ratings
  getRatings: () => ratings,
  getRatingsByKiosk: (kioskId: string) => 
    ratings.filter((r) => r.kioskId === kioskId),
  getRatingsByTarget: (type: string, targetId: string) => 
    ratings.filter((r) => r.type === type && r.targetId === targetId),
  getRatingsByOrder: (orderId: string) => 
    ratings.filter((r) => r.orderId === orderId),
  addRating: (rating: MockRating) => {
    ratings.push(rating);
    return rating;
  },
  getAverageRating: (type: string, targetId: string) => {
    const targetRatings = ratings.filter((r) => r.type === type && r.targetId === targetId);
    if (targetRatings.length === 0) return 0;
    return targetRatings.reduce((sum, r) => sum + r.rating, 0) / targetRatings.length;
  },
  getTopRatedProducts: (limit: number = 10) => {
    const productRatings = ratings.filter((r) => r.type === 'product');
    const grouped: Record<string, { id: string; name: string; kioskId: string; kioskName: string; sum: number; count: number }> = {};
    
    productRatings.forEach((r) => {
      if (!grouped[r.targetId]) {
        grouped[r.targetId] = { id: r.targetId, name: r.targetName, kioskId: r.kioskId, kioskName: r.kioskName, sum: 0, count: 0 };
      }
      grouped[r.targetId].sum += r.rating;
      grouped[r.targetId].count += 1;
    });

    return Object.values(grouped)
      .filter((g) => g.count >= 3)
      .map((g) => ({ ...g, average: g.sum / g.count }))
      .sort((a, b) => b.average - a.average)
      .slice(0, limit);
  },
  getTopRatedKiosks: (limit: number = 10) => {
    const kioskRatings = ratings.filter((r) => r.type === 'kiosk');
    const grouped: Record<string, { id: string; name: string; sum: number; count: number }> = {};
    
    kioskRatings.forEach((r) => {
      if (!grouped[r.targetId]) {
        grouped[r.targetId] = { id: r.targetId, name: r.targetName, sum: 0, count: 0 };
      }
      grouped[r.targetId].sum += r.rating;
      grouped[r.targetId].count += 1;
    });

    return Object.values(grouped)
      .filter((g) => g.count >= 2)
      .map((g) => ({ ...g, average: g.sum / g.count }))
      .sort((a, b) => b.average - a.average)
      .slice(0, limit);
  },

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

