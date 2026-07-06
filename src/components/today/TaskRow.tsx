import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, PencilLine } from 'lucide-react';
import { useTaskStore } from '../../state/useTaskStore';
import { useDailyRecordStore } from '../../state/useDailyRecordStore';
import { Checkbox } from '../ui/Checkbox';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import type { Task } from '../../types';

interface TaskRowProps {
  task: Task;
}

export function TaskRow({ task }: TaskRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(task.name);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { renameTask, deleteTask, toggleTaskCompletion } = useTaskStore();
  const todayCompletedTaskIds = useDailyRecordStore((s) => s.todayCompletedTaskIds);
  const isCompleted = todayCompletedTaskIds.has(task.id);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: 'relative' as const,
    ...(isDragging ? { zIndex: 10 } : {}),
  };

  const handleToggle = useCallback(() => {
    toggleTaskCompletion(task.id);
  }, [task.id, toggleTaskCompletion]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const startEditing = useCallback(() => {
    setEditName(task.name);
    setIsEditing(true);
  }, [task.name]);

  const cancelEditing = useCallback(() => {
    setIsEditing(false);
    setEditName(task.name);
  }, [task.name]);

  const saveEdit = useCallback(() => {
    const trimmed = editName.trim();
    if (trimmed && trimmed !== task.name) {
      renameTask(task.id, trimmed.slice(0, 60));
    }
    setIsEditing(false);
  }, [editName, task.id, task.name, renameTask]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveEdit();
    } else if (e.key === 'Escape') {
      cancelEditing();
    }
  };

  return (
    <>
      <motion.div
        ref={setNodeRef}
        style={style}
        layout
        className="flex items-center gap-3 rounded-xl bg-surface px-4 py-3"
      >
        <button
          className="touch-none text-text-disabled hover:text-text-secondary transition-colors cursor-grab active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </button>

        <Checkbox
          checked={isCompleted}
          onChange={handleToggle}
        />

        {isEditing ? (
          <input
            ref={inputRef}
            value={editName}
            onChange={(e) => setEditName(e.target.value.slice(0, 60))}
            onBlur={saveEdit}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-sm text-text-primary outline-none border-b border-indigo-500/50 pb-0.5"
          />
        ) : (
          <span
            className="flex-1 text-sm text-text-primary cursor-default truncate"
            onDoubleClick={startEditing}
          >
            {task.name}
          </span>
        )}

        {!isEditing && (
          <button
            onClick={startEditing}
            className="text-text-disabled hover:text-accent transition-colors"
          >
            <PencilLine className="h-3.5 w-3.5" />
          </button>
        )}

        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="text-text-disabled hover:text-red-400 transition-colors"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </motion.div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => deleteTask(task.id)}
        title="Delete Task"
        message={`Are you sure you want to delete "${task.name}"?`}
        confirmText="Delete"
        confirmVariant="danger"
      />
    </>
  );
}
