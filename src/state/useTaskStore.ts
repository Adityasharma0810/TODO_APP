import { create } from 'zustand';
import { Task } from '../types';
import * as tasksRepo from '../db/tasksRepository';
import * as taskCompletionsRepo from '../db/taskCompletionsRepository';
import * as dailyRecordsRepo from '../db/dailyRecordsRepository';
import { todayStr } from '../utils/date';
import { useDailyRecordStore } from './useDailyRecordStore';

interface TaskStore {
  tasks: Task[];
  isLoading: boolean;
  loadTasks: () => Promise<void>;
  addTask: (name: string) => Promise<void>;
  renameTask: (id: number, newName: string) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  restoreTask: (id: number) => Promise<void>;
  reorderTasks: (orderedIds: number[]) => Promise<void>;
  toggleTaskCompletion: (id: number) => Promise<void>;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  isLoading: false,
  loadTasks: async () => {
    set({ isLoading: true });
    try {
      const tasks = await tasksRepo.getAll();
      set({ tasks, isLoading: false });
    } catch (e) {
      set({ isLoading: false });
      console.error('Failed to load tasks', e);
    }
  },
  addTask: async (name: string) => {
    const date = todayStr();
    const nextOrder = await tasksRepo.getNextDisplayOrder();
    await tasksRepo.create(name, nextOrder, date);
    await get().loadTasks();
    await useDailyRecordStore.getState().loadToday();
    await useDailyRecordStore.getState().loadStatistics();
  },
  renameTask: async (id: number, newName: string) => {
    await tasksRepo.updateName(id, newName);
    await get().loadTasks();
  },
  deleteTask: async (id: number) => {
    const date = todayStr();
    await tasksRepo.softDelete(id, date);
    await get().loadTasks();
    await useDailyRecordStore.getState().loadToday();
    await useDailyRecordStore.getState().loadStatistics();
  },
  restoreTask: async (id: number) => {
    await tasksRepo.restore(id);
    await get().loadTasks();
    await useDailyRecordStore.getState().loadToday();
    await useDailyRecordStore.getState().loadStatistics();
  },
  reorderTasks: async (orderedIds: number[]) => {
    const updates = orderedIds.map((id, index) => ({ id, displayOrder: index }));
    await tasksRepo.reorder(updates);
    const tasks = [...get().tasks].sort((a, b) => orderedIds.indexOf(a.id) - orderedIds.indexOf(b.id));
    set({ tasks });
  },
  toggleTaskCompletion: async (id: number) => {
    const date = todayStr();
    const completedAt = new Date().toISOString();
    await taskCompletionsRepo.toggle(id, date, completedAt);
    const completions = await taskCompletionsRepo.getForDate(date);
    const activeTasks = await tasksRepo.getAll();
    const completedTasks = completions.length;
    const totalTasks = activeTasks.length;
    const completionPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    await dailyRecordsRepo.upsert(date, totalTasks, completedTasks, completionPct, false);
    await useDailyRecordStore.getState().loadToday();
    await useDailyRecordStore.getState().loadStatistics();
  },
}));
