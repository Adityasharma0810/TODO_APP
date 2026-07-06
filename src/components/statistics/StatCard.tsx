import { type LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../utils/cn';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  color: string;
  className?: string;
}

export function StatCard({ icon: Icon, label, value, color, className }: StatCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
      className={cn(
        'rounded-xl bg-surface p-5 flex items-center gap-4',
        className,
      )}
    >
      <div
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: `${color}1A` }}
      >
        <Icon className="h-6 w-6" style={{ color }} />
      </div>
      <div className="flex flex-col">
        <span className="text-2xl font-bold text-text-primary">{value}</span>
        <span className="text-sm text-text-tertiary">{label}</span>
      </div>
    </motion.div>
  );
}
