import { ObjectId } from "mongodb";

import type { Category } from "@/lib/types";
import type { CategoryResponse } from "@/lib/types/api";

export function serializeCategory(
  category: Category & { _id?: ObjectId | string | null }
): CategoryResponse {
  return {
    _id: category._id ? category._id.toString() : "",
    userId: category.userId.toString(),
    name: category.name,
    description: category.description ?? "",
    color: category.color ?? "#6366f1",
    icon: category.icon ?? "folder",
    createdAt:
      category.createdAt instanceof Date
        ? category.createdAt.toISOString()
        : new Date(category.createdAt).toISOString(),
    updatedAt:
      category.updatedAt instanceof Date
        ? category.updatedAt.toISOString()
        : new Date(category.updatedAt).toISOString(),
  };
}

