import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { QueryGenerator } from './components/QueryGenerator';
import { ExplainQuery } from './components/ExplainQuery';
import { SampleDataGenerator } from './components/SampleDataGenerator';
import { HistoryView } from './components/HistoryView';
import { HistoryItem } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'generator' | 'explain' | 'sample-data' | 'history'>('generator');
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('ai_sql_excel_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Dark mode effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Sync history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ai_sql_excel_history', JSON.stringify(history));
    } catch (e) {
      console.error('Failed to save history to localStorage', e);
    }
  }, [history]);

  const handleSaveToHistory = (item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
    const newItem: HistoryItem = {
      ...item,
      id: 'hist_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      timestamp: Date.now()
    };
    setHistory((prev) => [newItem, ...prev.slice(0, 49)]); // keep latest 50
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('ai_sql_excel_history');
    } catch {}
  };

  const handleToggleFavorite = (id: string) => {
    setHistory((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 flex flex-col font-sans">
      
      {/* Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        historyCount={history.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        
        {/* Hero Section shown on top of generator */}
        {activeTab === 'generator' && <Hero />}

        {/* Tab Content */}
        {activeTab === 'generator' && (
          <QueryGenerator onSaveToHistory={handleSaveToHistory} />
        )}

        {activeTab === 'explain' && (
          <ExplainQuery />
        )}

        {activeTab === 'sample-data' && (
          <SampleDataGenerator />
        )}

        {activeTab === 'history' && (
          <HistoryView
            history={history}
            onClearHistory={handleClearHistory}
            onToggleFavorite={handleToggleFavorite}
            onSelectHistoryItem={(item) => {
              // Could re-populate or view
            }}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} AI SQL & Excel Query Generator — Powered by Gemini 3.6 API</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>MySQL</span>
            <span>PostgreSQL</span>
            <span>SQLite</span>
            <span>Excel 365</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
