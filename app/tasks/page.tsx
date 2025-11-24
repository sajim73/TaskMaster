"use client";

import { useCallback, useEffect, useMemo, useState, useDeferredValue } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Download, Printer } from "lucide-react";
import { TaskDialog, TaskFormValues } from "./_components/task-dialog";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  type TaskData,
  type TaskFilters,
} from "@/lib/api/tasks";
import { useToast } from "@/hooks/use-toast";
import { DataTable } from "@/components/data-table/data-table";
import { getTaskColumns, Task } from "./_components/task-columns";
import { ColumnFiltersState, SortingState, PaginationState } from "@tanstack/react-table";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { useCategories } from "@/lib/store/categories";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { PageShell } from "@/components/page-shell";
import { useTaskReport } from "@/hooks/use-task-report";
import {
  TASK_PRIORITIES,
  TASK_STATUSES,
  TASK_PRIORITY_LABELS,
  TASK_STATUS_LABELS,
  type TaskPriority,
  type TaskStatus,
} from "@/lib/types/shared";

const STATUS_FILTER_OPTIONS = TASK_STATUSES.map((status) => ({
  label: TASK_STATUS_LABELS[status],
  value: status,
}));

const PRIORITY_FILTER_OPTIONS = TASK_PRIORITIES.map((priority) => ({
  label: TASK_PRIORITY_LABELS[priority],
  value: priority,
}));

export default function TasksPage() {
  const { toastSuccess, toastError } = useToast();
  const { isReady, isLoading } = useRequireAuth();
  const { categories, loadCategories } = useCategories();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);

  // Table state
  const [pagination, setPagination] = useState<PaginationState>({
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
  const {
    startDate: reportStartDate,
    endDate: reportEndDate,
    setStartDate: setReportStartDate,
    setEndDate: setReportEndDate,
    downloadCsv,
    downloadingCsv,
  } = useTaskReport();

  const handlePrintReport = useCallback(() => {
    if (!reportStartDate || !reportEndDate) {
      toastError("Select both start and end dates");
      return;
    }

    if (new Date(reportStartDate) > new Date(reportEndDate)) {
      toastError("Start date must be before end date");
      return;
    }

    window.open(
      `/tasks/report?start=${reportStartDate}&end=${reportEndDate}`,
      "_blank"
    );
  }, [reportEndDate, reportStartDate, toastError]);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);

      // Build query params
      const filters: TaskFilters = {
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
      };

      // Add sorting
      if (sorting.length > 0) {
        filters.sortBy = sorting[0].id;
        filters.sortOrder = sorting[0].desc ? "desc" : "asc";
      }

      // Add global search
      if (deferredGlobalFilter) {
        filters.search = deferredGlobalFilter;
      }

      // Add column filters
      columnFilters.forEach((filter) => {
        if (!filter.value) return;

        if (filter.id === "status") {
          filters.status = filter.value as TaskStatus;
        } else if (filter.id === "priority") {
          filters.priority = filter.value as TaskPriority;
        } else if (filter.id === "category") {
          filters.category = filter.value as string;
        }
      });

      const response = await getTasks(filters);
      if (response.success) {
        setTasks(response.tasks);
        if ("page" in response.pagination) {
        setTotalPages(response.pagination.totalPages);
        setTotalTasks(response.pagination.total);
        } else {
          setTotalPages(1);
          setTotalTasks(response.pagination.total);
        }
      } else {
        toastError(response.error || "Failed to load tasks");
        setTasks([]);
        setTotalPages(0);
        setTotalTasks(0);
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

  async function handleCreateTask(data: TaskFormValues) {
    try {
      const payload: TaskData = {
        ...data,
        dueDate: data.dueDate ? data.dueDate : undefined,
      };
      const response = await createTask(payload);
      if (response.success) {
        toastSuccess("Task created successfully");
        fetchTasks();
      } else {
        toastError(response.error || "Failed to create task");
      }
    } catch (error) {
      toastError("Failed to create task");
    }
  }

  async function handleUpdateTask(data: TaskFormValues) {
    if (!editingTask) return;

    try {
      const payload: Partial<TaskData> = {
        ...data,
        dueDate: data.dueDate ? data.dueDate : undefined,
      };
      const response = await updateTask(editingTask._id, payload);
      if (response.success) {
        toastSuccess("Task updated successfully");
        fetchTasks();
        setEditingTask(null);
      } else {
        toastError(response.error || "Failed to update task");
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
      } else {
        toastError(response.error || "Failed to delete task");
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
      statuses: STATUS_FILTER_OPTIONS,
      priorities: PRIORITY_FILTER_OPTIONS,
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

      <Card className="border-dashed">
        <CardHeader>
          <CardTitle>Generate Report</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="report-start">Start date</Label>
              <Input
                id="report-start"
                type="date"
                value={reportStartDate}
                onChange={(event) => setReportStartDate(event.target.value)}
                max={reportEndDate || undefined}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="report-end">End date</Label>
              <Input
                id="report-end"
                type="date"
                value={reportEndDate}
                onChange={(event) => setReportEndDate(event.target.value)}
                min={reportStartDate || undefined}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Button
              className="w-full sm:w-auto"
              onClick={downloadCsv}
              disabled={downloadingCsv}
            >
              <Download className="h-4 w-4 mr-2" />
              {downloadingCsv ? "Preparing..." : "Download CSV"}
            </Button>
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={handlePrintReport}
            >
              <Printer className="h-4 w-4 mr-2" />
              Print Report
            </Button>
          </div>
        </CardContent>
      </Card>

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
                title: editingTask.title,
                description: editingTask.description || "",
                category: editingTask.category || "",
                priority: editingTask.priority,
                status: editingTask.status,
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
