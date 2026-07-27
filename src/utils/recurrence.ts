/* agent-notes: { ctx: "Recurrence date calculation utility", deps: [src/types/todo.ts], state: active, last: "sato@2026-07-24" } */

import { RecurrencePattern } from '../types/todo';

export function calculateNextDueDate(currentDueDateStr?: string, recurrence: RecurrencePattern = 'none'): string | undefined {
  if (recurrence === 'none') {
    return undefined;
  }

  let baseDate: Date;
  if (currentDueDateStr && !isNaN(Date.parse(currentDueDateStr))) {
    baseDate = new Date(currentDueDateStr);
  } else {
    baseDate = new Date();
  }

  const nextDate = new Date(baseDate);

  switch (recurrence) {
    case 'daily':
      nextDate.setDate(nextDate.getDate() + 1);
      break;
    case 'weekly':
      nextDate.setDate(nextDate.getDate() + 7);
      break;
    case 'monthly':
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;
    default:
      return undefined;
  }

  return nextDate.toISOString().slice(0, 10);
}
