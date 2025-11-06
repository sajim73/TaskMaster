import { ObjectId } from "mongodb";

import { Task } from "@/lib/types";
import { formatDateStringUTC } from "@/lib/date-utils";

export interface SerializedTask {
  _id?: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "completed" | "overdue";
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

function toISOString(value: Date | string | undefined | null): string {
  if (!value) {
    return new Date().toISOString();
  }

  const date = value instanceof Date ? value : new Date(value);
  return date.toISOString();
}

export function serializeTask(task: Task & { _id?: ObjectId | string | null }): SerializedTask {
  const dueDateValue = task.dueDate ? new Date(task.dueDate) : null;

  return {
    _id: task._id ? task._id.toString() : undefined,
    userId: task.userId.toString(),
    title: task.title,
    description: task.description ?? "",
    category: task.category ?? "",
    priority: task.priority,
    status: task.status,
    dueDate: dueDateValue ? formatDateStringUTC(dueDateValue) : null,
    createdAt: toISOString(task.createdAt),
    updatedAt: toISOString(task.updatedAt),
  };
}

