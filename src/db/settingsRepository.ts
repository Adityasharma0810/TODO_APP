import type { AppSettings } from '../types';
import { getDb } from './client';

export async function get(key: string): Promise<string | null> {
  const db = await getDb();
  const rows = await db.select<any[]>('SELECT value FROM app_settings WHERE key = ?', [key]);
  return rows.length > 0 ? rows[0].value : null;
}

export async function set(key: string, value: string): Promise<void> {
  const db = await getDb();
  await db.execute(
    'INSERT INTO app_settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value',
    [key, value],
  );
}

export async function getAll(): Promise<Record<string, string>> {
  const db = await getDb();
  const rows = await db.select<any[]>('SELECT key, value FROM app_settings');
  const result: Record<string, string> = {};
  for (const row of rows) {
    result[row.key] = row.value;
  }
  return result;
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  const db = await getDb();
  await db.execute('BEGIN');
  try {
    await db.execute(
      'INSERT INTO app_settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value',
      ['theme', settings.theme],
    );
    await db.execute(
      'INSERT INTO app_settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value',
      ['accent_color', settings.accentColor],
    );
    await db.execute(
      'INSERT INTO app_settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value',
      ['lock_past_days', settings.lockPastDays ? 'true' : 'false'],
    );
    await db.execute('COMMIT');
  } catch (e) {
    await db.execute('ROLLBACK');
    throw e;
  }
}
