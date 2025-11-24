import { ObjectId } from "mongodb";

import { Task } from "@/lib/types";
import { formatDateStringUTC } from "@/lib/date-utils";
import type { TaskResponse } from "@/lib/types/api";

function toISOString(value: Date | string | undefined | null): string {
  if (!value) {
    return new Date().toISOString();
  }

  const date = value instanceof Date ? value : new Date(value);
  return date.toISOString();
}

export function serializeTask(task: Task & { _id?: ObjectId | string | null }): TaskResponse {
  const dueDateValue = task.dueDate ? new Date(task.dueDate) : null;

  return {
    _id: task._id ? task._id.toString() : "",
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

