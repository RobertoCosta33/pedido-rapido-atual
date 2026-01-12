/**
 * Tipos relacionados ao controle de estoque e receitas
 */

export interface Ingredient {
  id: string;
  kioskId: string;
  name: string;
  description?: string;
  unit: MeasurementUnit;
  currentStock: number;
  minimumStock: number;
  maximumStock?: number;
  costPerUnit: number;
  supplier?: string;
  isActive: boolean;
  lastRestockDate?: Date;
  expirationDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type MeasurementUnit = 
  | 'kg'
  | 'g'
  | 'mg'
  | 'l'
  | 'ml'
  | 'unit'
  | 'dozen'
  | 'pack';

export interface Recipe {
  id: string;
  kioskId: string;
  productId: string;
  name: string;
  description?: string;
  yield: number;
  yieldUnit: string;
  preparationTime: number;
  instructions?: string[];
  ingredients: RecipeIngredient[];
  totalCost: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface RecipeIngredient {
  ingredientId: string;
  ingredientName: string;
  quantity: number;
  unit: MeasurementUnit;
  costPerPortion: number;
}

export interface StockMovement {
  id: string;
  kioskId: string;
  ingredientId: string;
  type: StockMovementType;
  quantity: number;
  previousStock: number;
  newStock: number;
  reason: string;
  orderId?: string;
  userId: string;
  createdAt: Date;
}

export type StockMovementType = 
  | 'in'
  | 'out'
  | 'adjustment'
  | 'order_deduction'
  | 'waste'
  | 'transfer';

export interface StockAlert {
  id: string;
  kioskId: string;
  ingredientId: string;
  ingredientName: string;
  type: StockAlertType;
  currentStock: number;
  minimumStock: number;
  isRead: boolean;
  isResolved: boolean;
  createdAt: Date;
  resolvedAt?: Date;
}

export type StockAlertType = 
  | 'low_stock'
  | 'out_of_stock'
  | 'expiring_soon'
  | 'expired';

export interface StockReport {
  kioskId: string;
  generatedAt: Date;
  period: {
    start: Date;
    end: Date;
  };
  totalIngredients: number;
  lowStockItems: number;
  outOfStockItems: number;
  totalValue: number;
  movements: StockMovementSummary[];
}

export interface StockMovementSummary {
  ingredientId: string;
  ingredientName: string;
  totalIn: number;
  totalOut: number;
  netChange: number;
}

export interface InventoryCheck {
  id: string;
  kioskId: string;
  performedBy: string;
  status: 'pending' | 'in_progress' | 'completed';
  items: InventoryCheckItem[];
  discrepancies: number;
  notes?: string;
  createdAt: Date;
  completedAt?: Date;
}

export interface InventoryCheckItem {
  ingredientId: string;
  expectedStock: number;
  actualStock: number;
  discrepancy: number;
  notes?: string;
}

export interface StockDeductionResult {
  success: boolean;
  deductions: {
    ingredientId: string;
    ingredientName: string;
    quantityDeducted: number;
    newStock: number;
    isLowStock: boolean;
  }[];
  alerts: StockAlert[];
  errors: string[];
}

