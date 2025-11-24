import type { TaskPriority, TaskStatus } from "@/lib/types/shared";

export interface ApiErrorResponse {
  success?: false;
  error: string;
}

export interface TaskResponse {
  _id: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export type TaskListPagination =
  | {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    }
  | {
      total: number;
    };

export interface TaskListSuccessResponse {
  success: true;
  tasks: TaskResponse[];
  pagination: TaskListPagination;
}

export type TaskListResponse = TaskListSuccessResponse | ApiErrorResponse;

export interface TaskMutationSuccessResponse {
  success: true;
  task: TaskResponse;
}

export type TaskMutationResponse = TaskMutationSuccessResponse | ApiErrorResponse;

export interface TaskDeletionSuccessResponse {
  success: true;
  message: string;
}

export type TaskDeletionResponse = TaskDeletionSuccessResponse | ApiErrorResponse;

export interface TaskStatsSummary {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  byCategory: {
    category: string;
    count: number;
  }[];
  byPriority: {
    priority: TaskPriority;
    count: number;
  }[];
}

export interface TaskRecentActivityItem {
  _id: string;
  title: string;
  description: string;
  status: TaskStatus;
  category: string;
  updatedAt: string;
}

export interface TaskStatsSuccessResponse {
  success: true;
  stats: TaskStatsSummary;
  recentActivity: TaskRecentActivityItem[];
}

export type TaskStatsResponse = TaskStatsSuccessResponse | ApiErrorResponse;

export interface CategoryResponse {
  _id: string;
  userId: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryListSuccessResponse {
  success: true;
  categories: CategoryResponse[];
}

export type CategoryListResponse = CategoryListSuccessResponse | ApiErrorResponse;

export interface CategoryMutationSuccessResponse {
  success: true;
  category: CategoryResponse;
}

export type CategoryMutationResponse =
  | CategoryMutationSuccessResponse
  | ApiErrorResponse;

export interface CategoryDeletionSuccessResponse {
  success: true;
  message: string;
}

export type CategoryDeletionResponse =
  | CategoryDeletionSuccessResponse
  | ApiErrorResponse;

export interface UserProfile {
  id: string;
  name: string;
  email: string;
}

export interface ProfileUpdateSuccessResponse {
  success: true;
  user: UserProfile;
}

export type ProfileUpdateResponse =
  | ProfileUpdateSuccessResponse
  | ApiErrorResponse;

