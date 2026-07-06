import { motion } from 'motion/react';
import { isToday, format } from 'date-fns';
import { cn } from '../../utils/cn';
import type { DayStatus } from '../../types';

interface DayCellProps {
  date: Date;
  status: DayStatus;
  onClick: () => void;
}

const colorMap: Record<DayStatus, { bg: string; text: string }> = {
  perfect: { bg: 'bg-[#10B981]', text: 'text-white' },
  partial: { bg: 'bg-[#F59E0B]', text: 'text-white' },
  missed: { bg: 'bg-[#EF4444]', text: 'text-white' },
  'no-tasks': { bg: 'bg-surface-elevated', text: 'text-text-secondary' },
  'in-progress': { bg: 'bg-[#6366F1]', text: 'text-white' },
  future: { bg: 'bg-surface', text: 'text-text-disabled' },
};

export function DayCell({ date, status, onClick }: DayCellProps) {
  const today = isToday(date);
  const colors = colorMap[status];

  return (
    <motion.button
      onClick={status !== 'future' ? onClick : undefined}
      className={cn(
        'relative flex h-9 w-full min-w-0 items-center justify-center rounded-lg text-sm font-medium',
        colors.bg,
        colors.text,
        status === 'in-progress' && 'ring-2 ring-accent ring-offset-1 ring-offset-inset',
        today && 'ring-2 ring-accent ring-offset-2 ring-offset-inset',
        status !== 'future' ? 'cursor-pointer' : 'cursor-default',
      )}
      whileHover={status !== 'future' ? { scale: 1.05, zIndex: 10 } : undefined}
      whileTap={status !== 'future' ? { scale: 0.95 } : undefined}
    >
      {format(date, 'd')}
    </motion.button>
  );
}
