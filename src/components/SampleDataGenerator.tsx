import React, { useState } from 'react';
import { SampleDataResponse } from '../types';
import { SchemaSelector } from './SchemaSelector';
import { 
  Table, Sparkles, Download, RefreshCw, AlertCircle, BookOpen, Copy, Check 
} from 'lucide-react';

export const SampleDataGenerator: React.FC = () => {
  const [schemaText, setSchemaText] = useState(`Table: Orders\nOrderID (INT)\nCustomerName (VARCHAR)\nOrderDate (DATE)\nRegion (VARCHAR)\nAmount (DECIMAL)\nStatus (VARCHAR)`);
  const [rowCount, setRowCount] = useState<number>(10);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dataResult, setDataResult] = useState<SampleDataResponse | null>(null);
  const [isSchemaModalOpen, setIsSchemaModalOpen] = useState(false);
  const [copiedCell, setCopiedCell] = useState<string | null>(null);

  const handleGenerateData = async () => {
    if (!schemaText.trim()) {
      setError('Please provide a table schema or column list.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/sample-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schema: schemaText,
          rowCount
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate sample data.');
      }

      setDataResult(data);
    } catch (err: any) {
      console.error('Sample data error:', err);
      setError(err?.message || 'Failed to generate data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadCsv = () => {
    if (!dataResult || !dataResult.columns.length || !dataResult.rows.length) return;

    const headers = dataResult.columns.join(',');
    const csvRows = dataResult.rows.map(row => {
      return dataResult.columns.map(col => {
        const val = row[col];
        if (val === null || val === undefined) return '""';
        const stringVal = String(val).replace(/"/g, '""');
        return `"${stringVal}"`;
      }).join(',');
    });

    const csvContent = [headers, ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sample_data_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyValue = (val: any) => {
    const strVal = String(val);
    navigator.clipboard.writeText(strVal);
    setCopiedCell(strVal);
    setTimeout(() => setCopiedCell(null), 1500);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-fade-in">
      
      {/* Schema Modal */}
      <SchemaSelector
        isOpen={isSchemaModalOpen}
        onClose={() => setIsSchemaModalOpen(false)}
        onSelectSchema={(s) => setSchemaText(s)}
      />

      {/* Input Form */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400">
              <Table className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Generate Realistic Sample Data
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Input any schema to auto-generate mock records with CSV export support.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsSchemaModalOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Select Preset Schema</span>
          </button>
        </div>

        {/* Textarea for Schema */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Table Schema or Column Names
            </label>
            <button
              type="button"
              onClick={() => setIsSchemaModalOpen(true)}
              className="sm:hidden text-xs text-emerald-600 dark:text-emerald-400 font-semibold"
            >
              Preset Schemas
            </button>
          </div>
          <textarea
            value={schemaText}
            onChange={(e) => setSchemaText(e.target.value)}
            placeholder={`Table: CustomerOrders\nOrderID (INT)\nCustomerName (VARCHAR)\nAmount (DECIMAL)\nDate (DATE)...`}
            rows={4}
            className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder-slate-400 font-mono text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Row count selector */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Number of Rows:
            </label>
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              {[5, 10, 15, 20].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setRowCount(num)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    rowCount === num
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {num} Rows
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs sm:text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Generate Button */}
        <button
          onClick={handleGenerateData}
          disabled={isLoading}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Generating Mock Dataset...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Generate Mock Data Table</span>
            </>
          )}
        </button>

      </div>

      {/* Generated Data Grid */}
      {dataResult && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Generated Sample Dataset ({dataResult.rows.length} records)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Click any cell to copy value to clipboard
              </p>
            </div>

            <button
              onClick={handleDownloadCsv}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download CSV</span>
            </button>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 max-h-[60vh]">
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead className="bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 uppercase tracking-wider sticky top-0 z-10">
                <tr>
                  <th className="p-3 border-b border-slate-200 dark:border-slate-700 w-12 text-center text-[10px] text-slate-400">
                    #
                  </th>
                  {dataResult.columns.map((col) => (
                    <th key={col} className="p-3 border-b border-slate-200 dark:border-slate-700 whitespace-nowrap">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {dataResult.rows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-3 text-center text-[10px] text-slate-400 font-sans">
                      {idx + 1}
                    </td>
                    {dataResult.columns.map((col) => {
                      const val = row[col];
                      const displayVal = val === null || val === undefined ? 'NULL' : String(val);
                      return (
                        <td
                          key={col}
                          onClick={() => handleCopyValue(displayVal)}
                          className="p-3 whitespace-nowrap text-slate-800 dark:text-slate-200 cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors relative group"
                          title="Click to copy"
                        >
                          <span>{displayVal}</span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

    </div>
  );
};
