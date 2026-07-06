export function validateTaskName(name: string): string | null {
  const trimmed = name.trim();
  if (trimmed.length === 0) {
    return 'Task name cannot be empty';
  }
  if (trimmed.length > 100) {
    return 'Task name must be 100 characters or less';
  }
  if (/^\s/.test(name)) {
    return 'Task name cannot start with whitespace';
  }
  return null;
}

export function validateBackupJson(data: unknown): string | null {
  if (data === null || data === undefined || typeof data !== 'object') {
    return 'Backup data must be a JSON object';
  }

  const obj = data as Record<string, unknown>;

  if (typeof obj.version !== 'number') {
    return 'Backup data must include a version number';
  }

  if (!Array.isArray(obj.tasks)) {
    return 'Backup data must include a tasks array';
  }

  if (!Array.isArray(obj.records)) {
    return 'Backup data must include a records array';
  }

  return null;
}
