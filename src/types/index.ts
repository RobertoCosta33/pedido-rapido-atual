/**
 * Tipos TypeScript centralizados
 */

// ============================================================================
// AUTH TYPES
// ============================================================================

export type UserRole = "super_admin" | "admin" | "customer";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  planId?: string;
  subscriptionStatus?: "active" | "inactive" | "trial" | "expired";
  trialEndsAt?: string;
  kioskId?: string; // Para admins de quiosque
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

// ============================================================================
// BUSINESS TYPES
// ============================================================================

export interface Kiosk {
  id: string;
  name: string;
  description?: string;
  address:
    | string
    | {
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
  phone?: string;
  slug?: string;
  logo?: string;
  coverImage?: string;
  contact?: {
    email?: string;
    whatsapp?: string;
    instagram?: string;
  };
  isPublic?: boolean;
  settings?: {
    allowOnlineOrders?: boolean;
    requireTableNumber?: boolean;
    autoAcceptOrders?: boolean;
  };
  operatingHours?: Array<{
    dayOfWeek: string;
    openTime: string;
    closeTime: string;
    isOpen: boolean;
  }>;
  licenseExpiry?: string;
  isActive: boolean;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  categoryId?: string; // Alias para category
  imageUrl?: string;
  images?: string[]; // Array de imagens
  isAvailable: boolean;
  isHighlighted?: boolean;
  preparationTime?: number;
  allergens?: string[];
  tags?: string[];
  kioskId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Staff {
  id: string;
  name: string;
  email: string;
  role: string;
  kioskId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// RATING TYPES
// ============================================================================

export type RatingTargetType = "kiosk" | "product" | "staff";

export interface Rating {
  id: string;
  userId: string;
  targetType: RatingTargetType;
  targetId: string;
  score: number; // 1-5
  comment?: string;
  createdAt: string;
}

export interface CreateRatingDto {
  targetType: RatingTargetType;
  targetId: string;
  score: number;
  comment?: string;
}

export interface RankingItem {
  id: string;
  name: string;
  averageRating: number;
  totalRatings: number;
  description?: string;
  imageUrl?: string;
  price?: number; // Para produtos
}

// ============================================================================
// PLAN TYPES
// ============================================================================

export type PlanType = "free" | "basic" | "pro" | "premium";

export interface Plan {
  id: string;
  name: string;
  type: PlanType;
  price: number;
  currency: string;
  interval: "month" | "year";
  features: string[];
  limits: {
    kiosks: number;
    products: number;
    staff: number;
    orders: number;
  };
  isActive: boolean;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  status: "active" | "inactive" | "trial" | "expired";
  currentPeriodStart: string;
  currentPeriodEnd: string;
  trialEndsAt?: string;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// BILLING TYPES
// ============================================================================

export interface CheckoutSession {
  sessionId: string;
  url: string;
}

export interface BillingPortalSession {
  url: string;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  items?: T[]; // Alias para data
  total?: number; // Total de itens (alias para pagination.total)
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
}

// ============================================================================
// COMPONENT TYPES
// ============================================================================

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface TableColumn<T = unknown> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (value: unknown, item: T) => React.ReactNode;
}

export interface FormField {
  name: string;
  label: string;
  type: "text" | "email" | "password" | "number" | "select" | "textarea";
  required?: boolean;
  placeholder?: string;
  options?: SelectOption[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: RegExp;
    message?: string;
  };
}

// ============================================================================
// THEME TYPES
// ============================================================================

export type ThemeMode = "light" | "dark";

export interface ThemeState {
  mode: ThemeMode;
  toggleMode: () => void;
}

// ============================================================================
// NOTIFICATION TYPES
// ============================================================================

export type NotificationType = "success" | "error" | "warning" | "info";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface NotificationState {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, "id">) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}
// ============================================================================
// ORDER TYPES
// ============================================================================

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "ready"
  | "delivered"
  | "cancelled";

export interface Order {
  id: string;
  customerId: string;
  kioskId: string;
  items: OrderItem[];
  status: OrderStatus;
  total: number;
  paymentMethod?: string;
  paymentStatus?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
  unitPrice?: number; // Alias para price
  totalPrice?: number; // Alias para total
  addons?: any[];
  notes?: string;
}

export interface CreateOrderRequest {
  kioskId: string;
  customerName?: string;
  customerPhone?: string;
  tableNumber?: string | number | null;
  notes?: string;
  items: Array<{
    productId: string;
    quantity: number;
    notes?: string;
    addons?: any[];
  }>;
  paymentMethod?: string;
}

export interface OrderSummary {
  total: number;
  subtotal: number;
  tax?: number;
  discount?: number;
  totalOrders?: number; // Para estatísticas
}

// ============================================================================
// CATEGORY TYPES
// ============================================================================

export interface Category {
  id: string;
  name: string;
  description?: string;
  kioskId?: string;
  image?: string;
  order?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// STOCK TYPES
// ============================================================================

export interface Ingredient {
  id: string;
  name: string;
  description?: string;
  unit: string;
  currentStock: number;
  minimumStock: number;
  maximumStock?: number;
  costPerUnit: number;
  supplier?: string;
  kioskId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type StockMovementType =
  | "in"
  | "out"
  | "adjustment"
  | "waste"
  | "order_deduction";

export interface StockMovement {
  id: string;
  ingredientId: string;
  type: StockMovementType;
  quantity: number;
  reason: string;
  userId: string;
  kioskId?: string;
  createdAt: string;
}

export interface StockAlert {
  id: string;
  ingredientId: string;
  ingredientName: string;
  currentStock: number;
  minimumStock: number;
  severity: "low" | "critical";
  kioskId?: string;
  isRead?: boolean;
  isResolved?: boolean;
  resolvedAt?: Date | string;
  createdAt: string;
}

export interface StockDeductionResult {
  success: boolean;
  message?: string;
  errors?: string[];
  deductions?: Array<{
    ingredientId: string;
    ingredientName: string;
    quantity: number;
  }>;
  alerts?: StockAlert[];
  insufficientIngredients?: Array<{
    ingredientId: string;
    ingredientName: string;
    required: number;
    available: number;
  }>;
}

export type MeasurementUnit =
  | "kg"
  | "g"
  | "mg"
  | "l"
  | "ml"
  | "unit"
  | "dozen"
  | "pack";

// ============================================================================
// MENU TYPES
// ============================================================================

export interface Menu {
  id: string;
  kioskId: string;
  name: string;
  description?: string;
  categories: Category[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// PAGINATION TYPES
// ============================================================================

export interface PaginationParams {
  page?: number;
  limit?: number;
  pageSize?: number; // Alias para limit
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  categoryId?: string;
}
// ============================================================================
// RECIPE TYPES
// ============================================================================

export interface Recipe {
  id: string;
  name: string;
  description?: string;
  ingredients: RecipeIngredient[];
  instructions: string[];
  preparationTime: number; // em minutos
  servings?: number;
  difficulty?: "easy" | "medium" | "hard";
  totalCost: number;
  cost?: number; // Alias para totalCost
  productId?: string;
  kioskId?: string;
  yield?: number;
  yieldUnit?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RecipeIngredient {
  id: string;
  ingredientId: string;
  ingredientName: string;
  name?: string; // Alias para ingredientName
  quantity: number;
  unit: string;
  cost?: number;
  costPerPortion: number;
}
