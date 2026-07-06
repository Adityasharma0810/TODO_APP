import type { DailyRecord } from '../types/dailyRecord';
import { todayStr, previousDayStr } from './date';

export function calculateCurrentStreak(recordsByDate: Record<string, DailyRecord>): number {
  const today = todayStr();
  const todayRecord = recordsByDate[today];

  const startDay =
    todayRecord && todayRecord.totalTasks > 0 && todayRecord.completionPercentage >= 100
      ? today
      : previousDayStr(today);

  let streak = 0;
  let cursor = startDay;
  while (true) {
    const record = recordsByDate[cursor];
    if (!record || record.totalTasks === 0 || record.completionPercentage < 100) break;
    streak++;
    cursor = previousDayStr(cursor);
  }
  return streak;
}

export function calculateBestStreak(recordsAscendingByDate: DailyRecord[]): number {
  let bestStreak = 0;
  let currentStreak = 0;

  for (const record of recordsAscendingByDate) {
    if (record.totalTasks > 0 && record.completionPercentage >= 100) {
      currentStreak++;
      if (currentStreak > bestStreak) {
        bestStreak = currentStreak;
      }
    } else {
      currentStreak = 0;
    }
  }

  return bestStreak;
}
