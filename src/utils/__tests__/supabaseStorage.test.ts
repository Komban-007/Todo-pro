import { describe, it, expect } from 'vitest';
import { taskToRow, rowToTask, SupabaseTodoRow } from '../supabaseStorage';
import { Task } from '../../types/todo';

describe('Supabase Storage Adapter Utility', () => {
  const sampleTask: Task = {
    id: 'task_123',
    title: 'Test Supabase Sync',
    description: 'Test description',
    completed: false,
    priority: 'P1',
    category: 'Work',
    dueDate: '2026-08-01',
    dueTime: '10:00',
    reminderEnabled: true,
    recurrence: 'daily',
    createdAt: '2026-07-27T10:00:00Z',
    updatedAt: '2026-07-27T10:00:00Z',
    order: 0,
  };

  it('should correctly convert a Task to a Supabase database row format', () => {
    const row = taskToRow(sampleTask);
    expect(row.id).toBe('task_123');
    expect(row.title).toBe('Test Supabase Sync');
    expect(row.due_date).toBe('2026-08-01');
    expect(row.due_time).toBe('10:00');
    expect(row.reminder_enabled).toBe(true);
    expect(row.recurrence).toBe('daily');
  });

  it('should correctly convert a Supabase database row to a Task domain object', () => {
    const row: SupabaseTodoRow = {
      id: 'task_456',
      title: 'Remote Task',
      description: null,
      completed: true,
      priority: 'P3',
      category: 'Personal',
      due_date: '2026-08-05',
      due_time: null,
      reminder_enabled: false,
      recurrence: 'none',
      created_at: '2026-07-27T11:00:00Z',
      updated_at: '2026-07-27T11:00:00Z',
      order: 1,
    };

    const task = rowToTask(row);
    expect(task.id).toBe('task_456');
    expect(task.title).toBe('Remote Task');
    expect(task.description).toBeUndefined();
    expect(task.completed).toBe(true);
    expect(task.dueDate).toBe('2026-08-05');
    expect(task.dueTime).toBeUndefined();
  });
});
