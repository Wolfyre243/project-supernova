import { APIError } from '@/lib/exceptions';

/**
 * Parses the scope string and returns the corresponding date range.
 * @param scope The scope string (e.g., "day", "week", "month", "year").
 * @returns An object containing the start and end dates for the current and previous periods.
 */
export function parseScope(
  scope: string,
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

  if (scope === 'month') {
    startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    endDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0,
    );

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
    previousEndDate.setHours(23, 59, 59, 999);
  } else if (scope === 'week') {
    const dayOfWeek = currentDate.getDay();
    startDate = new Date(currentDate);
    startDate.setDate(
      currentDate.getDate() - (dayOfWeek === 0 ? 7 : dayOfWeek) + 1,
    );
    startDate.setHours(0, 0, 0, 0);
    endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    endDate.setHours(23, 59, 59, 999);

    // Previous week
    previousStartDate = new Date(startDate);
    previousStartDate.setDate(startDate.getDate() - 7);
    previousEndDate = new Date(startDate);
    previousEndDate.setHours(23, 59, 59, 999);
  } else if (scope === 'year') {
    startDate = new Date(currentDate.getFullYear(), 0, 1);
    endDate = new Date(currentDate.getFullYear() + 1, 0, 1);
    endDate.setHours(23, 59, 59, 999);

    // Previous year
    previousStartDate = new Date(currentDate.getFullYear() - 1, 0, 1);
    previousEndDate = new Date(currentDate.getFullYear(), 0, 1);
    previousEndDate.setHours(23, 59, 59, 999);
  } else if (scope === 'all') {
    startDate = new Date(currentDate.getFullYear(), 0, 1);
    endDate = new Date(currentDate.getFullYear() + 1, 0, 1);
    endDate.setHours(23, 59, 59, 999);

    // Previous year
    previousStartDate = new Date(currentDate.getFullYear() - 1, 0, 1);
    previousEndDate = new Date(currentDate.getFullYear(), 0, 1);
    previousEndDate.setHours(23, 59, 59, 999);
  } else {
    // Fallback to month or throw an error
    throw new APIError(`Unsupported scope: ${scope}`, 400);
  }

  return {
    startDate,
    endDate,
    previousStartDate,
    previousEndDate,
  };
}
