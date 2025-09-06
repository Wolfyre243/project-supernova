// Utility functions for formatting

/**
 * @name objectToFormData
 * @description Converts an object into a FormData object, for server actions
 * @param obj
 * @returns formData
 */
export function objectToFormData(obj: Record<string, unknown>): FormData {
  const formData = new FormData();
  Object.entries(obj).forEach(([key, value]) => {
    // Converts any date value to an ISO string
    formData.append(
      key,
      value instanceof Date ? value.toISOString() : String(value),
    );
  });

  return formData;
}

/**
 * @name truncateString
 * @description Truncates a string to a specified length and adds ellipsis if needed.
 * @param str The string to truncate
 * @param maxLength The maximum length of the string before truncation
 * @returns The truncated string with ellipsis if needed
 */
export function truncateString(str: string, maxLength: number): string {
  if (!str || typeof str !== 'string') return '';
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 1) + '…';
}
