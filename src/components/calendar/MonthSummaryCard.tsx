import { useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { CalendarDays } from 'lucide-react';
import { cn } from '../../utils/cn';
import { ProgressBar } from '../ui/ProgressBar';
import type { DailyRecord } from '../../types';

interface MonthSummaryCardProps {
  year: number;
  month: number;
  records: DailyRecord[];
  onToggleView: (year: number, month: number) => void;
}

export function MonthSummaryCard({ year, month, records, onToggleView }: MonthSummaryCardProps) {
  const stats = useMemo(() => {
    const daysWithTasks = records.filter((r) => r.totalTasks > 0);
    const perfect = daysWithTasks.filter((r) => r.completionPercentage >= 100).length;
    const partial = daysWithTasks.filter((r) => r.completionPercentage > 0 && r.completionPercentage < 100).length;
    const missed = daysWithTasks.filter((r) => r.completionPercentage === 0).length;
    const avgCompletion = daysWithTasks.length > 0
      ? Math.round(daysWithTasks.reduce((sum, r) => sum + r.completionPercentage, 0) / daysWithTasks.length)
      : 0;
    return { perfect, partial, missed, avgCompletion, total: records.length };
  }, [records]);

  const label = format(new Date(year, month), 'MMMM yyyy');

  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold text-text-primary">{label}</h3>
        <button
          onClick={() => onToggleView(year, month)}
          className="flex items-center gap-1.5 rounded-lg bg-surface-elevated px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:bg-surface-hover-alt hover:text-text-primary"
        >
          <CalendarDays className="h-3.5 w-3.5" />
          View details
        </button>
      </div>

      <ProgressBar
        value={stats.avgCompletion}
        size="sm"
        showLabel
        className="mb-4"
      />

      <div className="grid grid-cols-3 gap-3">
        <StatBox label="Perfect" count={stats.perfect} color="text-[#10B981]" />
        <StatBox label="Partial" count={stats.partial} color="text-[#F59E0B]" />
        <StatBox label="Missed" count={stats.missed} color="text-[#EF4444]" />
      </div>
    </div>
  );
}

function StatBox({ label, count, color }: { label: string; count: number; color: string }) {
  return (
    <div className="rounded-lg bg-inset p-3 text-center">
      <div className={cn('text-lg font-bold', color)}>{count}</div>
      <div className="text-xs text-text-secondary">{label}</div>
    </div>
  );
}
