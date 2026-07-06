export interface DailyRecord {
  date: string;
  totalTasks: number;
  completedTasks: number;
  completionPercentage: number;
  isLocked: boolean;
}

export type DayStatus = 'no-tasks' | 'perfect' | 'partial' | 'missed' | 'in-progress' | 'future';

export interface DayDetail {
  date: string;
  status: DayStatus;
  completionPercentage: number;
  completedTaskNames: string[];
  missedTaskNames: string[];
}
