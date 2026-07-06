import { useMemo } from 'react';
import { motion } from 'motion/react';
import { ResponsiveContainer, BarChart, Bar, Cell, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { cn } from '../../utils/cn';
import type { TaskCompletionStat } from '../../types';

interface TaskCompletionBarChartProps {
  data: TaskCompletionStat[];
  className?: string;
}

export function TaskCompletionBarChart({ data, className }: TaskCompletionBarChartProps) {
  const sorted = useMemo(
    () => [...data].sort((a, b) => b.lifetimeCompletionPercentage - a.lifetimeCompletionPercentage),
    [data],
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.3, delay: 0.2 } }}
      className={cn('rounded-xl bg-surface p-5', className)}
    >
      <h3 className="mb-4 text-sm font-medium text-text-primary">Task Completion %</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={sorted}
            layout="vertical"
            margin={{ top: 4, right: 16, bottom: 4, left: 0 }}
          >
            <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" horizontal={false} />
            <XAxis
              type="number"
              domain={[0, 100]}
              tick={{ fill: 'var(--color-text-tertiary)', fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: 'var(--color-border)' }}
              tickFormatter={(v: number) => `${v}%`}
            />
            <YAxis
              type="category"
              dataKey="taskName"
              tick={{ fill: 'var(--color-text-tertiary)', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              width={140}
              tickFormatter={(v: string, i: number) => {
                const item = sorted[i];
                if (!item) return v;
                return item.isArchived ? `${v} (archived)` : v;
              }}
            />
            <Tooltip
              contentStyle={{
                background: 'var(--color-surface-elevated)',
                border: '1px solid var(--color-border)',
                borderRadius: 8,
                fontSize: 13,
                color: 'var(--color-text-primary)',
              }}
              formatter={(value, _name, entry) => {
                const payload = entry?.payload as TaskCompletionStat | undefined;
                const label = payload?.isArchived
                  ? `${payload.taskName} (archived)`
                  : payload?.taskName ?? '';
                return [`${Math.round(Number(value))}%`, label];
              }}
            />
            <Bar
              dataKey="lifetimeCompletionPercentage"
              radius={[0, 4, 4, 0]}
              maxBarSize={20}
            >
              {sorted.map((entry, idx) => (
                <Cell key={idx} fill="var(--color-accent)" opacity={entry.isArchived ? 0.4 : 1} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
