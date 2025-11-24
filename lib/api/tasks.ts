import type {
  TaskDeletionResponse,
  TaskListResponse,
  TaskMutationResponse,
  TaskStatsResponse,
} from "@/lib/types/api";
import type { TaskPriority, TaskStatus } from "@/lib/types/shared";

import { apiClient, parseJson } from "./client";

export interface TaskData {
  title: string;
  description?: string;
  category?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  dueDate?: string;
}

export interface TaskFilters {
  page?: number;
  limit?: number;
  status?: TaskStatus | "";
  category?: string;
  priority?: TaskPriority | "";
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  startDate?: string; // YYYY-MM-DD format
  endDate?: string; // YYYY-MM-DD format
}

export async function getTasks(filters?: TaskFilters): Promise<TaskListResponse> {
  const params = new URLSearchParams();
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });
  }

  const url = `/api/tasks${params.toString() ? `?${params.toString()}` : ""}`;
  const response = await apiClient(url);
  return parseJson<TaskListResponse>(response);
}

export async function getTaskStats(): Promise<TaskStatsResponse> {
  const response = await apiClient("/api/tasks/stats");
  return parseJson<TaskStatsResponse>(response);
}

export async function createTask(data: TaskData): Promise<TaskMutationResponse> {
  const response = await apiClient("/api/tasks", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return parseJson<TaskMutationResponse>(response);
}

export async function updateTask(
  id: string,
  data: Partial<TaskData>
): Promise<TaskMutationResponse> {
  const response = await apiClient(`/api/tasks/${id}`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  return parseJson<TaskMutationResponse>(response);
}

export async function deleteTask(id: string): Promise<TaskDeletionResponse> {
  const response = await apiClient(`/api/tasks/${id}`, {
    method: "DELETE",
  });
  return parseJson<TaskDeletionResponse>(response);
}



