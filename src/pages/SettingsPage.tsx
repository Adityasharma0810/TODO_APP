import { motion } from 'motion/react';
import { slideUp } from '../animations/variants';
import { Card } from '../components/ui/Card';
import { TaskManager } from '../components/settings/TaskManager';
import { ThemeSection } from '../components/settings/ThemeSection';
import { BackupSection } from '../components/settings/BackupSection';
import { DangerZone } from '../components/settings/DangerZone';
import { AboutSection } from '../components/settings/AboutSection';

export function SettingsPage() {
  return (
    <motion.div
      variants={slideUp}
      initial="initial"
      animate="animate"
      exit="exit"
      className="mx-auto max-w-3xl space-y-6 overflow-y-auto"
    >
      <h1 className="text-2xl font-bold text-text-primary">Settings</h1>

      <Card>
        <h2 className="mb-4 text-sm font-medium text-text-primary">Manage Tasks</h2>
        <TaskManager />
      </Card>

      <Card>
        <h2 className="mb-4 text-sm font-medium text-text-primary">Theme</h2>
        <ThemeSection />
      </Card>

      <Card>
        <h2 className="mb-4 text-sm font-medium text-text-primary">Backup &amp; Restore</h2>
        <BackupSection />
      </Card>

      <Card>
        <h2 className="mb-4 text-sm font-medium text-text-primary">Danger Zone</h2>
        <DangerZone />
      </Card>

      <Card>
        <AboutSection />
      </Card>
    </motion.div>
  );
}
