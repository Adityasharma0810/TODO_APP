import type { DailyRecord } from '../types';
import { getDb } from './client';

function rowToDailyRecord(row: any): DailyRecord {
  return {
    date: row.date,
    totalTasks: row.total_tasks,
    completedTasks: row.completed_tasks,
    completionPercentage: row.completion_percentage,
    isLocked: row.is_locked === 1,
  };
}

export async function getByDate(date: string): Promise<DailyRecord | null> {
  const db = await getDb();
  const rows = await db.select<any[]>('SELECT * FROM daily_records WHERE date = ?', [date]);
  return rows.length > 0 ? rowToDailyRecord(rows[0]) : null;
}

export async function upsert(
  date: string,
  totalTasks: number,
  completedTasks: number,
  completionPct: number,
  isLocked: boolean,
): Promise<void> {
  const db = await getDb();
  const now = new Date().toISOString();
  await db.execute(
    `INSERT INTO daily_records (date, total_tasks, completed_tasks, completion_percentage, is_locked, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(date) DO UPDATE SET
       total_tasks = excluded.total_tasks,
       completed_tasks = excluded.completed_tasks,
       completion_percentage = excluded.completion_percentage,
       is_locked = excluded.is_locked,
       updated_at = excluded.updated_at`,
    [date, totalTasks, completedTasks, completionPct, isLocked ? 1 : 0, now, now],
  );
}

export async function updateCompletion(
  date: string,
  completedTasks: number,
  totalTasks: number,
  completionPct: number,
): Promise<void> {
  const db = await getDb();
  await db.execute(
    'UPDATE daily_records SET completed_tasks = ?, total_tasks = ?, completion_pct = ? WHERE date = ?',
    [completedTasks, totalTasks, completionPct, date],
  );
}

export async function lockDate(date: string): Promise<void> {
  const db = await getDb();
  await db.execute('UPDATE daily_records SET is_locked = 1 WHERE date = ?', [date]);
}

export async function getLastDate(): Promise<string | null> {
  const db = await getDb();
  const rows = await db.select<any[]>('SELECT date FROM daily_records ORDER BY date DESC LIMIT 1');
  return rows.length > 0 ? rows[0].date : null;
}

export async function getAllRecords(): Promise<DailyRecord[]> {
  const db = await getDb();
  const rows = await db.select<any[]>('SELECT * FROM daily_records ORDER BY date');
  return rows.map(rowToDailyRecord);
}

export async function getRecordsInRange(startDate: string, endDate: string): Promise<DailyRecord[]> {
  const db = await getDb();
  const rows = await db.select<any[]>(
    'SELECT * FROM daily_records WHERE date >= ? AND date <= ? ORDER BY date',
    [startDate, endDate],
  );
  return rows.map(rowToDailyRecord);
}

export async function getRecordsForMonth(year: number, month: number): Promise<DailyRecord[]> {
  const db = await getDb();
  const prefix = `${year}-${String(month).padStart(2, '0')}`;
  const rows = await db.select<any[]>(
    'SELECT * FROM daily_records WHERE date LIKE ? ORDER BY date',
    [`${prefix}%`],
  );
  return rows.map(rowToDailyRecord);
}

export async function deleteAll(): Promise<void> {
  const db = await getDb();
  await db.execute('DELETE FROM daily_records');
}
