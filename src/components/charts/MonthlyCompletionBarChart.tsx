import { useState } from 'react';
import { motion } from 'motion/react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { cn } from '../../utils/cn';

interface DataPoint {
  month: string;
  completion: number;
}

interface MonthlyCompletionBarChartProps {
  data: DataPoint[];
  className?: string;
}

export function MonthlyCompletionBarChart({ data, className }: MonthlyCompletionBarChartProps) {
  const [allTime, setAllTime] = useState(false);

  const displayData = allTime ? data : data.slice(-12);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.3, delay: 0.1 } }}
      className={cn('rounded-xl bg-surface p-5', className)}
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-medium text-text-primary">Monthly Completion %</h3>
        <button
          onClick={() => setAllTime((p) => !p)}
          className={cn(
            'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
            allTime
              ? 'bg-accent text-white'
              : 'text-text-tertiary hover:text-text-primary',
          )}
        >
          {allTime ? 'Last 12' : 'All time'}
        </button>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={displayData} margin={{ top: 4, right: 4, bottom: 4, left: -16 }}>
            <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fill: 'var(--color-text-tertiary)', fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: 'var(--color-border)' }}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fill: 'var(--color-text-tertiary)', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => `${v}%`}
            />
            <Tooltip
              contentStyle={{
                background: 'var(--color-surface-elevated)',
                border: '1px solid var(--color-border)',
                borderRadius: 8,
                fontSize: 13,
                color: 'var(--color-text-primary)',
              }}
              formatter={(value) => [`${Math.round(Number(value))}%`, 'Completion']}
            />
            <Bar
              dataKey="completion"
              fill="var(--color-accent)"
              radius={[4, 4, 0, 0]}
              maxBarSize={32}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
