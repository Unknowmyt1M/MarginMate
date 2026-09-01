export type Unit = 'g' | 'kg' | 'ml' | 'litre' | 'piece';

export interface Ingredient {
  id: string;
  name: string;
  quantity: number | '';
  unit: Unit;
  price: number | '';
}

export interface CalculationResult {
  totalIngredientCost: number;
  packagingCost: number;
  totalRecipeCost: number;
  sellingPrice: number;
  grossProfit: number;
  grossMarginPercent: number;
  isLoss: boolean;
}

export interface IngredientValidationError {
  name?: string;
  quantity?: string;
  price?: string;
}

export interface CalculatorValidationError {
  ingredients?: Record<string, IngredientValidationError>;
  packaging?: string;
  sellingPrice?: string;
}

export type AnalyticsEventType =
  | 'page_view'
  | 'ingredient_added'
  | 'ingredient_removed'
  | 'calculation_completed'
  | 'result_shared';

export interface AnalyticsEventData {
  ingredientCount?: number;
  hasPackaging?: boolean;
  isProfitable?: boolean;
  marginBucket?: string;
  shareMethod?: string;
  [key: string]: unknown;
}
