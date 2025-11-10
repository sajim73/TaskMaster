"use client";

import { useCallback, useEffect, useState } from "react";
import { Calendar, CalendarDayButton } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRequireAuth } from "@/hooks/use-require-auth";
import {
  getTasks,
  createTask,
  updateTask,
  type TaskData,
} from "@/lib/api/tasks";
import { Plus } from "lucide-react";
import { TaskDialog, TaskFormValues } from "../tasks/_components/task-dialog";
import { useToast } from "@/hooks/use-toast";
import { parseDateString, isSameDate, formatDateString, getFirstDayOfMonth, getLastDayOfMonth } from "@/lib/date-utils";
import { STATUS_COLORS } from "@/lib/constants";
import { useCategories } from "@/lib/store/categories";
import { PageShell } from "@/components/page-shell";
import type { ClientTask } from "@/lib/types/client";
import {
  TASK_STATUSES,
  TASK_STATUS_LABELS,
  type TaskStatus,
} from "@/lib/types/shared";

export default function CalendarPage() {
  const { isReady, isLoading } = useRequireAuth();
  const { toastSuccess, toastError } = useToast();
  const { categories, loadCategories } = useCategories();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [displayedMonth, setDisplayedMonth] = useState<Date>(new Date());
  const [tasks, setTasks] = useState<ClientTask[]>([]);
  const [allTasks, setAllTasks] = useState<ClientTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [monthJustChanged, setMonthJustChanged] = useState(false);

  // Filter tasks for selected date whenever allTasks or selectedDate changes
  useEffect(() => {
    const filtered = allTasks.filter((task) => {
        if (!task.dueDate) return false;
        const taskDate = parseDateString(task.dueDate);
        if (!taskDate) return false;
        return isSameDate(taskDate, selectedDate);
    });
    setTasks(filtered);
  }, [selectedDate, allTasks]);

  const selectSmartDate = useCallback((month: Date, tasksData: ClientTask[]) => {
    const today = new Date();
    const firstDay = getFirstDayOfMonth(month);

    if (
      today.getMonth() === month.getMonth() &&
      today.getFullYear() === month.getFullYear()
    ) {
      setSelectedDate(today);
      return;
    }

    const tasksInMonth = tasksData.filter((task) => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return (
        taskDate.getMonth() === month.getMonth() &&
        taskDate.getFullYear() === month.getFullYear()
      );
    });

    if (tasksInMonth.length > 0) {
      tasksInMonth.sort(
        (a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime()
      );
      setSelectedDate(new Date(tasksInMonth[0].dueDate!));
      return;
    }

    setSelectedDate(firstDay);
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      // Get first and last day of the currently displayed month
      const monthStart = getFirstDayOfMonth(displayedMonth);
      const monthEnd = getLastDayOfMonth(displayedMonth);

      const tasksResponse = await getTasks({
          startDate: formatDateString(monthStart),
          endDate: formatDateString(monthEnd),
      });

      if (tasksResponse.success) {
        setAllTasks(tasksResponse.tasks);
        
        // After loading tasks, run smart date selection if month was changed via dropdown
        if (monthJustChanged) {
          selectSmartDate(displayedMonth, tasksResponse.tasks);
          setMonthJustChanged(false);
        }
      } else {
        toastError(tasksResponse.error || "Failed to fetch data");
        setAllTasks([]);
      }

    } catch (error) {
      console.error("Failed to fetch data:", error);
      toastError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }, [displayedMonth, monthJustChanged, selectSmartDate, toastError]);

  useEffect(() => {
    if (!isReady) return;
    fetchData();
  }, [fetchData, isReady]);

  useEffect(() => {
    if (!isReady) return;
    loadCategories();
  }, [isReady, loadCategories]);

  // Get task count for a specific date
  const getTaskCountForDate = (date: Date): number => {
           return allTasks.filter((task) => {
             if (!task.dueDate) return false;
             const taskDate = parseDateString(task.dueDate);
             if (!taskDate) return false;
             return isSameDate(taskDate, date);
           }).length;
  };

  const statusBorderColors: Record<TaskStatus, string> = {
    completed: "border-green-500",
    pending: "border-blue-500",
    overdue: "border-red-500",
  };

  async function handleCreateTask(data: TaskFormValues) {
    const payload: TaskData = {
      ...data,
      dueDate: data.dueDate ? data.dueDate : undefined,
    };
    const response = await createTask(payload);
    if (response.success) {
      toastSuccess("Your task has been created successfully", "Task created");
      fetchData();
    } else {
      toastError(response.error || "Failed to create task");
    }
  }

  async function handleStatusChange(taskId: string, newStatus: TaskStatus) {
    const response = await updateTask(taskId, { 
      status: newStatus
    });
    if (response.success) {
      toastSuccess("Task status has been updated", "Status updated");
      fetchData();
    } else {
      toastError(response.error || "Failed to update status");
    }
  }

  if (isLoading) return null;

  return (
    <PageShell
      title="Calendar"
      description="View and manage tasks by date"
      headerClassName="gap-2 md:gap-4"
    >
      <div className="flex flex-col gap-6 md:flex-row md:items-start">
        {/* Calendar */}
        <Card className="md:w-auto">
          <CardContent className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                if (date) {
                  setSelectedDate(date);
                  if (
                    date.getMonth() !== displayedMonth.getMonth() ||
                    date.getFullYear() !== displayedMonth.getFullYear()
                  ) {
                    setDisplayedMonth(date);
                  }
                }
              }}
              month={displayedMonth}
              onMonthChange={(newMonth) => {
                setDisplayedMonth(newMonth);
                setMonthJustChanged(true);
              }}
              captionLayout="dropdown"
              showOutsideDays={false}
              className="rounded-md border [--cell-size:--spacing(13)] md:[--cell-size:--spacing(14)]"
              formatters={{
                formatMonthDropdown: (date) => {
                  return date.toLocaleString("default", { month: "long" });
                },
              }}
              components={{
                DayButton: ({ children, modifiers, day, ...props }) => {
                  const taskCount = getTaskCountForDate(day.date);
                  const isSelected = modifiers.selected;
                  return (
                    <CalendarDayButton 
                      day={day} 
                      modifiers={modifiers} 
                      {...props}
                      className={
                        isSelected
                          ? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                          : ""
                      }
                    >
                      {children}
                      <span
                        className={`text-xs h-4 font-medium ${
                          isSelected ? "text-primary-foreground" : "text-muted-foreground"
                        }`}
                      >
                        {taskCount > 0 ? `${taskCount} ${taskCount === 1 ? "task" : "tasks"}` : " "}
                      </span>
                    </CalendarDayButton>
                  );
                },
              }}
            />
          </CardContent>
        </Card>

        {/* Tasks */}
        <Card className="flex-1 flex flex-col">
          <CardHeader className="flex-shrink-0">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="space-y-1.5">
                <CardTitle>
                  {selectedDate.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </CardTitle>
                {!loading && tasks.length > 0 && (
                  <p className="text-sm text-muted-foreground">
                    {tasks.length} task{tasks.length !== 1 ? "s" : ""}
                  </p>
                )}
              </div>
              <Button onClick={() => setTaskDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-1" />
                Add Task
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto min-h-0">
            {loading ? (
              <div className="text-center py-4 text-muted-foreground">Loading...</div>
            ) : tasks.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                No tasks for this date
              </div>
            ) : (
              <div className="space-y-4 pr-2">
                {tasks.map((task) => (
                  <div
                    key={task._id}
                    className={`border-l-4 pl-4 py-2 ${
                      statusBorderColors[task.status] || "border-gray-500"
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-medium leading-tight">{task.title}</p>
                        <Select
                          value={task.status}
                          onValueChange={(value) =>
                            handleStatusChange(task._id, value as TaskStatus)
                          }
                        >
                          <SelectTrigger
                            className={`h-7 w-[120px] border-0 ${
                              STATUS_COLORS[task.status] || "bg-gray-500/10"
                            }`}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {TASK_STATUSES.map((statusOption) => (
                              <SelectItem key={statusOption} value={statusOption}>
                                {TASK_STATUS_LABELS[statusOption]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      {task.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {task.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {task.category && <span>{task.category}</span>}
                        {task.category && <span>•</span>}
                        <span className="capitalize">{task.priority} priority</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <TaskDialog
        open={taskDialogOpen}
        onOpenChange={setTaskDialogOpen}
        onSubmit={handleCreateTask}
        categories={categories}
        defaultDueDate={selectedDate}
        title="Add Task"
        description="Create a task for the selected date"
      />
    </PageShell>
  );
}

