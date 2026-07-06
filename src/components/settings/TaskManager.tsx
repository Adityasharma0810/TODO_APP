import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Pencil, Trash2, RotateCcw, Check, X } from 'lucide-react';
import { useTaskStore } from '../../state/useTaskStore';
import { useUIStore } from '../../state/useUIStore';
import { cn } from '../../utils/cn';
import { Task } from '../../types';
import { AddTaskInput } from '../today/AddTaskInput';

export function TaskManager() {
  const { tasks, loadTasks, renameTask, deleteTask, restoreTask } = useTaskStore();
  const showToast = useUIStore((s) => s.showToast);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const activeTasks = tasks.filter((t) => t.active);
  const archivedTasks = tasks.filter((t) => !t.active);

  const handleRenameStart = (task: Task) => {
    setEditingId(task.id);
    setEditingName(task.name);
  };

  const handleRenameConfirm = async (id: number) => {
    const name = editingName.trim();
    if (!name || name === tasks.find((t) => t.id === id)?.name) {
      setEditingId(null);
      return;
    }
    try {
      await renameTask(id, name);
      showToast('Task renamed', 'success');
    } catch {
      showToast('Failed to rename task', 'error');
    }
    setEditingId(null);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTask(id);
      showToast('Task archived', 'success');
    } catch {
      showToast('Failed to archive task', 'error');
    }
    setConfirmDeleteId(null);
  };

  const handleRestore = async (id: number) => {
    try {
      await restoreTask(id);
      showToast('Task restored', 'success');
    } catch {
      showToast('Failed to restore task', 'error');
    }
  };

  const renderTask = (task: Task) => {
    const isEditing = editingId === task.id;
    const isConfirmingDelete = confirmDeleteId === task.id;

    return (
      <motion.div
        key={task.id}
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className={cn(
          'flex items-center gap-3 rounded-xl px-4 py-3',
          task.active ? 'bg-surface' : 'bg-surface/60',
        )}
      >
        {isEditing ? (
          <div className="flex flex-1 items-center gap-2">
            <input
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRenameConfirm(task.id);
                if (e.key === 'Escape') setEditingId(null);
              }}
              autoFocus
              className="flex-1 rounded-lg bg-bg px-3 py-1.5 text-sm text-text-primary outline-none ring-1 ring-white/10 focus:ring-accent"
            />
            <button
              onClick={() => handleRenameConfirm(task.id)}
              className="rounded-lg p-1 text-green-400 hover:bg-white/10"
            >
              <Check className="h-4 w-4" />
            </button>
            <button
              onClick={() => setEditingId(null)}
              className="rounded-lg p-1 text-text-secondary hover:bg-white/10"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <>
            <span
              className={cn(
                'flex-1 text-sm',
                task.active ? 'text-text-primary' : 'text-text-secondary line-through',
              )}
            >
              {task.name}
            </span>
            <span
              className={cn(
                'rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider',
                task.active
                  ? 'bg-green-500/10 text-green-400'
                  : 'bg-[#8A8A92]/10 text-text-secondary',
              )}
            >
              {task.active ? 'active' : 'archived'}
            </span>
          </>
        )}

        <div className="flex items-center gap-1">
          {task.active && !isEditing && (
            <>
              <button
                onClick={() => handleRenameStart(task)}
                className="rounded-lg p-1.5 text-text-secondary transition-colors hover:bg-white/10 hover:text-text-primary"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
              {isConfirmingDelete ? (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="rounded-lg px-2 py-1 text-xs font-medium text-red-400 hover:bg-red-500/10"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setConfirmDeleteId(null)}
                    className="rounded-lg p-1 text-text-secondary hover:bg-white/10"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmDeleteId(task.id)}
                  className="rounded-lg p-1.5 text-text-secondary transition-colors hover:bg-white/10 hover:text-red-400"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </>
          )}
          {!task.active && !isEditing && (
            <button
              onClick={() => handleRestore(task.id)}
              className="rounded-lg p-1.5 text-text-secondary transition-colors hover:bg-white/10 hover:text-accent"
              title="Restore task"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div>
      <AddTaskInput />

      <div className="space-y-3">
        <div>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Active Tasks
          </h3>
          <AnimatePresence mode="popLayout">
            {activeTasks.length === 0 ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-4 text-center text-sm text-text-secondary"
              >
                No active tasks yet
              </motion.p>
            ) : (
              <div className="space-y-2">
                {activeTasks.map(renderTask)}
              </div>
            )}
          </AnimatePresence>
        </div>

        {archivedTasks.length > 0 && (
          <div>
            <h3 className="mb-2 mt-6 text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Archived Tasks
            </h3>
            <AnimatePresence mode="popLayout">
              <div className="space-y-2">
                {archivedTasks.map(renderTask)}
              </div>
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
