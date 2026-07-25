import React, { useState } from 'react';
import { GenerationResponse, QueryMode, DatabaseType, ExcelVersion } from '../types';
import { 
  Copy, Check, Download, AlertTriangle, Lightbulb, ChevronDown, ChevronUp, 
  Code, FileSpreadsheet, Sparkles, Star, CheckCircle2
} from 'lucide-react';

interface OutputCardsProps {
  result: GenerationResponse;
  mode: QueryMode;
  dbType: DatabaseType;
  excelVersion: ExcelVersion;
  onToggleFavorite?: () => void;
  isFavorite?: boolean;
}

export const OutputCards: React.FC<OutputCardsProps> = ({
  result,
  mode,
  dbType,
  excelVersion,
  onToggleFavorite,
  isFavorite
}) => {
  const [copiedSql, setCopiedSql] = useState(false);
  const [copiedExcel, setCopiedExcel] = useState(false);
  const [showExplanation, setShowExplanation] = useState(true);

  const handleCopySql = () => {
    if (!result.sql_query) return;
    navigator.clipboard.writeText(result.sql_query);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const handleCopyExcel = () => {
    if (!result.excel_formula) return;
    navigator.clipboard.writeText(result.excel_formula);
    setCopiedExcel(true);
    setTimeout(() => setCopiedExcel(false), 2000);
  };

  const handleDownloadSql = () => {
    if (!result.sql_query) return;
    const blob = new Blob([result.sql_query], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `query_${dbType.toLowerCase().replace(/\s+/g, '')}.sql`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadExcel = () => {
    if (!result.excel_formula) return;
    const blob = new Blob([result.excel_formula], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `formula_excel${excelVersion}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const showSql = mode === 'SQL' || mode === 'Both';
  const showExcel = mode === 'Excel' || mode === 'Both';

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Top Banner Actions (Favorite Star) */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-500" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Generated Output
          </h2>
        </div>
        {onToggleFavorite && (
          <button
            onClick={onToggleFavorite}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              isFavorite
                ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300'
            }`}
          >
            <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
            <span>{isFavorite ? 'Saved to Favorites' : 'Bookmark Query'}</span>
          </button>
        )}
      </div>

      {/* Card 1: SQL Query */}
      {showSql && (
        <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden transition-all">
          {/* Header */}
          <div className="px-5 py-3.5 bg-slate-800/80 border-b border-slate-700/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Code className="w-4 h-4 text-blue-400" />
              <span className="font-semibold text-sm text-slate-100">SQL Query</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800/60">
                {dbType}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopySql}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors"
                title="Copy SQL Query"
              >
                {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSql ? 'Copied!' : 'Copy'}</span>
              </button>
              <button
                onClick={handleDownloadSql}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white transition-colors"
                title="Download .sql file"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .sql</span>
              </button>
            </div>
          </div>

          {/* Code Body */}
          <div className="p-5 font-mono text-sm text-blue-300/90 leading-relaxed overflow-x-auto whitespace-pre-wrap bg-slate-950/80 select-all">
            {result.sql_query || '-- No SQL generated for this mode.'}
          </div>
        </div>
      )}

      {/* Card 2: Excel Formula */}
      {showExcel && (
        <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden transition-all">
          {/* Header */}
          <div className="px-5 py-3.5 bg-slate-800/80 border-b border-slate-700/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span className="font-semibold text-sm text-slate-100">Excel Formula</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60">
                Excel {excelVersion}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyExcel}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors"
                title="Copy Excel Formula"
              >
                {copiedExcel ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedExcel ? 'Copied!' : 'Copy'}</span>
              </button>
              <button
                onClick={handleDownloadExcel}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                title="Download formula file"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
            </div>
          </div>

          {/* Code Body */}
          <div className="p-5 font-mono text-sm text-emerald-300/90 leading-relaxed overflow-x-auto whitespace-pre-wrap bg-slate-950/80 select-all">
            {result.excel_formula || '= N/A'}
          </div>
        </div>
      )}

      {/* Card 3: Explanation (Collapsible Panel) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md overflow-hidden transition-all">
        <button
          onClick={() => setShowExplanation(!showExplanation)}
          className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Step-by-Step Explanation
            </h3>
          </div>
          {showExplanation ? (
            <ChevronUp className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          )}
        </button>

        {showExplanation && (
          <div className="px-5 pb-5 pt-1 text-slate-700 dark:text-slate-300 text-sm leading-relaxed border-t border-slate-100 dark:border-slate-800/80">
            <div className="mt-2 space-y-2 whitespace-pre-wrap">
              {result.explanation}
            </div>
          </div>
        )}
      </div>

      {/* Grid for Mistakes & Optimizations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Card 4: Common Mistake (Warning Card) */}
        <div className="bg-amber-50/70 dark:bg-amber-950/30 rounded-2xl border border-amber-200 dark:border-amber-800/60 p-5 space-y-2">
          <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-sm">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>Common Mistake to Avoid</span>
          </div>
          <p className="text-xs sm:text-sm text-amber-900/90 dark:text-amber-200/90 leading-relaxed">
            {result.common_mistake || 'Always make sure column data types match and watch out for NULL values.'}
          </p>
        </div>

        {/* Card 5: Optimization Tip (Success Card) */}
        <div className="bg-emerald-50/70 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 p-5 space-y-2">
          <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm">
            <Lightbulb className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Optimization Tip</span>
          </div>
          <p className="text-xs sm:text-sm text-emerald-900/90 dark:text-emerald-200/90 leading-relaxed">
            {result.optimization_tip || 'Ensure appropriate indexes exist on filtered and joined columns for optimal speed.'}
          </p>
        </div>

      </div>

    </div>
  );
};
