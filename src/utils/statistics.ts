import type { DailyRecord, DayStatus } from '../types/dailyRecord';
import { todayStr } from './date';

export function classifyDay(record: DailyRecord | undefined, dateStr: string): DayStatus {
  const today = todayStr();
  if (dateStr > today) return 'future';
  if (!record || record.totalTasks === 0) return 'no-tasks';
  if (dateStr === today) return record.completionPercentage >= 100 ? 'perfect' : 'in-progress';
  if (record.completionPercentage >= 100) return 'perfect';
  if (record.completionPercentage <= 0) return 'missed';
  return 'partial';
}
