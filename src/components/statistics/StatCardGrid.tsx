import { Flame, Trophy, Target, CheckCircle, MinusCircle, XCircle, Calendar, CheckSquare } from 'lucide-react';
import { useDailyRecordStore } from '../../state/useDailyRecordStore';
import { StatCard } from './StatCard';

const cardDefs = [
  { key: 'currentStreak', icon: Flame, label: 'Current Streak', color: '#F97316' },
  { key: 'bestStreak', icon: Trophy, label: 'Best Streak', color: '#F59E0B' },
  { key: 'overallCompletionPct', icon: Target, label: 'Overall Completion', color: '#6366F1' },
  { key: 'perfectDays', icon: CheckCircle, label: 'Perfect Days', color: '#10B981' },
  { key: 'partialDays', icon: MinusCircle, label: 'Partial Days', color: '#F59E0B' },
  { key: 'missedDays', icon: XCircle, label: 'Missed Days', color: '#F43F5E' },
  { key: 'daysTracked', icon: Calendar, label: 'Days Tracked', color: '#0EA5E9' },
  { key: 'totalTasksCompleted', icon: CheckSquare, label: 'Tasks Completed', color: '#14B8A6' },
] as const;

export function StatCardGrid() {
  const { statistics } = useDailyRecordStore();

  if (!statistics) return null;

  const formatValue = (key: string, val: number) => {
    if (key === 'overallCompletionPct') return `${Math.round(val)}%`;
    return val;
  };

  return (
    <div className="grid grid-cols-4 gap-4">
      {cardDefs.map((def) => (
        <StatCard
          key={def.key}
          icon={def.icon}
          label={def.label}
          value={formatValue(def.key, statistics[def.key as keyof typeof statistics] as number)}
          color={def.color}
        />
      ))}
    </div>
  );
}
