import { Ingredient } from '../types/calculator';

const STORAGE_KEY = 'marginmate_v0_state';

interface SavedState {
  dishName: string;
  ingredients: Ingredient[];
  packagingCost: number | '';
  sellingPrice: number | '';
}

export function loadCalculatorState(): SavedState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SavedState;
  } catch (err) {
    console.error('Failed to load calculator state from localStorage', err);
    return null;
  }
}

export function saveCalculatorState(state: SavedState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Failed to save calculator state to localStorage', err);
  }
}

export function clearCalculatorState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear calculator state', err);
  }
}
