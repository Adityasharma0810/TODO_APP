import { format, isSameMonth } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../utils/cn';

interface CalendarNavProps {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
}

export function CalendarNav({ currentDate, onPrevMonth, onNextMonth, onToday }: CalendarNavProps) {
  const isCurrentMonth = isSameMonth(currentDate, new Date());

  return (
    <div className="flex items-center justify-between">
      <button
        onClick={onPrevMonth}
        className="rounded-lg p-2 text-text-secondary transition-colors hover:bg-white/5 hover:text-text-primary"
        aria-label="Previous month"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <h2 className="text-base font-semibold text-text-primary">
        {format(currentDate, 'MMMM yyyy')}
      </h2>

      <div className="flex items-center gap-1">
        <button
          onClick={onToday}
          className={cn(
            'rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
            isCurrentMonth
              ? 'cursor-default text-text-disabled'
              : 'bg-surface-elevated text-text-primary hover:bg-surface-hover-alt',
          )}
          disabled={isCurrentMonth}
        >
          Today
        </button>

        <button
          onClick={onNextMonth}
          disabled={isCurrentMonth}
          className={cn(
            'rounded-lg p-2 transition-colors',
            isCurrentMonth
              ? 'cursor-default text-text-disabled'
              : 'text-text-secondary hover:bg-white/5 hover:text-text-primary',
          )}
          aria-label="Next month"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
