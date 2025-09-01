import { APIError } from '@/lib/exceptions';

/**
 * Parses the granularity string and returns the corresponding date range.
 * @param granularity The granularity string (e.g., "day", "week", "month", "year").
 * @returns An object containing the start and end dates for the current and previous periods.
 */
export function parseGranularity(
  granularity: string,
  currentDate: Date = new Date(),
): {
  startDate: Date;
  endDate: Date;
  previousStartDate: Date;
  previousEndDate: Date;
} {
  let startDate: Date = new Date();
  let endDate: Date = new Date();
  let previousStartDate: Date;
  let previousEndDate: Date;

  if (granularity === 'day') {
    startDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
    );
    startDate.setHours(0, 0, 0, 0); // Start of the day
    endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 1); // Start of next day

    // Previous day
    previousStartDate = new Date(startDate);
    previousStartDate.setDate(startDate.getDate() - 1);
    previousEndDate = new Date(startDate);
  } else if (granularity === 'month') {
    startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    endDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      1,
    ); // Start of next month

    // Previous month
    previousStartDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1,
    );
    previousEndDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1,
    );
  } else if (granularity === 'week') {
    const dayOfWeek = currentDate.getDay();
    startDate = new Date(currentDate);
    startDate.setDate(currentDate.getDate() - (dayOfWeek || 7) + 1);
    startDate.setHours(0, 0, 0, 0);
    endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 7);

    // Previous week
    previousStartDate = new Date(startDate);
    previousStartDate.setDate(startDate.getDate() - 7);
    previousEndDate = new Date(startDate);
  } else if (granularity === 'year') {
    startDate = new Date(currentDate.getFullYear(), 0, 1);
    endDate = new Date(currentDate.getFullYear() + 1, 0, 1);

    // Previous year
    previousStartDate = new Date(currentDate.getFullYear() - 1, 0, 1);
    previousEndDate = new Date(currentDate.getFullYear(), 0, 1);
  } else {
    // Fallback to month or throw an error
    throw new APIError(`Unsupported granularity: ${granularity}`, 400);
  }

  return {
    startDate,
    endDate,
    previousStartDate,
    previousEndDate,
  };
}
