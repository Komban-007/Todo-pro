/* agent-notes: { ctx: "LocalStorage persistence and JSON backup utility", deps: [src/types/todo.ts], state: active, last: "sato@2026-07-24" } */

import { Task, TaskBackup } from '../types/todo';

const STORAGE_KEY = 'todo_pro_tasks';
const BACKUP_VERSION = '1.0';

export function loadTasks(): Task[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch (err) {
    console.error('Failed to parse tasks from localStorage:', err);
    return [];
  }
}

export function saveTasks(tasks: Task[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (err) {
    console.error('Failed to save tasks to localStorage:', err);
  }
}

export function exportBackupJSON(tasks: Task[]): string {
  const backup: TaskBackup = {
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    tasks,
  };
  return JSON.stringify(backup, null, 2);
}

export function importBackupJSON(jsonString: string): Task[] {
  const parsed = JSON.parse(jsonString);
  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Invalid JSON format');
  }
  if (!Array.isArray(parsed.tasks)) {
    throw new Error('Invalid backup schema: missing tasks array');
  }
  return parsed.tasks as Task[];
}
