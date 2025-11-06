import { ObjectId } from "mongodb";

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
  priority: "low" | "medium" | "high";
  status: "pending" | "completed" | "overdue";
  dueDate?: Date;
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

// Settings types
export interface UserSettings {
  _id?: ObjectId;
  userId: ObjectId;
  theme: "light" | "dark" | "system";
  notifications: boolean;
  createdAt: Date;
  updatedAt: Date;
}

