import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getCurrentYear,
  add,
  isWithinRange,
  isDateBefore,
  isSameDay,
  getHolidays,
  isHoliday,
} from '../dateUtils';
import { DATE_UNIT_TYPES } from '../constants';

describe('getCurrentYear', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return the mocked year', () => {
    vi.setSystemTime(new Date(2025, 5, 15));
    expect(getCurrentYear()).toBe(2025);
  });

  it('should return a different mocked year', () => {
    vi.setSystemTime(new Date(2000, 0, 1));
    expect(getCurrentYear()).toBe(2000);
  });
});

describe('add', () => {
  it('should add days to a date', () => {
    const date = new Date(2025, 0, 1);
    const result = add(date, 5, DATE_UNIT_TYPES.DAYS);
    expect(result.getDate()).toBe(6);
    expect(result.getMonth()).toBe(0);
  });

  it('should add months to a date', () => {
    const date = new Date(2025, 0, 15);
    const result = add(date, 3, DATE_UNIT_TYPES.MONTHS);
    expect(result.getMonth()).toBe(3);
    expect(result.getFullYear()).toBe(2025);
  });

  it('should add years to a date', () => {
    const date = new Date(2025, 5, 10);
    const result = add(date, 2, DATE_UNIT_TYPES.YEARS);
    expect(result.getFullYear()).toBe(2027);
  });

  it('should default to adding days when type is not specified', () => {
    const date = new Date(2025, 0, 1);
    const result = add(date, 10);
    expect(result.getDate()).toBe(11);
  });

  it('should handle negative amounts (subtract)', () => {
    const date = new Date(2025, 0, 10);
    const result = add(date, -5, DATE_UNIT_TYPES.DAYS);
    expect(result.getDate()).toBe(5);
  });

  it('should handle zero amount', () => {
    const date = new Date(2025, 3, 15);
    const result = add(date, 0, DATE_UNIT_TYPES.DAYS);
    expect(result.getDate()).toBe(15);
    expect(result.getMonth()).toBe(3);
  });

  it('should throw on invalid date', () => {
    expect(() => add('not-a-date' as any, 5, DATE_UNIT_TYPES.DAYS)).toThrow('Invalid date provided');
  });

  it('should throw on invalid date object', () => {
    expect(() => add(new Date('invalid'), 5, DATE_UNIT_TYPES.DAYS)).toThrow('Invalid date provided');
  });

  it('should throw on invalid amount', () => {
    expect(() => add(new Date(), NaN, DATE_UNIT_TYPES.DAYS)).toThrow('Invalid amount provided');
  });
});

describe('isWithinRange', () => {
  const from = new Date(2025, 0, 1);
  const to = new Date(2025, 11, 31);

  it('should return true for a date inside the range', () => {
    const date = new Date(2025, 5, 15);
    expect(isWithinRange(date, from, to)).toBe(true);
  });

  it('should return false for a date outside the range', () => {
    const date = new Date(2026, 0, 1);
    expect(isWithinRange(date, from, to)).toBe(false);
  });

  it('should return false for a date on the lower boundary', () => {
    expect(isWithinRange(from, from, to)).toBe(false);
  });

  it('should return false for a date on the upper boundary', () => {
    expect(isWithinRange(to, from, to)).toBe(false);
  });

  it('should throw when from is after to', () => {
    expect(() => isWithinRange(new Date(2025, 5, 1), to, from)).toThrow(
      'Invalid range: from date must be before to date'
    );
  });
});

describe('isDateBefore', () => {
  it('should return true when date is before compareDate', () => {
    const date = new Date(2025, 0, 1);
    const compareDate = new Date(2025, 5, 1);
    expect(isDateBefore(date, compareDate)).toBe(true);
  });

  it('should return false when date is after compareDate', () => {
    const date = new Date(2025, 5, 1);
    const compareDate = new Date(2025, 0, 1);
    expect(isDateBefore(date, compareDate)).toBe(false);
  });

  it('should return false when dates are the same', () => {
    const date = new Date(2025, 5, 1);
    expect(isDateBefore(date, new Date(date))).toBe(false);
  });
});

describe('isSameDay', () => {
  it('should return true for the same day with different times', () => {
    const a = new Date(2025, 5, 15, 10, 0, 0);
    const b = new Date(2025, 5, 15, 23, 59, 59);
    expect(isSameDay(a, b)).toBe(true);
  });

  it('should return false for different days', () => {
    const a = new Date(2025, 5, 15);
    const b = new Date(2025, 5, 16);
    expect(isSameDay(a, b)).toBe(false);
  });

  it('should return true for exactly the same date', () => {
    const date = new Date(2025, 5, 15);
    expect(isSameDay(date, new Date(date))).toBe(true);
  });
});

describe('getHolidays', () => {
  it('should return an array of dates for the given year', async () => {
    const holidays = await getHolidays(2025);
    expect(Array.isArray(holidays)).toBe(true);
    expect(holidays.length).toBeGreaterThan(0);
  });

  it("should include New Year's Day", async () => {
    const holidays = await getHolidays(2025);
    const hasNewYear = holidays.some(
      (d) => d.getMonth() === 0 && d.getDate() === 1
    );
    expect(hasNewYear).toBe(true);
  });

  it('should include Christmas', async () => {
    const holidays = await getHolidays(2025);
    const hasChristmas = holidays.some(
      (d) => d.getMonth() === 11 && d.getDate() === 25
    );
    expect(hasChristmas).toBe(true);
  });

  it('should return holidays for the correct year', async () => {
    const holidays = await getHolidays(2030);
    holidays.forEach((d) => {
      expect(d.getFullYear()).toBe(2030);
    });
  });
});

describe('isHoliday', () => {
  it("should return true for a known holiday (New Year's Day)", async () => {
    const newYear = new Date(2025, 0, 1);
    expect(await isHoliday(newYear)).toBe(true);
  });

  it('should return true for Christmas', async () => {
    const christmas = new Date(2025, 11, 25);
    expect(await isHoliday(christmas)).toBe(true);
  });

  it('should return false for a non-holiday date', async () => {
    const regularDay = new Date(2025, 6, 15);
    expect(await isHoliday(regularDay)).toBe(false);
  });
});
