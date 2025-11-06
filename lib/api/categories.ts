import { apiClient } from "./client";

export interface CategoryData {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
}

export async function getCategories() {
  const response = await apiClient("/api/categories");
  return response.json();
}

export async function createCategory(data: CategoryData) {
  const response = await apiClient("/api/categories", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function updateCategory(id: string, data: Partial<CategoryData>) {
  const response = await apiClient(`/api/categories/${id}`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function deleteCategory(id: string) {
  const response = await apiClient(`/api/categories/${id}`, {
    method: "DELETE",
  });
  return response.json();
}

