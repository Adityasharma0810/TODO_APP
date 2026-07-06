import { useState, useEffect } from 'react';
import {
  format, startOfMonth, eachDayOfInterval, getDay,
  isSameDay, isFuture, addMonths, subMonths,
} from 'date-fns';
import { useDailyRecordStore } from '../../state/useDailyRecordStore';
import { useUIStore } from '../../state/useUIStore';
import { classifyDay } from '../../utils/statistics';
import type { DayStatus } from '../../types';
import { DayCell } from './DayCell';
import { CalendarNav } from './CalendarNav';

export function HeatmapCalendar() {
  const [displayedMonth, setDisplayedMonth] = useState(new Date());
  const { recordsByDate, loadMonth } = useDailyRecordStore();
  const { selectedCalendarDate, setSelectedCalendarDate } = useUIStore();

  useEffect(() => {
    loadMonth(displayedMonth.getFullYear(), displayedMonth.getMonth() + 1);
  }, [displayedMonth, loadMonth]);

  const monthStart = startOfMonth(displayedMonth);
  const dayOfWeek = getDay(monthStart);
  const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const gridStart = new Date(monthStart);
  gridStart.setDate(gridStart.getDate() - diff);
  const gridEnd = new Date(gridStart);
  gridEnd.setDate(gridStart.getDate() + 41);
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

  const dayHeaders = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(gridStart);
    d.setDate(d.getDate() + i);
    return format(d, 'EEE');
  });

  const handlePrevMonth = () => setDisplayedMonth((prev) => subMonths(prev, 1));
  const handleNextMonth = () => setDisplayedMonth((prev) => addMonths(prev, 1));
  const handleToday = () => setDisplayedMonth(new Date());

  const getStatusForDay = (date: Date): DayStatus => {
    const dateStr = format(date, 'yyyy-MM-dd');
    if (isFuture(date)) return 'future';
    const record = recordsByDate[dateStr];
    if (!record) return 'no-tasks';
    return classifyDay(record, dateStr);
  };

  return (
    <div className="space-y-3">
      <CalendarNav
        currentDate={displayedMonth}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onToday={handleToday}
      />
      <div className="grid w-full grid-cols-7 gap-1.5">
        {dayHeaders.map((day) => (
          <div
            key={day}
            className="py-1 text-center text-xs font-medium text-text-secondary"
          >
            {day}
          </div>
        ))}
        {days.map((date) => (
          <DayCell
            key={date.toISOString()}
            date={date}
            status={getStatusForDay(date)}
            onClick={() => {
              if (!isFuture(date)) {
                setSelectedCalendarDate(format(date, 'yyyy-MM-dd'));
              }
            }}
          />
        ))}
      </div>
    </div>
  );
}
