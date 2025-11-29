import { useMemo } from 'react';

export function useOffDay() {
  const { isOffDay, nextOperationalDate } = useMemo(() => {
    const now = new Date();
    const dayOfWeek = now.getDay();

    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    let daysUntilMonday = 0;
    if (dayOfWeek === 0) {
      daysUntilMonday = 1;
    } else if (dayOfWeek === 6) {
      daysUntilMonday = 2;
    }

    const nextDate = new Date(now);
    nextDate.setDate(now.getDate() + daysUntilMonday);

    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    };
    const formattedDate = nextDate
      .toLocaleDateString('id-ID', options)
      .replace(/ /g, ' - ');

    return {
      isOffDay: isWeekend,
      nextOperationalDate: formattedDate,
    };
  }, []);

  return { isOffDay, nextOperationalDate };
}
