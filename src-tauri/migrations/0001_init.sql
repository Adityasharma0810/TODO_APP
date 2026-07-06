PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS tasks (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  name           TEXT NOT NULL,
  display_order  INTEGER NOT NULL,
  active         INTEGER NOT NULL DEFAULT 1,
  created_at     TEXT NOT NULL,
  archived_at    TEXT
);

CREATE TABLE IF NOT EXISTS daily_records (
  date                   TEXT PRIMARY KEY,
  total_tasks            INTEGER NOT NULL DEFAULT 0,
  completed_tasks         INTEGER NOT NULL DEFAULT 0,
  completion_percentage  REAL NOT NULL DEFAULT 0,
  is_locked              INTEGER NOT NULL DEFAULT 0,
  created_at             TEXT NOT NULL,
  updated_at             TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS task_completions (
  task_id       INTEGER NOT NULL,
  date          TEXT NOT NULL,
  completed_at  TEXT NOT NULL,
  PRIMARY KEY (task_id, date),
  FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
  FOREIGN KEY (date) REFERENCES daily_records(date) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS app_settings (
  key    TEXT PRIMARY KEY,
  value  TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_completions_date ON task_completions(date);
CREATE INDEX IF NOT EXISTS idx_completions_task ON task_completions(task_id);
CREATE INDEX IF NOT EXISTS idx_tasks_active_order ON tasks(active, display_order);
