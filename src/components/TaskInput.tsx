/* agent-notes: { ctx: "Quick Task Input form component with priority, date, time, reminder and recurrence controls", deps: [src/types/todo.ts], state: active, last: "sato@2026-07-24" } */

'use client';

import React, { useState } from 'react';
import { Priority, RecurrencePattern } from '../types/todo';
import { Plus, Calendar, Clock, Bell, Repeat, Tag, Sparkles } from 'lucide-react';
import { NewTaskInput } from '../hooks/useTasks';

interface TaskInputProps {
  onAddTask: (input: NewTaskInput) => void;
}

export const TaskInput: React.FC<TaskInputProps> = ({ onAddTask }) => {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('P2');
  const [category, setCategory] = useState('General');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [recurrence, setRecurrence] = useState<RecurrencePattern>('none');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTask({
      title,
      priority,
      category: category.trim() || 'General',
      dueDate: dueDate || undefined,
      dueTime: dueTime || undefined,
      reminderEnabled,
      recurrence,
    });

    // Reset form
    setTitle('');
    setDueDate('');
    setDueTime('');
    setReminderEnabled(false);
    setRecurrence('none');
    setIsExpanded(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-panel p-4 rounded-2xl mb-6 shadow-md transition-all border border-blue-500/20"
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm">
          <Sparkles className="w-4 h-4" />
        </div>
        <input
          type="text"
          placeholder="Add a new task... (press Enter to save)"
          value={title}
          onChange={e => setTitle(e.target.value)}
          onFocus={() => setIsExpanded(true)}
          className="w-full bg-transparent text-base font-medium focus:outline-none text-slate-900 dark:text-slate-100 placeholder-slate-400"
        />
        <button
          type="submit"
          disabled={!title.trim()}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-sm shadow-md shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add</span>
        </button>
      </div>

      {/* Expanded Controls */}
      {isExpanded && (
        <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Priority Pill Selectors */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 dark:text-slate-400 font-medium mr-1">Priority:</span>
            {(['P1', 'P2', 'P3'] as Priority[]).map(p => {
              const active = priority === p;
              const colorMap = {
                P1: 'bg-red-500/10 text-red-600 border-red-500/30',
                P2: 'bg-amber-500/10 text-amber-600 border-amber-500/30',
                P3: 'bg-blue-500/10 text-blue-600 border-blue-500/30',
              };
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`px-2.5 py-1 rounded-lg font-bold border transition-all ${colorMap[p]} ${
                    active ? 'ring-2 ring-blue-500/50 scale-105 shadow-sm' : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>

          {/* Date & Time Input */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg text-slate-700 dark:text-slate-300">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="bg-transparent focus:outline-none cursor-pointer"
              />
            </div>

            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg text-slate-700 dark:text-slate-300">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="time"
                value={dueTime}
                onChange={e => setDueTime(e.target.value)}
                className="bg-transparent focus:outline-none cursor-pointer"
              />
            </div>
          </div>

          {/* Category Input */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg text-slate-700 dark:text-slate-300">
            <Tag className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Tag (e.g. Work)"
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-24 bg-transparent focus:outline-none placeholder-slate-400"
            />
          </div>

          {/* Recurrence Dropdown */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg text-slate-700 dark:text-slate-300">
            <Repeat className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={recurrence}
              onChange={e => setRecurrence(e.target.value as RecurrencePattern)}
              className="bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="none">No Repeat</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          {/* Reminder Toggle */}
          <button
            type="button"
            onClick={() => setReminderEnabled(!reminderEnabled)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium border transition-all ${
              reminderEnabled
                ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-transparent opacity-60'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Reminder</span>
          </button>
        </div>
      )}
    </form>
  );
};
