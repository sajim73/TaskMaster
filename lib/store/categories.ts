import { create } from "zustand";
import { getCategories } from "@/lib/api/categories";
import type { ClientCategory } from "@/lib/types/client";

type LoadOptions = {
  force?: boolean;
};

type CategoryState = {
  categories: ClientCategory[];
  status: "idle" | "loading" | "ready" | "error";
  lastFetchedAt: number | null;
  error?: string;

  loadCategories: (options?: LoadOptions) => Promise<void>;
};

const STALE_TIME_MS = 1000 * 60 * 5; // 5 minutes

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],
  status: "idle",
  lastFetchedAt: null,
  error: undefined,

  loadCategories: async ({ force } = {}) => {
    const { status, lastFetchedAt } = get();

    if (
      !force &&
      status === "ready" &&
      lastFetchedAt &&
      Date.now() - lastFetchedAt < STALE_TIME_MS
    ) {
      return;
    }

    try {
      set({ status: "loading", error: undefined });
      const response = await getCategories();

      if (response.success) {
        set({
          categories: response.categories,
          status: "ready",
          lastFetchedAt: Date.now(),
        });
      } else {
        set({
          status: "error",
          error: response.error || "Failed to load categories",
        });
      }
    } catch (error) {
      console.error("Failed to load categories:", error);
      set({
        status: "error",
        error: "Failed to load categories",
      });
    }
  },
}));

export function useCategories() {
  const categories = useCategoryStore((state) => state.categories);
  const loadCategories = useCategoryStore((state) => state.loadCategories);

  return {
    categories,
    loadCategories,
  };
}

export function useCategoryStatus() {
  return useCategoryStore((state) => state.status);
}

