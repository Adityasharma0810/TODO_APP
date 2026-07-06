import { useCallback } from 'react';
import { motion } from 'motion/react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useTaskStore } from '../../state/useTaskStore';
import { TaskRow } from './TaskRow';
import { fadeIn, staggerContainer, staggerItem } from '../../animations/variants';

export function TaskList() {
  const { tasks, reorderTasks } = useTaskStore();
  const activeTasks = tasks.filter((t) => t.active);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const oldIndex = activeTasks.findIndex((t) => t.id === active.id);
      const newIndex = activeTasks.findIndex((t) => t.id === over.id);
      if (oldIndex === -1 || newIndex === -1) return;

      const reordered = [...activeTasks];
      const [moved] = reordered.splice(oldIndex, 1);
      reordered.splice(newIndex, 0, moved);
      reorderTasks(reordered.map((t) => t.id));
    },
    [activeTasks, reorderTasks],
  );

  if (activeTasks.length === 0) return null;

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="mb-6"
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={activeTasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col gap-2">
            {activeTasks.map((task) => (
              <motion.div key={task.id} variants={staggerItem}>
                <TaskRow task={task} />
              </motion.div>
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </motion.div>
  );
}
