/**
 * Serviço de receitas
 * Gerencia receitas e seus ingredientes
 */

import { api } from './api';
import { Recipe, RecipeIngredient } from '@/types';
import { mockDataService, simulateDelay, MockRecipe } from './mock.service';

/**
 * Converte MockRecipe para Recipe
 */
const toRecipe = (mock: MockRecipe): Recipe => ({
  id: mock.id,
  kioskId: mock.kioskId,
  productId: mock.productId,
  name: mock.name,
  description: mock.description,
  yield: mock.yield,
  yieldUnit: mock.yieldUnit,
  preparationTime: mock.preparationTime,
  instructions: mock.instructions,
  ingredients: mock.ingredients.map((ing) => ({
    ...ing,
    unit: ing.unit as RecipeIngredient['unit'],
  })),
  totalCost: mock.totalCost,
  isActive: mock.isActive,
  createdAt: new Date(mock.createdAt),
  updatedAt: new Date(mock.updatedAt),
});

export const recipeService = {
  /**
   * Lista receitas de um quiosque
   */
  getByKiosk: async (kioskId: string): Promise<Recipe[]> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      return mockDataService.getRecipesByKiosk(kioskId).map(toRecipe);
    }
    
    const response = await api.get<Recipe[]>(`/kiosks/${kioskId}/recipes`);
    return response.data;
  },

  /**
   * Obtém receita por ID
   */
  getById: async (id: string): Promise<Recipe> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      const recipe = mockDataService.getRecipeById(id);
      if (!recipe) throw new Error('Receita não encontrada');
      return toRecipe(recipe);
    }
    
    const response = await api.get<Recipe>(`/recipes/${id}`);
    return response.data;
  },

  /**
   * Obtém receita por ID do produto
   */
  getByProductId: async (productId: string): Promise<Recipe | null> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      const recipe = mockDataService.getRecipeByProductId(productId);
      return recipe ? toRecipe(recipe) : null;
    }
    
    const response = await api.get<Recipe>(`/products/${productId}/recipe`);
    return response.data;
  },

  /**
   * Cria nova receita
   */
  create: async (kioskId: string, data: Partial<Recipe>): Promise<Recipe> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      
      // Calcula custo total
      const totalCost = (data.ingredients || []).reduce(
        (sum, ing) => sum + ing.costPerPortion,
        0
      );
      
      const newRecipe: MockRecipe = {
        id: `rec_${String(mockDataService.getRecipes().length + 1).padStart(3, '0')}`,
        kioskId,
        productId: data.productId || '',
        name: data.name || '',
        description: data.description || '',
        yield: data.yield || 1,
        yieldUnit: data.yieldUnit || 'porção',
        preparationTime: data.preparationTime || 0,
        instructions: data.instructions || [],
        ingredients: data.ingredients?.map((ing) => ({
          ...ing,
          unit: ing.unit as string,
        })) || [],
        totalCost,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Adiciona ao mock (nota: não temos addRecipe no mockDataService, mas funcionaria em produção)
      return toRecipe(newRecipe);
    }
    
    const response = await api.post<Recipe>(`/kiosks/${kioskId}/recipes`, data);
    return response.data;
  },

  /**
   * Atualiza receita
   */
  update: async (id: string, data: Partial<Recipe>): Promise<Recipe> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      
      const existing = mockDataService.getRecipeById(id);
      if (!existing) throw new Error('Receita não encontrada');
      
      // Recalcula custo se ingredientes foram alterados
      let totalCost = existing.totalCost;
      if (data.ingredients) {
        totalCost = data.ingredients.reduce((sum, ing) => sum + ing.costPerPortion, 0);
      }
      
      const updated: MockRecipe = {
        ...existing,
        ...data,
        ingredients: data.ingredients?.map((ing) => ({
          ...ing,
          unit: ing.unit as string,
        })) || existing.ingredients,
        totalCost,
        updatedAt: new Date().toISOString(),
      };
      
      return toRecipe(updated);
    }
    
    const response = await api.put<Recipe>(`/recipes/${id}`, data);
    return response.data;
  },

  /**
   * Remove receita
   */
  delete: async (id: string): Promise<void> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      // Em produção, removeria do banco
      return;
    }
    
    await api.delete(`/recipes/${id}`);
  },

  /**
   * Calcula custo da receita
   */
  calculateCost: async (ingredients: RecipeIngredient[]): Promise<number> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay(100);
      
      let totalCost = 0;
      for (const ing of ingredients) {
        const stockItem = mockDataService.getIngredientById(ing.ingredientId);
        if (stockItem) {
          totalCost += stockItem.costPerUnit * ing.quantity;
        }
      }
      return Math.round(totalCost * 100) / 100;
    }
    
    const response = await api.post<{ cost: number }>('/recipes/calculate-cost', { ingredients });
    return response.data.cost;
  },

  /**
   * Verifica disponibilidade de ingredientes
   */
  checkAvailability: async (
    kioskId: string,
    recipeId: string,
    quantity: number = 1
  ): Promise<{
    available: boolean;
    missingIngredients: Array<{
      ingredientId: string;
      ingredientName: string;
      required: number;
      available: number;
    }>;
  }> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      
      const recipe = mockDataService.getRecipeById(recipeId);
      if (!recipe) throw new Error('Receita não encontrada');
      
      const missingIngredients: Array<{
        ingredientId: string;
        ingredientName: string;
        required: number;
        available: number;
      }> = [];
      
      for (const ing of recipe.ingredients) {
        const stockItem = mockDataService.getIngredientById(ing.ingredientId);
        const required = ing.quantity * quantity;
        const available = stockItem?.currentStock || 0;
        
        if (available < required) {
          missingIngredients.push({
            ingredientId: ing.ingredientId,
            ingredientName: ing.ingredientName,
            required,
            available,
          });
        }
      }
      
      return {
        available: missingIngredients.length === 0,
        missingIngredients,
      };
    }
    
    const response = await api.get<{
      available: boolean;
      missingIngredients: Array<{
        ingredientId: string;
        ingredientName: string;
        required: number;
        available: number;
      }>;
    }>(`/kiosks/${kioskId}/recipes/${recipeId}/check-availability`, {
      params: { quantity },
    });
    return response.data;
  },

  /**
   * Lista receitas com estoque baixo
   */
  getWithLowStock: async (kioskId: string): Promise<Recipe[]> => {
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay();
      
      const recipes = mockDataService.getRecipesByKiosk(kioskId);
      const lowStockRecipes: MockRecipe[] = [];
      
      for (const recipe of recipes) {
        for (const ing of recipe.ingredients) {
          const stockItem = mockDataService.getIngredientById(ing.ingredientId);
          if (stockItem && stockItem.currentStock <= stockItem.minimumStock) {
            lowStockRecipes.push(recipe);
            break;
          }
        }
      }
      
      return lowStockRecipes.map(toRecipe);
    }
    
    const response = await api.get<Recipe[]>(`/kiosks/${kioskId}/recipes/low-stock`);
    return response.data;
  },
};

export default recipeService;

