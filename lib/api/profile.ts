import type { ProfileUpdateResponse } from "@/lib/types/api";

import { apiClient, parseJson } from "./client";

export interface UpdateProfileData {
  name: string;
  email: string;
}

export async function updateProfile(
  data: UpdateProfileData
): Promise<ProfileUpdateResponse> {
  const response = await apiClient("/api/profile", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return parseJson<ProfileUpdateResponse>(response);
}

