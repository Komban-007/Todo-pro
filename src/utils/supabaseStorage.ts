import { supabase } from './supabase';
import { Task } from '../types/todo';

export interface SupabaseTodoRow {
  id: string;
  title: string;
  description?: string | null;
  completed: boolean;
  priority: string;
  category: string;
  due_date?: string | null;
  due_time?: string | null;
  reminder_enabled: boolean;
  recurrence: string;
  created_at: string;
  updated_at: string;
  order: number;
}

export function taskToRow(task: Task): SupabaseTodoRow {
  return {
    id: task.id,
    title: task.title,
    description: task.description || null,
    completed: task.completed,
    priority: task.priority,
    category: task.category,
    due_date: task.dueDate || null,
    due_time: task.dueTime || null,
    reminder_enabled: task.reminderEnabled,
    recurrence: task.recurrence,
    created_at: task.createdAt,
    updated_at: task.updatedAt,
    order: task.order,
  };
}

export function rowToTask(row: SupabaseTodoRow): Task {
  return {
    id: row.id,
    title: row.title,
    description: row.description || undefined,
    completed: row.completed,
    priority: (row.priority as Task['priority']) || 'P2',
    category: row.category || 'General',
    dueDate: row.due_date || undefined,
    dueTime: row.due_time || undefined,
    reminderEnabled: row.reminder_enabled,
    recurrence: (row.recurrence as Task['recurrence']) || 'none',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    order: row.order ?? 0,
  };
}

export async function fetchTasksFromSupabase(): Promise<Task[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .order('order', { ascending: true });

    if (error) {
      console.warn('Supabase fetch notice:', error.message);
      return null;
    }

    if (data) {
      return data.map(rowToTask);
    }
  } catch (err) {
    console.warn('Failed to fetch tasks from Supabase:', err);
  }
  return null;
}

export async function saveTaskToSupabase(task: Task): Promise<boolean> {
  if (!supabase) return false;
  try {
    const row = taskToRow(task);
    const { error } = await supabase.from('todos').upsert(row);
    if (error) {
      console.warn('Supabase upsert error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Failed to save task to Supabase:', err);
    return false;
  }
}

export async function deleteTaskFromSupabase(id: string): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('todos').delete().eq('id', id);
    if (error) {
      console.warn('Supabase delete error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Failed to delete task from Supabase:', err);
    return false;
  }
}

export async function syncAllTasksToSupabase(tasks: Task[]): Promise<boolean> {
  if (!supabase || tasks.length === 0) return false;
  try {
    const rows = tasks.map(taskToRow);
    const { error } = await supabase.from('todos').upsert(rows);
    if (error) {
      console.warn('Supabase bulk sync error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Failed to bulk sync tasks to Supabase:', err);
    return false;
  }
}
