import { useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { slideUp } from '../animations/variants';
import { useDailyRecordStore } from '../state/useDailyRecordStore';
import { StatCardGrid } from '../components/statistics/StatCardGrid';
import { DailyCompletionLineChart } from '../components/charts/DailyCompletionLineChart';
import { MonthlyCompletionBarChart } from '../components/charts/MonthlyCompletionBarChart';
import { TaskCompletionBarChart } from '../components/charts/TaskCompletionBarChart';
import { Card } from '../components/ui/Card';

export function StatisticsPage() {
  const { statistics, recordsByDate, taskCompletionStats, loadStatistics } = useDailyRecordStore();

  useEffect(() => {
    if (!statistics) {
      loadStatistics();
    }
  }, [statistics, loadStatistics]);

  const dailyData = useMemo(() => {
    return Object.entries(recordsByDate)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, record]) => ({
        date,
        completion: record.completionPercentage,
      }));
  }, [recordsByDate]);

  const monthlyData = useMemo(() => {
    const monthMap = new Map<string, { total: number; count: number }>();
    for (const [, record] of Object.entries(recordsByDate)) {
      const month = record.date.slice(0, 7);
      const entry = monthMap.get(month);
      if (entry) {
        entry.total += record.completionPercentage;
        entry.count += 1;
      } else {
        monthMap.set(month, { total: record.completionPercentage, count: 1 });
      }
    }
    return Array.from(monthMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, { total, count }]) => ({
        month,
        completion: Math.round(total / count),
      }));
  }, [recordsByDate]);

  return (
    <motion.div
      variants={slideUp}
      initial="initial"
      animate="animate"
      exit="exit"
      className="mx-auto max-w-5xl space-y-6 overflow-y-auto"
    >
      <h1 className="text-2xl font-bold text-text-primary">Statistics</h1>

      <StatCardGrid />

      <div className="space-y-6">
        <Card>
          <h2 className="mb-4 text-sm font-medium text-text-primary">Daily Completion</h2>
          <DailyCompletionLineChart data={dailyData} />
        </Card>

        <Card>
          <h2 className="mb-4 text-sm font-medium text-text-primary">Monthly Completion</h2>
          <MonthlyCompletionBarChart data={monthlyData} />
        </Card>

        <Card>
          <h2 className="mb-4 text-sm font-medium text-text-primary">Task Completion</h2>
          <TaskCompletionBarChart data={taskCompletionStats} />
        </Card>
      </div>
    </motion.div>
  );
}
