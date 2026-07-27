import { describe, it, expect } from 'vitest';
import { calculateNextDueDate } from '../recurrence';
import { RecurrencePattern } from '../../types/todo';

describe('Recurrence Calculation Utility', () => {
  it('should return undefined if pattern is "none"', () => {
    const nextDate = calculateNextDueDate('2026-07-24', 'none');
    expect(nextDate).toBeUndefined();
  });

  it('should add 1 day for "daily" recurrence pattern', () => {
    const nextDate = calculateNextDueDate('2026-07-24', 'daily');
    expect(nextDate).toBe('2026-07-25');
  });

  it('should add 7 days for "weekly" recurrence pattern', () => {
    const nextDate = calculateNextDueDate('2026-07-24', 'weekly');
    expect(nextDate).toBe('2026-07-31');
  });

  it('should add 1 month for "monthly" recurrence pattern', () => {
    const nextDate = calculateNextDueDate('2026-07-24', 'monthly');
    expect(nextDate).toBe('2026-08-24');
  });

  it('should use current date if initial date is missing or invalid', () => {
    const todayStr = new Date().toISOString().slice(0, 10);
    const nextDate = calculateNextDueDate('', 'daily');
    expect(nextDate).toBeDefined();
    expect(nextDate).not.toBe('');
  });
});
