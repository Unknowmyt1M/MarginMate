import React from 'react';
import { Ingredient, Unit } from '../types/calculator';
import { getUnitPriceLabel, formatCurrency } from '../utils/formatting';
import { calculateIngredientCost } from '../utils/calculator';
import { Trash2 } from 'lucide-react';

interface IngredientRowProps {
  ingredient: Ingredient;
  index: number;
  canRemove: boolean;
  onChange: (id: string, field: keyof Ingredient, value: string | number) => void;
  onRemove: (id: string) => void;
}

export const IngredientRow: React.FC<IngredientRowProps> = ({
  ingredient,
  index,
  canRemove,
  onChange,
  onRemove,
}) => {
  const cost = calculateIngredientCost(ingredient);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '') {
      onChange(ingredient.id, 'quantity', '');
    } else {
      const num = parseFloat(val);
      onChange(ingredient.id, 'quantity', isNaN(num) ? '' : num);
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '') {
      onChange(ingredient.id, 'price', '');
    } else {
      const num = parseFloat(val);
      onChange(ingredient.id, 'price', isNaN(num) ? '' : num);
    }
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 sm:p-4 space-y-3 transition-all hover:border-slate-300">
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={`ing-name-${ingredient.id}`} className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Ingredient #{index + 1}
        </label>
        {canRemove && (
          <button
            type="button"
            onClick={() => onRemove(ingredient.id)}
            className="text-slate-400 hover:text-red-600 transition-colors p-1 rounded-lg hover:bg-red-50 focus:outline-hidden focus:ring-2 focus:ring-red-500"
            title="Remove ingredient"
            aria-label={`Remove ingredient ${ingredient.name || index + 1}`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Ingredient Name */}
      <div>
        <input
          id={`ing-name-${ingredient.id}`}
          type="text"
          value={ingredient.name}
          onChange={(e) => onChange(ingredient.id, 'name', e.target.value)}
          placeholder="e.g. Chicken, Cheese, Sauce"
          className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium"
        />
      </div>

      {/* Quantity, Unit, Price Grid */}
      <div className="grid grid-cols-12 gap-2 sm:gap-3 items-end">
        {/* Quantity */}
        <div className="col-span-4 sm:col-span-4">
          <label htmlFor={`ing-qty-${ingredient.id}`} className="block text-xs text-slate-600 font-medium mb-1">
            Quantity
          </label>
          <input
            id={`ing-qty-${ingredient.id}`}
            type="number"
            min="0"
            step="any"
            value={ingredient.quantity}
            onChange={handleQuantityChange}
            placeholder="150"
            className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium"
          />
        </div>

        {/* Unit */}
        <div className="col-span-4 sm:col-span-3">
          <label htmlFor={`ing-unit-${ingredient.id}`} className="block text-xs text-slate-600 font-medium mb-1">
            Unit
          </label>
          <select
            id={`ing-unit-${ingredient.id}`}
            value={ingredient.unit}
            onChange={(e) => onChange(ingredient.id, 'unit', e.target.value as Unit)}
            className="w-full bg-white border border-slate-300 rounded-lg px-2 sm:px-3 py-2 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium cursor-pointer"
          >
            <optgroup label="Weight">
              <option value="g">g</option>
              <option value="kg">kg</option>
            </optgroup>
            <optgroup label="Volume">
              <option value="ml">ml</option>
              <option value="litre">litre</option>
            </optgroup>
            <optgroup label="Count">
              <option value="piece">piece</option>
            </optgroup>
          </select>
        </div>

        {/* Price */}
        <div className="col-span-4 sm:col-span-5">
          <label htmlFor={`ing-price-${ingredient.id}`} className="block text-xs text-slate-600 font-medium mb-1 truncate">
            Price ({getUnitPriceLabel(ingredient.unit)})
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">₹</span>
            <input
              id={`ing-price-${ingredient.id}`}
              type="number"
              min="0"
              step="any"
              value={ingredient.price}
              onChange={handlePriceChange}
              placeholder="280"
              className="w-full bg-white border border-slate-300 rounded-lg pl-7 pr-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium"
            />
          </div>
        </div>
      </div>

      {/* Item Calculated Cost Summary */}
      {cost > 0 && (
        <div className="text-right text-xs text-slate-600 font-medium pt-1">
          Item cost: <span className="text-slate-900 font-bold">{formatCurrency(cost)}</span>
        </div>
      )}
    </div>
  );
};
