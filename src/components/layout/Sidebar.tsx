import { type ReactNode } from 'react';
import { motion } from 'motion/react';
import { CheckSquare, BarChart3, Calendar, Settings, Menu, X } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useUIStore } from '../../state/useUIStore';

interface NavItem {
  id: 'today' | 'statistics' | 'calendar' | 'settings';
  label: string;
  icon: ReactNode;
}

const navItems: NavItem[] = [
  { id: 'today', label: 'Today', icon: <CheckSquare className="h-5 w-5" /> },
  { id: 'statistics', label: 'Statistics', icon: <BarChart3 className="h-5 w-5" /> },
  { id: 'calendar', label: 'Calendar', icon: <Calendar className="h-5 w-5" /> },
  { id: 'settings', label: 'Settings', icon: <Settings className="h-5 w-5" /> },
];

export function Sidebar() {
  const currentView = useUIStore((s) => s.currentView);
  const setView = useUIStore((s) => s.setView);
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);

  return (
    <>
      <motion.button
        onClick={toggleSidebar}
        className="fixed left-3 top-3 z-50 rounded-lg p-2 text-text-secondary transition-colors hover:bg-white/10 hover:text-text-primary"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </motion.button>

      <motion.aside
        initial={false}
        animate={{ x: sidebarOpen ? 0 : -260 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed left-0 top-0 z-40 flex h-screen w-[240px] flex-col border-r border-border bg-surface"
      >
        <div className="flex items-center gap-2.5 px-5 pt-6 pb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
            <CheckSquare className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-semibold text-text-primary">Daily Tracker</span>
        </div>

        <nav className="flex flex-col gap-1 px-3">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <motion.button
                key={item.id}
                layout
                onClick={() => setView(item.id)}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-accent/15 text-accent'
                    : 'text-text-secondary hover:bg-white/5 hover:text-text-primary',
                )}
              >
                {item.icon}
                <span>{item.label}</span>
              </motion.button>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-border px-5 py-4">
          <div className="flex items-center gap-2 text-xs text-text-secondary">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
            <span>100% Offline</span>
          </div>
          <p className="mt-1 text-[11px] text-text-placeholder">v1.0.0</p>
        </div>
      </motion.aside>
    </>
  );
}
