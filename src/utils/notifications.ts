/* agent-notes: { ctx: "Browser Notification API & overdue reminder utility", deps: [src/types/todo.ts], state: active, last: "sato@2026-07-24" } */

import { Task } from '../types/todo';

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'denied';
  }
  if (Notification.permission === 'granted') {
    return 'granted';
  }
  try {
    return await Notification.requestPermission();
  } catch (err) {
    console.error('Error requesting notification permission:', err);
    return 'denied';
  }
}

export function sendNotification(title: string, options?: NotificationOptions): boolean {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }
  if (Notification.permission !== 'granted') {
    return false;
  }
  try {
    new Notification(title, options);
    return true;
  } catch (err) {
    console.error('Failed to dispatch notification:', err);
    return false;
  }
}

export function checkOverdueReminders(tasks: Task[]): Task[] {
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  const currentHours = String(now.getHours()).padStart(2, '0');
  const currentMinutes = String(now.getMinutes()).padStart(2, '0');
  const currentTimeStr = `${currentHours}:${currentMinutes}`;

  return tasks.filter(task => {
    if (task.completed || !task.reminderEnabled || !task.dueDate) {
      return false;
    }

    if (task.dueDate < todayStr) {
      return true;
    }

    if (task.dueDate === todayStr && task.dueTime && task.dueTime <= currentTimeStr) {
      return true;
    }

    return false;
  });
}
