import type { Task } from '../types';
import { getDb } from './client';

function rowToTask(row: any): Task {
  return {
    id: row.id,
    name: row.name,
    displayOrder: row.display_order,
    active: row.active === 1,
    createdAt: row.created_at,
    archivedAt: row.archived_at ?? null,
  };
}

export async function getAll(): Promise<Task[]> {
  const db = await getDb();
  const rows = await db.select<any[]>('SELECT * FROM tasks WHERE active = 1 ORDER BY display_order');
  return rows.map(rowToTask);
}

export async function getAllIncludingArchived(): Promise<Task[]> {
  const db = await getDb();
  const rows = await db.select<any[]>('SELECT * FROM tasks ORDER BY display_order');
  return rows.map(rowToTask);
}

export async function getById(id: number): Promise<Task | null> {
  const db = await getDb();
  const rows = await db.select<any[]>('SELECT * FROM tasks WHERE id = ?', [id]);
  return rows.length > 0 ? rowToTask(rows[0]) : null;
}

export async function create(name: string, displayOrder: number, date: string): Promise<void> {
  const db = await getDb();
  await db.execute(
    'INSERT INTO tasks (name, display_order, created_at) VALUES (?, ?, ?)',
    [name, displayOrder, date]
  );
}

export async function updateName(id: number, name: string): Promise<void> {
  const db = await getDb();
  await db.execute('UPDATE tasks SET name = ? WHERE id = ?', [name, id]);
}

export async function softDelete(id: number, date: string): Promise<void> {
  const db = await getDb();
  await db.execute(
    'UPDATE tasks SET active = 0, archived_at = ? WHERE id = ?',
    [date, id]
  );
}

export async function restore(id: number): Promise<void> {
  const db = await getDb();
  await db.execute(
    'UPDATE tasks SET active = 1, archived_at = NULL WHERE id = ?',
    [id]
  );
}

export async function reorder(tasks: { id: number; displayOrder: number }[]): Promise<void> {
  const db = await getDb();
  await db.execute('BEGIN');
  try {
    for (const task of tasks) {
      await db.execute('UPDATE tasks SET display_order = ? WHERE id = ?', [task.displayOrder, task.id]);
    }
    await db.execute('COMMIT');
  } catch (e) {
    await db.execute('ROLLBACK');
    throw e;
  }
}

export async function getNextDisplayOrder(): Promise<number> {
  const db = await getDb();
  const rows = await db.select<any[]>('SELECT COALESCE(MAX(display_order), -1) + 1 AS next_order FROM tasks');
  return rows[0].next_order;
}
