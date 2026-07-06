import { format, addDays, parseISO } from 'date-fns';

export function todayStr(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

export function nextDayStr(d: string): string {
  return format(addDays(parseISO(d), 1), 'yyyy-MM-dd');
}

export function previousDayStr(d: string): string {
  return format(addDays(parseISO(d), -1), 'yyyy-MM-dd');
}

export function formatDate(dateStr: string): string {
  return format(parseISO(dateStr), 'EEEE, MMMM d');
}

export function formatDateFull(dateStr: string): string {
  return format(parseISO(dateStr), 'EEEE, MMMM d, yyyy');
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}
