import { getYear, addSeconds, addMinutes, addDays, addWeeks, addMonths, addYears, isWithinInterval, isBefore, isSameDay as dateFnsSameDay, isAfter } from "date-fns";
import { DATE_UNIT_TYPES } from "./constants";

export function getCurrentYear(): number {
  return getYear(new Date());
}

export function add(date: Date, amount: number, type: DATE_UNIT_TYPES = DATE_UNIT_TYPES.DAYS): Date {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new Error('Invalid date provided');
  }
  if (typeof amount !== 'number' || isNaN(amount)) {
    throw new Error('Invalid amount provided');
  }

  switch (type) {
    case DATE_UNIT_TYPES.SECONDS:
      return addSeconds(date, amount);
    case DATE_UNIT_TYPES.MINUTES:
      return addMinutes(date, amount);
    case DATE_UNIT_TYPES.DAYS:
      return addDays(date, amount);
    case DATE_UNIT_TYPES.WEEKS:
      return addWeeks(date, amount);
    case DATE_UNIT_TYPES.MONTHS:
      return addMonths(date, amount);
    case DATE_UNIT_TYPES.YEARS:
      return addYears(date, amount);
  }
}

export function isWithinRange(date: Date, from: Date, to: Date): boolean {
  if (isAfter(from, to)) {
    throw new Error('Invalid range: from date must be before to date');
  }
  return isWithinInterval(date, { start: from, end: to }) && date.getTime() !== from.getTime() && date.getTime() !== to.getTime();
}

export function isDateBefore(date: Date, compareDate: Date): boolean {
  return isBefore(date, compareDate);
}

export function isSameDay(date: Date, compareDate: Date): boolean {
  return dateFnsSameDay(date, compareDate);
}

// Simulates fetching holidays from an API
export async function getHolidays(year: number): Promise<Date[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        new Date(year, 0, 1),   // New Year's Day
        new Date(year, 11, 25), // Christmas
        new Date(year, 11, 31), // New Year's Eve
      ]);
    }, 100);
  });
}

export async function isHoliday(date: Date): Promise<boolean> {
  const holidays = await getHolidays(date.getFullYear());
  return holidays.some(holiday => isSameDay(date, holiday));
}
