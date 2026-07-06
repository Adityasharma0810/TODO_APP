import { useDailyRecordStore } from '../../state/useDailyRecordStore';
import { motion } from 'motion/react';
import { getGreeting, formatDate, todayStr } from '../../utils/date';
import { fadeIn, slideUp } from '../../animations/variants';

export function GreetingHeader() {
  const { todayRecord } = useDailyRecordStore();
  const dateStr = todayRecord?.date ?? todayStr();
  const greeting = getGreeting();
  const formatted = formatDate(dateStr);

  return (
    <motion.div
      variants={fadeIn}
      initial="initial"
      animate="animate"
      className="mb-6"
    >
      <motion.div variants={slideUp} initial="initial" animate="animate">
        <p className="text-sm font-medium text-accent">{greeting}</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-text-primary">
          {formatted}
        </h1>
      </motion.div>
    </motion.div>
  );
}
