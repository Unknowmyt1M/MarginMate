import React from 'react';
import { Header } from './components/Header';
import { Calculator } from './components/Calculator';

export const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <div>
        <Header />

        <main className="max-w-3xl mx-auto px-4 py-6 sm:px-6 space-y-6">
          {/* Landing / Value Prop Headline */}
          <div className="text-center sm:text-left space-y-1.5 py-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Know your food. Know your margin.
            </h2>
            <p className="text-slate-600 text-sm sm:text-base font-medium">
              Calculate the real cost and gross margin of any dish in seconds.
            </p>
          </div>

          {/* Calculator Interface */}
          <Calculator />
        </main>
      </div>

      {/* Footnote */}
      <footer className="border-t border-slate-200 py-6 bg-white mt-12">
        <div className="max-w-3xl mx-auto px-4 text-center text-xs text-slate-500 font-medium">
          MarginMate V0 — Simple dish-costing for food businesses in India.
        </div>
      </footer>
    </div>
  );
};

export default App;
