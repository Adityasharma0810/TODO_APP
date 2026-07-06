import { useState } from 'react';
import { motion } from 'motion/react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { cn } from '../../utils/cn';

interface DataPoint {
  date: string;
  completion: number;
}

interface DailyCompletionLineChartProps {
  data: DataPoint[];
  className?: string;
}

type RangeKey = 7 | 30 | 90 | 365 | -1;

const ranges: { key: RangeKey; label: string }[] = [
  { key: 7, label: '7d' },
  { key: 30, label: '30d' },
  { key: 90, label: '90d' },
  { key: 365, label: '1y' },
  { key: -1, label: 'All' },
];

export function DailyCompletionLineChart({ data, className }: DailyCompletionLineChartProps) {
  const [range, setRange] = useState<RangeKey>(30);

  const filteredData = range === -1 ? data : data.slice(-range);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.3 } }}
      className={cn('rounded-xl bg-surface p-5', className)}
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-medium text-text-primary">Daily Completion %</h3>
        <div className="flex gap-1">
          {ranges.map((r) => (
            <button
              key={r.key}
              onClick={() => setRange(r.key)}
              className={cn(
                'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                range === r.key
                  ? 'bg-accent text-white'
                  : 'text-text-tertiary hover:text-text-primary',
              )}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={filteredData} margin={{ top: 4, right: 4, bottom: 4, left: -16 }}>
            <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fill: 'var(--color-text-tertiary)', fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: 'var(--color-border)' }}
              tickFormatter={(v: string) => {
                const d = new Date(v);
                return `${d.getMonth() + 1}/${d.getDate()}`;
              }}
              interval="preserveStartEnd"
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
              labelFormatter={(v) => String(v)}
              formatter={(value) => [`${Math.round(Number(value))}%`, 'Completion']}
            />
            <Line
              type="monotone"
              dataKey="completion"
              stroke="var(--color-accent)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: 'var(--color-accent)' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
