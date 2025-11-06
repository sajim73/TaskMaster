import { apiClient } from "./client";

export interface UpdateProfileData {
  name: string;
  email: string;
}

export async function updateProfile(data: UpdateProfileData) {
  const response = await apiClient("/api/profile", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return response.json();
}

