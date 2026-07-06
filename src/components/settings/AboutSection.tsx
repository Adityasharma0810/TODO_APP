import { motion } from 'motion/react';

const techStack = [
  'React',
  'TypeScript',
  'Tailwind CSS',
  'Motion',
  'Zustand',
  'SQLite',
  'Tauri',
];

export function AboutSection() {
  return (
    <div className="flex flex-col items-center py-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-1 text-2xl font-bold tracking-tight text-text-primary"
      >
        Daily Consistency Tracker
      </motion.div>

      <p className="mb-3 text-xs font-medium text-text-secondary">Version 1.0.0</p>

      <p className="mb-6 max-w-sm text-sm leading-relaxed text-text-secondary">
        100% offline. No account, no cloud sync — all data lives in a local SQLite database on this
        device.
      </p>

      <div className="flex flex-wrap justify-center gap-2">
        {techStack.map((tech) => (
          <span
            key={tech}
            className="rounded-full bg-surface px-3 py-1 text-[11px] font-medium text-text-secondary"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}
