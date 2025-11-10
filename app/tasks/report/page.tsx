"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { useToast } from "@/hooks/use-toast";
import { getTasks } from "@/lib/api/tasks";
import { getCategories } from "@/lib/api/categories";
import { CategoryChart } from "@/app/dashboard/_components/category-chart";
import { StatusChart } from "@/app/dashboard/_components/status-chart";
import { StatCard } from "@/app/dashboard/_components/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ListTodo,
  CheckCircle2,
  Clock,
  AlertCircle,
  Printer,
  ArrowLeft,
} from "lucide-react";
import type { Task } from "@/app/tasks/_components/task-columns";
import type { ClientCategory } from "@/lib/types/client";
import type { TaskStatus } from "@/lib/types/shared";
import { TASK_STATUS_LABELS } from "@/lib/types/shared";
import { getCategoryIcon } from "@/lib/category-icons";

function ReportContent() {
  const searchParams = useSearchParams();
  const { toastError } = useToast();
  const { isReady, isLoading } = useRequireAuth();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<ClientCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<{ start: string; end: string }>({ start: "", end: "" });
  const [hasPrinted, setHasPrinted] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!isReady) return;

    const start = searchParams.get("start");
    const end = searchParams.get("end");

    if (!start || !end) {
      setLoadError("Missing date range. Please choose dates from the Tasks page.");
      toastError("Missing date range");
      setLoading(false);
      return;
    }

    if (new Date(start) > new Date(end)) {
      setLoadError("Invalid range. Start date must be before end date.");
      toastError("Invalid date range");
      setLoading(false);
      return;
    }

    setLoadError(null);
    setRange({ start, end });
    setLoading(true);

    Promise.all([
      getTasks({ startDate: start, endDate: end, limit: 1000 }),
      getCategories(),
    ])
      .then(([tasksResponse, categoriesResponse]) => {
        if (!tasksResponse.success) {
          throw new Error(tasksResponse.error || "Failed to load tasks");
        }
        setTasks(tasksResponse.tasks);

        if (categoriesResponse.success) {
          setCategories(categoriesResponse.categories);
        } else {
          setCategories([]);
        }
      })
      .catch((error) => {
        console.error("Failed to load report data:", error);
        setLoadError("Failed to load report data. Please try again.");
        toastError("Failed to load report data");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [isReady, searchParams, toastError]);

  useEffect(() => {
    if (!loading && tasks.length > 0 && !hasPrinted) {
      const timeout = setTimeout(() => {
        window.print();
        setHasPrinted(true);
      }, 500);

      return () => clearTimeout(timeout);
    }
  }, [loading, tasks, hasPrinted]);

  const statusCounts = useMemo(() => {
    const initialCounts: Record<TaskStatus, number> = {
      pending: 0,
      completed: 0,
      overdue: 0,
    };

    return tasks.reduce((acc, task) => {
      acc[task.status] += 1;
        return acc;
    }, initialCounts);
  }, [tasks]);

  const categoryData = useMemo(() => {
    const map = new Map<string, number>();
    tasks.forEach((task) => {
      const key = task.category || "Uncategorized";
      map.set(key, (map.get(key) || 0) + 1);
    });

    return Array.from(map.entries()).map(([category, count]) => ({
      category,
      count,
    }));
  }, [tasks]);

  const categoryMeta = useMemo(() => {
    const lookup = new Map<string, ClientCategory>();
    categories.forEach((category) => {
      lookup.set(category.name, category);
    });
    return lookup;
  }, [categories]);

  const statItems = useMemo(
    () => [
      { title: "Total Tasks", value: tasks.length, icon: ListTodo },
      {
        title: TASK_STATUS_LABELS.completed,
        value: statusCounts.completed,
        icon: CheckCircle2,
      },
      {
        title: TASK_STATUS_LABELS.pending,
        value: statusCounts.pending,
        icon: Clock,
      },
      {
        title: TASK_STATUS_LABELS.overdue,
        value: statusCounts.overdue,
        icon: AlertCircle,
      },
    ],
    [statusCounts, tasks.length]
  );

  const sortedTasks = useMemo(
    () =>
      [...tasks].sort((a, b) => {
        const aDate = a.dueDate ? new Date(a.dueDate).getTime() : 0;
        const bDate = b.dueDate ? new Date(b.dueDate).getTime() : 0;
        return bDate - aDate;
      }),
    [tasks]
  );

  return (
    <div className="min-h-screen bg-background p-6 print:p-8">
      <div className="flex items-center justify-between gap-2 print:hidden">
        <Button variant="outline" onClick={() => window.close()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Close
        </Button>
        <Button onClick={() => window.print()}>
          <Printer className="mr-2 h-4 w-4" />
          Print
        </Button>
      </div>

      <div className="mt-6 space-y-6">
        <div className="space-y-2 text-center print:text-left">
          <h1 className="text-3xl font-bold">TaskMaster Report</h1>
          {range.start && range.end ? (
            <p className="text-muted-foreground">
              {new Date(range.start).toLocaleDateString()} –{" "}
              {new Date(range.end).toLocaleDateString()}
            </p>
          ) : null}
        </div>

        {isLoading || loading ? (
          <div className="py-12 text-center text-muted-foreground">Loading report...</div>
        ) : loadError ? (
          <div className="py-12 text-center text-destructive">{loadError}</div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {statItems.map((item) => (
                <StatCard key={item.title} title={item.title} value={item.value} icon={item.icon} />
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <CategoryChart data={categoryData} categories={categories} />
              <StatusChart
                completed={statusCounts.completed}
                pending={statusCounts.pending}
                overdue={statusCounts.overdue}
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Tasks ({tasks.length})</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted print:bg-muted/20">
                    <tr>
                      <th className="px-4 py-3">Title</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Priority</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Due Date</th>
                      <th className="px-4 py-3">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedTasks.map((task) => (
                      <tr key={task._id} className="border-t break-inside-avoid">
                        <td className="px-4 py-2 align-top font-medium">{task.title}</td>
                        <td className="px-4 py-2 align-top">
                          <div className="flex items-center gap-2">
                            {(() => {
                              const meta = task.category
                                ? categoryMeta.get(task.category)
                                : undefined;
                              const CategoryIcon = getCategoryIcon(
                                meta?.icon || "folder"
                              );
                              const color = meta?.color || "#6366f1";
                              return (
                                <span
                                  className="flex h-6 w-6 items-center justify-center rounded"
                                  style={{ backgroundColor: color }}
                                >
                                  <CategoryIcon className="h-3.5 w-3.5 text-white" />
                                </span>
                              );
                            })()}
                            <span>{task.category || "Uncategorized"}</span>
                          </div>
                        </td>
                        <td className="px-4 py-2 align-top capitalize">{task.priority}</td>
                        <td className="px-4 py-2 align-top capitalize">{task.status}</td>
                        <td className="px-4 py-2 align-top">
                          {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "—"}
                        </td>
                        <td className="px-4 py-2 align-top text-muted-foreground">
                          {task.description || "—"}
                        </td>
                      </tr>
                    ))}
                    {sortedTasks.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                          No tasks in this range.
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}

export default function TasksReportPage() {
  return (
    <Suspense fallback={<div className="min-h-screen p-6">Loading report...</div>}>
      <ReportContent />
    </Suspense>
  );
}

