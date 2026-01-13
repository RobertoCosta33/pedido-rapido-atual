/**
 * Exportação centralizada de todos os serviços
 * Facilita importação: import { authService, productService } from '@/services'
 */

// API Client (Axios)
export { api, apiClient } from './api';

// Services que consomem API real
export { kiosksService } from './kiosks.service';
export type { KioskDto, KioskRankingDto, CreateKioskDto, UpdateKioskDto } from './kiosks.service';

export { rankingService } from './ranking.service';
export type { 
  KioskRankingDto as RankingKioskDto, 
  MenuItemRankingDto, 
  EmployeeRankingDto, 
  FullRankingDto 
} from './ranking.service';

export { employeesService } from './employees.service';
export type { EmployeeDto, CreateEmployeeDto, UpdateEmployeeDto } from './employees.service';

export { menuItemsService } from './menu-items.service';
export type { MenuItemDto, CreateMenuItemDto, UpdateMenuItemDto } from './menu-items.service';

export { plansService } from './plans.service';
export type { PlanDto } from './plans.service';

// Services legados (mock) - manter para compatibilidade
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
