import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'motion/react';
import { isSameMonth } from 'date-fns';
import { slideUp } from '../animations/variants';
import { useDailyRecordStore } from '../state/useDailyRecordStore';
import { useUIStore } from '../state/useUIStore';
import { CalendarNav } from '../components/calendar/CalendarNav';
import { HeatmapCalendar } from '../components/calendar/HeatmapCalendar';
import { MonthSummaryCard } from '../components/calendar/MonthSummaryCard';
import { DayDetailPanel } from '../components/calendar/DayDetailPanel';

export function CalendarPage() {
  const [viewDate, setViewDate] = useState(new Date());
  const { recordsByDate, loadMonth } = useDailyRecordStore();
  const { selectedCalendarDate } = useUIStore();

  const isCurrentMonth = isSameMonth(viewDate, new Date());

  useEffect(() => {
    loadMonth(viewDate.getFullYear(), viewDate.getMonth() + 1);
  }, [viewDate, loadMonth]);

  const handlePrevMonth = useCallback(() => {
    setViewDate((prev) => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() - 1);
      return d;
    });
  }, []);

  const handleNextMonth = useCallback(() => {
    setViewDate((prev) => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() + 1);
      return d;
    });
  }, []);

  const handleToday = useCallback(() => {
    setViewDate(new Date());
  }, []);

  const monthRecords = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = String(viewDate.getMonth() + 1).padStart(2, '0');
    const prefix = `${year}-${month}`;
    return Object.entries(recordsByDate)
      .filter(([date]) => date.startsWith(prefix))
      .map(([, record]) => record);
  }, [recordsByDate, viewDate]);

  const handleToggleView = useCallback((year: number, month: number) => {
    setViewDate(new Date(year, month));
  }, []);

  return (
    <motion.div
      variants={slideUp}
      initial="initial"
      animate="animate"
      exit="exit"
      className="mx-auto max-w-3xl space-y-6 overflow-y-auto"
    >
      <h1 className="text-2xl font-bold text-text-primary">Calendar</h1>

      <CalendarNav
        currentDate={viewDate}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onToday={handleToday}
      />

      {isCurrentMonth ? (
        <HeatmapCalendar />
      ) : (
        <MonthSummaryCard
          year={viewDate.getFullYear()}
          month={viewDate.getMonth()}
          records={monthRecords}
          onToggleView={handleToggleView}
        />
      )}

      {selectedCalendarDate && <DayDetailPanel />}
    </motion.div>
  );
}
