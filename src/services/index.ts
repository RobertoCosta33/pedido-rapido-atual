/**
 * Exportação centralizada de todos os serviços
 * Facilita importação: import { authService, productService } from '@/services'
 */

export { api } from './api';
export { authService } from './auth.service';
export { productService } from './product.service';
export { stockService } from './stock.service';
export { userService } from './user.service';
export { kioskService } from './kiosk.service';
export { orderService } from './order.service';
export { recipeService } from './recipe.service';
export { licenseService } from './license.service';
export { mockDataService, simulateDelay } from './mock.service';

// Re-exporta tipos do mock service
export type {
  MockUser,
  MockKiosk,
  MockCategory,
  MockProduct,
  MockIngredient,
  MockRecipe,
  MockOrder,
  MockLicense,
} from './mock.service';

// Re-exporta tipos do license service
export type { License } from './license.service';
export type { KioskWithLicense } from './kiosk.service';
