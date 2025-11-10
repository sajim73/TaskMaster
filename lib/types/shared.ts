export const TASK_PRIORITIES = ["low", "medium", "high"] as const;
export type TaskPriority = (typeof TASK_PRIORITIES)[number];

export const TASK_STATUSES = ["pending", "completed", "overdue"] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export const TASK_PRIORITY_LABELS = {
  low: "Low",
  medium: "Medium",
  high: "High",
} as const satisfies Record<TaskPriority, string>;

export const TASK_STATUS_LABELS = {
  pending: "Pending",
  completed: "Completed",
  overdue: "Overdue",
} as const satisfies Record<TaskStatus, string>;

export function formatTaskPriority(priority: TaskPriority): string {
  return TASK_PRIORITY_LABELS[priority];
}

export function formatTaskStatus(status: TaskStatus): string {
  return TASK_STATUS_LABELS[status];
}

export type ThemePreference = "light" | "dark" | "system";

