import { describe, it, expect, beforeEach, vi } from 'vitest';
import { loadTasks, saveTasks, exportBackupJSON, importBackupJSON } from '../storage';
import { Task } from '../../types/todo';

const mockTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Buy groceries',
    completed: false,
    priority: 'P1',
    category: 'Personal',
    reminderEnabled: false,
    recurrence: 'none',
    createdAt: '2026-07-24T10:00:00.000Z',
    updatedAt: '2026-07-24T10:00:00.000Z',
    order: 0,
  },
  {
    id: 'task-2',
    title: 'Submit report',
    completed: true,
    priority: 'P2',
    category: 'Work',
    dueDate: '2026-07-25',
    reminderEnabled: true,
    recurrence: 'daily',
    createdAt: '2026-07-24T10:00:00.000Z',
    updatedAt: '2026-07-24T10:00:00.000Z',
    order: 1,
  },
];

describe('LocalStorage Storage Adapter Utility', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('should return empty array when no tasks exist in localStorage', () => {
    const tasks = loadTasks();
    expect(tasks).toEqual([]);
  });

  it('should save and load tasks correctly from localStorage', () => {
    saveTasks(mockTasks);
    const loaded = loadTasks();
    expect(loaded).toEqual(mockTasks);
    expect(loaded.length).toBe(2);
  });

  it('should handle corrupt JSON in localStorage gracefully without throwing', () => {
    localStorage.setItem('todo_pro_tasks', '{ invalid json content }');
    const tasks = loadTasks();
    expect(tasks).toEqual([]);
  });

  it('should create valid JSON string format for backup export', () => {
    const backupJson = exportBackupJSON(mockTasks);
    const parsed = JSON.parse(backupJson);
    expect(parsed.version).toBe('1.0');
    expect(parsed.tasks).toEqual(mockTasks);
  });

  it('should validate and import tasks from a valid JSON backup string', () => {
    const backupJson = exportBackupJSON(mockTasks);
    const imported = importBackupJSON(backupJson);
    expect(imported).toEqual(mockTasks);
  });

  it('should throw error when importing invalid or corrupt backup JSON', () => {
    expect(() => importBackupJSON('invalid json')).toThrow();
    expect(() => importBackupJSON(JSON.stringify({ wrongKey: true }))).toThrow();
  });
});
