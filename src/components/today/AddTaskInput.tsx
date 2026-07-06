import { useState } from 'react';
import { motion } from 'motion/react';
import { Plus } from 'lucide-react';
import { useTaskStore } from '../../state/useTaskStore';
import { cn } from '../../utils/cn';
import { fadeIn, slideUp } from '../../animations/variants';

export function AddTaskInput() {
  const [name, setName] = useState('');
  const { addTask } = useTaskStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    await addTask(trimmed.slice(0, 60));
    setName('');
  };

  return (
    <motion.form
      variants={fadeIn}
      initial="initial"
      animate="animate"
      onSubmit={handleSubmit}
      className="mb-6"
    >
      <motion.div variants={slideUp} initial="initial" animate="animate" className="relative">
        <input
          value={name}
          onChange={(e) => setName(e.target.value.slice(0, 60))}
          placeholder="Add a new task…"
          maxLength={60}
          className={cn(
            'w-full rounded-xl bg-surface py-3 pl-11 pr-4 text-sm text-text-primary',
            'placeholder:text-text-placeholder outline-none',
            'border border-border transition-colors',
            'focus:border-accent/50 focus:bg-input-focus',
          )}
        />
        <button
          type="submit"
          disabled={!name.trim()}
          className={cn(
            'absolute left-0 top-0 flex h-full w-10 items-center justify-center',
            'text-text-disabled transition-colors',
            'disabled:opacity-30 disabled:cursor-not-allowed',
            name.trim() && 'text-accent hover:text-accent',
          )}
        >
          <Plus className="h-5 w-5" />
        </button>
      </motion.div>
    </motion.form>
  );
}
