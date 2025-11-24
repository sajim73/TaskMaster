import { ObjectId } from "mongodb";

import type { TaskPriority, TaskStatus } from "@/lib/types/shared";

// User types
export interface User {
  _id?: ObjectId;
  name: string;
  email: string;
  password: string; // Will be hashed
  createdAt: Date;
  updatedAt: Date;
}

// Task types
export interface Task {
  _id?: ObjectId;
  userId: ObjectId;
  title: string;
  description?: string;
  category?: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// Category types
export interface Category {
  _id?: ObjectId;
  userId: ObjectId;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  createdAt: Date;
  updatedAt: Date;
}
