import type { TaskStatsResponse } from "@/lib/types/api";

import { apiClient, parseJson } from "./client";

export async function getTaskStats(): Promise<TaskStatsResponse> {
  const response = await apiClient("/api/tasks/stats", {
    method: "GET",
  });
  return parseJson<TaskStatsResponse>(response);
}

