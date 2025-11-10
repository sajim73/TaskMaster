import type {
  CategoryDeletionResponse,
  CategoryListResponse,
  CategoryMutationResponse,
} from "@/lib/types/api";

import { apiClient, parseJson } from "./client";

export interface CategoryData {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
}

export async function getCategories(): Promise<CategoryListResponse> {
  const response = await apiClient("/api/categories");
  return parseJson<CategoryListResponse>(response);
}

export async function createCategory(
  data: CategoryData
): Promise<CategoryMutationResponse> {
  const response = await apiClient("/api/categories", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return parseJson<CategoryMutationResponse>(response);
}

export async function updateCategory(
  id: string,
  data: Partial<CategoryData>
): Promise<CategoryMutationResponse> {
  const response = await apiClient(`/api/categories/${id}`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  return parseJson<CategoryMutationResponse>(response);
}

export async function deleteCategory(
  id: string
): Promise<CategoryDeletionResponse> {
  const response = await apiClient(`/api/categories/${id}`, {
    method: "DELETE",
  });
  return parseJson<CategoryDeletionResponse>(response);
}

