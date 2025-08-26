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
