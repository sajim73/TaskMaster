export type ClientTask = {
  _id: string;
  title: string;
  description?: string;
  category?: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "completed" | "overdue";
  dueDate?: string | null;
};

export type ClientCategory = {
  _id: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
};

