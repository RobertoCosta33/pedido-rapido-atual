/**
 * Constantes da aplicação
 */

export const APP_NAME = "Pedido Rápido";
export const APP_DESCRIPTION =
  "Sistema completo de gestão de quiosques, cardápio digital e controle de estoque";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

// API URLs
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Storage Keys
export const STORAGE_KEYS = {
  AUTH: "pedido-rapido-auth",
  TOKENS: "pedido-rapido-tokens",
  THEME: "pedido-rapido-theme",
} as const;

// Roles
export const USER_ROLES = {
  SUPER_ADMIN: "super_admin",
  ADMIN: "admin",
  CUSTOMER: "customer",
} as const;

// Plans
export const PLANS = {
  FREE: "free",
  BASIC: "basic",
  PRO: "pro",
  PREMIUM: "premium",
} as const;

// Rating
export const RATING_TARGET_TYPES = {
  KIOSK: "kiosk",
  PRODUCT: "product",
  STAFF: "staff",
} as const;

export const RATING_SCORES = {
  MIN: 1,
  MAX: 5,
} as const;

// Order Status
export const ORDER_STATUS = {
  pending: {
    label: "Pendente",
    bgColor: "#fff3cd",
    color: "#856404",
  },
  confirmed: {
    label: "Confirmado",
    bgColor: "#d4edda",
    color: "#155724",
  },
  preparing: {
    label: "Preparando",
    bgColor: "#cce5ff",
    color: "#004085",
  },
  ready: {
    label: "Pronto",
    bgColor: "#e2e3e5",
    color: "#383d41",
  },
  delivered: {
    label: "Entregue",
    bgColor: "#d1ecf1",
    color: "#0c5460",
  },
  cancelled: {
    label: "Cancelado",
    bgColor: "#f8d7da",
    color: "#721c24",
  },
} as const;

// Allergens
export const ALLERGENS = {
  GLUTEN: "gluten",
  LACTOSE: "lactose",
  NUTS: "nuts",
  EGGS: "eggs",
  SOY: "soy",
  FISH: "fish",
  SHELLFISH: "shellfish",
} as const;
