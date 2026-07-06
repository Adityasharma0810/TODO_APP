import type { BackupData } from '../types';
import { getDb } from './client';
import { appDataDir, join } from '@tauri-apps/api/path';

export async function exportJson(): Promise<BackupData> {
  const db = await getDb();

  const tasks = await db.select<any[]>('SELECT * FROM tasks');
  const dailyRecords = await db.select<any[]>('SELECT * FROM daily_records');
  const taskCompletions = await db.select<any[]>('SELECT * FROM task_completions');
  const settingsRows = await db.select<any[]>('SELECT key, value FROM app_settings');

  const settings: Record<string, string> = {};
  for (const row of settingsRows) {
    settings[row.key] = row.value;
  }

  return {
    schemaVersion: 1,
    exportedAt: new Date().toISOString(),
    tasks,
    dailyRecords,
    taskCompletions,
    settings,
  };
}

export async function importJson(data: BackupData): Promise<void> {
  if (!data || typeof data.schemaVersion !== 'number') {
    throw new Error('Invalid backup data: missing schemaVersion');
  }
  if (!Array.isArray(data.tasks)) {
    throw new Error('Invalid backup data: tasks must be an array');
  }
  if (!Array.isArray(data.dailyRecords)) {
    throw new Error('Invalid backup data: dailyRecords must be an array');
  }
  if (!Array.isArray(data.taskCompletions)) {
    throw new Error('Invalid backup data: taskCompletions must be an array');
  }
  if (!data.settings || typeof data.settings !== 'object') {
    throw new Error('Invalid backup data: settings must be an object');
  }

  const db = await getDb();

  await db.execute('BEGIN');
  try {
    await db.execute('DELETE FROM task_completions');
    await db.execute('DELETE FROM daily_records');
    await db.execute('DELETE FROM tasks');
    await db.execute('DELETE FROM app_settings');

    for (const task of data.tasks) {
      await db.execute(
        'INSERT INTO tasks (id, name, display_order, active, created_at, archived_at) VALUES (?, ?, ?, ?, ?, ?)',
        [
          task.id,
          task.name,
          task.display_order ?? task.displayOrder,
          task.active ?? 1,
          task.created_at ?? task.createdAt ?? null,
          task.archived_at ?? task.archivedAt ?? null,
        ],
      );
    }

    for (const rec of data.dailyRecords) {
      const now = new Date().toISOString();
      await db.execute(
        'INSERT INTO daily_records (date, total_tasks, completed_tasks, completion_percentage, is_locked, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [
          rec.date,
          rec.total_tasks ?? rec.totalTasks,
          rec.completed_tasks ?? rec.completedTasks,
          rec.completion_percentage ?? rec.completionPercentage,
          rec.is_locked ?? rec.isLocked ?? 0,
          rec.created_at ?? now,
          now,
        ],
      );
    }

    for (const tc of data.taskCompletions) {
      await db.execute(
        'INSERT INTO task_completions (id, task_id, date, completed_at) VALUES (?, ?, ?, ?)',
        [
          tc.id,
          tc.task_id ?? tc.taskId,
          tc.date,
          tc.completed_at ?? tc.completedAt,
        ],
      );
    }

    for (const [key, value] of Object.entries(data.settings)) {
      await db.execute('INSERT INTO app_settings (key, value) VALUES (?, ?)', [key, value]);
    }

    await db.execute('COMMIT');
  } catch (e) {
    await db.execute('ROLLBACK');
    throw e;
  }
}

export async function getBackupPath(): Promise<string> {
  const appDir = await appDataDir();
  return await join(appDir, 'tracker.db');
}
