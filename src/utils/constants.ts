/**
 * Constantes globais da aplicação
 */

/**
 * Nome da aplicação
 */
export const APP_NAME = 'Pedido Rápido';

/**
 * Descrição da aplicação
 */
export const APP_DESCRIPTION = 'Sistema de gestão de quiosques, cardápio digital e controle de estoque';

/**
 * URL base do site
 */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://pedidorapido.com';

/**
 * Chaves de armazenamento local
 */
export const STORAGE_KEYS = {
  AUTH: 'pedido-rapido-auth',
  TOKENS: 'pedido-rapido-tokens',
  THEME: 'pedido-rapido-theme',
  CART: 'pedido-rapido-cart',
  PREFERENCES: 'pedido-rapido-preferences',
} as const;

/**
 * Rotas da aplicação
 */
export const ROUTES = {
  // Públicas
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  UNAUTHORIZED: '/unauthorized',
  
  // Menu/Cliente
  MENU: '/menu',
  MENU_KIOSK: (slug: string) => `/menu/${slug}`,
  MENU_PRODUCT: (kioskSlug: string, productId: string) => `/menu/${kioskSlug}/product/${productId}`,
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDER_STATUS: (orderId: string) => `/order/${orderId}`,
  
  // Admin do Quiosque
  ADMIN: '/admin',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_CATEGORIES: '/admin/categories',
  ADMIN_MENU: '/admin/menu',
  ADMIN_RECIPES: '/admin/recipes',
  ADMIN_STOCK: '/admin/stock',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_SETTINGS: '/admin/settings',
  
  // Super Admin
  SUPER_ADMIN: '/super-admin',
  SUPER_ADMIN_DASHBOARD: '/super-admin/dashboard',
  SUPER_ADMIN_KIOSKS: '/super-admin/kiosks',
  SUPER_ADMIN_USERS: '/super-admin/users',
  SUPER_ADMIN_LICENSES: '/super-admin/licenses',
  SUPER_ADMIN_REPORTS: '/super-admin/reports',
  SUPER_ADMIN_SETTINGS: '/super-admin/settings',
} as const;

/**
 * Configurações de paginação
 */
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
} as const;

/**
 * Limites de upload
 */
export const UPLOAD_LIMITS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_IMAGE_SIZE: 2 * 1024 * 1024, // 2MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_IMAGE_EXTENSIONS: ['jpg', 'jpeg', 'png', 'webp'],
} as const;

/**
 * Status de pedido com cores
 */
export const ORDER_STATUS = {
  pending: { label: 'Pendente', color: '#FFBB33', bgColor: '#FFF8E1' },
  confirmed: { label: 'Confirmado', color: '#33B5E5', bgColor: '#E3F2FD' },
  preparing: { label: 'Preparando', color: '#FF6B35', bgColor: '#FFF3E0' },
  ready: { label: 'Pronto', color: '#00C851', bgColor: '#E8F5E9' },
  delivered: { label: 'Entregue', color: '#2ECC71', bgColor: '#E8F5E9' },
  cancelled: { label: 'Cancelado', color: '#FF4444', bgColor: '#FFEBEE' },
} as const;

/**
 * Tipos de alerta de estoque
 */
export const STOCK_ALERT_TYPES = {
  low_stock: { label: 'Estoque Baixo', color: '#FFBB33', icon: 'Warning' },
  out_of_stock: { label: 'Sem Estoque', color: '#FF4444', icon: 'Error' },
  expiring_soon: { label: 'Vencendo', color: '#FF6B35', icon: 'Schedule' },
  expired: { label: 'Vencido', color: '#CC0000', icon: 'Cancel' },
} as const;

/**
 * Métodos de pagamento
 */
export const PAYMENT_METHODS = {
  cash: { label: 'Dinheiro', icon: 'Payments' },
  credit_card: { label: 'Cartão de Crédito', icon: 'CreditCard' },
  debit_card: { label: 'Cartão de Débito', icon: 'CreditCard' },
  pix: { label: 'PIX', icon: 'Pix' },
  voucher: { label: 'Vale Refeição', icon: 'CardGiftcard' },
} as const;

/**
 * Alérgenos com ícones e cores
 */
export const ALLERGENS = {
  gluten: { label: 'Glúten', icon: '🌾' },
  lactose: { label: 'Lactose', icon: '🥛' },
  nuts: { label: 'Nozes', icon: '🥜' },
  eggs: { label: 'Ovos', icon: '🥚' },
  soy: { label: 'Soja', icon: '🫘' },
  seafood: { label: 'Frutos do Mar', icon: '🦐' },
  peanuts: { label: 'Amendoim', icon: '🥜' },
} as const;

/**
 * Dias da semana
 */
export const DAYS_OF_WEEK = [
  { value: 'sunday', label: 'Domingo', short: 'Dom' },
  { value: 'monday', label: 'Segunda', short: 'Seg' },
  { value: 'tuesday', label: 'Terça', short: 'Ter' },
  { value: 'wednesday', label: 'Quarta', short: 'Qua' },
  { value: 'thursday', label: 'Quinta', short: 'Qui' },
  { value: 'friday', label: 'Sexta', short: 'Sex' },
  { value: 'saturday', label: 'Sábado', short: 'Sáb' },
] as const;

/**
 * Estados brasileiros
 */
export const BRAZILIAN_STATES = [
  { value: 'AC', label: 'Acre' },
  { value: 'AL', label: 'Alagoas' },
  { value: 'AP', label: 'Amapá' },
  { value: 'AM', label: 'Amazonas' },
  { value: 'BA', label: 'Bahia' },
  { value: 'CE', label: 'Ceará' },
  { value: 'DF', label: 'Distrito Federal' },
  { value: 'ES', label: 'Espírito Santo' },
  { value: 'GO', label: 'Goiás' },
  { value: 'MA', label: 'Maranhão' },
  { value: 'MT', label: 'Mato Grosso' },
  { value: 'MS', label: 'Mato Grosso do Sul' },
  { value: 'MG', label: 'Minas Gerais' },
  { value: 'PA', label: 'Pará' },
  { value: 'PB', label: 'Paraíba' },
  { value: 'PR', label: 'Paraná' },
  { value: 'PE', label: 'Pernambuco' },
  { value: 'PI', label: 'Piauí' },
  { value: 'RJ', label: 'Rio de Janeiro' },
  { value: 'RN', label: 'Rio Grande do Norte' },
  { value: 'RS', label: 'Rio Grande do Sul' },
  { value: 'RO', label: 'Rondônia' },
  { value: 'RR', label: 'Roraima' },
  { value: 'SC', label: 'Santa Catarina' },
  { value: 'SP', label: 'São Paulo' },
  { value: 'SE', label: 'Sergipe' },
  { value: 'TO', label: 'Tocantins' },
] as const;

/**
 * Mensagens de erro padrão
 */
export const ERROR_MESSAGES = {
  GENERIC: 'Ocorreu um erro. Tente novamente.',
  NETWORK: 'Erro de conexão. Verifique sua internet.',
  UNAUTHORIZED: 'Sessão expirada. Faça login novamente.',
  FORBIDDEN: 'Você não tem permissão para acessar este recurso.',
  NOT_FOUND: 'Recurso não encontrado.',
  VALIDATION: 'Verifique os dados informados.',
  SERVER: 'Erro no servidor. Tente novamente mais tarde.',
} as const;

/**
 * Mensagens de sucesso padrão
 */
export const SUCCESS_MESSAGES = {
  SAVE: 'Salvo com sucesso!',
  UPDATE: 'Atualizado com sucesso!',
  DELETE: 'Removido com sucesso!',
  CREATE: 'Criado com sucesso!',
  SEND: 'Enviado com sucesso!',
} as const;

/**
 * Configurações de animação
 */
export const ANIMATION = {
  DURATION: {
    FAST: 150,
    NORMAL: 250,
    SLOW: 350,
  },
  EASING: {
    DEFAULT: 'ease-in-out',
    BOUNCE: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
} as const;

/**
 * Breakpoints para responsividade
 */
export const BREAKPOINTS = {
  XS: 0,
  SM: 600,
  MD: 900,
  LG: 1200,
  XL: 1536,
} as const;

/**
 * Z-index layers
 */
export const Z_INDEX = {
  DROPDOWN: 100,
  STICKY: 200,
  MODAL_BACKDROP: 300,
  MODAL: 400,
  POPOVER: 500,
  TOOLTIP: 600,
  NOTIFICATION: 700,
} as const;

