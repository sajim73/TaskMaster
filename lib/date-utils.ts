/**
 * Date utility functions for handling timezone-aware date operations
 * 
 * MongoDB stores all dates as UTC. For date-only fields (like dueDate),
 * we need to ensure dates are parsed in the user's local timezone.
 */

/**
 * Parse a date string (YYYY-MM-DD) as local timezone, not UTC
 * This ensures "2024-11-05" is treated as Nov 5 in the user's timezone
 * 
 * @param dateStr - Date string in YYYY-MM-DD format
 * @returns Date object at midnight in local timezone, or null if invalid
 */
export function parseDateString(dateStr: string): Date | null {
  if (!dateStr) return null;
  
  // Split the date string
  const parts = dateStr.split('-');
  if (parts.length !== 3) return null;
  
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // Months are 0-indexed
  const day = parseInt(parts[2], 10);
  
  // Create date at midnight in LOCAL timezone (not UTC)
  const date = new Date(year, month, day, 0, 0, 0, 0);
  
  // Validate the date is valid
  if (isNaN(date.getTime())) return null;
  
  return date;
}

/**
 * Format a Date object to YYYY-MM-DD string in local timezone
 * 
 * @param date - Date object
 * @returns Date string in YYYY-MM-DD format
 */
export function formatDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Format a Date object to YYYY-MM-DD string using UTC components.
 * Useful when storing dates as midnight local times that may shift when converted to UTC.
 */
export function formatDateStringUTC(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Compare two dates by date only (ignoring time)
 * 
 * @param date1 - First date
 * @param date2 - Second date
 * @returns true if both dates represent the same calendar day
 */
export function isSameDate(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * Get the start of day (midnight) for a given date in local timezone
 * 
 * @param date - Date object
 * @returns New Date object at midnight
 */
export function getStartOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
}

/**
 * Get the first day of the month for a given date
 * 
 * @param date - Date object
 * @returns Date object at the first day of the month
 */
export function getFirstDayOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
}

/**
 * Get the last day of the month for a given date
 * 
 * @param date - Date object
 * @returns Date object at the last day of the month
 */
export function getLastDayOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
}

