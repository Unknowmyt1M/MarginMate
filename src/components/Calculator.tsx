import React, { useState, useEffect } from 'react';
import { Ingredient } from '../types/calculator';
import { IngredientRow } from './IngredientRow';
import { ResultCard } from './ResultCard';
import { calculateDishMargin } from '../utils/calculator';
import { loadCalculatorState, saveCalculatorState } from '../utils/storage';
import { trackEvent } from '../utils/analytics';
import { Plus, RotateCcw, Calculator as CalcIcon } from 'lucide-react';

const DEFAULT_INGREDIENT: Ingredient = {
  id: '1',
  name: 'Chicken',
  quantity: 150,
  unit: 'g',
  price: 280,
};

export const Calculator: React.FC = () => {
  const [dishName, setDishName] = useState<string>(() => {
    const saved = loadCalculatorState();
    return saved ? saved.dishName : '';
  });

  const [ingredients, setIngredients] = useState<Ingredient[]>(() => {
    const saved = loadCalculatorState();
    if (saved && saved.ingredients && saved.ingredients.length > 0) {
      return saved.ingredients;
    }
    return [DEFAULT_INGREDIENT];
  });

  const [packagingCost, setPackagingCost] = useState<number | ''>(() => {
    const saved = loadCalculatorState();
    return saved ? saved.packagingCost : 8;
  });

  const [sellingPrice, setSellingPrice] = useState<number | ''>(() => {
    const saved = loadCalculatorState();
    return saved ? saved.sellingPrice : 149;
  });

  // Calculate live results on input changes
  const result = calculateDishMargin(ingredients, packagingCost, sellingPrice);

  // Auto save to localStorage
  useEffect(() => {
    saveCalculatorState({
      dishName,
      ingredients,
      packagingCost,
      sellingPrice,
    });
  }, [dishName, ingredients, packagingCost, sellingPrice]);

  // Track initial page view & calculations
  useEffect(() => {
    trackEvent('page_view');
  }, []);

  const handleAddIngredient = () => {
    const newIng: Ingredient = {
      id: Date.now().toString(),
      name: '',
      quantity: '',
      unit: 'g',
      price: '',
    };
    setIngredients((prev) => [...prev, newIng]);
    trackEvent('ingredient_added', { ingredientCount: ingredients.length + 1 });
  };

  const handleIngredientChange = (
    id: string,
    field: keyof Ingredient,
    value: string | number
  ) => {
    setIngredients((prev) =>
      prev.map((ing) => (ing.id === id ? { ...ing, [field]: value } : ing))
    );
  };

  const handleRemoveIngredient = (id: string) => {
    if (ingredients.length <= 1) return;
    setIngredients((prev) => prev.filter((ing) => ing.id !== id));
    trackEvent('ingredient_removed', { ingredientCount: ingredients.length - 1 });
  };

  const handleReset = () => {
    setDishName('');
    setIngredients([{
      id: Date.now().toString(),
      name: '',
      quantity: '',
      unit: 'g',
      price: '',
    }]);
    setPackagingCost('');
    setSellingPrice('');
  };

  const handleCalculateExplicit = () => {
    trackEvent('calculation_completed', {
      ingredientCount: ingredients.length,
      hasPackaging: typeof packagingCost === 'number' && packagingCost > 0,
      isProfitable: !result.isLoss,
      marginBucket: result.sellingPrice > 0 ? `${Math.floor(result.grossMarginPercent / 10) * 10}%` : '0%',
    });

    // Scroll smoothly to results card on mobile
    const resultElement = document.getElementById('result-section');
    if (resultElement) {
      resultElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Calculator Container */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-6">
        
        {/* Header & Reset */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <CalcIcon className="w-4 h-4 text-emerald-600" />
            Dish Cost Calculator
          </h2>
          <button
            type="button"
            onClick={handleReset}
            className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium transition-colors cursor-pointer px-2 py-1 rounded-md hover:bg-slate-100"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Clear All
          </button>
        </div>

        {/* Dish Name Input */}
        <div>
          <label htmlFor="dish-name" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Dish Name <span className="text-slate-400 font-normal lowercase">(optional)</span>
          </label>
          <input
            id="dish-name"
            type="text"
            value={dishName}
            onChange={(e) => setDishName(e.target.value)}
            placeholder="e.g. Special Chicken Burger, Paneer Tikka"
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white font-medium"
          />
        </div>

        {/* Ingredients Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Ingredients ({ingredients.length})
            </label>
          </div>

          <div className="space-y-3">
            {ingredients.map((ing, idx) => (
              <IngredientRow
                key={ing.id}
                ingredient={ing}
                index={idx}
                canRemove={ingredients.length > 1}
                onChange={handleIngredientChange}
                onRemove={handleRemoveIngredient}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={handleAddIngredient}
            className="w-full sm:w-auto border border-dashed border-slate-300 hover:border-emerald-500 hover:text-emerald-700 bg-slate-50/50 hover:bg-emerald-50/30 text-slate-700 font-semibold text-sm py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-emerald-600" /> Add Ingredient
          </button>
        </div>

        {/* Packaging & Selling Price Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
          {/* Packaging Cost */}
          <div>
            <label htmlFor="packaging-cost" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Packaging Cost
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">₹</span>
              <input
                id="packaging-cost"
                type="number"
                min="0"
                step="any"
                value={packagingCost}
                onChange={(e) => {
                  const val = e.target.value;
                  setPackagingCost(val === '' ? '' : parseFloat(val) || 0);
                }}
                placeholder="8"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-8 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white font-semibold"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Containers, boxes, sauce sachets, carry bags</p>
          </div>

          {/* Selling Price */}
          <div>
            <label htmlFor="selling-price" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Selling Price
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">₹</span>
              <input
                id="selling-price"
                type="number"
                min="0"
                step="any"
                value={sellingPrice}
                onChange={(e) => {
                  const val = e.target.value;
                  setSellingPrice(val === '' ? '' : parseFloat(val) || 0);
                }}
                placeholder="149"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-8 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white font-semibold"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Final menu price customer pays</p>
          </div>
        </div>

        {/* Calculate Action Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleCalculateExplicit}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-sm transition-all transform active:scale-[0.99] text-base tracking-wide cursor-pointer flex items-center justify-center gap-2"
          >
            <CalcIcon className="w-5 h-5" /> Calculate Margin
          </button>
        </div>
      </div>

      {/* Result Section */}
      <div id="result-section">
        <ResultCard dishName={dishName} result={result} />
      </div>
    </div>
  );
};
