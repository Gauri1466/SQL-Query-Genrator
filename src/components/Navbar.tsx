import React from 'react';
import { Database, Table, Sparkles, HelpCircle, History, Sun, Moon, Layers, Code2 } from 'lucide-react';

interface NavbarProps {
  activeTab: 'generator' | 'explain' | 'sample-data' | 'history';
  setActiveTab: (tab: 'generator' | 'explain' | 'sample-data' | 'history') => void;
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  historyCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  darkMode,
  setDarkMode,
  historyCount
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo & Name */}
        <div 
          onClick={() => setActiveTab('generator')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 p-0.5 shadow-md group-hover:shadow-indigo-500/25 transition-all">
            <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center text-white">
              <Database className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                AI Query & Formula
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                Gemini 3.6
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              SQL Queries & Excel Formulas in Seconds
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700/60 text-sm font-medium">
          <button
            id="tab-generator"
            onClick={() => setActiveTab('generator')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === 'generator'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4 text-blue-500" />
            <span>Generator</span>
          </button>

          <button
            id="tab-explain"
            onClick={() => setActiveTab('explain')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === 'explain'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Code2 className="w-4 h-4 text-indigo-500" />
            <span>Explain Query</span>
          </button>

          <button
            id="tab-sample-data"
            onClick={() => setActiveTab('sample-data')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === 'sample-data'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Table className="w-4 h-4 text-emerald-500" />
            <span>Sample Data</span>
          </button>

          <button
            id="tab-history"
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all relative ${
              activeTab === 'history'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <History className="w-4 h-4 text-purple-500" />
            <span>History</span>
            {historyCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 text-[11px] rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300 font-bold">
                {historyCount}
              </span>
            )}
          </button>
        </nav>

        {/* Right Action Items */}
        <div className="flex items-center gap-2">
          {/* Dark mode toggle */}
          <button
            id="toggle-dark-mode"
            onClick={() => setDarkMode(!darkMode)}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>
        </div>
      </div>

      {/* Mobile Tab Navigation */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 bg-slate-50 dark:bg-slate-900 text-xs">
        <button
          onClick={() => setActiveTab('generator')}
          className={`flex flex-col items-center gap-1 p-2 rounded-lg ${
            activeTab === 'generator' ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Generator</span>
        </button>
        <button
          onClick={() => setActiveTab('explain')}
          className={`flex flex-col items-center gap-1 p-2 rounded-lg ${
            activeTab === 'explain' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>Explain</span>
        </button>
        <button
          onClick={() => setActiveTab('sample-data')}
          className={`flex flex-col items-center gap-1 p-2 rounded-lg ${
            activeTab === 'sample-data' ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <Table className="w-4 h-4" />
          <span>Sample Data</span>
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex flex-col items-center gap-1 p-2 rounded-lg relative ${
            activeTab === 'history' ? 'text-purple-600 dark:text-purple-400 font-semibold' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <History className="w-4 h-4" />
          <span>History ({historyCount})</span>
        </button>
      </div>
    </header>
  );
};
