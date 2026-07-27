/* agent-notes: { ctx: "Filter bar tabs for All, Today, Upcoming, and Completed tasks", deps: [src/types/todo.ts], state: active, last: "sato@2026-07-24" } */

'use client';

import React from 'react';
import { FilterStatus, Task } from '../types/todo';
import { ListTodo, Calendar, Clock, CheckCircle2 } from 'lucide-react';

interface FilterBarProps {
  currentFilter: FilterStatus;
  onFilterChange: (status: FilterStatus) => void;
  tasks: Task[];
}

export const FilterBar: React.FC<FilterBarProps> = ({ currentFilter, onFilterChange, tasks }) => {
  const todayStr = new Date().toISOString().slice(0, 10);

  const counts = {
    all: tasks.filter(t => !t.completed).length,
    today: tasks.filter(t => !t.completed && t.dueDate === todayStr).length,
    upcoming: tasks.filter(t => !t.completed && !!t.dueDate && t.dueDate > todayStr).length,
    completed: tasks.filter(t => t.completed).length,
  };

  const tabs: { id: FilterStatus; label: string; icon: React.ReactNode; count: number }[] = [
    { id: 'all', label: 'All Tasks', icon: <ListTodo className="w-4 h-4" />, count: counts.all },
    { id: 'today', label: 'Today', icon: <Calendar className="w-4 h-4" />, count: counts.today },
    { id: 'upcoming', label: 'Upcoming', icon: <Clock className="w-4 h-4" />, count: counts.upcoming },
    { id: 'completed', label: 'Completed', icon: <CheckCircle2 className="w-4 h-4" />, count: counts.completed },
  ];

  return (
    <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-200/50 dark:bg-slate-900/50 backdrop-blur-md mb-6 overflow-x-auto">
      {tabs.map(tab => {
        const isActive = currentFilter === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onFilterChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
              isActive
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/40 dark:hover:bg-slate-800/40'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            <span
              className={`ml-1 px-2 py-0.5 text-xs rounded-full ${
                isActive
                  ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                  : 'bg-slate-300/50 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
