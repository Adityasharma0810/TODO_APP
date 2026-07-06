import { motion } from 'motion/react';
import { cn } from '../../utils/cn';

type ProgressSize = 'sm' | 'md' | 'lg';

interface ProgressBarProps {
  value: number;
  max?: number;
  size?: ProgressSize;
  showLabel?: boolean;
  color?: string;
  className?: string;
}

const heightStyles: Record<ProgressSize, string> = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
};

export function ProgressBar({
  value,
  max = 100,
  size = 'md',
  showLabel = false,
  color,
  className,
}: ProgressBarProps) {
  const clampedValue = Math.min(value, max);
  const percentage = max > 0 ? (clampedValue / max) * 100 : 0;

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div
        className={cn(
          'flex-1 overflow-hidden rounded-full bg-surface-elevated',
          heightStyles[size],
        )}
      >
        <motion.div
          className={cn('h-full rounded-full', heightStyles[size])}
          style={{
            backgroundColor: color ?? undefined,
          }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{
            type: 'spring',
            stiffness: 120,
            damping: 20,
          }}
        />
      </div>
      {showLabel && (
        <span className="text-sm tabular-nums text-text-secondary">
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  );
}
