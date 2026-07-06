import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, XCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useDailyRecordStore } from '../../state/useDailyRecordStore';
import { useUIStore } from '../../state/useUIStore';
import { useSettingsStore } from '../../state/useSettingsStore';
import { todayStr } from '../../utils/date';
import { cn } from '../../utils/cn';
import { ProgressBar } from '../ui/ProgressBar';
import type { DayDetail } from '../../types';

export function DayDetailPanel() {
  const { selectedCalendarDate, setSelectedCalendarDate } = useUIStore();
  const { getDayDetail } = useDailyRecordStore();
  const { settings } = useSettingsStore();

  const [detail, setDetail] = useState<DayDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [toggledTasks, setToggledTasks] = useState<Set<string>>(new Set());

  const isOpen = selectedCalendarDate !== null;

  useEffect(() => {
    if (!selectedCalendarDate) {
      setDetail(null);
      setToggledTasks(new Set());
      return;
    }
    setLoading(true);
    getDayDetail(selectedCalendarDate)
      .then((d) => {
        setDetail(d);
        setToggledTasks(new Set(d.completedTaskNames));
      })
      .finally(() => setLoading(false));
  }, [selectedCalendarDate, getDayDetail]);

  const handleClose = useCallback(() => {
    setSelectedCalendarDate(null);
  }, [setSelectedCalendarDate]);

  const today = todayStr();
  const canEdit = detail ? detail.date === today || !settings.lockPastDays : false;

  const handleToggle = useCallback((taskName: string) => {
    setToggledTasks((prev) => {
      const next = new Set(prev);
      if (next.has(taskName)) {
        next.delete(taskName);
      } else {
        next.add(taskName);
      }
      return next;
    });
  }, []);

  const formatDateLabel = (dateStr: string) => {
    return format(parseISO(dateStr), 'EEEE, MMMM d, yyyy');
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
          />
          <motion.div
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-surface shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <h2 className="text-base font-semibold text-text-primary">
                {detail ? formatDateLabel(detail.date) : ''}
              </h2>
              <button
                onClick={handleClose}
                className="rounded-lg p-1.5 text-text-secondary transition-colors hover:bg-white/10 hover:text-text-primary"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              {loading && (
                <div className="flex items-center justify-center py-12">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#6366F1] border-t-transparent" />
                </div>
              )}

              {!loading && !detail && (
                <p className="text-center text-sm text-text-secondary">No data available</p>
              )}

              {!loading && detail && (
                <div className="space-y-6">
                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm text-text-secondary">Completion</span>
                      <span className="text-sm font-medium text-text-primary">
                        {detail.completionPercentage}%
                      </span>
                    </div>
                    <ProgressBar value={detail.completionPercentage} size="md" />
                  </div>

                  {detail.status === 'no-tasks' && (
                    <p className="rounded-lg bg-surface-elevated px-4 py-3 text-center text-sm text-text-secondary">
                      No tasks were configured on this day
                    </p>
                  )}

                  {detail.completedTaskNames.length > 0 && (
                    <div>
                      <h3 className="mb-2 flex items-center gap-2 text-sm font-medium text-[#10B981]">
                        <Check className="h-4 w-4" />
                        Completed
                      </h3>
                      <ul className="space-y-1.5">
                        {detail.completedTaskNames.map((name) => (
                          <li key={name}>
                            {canEdit ? (
                              <label className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm text-text-primary transition-colors hover:bg-white/5">
                                <input
                                  type="checkbox"
                                  checked={toggledTasks.has(name)}
                                  onChange={() => handleToggle(name)}
                                  className="h-4 w-4 accent-accent"
                                />
                                {name}
                              </label>
                            ) : (
                              <span className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-text-primary">
                                <Check className="h-4 w-4 shrink-0 text-[#10B981]" />
                                {name}
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {detail.missedTaskNames.length > 0 && (
                    <div>
                      <h3 className="mb-2 flex items-center gap-2 text-sm font-medium text-[#EF4444]">
                        <XCircle className="h-4 w-4" />
                        Missed
                      </h3>
                      <ul className="space-y-1.5">
                        {detail.missedTaskNames.map((name) => (
                          <li key={name}>
                            {canEdit ? (
                              <label className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm text-text-primary transition-colors hover:bg-white/5">
                                <input
                                  type="checkbox"
                                  checked={toggledTasks.has(name)}
                                  onChange={() => handleToggle(name)}
                                  className="h-4 w-4 accent-accent"
                                />
                                {name}
                              </label>
                            ) : (
                              <span className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-text-secondary">
                                <XCircle className="h-4 w-4 shrink-0 text-[#EF4444]" />
                                {name}
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}
