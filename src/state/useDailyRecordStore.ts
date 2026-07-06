import { create } from 'zustand';
import type { DailyRecord, DayDetail, StatisticsSummary, TaskCompletionStat } from '../types';
import * as dailyRecordsRepo from '../db/dailyRecordsRepository';
import * as taskCompletionsRepo from '../db/taskCompletionsRepository';
import * as tasksRepo from '../db/tasksRepository';
import { getDb } from '../db/client';
import { todayStr, previousDayStr } from '../utils/date';
import { calculateCurrentStreak, calculateBestStreak } from '../utils/streaks';
import { classifyDay } from '../utils/statistics';

interface DailyRecordStore {
  todayRecord: DailyRecord | null;
  todayCompletedTaskIds: Set<number>;
  recordsByDate: Record<string, DailyRecord>;
  statistics: StatisticsSummary | null;
  taskCompletionStats: TaskCompletionStat[];
  loadToday: () => Promise<void>;
  loadStatistics: () => Promise<void>;
  loadMonth: (year: number, month: number) => Promise<void>;
  getDayDetail: (date: string) => Promise<DayDetail>;
  runRolloverIfNeeded: () => Promise<void>;
}

export const useDailyRecordStore = create<DailyRecordStore>((set, get) => ({
  todayRecord: null,
  todayCompletedTaskIds: new Set(),
  recordsByDate: {},
  statistics: null,
  taskCompletionStats: [],

  loadToday: async () => {
    const today = todayStr();
    try {
      await get().runRolloverIfNeeded();
      const todayRecord = await dailyRecordsRepo.getByDate(today);
      const completions = await taskCompletionsRepo.getForDate(today);
      const todayCompletedTaskIds = new Set(completions.map((c) => c.taskId));
      set({ todayRecord, todayCompletedTaskIds });
    } catch (e) {
      console.error('Failed to load today', e);
    }
  },

  loadStatistics: async () => {
    try {
      const today = todayStr();
      const db = await getDb();

      const overallResult = await db.select<{ overallCompletionPercentage: number }[]>(
        `SELECT ROUND(100.0 * SUM(completed_tasks) / NULLIF(SUM(total_tasks), 0)) AS overallCompletionPercentage
         FROM daily_records WHERE total_tasks > 0`,
      );
      const overallCompletionPercentage = overallResult?.[0]?.overallCompletionPercentage ?? 0;

      const perfectResult = await db.select<{ count: number }[]>(
        `SELECT COUNT(*) AS count FROM daily_records WHERE total_tasks > 0 AND completion_percentage >= 100`,
      );
      const perfectDays = perfectResult?.[0]?.count ?? 0;

      const partialResult = await db.select<{ count: number }[]>(
        `SELECT COUNT(*) AS count FROM daily_records
         WHERE total_tasks > 0 AND completion_percentage > 0 AND completion_percentage < 100 AND date < ?`,
        [today],
      );
      const partialDays = partialResult?.[0]?.count ?? 0;

      const missedResult = await db.select<{ count: number }[]>(
        `SELECT COUNT(*) AS count FROM daily_records
         WHERE total_tasks > 0 AND completion_percentage = 0 AND date < ?`,
        [today],
      );
      const missedDays = missedResult?.[0]?.count ?? 0;

      const trackedResult = await db.select<{ count: number }[]>(
        `SELECT COUNT(*) AS count FROM daily_records WHERE total_tasks > 0`,
      );
      const daysTracked = trackedResult?.[0]?.count ?? 0;

      const totalCompletedResult = await db.select<{ count: number }[]>(
        `SELECT COUNT(*) AS count FROM task_completions`,
      );
      const totalTasksCompleted = totalCompletedResult?.[0]?.count ?? 0;

      const allRecords = await dailyRecordsRepo.getAllRecords();
      const recordsByDate: Record<string, DailyRecord> = {};
      for (const r of allRecords) {
        recordsByDate[r.date] = r;
      }

      const currentStreak = calculateCurrentStreak(recordsByDate);
      const bestStreak = calculateBestStreak(allRecords);

      const taskStatsResult = await db.select<{ id: number; name: string; lifetimeCompletionPercentage: number }[]>(
        `SELECT t.id, t.name,
           ROUND(100.0 * (SELECT COUNT(*) FROM task_completions tc WHERE tc.task_id = t.id)
             / (julianday(COALESCE(t.archived_at, ?)) - julianday(t.created_at) + 1))
           AS lifetimeCompletionPercentage
         FROM tasks t`,
        [today],
      );

      const taskCompletionStats: TaskCompletionStat[] = (taskStatsResult || []).map((row) => ({
        taskId: row.id,
        taskName: row.name,
        lifetimeCompletionPercentage: Math.min(Math.round(row.lifetimeCompletionPercentage || 0), 100),
        isArchived: false,
      }));

      set({
        statistics: {
          currentStreak,
          bestStreak,
          overallCompletionPercentage,
          perfectDays,
          partialDays,
          missedDays,
          daysTracked,
          totalTasksCompleted,
        },
        recordsByDate,
        taskCompletionStats,
      });
    } catch (e) {
      console.error('Failed to load statistics', e);
    }
  },

  loadMonth: async (year: number, month: number) => {
    try {
      const records = await dailyRecordsRepo.getRecordsForMonth(year, month);
      const recordsByDate = { ...get().recordsByDate };
      for (const r of records) {
        recordsByDate[r.date] = r;
      }
      set({ recordsByDate });
    } catch (e) {
      console.error('Failed to load month', e);
    }
  },

  getDayDetail: async (date: string): Promise<DayDetail> => {
    const today = todayStr();
    const completions = await taskCompletionsRepo.getForDate(date);
    const completedTaskIds = new Set(completions.map((c) => c.taskId));

    const allTasks = await tasksRepo.getAllIncludingArchived();
    const tasksActiveOnDate = allTasks.filter(
      (t) => t.createdAt <= date && (!t.archivedAt || t.archivedAt > date),
    );

    const completedTaskNames: string[] = [];
    const missedTaskNames: string[] = [];
    for (const task of tasksActiveOnDate) {
      if (completedTaskIds.has(task.id)) {
        completedTaskNames.push(task.name);
      } else {
        missedTaskNames.push(task.name);
      }
    }

    const totalTasks = tasksActiveOnDate.length;
    const completedTasks = completedTaskNames.length;
    const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    let record: DailyRecord | undefined;
    const existing = get().recordsByDate[date];
    if (existing) {
      record = existing;
    } else {
      const fetched = await dailyRecordsRepo.getByDate(date);
      if (fetched) record = fetched;
    }

    const status = classifyDay(record, date);

    return {
      date,
      status,
      completionPercentage,
      completedTaskNames,
      missedTaskNames,
    };
  },

  runRolloverIfNeeded: async () => {
    try {
      const today = todayStr();
      const lastDate = await dailyRecordsRepo.getLastDate();

      if (!lastDate) {
        const activeTasks = await tasksRepo.getAll();
        const totalTasks = activeTasks.length;
        await dailyRecordsRepo.upsert(today, totalTasks, 0, 0, false);
        return;
      }

      if (lastDate === today) return;

      let cursor = previousDayStr(today);
      const datesToBackfill: string[] = [];
      while (cursor > lastDate) {
        datesToBackfill.unshift(cursor);
        cursor = previousDayStr(cursor);
      }

      const allTasks = await tasksRepo.getAllIncludingArchived();
      for (const d of datesToBackfill) {
        const tasksActive = allTasks.filter(
          (t) => t.createdAt <= d && (!t.archivedAt || t.archivedAt > d),
        );
        await dailyRecordsRepo.upsert(d, tasksActive.length, 0, 0, true);
      }

      const todayRecord = await dailyRecordsRepo.getByDate(today);
      if (!todayRecord) {
        const activeTasks = await tasksRepo.getAll();
        await dailyRecordsRepo.upsert(today, activeTasks.length, 0, 0, false);
      }
    } catch (e) {
      console.error('Failed to run rollover', e);
    }
  },
}));
