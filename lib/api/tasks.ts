import { apiClient } from "./client";

export interface TaskData {
  title: string;
  description?: string;
  category?: string;
  priority?: "low" | "medium" | "high";
  status?: "pending" | "completed" | "overdue";
  dueDate?: string;
}

export interface TaskFilters {
  page?: number;
  limit?: number;
  status?: string;
  category?: string;
  priority?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  startDate?: string; // YYYY-MM-DD format
  endDate?: string;   // YYYY-MM-DD format
}

export async function getTasks(filters?: TaskFilters) {
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
  return response.json();
}

export async function getTaskStats() {
  const response = await apiClient("/api/tasks/stats");
  return response.json();
}

export async function createTask(data: TaskData) {
  const response = await apiClient("/api/tasks", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function updateTask(id: string, data: Partial<TaskData>) {
  const response = await apiClient(`/api/tasks/${id}`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function deleteTask(id: string) {
  const response = await apiClient(`/api/tasks/${id}`, {
    method: "DELETE",
  });
  return response.json();
}



