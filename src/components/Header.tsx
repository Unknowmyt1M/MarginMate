import React from 'react';
import { Utensils } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-xs">
      <div className="max-w-3xl mx-auto px-4 py-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm font-bold text-xl">
            <Utensils className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-none">
              MarginMate
            </h1>
            <p className="text-xs font-medium text-emerald-700 mt-1">
              Know your food. Know your margin.
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
