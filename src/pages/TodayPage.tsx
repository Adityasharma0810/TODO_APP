import { motion } from 'motion/react';
import { slideUp } from '../animations/variants';
import { GreetingHeader } from '../components/today/GreetingHeader';
import { ProgressCard } from '../components/today/ProgressCard';
import { AddTaskInput } from '../components/today/AddTaskInput';
import { TaskList } from '../components/today/TaskList';

export function TodayPage() {
  return (
    <motion.div
      variants={slideUp}
      initial="initial"
      animate="animate"
      exit="exit"
      className="mx-auto max-w-2xl"
    >
      <GreetingHeader />
      <ProgressCard />
      <AddTaskInput />
      <TaskList />
    </motion.div>
  );
}
