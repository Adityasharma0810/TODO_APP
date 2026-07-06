import { create } from 'zustand';
import type { AppSettings } from '../types';
import * as settingsRepo from '../db/settingsRepository';
import * as backupRepo from '../db/backupRepository';
import * as dailyRecordsRepo from '../db/dailyRecordsRepository';
import * as taskCompletionsRepo from '../db/taskCompletionsRepository';
import * as tasksRepo from '../db/tasksRepository';
import { save, message } from '@tauri-apps/plugin-dialog';
import { copyFile, readTextFile, writeTextFile } from '@tauri-apps/plugin-fs';
import { todayStr } from '../utils/date';

interface SettingsStore {
  settings: AppSettings;
  loadSettings: () => Promise<void>;
  updateSettings: (partial: Partial<AppSettings>) => Promise<void>;
  exportJson: () => Promise<void>;
  exportSqlite: () => Promise<void>;
  importBackup: (filePath: string) => Promise<void>;
  resetAllStatistics: () => Promise<void>;
}

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  accentColor: '#6366F1',
  lockPastDays: true,
};

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  settings: { ...DEFAULT_SETTINGS },

  loadSettings: async () => {
    try {
      const stored = await settingsRepo.getAll();
      set({
        settings: {
          theme: (stored.theme ?? DEFAULT_SETTINGS.theme) as AppSettings['theme'],
          accentColor: stored.accent_color ?? DEFAULT_SETTINGS.accentColor,
          lockPastDays: stored.lock_past_days === 'true' ? true : DEFAULT_SETTINGS.lockPastDays,
        },
      });
    } catch (e) {
      console.error('Failed to load settings', e);
      set({ settings: { ...DEFAULT_SETTINGS } });
    }
  },

  updateSettings: async (partial: Partial<AppSettings>) => {
    try {
      const merged = { ...get().settings, ...partial };
      await settingsRepo.saveSettings(merged);
      set({ settings: merged });
    } catch (e) {
      console.error('Failed to save settings', e);
    }
  },

  exportJson: async () => {
    try {
      const backup = await backupRepo.exportJson();
      const json = JSON.stringify(backup, null, 2);
      const filePath = await save({
        defaultPath: `daily-consistency-backup-${new Date().toISOString().slice(0, 10)}.json`,
        filters: [{ name: 'JSON Backup', extensions: ['json'] }],
      });
      if (!filePath) return;
      await writeTextFile(filePath, json);
    } catch (e) {
      console.error('Failed to export JSON', e);
      await message('Failed to export JSON backup', { title: 'Export Error', kind: 'error' });
    }
  },

  exportSqlite: async () => {
    try {
      const dbPath = await backupRepo.getBackupPath();
      const filePath = await save({
        defaultPath: `daily-consistency-backup-${new Date().toISOString().slice(0, 10)}.db`,
        filters: [{ name: 'SQLite Database', extensions: ['db'] }],
      });
      if (!filePath) return;
      await copyFile(dbPath, filePath);
    } catch (e) {
      console.error('Failed to export SQLite', e);
      await message('Failed to export SQLite backup', { title: 'Export Error', kind: 'error' });
    }
  },

  importBackup: async (_filePath: string) => {
    try {
      const content = await readTextFile(_filePath);
      const data = JSON.parse(content);
      await backupRepo.importJson(data);
      const stored = await settingsRepo.getAll();
      set({
        settings: {
          theme: (stored.theme ?? DEFAULT_SETTINGS.theme) as AppSettings['theme'],
          accentColor: stored.accent_color ?? DEFAULT_SETTINGS.accentColor,
          lockPastDays: stored.lock_past_days === 'true' ? true : DEFAULT_SETTINGS.lockPastDays,
        },
      });
      const { useDailyRecordStore } = await import('./useDailyRecordStore');
      await useDailyRecordStore.getState().loadToday();
      await useDailyRecordStore.getState().loadStatistics();
    } catch (e) {
      console.error('Failed to import backup', e);
      await message(`Failed to import backup: ${e instanceof Error ? e.message : 'Unknown error'}`, {
        title: 'Import Error',
        kind: 'error',
      });
    }
  },

  resetAllStatistics: async () => {
    try {
      await dailyRecordsRepo.deleteAll();
      await taskCompletionsRepo.deleteAll();
      const today = todayStr();
      const activeTasks = await tasksRepo.getAll();
      await dailyRecordsRepo.upsert(today, activeTasks.length, 0, 0, false);
      const { useDailyRecordStore } = await import('./useDailyRecordStore');
      await useDailyRecordStore.getState().loadToday();
      await useDailyRecordStore.getState().loadStatistics();
    } catch (e) {
      console.error('Failed to reset statistics', e);
      await message('Failed to reset statistics', { title: 'Reset Error', kind: 'error' });
    }
  },
}));
