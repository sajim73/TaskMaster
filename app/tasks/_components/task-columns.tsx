"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, ArrowUpDown } from "lucide-react";
import { getCategoryIcon } from "@/lib/category-icons";
import { STATUS_COLORS, PRIORITY_COLORS } from "@/lib/constants";
import { parseDateString } from "@/lib/date-utils";
import type { ClientTask, ClientCategory } from "@/lib/types/client";
import type { TaskPriority, TaskStatus } from "@/lib/types/shared";

export type Task = ClientTask;
export type Category = ClientCategory;

interface TaskColumnsProps {
  categories: Category[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export function getTaskColumns({
  categories,
  onEdit,
  onDelete,
}: TaskColumnsProps): ColumnDef<Task>[] {
  return [
    {
      accessorKey: "title",
      header: ({ column }) => {
        return (
          <div
            className="flex items-center gap-2 cursor-pointer select-none"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <span className="font-medium">Title</span>
            <ArrowUpDown className="h-4 w-4" />
          </div>
        );
      },
      cell: ({ row }) => {
        const title = row.getValue("title") as string;
        return (
          <div className="font-medium max-w-[200px] truncate" title={title}>
            {title}
          </div>
        );
      },
    },
    {
      accessorKey: "description",
      header: () => <span className="font-medium">Description</span>,
      cell: ({ row }) => {
        const description = row.getValue("description") as string;
        return (
          <div className="max-w-[300px] truncate text-muted-foreground" title={description || ""}>
            {description || "-"}
          </div>
        );
      },
    },
    {
      accessorKey: "category",
      header: () => <span className="font-medium">Category</span>,
      cell: ({ row }) => {
        const category = row.getValue("category") as string;
        if (!category) return <span className="text-muted-foreground">-</span>;

        const categoryInfo = categories.find((c) => c.name === category);
        const CategoryIcon = getCategoryIcon(categoryInfo?.icon || "folder");

        return (
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded flex items-center justify-center"
              style={{
                backgroundColor: categoryInfo?.color || "#6366f1",
              }}
            >
              <CategoryIcon className="h-3 w-3 text-white" />
            </div>
            <span>{category}</span>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return value === row.getValue(id);
      },
    },
    {
      accessorKey: "priority",
      header: ({ column }) => {
        return (
          <div
            className="flex items-center gap-2 cursor-pointer select-none"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <span className="font-medium">Priority</span>
            <ArrowUpDown className="h-4 w-4" />
          </div>
        );
      },
      cell: ({ row }) => {
        const priority = row.getValue("priority") as TaskPriority;
        return (
          <Badge
            variant="secondary"
            className={
              PRIORITY_COLORS[priority] ||
              "bg-gray-500/10"
            }
          >
            {priority}
          </Badge>
        );
      },
      filterFn: (row, id, value) => {
        return value === row.getValue(id);
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => {
        return (
          <div
            className="flex items-center gap-2 cursor-pointer select-none"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <span className="font-medium">Status</span>
            <ArrowUpDown className="h-4 w-4" />
          </div>
        );
      },
      cell: ({ row }) => {
        const status = row.getValue("status") as TaskStatus;
        return (
          <Badge
            variant="secondary"
            className={
              STATUS_COLORS[status] ||
              "bg-gray-500/10"
            }
          >
            {status}
          </Badge>
        );
      },
      filterFn: (row, id, value) => {
        return value === row.getValue(id);
      },
    },
    {
      accessorKey: "dueDate",
      header: ({ column }) => {
        return (
          <div
            className="flex items-center gap-2 cursor-pointer select-none"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <span className="font-medium">Due Date</span>
            <ArrowUpDown className="h-4 w-4" />
          </div>
        );
      },
      cell: ({ row }) => {
        const dueDate = row.getValue("dueDate") as string | null;
        const parsedDate = dueDate ? parseDateString(dueDate) : null;
        return parsedDate ? (
          <span>{parsedDate.toLocaleDateString()}</span>
        ) : (
          <span className="text-muted-foreground">-</span>
        );
      },
    },
    {
      id: "actions",
      header: () => <div className="font-medium text-right">Actions</div>,
      cell: ({ row }) => {
        const task = row.original;

        return (
          <div className="flex items-center justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => onEdit(task)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(task._id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];
}

