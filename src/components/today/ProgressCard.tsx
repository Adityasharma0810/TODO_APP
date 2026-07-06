import { useDailyRecordStore } from '../../state/useDailyRecordStore';
import { useTaskStore } from '../../state/useTaskStore';
import { motion } from 'motion/react';
import { ListChecks } from 'lucide-react';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';
import { EmptyState } from '../ui/EmptyState';
import { fadeIn, slideUp } from '../../animations/variants';

export function ProgressCard() {
  const { todayRecord } = useDailyRecordStore();
  const { tasks } = useTaskStore();
  const activeTasks = tasks.filter((t) => t.active);

  if (activeTasks.length === 0) {
    return (
      <motion.div
        variants={fadeIn}
        initial="initial"
        animate="animate"
        className="mb-6"
      >
        <Card>
          <EmptyState
            icon={ListChecks}
            title="No tasks yet"
            description="No tasks yet — add your first recurring task"
          />
        </Card>
      </motion.div>
    );
  }

  const total = todayRecord?.totalTasks ?? activeTasks.length;
  const completed = todayRecord?.completedTasks ?? 0;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <motion.div
      variants={fadeIn}
      initial="initial"
      animate="animate"
      className="mb-6"
    >
      <motion.div variants={slideUp} initial="initial" animate="animate">
        <Card accent="header">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ListChecks className="h-5 w-5 text-accent" />
              <span className="text-sm font-medium text-text-primary">
                Today's Progress
              </span>
            </div>
            <span className="text-sm tabular-nums text-text-secondary">
              {completed} / {total} Tasks Completed
            </span>
          </div>
          <ProgressBar value={percentage} size="lg" showLabel color="var(--color-accent)" />
        </Card>
      </motion.div>
    </motion.div>
  );
}
