/**
 * Centralized constants for styling and configuration
 */

export const STATUS_COLORS = {
  completed: "bg-green-500/10 text-green-700 dark:text-green-400",
  pending: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  overdue: "bg-red-500/10 text-red-700 dark:text-red-400",
} as const;

export const PRIORITY_COLORS = {
  high: "bg-red-500/10 text-red-700 dark:text-red-400",
  medium: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
  low: "bg-slate-500/10 text-slate-700 dark:text-slate-400",
} as const;

