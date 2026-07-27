import { describe, it, expect, vi, beforeEach } from 'vitest';
import { requestNotificationPermission, sendNotification, checkOverdueReminders } from '../notifications';
import { Task } from '../../types/todo';

describe('Notification Service Utility', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should request notification permission when Notification API exists', async () => {
    const mockRequestPermission = vi.fn().mockResolvedValue('granted');
    vi.stubGlobal('Notification', {
      permission: 'default',
      requestPermission: mockRequestPermission,
    });

    const result = await requestNotificationPermission();
    expect(mockRequestPermission).toHaveBeenCalled();
    expect(result).toBe('granted');
  });

  it('should trigger browser notification if permission is granted', () => {
    const MockNotification = vi.fn();
    (MockNotification as unknown as { permission: string }).permission = 'granted';
    vi.stubGlobal('Notification', MockNotification);

    const success = sendNotification('Task Reminder', { body: 'Your task is due!' });
    expect(success).toBe(true);
    expect(MockNotification).toHaveBeenCalledWith('Task Reminder', { body: 'Your task is due!' });
  });

  it('should find overdue tasks with reminders enabled', () => {
    const pastDate = '2020-01-01';
    const pastTime = '10:00';
    const tasks: Task[] = [
      {
        id: 't-1',
        title: 'Overdue task',
        completed: false,
        priority: 'P1',
        category: 'Work',
        dueDate: pastDate,
        dueTime: pastTime,
        reminderEnabled: true,
        recurrence: 'none',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        order: 0,
      },
      {
        id: 't-2',
        title: 'Future task',
        completed: false,
        priority: 'P2',
        category: 'Work',
        dueDate: '2099-01-01',
        reminderEnabled: true,
        recurrence: 'none',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        order: 1,
      },
    ];

    const overdue = checkOverdueReminders(tasks);
    expect(overdue.length).toBe(1);
    expect(overdue[0].id).toBe('t-1');
  });
});
