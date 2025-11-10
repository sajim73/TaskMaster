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

export function isTaskPriority(value: unknown): value is TaskPriority {
  return typeof value === "string" && TASK_PRIORITIES.includes(value as TaskPriority);
}

export function isTaskStatus(value: unknown): value is TaskStatus {
  return typeof value === "string" && TASK_STATUSES.includes(value as TaskStatus);
}

export type ThemePreference = "light" | "dark" | "system";

