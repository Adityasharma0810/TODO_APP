export type { Task } from './task';
export type { DailyRecord, DayStatus, DayDetail } from './dailyRecord';
export type { AppSettings } from './settings';
export type { StatisticsSummary, TaskCompletionStat } from './statistics';

export interface BackupData {
  schemaVersion: number;
  exportedAt: string;
  tasks: any[];
  dailyRecords: any[];
  taskCompletions: any[];
  settings: Record<string, string>;
}
