import React, { useState } from 'react';
import { HistoryItem } from '../types';
import { OutputCards } from './OutputCards';
import { 
  History, Search, Trash2, Star, Sparkles, Database, FileSpreadsheet, 
  Clock, ChevronRight, X 
} from 'lucide-react';

interface HistoryViewProps {
  history: HistoryItem[];
  onClearHistory: () => void;
  onToggleFavorite: (id: string) => void;
  onSelectHistoryItem: (item: HistoryItem) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  history,
  onClearHistory,
  onToggleFavorite,
  onSelectHistoryItem
}) => {
  const [search, setSearch] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);

  const filteredHistory = history.filter((item) => {
    const matchesSearch = item.userQuery.toLowerCase().includes(search.toLowerCase()) ||
      (item.schema && item.schema.toLowerCase().includes(search.toLowerCase())) ||
      item.dbType.toLowerCase().includes(search.toLowerCase());
    const matchesFavorite = !showFavoritesOnly || item.isFavorite;
    return matchesSearch && matchesFavorite;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in">
      
      {/* Header Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400">
              <History className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Query History & Favorites ({history.length})
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Browse, search, or restore previously generated SQL queries and Excel formulas
              </p>
            </div>
          </div>

          {history.length > 0 && (
            <button
              onClick={onClearHistory}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 hover:bg-red-100 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear History</span>
            </button>
          )}
        </div>

        {/* Search & Filter bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search previous queries..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-xs font-semibold transition-all w-full sm:w-auto justify-center ${
              showFavoritesOnly
                ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 shadow-sm'
                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Star className={`w-4 h-4 ${showFavoritesOnly ? 'fill-amber-400 text-amber-400' : ''}`} />
            <span>Favorites Only</span>
          </button>

        </div>

      </div>

      {/* Main Grid or Detail View */}
      {selectedItem ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
              <span>Selected Query: "{selectedItem.userQuery}"</span>
            </div>
            <button
              onClick={() => setSelectedItem(null)}
              className="flex items-center gap-1 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            >
              <X className="w-4 h-4" />
              <span>Back to List</span>
            </button>
          </div>

          <OutputCards
            result={selectedItem.result}
            mode={selectedItem.mode}
            dbType={selectedItem.dbType}
            excelVersion={selectedItem.excelVersion}
            isFavorite={selectedItem.isFavorite}
            onToggleFavorite={() => onToggleFavorite(selectedItem.id)}
          />
        </div>
      ) : (
        <div className="space-y-3">
          {filteredHistory.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-purple-500/80 transition-all shadow-sm hover:shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-slate-900 dark:text-white text-sm">
                    "{item.userQuery}"
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-semibold">
                    {item.mode}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                    {item.dbType}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(item.timestamp).toLocaleString()}
                  </span>
                  {item.schema && (
                    <span className="line-clamp-1 italic text-slate-400">
                      Schema: {item.schema.slice(0, 40)}...
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => onToggleFavorite(item.id)}
                  className={`p-2 rounded-xl border transition-colors ${
                    item.isFavorite
                      ? 'bg-amber-50 dark:bg-amber-950 border-amber-300 dark:border-amber-700 text-amber-500'
                      : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                  }`}
                  title={item.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <Star className={`w-4 h-4 ${item.isFavorite ? 'fill-amber-400' : ''}`} />
                </button>

                <button
                  onClick={() => setSelectedItem(item)}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-colors"
                >
                  <span>View Details</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {filteredHistory.length === 0 && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center text-slate-400 space-y-3">
              <History className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600" />
              <p className="text-sm font-medium">
                {history.length === 0
                  ? 'No query history yet. Generate queries in the Generator tab to see them here!'
                  : 'No queries match your search filter.'}
              </p>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
