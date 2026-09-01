import { describe, it, expect } from 'vitest';
import {
  calculateIngredientCost,
  calculateDishMargin,
} from '../utils/calculator';
import { formatCurrency, formatPercentage } from '../utils/formatting';
import { Ingredient } from '../types/calculator';

describe('MarginMate V0 - Calculation Engine Verification', () => {
  // Test 1: Single Ingredient Chicken
  it('Test 1: Chicken 150g @ ₹280/kg, Packaging ₹8, Selling Price ₹149', () => {
    const ingredient: Ingredient = {
      id: '1',
      name: 'Chicken',
      quantity: 150,
      unit: 'g',
      price: 280,
    };

    const ingCost = calculateIngredientCost(ingredient);
    expect(ingCost).toBe(42); // 280 * (150 / 1000) = 42

    const result = calculateDishMargin([ingredient], 8, 149);
    expect(result.totalIngredientCost).toBe(42);
    expect(result.packagingCost).toBe(8);
    expect(result.totalRecipeCost).toBe(50); // 42 + 8 = 50
    expect(result.grossProfit).toBe(99); // 149 - 50 = 99
    expect(result.grossMarginPercent).toBeCloseTo(66.4429, 3); // (99 / 149) * 100 ≈ 66.44%
    expect(result.isLoss).toBe(false);
  });

  // Test 2: Multiple Ingredients Burger
  it('Test 2: Burger with Chicken, Bun, Sauce, Cheese, Packaging', () => {
    const ingredients: Ingredient[] = [
      { id: '1', name: 'Chicken', quantity: 150, unit: 'g', price: 280 }, // ₹42
      { id: '2', name: 'Bun', quantity: 1, unit: 'piece', price: 12 },    // ₹12
      { id: '3', name: 'Sauce', quantity: 20, unit: 'ml', price: 150 },   // 150 * (20 / 1000) = ₹3
      { id: '4', name: 'Cheese', quantity: 1, unit: 'piece', price: 15 }, // ₹15
    ];

    const result = calculateDishMargin(ingredients, 8, 149);
    expect(result.totalIngredientCost).toBe(72); // 42 + 12 + 3 + 15 = 72
    expect(result.packagingCost).toBe(8);
    expect(result.totalRecipeCost).toBe(80); // 72 + 8 = 80
    expect(result.grossProfit).toBe(69); // 149 - 80 = 69
    expect(result.grossMarginPercent).toBeCloseTo(46.3087, 3); // (69 / 149) * 100 ≈ 46.31%
    expect(result.isLoss).toBe(false);
  });

  // Test 3: Unit Conversion Weight
  it('Test 3: Weight Conversions (g vs kg)', () => {
    const ing1000g: Ingredient = { id: '1', name: 'Flour', quantity: 1000, unit: 'g', price: 280 };
    const ing500g: Ingredient = { id: '2', name: 'Flour', quantity: 500, unit: 'g', price: 280 };
    const ing250g: Ingredient = { id: '3', name: 'Flour', quantity: 250, unit: 'g', price: 280 };
    const ing05kg: Ingredient = { id: '4', name: 'Flour', quantity: 0.5, unit: 'kg', price: 280 };

    expect(calculateIngredientCost(ing1000g)).toBe(280);
    expect(calculateIngredientCost(ing500g)).toBe(140);
    expect(calculateIngredientCost(ing250g)).toBe(70);
    expect(calculateIngredientCost(ing05kg)).toBe(140);
  });

  // Test 4: Volume Conversions (ml vs litre)
  it('Test 4: Volume Conversions (ml vs litre)', () => {
    const ing1000ml: Ingredient = { id: '1', name: 'Milk', quantity: 1000, unit: 'ml', price: 150 };
    const ing500ml: Ingredient = { id: '2', name: 'Milk', quantity: 500, unit: 'ml', price: 150 };
    const ing200ml: Ingredient = { id: '3', name: 'Milk', quantity: 200, unit: 'ml', price: 150 };
    const ing1litre: Ingredient = { id: '4', name: 'Milk', quantity: 1, unit: 'litre', price: 150 };

    expect(calculateIngredientCost(ing1000ml)).toBe(150);
    expect(calculateIngredientCost(ing500ml)).toBe(75);
    expect(calculateIngredientCost(ing200ml)).toBe(30);
    expect(calculateIngredientCost(ing1litre)).toBe(150);
  });

  // Test 5: Pieces
  it('Test 5: Piece counts', () => {
    const ing: Ingredient = { id: '1', name: 'Eggs', quantity: 2, unit: 'piece', price: 12 };
    expect(calculateIngredientCost(ing)).toBe(24);
  });

  // Test 6: Loss / Negative Margin
  it('Test 6: Loss handling when Total Cost > Selling Price', () => {
    const ingredients: Ingredient[] = [
      { id: '1', name: 'Expensive Item', quantity: 1, unit: 'piece', price: 125 }
    ];

    const result = calculateDishMargin(ingredients, 0, 100);
    expect(result.totalRecipeCost).toBe(125);
    expect(result.sellingPrice).toBe(100);
    expect(result.grossProfit).toBe(-25);
    expect(result.grossMarginPercent).toBe(-25);
    expect(result.isLoss).toBe(true);
  });

  // Test 7: Zero Selling Price Handling
  it('Test 7: Zero selling price does not produce NaN or Infinity', () => {
    const ingredients: Ingredient[] = [
      { id: '1', name: 'Item', quantity: 1, unit: 'piece', price: 50 }
    ];

    const result = calculateDishMargin(ingredients, 10, 0);
    expect(result.totalRecipeCost).toBe(60);
    expect(result.sellingPrice).toBe(0);
    expect(result.grossProfit).toBe(-60);
    expect(result.grossMarginPercent).toBe(0);
    expect(Number.isNaN(result.grossMarginPercent)).toBe(false);
    expect(Number.isFinite(result.grossMarginPercent)).toBe(true);
  });

  // Test 8: Empty or invalid input fields
  it('Test 8: Handles empty or invalid inputs gracefully', () => {
    const ingredients: Ingredient[] = [
      { id: '1', name: '', quantity: '', unit: 'g', price: '' }
    ];

    const result = calculateDishMargin(ingredients, '', '');
    expect(result.totalRecipeCost).toBe(0);
    expect(result.grossProfit).toBe(0);
    expect(result.grossMarginPercent).toBe(0);
  });

  // Formatting Utilities
  it('Formatting: INR currency and percentage formatting', () => {
    expect(formatCurrency(1499)).toBe('₹1,499');
    expect(formatCurrency(125000)).toBe('₹1,25,000');
    expect(formatCurrency(-25)).toBe('-₹25');
    expect(formatPercentage(46.3087)).toBe('46.3%');
    expect(formatPercentage(-25)).toBe('-25%');
  });
});
