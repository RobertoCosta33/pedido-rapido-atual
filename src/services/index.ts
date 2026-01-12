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
export { planService } from './plan.service';
export { employeeService, EMPLOYEE_ROLES } from './employee.service';
export { ratingService, RATING_TYPE_LABELS } from './rating.service';
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
  MockPlan,
  MockEmployee,
  MockRating,
} from './mock.service';

// Re-exporta tipos dos services
export type { License, LicenseFeatures, LicenseLimits } from './license.service';
export { hasLicenseFeature, checkLicenseLimit } from './license.service';
export type { KioskWithLicense } from './kiosk.service';
export type { Plan, PlanPricing, PlanLimits, PlanFeatures } from './plan.service';
export type { Employee, CreateEmployeeData, UpdateEmployeeData } from './employee.service';
export type { Rating, RatingType, CreateRatingData, RatedItem, KioskRanking } from './rating.service';
