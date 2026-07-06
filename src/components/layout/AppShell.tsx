import { useEffect } from 'react';
import { useTaskStore } from '../../state/useTaskStore';
import { useDailyRecordStore } from '../../state/useDailyRecordStore';
import { useSettingsStore } from '../../state/useSettingsStore';
import { useUIStore } from '../../state/useUIStore';
import { useTheme } from '../../hooks/useTheme';
import { useMidnightRollover } from '../../hooks/useMidnightRollover';
import { Sidebar } from './Sidebar';
import { ToastContainer } from '../ui/Toast';
import { TodayPage } from '../../pages/TodayPage';
import { StatisticsPage } from '../../pages/StatisticsPage';
import { CalendarPage } from '../../pages/CalendarPage';
import { SettingsPage } from '../../pages/SettingsPage';
import { cn } from '../../utils/cn';

const pageMap: Record<string, React.ComponentType> = {
  today: TodayPage,
  statistics: StatisticsPage,
  calendar: CalendarPage,
  settings: SettingsPage,
};

export function AppShell() {
  const currentView = useUIStore((s) => s.currentView);
  const toast = useUIStore((s) => s.toast);
  const clearToast = useUIStore((s) => s.clearToast);
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);

  const loadTasks = useTaskStore((s) => s.loadTasks);
  const runRolloverIfNeeded = useDailyRecordStore((s) => s.runRolloverIfNeeded);
  const loadToday = useDailyRecordStore((s) => s.loadToday);
  const loadStatistics = useDailyRecordStore((s) => s.loadStatistics);
  const loadSettings = useSettingsStore((s) => s.loadSettings);

  useTheme();
  useMidnightRollover();

  useEffect(() => {
    const init = async () => {
      await loadTasks();
      await runRolloverIfNeeded();
      await loadToday();
      await loadStatistics();
      await loadSettings();
    };
    init();
  }, [loadTasks, runRolloverIfNeeded, loadToday, loadStatistics, loadSettings]);

  const PageComponent = pageMap[currentView];
  const toastArray = toast ? [{ id: 'global-toast', ...toast }] : [];

  return (
    <div className="flex h-screen bg-bg text-text-primary overflow-hidden">
      <Sidebar />
      <main
        className={cn(
          'flex-1 overflow-y-auto p-6 transition-all duration-300',
          sidebarOpen ? 'ml-[240px]' : 'ml-0',
        )}
      >
        <PageComponent />
      </main>
      <ToastContainer toasts={toastArray} onRemove={() => clearToast()} />
    </div>
  );
}
