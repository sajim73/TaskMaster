import { apiClient } from "./client";

export async function getTaskStats() {
  const response = await apiClient("/api/tasks/stats", {
    method: "GET",
  });
  return response.json();
}

