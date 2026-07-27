/* agent-notes: { ctx: "Header component with search, category filter, dark mode toggle, settings modal trigger", deps: [], state: active, last: "sato@2026-07-24" } */

'use client';

import React from 'react';
import { Search, Sun, Moon, Settings, CheckSquare } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  onToggleDarkMode,
  searchQuery,
  onSearchChange,
  categories,
  selectedCategory,
  onSelectCategory,
  onOpenSettings,
}) => {
  return (
    <header className="glass-panel sticky top-0 z-30 px-4 py-3.5 rounded-2xl mb-6 flex flex-col md:flex-row items-center justify-between gap-4 transition-all">
      {/* Brand Title */}
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
          <CheckSquare className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
            Todo Pro
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Smart & Distraction-Free</p>
        </div>
      </div>

      {/* Controls & Search */}
      <div className="flex items-center gap-3 w-full md:w-auto">
        {/* Search Bar */}
        <div className="relative flex-1 md:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search tasks or tags..."
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl text-sm bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 focus:outline-none focus:ring-2 focus:ring-blue-500/40 text-slate-900 dark:text-slate-100 placeholder-slate-400"
          />
        </div>

        {/* Category Dropdown */}
        {categories.length > 0 && (
          <select
            value={selectedCategory}
            onChange={e => onSelectCategory(e.target.value)}
            className="px-3 py-2 rounded-xl text-sm bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40 cursor-pointer"
          >
            <option value="all">All Tags</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        )}

        {/* Dark Mode Toggle Button */}
        <button
          onClick={onToggleDarkMode}
          title="Toggle Light/Dark Theme"
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
        </button>

        {/* Settings Button */}
        <button
          onClick={onOpenSettings}
          title="Data Backup & Settings"
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};
