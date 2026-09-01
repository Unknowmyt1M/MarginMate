import { Unit } from '../types/calculator';

/**
 * Formats a number as Indian Currency (INR / ₹)
 * Handles negative numbers nicely: -₹25
 */
export function formatCurrency(amount: number): string {
  if (Number.isNaN(amount) || !Number.isFinite(amount)) {
    return '₹0';
  }

  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);

  // Round to nearest integer if no decimals, or up to 2 decimal places if needed
  const formattedNumber = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(absAmount);

  return isNegative ? `-₹${formattedNumber}` : `₹${formattedNumber}`;
}

/**
 * Formats a number as percentage e.g. 46.3%
 */
export function formatPercentage(percent: number): string {
  if (Number.isNaN(percent) || !Number.isFinite(percent)) {
    return '0%';
  }

  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 1,
    minimumFractionDigits: 0,
  }).format(percent);

  return `${formatted}%`;
}

/**
 * Returns human readable unit price label based on selected unit
 */
export function getUnitPriceLabel(unit: Unit): string {
  switch (unit) {
    case 'g':
    case 'kg':
      return '₹/kg';
    case 'ml':
    case 'litre':
      return '₹/litre';
    case 'piece':
      return '₹/piece';
    default:
      return '₹/unit';
  }
}
