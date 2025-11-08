"use client";

import { useCallback, useEffect, useMemo, useState, useDeferredValue } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { TaskDialog } from "./_components/task-dialog";
import { getTasks, createTask, updateTask, deleteTask } from "@/lib/api/tasks";
import { useToast } from "@/hooks/use-toast";
import { DataTable } from "@/components/data-table/data-table";
import { getTaskColumns, Task } from "./_components/task-columns";
import { ColumnFiltersState, SortingState } from "@tanstack/react-table";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { useCategories } from "@/lib/store/categories";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { PageShell } from "@/components/page-shell";

export default function TasksPage() {
  const { toastSuccess, toastError } = useToast();
  const { isReady, isLoading } = useRequireAuth();
  const { categories, loadCategories } = useCategories();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);

  // Table state
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const deferredGlobalFilter = useDeferredValue(globalFilter);

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);

      // Build query params
      const params: any = {
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
      };

      // Add sorting
      if (sorting.length > 0) {
        params.sortBy = sorting[0].id;
        params.sortOrder = sorting[0].desc ? "desc" : "asc";
      }

      // Add global search
      if (deferredGlobalFilter) {
        params.search = deferredGlobalFilter;
      }

      // Add column filters
      columnFilters.forEach((filter) => {
        params[filter.id] = filter.value;
      });

      const response = await getTasks(params);
      if (response.success) {
        setTasks(response.tasks);
        setTotalPages(response.pagination.totalPages);
        setTotalTasks(response.pagination.total);
      }
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      toastError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, [
    columnFilters,
    deferredGlobalFilter,
    pagination.pageIndex,
    pagination.pageSize,
    sorting,
    toastError,
  ]);

  useEffect(() => {
    if (!isReady) return;
    loadCategories();
  }, [isReady, loadCategories]);

  useEffect(() => {
    if (!isReady) return;
    fetchTasks();
  }, [fetchTasks, isReady]);

  async function handleCreateTask(data: any) {
    try {
      const response = await createTask(data);
      if (response.success) {
        toastSuccess("Task created successfully");
        fetchTasks();
      }
    } catch (error) {
      toastError("Failed to create task");
    }
  }

  async function handleUpdateTask(data: any) {
    if (!editingTask) return;

    try {
      const response = await updateTask(editingTask._id, data);
      if (response.success) {
        toastSuccess("Task updated successfully");
        fetchTasks();
        setEditingTask(null);
      }
    } catch (error) {
      toastError("Failed to update task");
    }
  }

  async function handleDeleteTask() {
    if (!taskToDelete) return;

    try {
      const response = await deleteTask(taskToDelete);
      if (response.success) {
        toastSuccess("Task deleted successfully");
        fetchTasks();
      }
    } catch (error) {
      toastError("Failed to delete task");
    } finally {
      setDeleteDialogOpen(false);
      setTaskToDelete(null);
    }
  }

  // Memoize columns
  const columns = useMemo(
    () =>
      getTaskColumns({
        categories,
        onEdit: (task) => {
          setEditingTask(task);
          setDialogOpen(true);
        },
        onDelete: (taskId) => {
          setTaskToDelete(taskId);
          setDeleteDialogOpen(true);
        },
      }),
    [categories]
  );

  // Prepare filter options
  const filterOptions = useMemo(
    () => ({
      statuses: [
        { label: "Pending", value: "pending" },
        { label: "Completed", value: "completed" },
        { label: "Overdue", value: "overdue" },
      ],
      priorities: [
        { label: "Low", value: "low" },
        { label: "Medium", value: "medium" },
        { label: "High", value: "high" },
      ],
      categories: categories.map((cat) => ({
        label: cat.name,
        value: cat.name,
      })),
    }),
    [categories]
  );

  if (isLoading) return null;

  return (
    <PageShell
      title="Tasks"
      description="Manage and organize your tasks"
      headerActions={
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      }
    >
      <DataTable
        columns={columns}
        data={tasks}
        pageCount={totalPages}
        pagination={pagination}
        onPaginationChange={setPagination}
        sorting={sorting}
        onSortingChange={setSorting}
        columnFilters={columnFilters}
        onColumnFiltersChange={setColumnFilters}
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
        filterOptions={filterOptions}
        loading={loading}
        totalCount={totalTasks}
      />

      <TaskDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditingTask(null);
        }}
        onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
        initialData={
          editingTask
            ? {
                ...editingTask,
                dueDate: editingTask.dueDate ?? undefined,
              }
            : undefined
        }
        categories={categories}
        title={editingTask ? "Edit Task" : "Add Task"}
        description={
          editingTask
            ? "Update your task details"
            : "Create a new task to organize your work"
        }
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete task?"
        description="This action cannot be undone. This will permanently delete the task."
        confirmLabel="Delete"
        tone="destructive"
        onConfirm={handleDeleteTask}
      />
    </PageShell>
  );
}
