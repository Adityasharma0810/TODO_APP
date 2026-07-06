import { useEffect } from 'react';
import { useDailyRecordStore } from '../state/useDailyRecordStore';

export function useMidnightRollover() {
  const runRollover = useDailyRecordStore((s) => s.runRolloverIfNeeded);
  const loadToday = useDailyRecordStore((s) => s.loadToday);

  useEffect(() => {
    const now = new Date();
    const msUntilMidnight =
      new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0).getTime() - now.getTime();

    const timer = setTimeout(async () => {
      await runRollover();
      await loadToday();
    }, msUntilMidnight + 1000);

    return () => clearTimeout(timer);
  }, [runRollover, loadToday]);
}
