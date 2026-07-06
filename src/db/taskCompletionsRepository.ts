import { getDb } from './client';

export async function getForDate(date: string): Promise<{ taskId: number }[]> {
  const db = await getDb();
  const rows = await db.select<any[]>('SELECT task_id FROM task_completions WHERE date = ?', [date]);
  return rows.map((r) => ({ taskId: r.task_id }));
}

export async function exists(taskId: number, date: string): Promise<boolean> {
  const db = await getDb();
  const rows = await db.select<any[]>(
    'SELECT 1 FROM task_completions WHERE task_id = ? AND date = ?',
    [taskId, date],
  );
  return rows.length > 0;
}

export async function toggle(taskId: number, date: string, completedAt: string): Promise<boolean> {
  const db = await getDb();
  const rows = await db.select<any[]>(
    'SELECT 1 FROM task_completions WHERE task_id = ? AND date = ?',
    [taskId, date],
  );

  if (rows.length > 0) {
    await db.execute(
      'DELETE FROM task_completions WHERE task_id = ? AND date = ?',
      [taskId, date],
    );
    return false;
  } else {
    await db.execute(
      'INSERT INTO task_completions (task_id, date, completed_at) VALUES (?, ?, ?)',
      [taskId, date, completedAt],
    );
    return true;
  }
}

export async function deleteAll(): Promise<void> {
  const db = await getDb();
  await db.execute('DELETE FROM task_completions');
}
