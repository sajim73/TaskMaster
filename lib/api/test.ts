import { apiClient } from "./client";

export async function resetDemoData() {
  const response = await apiClient("/api/test/reset-demo", {
    method: "POST",
  });
  return response.json();
}

