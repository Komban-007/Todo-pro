/* agent-notes: { ctx: "Custom hook for managing task state, storage sync, and filtering", deps: [src/types/todo.ts, src/utils/storage.ts, src/utils/recurrence.ts], state: active, last: "sato@2026-07-24" } */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Task, FilterStatus, Priority, RecurrencePattern } from '../types/todo';
import { loadTasks, saveTasks } from '../utils/storage';
import { calculateNextDueDate } from '../utils/recurrence';
import {
  fetchTasksFromSupabase,
  saveTaskToSupabase,
  deleteTaskFromSupabase,
  syncAllTasksToSupabase,
} from '../utils/supabaseStorage';

export interface NewTaskInput {
  title: string;
  description?: string;
  priority?: Priority;
  category?: string;
  dueDate?: string;
  dueTime?: string;
  reminderEnabled?: boolean;
  recurrence?: RecurrencePattern;
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Load initial tasks from local storage and sync with Supabase
  useEffect(() => {
    const loaded = loadTasks();
    setTasks(loaded);
    setIsLoaded(true);

    fetchTasksFromSupabase().then(remoteTasks => {
      if (remoteTasks && remoteTasks.length > 0) {
        setTasks(remoteTasks);
        saveTasks(remoteTasks);
      }
    });
  }, []);

  // Sync to storage on state change
  useEffect(() => {
    if (isLoaded) {
      saveTasks(tasks);
    }
  }, [tasks, isLoaded]);

  const addTask = useCallback((input: NewTaskInput): Task => {
    const now = new Date().toISOString();
    const newTask: Task = {
      id: 'task_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      title: input.title.trim(),
      description: input.description?.trim(),
      completed: false,
      priority: input.priority || 'P2',
      category: input.category?.trim() || 'General',
      dueDate: input.dueDate,
      dueTime: input.dueTime,
      reminderEnabled: !!input.reminderEnabled,
      recurrence: input.recurrence || 'none',
      createdAt: now,
      updatedAt: now,
      order: tasks.length,
    };

    setTasks(prev => [newTask, ...prev]);
    saveTaskToSupabase(newTask);
    return newTask;
  }, [tasks.length]);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    const now = new Date().toISOString();
    setTasks(prev => {
      const updatedList = prev.map(t => {
        if (t.id === id) {
          const updatedTask = { ...t, ...updates, updatedAt: now };
          saveTaskToSupabase(updatedTask);
          return updatedTask;
        }
        return t;
      });
      return updatedList;
    });
  }, []);

  const toggleTask = useCallback((id: string) => {
    const now = new Date().toISOString();
    setTasks(prev => {
      const target = prev.find(t => t.id === id);
      if (!target) return prev;

      const nextCompletedState = !target.completed;
      const updatedTarget = { ...target, completed: nextCompletedState, updatedAt: now };
      saveTaskToSupabase(updatedTarget);

      let nextTasks = prev.map(t =>
        t.id === id ? updatedTarget : t
      );

      // Auto-create next recurring task when completing
      if (nextCompletedState && target.recurrence !== 'none') {
        const nextDueDate = calculateNextDueDate(target.dueDate, target.recurrence);
        if (nextDueDate) {
          const nextRecurringTask: Task = {
            ...target,
            id: 'task_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
            completed: false,
            dueDate: nextDueDate,
            createdAt: now,
            updatedAt: now,
            order: prev.length,
          };
          saveTaskToSupabase(nextRecurringTask);
          nextTasks = [nextRecurringTask, ...nextTasks];
        }
      }

      return nextTasks;
    });
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    deleteTaskFromSupabase(id);
  }, []);

  const reorderTasks = useCallback((reordered: Task[]) => {
    const updated = reordered.map((task, index) => ({ ...task, order: index }));
    setTasks(updated);
    syncAllTasksToSupabase(updated);
  }, []);

  const replaceAllTasks = useCallback((newTasks: Task[]) => {
    setTasks(newTasks);
    syncAllTasksToSupabase(newTasks);
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    tasks.forEach(t => {
      if (t.category) set.add(t.category);
    });
    return Array.from(set);
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    const todayStr = new Date().toISOString().slice(0, 10);

    return tasks.filter(task => {
      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(query);
        const matchesCategory = task.category.toLowerCase().includes(query);
        if (!matchesTitle && !matchesCategory) return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && task.category !== selectedCategory) {
        return false;
      }

      // Status tab filter
      if (filter === 'completed') {
        return task.completed;
      }

      if (filter === 'today') {
        return !task.completed && task.dueDate === todayStr;
      }

      if (filter === 'upcoming') {
        return !task.completed && !!task.dueDate && task.dueDate > todayStr;
      }

      // Default 'all' filter shows non-completed first or all items
      return true;
    });
  }, [tasks, filter, searchQuery, selectedCategory]);

  return {
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
  };
}
