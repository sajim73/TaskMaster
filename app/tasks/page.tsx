"use client";

import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { TaskDialog } from "./_components/task-dialog";
import { getTasks, createTask, updateTask, deleteTask } from "@/lib/api/tasks";
import { getCategories } from "@/lib/api/categories";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { DataTable } from "@/components/data-table/data-table";
import { getTaskColumns, Task, Category } from "./_components/task-columns";
import { ColumnFiltersState, SortingState } from "@tanstack/react-table";
import { useRequireAuth } from "@/hooks/use-require-auth";

export default function TasksPage() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useRequireAuth();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
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
  const [debouncedGlobalFilter, setDebouncedGlobalFilter] = useState("");

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  // Debounce global filter
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedGlobalFilter(globalFilter);
    }, 500);
    return () => clearTimeout(timer);
  }, [globalFilter]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCategories();
    }
  }, [isAuthenticated]);

  // Fetch tasks when table state changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
    }
  }, [
    isAuthenticated,
    pagination.pageIndex,
    pagination.pageSize,
    sorting,
    columnFilters,
    debouncedGlobalFilter,
  ]);

  async function fetchTasks() {
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
      if (debouncedGlobalFilter) {
        params.search = debouncedGlobalFilter;
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
      toast({
        title: "Error",
        description: "Failed to load tasks",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  async function fetchCategories() {
    try {
      const response = await getCategories();
      if (response.success) {
        setCategories(response.categories);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  }

  async function handleCreateTask(data: any) {
    try {
      const response = await createTask(data);
      if (response.success) {
        toast({ title: "Success", description: "Task created successfully" });
        fetchTasks();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create task",
        variant: "destructive",
      });
    }
  }

  async function handleUpdateTask(data: any) {
    if (!editingTask) return;

    try {
      const response = await updateTask(editingTask._id, data);
      if (response.success) {
        toast({ title: "Success", description: "Task updated successfully" });
        fetchTasks();
        setEditingTask(null);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
    }
  }

  async function handleDeleteTask() {
    if (!taskToDelete) return;

    try {
      const response = await deleteTask(taskToDelete);
      if (response.success) {
        toast({ title: "Success", description: "Task deleted successfully" });
        fetchTasks();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      });
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
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Tasks</h1>
          <p className="text-muted-foreground mt-2">
            Manage and organize your tasks
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>

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
        initialData={editingTask || undefined}
        categories={categories}
        title={editingTask ? "Edit Task" : "Add Task"}
        description={
          editingTask
            ? "Update your task details"
            : "Create a new task to organize your work"
        }
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the task.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTask}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
