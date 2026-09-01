import React from 'react';
import { CalculationResult } from '../types/calculator';
import { formatCurrency, formatPercentage } from '../utils/formatting';
import { Share2, AlertTriangle, CheckCircle2, Copy, Check } from 'lucide-react';
import { trackEvent } from '../utils/analytics';

interface ResultCardProps {
  dishName: string;
  result: CalculationResult;
}

export const ResultCard: React.FC<ResultCardProps> = ({ dishName, result }) => {
  const [copied, setCopied] = React.useState(false);

  const getShareText = () => {
    const title = dishName.trim() ? dishName.trim() : 'Dish Margin';
    return `MarginMate Result\n\n${title}\nSelling Price: ${formatCurrency(result.sellingPrice)}\nTotal Cost: ${formatCurrency(result.totalRecipeCost)}\nGross Profit: ${formatCurrency(result.grossProfit)}\nGross Margin: ${formatPercentage(result.grossMarginPercent)}\n\nCalculate yours with MarginMate!`;
  };

  const handleShare = async () => {
    const shareText = getShareText();

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'MarginMate Calculation',
          text: shareText,
          url: window.location.href,
        });
        trackEvent('result_shared', { shareMethod: 'native_share', isProfitable: !result.isLoss });
        return;
      } catch (err) {
        // User cancelled or share failed, fallback to copy
        if ((err as Error).name !== 'AbortError') {
          console.log('Native share failed, falling back to clipboard');
        } else {
          return;
        }
      }
    }

    // Fallback to clipboard
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      trackEvent('result_shared', { shareMethod: 'clipboard_copy', isProfitable: !result.isLoss });
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Clipboard copy failed', err);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-md transition-all">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
        <div>
          <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">
            Calculated Result
          </span>
          <h2 className="text-lg font-bold text-slate-900 truncate max-w-xs sm:max-w-md">
            {dishName.trim() ? dishName : 'Your Dish'}
          </h2>
        </div>
        <div>
          {result.isLoss ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
              <AlertTriangle className="w-3.5 h-3.5" /> Loss-making
            </span>
          ) : result.sellingPrice > 0 ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5" /> Profitable
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
              Draft
            </span>
          )}
        </div>
      </div>

      {/* Main 3 Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {/* Total Cost */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center sm:text-left">
          <span className="text-xs font-medium text-slate-500 block mb-1">
            Total Cost
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {formatCurrency(result.totalRecipeCost)}
          </span>
          <div className="text-[11px] text-slate-400 mt-1">
            Ingredients ({formatCurrency(result.totalIngredientCost)}) + Pack ({formatCurrency(result.packagingCost)})
          </div>
        </div>

        {/* Gross Profit */}
        <div
          className={`border rounded-xl p-4 text-center sm:text-left ${
            result.isLoss
              ? 'bg-red-50/60 border-red-200 text-red-950'
              : 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
          }`}
        >
          <span
            className={`text-xs font-medium block mb-1 ${
              result.isLoss ? 'text-red-700' : 'text-emerald-700'
            }`}
          >
            Gross Profit
          </span>
          <span
            className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
              result.isLoss ? 'text-red-600' : 'text-emerald-700'
            }`}
          >
            {formatCurrency(result.grossProfit)}
          </span>
          <div
            className={`text-[11px] mt-1 font-medium ${
              result.isLoss ? 'text-red-600' : 'text-emerald-600'
            }`}
          >
            {result.isLoss
              ? `You're losing ${formatCurrency(Math.abs(result.grossProfit))} per dish`
              : `Margin per dish`}
          </div>
        </div>

        {/* Gross Margin % */}
        <div
          className={`border rounded-xl p-4 text-center sm:text-left ${
            result.isLoss
              ? 'bg-red-50/60 border-red-200 text-red-950'
              : 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
          }`}
        >
          <span
            className={`text-xs font-medium block mb-1 ${
              result.isLoss ? 'text-red-700' : 'text-emerald-700'
            }`}
          >
            Gross Margin
          </span>
          <span
            className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
              result.isLoss ? 'text-red-600' : 'text-emerald-700'
            }`}
          >
            {formatPercentage(result.grossMarginPercent)}
          </span>
          <div
            className={`text-[11px] mt-1 font-medium ${
              result.isLoss ? 'text-red-600' : 'text-emerald-600'
            }`}
          >
            {result.sellingPrice > 0 ? `of ${formatCurrency(result.sellingPrice)} price` : 'Enter selling price'}
          </div>
        </div>
      </div>

      {/* Share Button */}
      <button
        type="button"
        onClick={handleShare}
        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.99] cursor-pointer"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Result Copied to Clipboard!</span>
          </>
        ) : (
          <>
            {navigator.share ? <Share2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>Share Result</span>
          </>
        )}
      </button>
    </div>
  );
};
