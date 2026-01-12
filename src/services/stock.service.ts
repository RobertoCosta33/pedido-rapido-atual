/**
 * Serviço de controle de estoque
 * Gerencia insumos, receitas e movimentações
 */

import { api } from './api';
import {
  Ingredient,
  Recipe,
  StockMovement,
  StockAlert,
  StockDeductionResult,
  StockMovementType,
  MeasurementUnit,
} from '@/types';

/**
 * Mock de dados para desenvolvimento
 */
const mockIngredients: Ingredient[] = [
  {
    id: '1',
    kioskId: '1',
    name: 'Pão Brioche',
    description: 'Pão artesanal tipo brioche',
    unit: 'unit',
    currentStock: 50,
    minimumStock: 20,
    maximumStock: 100,
    costPerUnit: 2.50,
    supplier: 'Padaria Central',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    kioskId: '1',
    name: 'Hambúrguer Bovino 180g',
    description: 'Blend artesanal de carne bovina',
    unit: 'unit',
    currentStock: 40,
    minimumStock: 15,
    maximumStock: 80,
    costPerUnit: 8.00,
    supplier: 'Frigorífico Premium',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    kioskId: '1',
    name: 'Queijo Cheddar',
    description: 'Fatias de queijo cheddar',
    unit: 'unit',
    currentStock: 100,
    minimumStock: 30,
    maximumStock: 200,
    costPerUnit: 1.50,
    supplier: 'Laticínios Sul',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    kioskId: '1',
    name: 'Bacon',
    description: 'Fatias de bacon defumado',
    unit: 'g',
    currentStock: 2000,
    minimumStock: 500,
    maximumStock: 5000,
    costPerUnit: 0.08,
    supplier: 'Frigorífico Premium',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '5',
    kioskId: '1',
    name: 'Batata Congelada',
    description: 'Batata pré-frita congelada',
    unit: 'kg',
    currentStock: 15,
    minimumStock: 5,
    maximumStock: 30,
    costPerUnit: 12.00,
    supplier: 'Distribuidora Frios',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '6',
    kioskId: '1',
    name: 'Refrigerante Lata',
    description: 'Lata 350ml diversas marcas',
    unit: 'unit',
    currentStock: 8,
    minimumStock: 50,
    maximumStock: 200,
    costPerUnit: 3.50,
    supplier: 'Distribuidora Bebidas',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const mockRecipes: Recipe[] = [
  {
    id: '1',
    kioskId: '1',
    productId: '1',
    name: 'X-Burger Clássico',
    description: 'Receita do hambúrguer clássico',
    yield: 1,
    yieldUnit: 'unidade',
    preparationTime: 15,
    instructions: [
      'Grelhar o hambúrguer por 3 minutos de cada lado',
      'Tostar o pão na chapa',
      'Montar com queijo, alface, tomate e molho',
    ],
    ingredients: [
      { ingredientId: '1', ingredientName: 'Pão Brioche', quantity: 1, unit: 'unit', costPerPortion: 2.50 },
      { ingredientId: '2', ingredientName: 'Hambúrguer Bovino 180g', quantity: 1, unit: 'unit', costPerPortion: 8.00 },
      { ingredientId: '3', ingredientName: 'Queijo Cheddar', quantity: 2, unit: 'unit', costPerPortion: 3.00 },
    ],
    totalCost: 13.50,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    kioskId: '1',
    productId: '2',
    name: 'X-Bacon Supreme',
    description: 'Receita do hambúrguer com bacon',
    yield: 1,
    yieldUnit: 'unidade',
    preparationTime: 18,
    instructions: [
      'Grelhar o hambúrguer por 3 minutos de cada lado',
      'Fritar o bacon até ficar crocante',
      'Caramelizar a cebola',
      'Tostar o pão na chapa',
      'Montar com todos os ingredientes',
    ],
    ingredients: [
      { ingredientId: '1', ingredientName: 'Pão Brioche', quantity: 1, unit: 'unit', costPerPortion: 2.50 },
      { ingredientId: '2', ingredientName: 'Hambúrguer Bovino 180g', quantity: 1, unit: 'unit', costPerPortion: 8.00 },
      { ingredientId: '3', ingredientName: 'Queijo Cheddar', quantity: 2, unit: 'unit', costPerPortion: 3.00 },
      { ingredientId: '4', ingredientName: 'Bacon', quantity: 50, unit: 'g', costPerPortion: 4.00 },
    ],
    totalCost: 17.50,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const mockAlerts: StockAlert[] = [
  {
    id: '1',
    kioskId: '1',
    ingredientId: '6',
    ingredientName: 'Refrigerante Lata',
    type: 'low_stock',
    currentStock: 8,
    minimumStock: 50,
    isRead: false,
    isResolved: false,
    createdAt: new Date(),
  },
];

const mockMovements: StockMovement[] = [];

const simulateDelay = (ms: number = 300): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const stockService = {
  /**
   * Lista todos os insumos de um quiosque
   */
  getIngredients: async (kioskId: string): Promise<Ingredient[]> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      return mockIngredients.filter((i) => i.kioskId === kioskId);
    }
    
    const response = await api.get<Ingredient[]>(`/kiosks/${kioskId}/ingredients`);
    return response.data;
  },

  /**
   * Obtém um insumo por ID
   */
  getIngredient: async (ingredientId: string): Promise<Ingredient> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      const ingredient = mockIngredients.find((i) => i.id === ingredientId);
      if (!ingredient) throw new Error('Insumo não encontrado');
      return ingredient;
    }
    
    const response = await api.get<Ingredient>(`/ingredients/${ingredientId}`);
    return response.data;
  },

  /**
   * Cria um novo insumo
   */
  createIngredient: async (kioskId: string, data: Partial<Ingredient>): Promise<Ingredient> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      const newIngredient: Ingredient = {
        id: String(mockIngredients.length + 1),
        kioskId,
        name: data.name || '',
        description: data.description,
        unit: data.unit || 'unit',
        currentStock: data.currentStock || 0,
        minimumStock: data.minimumStock || 0,
        maximumStock: data.maximumStock,
        costPerUnit: data.costPerUnit || 0,
        supplier: data.supplier,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockIngredients.push(newIngredient);
      return newIngredient;
    }
    
    const response = await api.post<Ingredient>(`/kiosks/${kioskId}/ingredients`, data);
    return response.data;
  },

  /**
   * Atualiza um insumo
   */
  updateIngredient: async (ingredientId: string, data: Partial<Ingredient>): Promise<Ingredient> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      const index = mockIngredients.findIndex((i) => i.id === ingredientId);
      if (index !== -1) {
        mockIngredients[index] = { ...mockIngredients[index], ...data, updatedAt: new Date() };
        return mockIngredients[index];
      }
      throw new Error('Insumo não encontrado');
    }
    
    const response = await api.put<Ingredient>(`/ingredients/${ingredientId}`, data);
    return response.data;
  },

  /**
   * Remove um insumo
   */
  deleteIngredient: async (ingredientId: string): Promise<void> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      const index = mockIngredients.findIndex((i) => i.id === ingredientId);
      if (index !== -1) {
        mockIngredients.splice(index, 1);
      }
      return;
    }
    
    await api.delete(`/ingredients/${ingredientId}`);
  },

  /**
   * Lista receitas de um quiosque
   */
  getRecipes: async (kioskId: string): Promise<Recipe[]> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      return mockRecipes.filter((r) => r.kioskId === kioskId);
    }
    
    const response = await api.get<Recipe[]>(`/kiosks/${kioskId}/recipes`);
    return response.data;
  },

  /**
   * Obtém uma receita por ID
   */
  getRecipe: async (recipeId: string): Promise<Recipe> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      const recipe = mockRecipes.find((r) => r.id === recipeId);
      if (!recipe) throw new Error('Receita não encontrada');
      return recipe;
    }
    
    const response = await api.get<Recipe>(`/recipes/${recipeId}`);
    return response.data;
  },

  /**
   * Cria uma nova receita
   */
  createRecipe: async (kioskId: string, data: Partial<Recipe>): Promise<Recipe> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      const totalCost = (data.ingredients || []).reduce(
        (sum, ing) => sum + ing.costPerPortion,
        0
      );
      
      const newRecipe: Recipe = {
        id: String(mockRecipes.length + 1),
        kioskId,
        productId: data.productId || '',
        name: data.name || '',
        description: data.description,
        yield: data.yield || 1,
        yieldUnit: data.yieldUnit || 'unidade',
        preparationTime: data.preparationTime || 0,
        instructions: data.instructions || [],
        ingredients: data.ingredients || [],
        totalCost,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockRecipes.push(newRecipe);
      return newRecipe;
    }
    
    const response = await api.post<Recipe>(`/kiosks/${kioskId}/recipes`, data);
    return response.data;
  },

  /**
   * Atualiza uma receita
   */
  updateRecipe: async (recipeId: string, data: Partial<Recipe>): Promise<Recipe> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      const index = mockRecipes.findIndex((r) => r.id === recipeId);
      if (index !== -1) {
        mockRecipes[index] = { ...mockRecipes[index], ...data, updatedAt: new Date() };
        return mockRecipes[index];
      }
      throw new Error('Receita não encontrada');
    }
    
    const response = await api.put<Recipe>(`/recipes/${recipeId}`, data);
    return response.data;
  },

  /**
   * Registra movimentação de estoque
   */
  registerMovement: async (
    kioskId: string,
    ingredientId: string,
    type: StockMovementType,
    quantity: number,
    reason: string,
    userId: string
  ): Promise<StockMovement> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      
      const ingredient = mockIngredients.find((i) => i.id === ingredientId);
      if (!ingredient) throw new Error('Insumo não encontrado');
      
      const previousStock = ingredient.currentStock;
      const newStock = type === 'in' || type === 'adjustment'
        ? previousStock + quantity
        : previousStock - quantity;
      
      ingredient.currentStock = Math.max(0, newStock);
      
      const movement: StockMovement = {
        id: String(mockMovements.length + 1),
        kioskId,
        ingredientId,
        type,
        quantity,
        previousStock,
        newStock: ingredient.currentStock,
        reason,
        userId,
        createdAt: new Date(),
      };
      
      mockMovements.push(movement);
      
      // Verifica alertas
      if (ingredient.currentStock <= ingredient.minimumStock) {
        const existingAlert = mockAlerts.find(
          (a) => a.ingredientId === ingredientId && !a.isResolved
        );
        
        if (!existingAlert) {
          mockAlerts.push({
            id: String(mockAlerts.length + 1),
            kioskId,
            ingredientId,
            ingredientName: ingredient.name,
            type: ingredient.currentStock === 0 ? 'out_of_stock' : 'low_stock',
            currentStock: ingredient.currentStock,
            minimumStock: ingredient.minimumStock,
            isRead: false,
            isResolved: false,
            createdAt: new Date(),
          });
        }
      }
      
      return movement;
    }
    
    const response = await api.post<StockMovement>(`/kiosks/${kioskId}/stock/movement`, {
      ingredientId,
      type,
      quantity,
      reason,
    });
    return response.data;
  },

  /**
   * Debita estoque baseado em uma receita (quando um pedido é feito)
   */
  deductByRecipe: async (
    kioskId: string,
    recipeId: string,
    quantity: number,
    orderId: string,
    userId: string
  ): Promise<StockDeductionResult> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      
      const recipe = mockRecipes.find((r) => r.id === recipeId);
      if (!recipe) throw new Error('Receita não encontrada');
      
      const result: StockDeductionResult = {
        success: true,
        deductions: [],
        alerts: [],
        errors: [],
      };
      
      for (const recipeIngredient of recipe.ingredients) {
        const ingredient = mockIngredients.find((i) => i.id === recipeIngredient.ingredientId);
        
        if (!ingredient) {
          result.errors.push(`Insumo ${recipeIngredient.ingredientName} não encontrado`);
          continue;
        }
        
        const quantityNeeded = recipeIngredient.quantity * quantity;
        
        if (ingredient.currentStock < quantityNeeded) {
          result.errors.push(
            `Estoque insuficiente de ${ingredient.name}: necessário ${quantityNeeded}, disponível ${ingredient.currentStock}`
          );
          result.success = false;
          continue;
        }
        
        const previousStock = ingredient.currentStock;
        ingredient.currentStock -= quantityNeeded;
        
        result.deductions.push({
          ingredientId: ingredient.id,
          ingredientName: ingredient.name,
          quantityDeducted: quantityNeeded,
          newStock: ingredient.currentStock,
          isLowStock: ingredient.currentStock <= ingredient.minimumStock,
        });
        
        // Registra movimentação
        mockMovements.push({
          id: String(mockMovements.length + 1),
          kioskId,
          ingredientId: ingredient.id,
          type: 'order_deduction',
          quantity: quantityNeeded,
          previousStock,
          newStock: ingredient.currentStock,
          reason: `Pedido #${orderId}`,
          orderId,
          userId,
          createdAt: new Date(),
        });
        
        // Verifica alertas
        if (ingredient.currentStock <= ingredient.minimumStock) {
          const alert: StockAlert = {
            id: String(mockAlerts.length + 1),
            kioskId,
            ingredientId: ingredient.id,
            ingredientName: ingredient.name,
            type: ingredient.currentStock === 0 ? 'out_of_stock' : 'low_stock',
            currentStock: ingredient.currentStock,
            minimumStock: ingredient.minimumStock,
            isRead: false,
            isResolved: false,
            createdAt: new Date(),
          };
          mockAlerts.push(alert);
          result.alerts.push(alert);
        }
      }
      
      return result;
    }
    
    const response = await api.post<StockDeductionResult>(`/kiosks/${kioskId}/stock/deduct`, {
      recipeId,
      quantity,
      orderId,
    });
    return response.data;
  },

  /**
   * Lista alertas de estoque
   */
  getAlerts: async (kioskId: string, unreadOnly: boolean = false): Promise<StockAlert[]> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      let alerts = mockAlerts.filter((a) => a.kioskId === kioskId && !a.isResolved);
      if (unreadOnly) {
        alerts = alerts.filter((a) => !a.isRead);
      }
      return alerts;
    }
    
    const response = await api.get<StockAlert[]>(`/kiosks/${kioskId}/stock/alerts`, {
      unreadOnly,
    });
    return response.data;
  },

  /**
   * Marca alerta como lido
   */
  markAlertAsRead: async (alertId: string): Promise<void> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      const alert = mockAlerts.find((a) => a.id === alertId);
      if (alert) {
        alert.isRead = true;
      }
      return;
    }
    
    await api.patch(`/stock/alerts/${alertId}/read`);
  },

  /**
   * Resolve alerta de estoque
   */
  resolveAlert: async (alertId: string): Promise<void> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      const alert = mockAlerts.find((a) => a.id === alertId);
      if (alert) {
        alert.isResolved = true;
        alert.resolvedAt = new Date();
      }
      return;
    }
    
    await api.patch(`/stock/alerts/${alertId}/resolve`);
  },

  /**
   * Obtém histórico de movimentações
   */
  getMovementHistory: async (
    kioskId: string,
    ingredientId?: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<StockMovement[]> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      let movements = mockMovements.filter((m) => m.kioskId === kioskId);
      
      if (ingredientId) {
        movements = movements.filter((m) => m.ingredientId === ingredientId);
      }
      
      if (startDate) {
        movements = movements.filter((m) => new Date(m.createdAt) >= startDate);
      }
      
      if (endDate) {
        movements = movements.filter((m) => new Date(m.createdAt) <= endDate);
      }
      
      return movements.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }
    
    const response = await api.get<StockMovement[]>(`/kiosks/${kioskId}/stock/movements`, {
      ingredientId,
      startDate: startDate?.toISOString(),
      endDate: endDate?.toISOString(),
    });
    return response.data;
  },

  /**
   * Obtém unidades de medida disponíveis
   */
  getMeasurementUnits: (): { value: MeasurementUnit; label: string }[] => [
    { value: 'kg', label: 'Quilograma (kg)' },
    { value: 'g', label: 'Grama (g)' },
    { value: 'mg', label: 'Miligrama (mg)' },
    { value: 'l', label: 'Litro (L)' },
    { value: 'ml', label: 'Mililitro (ml)' },
    { value: 'unit', label: 'Unidade' },
    { value: 'dozen', label: 'Dúzia' },
    { value: 'pack', label: 'Pacote' },
  ],
};

export default stockService;

