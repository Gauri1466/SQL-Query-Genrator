import React from 'react';
import { Sparkles, Database, FileSpreadsheet, Zap } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <div className="relative overflow-hidden py-10 sm:py-14 px-4 sm:px-6 lg:px-8 text-center bg-gradient-to-b from-blue-50/60 via-indigo-50/30 to-transparent dark:from-slate-900/90 dark:via-slate-900/40 dark:to-transparent rounded-3xl border border-blue-100/50 dark:border-slate-800 my-4 max-w-7xl mx-auto shadow-sm">
      {/* Subtle Background Glow Decorative Blobs */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-400/10 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -left-20 w-72 h-72 bg-purple-400/10 dark:bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto space-y-4">
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white dark:bg-slate-800/90 border border-indigo-200/80 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 shadow-sm">
          <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span>Powered by Gemini 3.6 Flash & Multi-Dialect AI Engine</span>
        </div>

        {/* Main Title */}
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
          AI SQL & Excel Query Generator
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Convert natural language into production-ready <span className="font-semibold text-blue-600 dark:text-blue-400">SQL queries</span> and <span className="font-semibold text-emerald-600 dark:text-emerald-400">Excel formulas</span> instantly using AI.
        </p>

        {/* Features Chips */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs font-medium text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/80 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700">
            <Database className="w-3.5 h-3.5 text-blue-500" />
            <span>MySQL, Postgres, SQLite, SQL Server, Oracle</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/80 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700">
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
            <span>Excel 365, 2019, 2016 Formulas</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/80 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700">
            <Sparkles className="w-3.5 h-3.5 text-purple-500" />
            <span>Code + Explanations + Mistakes + Optimizations</span>
          </div>
        </div>
      </div>
    </div>
  );
};
