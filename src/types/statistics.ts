export interface StatisticsSummary {
  currentStreak: number;
  bestStreak: number;
  overallCompletionPercentage: number;
  perfectDays: number;
  partialDays: number;
  missedDays: number;
  daysTracked: number;
  totalTasksCompleted: number;
}

export interface TaskCompletionStat {
  taskId: number;
  taskName: string;
  lifetimeCompletionPercentage: number;
  isArchived: boolean;
}
