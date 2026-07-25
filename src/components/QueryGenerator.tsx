import React, { useState } from 'react';
import { 
  QueryMode, DatabaseType, ExcelVersion, GenerationResponse, HistoryItem 
} from '../types';
import { EXAMPLE_PROMPTS } from '../data/examplePrompts';
import { SchemaSelector } from './SchemaSelector';
import { OutputCards } from './OutputCards';
import { 
  Sparkles, Database, FileSpreadsheet, Layers, RefreshCw, AlertCircle, 
  BookOpen, ChevronRight, Wand2
} from 'lucide-react';

interface QueryGeneratorProps {
  onSaveToHistory: (item: Omit<HistoryItem, 'id' | 'timestamp'>) => void;
}

export const QueryGenerator: React.FC<QueryGeneratorProps> = ({ onSaveToHistory }) => {
  const [userQuery, setUserQuery] = useState('');
  const [schemaText, setSchemaText] = useState('');
  const [mode, setMode] = useState<QueryMode>('Both');
  const [dbType, setDbType] = useState<DatabaseType>('PostgreSQL');
  const [excelVersion, setExcelVersion] = useState<ExcelVersion>('365');
  const [language, setLanguage] = useState('English');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GenerationResponse | null>(null);
  const [isSchemaModalOpen, setIsSchemaModalOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleSelectExamplePrompt = (example: typeof EXAMPLE_PROMPTS[0]) => {
    setUserQuery(example.query);
    setMode(example.mode);
    setError(null);
  };

  const handleGenerate = async () => {
    if (!userQuery.trim()) {
      setError('Please enter a query description in plain English.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setIsFavorite(false);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userQuery,
          schema: schemaText,
          mode,
          dbType,
          excelVersion,
          language
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate query');
      }

      setResult(data);

      // Save to local history
      onSaveToHistory({
        userQuery,
        schema: schemaText,
        mode,
        dbType,
        excelVersion,
        result: data,
        isFavorite: false
      });

    } catch (err: any) {
      console.error('Generation error:', err);
      setError(err?.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Schema Picker Modal */}
      <SchemaSelector
        isOpen={isSchemaModalOpen}
        onClose={() => setIsSchemaModalOpen(false)}
        onSelectSchema={(s) => setSchemaText(s)}
      />

      {/* Main Input Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        
        {/* Section 1: Query Input */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-base">
              <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span>Describe What You Want in Plain English</span>
            </label>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Required
            </span>
          </div>

          <textarea
            id="input-user-query"
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            placeholder="Example: Find total sales by region for the last 30 days and rank top 3 customers..."
            rows={3}
            className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm leading-relaxed transition-all resize-y"
          />

          {/* Quick Example Prompts Chips */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Quick Examples:
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {EXAMPLE_PROMPTS.map((ex) => (
                <button
                  key={ex.id}
                  onClick={() => handleSelectExamplePrompt(ex)}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 border border-slate-200 dark:border-slate-700/80 transition-all text-left flex items-center gap-1.5"
                >
                  <span>{ex.title}</span>
                  {ex.badge && (
                    <span className="px-1.5 py-0.2 text-[9px] rounded-md bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-semibold">
                      {ex.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Section 2: Schema / Table Structure */}
        <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-base">
              <Database className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>Table Schema / Column List</span>
              <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                (Optional, but recommended)
              </span>
            </label>

            <button
              id="btn-open-schema-modal"
              type="button"
              onClick={() => setIsSchemaModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Use 15 Built-in Schemas</span>
            </button>
          </div>

          <textarea
            id="input-schema"
            value={schemaText}
            onChange={(e) => setSchemaText(e.target.value)}
            placeholder={`Table: Orders\nOrderID\nCustomerID\nOrderDate\nRegion\nAmount\nStatus`}
            rows={4}
            className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-xs leading-relaxed transition-all resize-y"
          />
        </div>

        {/* Section 3: Mode Selection */}
        <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <label className="block font-bold text-slate-900 dark:text-white text-sm">
            Output Mode Selection
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'SQL', label: 'SQL Query', icon: Database },
              { id: 'Excel', label: 'Excel Formula', icon: FileSpreadsheet },
              { id: 'Both', label: 'Both (SQL + Excel)', icon: Layers }
            ].map(({ id, label, icon: Icon }) => (
              <label
                key={id}
                className={`flex items-center justify-center gap-2.5 p-3 rounded-2xl border cursor-pointer transition-all font-semibold text-xs sm:text-sm ${
                  mode === id
                    ? 'border-blue-600 dark:border-blue-500 bg-blue-50/80 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 shadow-sm'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <input
                  type="radio"
                  name="mode-select"
                  value={id}
                  checked={mode === id}
                  onChange={() => setMode(id as QueryMode)}
                  className="sr-only"
                />
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Section 4: Advanced Options */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
          {/* Database Type */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Database Engine
            </label>
            <select
              id="select-db-type"
              value={dbType}
              onChange={(e) => setDbType(e.target.value as DatabaseType)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="PostgreSQL">PostgreSQL</option>
              <option value="MySQL">MySQL</option>
              <option value="SQLite">SQLite</option>
              <option value="SQL Server">SQL Server (T-SQL)</option>
              <option value="Oracle">Oracle PL/SQL</option>
            </select>
          </div>

          {/* Excel Version */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Excel Version
            </label>
            <select
              id="select-excel-version"
              value={excelVersion}
              onChange={(e) => setExcelVersion(e.target.value as ExcelVersion)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="365">Excel 365 (XLOOKUP, FILTER, LET)</option>
              <option value="2019">Excel 2019</option>
              <option value="2016">Excel 2016 (VLOOKUP, INDEX+MATCH)</option>
            </select>
          </div>

          {/* Explanation Language */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Explanation Language
            </label>
            <select
              id="select-language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="German">German</option>
            </select>
          </div>
        </div>

        {/* Error Callout */}
        {error && (
          <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs sm:text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold">Generation Failed</span>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Generate Button */}
        <button
          id="btn-generate"
          onClick={handleGenerate}
          disabled={isLoading}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white font-bold text-base shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/35 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Analyzing Prompt & Generating Query...</span>
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <span>Generate SQL Query & Excel Formula</span>
            </>
          )}
        </button>

      </div>

      {/* Output Results Section */}
      {result && (
        <OutputCards
          result={result}
          mode={mode}
          dbType={dbType}
          excelVersion={excelVersion}
          isFavorite={isFavorite}
          onToggleFavorite={() => setIsFavorite(!isFavorite)}
        />
      )}

    </div>
  );
};
