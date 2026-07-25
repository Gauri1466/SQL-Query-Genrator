import React, { useState } from 'react';
import { QueryExplanationResponse, DatabaseType, ExcelVersion } from '../types';
import { 
  Code2, Sparkles, RefreshCw, AlertCircle, AlertTriangle, Lightbulb, 
  CheckCircle2, Copy, Check 
} from 'lucide-react';

export const ExplainQuery: React.FC = () => {
  const [queryToExplain, setQueryToExplain] = useState('');
  const [queryType, setQueryType] = useState<'SQL' | 'Excel'>('SQL');
  const [dbType, setDbType] = useState<DatabaseType>('PostgreSQL');
  const [excelVersion, setExcelVersion] = useState<ExcelVersion>('365');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<QueryExplanationResponse | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  const sampleSql = `WITH RankedOrders AS (
  SELECT 
    CustomerID,
    OrderDate,
    Amount,
    ROW_NUMBER() OVER (PARTITION BY CustomerID ORDER BY OrderDate DESC) as rn
  FROM Orders
  WHERE Status = 'Completed'
)
SELECT CustomerID, OrderDate, Amount
FROM RankedOrders
WHERE rn = 1;`;

  const sampleExcel = `=XLOOKUP(A2, Employees!A:A, Employees!C:C, "Not Found", 0)`;

  const handleExplain = async () => {
    if (!queryToExplain.trim()) {
      setError('Please paste a valid SQL query or Excel formula to explain.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: queryToExplain,
          queryType,
          dbType,
          excelVersion
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze query.');
      }

      setResult(data);
    } catch (err: any) {
      console.error('Explain error:', err);
      setError(err?.message || 'Failed to explain query. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (!queryToExplain) return;
    navigator.clipboard.writeText(queryToExplain);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-fade-in">
      
      {/* Input Box */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400">
              <Code2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Explain Existing SQL Query or Excel Formula
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Paste complex code to get a line-by-line clause breakdown, performance tips, and fixes.
              </p>
            </div>
          </div>
        </div>

        {/* Options Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* Query Type */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Code Type
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setQueryType('SQL');
                  setQueryToExplain(sampleSql);
                }}
                className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                  queryType === 'SQL'
                    ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-700 dark:text-blue-300'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                SQL Query
              </button>
              <button
                type="button"
                onClick={() => {
                  setQueryType('Excel');
                  setQueryToExplain(sampleExcel);
                }}
                className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                  queryType === 'Excel'
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                Excel Formula
              </button>
            </div>
          </div>

          {/* Engine / Version */}
          {queryType === 'SQL' ? (
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Database Engine
              </label>
              <select
                value={dbType}
                onChange={(e) => setDbType(e.target.value as DatabaseType)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="PostgreSQL">PostgreSQL</option>
                <option value="MySQL">MySQL</option>
                <option value="SQLite">SQLite</option>
                <option value="SQL Server">SQL Server</option>
                <option value="Oracle">Oracle</option>
              </select>
            </div>
          ) : (
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Excel Version
              </label>
              <select
                value={excelVersion}
                onChange={(e) => setExcelVersion(e.target.value as ExcelVersion)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="365">Excel 365</option>
                <option value="2019">Excel 2019</option>
                <option value="2016">Excel 2016</option>
              </select>
            </div>
          )}

          {/* Load Sample Button */}
          <div className="flex items-end">
            <button
              type="button"
              onClick={() => {
                setQueryToExplain(queryType === 'SQL' ? sampleSql : sampleExcel);
              }}
              className="w-full py-2.5 px-3 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-xs font-semibold hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors"
            >
              Load Sample Code
            </button>
          </div>

        </div>

        {/* Text Area */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Paste Code Below:
            </label>
            {queryToExplain && (
              <button
                type="button"
                onClick={handleCopyCode}
                className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Copied' : 'Copy input'}</span>
              </button>
            )}
          </div>
          <textarea
            value={queryToExplain}
            onChange={(e) => setQueryToExplain(e.target.value)}
            placeholder={queryType === 'SQL' ? "Paste SELECT statement or CTE..." : "Paste Excel formula like =SUMIFS(...)..."}
            rows={6}
            className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-950 text-emerald-300 placeholder-slate-500 font-mono text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs sm:text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={handleExplain}
          disabled={isLoading}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Analyzing & Deconstructing Code...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Explain Query Architecture</span>
            </>
          )}
        </button>

      </div>

      {/* Explanation Results */}
      {result && (
        <div className="space-y-6">
          
          {/* Summary Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-md space-y-3">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-base">
              <Sparkles className="w-5 h-5" />
              <span>Overview Summary</span>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {result.summary}
            </p>
          </div>

          {/* Component Breakdown List */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-md space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Clause & Component Breakdown
            </h3>
            <div className="space-y-3">
              {result.breakdown.map((item, index) => (
                <div 
                  key={index}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 space-y-1.5"
                >
                  <div className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    {item.part}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Performance & Suggestions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Performance */}
            <div className="bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-3xl p-6 space-y-2">
              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-sm">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <span>Performance Considerations</span>
              </div>
              <p className="text-xs sm:text-sm text-amber-900/90 dark:text-amber-200/90 leading-relaxed">
                {result.performance_considerations}
              </p>
            </div>

            {/* Improvements */}
            <div className="bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-3xl p-6 space-y-2">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm">
                <Lightbulb className="w-5 h-5 text-emerald-600" />
                <span>Suggested Refactorings</span>
              </div>
              <p className="text-xs sm:text-sm text-emerald-900/90 dark:text-emerald-200/90 leading-relaxed">
                {result.suggested_improvements}
              </p>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
