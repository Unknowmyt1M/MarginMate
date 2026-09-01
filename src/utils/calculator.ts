import { Ingredient, CalculationResult, IngredientValidationError } from '../types/calculator';

/**
 * Calculates individual ingredient cost using normalized units.
 * Base units:
 * - g: price per kg -> cost = price * (quantity / 1000)
 * - kg: price per kg -> cost = price * quantity
 * - ml: price per litre -> cost = price * (quantity / 1000)
 * - litre: price per litre -> cost = price * quantity
 * - piece: price per piece -> cost = price * quantity
 */
export function calculateIngredientCost(ingredient: Ingredient): number {
  const qty = typeof ingredient.quantity === 'number' ? ingredient.quantity : 0;
  const prc = typeof ingredient.price === 'number' ? ingredient.price : 0;

  if (qty <= 0 || prc <= 0) return 0;

  switch (ingredient.unit) {
    case 'g':
      return prc * (qty / 1000);
    case 'kg':
      return prc * qty;
    case 'ml':
      return prc * (qty / 1000);
    case 'litre':
      return prc * qty;
    case 'piece':
      return prc * qty;
    default:
      return 0;
  }
}

/**
 * Calculates total recipe costs, gross profit, and gross margin percentage.
 */
export function calculateDishMargin(
  ingredients: Ingredient[],
  packagingCostInput: number | '',
  sellingPriceInput: number | ''
): CalculationResult {
  const totalIngredientCost = ingredients.reduce(
    (sum, ing) => sum + calculateIngredientCost(ing),
    0
  );

  const packagingCost = typeof packagingCostInput === 'number' && packagingCostInput >= 0 ? packagingCostInput : 0;
  const sellingPrice = typeof sellingPriceInput === 'number' && sellingPriceInput >= 0 ? sellingPriceInput : 0;

  const totalRecipeCost = totalIngredientCost + packagingCost;
  const grossProfit = sellingPrice - totalRecipeCost;

  let grossMarginPercent = 0;
  if (sellingPrice > 0) {
    grossMarginPercent = (grossProfit / sellingPrice) * 100;
  }

  // Safe against negative zero or NaN
  if (Number.isNaN(grossMarginPercent) || !Number.isFinite(grossMarginPercent)) {
    grossMarginPercent = 0;
  }

  return {
    totalIngredientCost,
    packagingCost,
    totalRecipeCost,
    sellingPrice,
    grossProfit,
    grossMarginPercent,
    isLoss: grossProfit < 0,
  };
}

/**
 * Validates a single ingredient row for inline feedback.
 */
export function validateIngredient(ingredient: Ingredient): IngredientValidationError {
  const errors: IngredientValidationError = {};

  if (!ingredient.name.trim()) {
    errors.name = 'Name is required';
  }

  if (ingredient.quantity === '' || ingredient.quantity < 0 || Number.isNaN(ingredient.quantity)) {
    errors.quantity = 'Valid quantity required';
  }

  if (ingredient.price === '' || ingredient.price < 0 || Number.isNaN(ingredient.price)) {
    errors.price = 'Valid price required';
  }

  return errors;
}
