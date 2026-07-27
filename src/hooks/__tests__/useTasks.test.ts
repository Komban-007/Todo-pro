import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTasks } from '../useTasks';

describe('useTasks Custom Hook', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('should initialize with empty task list or localStorage items', () => {
    const { result } = renderHook(() => useTasks());
    expect(result.current.tasks).toEqual([]);
  });

  it('should add a new task successfully', () => {
    const { result } = renderHook(() => useTasks());

    act(() => {
      result.current.addTask({
        title: 'Learn Vitest',
        priority: 'P1',
        category: 'Study',
        dueDate: '2026-07-25',
        reminderEnabled: false,
        recurrence: 'none',
      });
    });

    expect(result.current.tasks.length).toBe(1);
    expect(result.current.tasks[0].title).toBe('Learn Vitest');
    expect(result.current.tasks[0].completed).toBe(false);
    expect(result.current.tasks[0].priority).toBe('P1');
  });

  it('should toggle task completion state and handle recurring task auto-creation', () => {
    const { result } = renderHook(() => useTasks());

    let taskId = '';
    act(() => {
      const task = result.current.addTask({
        title: 'Daily Workout',
        priority: 'P2',
        category: 'Health',
        dueDate: '2026-07-24',
        reminderEnabled: true,
        recurrence: 'daily',
      });
      taskId = task.id;
    });

    act(() => {
      result.current.toggleTask(taskId);
    });

    // Completed task stays in history
    const completed = result.current.tasks.find(t => t.id === taskId);
    expect(completed?.completed).toBe(true);

    // Auto-created next recurring task
    const recurringNext = result.current.tasks.find(t => t.title === 'Daily Workout' && !t.completed);
    expect(recurringNext).toBeDefined();
    expect(recurringNext?.dueDate).toBe('2026-07-25');
  });

  it('should edit an existing task', () => {
    const { result } = renderHook(() => useTasks());
    let taskId = '';

    act(() => {
      const t = result.current.addTask({
        title: 'Original Title',
        priority: 'P3',
        category: 'General',
        reminderEnabled: false,
        recurrence: 'none',
      });
      taskId = t.id;
    });

    act(() => {
      result.current.updateTask(taskId, { title: 'Updated Title', priority: 'P1' });
    });

    const updated = result.current.tasks.find(t => t.id === taskId);
    expect(updated?.title).toBe('Updated Title');
    expect(updated?.priority).toBe('P1');
  });

  it('should delete a task', () => {
    const { result } = renderHook(() => useTasks());
    let taskId = '';

    act(() => {
      const t = result.current.addTask({
        title: 'To be deleted',
        priority: 'P3',
        category: 'Temp',
        reminderEnabled: false,
        recurrence: 'none',
      });
      taskId = t.id;
    });

    expect(result.current.tasks.length).toBe(1);

    act(() => {
      result.current.deleteTask(taskId);
    });

    expect(result.current.tasks.length).toBe(0);
  });

  it('should filter tasks by status tab (all, today, upcoming, completed)', () => {
    const { result } = renderHook(() => useTasks());
    const todayStr = new Date().toISOString().slice(0, 10);

    act(() => {
      result.current.addTask({ title: 'Task Today', priority: 'P1', category: 'Work', dueDate: todayStr, reminderEnabled: false, recurrence: 'none' });
      result.current.addTask({ title: 'Task Future', priority: 'P2', category: 'Work', dueDate: '2099-01-01', reminderEnabled: false, recurrence: 'none' });
    });

    act(() => {
      result.current.setFilter('today');
    });
    expect(result.current.filteredTasks.length).toBe(1);
    expect(result.current.filteredTasks[0].title).toBe('Task Today');

    act(() => {
      result.current.setFilter('upcoming');
    });
    expect(result.current.filteredTasks.length).toBe(1);
    expect(result.current.filteredTasks[0].title).toBe('Task Future');
  });
});
