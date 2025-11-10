import { useAuthStore } from "@/lib/store/auth";

// Helper for making authenticated API requests
export async function apiClient(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = useAuthStore.getState().token;

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  return fetch(url, {
    ...options,
    headers,
  });
}

export async function parseJson<T>(response: Response): Promise<T> {
  return (await response.json()) as T;
}



