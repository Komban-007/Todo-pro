/* agent-notes: { ctx: "Domain types for Todo Pro task management", deps: [], state: active, last: "tara@2026-07-24" } */

export type Priority = 'P1' | 'P2' | 'P3';

export type RecurrencePattern = 'none' | 'daily' | 'weekly' | 'monthly';

export type FilterStatus = 'all' | 'today' | 'upcoming' | 'completed';

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  category: string;
  dueDate?: string; // ISO String format YYYY-MM-DD
  dueTime?: string; // HH:mm format
  reminderEnabled: boolean;
  recurrence: RecurrencePattern;
  createdAt: string; // ISO String
  updatedAt: string; // ISO String
  order: number;
}

export interface TaskBackup {
  version: string;
  exportedAt: string;
  tasks: Task[];
}
