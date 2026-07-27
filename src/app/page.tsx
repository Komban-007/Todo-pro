/* agent-notes: { ctx: "Main Todo Pro page integrating header, filter bar, task input, task list, and settings modal", deps: [src/hooks/useTasks.ts, src/components/Header.tsx, src/components/FilterBar.tsx, src/components/TaskInput.tsx, src/components/TaskList.tsx, src/components/SettingsModal.tsx, src/utils/notifications.ts], state: active, last: "sato@2026-07-24" } */

'use client';

import React, { useState, useEffect } from 'react';
import { useTasks } from '../hooks/useTasks';
import { Header } from '../components/Header';
import { FilterBar } from '../components/FilterBar';
import { TaskInput } from '../components/TaskInput';
import { TaskList } from '../components/TaskList';
import { SettingsModal } from '../components/SettingsModal';
import { checkOverdueReminders, sendNotification } from '../utils/notifications';
import { AlertCircle, X } from 'lucide-react';

export default function Home() {
  const {
    tasks,
    filteredTasks,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    categories,
    addTask,
    updateTask,
    toggleTask,
    deleteTask,
    reorderTasks,
    replaceAllTasks,
  } = useTasks();

  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [overdueAlerts, setOverdueAlerts] = useState<number>(0);
  const [showAlertBanner, setShowAlertBanner] = useState<boolean>(false);

  // Initialize theme from saved preference or system mode
  useEffect(() => {
    const savedTheme = localStorage.getItem('todo_pro_theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDarkMode(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      setDarkMode(false);
      document.documentElement.removeAttribute('data-theme');
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const next = !prev;
      if (next) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('todo_pro_theme', 'dark');
      } else {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('todo_pro_theme', 'light');
      }
      return next;
    });
  };

  // Check for overdue reminders on load or tasks update
  useEffect(() => {
    if (tasks.length > 0) {
      const overdue = checkOverdueReminders(tasks);
      if (overdue.length > 0) {
        setOverdueAlerts(overdue.length);
        setShowAlertBanner(true);
        sendNotification(`Todo Pro: ${overdue.length} Overdue Task(s)`, {
          body: `You have ${overdue.length} task(s) past their due time. Check your task list!`,
        });
      }
    }
  }, [tasks]);

  return (
    <main className="min-h-screen px-4 py-6 md:py-10 max-w-4xl mx-auto">
      {/* Header */}
      <Header
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Overdue Reminder Banner */}
      {showAlertBanner && overdueAlerts > 0 && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-900 dark:text-amber-200 flex items-center justify-between shadow-sm animate-fadeIn">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
            <p className="text-sm font-semibold">
              Attention: You have {overdueAlerts} task(s) with overdue reminders!
            </p>
          </div>
          <button
            onClick={() => setShowAlertBanner(false)}
            className="p-1 rounded-lg hover:bg-amber-500/20 text-amber-700 dark:text-amber-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Task Input */}
      <TaskInput onAddTask={addTask} />

      {/* Filter Tabs */}
      <FilterBar currentFilter={filter} onFilterChange={setFilter} tasks={tasks} />

      {/* Task List */}
      <TaskList
        tasks={filteredTasks}
        onToggle={toggleTask}
        onUpdate={updateTask}
        onDelete={deleteTask}
        onReorder={reorderTasks}
      />

      {/* Settings & Backup Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        tasks={tasks}
        onImportTasks={replaceAllTasks}
      />
    </main>
  );
}
